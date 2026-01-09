/**
 * Import Related Products to WooCommerce
 * Maps OpenCart related products to WooCommerce cross-sells
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

const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

/**
 * Update product with related products (cross-sells)
 */
async function updateProductRelated(wcProductId, crossSellIds, upsellIds) {
    const url = `${WP_URL}/wp-json/wc/v3/products/${wcProductId}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        },
        body: JSON.stringify({
            cross_sell_ids: crossSellIds,
            upsell_ids: upsellIds
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

/**
 * Main function
 */
async function main() {
    console.log('📦 Loading data...\n');

    // Load related products from OpenCart
    const relatedProducts = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'related-products.json'), 'utf-8')
    );

    // Load products to get ID mapping
    const products = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'products.json'), 'utf-8')
    );

    console.log(`   Found ${relatedProducts.length} related product links`);
    console.log(`   Found ${products.length} products`);

    // Get WooCommerce product ID mapping
    console.log('\n📤 Fetching WooCommerce products...');

    let wcProducts = [];
    let page = 1;

    while (true) {
        const response = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`, {
            headers: { 'Authorization': `Basic ${base64Auth}` }
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

    // Group related products by source product
    const relatedByProduct = {};
    for (const rel of relatedProducts) {
        const productId = rel.product_id;
        const relatedId = rel.related_id;

        if (!relatedByProduct[productId]) {
            relatedByProduct[productId] = [];
        }
        relatedByProduct[productId].push(relatedId);
    }

    console.log(`   Grouped into ${Object.keys(relatedByProduct).length} products with relations\n`);

    console.log('📤 Updating products with related items...\n');

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    const productIds = Object.keys(relatedByProduct);

    for (let i = 0; i < productIds.length; i++) {
        const ocProductId = productIds[i];
        const ocRelatedIds = relatedByProduct[ocProductId];

        // Get WooCommerce IDs
        const wcProductId = ocToWcMap[ocProductId];
        if (!wcProductId) {
            skipped++;
            continue;
        }

        const wcRelatedIds = ocRelatedIds
            .map(id => ocToWcMap[id])
            .filter(id => id);

        if (wcRelatedIds.length === 0) {
            skipped++;
            continue;
        }

        try {
            // Split into cross-sells (first half) and upsells (second half)
            const half = Math.ceil(wcRelatedIds.length / 2);
            const crossSells = wcRelatedIds.slice(0, half);
            const upSells = wcRelatedIds.slice(half);

            await updateProductRelated(wcProductId, crossSells, upSells);
            updated++;

            if ((i + 1) % 20 === 0 || i === productIds.length - 1) {
                console.log(`   Progress: ${i + 1}/${productIds.length} (${updated} updated, ${skipped} skipped)`);
            }
        } catch (error) {
            failed++;
            console.log(`   ❌ Product ${wcProductId}: ${error.message}`);
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n📊 Complete: ${updated} updated, ${skipped} skipped, ${failed} failed`);
}

main().catch(console.error);
