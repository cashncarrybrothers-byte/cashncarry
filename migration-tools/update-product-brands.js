/**
 * Update Products with Brands using WordPress REST API
 * Uses Application Password authentication for custom taxonomy access
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const OUTPUT_DIR = join(__dirname, 'output');

// WordPress REST API configuration
const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

// Create Basic Auth header
const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

/**
 * Update a product's brand using WordPress REST API
 */
async function updateProductBrand(productId, brandIds) {
    const url = `${WP_URL}/wp-json/wp/v2/product/${productId}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        },
        body: JSON.stringify({
            product_brand: brandIds  // Custom taxonomy field
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

/**
 * Test WordPress REST API connection
 */
async function testWpConnection() {
    try {
        const url = `${WP_URL}/wp-json/wp/v2/users/me`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Basic ${base64Auth}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            console.log(`✅ Connected to WordPress as: ${user.name}`);
            return true;
        } else {
            console.log(`❌ WordPress connection failed: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ WordPress connection error: ${error.message}`);
        return false;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🔗 Testing WordPress REST API connection...');
    const connected = await testWpConnection();
    if (!connected) {
        console.error('❌ Cannot proceed without WordPress connection');
        process.exit(1);
    }

    console.log('\n📦 Loading data...');

    // Load products with manufacturer info
    const products = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'products.json'), 'utf-8')
    );

    // Load brand ID mapping
    let brandIdMap;
    try {
        brandIdMap = JSON.parse(
            readFileSync(join(OUTPUT_DIR, 'brand-id-map.json'), 'utf-8')
        );
    } catch (e) {
        console.error('❌ brand-id-map.json not found');
        process.exit(1);
    }

    console.log(`   Loaded ${products.length} products`);
    console.log(`   Loaded ${Object.keys(brandIdMap).length} brand mappings`);

    // Filter products that have a manufacturer
    const productsWithBrands = products.filter(p =>
        p.manufacturer_id && p.manufacturer_id !== '0' && brandIdMap[p.manufacturer_id]
    );

    console.log(`   ${productsWithBrands.length} products have brand assignments\n`);

    // First, get OpenCart ID to WooCommerce ID mapping
    console.log('📤 Fetching WooCommerce products...');

    // Fetch products from WooCommerce REST API
    let wcProducts = [];
    let page = 1;

    while (true) {
        const response = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`, {
            headers: {
                'Authorization': `Basic ${base64Auth}`
            }
        });

        if (!response.ok) break;

        const data = await response.json();
        if (data.length === 0) break;

        wcProducts = wcProducts.concat(data);
        console.log(`   Fetched page ${page}: ${data.length} products`);
        page++;
    }

    console.log(`   Total: ${wcProducts.length} products\n`);

    // Map OpenCart to WooCommerce IDs
    const ocToWcMap = {};
    for (const p of wcProducts) {
        const meta = p.meta_data?.find(m => m.key === '_opencart_product_id');
        if (meta) ocToWcMap[meta.value] = p.id;
    }

    console.log(`   Matched ${Object.keys(ocToWcMap).length} products\n`);

    console.log('📤 Updating products with brands...\n');

    let updated = 0;
    let failed = 0;
    const failedUpdates = [];

    for (let i = 0; i < productsWithBrands.length; i++) {
        const ocProduct = productsWithBrands[i];
        const wcProductId = ocToWcMap[ocProduct.product_id];
        const wcBrandId = brandIdMap[ocProduct.manufacturer_id];

        if (!wcProductId) {
            console.log(`   [${i + 1}/${productsWithBrands.length}] ⏭️ ${ocProduct.name} - Not found in WC`);
            continue;
        }

        try {
            await updateProductBrand(wcProductId, [wcBrandId]);
            updated++;
            console.log(`   [${i + 1}/${productsWithBrands.length}] ✅ ${ocProduct.name} → Brand:${wcBrandId}`);
        } catch (error) {
            failed++;
            failedUpdates.push({ product: ocProduct.name, wcProductId, error: error.message });
            console.log(`   [${i + 1}/${productsWithBrands.length}] ❌ ${ocProduct.name} - ${error.message}`);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n📊 Complete: ${updated} updated, ${failed} failed`);

    if (failedUpdates.length > 0) {
        writeFileSync(
            join(OUTPUT_DIR, 'failed-brand-updates.json'),
            JSON.stringify(failedUpdates, null, 2)
        );
    }
}

main().catch(console.error);
