const https = require('https');
const fs = require('fs');

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
                    resolve(JSON.parse(responseData));
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

async function checkCategories() {
    // Get WooCommerce categories
    const wcCategories = await apiRequest('GET', '/wp-json/wc/v3/products/categories?per_page=100');

    console.log('📋 WooCommerce Categories (first 30):');
    console.log('ID\tName\t\t\t\tSlug');
    console.log(''.repeat(80));

    wcCategories.slice(0, 30).forEach(cat => {
        console.log(`${cat.id}\t${cat.name.padEnd(30)}\t${cat.slug}`);
    });

    console.log(`\n✓ Total: ${wcCategories.length} categories in WooCommerce`);

    // Read CSV
    const csv = fs.readFileSync('categories-complete.csv', 'utf-8');
    const lines = csv.split('\n').slice(1, 31); // First 30

    console.log('\n📋 CSV Categories (first 30):');
    console.log('ID\tName');
    console.log('-'.repeat(80));

    lines.filter(l => l.trim()).forEach(line => {
        const match = line.match(/^(\d+),"([^"]*)"/);
        if (match) {
            console.log(`${match[1]}\t${match[2]}`);
        }
    });
}

checkCategories().catch(console.error);
