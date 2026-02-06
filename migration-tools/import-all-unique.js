/**
 * Import All Unique Products from IdealLivs
 * 
 * Imports products in batches with rate limiting
 * Products are imported as DRAFT for review
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProduct, testConnection } from './woocommerce-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// Configuration
const BATCH_SIZE = 10;        // Products per batch
const DELAY_BETWEEN = 500;    // ms between products
const BATCH_DELAY = 2000;     // ms between batches

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Import all products
 */
async function importAll() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   IdealLivs → Cash N Carry Full Import');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test connection
    console.log('🔗 Testing WooCommerce connection...');
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot connect to WooCommerce. Check .env credentials.');
        process.exit(1);
    }

    // Load products
    const productsPath = join(OUTPUT_DIR, 'unique-products-to-import.json');
    if (!existsSync(productsPath)) {
        console.error('❌ unique-products-to-import.json not found.');
        console.log('   Run test-fuzzy-match.js first.');
        process.exit(1);
    }

    const products = JSON.parse(readFileSync(productsPath, 'utf-8'));
    console.log(`\n📦 Loaded ${products.length} unique products to import\n`);

    // Track results
    const results = {
        created: [],
        failed: [],
    };

    // Calculate batches
    const totalBatches = Math.ceil(products.length / BATCH_SIZE);
    console.log(`📊 Will process in ${totalBatches} batches of ${BATCH_SIZE}\n`);

    const startTime = Date.now();

    for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
        const start = batchNum * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, products.length);
        const batch = products.slice(start, end);

        console.log(`\n━━━ Batch ${batchNum + 1}/${totalBatches} (Products ${start + 1}-${end}) ━━━`);

        for (let i = 0; i < batch.length; i++) {
            const product = batch[i];
            const globalIndex = start + i + 1;

            try {
                // Ensure draft status
                product.status = 'draft';

                // Remove variations data for now (WC needs separate API calls)
                delete product.variations;

                const result = await createProduct(product);

                results.created.push({
                    name: product.name,
                    wcId: result.id,
                    slug: result.slug,
                });

                console.log(`   [${globalIndex}/${products.length}] ✅ ${product.name.substring(0, 50)}... → WC:${result.id}`);

            } catch (error) {
                results.failed.push({
                    name: product.name,
                    error: error.message,
                });

                console.log(`   [${globalIndex}/${products.length}] ❌ ${product.name.substring(0, 50)}...`);
                console.log(`      Error: ${error.message.substring(0, 80)}`);
            }

            // Delay between products
            await sleep(DELAY_BETWEEN);
        }

        // Progress update
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const progress = Math.round((end / products.length) * 100);
        console.log(`   📈 Progress: ${progress}% | Created: ${results.created.length} | Failed: ${results.failed.length} | Time: ${elapsed}s`);

        // Delay between batches
        if (batchNum < totalBatches - 1) {
            await sleep(BATCH_DELAY);
        }
    }

    // Final summary
    const totalTime = Math.round((Date.now() - startTime) / 1000);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   IMPORT COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   ✅ Successfully Created: ${results.created.length}`);
    console.log(`   ❌ Failed: ${results.failed.length}`);
    console.log(`   ⏱️ Total Time: ${Math.floor(totalTime / 60)}m ${totalTime % 60}s`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Save results
    writeFileSync(
        join(OUTPUT_DIR, 'import-results.json'),
        JSON.stringify(results, null, 2)
    );
    console.log('💾 Results saved to: output/import-results.json');

    if (results.failed.length > 0) {
        console.log('\n⚠️ Failed products:');
        results.failed.slice(0, 10).forEach((f, i) => {
            console.log(`   ${i + 1}. ${f.name}`);
            console.log(`      ${f.error}`);
        });
        if (results.failed.length > 10) {
            console.log(`   ... and ${results.failed.length - 10} more (see import-results.json)`);
        }
    }

    console.log('\n✅ Done!');
}

importAll().catch(console.error);
