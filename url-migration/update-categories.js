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
        // Simple CSV parser (handles quoted fields)
        const matches = line.match(/(?:\"([^\"]*)\"|([^,]*))/g);
        if (!matches || matches.length < 5) return null;

        const clean = matches.map(m => m.replace(/^"|"$/g, '').replace(/^,|,$/g, ''));

        return {
            id: clean[0],
            name: clean[1],
            oldSlug: clean[2],
            imagePath: clean[3],
            recommendedSlug: clean[4]
        };
    }).filter(Boolean);
}

async function updateCategories() {
    console.log('🔄 Starting category update...\n');

    // Read CSV
    const categories = parseCSV('categories-complete.csv');
    console.log(`📋 Found ${categories.length} categories in CSV\n`);

    // Get all WooCommerce categories
    console.log('📥 Fetching existing WooCommerce categories...');
    const wcCategories = await apiRequest('GET', '/wp-json/wc/v3/products/categories?per_page=100');
    console.log(`✓ Found ${wcCategories.length} categories in WooCommerce\n`);

    let updated = 0;
    let created = 0;
    let skipped = 0;

    for (const category of categories) {
        if (!category.name) {
            skipped++;
            continue;
        }

        // Find matching WooCommerce category by name
        const wcCategory = wcCategories.find(wc =>
            wc.name.toLowerCase().trim() === category.name.toLowerCase().trim()
        );

        const slug = category.oldSlug || category.recommendedSlug;

        if (wcCategory) {
            // Update existing category
            try {
                const updateData = {
                    slug: slug
                };

                // Add image if exists
                if (category.imagePath) {
                    updateData.description = `Image: ${category.imagePath}`;
                }

                await apiRequest('PUT', `/wp-json/wc/v3/products/categories/${wcCategory.id}`, updateData);
                console.log(`✓ Updated: "${category.name}" → slug: ${slug}`);
                updated++;
            } catch (error) {
                console.log(`✗ Failed to update "${category.name}": ${error.message}`);
            }
        } else {
            // Category doesn't exist - note it
            console.log(`⚠ Not found in WooCommerce: "${category.name}" (will need manual creation)`);
            skipped++;
        }

        // Rate limiting - wait 200ms between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✓ Updated: ${updated}`);
    console.log(`   ⚠ Skipped/Not Found: ${skipped}`);
    console.log('='.repeat(60));

    // Show image paths that need manual upload
    console.log('\n📸 Images that need to be uploaded:');
    console.log('   Upload these from OpenCart /image/catalog/ folder to WordPress Media Library:\n');

    const imagesNeeded = categories
        .filter(c => c.imagePath)
        .map(c => c.imagePath)
        .filter((v, i, a) => a.indexOf(v) === i); // unique

    imagesNeeded.slice(0, 20).forEach(img => {
        console.log(`   - ${img}`);
    });

    if (imagesNeeded.length > 20) {
        console.log(`   ... and ${imagesNeeded.length - 20} more`);
    }
}

// Run the update
updateCategories().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
