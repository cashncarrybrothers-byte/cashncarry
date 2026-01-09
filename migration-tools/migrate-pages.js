/**
 * Create WordPress Pages from OpenCart Information Pages
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

/**
 * Create a WordPress page
 */
async function createPage(pageData) {
    const url = `${WP_URL}/wp-json/wp/v2/pages`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        },
        body: JSON.stringify({
            title: pageData.title,
            slug: pageData.slug,
            content: pageData.content,
            status: 'publish'
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
    console.log('📄 Creating WordPress pages from OpenCart information pages...\n');

    const pages = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'pages.json'), 'utf-8')
    );

    console.log(`   Found ${pages.length} pages to create\n`);

    let created = 0;
    let failed = 0;

    for (const page of pages) {
        try {
            const wpPage = await createPage(page);
            created++;
            console.log(`   ✅ ${page.title} (WP ID: ${wpPage.id})`);
        } catch (error) {
            failed++;
            console.log(`   ❌ ${page.title} - ${error.message}`);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n📊 Complete: ${created} created, ${failed} failed`);
}

main().catch(console.error);
