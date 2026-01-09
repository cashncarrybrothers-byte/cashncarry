/**
 * Run All Migrations
 * Executes the complete OpenCart to WooCommerce migration
 */

import { parseOpenCartDump } from './parse-sql.js';
import { migrateCategories } from './migrate-categories.js';
import { migrateProducts } from './migrate-products.js';
import { migrateCustomers } from './migrate-customers.js';
import { generateRedirects } from './generate-redirects.js';
import { testConnection } from './woocommerce-client.js';

async function runAllMigrations() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('    OpenCart to WooCommerce Migration Tool');
    console.log('    Target: crm.cashncary.se');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Step 0: Test connection
    console.log('STEP 0: Testing WooCommerce connection...');
    console.log('─────────────────────────────────────────\n');
    const connected = await testConnection();
    if (!connected) {
        console.error('\n❌ Cannot proceed without WooCommerce connection');
        console.error('   Please check your .env file has correct API credentials');
        process.exit(1);
    }

    // Step 1: Parse SQL
    console.log('\n\nSTEP 1: Parsing OpenCart SQL Dump');
    console.log('─────────────────────────────────────────\n');
    await parseOpenCartDump();

    // Step 2: Migrate Categories
    console.log('\n\nSTEP 2: Migrating Categories');
    console.log('─────────────────────────────────────────\n');
    await migrateCategories();

    // Step 3: Migrate Products
    console.log('\n\nSTEP 3: Migrating Products');
    console.log('─────────────────────────────────────────\n');
    await migrateProducts();

    // Step 4: Migrate Customers
    console.log('\n\nSTEP 4: Migrating Customers');
    console.log('─────────────────────────────────────────\n');
    await migrateCustomers();

    // Step 5: Generate Redirects
    console.log('\n\nSTEP 5: Generating URL Redirects');
    console.log('─────────────────────────────────────────\n');
    generateRedirects();

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('    ✅ Migration Complete!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\nNext steps:');
    console.log('  1. Verify products in WooCommerce admin');
    console.log('  2. Add vercel-redirects.json to your vercel.json');
    console.log('  3. Upload product images to WordPress media library');
    console.log('  4. Send password reset emails to customers');
}

runAllMigrations().catch(console.error);
