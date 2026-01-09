/**
 * Migrate Manufacturers from OpenCart to WooCommerce Product Brands
 * WooCommerce uses 'product_brand' taxonomy for brands
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import WooCommerce from './woocommerce-client.js';
import { testConnection } from './woocommerce-client.js';
import { parseInsertStatements } from './parse-sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');
const SQL_PATH = join(__dirname, '..', '2026-01-05_21-01-23.sql');

// OpenCart image base URL
const OC_IMAGE_BASE = 'https://cashncarry.se/image/';

// Map OpenCart manufacturer IDs to WooCommerce brand IDs
const brandIdMap = new Map();

/**
 * Extract manufacturers from SQL dump
 */
function extractManufacturers() {
    console.log('📂 Reading SQL dump for manufacturers...');
    const sqlContent = readFileSync(SQL_PATH, 'utf-8');

    const manufacturers = parseInsertStatements(sqlContent, 'oc_manufacturer');
    console.log(`   Found ${manufacturers.length} manufacturers/brands`);

    return manufacturers;
}

/**
 * Create a brand in WooCommerce using REST API
 * WooCommerce product brands use 'product_brand' taxonomy
 */
async function createBrand(brandData) {
    try {
        // Use WordPress REST API for custom taxonomy
        const response = await WooCommerce.post('products/brands', brandData);
        return response.data;
    } catch (error) {
        // If product brands endpoint doesn't exist, try alternative
        if (error.response?.status === 404) {
            console.log('   ⚠️ Product brands endpoint not found, trying taxonomy API...');
            // Try using term creation via products endpoint workaround
            throw new Error('Product Brands plugin may not be installed or REST API not available');
        }
        throw error;
    }
}

/**
 * Migrate all manufacturers to WooCommerce as product brands
 */
async function migrateBrands() {
    console.log('🔗 Testing WooCommerce connection...');
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot proceed without WooCommerce connection');
        process.exit(1);
    }

    // Extract manufacturers from SQL
    const manufacturers = extractManufacturers();

    if (manufacturers.length === 0) {
        console.log('⚠️ No manufacturers found in SQL dump');
        return;
    }

    // Save manufacturers data
    writeFileSync(
        join(OUTPUT_DIR, 'manufacturers.json'),
        JSON.stringify(manufacturers, null, 2)
    );
    console.log('💾 Saved manufacturers.json\n');

    console.log('📤 Migrating brands to WooCommerce...\n');

    let created = 0;
    let failed = 0;
    const failedBrands = [];

    for (let i = 0; i < manufacturers.length; i++) {
        const mfr = manufacturers[i];

        const brandData = {
            name: mfr.name || `Brand ${mfr.manufacturer_id}`,
            slug: mfr.name ? mfr.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined,
            description: '',
        };

        // Note: Brand image needs to be handled separately via media upload

        try {
            const wcBrand = await createBrand(brandData);
            brandIdMap.set(String(mfr.manufacturer_id), wcBrand.id);
            created++;
            console.log(`   [${i + 1}/${manufacturers.length}] ✅ ${brandData.name} (OC:${mfr.manufacturer_id} → WC:${wcBrand.id})`);
        } catch (error) {
            failed++;
            failedBrands.push({ brand: brandData, ocId: mfr.manufacturer_id, error: error.message });
            console.log(`   [${i + 1}/${manufacturers.length}] ❌ ${brandData.name} - ${error.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 150));
    }

    console.log(`\n📊 Migration complete: ${created} created, ${failed} failed`);

    // Save brand ID mapping
    const mappingJson = Object.fromEntries(brandIdMap);
    writeFileSync(
        join(OUTPUT_DIR, 'brand-id-map.json'),
        JSON.stringify(mappingJson, null, 2)
    );
    console.log('💾 Brand ID mapping saved to output/brand-id-map.json');

    if (failedBrands.length > 0) {
        writeFileSync(
            join(OUTPUT_DIR, 'failed-brands.json'),
            JSON.stringify(failedBrands, null, 2)
        );
        console.log('💾 Failed brands saved to output/failed-brands.json');
    }

    return brandIdMap;
}

/**
 * Update existing products with their brand
 */
async function updateProductBrands() {
    console.log('\n📦 Loading products and brand mappings...');

    const products = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'products.json'), 'utf-8')
    );

    let brandIdMap;
    try {
        brandIdMap = JSON.parse(
            readFileSync(join(OUTPUT_DIR, 'brand-id-map.json'), 'utf-8')
        );
    } catch (e) {
        console.log('⚠️ No brand ID mapping found. Run migrateBrands first.');
        return;
    }

    console.log(`   Found ${products.length} products`);
    console.log(`   Found ${Object.keys(brandIdMap).length} brand mappings`);

    // Group products by manufacturer
    const productsByMfr = {};
    for (const product of products) {
        const mfrId = product.manufacturer_id;
        if (mfrId && mfrId !== '0') {
            if (!productsByMfr[mfrId]) {
                productsByMfr[mfrId] = [];
            }
            productsByMfr[mfrId].push(product);
        }
    }

    console.log(`\n📤 Updating products with brands...`);
    console.log(`   (This would update products via WooCommerce API with brand assignments)\n`);

    // For now, just output the mapping
    const productBrandMapping = [];
    for (const [mfrId, prods] of Object.entries(productsByMfr)) {
        const wcBrandId = brandIdMap[mfrId];
        for (const prod of prods) {
            productBrandMapping.push({
                opencart_product_id: prod.product_id,
                product_name: prod.name,
                opencart_manufacturer_id: mfrId,
                woocommerce_brand_id: wcBrandId || null
            });
        }
    }

    writeFileSync(
        join(OUTPUT_DIR, 'product-brand-mapping.json'),
        JSON.stringify(productBrandMapping, null, 2)
    );
    console.log(`💾 Product-brand mapping saved (${productBrandMapping.length} products have brands)`);
}

// Main execution
async function main() {
    await migrateBrands();
    await updateProductBrands();
}

main().catch(console.error);

export { migrateBrands, updateProductBrands, extractManufacturers };
