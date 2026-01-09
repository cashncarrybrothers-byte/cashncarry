/**
 * Generate URL Redirect Mappings
 * Creates redirect rules from old OpenCart URLs to new WooCommerce URLs
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');

// Old site base URL
const OLD_BASE = 'https://cashncarry.se';
// New site base URL (frontend)
const NEW_BASE = 'https://cashncarry.se'; // Same domain, new frontend

/**
 * Generate redirect mappings for products and categories
 */
function generateRedirects() {
    console.log('🔗 Generating URL redirect mappings...\n');

    // Load parsed data
    const products = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'products.json'), 'utf-8')
    );
    const categories = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'categories.json'), 'utf-8')
    );
    const seoUrls = JSON.parse(
        readFileSync(join(OUTPUT_DIR, 'seo_urls.json'), 'utf-8')
    );

    const redirects = [];

    // Product redirects
    console.log('📦 Generating product redirects...');
    for (const product of products) {
        if (product.seo_url) {
            redirects.push({
                old_url: `${OLD_BASE}/${product.seo_url}`,
                new_url: `${NEW_BASE}/product/${product.seo_url}`,
                type: 'product',
                id: product.product_id
            });
        } else {
            // Fallback for products without SEO URL
            redirects.push({
                old_url: `${OLD_BASE}/index.php?route=product/product&product_id=${product.product_id}`,
                new_url: `${NEW_BASE}/product/${product.product_id}`,
                type: 'product',
                id: product.product_id
            });
        }
    }
    console.log(`   Generated ${products.length} product redirects`);

    // Category redirects
    console.log('📁 Generating category redirects...');
    for (const category of categories) {
        if (category.seo_url) {
            redirects.push({
                old_url: `${OLD_BASE}/${category.seo_url}`,
                new_url: `${NEW_BASE}/category/${category.seo_url}`,
                type: 'category',
                id: category.category_id
            });
        }
    }
    console.log(`   Generated ${categories.length} category redirects`);

    // Save as JSON
    writeFileSync(
        join(OUTPUT_DIR, 'redirects.json'),
        JSON.stringify(redirects, null, 2)
    );
    console.log('\n💾 Saved redirects.json');

    // Generate .htaccess format
    let htaccess = '# OpenCart to WooCommerce Redirects\n';
    htaccess += '# Add this to your .htaccess file\n\n';
    htaccess += 'RewriteEngine On\n\n';

    for (const redirect of redirects) {
        const oldPath = redirect.old_url.replace(OLD_BASE, '');
        const newPath = redirect.new_url.replace(NEW_BASE, '');
        htaccess += `RewriteRule ^${escapeRegex(oldPath.slice(1))}$ ${newPath} [R=301,L]\n`;
    }

    writeFileSync(
        join(OUTPUT_DIR, 'redirects.htaccess'),
        htaccess
    );
    console.log('💾 Saved redirects.htaccess');

    // Generate Vercel redirects format (for vercel.json)
    const vercelRedirects = redirects.map(r => ({
        source: r.old_url.replace(OLD_BASE, ''),
        destination: r.new_url.replace(NEW_BASE, ''),
        permanent: true
    }));

    writeFileSync(
        join(OUTPUT_DIR, 'vercel-redirects.json'),
        JSON.stringify(vercelRedirects, null, 2)
    );
    console.log('💾 Saved vercel-redirects.json (for vercel.json)');

    console.log(`\n✨ Generated ${redirects.length} total redirects`);

    return redirects;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

generateRedirects();

export { generateRedirects };
