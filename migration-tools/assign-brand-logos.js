/**
 * Assign Brand Logos to WooCommerce Product Brands
 * Works with Perfect Brands for WooCommerce or similar plugin
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const OUTPUT_DIR = join(__dirname, 'output');

// WordPress/WooCommerce credentials
const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

// OpenCart image base URL (where original images are)
const OC_IMAGE_BASE = 'https://cashncarry.se/image/';

// Create Basic Auth header
const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

/**
 * Upload an image to WordPress Media Library
 */
async function uploadImage(imageUrl, filename) {
    try {
        console.log(`   📥 Downloading: ${imageUrl}`);

        // Download image from OpenCart server
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            throw new Error(`Failed to download image: ${imageResponse.status}`);
        }

        const imageBuffer = await imageResponse.buffer();

        // Upload to WordPress Media Library
        const form = new FormData();
        form.append('file', imageBuffer, {
            filename: filename,
            contentType: imageResponse.headers.get('content-type') || 'image/png',
        });

        const uploadResponse = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${base64Auth}`,
                ...form.getHeaders()
            },
            body: form
        });

        if (!uploadResponse.ok) {
            const error = await uploadResponse.json().catch(() => ({}));
            throw new Error(error.message || `Upload failed: ${uploadResponse.status}`);
        }

        const uploadedMedia = await uploadResponse.json();
        console.log(`   ✅ Uploaded: ${uploadedMedia.id} - ${filename}`);

        return uploadedMedia.id;
    } catch (error) {
        console.log(`   ❌ Failed to upload ${filename}: ${error.message}`);
        return null;
    }
}

/**
 * Get all WooCommerce Product Brands
 */
async function getBrands() {
    let brands = [];
    let page = 1;

    while (true) {
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/brands?per_page=100&page=${page}`, {
                headers: {
                    'Authorization': `Basic ${base64Auth}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('⚠️ Product Brands endpoint not found. Make sure the Perfect Brands plugin is installed.');
                }
                break;
            }

            const data = await response.json();
            if (data.length === 0) break;

            brands = brands.concat(data);
            page++;
        } catch (error) {
            console.log(`Error fetching brands: ${error.message}`);
            break;
        }
    }

    return brands;
}

/**
 * Update brand with image/logo
 */
async function updateBrandImage(brandId, imageId) {
    try {
        const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/brands/${brandId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64Auth}`
            },
            body: JSON.stringify({
                image: {
                    id: imageId
                }
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🔄 Starting Brand Logo Assignment...\n');

    // Load manufacturers data (has image paths)
    console.log('📂 Loading manufacturers data...');
    const manufacturers = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'manufacturers.json'), 'utf-8')
    );
    console.log(`   Found ${manufacturers.length} manufacturers with image data\n`);

    // Load brand ID mapping (OpenCart ID → WooCommerce ID)
    console.log('📂 Loading brand ID mapping...');
    let brandIdMap;
    try {
        brandIdMap = JSON.parse(
            readFileSync(join(OUTPUT_DIR, 'brand-id-map.json'), 'utf-8')
        );
    } catch (e) {
        console.error('❌ brand-id-map.json not found. Run migrate-brands.js first.');
        process.exit(1);
    }
    console.log(`   Found ${Object.keys(brandIdMap).length} brand mappings\n`);

    // Fetch current WooCommerce brands
    console.log('🔗 Fetching WooCommerce brands...');
    const wcBrands = await getBrands();
    console.log(`   Found ${wcBrands.length} brands in WooCommerce\n`);

    console.log('📤 Processing brand logos...\n');

    let uploaded = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const failedUploads = [];

    for (let i = 0; i < manufacturers.length; i++) {
        const mfr = manufacturers[i];
        const wcBrandId = brandIdMap[mfr.manufacturer_id];

        if (!wcBrandId) {
            skipped++;
            console.log(`[${i + 1}/${manufacturers.length}] ⏭️ ${mfr.name} - No WC brand mapping`);
            continue;
        }

        if (!mfr.image || mfr.image === 'no_image.png') {
            skipped++;
            console.log(`[${i + 1}/${manufacturers.length}] ⏭️ ${mfr.name} - No image`);
            continue;
        }

        // Check if brand already has an image
        const wcBrand = wcBrands.find(b => b.id === wcBrandId);
        if (wcBrand && wcBrand.image && wcBrand.image.id) {
            skipped++;
            console.log(`[${i + 1}/${manufacturers.length}] ⏭️ ${mfr.name} - Already has image`);
            continue;
        }

        try {
            console.log(`[${i + 1}/${manufacturers.length}] 🏷️ ${mfr.name}`);

            // Construct full image URL
            const imageUrl = `${OC_IMAGE_BASE}${mfr.image}`;
            const filename = mfr.image.split('/').pop();

            // Upload image to WordPress
            const mediaId = await uploadImage(imageUrl, filename);

            if (!mediaId) {
                failed++;
                failedUploads.push({ brand: mfr.name, image: mfr.image, reason: 'Upload failed' });
                continue;
            }

            // Update brand with image
            await updateBrandImage(wcBrandId, mediaId);
            uploaded++;
            updated++;
            console.log(`   ✅ Brand updated with logo\n`);

        } catch (error) {
            failed++;
            failedUploads.push({ brand: mfr.name, wcBrandId, error: error.message });
            console.log(`   ❌ Error: ${error.message}\n`);
        }

        // Rate limiting delay
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n📊 Complete:`);
    console.log(`   ${uploaded} logos uploaded`);
    console.log(`   ${updated} brands updated`);
    console.log(`   ${skipped} skipped`);
    console.log(`   ${failed} failed`);

    if (failedUploads.length > 0) {
        writeFileSync(
            join(OUTPUT_DIR, 'failed-brand-logos.json'),
            JSON.stringify(failedUploads, null, 2)
        );
        console.log(`\n💾 Failed uploads saved to output/failed-brand-logos.json`);
    }
}

main().catch(console.error);
