const fs = require('fs');
const https = require('https');

// WooCommerce API credentials
const WORDPRESS_URL = 'https://crm.cashncarry.se';
const CONSUMER_KEY = 'ck_d738e51a02af5b346fd3cb774e58a47c83f2b9dc';
const CONSUMER_SECRET = 'cs_daa026d8dfdfec532c59d22dfc1a33bb2641ee96';

// Create Basic Auth header
const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

// Helper function to make API requests
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

            res.on('data', (chunk) => {
                responseData += chunk;
            });

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

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Read CSV file
function parseCSV(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header

    return lines.filter(line => line.trim()).map(line => {
        const matches = line.match(/(?:\"([^\"]*)\"|([^,]*))/g);
        if (!matches || matches.length < 3) return null;

        const clean = matches.map(m => m.replace(/^"|"$/g, '').replace(/^,|,$/g, ''));

        return {
            id: clean[0],
            name: clean[1],
            oldSlug: clean[2],
            recommendedSlug: clean[3]
        };
    }).filter(Boolean).filter(p => p.oldSlug); // Only products with old slugs
}

async function getAllProducts() {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const products = await apiRequest('GET', `/wp-json/wc/v3/products?per_page=100&page=${page}`);
        allProducts = allProducts.concat(products);

        if (products.length < 100) {
            hasMore = false;
        } else {
            page++;
        }
    }

    return allProducts;
}

async function updateProducts() {
    console.log('🔄 Starting product URL update...\n');
    console.log('⚠️  IMPORTANT: This will update slugs for SEO-critical products!\n');

    // Read CSV
    const products = parseCSV('products-with-urls.csv');
    console.log(`📋 Found ${products.length} products with old URLs in CSV\n`);

    if (products.length === 0) {
        console.log('✓ No products to update!');
        return;
    }

    // Get all WooCommerce products
    console.log('📥 Fetching all WooCommerce products (this may take a moment)...');
    const wcProducts = await getAllProducts();
    console.log(`✓ Found ${wcProducts.length} products in WooCommerce\n`);

    let updated = 0;
    let notFound = 0;

    for (const product of products) {
        if (!product.name || !product.oldSlug) {
            continue;
        }

        // Find matching WooCommerce product by name (fuzzy match)
        const wcProduct = wcProducts.find(wc => {
            const wcName = wc.name.toLowerCase().trim();
            const csvName = product.name.toLowerCase().trim().replace(/;/g, ',');
            return wcName === csvName || wcName.includes(csvName) || csvName.includes(wcName);
        });

        if (wcProduct) {
            try {
                // Update product with old slug
                await apiRequest('PUT', `/wp-json/wc/v3/products/${wcProduct.id}`, {
                    slug: product.oldSlug
                });

                console.log(`✓ Updated: "${product.name}"`);
                console.log(`  └─ Old URL: ${product.oldSlug}`);
                console.log(`  └─ WC ID: ${wcProduct.id}\n`);
                updated++;
            } catch (error) {
                console.log(`✗ Failed to update "${product.name}": ${error.message}\n`);
            }
        } else {
            console.log(`⚠ Not found: "${product.name}" (OpenCart ID: ${product.id})\n`);
            notFound++;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✓ Updated: ${updated} products`);
    console.log(`   ⚠ Not Found: ${notFound} products`);
    console.log('='.repeat(60));

    if (notFound > 0) {
        console.log('\n⚠️  Products not found need to be matched manually');
        console.log('   Check if they exist with different names in WooCommerce');
    }
}

// Run the update
updateProducts().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
