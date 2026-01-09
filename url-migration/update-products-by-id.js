const fs = require('fs');
const https = require('https');

const WORDPRESS_URL = 'https://crm.cashncarry.se';
const CONSUMER_KEY = 'ck_d738e51a02af5b346fd3cb774e58a47c83f2b9dc';
const CONSUMER_SECRET = 'cs_daa026d8dfdfec532c59d22dfc1a33bb2641ee96';
const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

function apiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, WORDPRESS_URL);
        const options = {
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(url, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
                    }
                } catch (e) {
                    reject(new Error(`Parse Error: ${responseData}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function parseCSV(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n').slice(1);

    return lines.filter(line => line.trim()).map(line => {
        const matches = line.match(/(?:\"([^\"]*)\"|([^,]*))/g);
        if (!matches || matches.length < 3) return null;

        const clean = matches.map(m => m.replace(/^"|"$/g, '').replace(/^,|,$/g, ''));

        return {
            opencartId: clean[0],
            name: clean[1],
            oldSlug: clean[2],
            recommendedSlug: clean[3]
        };
    }).filter(Boolean).filter(p => p.oldSlug && p.opencartId);
}

async function updateProductsByID() {
    console.log('🔄 Starting product URL update (by OpenCart ID)...\n');
    console.log('⚠️  CRITICAL FOR SEO: Updating slugs to preserve old URLs!\n');

    const products = parseCSV('products-with-urls.csv');
    console.log(`📋 Found ${products.length} products with old URLs\n`);

    let updated = 0;
    let notFound = 0;
    let failed = 0;

    for (const product of products) {
        const wooCommerceId = parseInt(product.opencartId);

        try {
            // Try to get the product directly by ID
            const wcProduct = await apiRequest('GET', `/wp-json/wc/v3/products/${wooCommerceId}`);

            if (wcProduct && wcProduct.id) {
                // Update product with old slug
                await apiRequest('PUT', `/wp-json/wc/v3/products/${wooCommerceId}`, {
                    slug: product.oldSlug
                });

                console.log(`✓ Updated Product ID ${wooCommerceId}: "${wcProduct.name}"`);
                console.log(`  └─ New slug: ${product.oldSlug}`);
                console.log(`  └─ Old URL preserved for SEO!\n`);
                updated++;
            } else {
                console.log(`⚠ Product ID ${wooCommerceId} not found\n`);
                notFound++;
            }
        } catch (error) {
            if (error.message.includes('404')) {
                console.log(`⚠ Product ID ${wooCommerceId} ("${product.name}") not found in WooCommerce\n`);
                notFound++;
            } else {
                console.log(`✗ Failed to update Product ID ${wooCommerceId}: ${error.message}\n`);
                failed++;
            }
        }

        // Rate limiting - be gentle with the API
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL SUMMARY:');
    console.log('='.repeat(70));
    console.log(`   ✓ Successfully Updated: ${updated} products`);
    console.log(`   ⚠ Not Found: ${notFound} products`);
    console.log(`   ✗ Failed: ${failed} products`);
    console.log('='.repeat(70));

    if (updated > 0) {
        console.log('\n✅ SUCCESS! Your SEO-critical product URLs have been preserved!');
        console.log('   These products will now be accessible at their old URLs.');
    }

    if (notFound > 0 || failed > 0) {
        console.log('\n⚠️  Some products could not be updated:');
        console.log('   - Check if they were imported with different IDs');
        console.log('   - You may need to update these manually in WordPress');
    }
}

updateProductsByID().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
