/**
 * Improved Fuzzy Product Matching
 * 
 * Uses brand + 2 meaningful keywords matching
 * Excludes sizes/weights from keyword matching
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// Stopwords and size patterns to ignore
const STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'ideal', 'indiska', 'livs', 'stockholm', 'delivery', 'sweden',
    'premium', 'quality', 'fresh', 'new', 'best', 'original', 'authentic',
    'pure', 'natural', 'organic', 'special', 'extra', 'super', 'real',
    'now', 'available', 'across'
]);

// Size/weight patterns to exclude
const SIZE_PATTERN = /^\d+(\.\d+)?(g|kg|ml|l|gm|oz|lb|pcs?|pieces?|pack|box)$/i;

/**
 * Extract meaningful product keywords (excluding sizes and stopwords)
 */
function extractKeywords(title) {
    if (!title) return [];

    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => {
            if (word.length < 3) return false;
            if (STOPWORDS.has(word)) return false;
            if (SIZE_PATTERN.test(word)) return false;
            if (/^\d+$/.test(word)) return false; // Pure numbers
            return true;
        });
}

/**
 * Create a matching signature
 */
function createSignature(title, brandField = null) {
    const keywords = extractKeywords(title);

    // First keyword is usually brand (or use brand field)
    let brand = null;
    if (brandField && brandField.trim()) {
        brand = brandField.toLowerCase().split(/\s+/)[0];
    } else if (keywords.length > 0) {
        brand = keywords[0];
    }

    // Remaining keywords for matching
    const productKeywords = brand ? keywords.filter(k => k !== brand) : keywords;

    return { brand, keywords: productKeywords, title };
}

/**
 * Check if two products match
 * Requires: same brand + at least 2 matching keywords
 */
function productsMatch(existing, newProd) {
    // Brand must match
    if (!existing.brand || !newProd.brand) return false;
    if (existing.brand !== newProd.brand) return false;

    // Find matching keywords
    const matchingKeywords = existing.keywords.filter(k =>
        newProd.keywords.includes(k)
    );

    // Require at least 2 matching keywords for confidence
    return matchingKeywords.length >= 2;
}

/**
 * Load existing products from CSV
 */
function loadExistingProducts() {
    const csvPath = join(__dirname, '..', 'cashncarryproducts.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
    });

    return records.map(r => createSignature(r.Name, r.Brands)).filter(s => s.brand);
}

/**
 * Load new products from IdealLivs
 */
function loadNewProducts() {
    const jsonPath = join(OUTPUT_DIR, 'ideallivs-products-to-import.json');
    return JSON.parse(readFileSync(jsonPath, 'utf-8'));
}

/**
 * Find matches
 */
function findMatches(existingList, newProducts) {
    const matches = [];
    const unique = [];

    for (const product of newProducts) {
        const newSig = createSignature(product.name);
        let foundMatch = null;

        for (const existing of existingList) {
            if (productsMatch(existing, newSig)) {
                foundMatch = {
                    newProduct: product.name,
                    existingProduct: existing.title,
                    brand: newSig.brand,
                    matchedKeywords: existing.keywords.filter(k => newSig.keywords.includes(k)),
                };
                break;
            }
        }

        if (foundMatch) {
            matches.push(foundMatch);
        } else {
            unique.push(product);
        }
    }

    return { matches, unique };
}

// Main
console.log('═══════════════════════════════════════════════════════════');
console.log('   Improved Fuzzy Matching (Brand + 2 Keywords)');
console.log('═══════════════════════════════════════════════════════════\n');

const existing = loadExistingProducts();
console.log(`📋 Loaded ${existing.length} existing products from CSV`);

const newProducts = loadNewProducts();
console.log(`📦 Loaded ${newProducts.length} products from IdealLivs\n`);

console.log('🔍 Finding matches (brand + 2 meaningful keywords)...\n');

const { matches, unique } = findMatches(existing, newProducts);

console.log('═══════════════════════════════════════════════════════════');
console.log('   RESULTS');
console.log('═══════════════════════════════════════════════════════════');
console.log(`   🔴 Matches (DUPLICATES to skip): ${matches.length}`);
console.log(`   🟢 Unique (NEW to import): ${unique.length}`);
console.log('═══════════════════════════════════════════════════════════\n');

// Show matches
if (matches.length > 0) {
    console.log('📋 All Matches Found:');
    console.log('─────────────────────────────────────────────────────────────');
    matches.forEach((m, i) => {
        console.log(`${i + 1}. NEW: "${m.newProduct}"`);
        console.log(`   EXISTING: "${m.existingProduct}"`);
        console.log(`   Brand: ${m.brand}, Keywords: [${m.matchedKeywords.join(', ')}]\n`);
    });
}

// Save results
writeFileSync(
    join(OUTPUT_DIR, 'confirmed-duplicates.json'),
    JSON.stringify(matches, null, 2)
);
console.log(`💾 Duplicates saved to: output/confirmed-duplicates.json`);

writeFileSync(
    join(OUTPUT_DIR, 'unique-products-to-import.json'),
    JSON.stringify(unique, null, 2)
);
console.log(`💾 Unique products saved to: output/unique-products-to-import.json`);

console.log(`\n✅ Done! ${unique.length} new products ready to import.`);
