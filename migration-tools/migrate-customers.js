/**
 * Migrate Customers from OpenCart to WooCommerce
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createCustomer, testConnection } from './woocommerce-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

/**
 * Convert OpenCart customer to WooCommerce format
 */
function convertCustomer(ocCustomer) {
    // Get default/first address if available
    const address = ocCustomer.addresses?.[0] || {};

    return {
        email: ocCustomer.email,
        first_name: ocCustomer.firstname || '',
        last_name: ocCustomer.lastname || '',
        username: ocCustomer.email.split('@')[0], // Use email prefix as username
        billing: {
            first_name: address.firstname || ocCustomer.firstname || '',
            last_name: address.lastname || ocCustomer.lastname || '',
            company: address.company || '',
            address_1: address.address_1 || '',
            address_2: address.address_2 || '',
            city: address.city || '',
            state: address.zone || '',
            postcode: address.postcode || '',
            country: address.country || 'SE',
            phone: ocCustomer.telephone || ''
        },
        shipping: {
            first_name: address.firstname || ocCustomer.firstname || '',
            last_name: address.lastname || ocCustomer.lastname || '',
            company: address.company || '',
            address_1: address.address_1 || '',
            address_2: address.address_2 || '',
            city: address.city || '',
            state: address.zone || '',
            postcode: address.postcode || '',
            country: address.country || 'SE'
        },
        meta_data: [
            { key: '_opencart_customer_id', value: ocCustomer.customer_id }
        ]
    };
}

/**
 * Migrate all customers to WooCommerce
 */
async function migrateCustomers() {
    console.log('🔗 Testing WooCommerce connection...');
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot proceed without WooCommerce connection');
        process.exit(1);
    }

    console.log('\n👥 Loading parsed customers...');
    const customers = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'customers.json'), 'utf-8')
    );
    console.log(`   Found ${customers.length} customers to migrate`);

    console.log('\n📤 Migrating customers to WooCommerce...\n');

    let created = 0;
    let failed = 0;
    const failedCustomers = [];

    for (let i = 0; i < customers.length; i++) {
        const ocCustomer = customers[i];

        // Skip customers without email
        if (!ocCustomer.email) {
            console.log(`   [${i + 1}/${customers.length}] ⏭️ Skipped (no email)`);
            continue;
        }

        const wcCustomer = convertCustomer(ocCustomer);

        try {
            const result = await createCustomer(wcCustomer);
            created++;
            console.log(`   [${i + 1}/${customers.length}] ✅ ${wcCustomer.email} (WC:${result.id})`);
        } catch (error) {
            failed++;
            failedCustomers.push({ customer: wcCustomer, error: error.message });
            console.log(`   [${i + 1}/${customers.length}] ❌ ${wcCustomer.email}`);
        }

        // Delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n📊 Migration complete: ${created} created, ${failed} failed`);

    if (failedCustomers.length > 0) {
        const fs = await import('fs');
        fs.writeFileSync(
            join(OUTPUT_DIR, 'failed-customers.json'),
            JSON.stringify(failedCustomers, null, 2)
        );
        console.log('💾 Failed customers saved to output/failed-customers.json');
    }

    console.log('\n⚠️ Note: Customer passwords cannot be migrated. Users will need to reset their passwords.');
}

migrateCustomers().catch(console.error);

export { migrateCustomers, convertCustomer };
