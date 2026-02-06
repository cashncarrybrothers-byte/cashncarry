/**
 * DHL Shipping Integration Test Script
 * 
 * This script tests the shipping calculation flow to diagnose DHL integration issues.
 * Run this in the browser console on the checkout page.
 */

async function testDHLIntegration() {
    console.log('🧪 Starting DHL Integration Test...\n');

    // Test 1: Check environment variables
    console.log('📋 Test 1: Environment Variables');
    console.log('WordPress API URL:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'NOT SET');
    console.log('MCP Key (public):', process.env.NEXT_PUBLIC_FOURLINES_MCP_KEY ? '✅ SET' : '❌ NOT SET');
    console.log('');

    // Test 2: Test Next.js API route
    console.log('📋 Test 2: Testing Next.js API Route');
    try {
        const testRequest = {
            items: [
                { productId: 1234, quantity: 1 }
            ],
            postcode: '11122',
            city: 'Stockholm',
            country: 'SE'
        };

        console.log('Request:', testRequest);

        const response = await fetch('/api/shipping/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testRequest),
        });

        console.log('Response Status:', response.status, response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Response Data:', data);

            if (data.available_methods && data.available_methods.length > 0) {
                console.log('\n📦 Available Shipping Methods:');
                data.available_methods.forEach((method, index) => {
                    console.log(`  ${index + 1}. ${method.label} - ${method.cost} SEK`);
                    if (method.method_id.includes('dhl')) {
                        console.log('     ✅ DHL METHOD FOUND!');
                    }
                });
            } else {
                console.log('⚠️ No shipping methods returned');
            }

            if (data.error) {
                console.log('❌ Error:', data.error);
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.log('❌ API Error:', errorData);
        }
    } catch (error) {
        console.log('❌ Test Failed:', error.message);
    }
    console.log('');

    // Test 3: Test WordPress endpoint directly (if possible)
    console.log('📋 Test 3: Testing WordPress Endpoint');
    console.log('⚠️ This test requires CORS to be enabled on WordPress');
    console.log('If this fails, it\'s expected - the Next.js API route handles this');
    console.log('');

    // Test 4: Check cart store
    console.log('📋 Test 4: Cart Store Status');
    try {
        // This assumes you're using the cart store
        const cartStore = window.useCartStore?.getState?.();
        if (cartStore) {
            console.log('Cart Items:', cartStore.items?.length || 0);
            console.log('Shipping Address:', cartStore.shippingAddress);
            console.log('Available Methods:', cartStore.availableShippingMethods?.length || 0);
            console.log('Selected Method:', cartStore.selectedShippingMethod?.label || 'None');
            console.log('Is Calculating:', cartStore.isCalculatingShipping);
            console.log('Restricted Products:', cartStore.restrictedProducts?.length || 0);
        } else {
            console.log('⚠️ Cart store not accessible from console');
        }
    } catch (error) {
        console.log('⚠️ Could not access cart store:', error.message);
    }
    console.log('');

    console.log('🏁 Test Complete!\n');
    console.log('📊 Summary:');
    console.log('1. Check if API route returns shipping methods');
    console.log('2. Check if any methods include "dhl" in method_id');
    console.log('3. If no methods returned, check WordPress configuration');
    console.log('4. If API returns error, check WordPress logs');
}

// Run the test
testDHLIntegration();
