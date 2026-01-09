const fs = require('fs');

// Read SQL file
const sql = fs.readFileSync('2026-01-05_21-01-23.sql', 'utf-8');

// Extract ALL categories (not just those with SEO URLs)
console.log('Extracting categories...');
const categories = [];
const categoryRegex = /INSERT INTO `oc_category` \(`category_id`, `image`, `parent_id`[^)]*\) VALUES \('(\d+)', '([^']*)',/g;
let match;

const categoryMap = {};
while ((match = categoryRegex.exec(sql)) !== null) {
    categoryMap[match[1]] = match[2]; // id => image
}

// Get category names (English only, language_id=1)
const categoryNameRegex = /INSERT INTO `oc_category_description` \(`category_id`, `language_id`, `name`[^)]*\) VALUES \('(\d+)', '1', '([^']*)',/g;
const categoryNames = {};
while ((match = categoryNameRegex.exec(sql)) !== null) {
    const id = match[1];
    const name = match[2].replace(/&amp;/g, '&').replace(/&#039;/g, "'");
    if (name && name.trim()) { // Only non-empty names
        categoryNames[id] = name;
    }
}

// Get SEO URLs for categories
const categoryUrlRegex = /INSERT INTO `oc_seo_url`[^V]*VALUES[^']*'[^']*', '[^']*', 'category_id=(\d+)', '([^']+)'/g;
const categoryUrls = {};
while ((match = categoryUrlRegex.exec(sql)) !== null) {
    categoryUrls[match[1]] = match[2];
}

// Build category CSV
let categoryCSV = 'Category ID,Category Name,Old URL Slug,Image Path,Recommended New Slug\n';
Object.keys(categoryNames).sort((a, b) => parseInt(a) - parseInt(b)).forEach(id => {
    const name = categoryNames[id].replace(/,/g, ';');
    const slug = categoryUrls[id] || '';
    const image = categoryMap[id] || '';
    // Generate recommended slug from name
    const recommendedSlug = categoryNames[id]
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    categoryCSV += `${id},"${name}",${slug},${image},${recommendedSlug}\n`;
});

fs.writeFileSync('categories-complete.csv', categoryCSV);
console.log(`✓ Created categories-complete.csv (${Object.keys(categoryNames).length} categories)`);

// Extract ALL manufacturers
console.log('\nExtracting manufacturers/brands...');
const manufacturers = [];
const manuRegex = /INSERT INTO `oc_manufacturer` \(`manufacturer_id`, `name`, `image`, `sort_order`\) VALUES \('(\d+)', '([^']*)', '([^']*)', '[^']*'\);/g;

const manuData = {};
while ((match = manuRegex.exec(sql)) !== null) {
    const id = match[1];
    const name = match[2].replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/\\\'/g, "'");
    const image = match[3];
    manuData[id] = { name, image };
}

// Get SEO URLs for manufacturers
const manuUrlRegex = /INSERT INTO `oc_seo_url`[^V]*VALUES[^']*'[^']*', '1', 'manufacturer_id=(\d+)', '([^']+)'/g;
const manuUrls = {};
while ((match = manuUrlRegex.exec(sql)) !== null) {
    manuUrls[match[1]] = match[2];
}

// Build manufacturer CSV
let manuCSV = 'Brand ID,Brand Name,Old URL Slug,Image Path,Recommended New Slug\n';
Object.keys(manuData).sort((a, b) => parseInt(a) - parseInt(b)).forEach(id => {
    const { name, image } = manuData[id];
    const slug = manuUrls[id] || '';
    // Generate recommended slug from name
    const recommendedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    manuCSV += `${id},"${name.replace(/,/g, ';')}",${slug},${image},${recommendedSlug}\n`;
});

fs.writeFileSync('brands-complete.csv', manuCSV);
console.log(`✓ Created brands-complete.csv (${Object.keys(manuData).length} brands)`);

// Extract products with SEO URLs only (since you said products already have images)
console.log('\nExtracting products...');
const productNameRegex = /INSERT INTO `oc_product_description` \(`product_id`, `language_id`, `name`[^)]*\) VALUES \('(\d+)', '1', '([^']*)',/g;
const productNames = {};
while ((match = productNameRegex.exec(sql)) !== null) {
    const id = match[1];
    const name = match[2].replace(/&amp;/g, '&').replace(/&#039;/g, "'");
    if (name && name.trim()) {
        productNames[id] = name;
    }
}

// Get SEO URLs for products
const productUrlRegex = /`product_id=(\d+)', '([^']+)'\);/g;
const productUrlsTemp = {};
const seoUrlLines = sql.match(/INSERT INTO `oc_seo_url`[^\n]+/g) || [];

seoUrlLines.forEach(line => {
    // Check if it's a product URL for English (language_id='1')
    if (line.includes("product_id=") && line.includes("', '1', 'product_id=")) {
        const match = line.match(/product_id=(\d+)', '([^']+)'/);
        if (match) {
            productUrlsTemp[match[1]] = match[2];
        }
    }
});

const productUrls = productUrlsTemp;

// Build product CSV (only products with SEO URLs)
let productCSV = 'Product ID,Product Name,Old URL Slug,Recommended New Slug\n';
Object.keys(productUrls).sort((a, b) => parseInt(a) - parseInt(b)).forEach(id => {
    const name = productNames[id] || '';
    const slug = productUrls[id];
    const recommendedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    productCSV += `${id},"${name.replace(/,/g, ';')}",${slug},${recommendedSlug}\n`;
});

fs.writeFileSync('products-with-urls.csv', productCSV);
console.log(`✓ Created products-with-urls.csv (${Object.keys(productUrls).length} products)`);

console.log('\n📊 Summary:');
console.log(`   Total Categories: ${Object.keys(categoryNames).length}`);
console.log(`   Total Brands: ${Object.keys(manuData).length}`);
console.log(`   Products with URLs: ${Object.keys(productUrls).length}`);
console.log('\n✅ All CSV files created in url-migration folder!');
