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
        if (!matches || matches.length < 5) return null;

        const clean = matches.map(m => m.replace(/^"|"$/g, '').replace(/^,|,$/g, ''));

        return {
            id: clean[0],
            name: clean[1],
            oldSlug: clean[2],
            imagePath: clean[3],
            recommendedSlug: clean[4]
        };
    }).filter(Boolean).filter(b => b.name); // Only brands with names
}

async function updateBrands() {
    console.log('🔄 Starting brand update...\n');

    // Read CSV
    const brands = parseCSV('brands-complete.csv');
    console.log(`📋 Found ${brands.length} brands in CSV\n`);

    // Try to get brands from product attributes (pa_brand taxonomy)
    console.log('📥 Fetching existing brands from WooCommerce...');

    let wcBrands = [];
    try {
        // Try Perfect Brands or similar plugin endpoint
        wcBrands = await apiRequest('GET', '/wp-json/wc/v3/products/attributes/pa_brand/terms?per_page=100');
        console.log(`✓ Found ${wcBrands.length} brands in WooCommerce (using pa_brand attribute)\n`);
    } catch (error) {
        // Try alternative brand taxonomy
        try {
            wcBrands = await apiRequest('GET', '/wp-json/wc/v3/products/attributes/brand/terms?per_page=100');
            console.log(`✓ Found ${wcBrands.length} brands in WooCommerce (using brand attribute)\n`);
        } catch (error2) {
            console.log('⚠️  Could not find brand taxonomy. Brands might need manual setup.');
            console.log('   Please install a WooCommerce Brands plugin first.\n');

            // Show brands that need to be created
            console.log('📋 Brands to create manually:');
            console.log('   (Install Perfect Brands or WooCommerce Brands plugin)\n');

            brands.slice(0, 20).forEach(brand => {
                console.log(`   - ${brand.name} (slug: ${brand.recommendedSlug || brand.oldSlug})`);
                if (brand.imagePath) {
                    console.log(`     Image: ${brand.imagePath}`);
                }
            });

            if (brands.length > 20) {
                console.log(`   ... and ${brands.length - 20} more brands`);
            }

            return;
        }
    }

    let updated = 0;
    let skipped = 0;

    for (const brand of brands) {
        // Find matching WooCommerce brand by name
        const wcBrand = wcBrands.find(wc =>
            wc.name.toLowerCase().trim() === brand.name.toLowerCase().trim()
        );

        const slug = brand.oldSlug || brand.recommendedSlug;

        if (wcBrand) {
            try {
                const updateData = {
                    slug: slug
                };

                // Add image info in description
                if (brand.imagePath) {
                    updateData.description = `Image: ${brand.imagePath}`;
                }

                // Update via appropriate endpoint
                await apiRequest('PUT', `/wp-json/wc/v3/products/attributes/pa_brand/terms/${wcBrand.id}`, updateData);
                console.log(`✓ Updated: "${brand.name}" → slug: ${slug}`);
                updated++;
            } catch (error) {
                console.log(`✗ Failed to update "${brand.name}": ${error.message}`);
            }
        } else {
            console.log(`⚠ Not found: "${brand.name}" (needs manual creation)`);
            skipped++;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✓ Updated: ${updated}`);
    console.log(`   ⚠ Skipped/Not Found: ${skipped}`);
    console.log('='.repeat(60));

    // Show image paths
    console.log('\n📸 Brand logos that need to be uploaded:');
    console.log('   Upload these from OpenCart /image/catalog/ folder:\n');

    const imagesNeeded = brands
        .filter(b => b.imagePath)
        .map(b => ({ name: b.name, path: b.imagePath }));

    imagesNeeded.slice(0, 15).forEach(img => {
        console.log(`   - ${img.name}: ${img.path}`);
    });

    if (imagesNeeded.length > 15) {
        console.log(`   ... and ${imagesNeeded.length - 15} more`);
    }
}

// Run the update
updateBrands().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
