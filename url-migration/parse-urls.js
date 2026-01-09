const fs = require('fs');

// Read all temp files
const categorySeoUrls = fs.readFileSync('category_seo_urls.txt', 'utf-8');
const categoryDescriptions = fs.readFileSync('temp_category_descriptions.txt', 'utf-8');
const manufacturerSeoUrls = fs.readFileSync('manufacturer_seo_urls.txt', 'utf-8');
const productSeoUrls = fs.readFileSync('product_seo_urls.txt', 'utf-8');
const productDescriptions = fs.readFileSync('temp_product_descriptions.txt', 'utf-8');

// Parse category SEO URLs
const categoryUrlMap = {};
const categoryRegex = /category_id=(\d+)', '([^']+)'/g;
let match;

while ((match = categoryRegex.exec(categorySeoUrls)) !== null) {
    const categoryId = match[1];
    const slug = match[2];
    categoryUrlMap[categoryId] = slug;
}

// Parse category descriptions
const categoryNameMap = {};
const categoryImageMap = {};
const catDescRegex = /\('(\d+)', '1', '([^']*)',/g;

while ((match = catDescRegex.exec(categoryDescriptions)) !== null) {
    const categoryId = match[1];
    const name = match[2].replace(/&amp;/g, '&');
    categoryNameMap[categoryId] = name;
}

// Read category images from original SQL
const categorySql = fs.readFileSync('2026-01-05_21-01-23.sql', 'utf-8');
const catImageRegex = /INSERT INTO `oc_category` \(`category_id`, `image`[^)]*\) VALUES \('(\d+)', '([^']*)'/g;

while ((match = catImageRegex.exec(categorySql)) !== null) {
    const categoryId = match[1];
    const image = match[2];
    if (image) {
        categoryImageMap[categoryId] = image;
    }
}

// Generate category CSV
let categoryCSV = 'Category ID,Category Name,Old URL Slug,Image Path\n';
Object.keys(categoryUrlMap).forEach(id => {
    const name = (categoryNameMap[id] || '').replace(/,/g, ';');
    const slug = categoryUrlMap[id] || '';
    const image = categoryImageMap[id] || '';
    categoryCSV += `${id},"${name}",${slug},${image}\n`;
});

fs.writeFileSync('category-url-mapping.csv', categoryCSV);
console.log('✓ Created category-url-mapping.csv');

// Parse manufacturer SEO URLs
const manufacturerUrlMap = {};
const manuRegex = /manufacturer_id=(\d+)', '([^']+)'/g;

while ((match = manuRegex.exec(manufacturerSeoUrls)) !== null) {
    const manufacturerId = match[1];
    const slug = match[2];
    manufacturerUrlMap[manufacturerId] = slug;
}

// Parse manufacturer data
const manufacturerNameMap = {};
const manufacturerImageMap = {};
const manuDataRegex = /INSERT INTO `oc_manufacturer` \(`manufacturer_id`, `name`, `image`[^)]*\) VALUES \('(\d+)', '([^']*)', '([^']*)'/g;

while ((match = manuDataRegex.exec(categorySql)) !== null) {
    const manufacturerId = match[1];
    const name = match[2].replace(/&amp;/g, '&').replace(/&#039;/g, "'");
    const image = match[3];
    manufacturerNameMap[manufacturerId] = name;
    if (image) {
        manufacturerImageMap[manufacturerId] = image;
    }
}

// Generate manufacturer CSV
let manufacturerCSV = 'Manufacturer ID,Brand Name,Old URL Slug,Image Path\n';
Object.keys(manufacturerUrlMap).forEach(id => {
    const name = (manufacturerNameMap[id] || '').replace(/,/g, ';');
    const slug = manufacturerUrlMap[id] || '';
    const image = manufacturerImageMap[id] || '';
    manufacturerCSV += `${id},"${name}",${slug},${image}\n`;
});

fs.writeFileSync('manufacturer-url-mapping.csv', manufacturerCSV);
console.log('✓ Created manufacturer-url-mapping.csv');

// Parse product SEO URLs
const productUrlMap = {};
const prodRegex = /product_id=(\d+)', '([^']+)'/g;

while ((match = prodRegex.exec(productSeoUrls)) !== null) {
    const productId = match[1];
    const slug = match[2];
    productUrlMap[productId] = slug;
}

// Parse product descriptions
const productNameMap = {};
const prodDescRegex = /\('(\d+)', '1', '([^']*)',/g;

while ((match = prodDescRegex.exec(productDescriptions)) !== null) {
    const productId = match[1];
    const name = match[2].replace(/&amp;/g, '&').replace(/&#039;/g, "'");
    productNameMap[productId] = name;
}

// Generate product CSV
let productCSV = 'Product ID,Product Name,Old URL Slug\n';
Object.keys(productUrlMap).forEach(id => {
    const name = (productNameMap[id] || '').replace(/,/g, ';');
    const slug = productUrlMap[id] || '';
    productCSV += `${id},"${name}",${slug}\n`;
});

fs.writeFileSync('product-url-mapping.csv', productCSV);
console.log('✓ Created product-url-mapping.csv');

console.log('\n📊 Summary:');
console.log(`   Categories: ${Object.keys(categoryUrlMap).length}`);
console.log(`   Manufacturers/Brands: ${Object.keys(manufacturerUrlMap).length}`);
console.log(`   Products: ${Object.keys(productUrlMap).length}`);
