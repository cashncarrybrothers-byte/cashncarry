/**
 * Migrate Products from OpenCart to WooCommerce
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProduct, testConnection } from './woocommerce-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// OpenCart image base URL
const OC_IMAGE_BASE = 'https://cashncarry.se/image/';

/**
 * Convert OpenCart product to WooCommerce format
 */
function convertProduct(ocProduct, categoryIdMap) {
    // Get WooCommerce category IDs
    const wcCategoryIds = (ocProduct.category_ids || [])
        .map(id => categoryIdMap[String(id)])
        .filter(id => id);

    // Build image array
    const images = [];
    if (ocProduct.image) {
        images.push({ src: OC_IMAGE_BASE + ocProduct.image });
    }
    if (ocProduct.additional_images) {
        ocProduct.additional_images.forEach(img => {
            images.push({ src: OC_IMAGE_BASE + img });
        });
    }

    // Determine stock status
    const quantity = parseInt(ocProduct.quantity) || 0;
    const stockStatus = quantity > 0 ? 'instock' : 'outofstock';

    // Build WooCommerce product
    return {
        name: ocProduct.name || `Product ${ocProduct.product_id}`,
        slug: ocProduct.seo_url || undefined,
        type: 'simple',
        status: parseInt(ocProduct.status) === 1 ? 'publish' : 'draft',
        description: ocProduct.description || '',
        short_description: '',
        sku: ocProduct.sku || ocProduct.model || `OC-${ocProduct.product_id}`,
        regular_price: String(ocProduct.price || '0'),
        sale_price: ocProduct.special ? String(ocProduct.special) : '',
        manage_stock: true,
        stock_quantity: quantity,
        stock_status: stockStatus,
        weight: ocProduct.weight || '',
        categories: wcCategoryIds.map(id => ({ id })),
        images: images,
        meta_data: [
            { key: '_opencart_product_id', value: ocProduct.product_id },
            { key: '_opencart_model', value: ocProduct.model || '' }
        ]
    };
}

/**
 * Migrate all products to WooCommerce
 */
async function migrateProducts() {
    console.log('🔗 Testing WooCommerce connection...');
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot proceed without WooCommerce connection');
        process.exit(1);
    }

    console.log('\n📦 Loading parsed products...');
    const products = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'products.json'), 'utf-8')
    );
    console.log(`   Found ${products.length} products to migrate`);

    console.log('\n📁 Loading category ID mapping...');
    let categoryIdMap = {};
    try {
        categoryIdMap = JSON.parse(
            readFileSync(join(OUTPUT_DIR, 'category-id-map.json'), 'utf-8')
        );
        console.log(`   Loaded ${Object.keys(categoryIdMap).length} category mappings`);
    } catch (e) {
        console.log('   ⚠️ No category mapping found, products will have no categories');
    }

    console.log('\n📤 Migrating products to WooCommerce...\n');

    let created = 0;
    let failed = 0;
    const failedProducts = [];

    for (let i = 0; i < products.length; i++) {
        const ocProduct = products[i];
        const wcProduct = convertProduct(ocProduct, categoryIdMap);

        try {
            const result = await createProduct(wcProduct);
            created++;
            console.log(`   [${i + 1}/${products.length}] ✅ ${wcProduct.name} (WC:${result.id})`);
        } catch (error) {
            failed++;
            failedProducts.push({ product: wcProduct, error: error.message });
            console.log(`   [${i + 1}/${products.length}] ❌ ${wcProduct.name}`);
        }

        // Delay to avoid rate limiting (200ms between requests)
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n📊 Migration complete: ${created} created, ${failed} failed`);

    if (failedProducts.length > 0) {
        const fs = await import('fs');
        fs.writeFileSync(
            join(OUTPUT_DIR, 'failed-products.json'),
            JSON.stringify(failedProducts, null, 2)
        );
        console.log('💾 Failed products saved to output/failed-products.json');
    }
}

migrateProducts().catch(console.error);

export { migrateProducts, convertProduct };
