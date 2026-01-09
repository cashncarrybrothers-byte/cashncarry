/**
 * Assign Category Images to WooCommerce Product Categories
 * Uploads images from OpenCart catalogue folder to WordPress
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

// OpenCart image base URL
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

        const imageBuffer = await imageResponse.arrayBuffer();

        // Upload to WordPress Media Library
        const form = new FormData();
        form.append('file', Buffer.from(imageBuffer), {
            filename: filename,
            contentType: imageResponse.headers.get('content-type') || 'image/jpeg',
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
 * Get all WooCommerce Product Categories
 */
async function getWcCategories() {
    let categories = [];
    let page = 1;

    while (true) {
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories?per_page=100&page=${page}`, {
                headers: {
                    'Authorization': `Basic ${base64Auth}`
                }
            });

            if (!response.ok) break;

            const data = await response.json();
            if (data.length === 0) break;

            categories = categories.concat(data);
            page++;
        } catch (error) {
            console.log(`Error fetching categories: ${error.message}`);
            break;
        }
    }

    return categories;
}

/**
 * Update category with image
 */
async function updateCategoryImage(categoryId, imageId) {
    try {
        const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories/${categoryId}`, {
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
    console.log('🔄 Starting Category Image Assignment...\n');

    // Load categories data (has image paths)
    console.log('📂 Loading categories data...');
    const ocCategories = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'categories.json'), 'utf-8')
    );
    console.log(`   Found ${ocCategories.length} OpenCart categories\n`);

    // Load category ID mapping
    console.log('📂 Loading category ID mapping...');
    let categoryIdMap;
    try {
        categoryIdMap = JSON.parse(
            readFileSync(join(OUTPUT_DIR, 'category-id-map.json'), 'utf-8')
        );
    } catch (e) {
        console.error('❌ category-id-map.json not found. Run migrate-categories.js first.');
        process.exit(1);
    }
    console.log(`   Found ${Object.keys(categoryIdMap).length} category mappings\n`);

    // Fetch WooCommerce categories
    console.log('🔗 Fetching WooCommerce categories...');
    const wcCategories = await getWcCategories();
    console.log(`   Found ${wcCategories.length} WooCommerce categories\n`);
    console.log('📤 Processing category images...\n');

    let uploaded = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const failedUploads = [];

    for (let i = 0; i < ocCategories.length; i++) {
        const ocCat = ocCategories[i];
        const wcCategoryId = categoryIdMap[ocCat.category_id];

        if (!wcCategoryId) {
            skipped++;
            console.log(`[${i + 1}/${ocCategories.length}] ⏭️ ${ocCat.name || 'Unnamed'} - No WC category mapping`);
            continue;
        }

        // Find WC category by ID
        const wcCat = wcCategories.find(c => c.id === wcCategoryId);

        if (!ocCat.image || ocCat.image === '' || ocCat.image === 'no_image.png') {
            skipped++;
            console.log(`[${i + 1}/${ocCategories.length}] ⏭️ ${ocCat.name} - No image`);
            continue;
        }

        // Check if category already has an image
        if (wcCat.image && wcCat.image.id) {
            skipped++;
            console.log(`[${i + 1}/${ocCategories.length}] ⏭️ ${ocCat.name} - Already has image`);
            continue;
        }

        try {
            console.log(`[${i + 1}/${ocCategories.length}] 📁 ${ocCat.name}`);

            // Construct full image URL
            const imageUrl = `${OC_IMAGE_BASE}${ocCat.image}`;
            const filename = ocCat.image.split('/').pop();

            // Upload image to WordPress
            const mediaId = await uploadImage(imageUrl, filename);

            if (!mediaId) {
                failed++;
                failedUploads.push({
                    category: ocCat.name,
                    image: ocCat.image,
                    reason: 'Upload failed'
                });
                continue;
            }

            // Update category with image
            await updateCategoryImage(wcCat.id, mediaId);
            uploaded++;
            updated++;
            console.log(`   ✅ Category updated with image\n`);

        } catch (error) {
            failed++;
            failedUploads.push({
                category: ocCat.name,
                wcCategoryId: wcCat.id,
                error: error.message
            });
            console.log(`   ❌ Error: ${error.message}\n`);
        }

        // Rate limiting delay
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n📊 Complete:`);
    console.log(`   ${uploaded} images uploaded`);
    console.log(`   ${updated} categories updated`);
    console.log(`   ${skipped} skipped`);
    console.log(`   ${failed} failed`);

    if (failedUploads.length > 0) {
        writeFileSync(
            join(OUTPUT_DIR, 'failed-category-images.json'),
            JSON.stringify(failedUploads, null, 2)
        );
        console.log(`\n💾 Failed uploads saved to output/failed-category-images.json`);
    }
}

main().catch(console.error);
