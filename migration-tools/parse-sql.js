/**
 * OpenCart SQL Dump Parser
 * Extracts products, categories, customers, and SEO URLs from OpenCart SQL dump
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// SQL dump path
const SQL_PATH = join(__dirname, '..', '2026-01-05_21-01-23.sql');
const OUTPUT_DIR = join(__dirname, 'output');

// Ensure output directory exists
try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
} catch (e) {}

/**
 * Parse INSERT statements from SQL dump for a specific table
 */
function parseInsertStatements(sqlContent, tableName) {
  const results = [];
  
  // Match INSERT INTO `tableName` ... VALUES ...
  const insertRegex = new RegExp(
    `INSERT INTO \`${tableName}\`\\s*\\(([^)]+)\\)\\s*VALUES\\s*(.+?);`,
    'gis'
  );
  
  let match;
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    const columns = match[1].split(',').map(col => col.trim().replace(/`/g, ''));
    const valuesStr = match[2];
    
    // Parse each row of values
    const rowMatches = valuesStr.matchAll(/\(([^)]+)\)/g);
    for (const rowMatch of rowMatches) {
      const values = parseValues(rowMatch[1]);
      if (values.length === columns.length) {
        const row = {};
        columns.forEach((col, i) => {
          row[col] = values[i];
        });
        results.push(row);
      }
    }
  }
  
  return results;
}

/**
 * Parse comma-separated values, handling quoted strings
 */
function parseValues(valuesStr) {
  const values = [];
  let current = '';
  let inQuote = false;
  let escapeNext = false;
  
  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    
    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === "'" && !inQuote) {
      inQuote = true;
      continue;
    }
    
    if (char === "'" && inQuote) {
      inQuote = false;
      continue;
    }
    
    if (char === ',' && !inQuote) {
      values.push(current.trim() === 'NULL' ? null : current.trim());
      current = '';
      continue;
    }
    
    current += char;
  }
  
  // Push last value
  values.push(current.trim() === 'NULL' ? null : current.trim());
  
  return values;
}

/**
 * Main parsing function
 */
async function main() {
  console.log('📂 Reading SQL dump...');
  const sqlContent = readFileSync(SQL_PATH, 'utf-8');
  console.log(`   File size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB`);
  
  console.log('\n📦 Parsing products...');
  const products = parseInsertStatements(sqlContent, 'oc_product');
  console.log(`   Found ${products.length} products`);
  
  console.log('\n📝 Parsing product descriptions...');
  const productDescriptions = parseInsertStatements(sqlContent, 'oc_product_description');
  console.log(`   Found ${productDescriptions.length} product descriptions`);
  
  console.log('\n📁 Parsing categories...');
  const categories = parseInsertStatements(sqlContent, 'oc_category');
  console.log(`   Found ${categories.length} categories`);
  
  console.log('\n📝 Parsing category descriptions...');
  const categoryDescriptions = parseInsertStatements(sqlContent, 'oc_category_description');
  console.log(`   Found ${categoryDescriptions.length} category descriptions`);
  
  console.log('\n🔗 Parsing product-category relationships...');
  const productCategories = parseInsertStatements(sqlContent, 'oc_product_to_category');
  console.log(`   Found ${productCategories.length} relationships`);
  
  console.log('\n👥 Parsing customers...');
  const customers = parseInsertStatements(sqlContent, 'oc_customer');
  console.log(`   Found ${customers.length} customers`);
  
  console.log('\n📍 Parsing addresses...');
  const addresses = parseInsertStatements(sqlContent, 'oc_address');
  console.log(`   Found ${addresses.length} addresses`);
  
  console.log('\n🔗 Parsing SEO URLs...');
  // Try both old (oc_url_alias) and new (oc_seo_url) table names
  let seoUrls = parseInsertStatements(sqlContent, 'oc_seo_url');
  if (seoUrls.length === 0) {
    seoUrls = parseInsertStatements(sqlContent, 'oc_url_alias');
  }
  console.log(`   Found ${seoUrls.length} SEO URLs`);
  
  console.log('\n🖼️ Parsing product images...');
  const productImages = parseInsertStatements(sqlContent, 'oc_product_image');
  console.log(`   Found ${productImages.length} additional product images`);
  
  // Merge product data with descriptions
  const mergedProducts = products.map(product => {
    const description = productDescriptions.find(
      d => d.product_id === product.product_id
    ) || {};
    const cats = productCategories
      .filter(pc => pc.product_id === product.product_id)
      .map(pc => pc.category_id);
    const images = productImages
      .filter(pi => pi.product_id === product.product_id)
      .map(pi => pi.image);
    const seo = seoUrls.find(
      s => s.query === `product_id=${product.product_id}` || 
           s.key === 'product_id' && s.value === product.product_id
    );
    
    return {
      ...product,
      name: description.name || '',
      description: description.description || '',
      meta_title: description.meta_title || '',
      meta_description: description.meta_description || '',
      meta_keyword: description.meta_keyword || '',
      tag: description.tag || '',
      category_ids: cats,
      additional_images: images,
      seo_url: seo?.keyword || seo?.keyword || null
    };
  });
  
  // Merge category data with descriptions
  const mergedCategories = categories.map(category => {
    const description = categoryDescriptions.find(
      d => d.category_id === category.category_id
    ) || {};
    const seo = seoUrls.find(
      s => s.query === `category_id=${category.category_id}` ||
           s.key === 'category_id' && s.value === category.category_id
    );
    
    return {
      ...category,
      name: description.name || '',
      description: description.description || '',
      meta_title: description.meta_title || '',
      meta_description: description.meta_description || '',
      seo_url: seo?.keyword || null
    };
  });
  
  // Merge customer data with addresses
  const mergedCustomers = customers.map(customer => {
    const customerAddresses = addresses.filter(
      a => a.customer_id === customer.customer_id
    );
    
    return {
      ...customer,
      addresses: customerAddresses
    };
  });
  
  // Save parsed data
  console.log('\n💾 Saving parsed data...');
  
  writeFileSync(
    join(OUTPUT_DIR, 'products.json'),
    JSON.stringify(mergedProducts, null, 2)
  );
  console.log(`   ✅ products.json (${mergedProducts.length} items)`);
  
  writeFileSync(
    join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(mergedCategories, null, 2)
  );
  console.log(`   ✅ categories.json (${mergedCategories.length} items)`);
  
  writeFileSync(
    join(OUTPUT_DIR, 'customers.json'),
    JSON.stringify(mergedCustomers, null, 2)
  );
  console.log(`   ✅ customers.json (${mergedCustomers.length} items)`);
  
  writeFileSync(
    join(OUTPUT_DIR, 'seo_urls.json'),
    JSON.stringify(seoUrls, null, 2)
  );
  console.log(`   ✅ seo_urls.json (${seoUrls.length} items)`);
  
  console.log('\n✨ Parsing complete! Check the output/ folder.');
  
  return {
    products: mergedProducts,
    categories: mergedCategories,
    customers: mergedCustomers,
    seoUrls
  };
}

// Run if called directly
main().catch(console.error);

export { parseInsertStatements, main as parseOpenCartDump };
