/**
 * Fix Product Names - Replace "Product XXX" with actual names from OpenCart data
 * Finds products with placeholder names and updates them with correct names
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const OUTPUT_DIR = join(__dirname, 'output');

// WordPress/WooCommerce credentials
const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

// Create Basic Auth header
const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

/**
 * Get all WooCommerce Products
 */
async function getWcProducts() {
    let products = [];
    let page = 1;

    while (true) {
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`, {
                headers: {
                    'Authorization': `Basic ${base64Auth}`
                }
            });

            if (!response.ok) break;

            const data = await response.json();
            if (data.length === 0) break;

            products = products.concat(data);
            console.log(`   Fetched page ${page}: ${data.length} products`);
            page++;
        } catch (error) {
            console.log(`Error fetching products: ${error.message}`);
            break;
        }
    }

    return products;
}

/**
 * Update a product's name
 */
async function updateProductName(productId, newName, slug) {
    try {
        const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Auth}`
            },
            body: JSON.stringify({
                name: newName,
                slug: slug
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🔄 Starting Product Name Fix...\n');

    // Load OpenCart products data
    console.log('📂 Loading OpenCart products data...');
    const ocProducts = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'products.json'), 'utf-8')
    );
    console.log(`   Found ${ocProducts.length} OpenCart products\n`);

    // Create a map of OpenCart product ID to product data
    const ocProductMap = {};
    for (const product of ocProducts) {
        ocProductMap[product.product_id] = product;
    }

    // Fetch WooCommerce products
    console.log('🔗 Fetching WooCommerce products...');
    const wcProducts = await getWcProducts();
    console.log(`   Found ${wcProducts.length} WooCommerce products\n`);

    // Find products with placeholder names (Product XXX pattern)
    const placeholderPattern = /^Product\s+\d+$/i;
    const productsToFix = [];

    for (const wcProduct of wcProducts) {
        if (placeholderPattern.test(wcProduct.name)) {
            // Try to find OpenCart product ID from metadata
            const ocIdMeta = wcProduct.meta_data?.find(m => m.key === '_opencart_product_id');
            if (ocIdMeta && ocProductMap[ocIdMeta.value]) {
                const ocProduct = ocProductMap[ocIdMeta.value];
                productsToFix.push({
                    wcId: wcProduct.id,
                    wcName: wcProduct.name,
                    ocId: ocIdMeta.value,
                    ocName: ocProduct.name,
                    ocModel: ocProduct.model
                });
            }
        }
    }

    console.log(`📋 Found ${productsToFix.length} products with placeholder names\n`);

    if (productsToFix.length === 0) {
        console.log('✅ No products need fixing!');
        return;
    }

    // Show what will be updated
    console.log('Products to fix:');
    for (const product of productsToFix.slice(0, 10)) {
        console.log(`   ${product.wcName} → ${product.ocName}`);
    }
    if (productsToFix.length > 10) {
        console.log(`   ... and ${productsToFix.length - 10} more\n`);
    }

    // Save the list for review
    writeFileSync(
        join(OUTPUT_DIR, 'products-to-fix.json'),
        JSON.stringify(productsToFix, null, 2)
    );
    console.log('\n💾 Saved list to output/products-to-fix.json\n');

    console.log('📤 Updating products...\n');

    let updated = 0;
    let failed = 0;
    const failedUpdates = [];

    for (let i = 0; i < productsToFix.length; i++) {
        const product = productsToFix[i];

        try {
            // Use the actual name from OpenCart
            const newName = product.ocName || product.ocModel || `Product ${product.ocId}`;
            const newSlug = newName.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            await updateProductName(product.wcId, newName, newSlug);
            updated++;
            console.log(`   [${i + 1}/${productsToFix.length}] ✅ ${product.wcName} → ${newName}`);
        } catch (error) {
            failed++;
            failedUpdates.push({
                product: product.wcName,
                wcId: product.wcId,
                error: error.message
            });
            console.log(`   [${i + 1}/${productsToFix.length}] ❌ ${product.wcName} - ${error.message}`);
        }

        // Rate limiting delay
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n📊 Complete:`);
    console.log(`   ${updated} products updated`);
    console.log(`   ${failed} failed`);

    if (failedUpdates.length > 0) {
        writeFileSync(
            join(OUTPUT_DIR, 'failed-product-name-updates.json'),
            JSON.stringify(failedUpdates, null, 2)
        );
        console.log(`\n💾 Failed updates saved to output/failed-product-name-updates.json`);
    }
}

main().catch(console.error);
