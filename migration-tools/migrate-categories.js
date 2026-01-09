/**
 * Migrate Categories from OpenCart to WooCommerce
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createCategory, getAllCategories, testConnection } from './woocommerce-client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// Map OpenCart category IDs to WooCommerce IDs
const categoryIdMap = new Map();

/**
 * Build category hierarchy and migrate to WooCommerce
 */
async function migrateCategories() {
    console.log('🔗 Testing WooCommerce connection...');
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Cannot proceed without WooCommerce connection');
        process.exit(1);
    }

    console.log('\n📁 Loading parsed categories...');
    const categories = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'categories.json'), 'utf-8')
    );
    console.log(`   Found ${categories.length} categories to migrate`);

    // Sort by parent_id to ensure parents are created first
    const sortedCategories = [...categories].sort((a, b) => {
        const aParent = parseInt(a.parent_id) || 0;
        const bParent = parseInt(b.parent_id) || 0;
        return aParent - bParent;
    });

    console.log('\n📤 Migrating categories to WooCommerce...\n');

    let created = 0;
    let failed = 0;

    for (const cat of sortedCategories) {
        const ocCategoryId = cat.category_id;
        const parentOcId = parseInt(cat.parent_id) || 0;

        // Get WooCommerce parent ID if exists
        const wcParentId = parentOcId > 0 ? categoryIdMap.get(String(parentOcId)) : 0;

        const categoryData = {
            name: cat.name || `Category ${ocCategoryId}`,
            slug: cat.seo_url || undefined,
            description: cat.description || '',
            parent: wcParentId || 0
        };

        try {
            const wcCategory = await createCategory(categoryData);
            categoryIdMap.set(String(ocCategoryId), wcCategory.id);
            created++;
            console.log(`   ✅ ${categoryData.name} (OC:${ocCategoryId} → WC:${wcCategory.id})`);
        } catch (error) {
            failed++;
            console.log(`   ❌ ${categoryData.name} - ${error.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n📊 Migration complete: ${created} created, ${failed} failed`);

    // Save category ID mapping for product migration
    const mappingJson = Object.fromEntries(categoryIdMap);
    const fs = await import('fs');
    fs.writeFileSync(
        join(OUTPUT_DIR, 'category-id-map.json'),
        JSON.stringify(mappingJson, null, 2)
    );
    console.log('💾 Category ID mapping saved to output/category-id-map.json');

    return categoryIdMap;
}

migrateCategories().catch(console.error);

export { migrateCategories, categoryIdMap };
