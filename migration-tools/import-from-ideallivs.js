/**
 * Import Products from IdealLivs WooCommerce Store
 * 
 * Features:
 * - Fetches products via REST API including variations
 * - Excludes products already in cashncarryproducts.csv (by title matching)
 * - Generates SEO-friendly slugs
 * - Creates category and brand mapping files for manual review
 * - Imports in batches for easy categorization
 */

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// ============================================================
// CONFIGURATION
// ============================================================

// Source store (IdealLivs)
const SOURCE_API = new WooCommerceRestApi.default({
    url: 'https://crm.ideallivs.com',
    consumerKey: 'ck_8bbf76fccb050b9cd95b30a9bbd883d88f5e5911',
    consumerSecret: 'cs_f7b76ad7752db66cf084cedb2797273229bce279',
    version: 'wc/v3',
    timeout: 60000,
});

// Destination store (Cash N Carry) - uses existing .env config
import { createProduct, testConnection } from './woocommerce-client.js';

// Words to remove from slugs
const SLUG_SKIP_WORDS = [
    'ideal', 'indiska', 'livs', 'ideal indiska livs',
    'premium', 'quality', 'product', 'best', 'original'
];

// Batch size for import
const BATCH_SIZE = 50;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Normalize product title for comparison
 */
function normalizeTitle(title) {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
}

/**
 * Generate SEO-friendly slug from product title
 */
function generateSeoSlug(title) {
    if (!title) return '';

    let slug = title.toLowerCase();

    // Remove skip words
    SLUG_SKIP_WORDS.forEach(word => {
        slug = slug.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    });

    // Clean up the slug
    slug = slug
        .replace(/[^\w\s-]/g, '')    // Remove special characters
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/-+/g, '-')         // Remove multiple hyphens
        .replace(/^-|-$/g, '')       // Trim hyphens from ends
        .substring(0, 60);           // Limit length for SEO

    return slug;
}

/**
 * Parse weight from string (e.g., "350 g" -> "0.35")
 */
function parseWeight(weightStr) {
    if (!weightStr) return '';

    const match = weightStr.match(/^([\d.]+)\s*(g|kg|ml|l)?$/i);
    if (!match) return '';

    let value = parseFloat(match[1]);
    const unit = (match[2] || 'g').toLowerCase();

    // Convert to kg
    if (unit === 'g' || unit === 'ml') {
        value = value / 1000;
    }

    return value.toFixed(3);
}

/**
 * Load existing products from CSV
 */
function loadExistingProducts() {
    const csvPath = join(__dirname, '..', 'cashncarryproducts.csv');

    if (!existsSync(csvPath)) {
        console.log('⚠️ cashncarryproducts.csv not found, will import all products');
        return new Set();
    }

    const csvContent = readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
    });

    const titles = new Set();
    records.forEach(record => {
        if (record.Name) {
            titles.add(normalizeTitle(record.Name));
        }
    });

    console.log(`📋 Loaded ${titles.size} existing product titles from CSV`);
    return titles;
}

// ============================================================
// FETCH PRODUCTS FROM SOURCE
// ============================================================

/**
 * Fetch all products from source store
 */
async function fetchSourceProducts() {
    console.log('🔄 Fetching products from IdealLivs...');

    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        try {
            const response = await SOURCE_API.get('products', {
                per_page: 100,
                page: page,
                status: 'publish',
            });

            const products = response.data;
            allProducts = allProducts.concat(products);

            console.log(`   Page ${page}: ${products.length} products (Total: ${allProducts.length})`);

            hasMore = products.length === 100;
            page++;

            // Rate limiting
            await new Promise(r => setTimeout(r, 300));

        } catch (error) {
            console.error(`   ❌ Error on page ${page}:`, error.message);
            hasMore = false;
        }
    }

    return allProducts;
}

/**
 * Fetch variations for a variable product
 */
async function fetchVariations(productId) {
    try {
        const response = await SOURCE_API.get(`products/${productId}/variations`, {
            per_page: 100,
        });
        return response.data;
    } catch (error) {
        console.error(`   ⚠️ Failed to fetch variations for product ${productId}:`, error.message);
        return [];
    }
}

// ============================================================
// DATA EXTRACTION
// ============================================================

/**
 * Extract unique categories from products
 */
function extractCategories(products) {
    const categories = new Map();

    products.forEach(product => {
        (product.categories || []).forEach(cat => {
            if (!categories.has(cat.id)) {
                categories.set(cat.id, {
                    source_id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    target_id: null, // To be filled manually
                });
            }
        });
    });

    return Array.from(categories.values());
}

/**
 * Extract unique brands from products
 */
function extractBrands(products) {
    const brands = new Map();

    products.forEach(product => {
        // Check for brands in meta_data or attributes
        const brandMeta = (product.meta_data || []).find(m =>
            m.key === '_brand' || m.key === 'brand'
        );

        if (brandMeta && brandMeta.value) {
            const brandName = brandMeta.value;
            if (!brands.has(brandName)) {
                brands.set(brandName, {
                    name: brandName,
                    slug: generateSeoSlug(brandName),
                    target_id: null, // To be filled manually
                });
            }
        }

        // Also check brands array if available
        (product.brands || []).forEach(brand => {
            if (!brands.has(brand.name)) {
                brands.set(brand.name, {
                    source_id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    target_id: null,
                });
            }
        });
    });

    return Array.from(brands.values());
}

// ============================================================
// PRODUCT CONVERSION
// ============================================================

/**
 * Convert source product to destination format
 */
function convertProduct(sourceProduct, variations = []) {
    const seoSlug = generateSeoSlug(sourceProduct.name);

    // Build images array
    const images = (sourceProduct.images || []).map(img => ({
        src: img.src,
        alt: sourceProduct.name,
    }));

    // Parse weight
    const weight = parseWeight(sourceProduct.weight);

    // Base product data
    const wcProduct = {
        name: sourceProduct.name,
        slug: seoSlug,
        type: sourceProduct.type || 'simple',
        status: 'draft', // Import as draft for review
        description: sourceProduct.description || '',
        short_description: sourceProduct.short_description || '',
        sku: sourceProduct.sku || '',
        regular_price: sourceProduct.regular_price || '',
        sale_price: sourceProduct.sale_price || '',
        manage_stock: sourceProduct.manage_stock || false,
        stock_quantity: sourceProduct.stock_quantity || null,
        stock_status: sourceProduct.stock_status || 'instock',
        weight: weight,
        images: images,
        categories: [], // Will be mapped later
        brands: [],     // Will be mapped later
        attributes: sourceProduct.attributes || [],
        meta_data: [
            { key: '_source_store', value: 'ideallivs' },
            { key: '_source_product_id', value: String(sourceProduct.id) },
            { key: '_source_sku', value: sourceProduct.sku || '' },
        ],
    };

    // Add GTIN if available
    const gtinMeta = (sourceProduct.meta_data || []).find(m =>
        ['_gtin', 'gtin', '_ean', 'ean', '_upc', 'upc', '_barcode'].includes(m.key)
    );
    if (gtinMeta && gtinMeta.value) {
        wcProduct.meta_data.push({ key: '_gtin', value: gtinMeta.value });
    }

    // Handle variations
    if (sourceProduct.type === 'variable' && variations.length > 0) {
        wcProduct.variations = variations.map(v => ({
            sku: v.sku || '',
            regular_price: v.regular_price || '',
            sale_price: v.sale_price || '',
            stock_quantity: v.stock_quantity,
            stock_status: v.stock_status || 'instock',
            weight: parseWeight(v.weight),
            attributes: v.attributes || [],
            image: v.image ? { src: v.image.src } : null,
        }));
    }

    return wcProduct;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   IdealLivs → Cash N Carry Product Importer');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Step 1: Load existing products
    console.log('📂 Step 1: Loading existing products...');
    const existingTitles = loadExistingProducts();

    // Step 2: Fetch source products
    console.log('\n📥 Step 2: Fetching products from IdealLivs...');
    const sourceProducts = await fetchSourceProducts();
    console.log(`   Total products fetched: ${sourceProducts.length}`);

    // Step 3: Filter out existing products
    console.log('\n🔍 Step 3: Filtering out existing products...');
    const newProducts = sourceProducts.filter(product => {
        const normalized = normalizeTitle(product.name);
        return !existingTitles.has(normalized);
    });
    console.log(`   New products to import: ${newProducts.length}`);
    console.log(`   Skipped (already exist): ${sourceProducts.length - newProducts.length}`);

    // Step 4: Extract and save categories
    console.log('\n📁 Step 4: Extracting categories...');
    const categories = extractCategories(newProducts);
    const categoryMapPath = join(OUTPUT_DIR, 'ideallivs-category-map.json');
    writeFileSync(categoryMapPath, JSON.stringify(categories, null, 2));
    console.log(`   Found ${categories.length} unique categories`);
    console.log(`   Saved to: ${categoryMapPath}`);

    // Step 5: Extract and save brands
    console.log('\n🏷️ Step 5: Extracting brands...');
    const brands = extractBrands(newProducts);
    const brandMapPath = join(OUTPUT_DIR, 'ideallivs-brand-map.json');
    writeFileSync(brandMapPath, JSON.stringify(brands, null, 2));
    console.log(`   Found ${brands.length} unique brands`);
    console.log(`   Saved to: ${brandMapPath}`);

    // Step 6: Convert products
    console.log('\n🔄 Step 6: Converting products...');
    const convertedProducts = [];

    for (let i = 0; i < newProducts.length; i++) {
        const product = newProducts[i];

        // Fetch variations if variable product
        let variations = [];
        if (product.type === 'variable') {
            console.log(`   [${i + 1}/${newProducts.length}] Fetching variations for: ${product.name}`);
            variations = await fetchVariations(product.id);
            await new Promise(r => setTimeout(r, 200)); // Rate limit
        }

        const converted = convertProduct(product, variations);
        convertedProducts.push(converted);

        if ((i + 1) % 50 === 0) {
            console.log(`   Converted ${i + 1}/${newProducts.length} products...`);
        }
    }

    // Step 7: Save converted products
    console.log('\n💾 Step 7: Saving converted products...');
    const productsPath = join(OUTPUT_DIR, 'ideallivs-products-to-import.json');
    writeFileSync(productsPath, JSON.stringify(convertedProducts, null, 2));
    console.log(`   Saved ${convertedProducts.length} products to: ${productsPath}`);

    // Step 8: Create batch files
    console.log('\n📦 Step 8: Creating batch files...');
    const batches = [];
    for (let i = 0; i < convertedProducts.length; i += BATCH_SIZE) {
        const batch = convertedProducts.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const batchPath = join(OUTPUT_DIR, `ideallivs-batch-${batchNum}.json`);
        writeFileSync(batchPath, JSON.stringify(batch, null, 2));
        batches.push({ batch: batchNum, count: batch.length, path: batchPath });
    }
    console.log(`   Created ${batches.length} batch files`);

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   📊 Total products from IdealLivs: ${sourceProducts.length}`);
    console.log(`   ⏭️ Skipped (already exist): ${sourceProducts.length - newProducts.length}`);
    console.log(`   ✅ Ready to import: ${convertedProducts.length}`);
    console.log(`   📦 Batch files created: ${batches.length}`);
    console.log(`   📁 Categories to map: ${categories.length}`);
    console.log(`   🏷️ Brands to map: ${brands.length}`);
    console.log('\n📋 Next Steps:');
    console.log('   1. Review ideallivs-category-map.json and add target_id mappings');
    console.log('   2. Review ideallivs-brand-map.json and add target_id mappings');
    console.log('   3. Run: node import-batch.js <batch-number> to import a batch');
    console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);

export { fetchSourceProducts, convertProduct, generateSeoSlug, normalizeTitle };
