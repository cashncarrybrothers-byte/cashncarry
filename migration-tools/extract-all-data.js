/**
 * Comprehensive OpenCart Data Extractor
 * Extracts all additional data: pages, attributes, reviews, weight classes, options
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseInsertStatements } from './parse-sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SQL_PATH = join(__dirname, '..', '2026-01-05_21-01-23.sql');
const OUTPUT_DIR = join(__dirname, 'output');

// Ensure output directory exists
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch (e) { }

console.log('📂 Reading SQL dump...');
const sqlContent = readFileSync(SQL_PATH, 'utf-8');
console.log(`   File size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB\n`);

// ============================================
// 1. INFORMATION PAGES
// ============================================
console.log('📄 Extracting Information Pages...');
const information = parseInsertStatements(sqlContent, 'oc_information');
const informationDesc = parseInsertStatements(sqlContent, 'oc_information_description');

const pages = information.map(info => {
    const desc = informationDesc.find(d => d.information_id === info.information_id) || {};
    return {
        id: info.information_id,
        title: desc.title || '',
        description: desc.description || '',
        meta_title: desc.meta_title || '',
        meta_description: desc.meta_description || '',
        meta_keyword: desc.meta_keyword || '',
        sort_order: info.sort_order,
        status: info.status
    };
});
console.log(`   Found ${pages.length} information pages`);
writeFileSync(join(OUTPUT_DIR, 'pages.json'), JSON.stringify(pages, null, 2));

// ============================================
// 2. PRODUCT ATTRIBUTES
// ============================================
console.log('\n🏷️ Extracting Product Attributes...');
const attributes = parseInsertStatements(sqlContent, 'oc_attribute');
const attributeDesc = parseInsertStatements(sqlContent, 'oc_attribute_description');
const attributeGroups = parseInsertStatements(sqlContent, 'oc_attribute_group');
const attributeGroupDesc = parseInsertStatements(sqlContent, 'oc_attribute_group_description');
const productAttributes = parseInsertStatements(sqlContent, 'oc_product_attribute');

// Merge attribute data
const mergedAttributes = attributes.map(attr => {
    const desc = attributeDesc.find(d => d.attribute_id === attr.attribute_id) || {};
    const group = attributeGroups.find(g => g.attribute_group_id === attr.attribute_group_id);
    const groupDesc = group ? attributeGroupDesc.find(d => d.attribute_group_id === group.attribute_group_id) : null;
    return {
        attribute_id: attr.attribute_id,
        name: desc.name || '',
        group_id: attr.attribute_group_id,
        group_name: groupDesc?.name || '',
        sort_order: attr.sort_order
    };
});

// Product attribute values
const productAttrValues = productAttributes.map(pa => ({
    product_id: pa.product_id,
    attribute_id: pa.attribute_id,
    text: pa.text || ''
}));

console.log(`   Found ${mergedAttributes.length} attributes`);
console.log(`   Found ${productAttrValues.length} product-attribute values`);
writeFileSync(join(OUTPUT_DIR, 'attributes.json'), JSON.stringify(mergedAttributes, null, 2));
writeFileSync(join(OUTPUT_DIR, 'product-attributes.json'), JSON.stringify(productAttrValues, null, 2));

// ============================================
// 3. PRODUCT OPTIONS (Variations)
// ============================================
console.log('\n🎨 Extracting Product Options (Variations)...');
const options = parseInsertStatements(sqlContent, 'oc_option');
const optionDesc = parseInsertStatements(sqlContent, 'oc_option_description');
const optionValues = parseInsertStatements(sqlContent, 'oc_option_value');
const optionValueDesc = parseInsertStatements(sqlContent, 'oc_option_value_description');
const productOptions = parseInsertStatements(sqlContent, 'oc_product_option');
const productOptionValues = parseInsertStatements(sqlContent, 'oc_product_option_value');

// Merge option data
const mergedOptions = options.map(opt => {
    const desc = optionDesc.find(d => d.option_id === opt.option_id) || {};
    const values = optionValues
        .filter(v => v.option_id === opt.option_id)
        .map(v => {
            const vDesc = optionValueDesc.find(d => d.option_value_id === v.option_value_id) || {};
            return {
                option_value_id: v.option_value_id,
                name: vDesc.name || '',
                image: v.image || '',
                sort_order: v.sort_order
            };
        });
    return {
        option_id: opt.option_id,
        name: desc.name || '',
        type: opt.type,
        sort_order: opt.sort_order,
        values: values
    };
});

// Product option assignments
const productOpts = productOptions.map(po => {
    const optionName = mergedOptions.find(o => o.option_id === po.option_id)?.name || '';
    const values = productOptionValues
        .filter(pov => pov.product_option_id === po.product_option_id)
        .map(pov => {
            const optValue = optionValueDesc.find(d => d.option_value_id === pov.option_value_id);
            return {
                option_value_id: pov.option_value_id,
                name: optValue?.name || '',
                quantity: pov.quantity,
                price: pov.price,
                price_prefix: pov.price_prefix,
                weight: pov.weight,
                weight_prefix: pov.weight_prefix
            };
        });
    return {
        product_id: po.product_id,
        option_id: po.option_id,
        option_name: optionName,
        required: po.required,
        values: values
    };
});

console.log(`   Found ${mergedOptions.length} options`);
console.log(`   Found ${productOpts.length} product-option assignments`);
writeFileSync(join(OUTPUT_DIR, 'options.json'), JSON.stringify(mergedOptions, null, 2));
writeFileSync(join(OUTPUT_DIR, 'product-options.json'), JSON.stringify(productOpts, null, 2));

// ============================================
// 4. WEIGHT CLASSES
// ============================================
console.log('\n⚖️ Extracting Weight Classes...');
const weightClasses = parseInsertStatements(sqlContent, 'oc_weight_class');
const weightClassDesc = parseInsertStatements(sqlContent, 'oc_weight_class_description');

const mergedWeightClasses = weightClasses.map(wc => {
    const desc = weightClassDesc.find(d => d.weight_class_id === wc.weight_class_id) || {};
    return {
        weight_class_id: wc.weight_class_id,
        title: desc.title || '',
        unit: desc.unit || '',
        value: wc.value
    };
});

console.log(`   Found ${mergedWeightClasses.length} weight classes`);
writeFileSync(join(OUTPUT_DIR, 'weight-classes.json'), JSON.stringify(mergedWeightClasses, null, 2));

// ============================================
// 5. PRODUCT REVIEWS
// ============================================
console.log('\n⭐ Extracting Product Reviews...');
const reviews = parseInsertStatements(sqlContent, 'oc_review');

const formattedReviews = reviews.map(r => ({
    review_id: r.review_id,
    product_id: r.product_id,
    customer_id: r.customer_id,
    author: r.author,
    text: r.text,
    rating: r.rating,
    status: r.status,
    date_added: r.date_added,
    date_modified: r.date_modified
}));

console.log(`   Found ${formattedReviews.length} reviews`);
writeFileSync(join(OUTPUT_DIR, 'reviews.json'), JSON.stringify(formattedReviews, null, 2));

// ============================================
// 6. RELATED PRODUCTS
// ============================================
console.log('\n🔗 Extracting Related Products...');
const relatedProducts = parseInsertStatements(sqlContent, 'oc_product_related');
console.log(`   Found ${relatedProducts.length} related product links`);
writeFileSync(join(OUTPUT_DIR, 'related-products.json'), JSON.stringify(relatedProducts, null, 2));

// ============================================
// 7. TAX CLASSES & RATES
// ============================================
console.log('\n💰 Extracting Tax Information...');
const taxClasses = parseInsertStatements(sqlContent, 'oc_tax_class');
const taxRates = parseInsertStatements(sqlContent, 'oc_tax_rate');
console.log(`   Found ${taxClasses.length} tax classes`);
console.log(`   Found ${taxRates.length} tax rates`);
writeFileSync(join(OUTPUT_DIR, 'tax-classes.json'), JSON.stringify(taxClasses, null, 2));
writeFileSync(join(OUTPUT_DIR, 'tax-rates.json'), JSON.stringify(taxRates, null, 2));

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '='.repeat(50));
console.log('📊 EXTRACTION SUMMARY');
console.log('='.repeat(50));
console.log(`   Pages:              ${pages.length}`);
console.log(`   Attributes:         ${mergedAttributes.length}`);
console.log(`   Product Attributes: ${productAttrValues.length}`);
console.log(`   Options:            ${mergedOptions.length}`);
console.log(`   Product Options:    ${productOpts.length}`);
console.log(`   Weight Classes:     ${mergedWeightClasses.length}`);
console.log(`   Reviews:            ${formattedReviews.length}`);
console.log(`   Related Products:   ${relatedProducts.length}`);
console.log(`   Tax Classes:        ${taxClasses.length}`);
console.log('='.repeat(50));
console.log('\n✅ All data extracted to output/ folder');
