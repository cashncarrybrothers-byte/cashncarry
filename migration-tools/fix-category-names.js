/**
 * Update WooCommerce Categories with English Names
 * Fixes Swedish names and encoding issues
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const OUTPUT_DIR = join(__dirname, 'output');

const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

// Swedish to English translations
const translations = {
    // Main region categories
    'Asien': 'Asia',
    'Mellanöstern': 'Middle East',
    'Afrika': 'Africa',
    'Latinamerika': 'Latin America',
    'Balkan': 'Balkan',

    // Common category names
    'Efterrätter': 'Desserts',
    'EfterrÃ¤tter': 'Desserts',
    'Fryst': 'Frozen',
    'Dryck': 'Beverages',
    'Kosmetika': 'Cosmetics',
    'Övrigt': 'Other',
    'Ã–vrigt': 'Other',

    // Food categories
    'Ris': 'Rice',
    'Bönor': 'Beans',
    'BÃ¶nor': 'Beans',
    'Linser': 'Lentils',
    'Ärtor': 'Peas',
    'Ã„rtor': 'Peas',
    'Mjöl': 'Flour',
    'MjÃ¶l': 'Flour',
    'Kryddor': 'Spices',
    'Olja': 'Oil',
    'Oljor': 'Oils',
    'Gryn': 'Grains',
    'Nudlar': 'Noodles',
    'Pasta': 'Pasta',
    'Såser': 'Sauces',
    'SÃ¥ser': 'Sauces',
    'Salt': 'Salt',
    'Socker': 'Sugar',

    // Frozen categories
    'Fisk': 'Fish',
    'Kött': 'Meat',
    'KÃ¶tt': 'Meat',
    'Grönsaker': 'Vegetables',
    'GrÃ¶nsaker': 'Vegetables',
    'Skaldjur': 'Seafood',
    'Hamburgare': 'Burgers',
    'Kebab': 'Kebab',
    'Paratha': 'Paratha',
    'Naan Bröd': 'Naan Bread',
    'Naan BrÃ¶d': 'Naan Bread',
    'Naan': 'Naan',
    'Samosa/piroger': 'Samosa/Pies',

    // Beverages
    'Te': 'Tea',
    'Kaffe': 'Coffee',
    'Mjölk': 'Milk',
    'MjÃ¶lk': 'Milk',
    'Juice': 'Juice',
    'Läsk': 'Soft Drinks',
    'LÃ¤sk': 'Soft Drinks',

    // Other categories
    'Ghee': 'Ghee',
    'Kräm': 'Cream',
    'KrÃ¤m': 'Cream',
    'Glas': 'Glass Jars',
    'Konserv': 'Canned',
    'Ägg': 'Eggs',
    'Ã„gg': 'Eggs',
    'Bröd': 'Bread',
    'BrÃ¶d': 'Bread',
    'Inlagda varor': 'Pickled Goods',
    'Pickle': 'Pickle',
    'Chutney': 'Chutney',

    // Desserts
    'Gelé': 'Jelly',
    'GelÃ©': 'Jelly',
    'Färska sötsaker': 'Fresh Sweets',
    'FÃ¤rska sÃ¶tsaker': 'Fresh Sweets',
    'Fresh sweets': 'Fresh Sweets',
    'Ready Mix': 'Ready Mix',
    'Kulfi Ice': 'Kulfi Ice',

    // Snacks
    'Nötter': 'Nuts',
    'NÃ¶tter': 'Nuts',
    'Nuts': 'Nuts',
    'Torkade Frukter': 'Dried Fruits',
    'Dadlar': 'Dates',
    'Dates': 'Dates',
    'Saltade': 'Salted',
    'Salted': 'Salted',
    'Rostade': 'Roasted',
    'Rosted': 'Roasted',
    'Kakor': 'Cookies',
    'Sötsaker': 'Sweets',
    'SÃ¶tsaker': 'Sweets',
    'Sweets': 'Sweets',

    // Spices
    'Hela': 'Whole',
    'Whole': 'Whole',
    'Krossade': 'Crushed',
    'Crushed / Coarsely ground': 'Crushed',
    'Pulver': 'Powder',
    'Powder': 'Powder',
    'Kryddblandning': 'Spice Mix',
    'Spice Mix': 'Spice Mix',
    'Frön': 'Seeds',
    'FrÃ¶n': 'Seeds',
    'Seeds': 'Seeds',
    'Matfärg': 'Food Color',
    'Food color': 'Food Color',
    'Smak': 'Flavor',
    'Flavor': 'Flavor',

    // Cosmetics
    'Handdesinfektionsmedel': 'Hand Sanitizer',
    'Hand disinfectant': 'Hand Sanitizer',
    'Tvål': 'Soap',
    'TvÃ¥l': 'Soap',
    'Soap': 'Soap',
    'Hårolja': 'Hair Oil',
    'HÃ¥rolja': 'Hair Oil',
    'Hair oil': 'Hair Oil',
    'Hårmask': 'Hair Mask',
    'HÃ¥rmask': 'Hair Mask',
    'Hair mask': 'Hair Mask',
    'Hårkräm': 'Hair Cream',
    'HÃ¥rkrÃ¤m': 'Hair Cream',
    'Hair cream': 'Hair Cream',
    'Schampo': 'Shampoo',
    'Shampoo': 'Shampoo',
    'Balsam': 'Conditioner',
    'Hair conditioner': 'Conditioner',
    'Tandkräm': 'Toothpaste',
    'TandkrÃ¤m': 'Toothpaste',
    'Toothpaste': 'Toothpaste',
    'Hårfärg': 'Hair Color',
    'HÃ¥rfÃ¤rg': 'Hair Color',
    'Hair color': 'Hair Color',
    'Syntetiskt hår': 'Synthetic Hair',
    'Synthetic hair / hair extension': 'Synthetic Hair Extensions',

    // Ready to eat
    'Klart att äta': 'Ready to Eat',
    'Klart att Ã¤ta': 'Ready to Eat',

    // Other common terms
    'Leveransinformation': 'Delivery Information',
    'Integritetspolicy': 'Privacy Policy',
    'Om oss': 'About Us',
    'Allmänna Villkor': 'Terms & Conditions',
    'AllmÃ¤nna Villkor': 'Terms & Conditions'
};

/**
 * Translate a name from Swedish to English
 */
function translateName(name) {
    if (!name) return name;

    // Check for direct translation
    if (translations[name]) {
        return translations[name];
    }

    // Check for Category XXX pattern (placeholder name)
    if (name.match(/^Category \d+$/)) {
        return null; // Will need to be looked up
    }

    // Check for partial matches
    for (const [swedish, english] of Object.entries(translations)) {
        if (name.toLowerCase() === swedish.toLowerCase()) {
            return english;
        }
    }

    return name; // Return original if no translation found
}

/**
 * Get all WooCommerce categories
 */
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

/**
 * Update a category name
 */
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

/**
 * Main function
 */
async function main() {
    console.log('🔄 Fetching WooCommerce categories...\n');

    const categories = await getWcCategories();
    console.log(`   Found ${categories.length} categories\n`);

    // Identify categories needing translation
    const needsUpdate = [];

    for (const cat of categories) {
        const englishName = translateName(cat.name);

        if (englishName && englishName !== cat.name) {
            needsUpdate.push({
                id: cat.id,
                oldName: cat.name,
                newName: englishName,
                slug: englishName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
            });
        } else if (cat.name.match(/^Category \d+$/)) {
            needsUpdate.push({
                id: cat.id,
                oldName: cat.name,
                newName: null, // Needs manual lookup
                slug: null
            });
        }
    }

    console.log(`   ${needsUpdate.length} categories need name updates\n`);

    // Show what will be updated
    console.log('📋 Categories to update:\n');
    for (const cat of needsUpdate) {
        if (cat.newName) {
            console.log(`   ${cat.oldName} → ${cat.newName}`);
        } else {
            console.log(`   ${cat.oldName} → [NEEDS MANUAL LOOKUP]`);
        }
    }

    // Save mapping for review
    writeFileSync(
        join(OUTPUT_DIR, 'category-name-updates.json'),
        JSON.stringify(needsUpdate, null, 2)
    );
    console.log('\n💾 Saved to output/category-name-updates.json');

    // Apply updates
    console.log('\n📤 Updating categories...\n');

    let updated = 0;
    let skipped = 0;

    for (const cat of needsUpdate) {
        if (!cat.newName) {
            skipped++;
            console.log(`   ⏭️ ${cat.oldName} - needs manual lookup`);
            continue;
        }

        try {
            await updateCategory(cat.id, cat.newName, cat.slug);
            updated++;
            console.log(`   ✅ ${cat.oldName} → ${cat.newName}`);
        } catch (error) {
            console.log(`   ❌ ${cat.oldName} - ${error.message}`);
        }

        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n📊 Complete: ${updated} updated, ${skipped} need manual lookup`);
}

main().catch(console.error);
