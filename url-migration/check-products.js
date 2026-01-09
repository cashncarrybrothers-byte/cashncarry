const https = require('https');
const fs = require('fs');

const WORDPRESS_URL = 'https://crm.cashncarry.se';
const CONSUMER_KEY = 'ck_d738e51a02af5b346fd3cb774e58a47c83f2b9dc';
const CONSUMER_SECRET = 'cs_daa026d8dfdfec532c59d22dfc1a33bb2641ee96';
const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

function apiRequest(method, path) {
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
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    reject(new Error(`Parse Error`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function checkProducts() {
    // Get first page of products
    const wcProducts = await apiRequest('GET', '/wp-json/wc/v3/products?per_page=20');

    console.log('📋 WooCommerce Products (first 20):');
    console.log('ID\tName\t\t\t\t\tSlug');
    console.log('-'.repeat(100));

    wcProducts.forEach(prod => {
        console.log(`${prod.id}\t${prod.name.substring(0, 40).padEnd(42)}\t${prod.slug}`);
    });

    console.log(`\n✓ Showing first 20 products`);

    // Read CSV
    const csv = fs.readFileSync('products-with-urls.csv', 'utf-8');
    const lines = csv.split('\n').slice(1, 21); // First 20

    console.log('\n📋 CSV Products with Old URLs (first 20):');
    console.log('OpenCart ID\tName\t\t\t\t\tOld URL Slug');
    console.log('-'.repeat(100));

    lines.filter(l => l.trim()).forEach(line => {
        const match = line.match(/^(\d+),"([^"]*)",([^,]+)/);
        if (match) {
            console.log(`${match[1]}\t\t${match[2].substring(0, 40).padEnd(42)}\t${match[3]}`);
        }
    });

    console.log('\n💡 These products need their WooCommerce slugs updated to match the old URLs');
}

checkProducts().catch(console.error);
