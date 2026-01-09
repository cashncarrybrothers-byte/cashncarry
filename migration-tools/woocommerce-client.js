/**
 * WooCommerce API Client
 * Configured for crm.cashncary.se
 */

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const WooCommerce = new WooCommerceRestApi.default({
    url: process.env.WOOCOMMERCE_URL || 'https://crm.cashncary.se',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: 'wc/v3'
});

/**
 * Test connection to WooCommerce
 */
export async function testConnection() {
    try {
        const response = await WooCommerce.get('');
        console.log('✅ Connected to WooCommerce!');
        console.log(`   Store: ${response.data.name || 'Unknown'}`);
        return true;
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        return false;
    }
}

/**
 * Create a category in WooCommerce
 */
export async function createCategory(categoryData) {
    try {
        const response = await WooCommerce.post('products/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error(`Failed to create category: ${categoryData.name}`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * Create a product in WooCommerce
 */
export async function createProduct(productData) {
    try {
        const response = await WooCommerce.post('products', productData);
        return response.data;
    } catch (error) {
        console.error(`Failed to create product: ${productData.name}`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * Create a customer in WooCommerce
 */
export async function createCustomer(customerData) {
    try {
        const response = await WooCommerce.post('customers', customerData);
        return response.data;
    } catch (error) {
        console.error(`Failed to create customer: ${customerData.email}`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * Batch create products (up to 100 at a time)
 */
export async function batchCreateProducts(products) {
    try {
        const response = await WooCommerce.post('products/batch', { create: products });
        return response.data;
    } catch (error) {
        console.error('Batch create failed:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Batch create categories (up to 100 at a time)
 */
export async function batchCreateCategories(categories) {
    try {
        const response = await WooCommerce.post('products/categories/batch', { create: categories });
        return response.data;
    } catch (error) {
        console.error('Batch create categories failed:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get all existing categories
 */
export async function getAllCategories() {
    try {
        const response = await WooCommerce.get('products/categories', { per_page: 100 });
        return response.data;
    } catch (error) {
        console.error('Failed to get categories:', error.response?.data || error.message);
        return [];
    }
}

export default WooCommerce;
