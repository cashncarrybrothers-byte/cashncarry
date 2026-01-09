/**
 * Fix remaining placeholder category names
 */

import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

// Mapping of OpenCart category_id to correct English name
const categoryFixes = [
    { ocId: '222', name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
    { ocId: '256', name: 'Bulgur, Pasta & Vermicelli', slug: 'bulgur-pasta-vermicelli' },
    { ocId: '260', name: 'Pickle, Paste & Chutney', slug: 'pickle-paste-chutney' },
    { ocId: '265', name: 'Salt, Sugar & Jaggery', slug: 'salt-sugar-jaggery' },
    { ocId: '268', name: 'Jaggery & Shakkar', slug: 'jaggery-shakkar' },
    { ocId: '285', name: 'Nuts, Dried Fruits & Dates', slug: 'nuts-dried-fruits-dates' },
    { ocId: '289', name: 'Snacks, Cookies & Sweets', slug: 'snacks-cookies-sweets' },
    { ocId: '316', name: 'Ghee, Cream & Oil', slug: 'ghee-cream-oil' },
    { ocId: '320', name: 'Jars & Canned', slug: 'jars-canned' },
    { ocId: '323', name: 'Eggs & Bread', slug: 'eggs-bread' }
];

async function getWcCategories() {
    let categories = [];
    let page = 1;

    while (true) {
        const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&page=${page}`, {
            headers: { 'Authorization': `Basic ${base64Auth}` }
        });
        if (!response.ok) break;
        const data = await response.json();
        if (data.length === 0) break;
        categories = categories.concat(data);
        page++;
    }
    return categories;
}

async function updateCategory(categoryId, name, slug) {
    const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        },
        body: JSON.stringify({ name, slug })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
}

async function main() {
    console.log('🔄 Fetching WooCommerce categories...\n');
    const wcCategories = await getWcCategories();

    console.log('📤 Fixing placeholder category names...\n');

    for (const fix of categoryFixes) {
        // Find WC category by looking for "Category XXX" pattern
        const wcCat = wcCategories.find(c => c.name === `Category ${fix.ocId}`);

        if (wcCat) {
            try {
                await updateCategory(wcCat.id, fix.name, fix.slug);
                console.log(`   ✅ Category ${fix.ocId} → ${fix.name}`);
            } catch (error) {
                console.log(`   ❌ Category ${fix.ocId} - ${error.message}`);
            }
        } else {
            console.log(`   ⏭️ Category ${fix.ocId} not found (already fixed or missing)`);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n✅ Done fixing placeholder categories');
}

main().catch(console.error);
