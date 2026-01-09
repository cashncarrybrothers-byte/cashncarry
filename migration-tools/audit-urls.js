/**
 * URL Audit Script - Check for incorrect URLs, menu structure, old domain references
 * Verifies all URLs use cashncarry.se and don't have /menu/ or ideallivs references
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const OUTPUT_DIR = join(__dirname, 'output');

// WordPress credentials
const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

const CORRECT_DOMAIN = 'cashncarry.se';
const ISSUES = [];

/**
 * Check WordPress site URL settings
 */
async function checkWordPressSiteSettings() {
    console.log('🔍 Checking WordPress Site Settings...\n');

    try {
        const response = await fetch(`${WP_URL}/wp-json/`, {
            headers: { 'Authorization': `Basic ${base64Auth}` }
        });

        const data = await response.json();

        console.log(`   Site URL: ${data.url || data.home || 'N/A'}`);
        console.log(`   API URL: ${data.url || 'N/A'}`);

        if (data.url && !data.url.includes(CORRECT_DOMAIN)) {
            ISSUES.push({
                type: 'WordPress Site URL',
                issue: `Site URL doesn't use ${CORRECT_DOMAIN}`,
                current: data.url,
                expected: `https://${CORRECT_DOMAIN}`
            });
        }
    } catch (error) {
        console.log(`   ❌ Error checking WordPress settings: ${error.message}\n`);
    }
}

/**
 * Check products for URL issues
 */
async function checkProducts() {
    console.log('\n📦 Checking Products...\n');

    let page = 1;
    let totalChecked = 0;
    let issuesFound = 0;

    while (true) {
        try {
            const response = await fetch(
                `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`,
                { headers: { 'Authorization': `Basic ${base64Auth}` } }
            );

            if (!response.ok) break;

            const products = await response.json();
            if (products.length === 0) break;

            for (const product of products) {
                totalChecked++;

                // Check permalink
                if (product.permalink) {
                    if (product.permalink.includes('/menu/')) {
                        issuesFound++;
                        ISSUES.push({
                            type: 'Product Permalink',
                            id: product.id,
                            name: product.name,
                            issue: 'Contains /menu/ in URL',
                            url: product.permalink
                        });
                    }

                    if (product.permalink.includes('ideallivs')) {
                        issuesFound++;
                        ISSUES.push({
                            type: 'Product Permalink',
                            id: product.id,
                            name: product.name,
                            issue: 'Contains ideallivs domain',
                            url: product.permalink
                        });
                    }
                }

                // Check images
                if (product.images) {
                    for (const image of product.images) {
                        if (image.src && image.src.includes('ideallivs')) {
                            issuesFound++;
                            ISSUES.push({
                                type: 'Product Image',
                                id: product.id,
                                name: product.name,
                                issue: 'Image URL contains ideallivs',
                                url: image.src
                            });
                        }
                    }
                }
            }

            console.log(`   Checked page ${page}: ${products.length} products`);
            page++;

        } catch (error) {
            console.log(`   Error on page ${page}: ${error.message}`);
            break;
        }
    }

    console.log(`\n   ✅ Total products checked: ${totalChecked}`);
    console.log(`   ${issuesFound > 0 ? '❌' : '✅'} Issues found: ${issuesFound}\n`);
}

/**
 * Check categories for URL issues
 */
async function checkCategories() {
    console.log('📁 Checking Categories...\n');

    let page = 1;
    let totalChecked = 0;
    let issuesFound = 0;

    while (true) {
        try {
            const response = await fetch(
                `${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&page=${page}`,
                { headers: { 'Authorization': `Basic ${base64Auth}` } }
            );

            if (!response.ok) break;

            const categories = await response.json();
            if (categories.length === 0) break;

            for (const category of categories) {
                totalChecked++;

                // Check category image
                if (category.image && category.image.src) {
                    if (category.image.src.includes('ideallivs')) {
                        issuesFound++;
                        ISSUES.push({
                            type: 'Category Image',
                            id: category.id,
                            name: category.name,
                            issue: 'Image URL contains ideallivs',
                            url: category.image.src
                        });
                    }
                }
            }

            console.log(`   Checked page ${page}: ${categories.length} categories`);
            page++;

        } catch (error) {
            console.log(`   Error on page ${page}: ${error.message}`);
            break;
        }
    }

    console.log(`\n   ✅ Total categories checked: ${totalChecked}`);
    console.log(`   ${issuesFound > 0 ? '❌' : '✅'} Issues found: ${issuesFound}\n`);
}

/**
 * Check brands for URL issues
 */
async function checkBrands() {
    console.log('🏷️ Checking Brands...\n');

    let page = 1;
    let totalChecked = 0;
    let issuesFound = 0;

    while (true) {
        try {
            const response = await fetch(
                `${WP_URL}/wp-json/wc/v3/products/brands?per_page=100&page=${page}`,
                { headers: { 'Authorization': `Basic ${base64Auth}` } }
            );

            if (!response.ok) {
                console.log('   ⚠️ Brands endpoint not available (plugin may not be installed)\n');
                break;
            }

            const brands = await response.json();
            if (brands.length === 0) break;

            for (const brand of brands) {
                totalChecked++;

                // Check brand image
                if (brand.image && brand.image.src) {
                    if (brand.image.src.includes('ideallivs')) {
                        issuesFound++;
                        ISSUES.push({
                            type: 'Brand Image',
                            id: brand.id,
                            name: brand.name,
                            issue: 'Image URL contains ideallivs',
                            url: brand.image.src
                        });
                    }
                }
            }

            console.log(`   Checked page ${page}: ${brands.length} brands`);
            page++;

        } catch (error) {
            console.log(`   Error: ${error.message}\n`);
            break;
        }
    }

    if (totalChecked > 0) {
        console.log(`\n   ✅ Total brands checked: ${totalChecked}`);
        console.log(`   ${issuesFound > 0 ? '❌' : '✅'} Issues found: ${issuesFound}\n`);
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🔍 URL AUDIT - cashncarry.se\n');
    console.log('='.repeat(50));
    console.log('\n');

    await checkWordPressSiteSettings();
    await checkProducts();
    await checkCategories();
    await checkBrands();

    console.log('='.repeat(50));
    console.log('\n📊 AUDIT SUMMARY\n');

    if (ISSUES.length === 0) {
        console.log('✅ No URL issues found!');
        console.log('✅ All URLs are correctly configured.');
        console.log('✅ No /menu/ structure detected.');
        console.log('✅ No ideallivs.com references found.');
    } else {
        console.log(`❌ Found ${ISSUES.length} URL issues:\n`);

        // Group by type
        const byType = {};
        for (const issue of ISSUES) {
            if (!byType[issue.type]) byType[issue.type] = [];
            byType[issue.type].push(issue);
        }

        for (const [type, issues] of Object.entries(byType)) {
            console.log(`\n${type}: ${issues.length} issues`);
            for (const issue of issues.slice(0, 5)) {
                console.log(`  - ${issue.name || issue.issue}`);
                console.log(`    ${issue.url || issue.current}`);
            }
            if (issues.length > 5) {
                console.log(`  ... and ${issues.length - 5} more`);
            }
        }

        // Save detailed report
        writeFileSync(
            join(OUTPUT_DIR, 'url-audit-report.json'),
            JSON.stringify(ISSUES, null, 2)
        );
        console.log(`\n💾 Detailed report saved to output/url-audit-report.json`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Audit Complete!\n');
}

main().catch(console.error);
