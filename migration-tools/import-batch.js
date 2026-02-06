/**
 * Import a specific batch of products to Cash N Carry WooCommerce
 * 
 * Usage: node import-batch.js <batch-number>
 * Example: node import-batch.js 1
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createProduct, testConnection } from './woocommerce-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// ============================================================
// CONFIGURATION
// ============================================================

// Delay between API calls (ms)
const API_DELAY = 300;

// Import as draft (true) or publish immediately (false)
const IMPORT_AS_DRAFT = true;

// ============================================================
// MAIN EXECUTION
// ============================================================

async function importBatch(batchNumber) {
    const batchPath = join(OUTPUT_DIR, `ideallivs-batch-${batchNumber}.json`);

    if (!existsSync(batchPath)) {
        console.error(`❌ Batch file not found: ${batchPath}`);
        console.log('   Run "node import-from-ideallivs.js" first to generate batch files.');
        process.exit(1);
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Importing Batch ${batchNumber}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test connection
    console.log('🔗 Testing WooCommerce connection...');
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot connect to WooCommerce. Check .env credentials.');
        process.exit(1);
    }
    console.log('   ✅ Connection successful\n');

    // Load batch
    console.log(`📂 Loading batch ${batchNumber}...`);
    const products = JSON.parse(readFileSync(batchPath, 'utf-8'));
    console.log(`   Found ${products.length} products in batch\n`);

    // Load category and brand mappings if available
    let categoryMap = {};
    let brandMap = {};

    try {
        const catMapPath = join(OUTPUT_DIR, 'ideallivs-category-map.json');
        if (existsSync(catMapPath)) {
            const cats = JSON.parse(readFileSync(catMapPath, 'utf-8'));
            cats.forEach(cat => {
                if (cat.target_id) {
                    categoryMap[cat.source_id] = cat.target_id;
                }
            });
            console.log(`   📁 Loaded ${Object.keys(categoryMap).length} category mappings`);
        }
    } catch (e) {
        console.log('   ⚠️ No category mappings found');
    }

    try {
        const brandMapPath = join(OUTPUT_DIR, 'ideallivs-brand-map.json');
        if (existsSync(brandMapPath)) {
            const brands = JSON.parse(readFileSync(brandMapPath, 'utf-8'));
            brands.forEach(brand => {
                if (brand.target_id) {
                    brandMap[brand.name] = brand.target_id;
                }
            });
            console.log(`   🏷️ Loaded ${Object.keys(brandMap).length} brand mappings`);
        }
    } catch (e) {
        console.log('   ⚠️ No brand mappings found');
    }

    console.log('\n📤 Starting import...\n');

    let created = 0;
    let failed = 0;
    const results = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        // Apply status
        product.status = IMPORT_AS_DRAFT ? 'draft' : 'publish';

        try {
            const result = await createProduct(product);
            created++;
            results.push({
                success: true,
                name: product.name,
                wcId: result.id,
                slug: product.slug,
            });
            console.log(`   [${i + 1}/${products.length}] ✅ ${product.name} → WC:${result.id}`);
        } catch (error) {
            failed++;
            results.push({
                success: false,
                name: product.name,
                error: error.message,
            });
            console.log(`   [${i + 1}/${products.length}] ❌ ${product.name}: ${error.message}`);
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, API_DELAY));
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   IMPORT COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${products.length}`);

    if (failed > 0) {
        console.log('\n⚠️ Failed products:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.name}: ${r.error}`);
        });
    }

    console.log('═══════════════════════════════════════════════════════════\n');
}

// Get batch number from command line
const batchNumber = parseInt(process.argv[2]);

if (!batchNumber || isNaN(batchNumber)) {
    console.log('Usage: node import-batch.js <batch-number>');
    console.log('Example: node import-batch.js 1');
    process.exit(1);
}

importBatch(batchNumber).catch(console.error);
