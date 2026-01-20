# Ordering Maintenance Mode

## Overview
The website now has a maintenance mode feature that allows you to temporarily disable all ordering functionality while keeping the site live. This is useful during development, updates, or when you need to pause orders temporarily.

## How It Works

When ordering is disabled, the following changes occur across the website:

### 1. **Add to Cart Buttons**
- All "Add to Cart" buttons are disabled
- Button text changes to "Coming Soon"
- Hover tooltip shows: "We're working on improvements. Orders will start soon!"

### 2. **WhatsApp Order Buttons**
- All WhatsApp ordering buttons are disabled
- Button text changes to "Coming Soon"
- Modal for customer information won't open

### 3. **Cart Drawer**
- Shows a prominent amber banner explaining ordering is temporarily disabled
- "Checkout" button is disabled and shows "Coming Soon"
- WhatsApp order button is disabled

### 4. **Checkout Page**
- Displays a full-page maintenance message
- Shows friendly message: "We're Working on Improvements"
- Provides "Continue Shopping" button to return to shop
- Prevents any order placement attempts

## How to Enable/Disable Ordering

### To DISABLE Ordering (Maintenance Mode)

1. Open the `.env.local` file in the project root
2. Set the following variable to `"true"`:
   ```bash
   NEXT_PUBLIC_ORDERING_DISABLED="true"
   ```
3. Save the file
4. Restart your development server or redeploy to production

### To ENABLE Ordering (Normal Mode)

1. Open the `.env.local` file in the project root
2. Set the following variable to `"false"`:
   ```bash
   NEXT_PUBLIC_ORDERING_DISABLED="false"
   ```
3. Save the file
4. Restart your development server or redeploy to production

## Current Status

**Ordering is currently DISABLED** as per your request.

## Messages Shown to Users

When ordering is disabled, users will see these friendly messages:

- **Add to Cart Button**: "Coming Soon" (with tooltip)
- **WhatsApp Button**: "Coming Soon" (with tooltip)
- **Cart Banner**: "Ordering Temporarily Disabled - We're working on improvements to serve you better. Orders will start soon. Thank you for your patience!"
- **Checkout Page**: "We're Working on Improvements - Our ordering system is currently under maintenance to serve you better. Orders will start soon. Thank you for your patience!"

## Technical Details

- **Environment Variable**: `NEXT_PUBLIC_ORDERING_DISABLED`
- **Type**: String (`"true"` or `"false"`)
- **Scope**: Public (client-side accessible via `process.env.NEXT_PUBLIC_ORDERING_DISABLED`)

### Files Modified

1. `.env.local` - Added ordering disabled flag
2. `.env.example` - Added example configuration
3. `components/shop/add-to-cart-button.tsx` - Added maintenance check
4. `components/whatsapp/whatsapp-order-button.tsx` - Added maintenance check
5. `components/cart/cart-drawer.tsx` - Added maintenance banner and disabled checkout
6. `app/(shop)/checkout/page.tsx` - Added full-page maintenance message

## Best Practices

1. **Always notify users**: The current implementation shows friendly, informative messages
2. **Test before deploying**: Verify the maintenance mode works as expected
3. **Document changes**: Keep track of when you enable/disable ordering
4. **Quick toggle**: Simply change one environment variable to control the entire feature

## Re-enabling Orders

When you're ready to accept orders again:

1. Change `NEXT_PUBLIC_ORDERING_DISABLED="false"` in `.env.local`
2. Redeploy or restart the application
3. Test that all ordering functionality works correctly
4. Verify cart, checkout, and WhatsApp ordering are functional

---

**Note**: This is a development-stage feature. Once your site is fully ready for production, you can set this to `"false"` permanently or remove the feature entirely if no longer needed.
