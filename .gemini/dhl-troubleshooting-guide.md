# DHL Shipping - Empty Methods Troubleshooting Guide

## 🔴 Problem Identified

**API Response:**
```json
{
  "available_methods": [],  // ❌ EMPTY - This is the problem!
  "cart_subtotal": "15",
  "success": true
}
```

**What this means:**
- ✅ Next.js → WordPress API connection is working
- ✅ WordPress is responding successfully
- ❌ **WordPress is not returning any shipping methods**

This is a **WooCommerce configuration issue** on the WordPress side.

---

## 🎯 Root Causes (In Order of Likelihood)

### 1. **No Shipping Zones Configured** (60% likely)
WooCommerce requires shipping zones to be set up before methods can be returned.

### 2. **No Shipping Methods Added to Zones** (30% likely)
Zones exist but no methods (DHL, Flat Rate, etc.) are added.

### 3. **Shipping Methods Disabled** (5% likely)
Methods exist but are disabled.

### 4. **Address Doesn't Match Any Zone** (5% likely)
The test address doesn't match configured zones.

---

## 🔧 Step-by-Step Fix

### **Step 1: Check Shipping Zones**

1. **Log into WordPress Admin**
   - URL: `https://crm.cashncarry.se/wp-admin`

2. **Navigate to Shipping Zones**
   - Go to: **WooCommerce → Settings → Shipping**
   - Click on: **Shipping zones** tab

3. **Check if zones exist**
   - You should see zones like:
     - "Sweden" (or "Stockholm")
     - "Rest of Europe"
     - "Rest of World"
   
   **If NO zones exist:**
   - Click **"Add shipping zone"**
   - Create zones (see Step 2)

   **If zones exist:**
   - Continue to Step 3

---

### **Step 2: Create Shipping Zones** (If None Exist)

#### **Zone 1: Sweden**
1. Click **"Add shipping zone"**
2. **Zone name:** `Sweden`
3. **Zone regions:** Click "Add shipping zone region"
   - Select: **"Sweden"** from dropdown
4. Click **"Add shipping method"**
   - Select: **"DHL"** (if available)
   - OR: **"Flat rate"** (as temporary test)
5. Click **"Save changes"**

#### **Zone 2: Europe** (Optional)
1. Click **"Add shipping zone"**
2. **Zone name:** `Europe`
3. **Zone regions:** Add European countries
4. Add shipping method (DHL or Flat rate)
5. Save

#### **Zone 3: Rest of World** (Optional)
1. Create zone for other countries
2. Add appropriate shipping methods

---

### **Step 3: Add Shipping Methods to Zones**

For each zone:

1. **Click zone name** to edit
2. **Click "Add shipping method"**
3. **Select method:**
   - **DHL** (if plugin installed)
   - **Flat rate** (as fallback/test)
   - **Free shipping** (optional)
4. **Configure method:**
   - Click "Edit" next to the method
   - Set cost (if flat rate)
   - Enable the method
   - Save settings
5. **Click "Save changes"**

---

### **Step 4: Verify DHL Plugin**

1. **Check if DHL plugin is installed:**
   - Go to: **Plugins → Installed Plugins**
   - Search for: "DHL" or "Fourlines"
   - Verify: Plugin is **Active**

2. **If DHL plugin is NOT installed:**
   - You have two options:
     
     **Option A: Use Flat Rate (Quick Fix)**
     - Use "Flat rate" shipping method
     - Set a fixed cost (e.g., 49 SEK)
     - This will work immediately
     
     **Option B: Install DHL Plugin**
     - Install the DHL/Fourlines plugin
     - Configure with DHL API credentials
     - Add DHL to shipping zones

---

### **Step 5: Test Configuration**

#### **Test 1: Check Zones in WordPress**
1. Go to: **WooCommerce → Settings → Shipping → Shipping zones**
2. Verify you see at least one zone
3. Click the zone name
4. Verify at least one shipping method is listed
5. Verify the method is **Enabled** (toggle should be ON)

#### **Test 2: Test from Frontend**
1. Open checkout: `http://localhost:3001/checkout`
2. Enter test address:
   - **Postcode:** `111 22`
   - **City:** `Stockholm`
   - **Country:** `Sweden`
3. Check browser console for:
   ```javascript
   ✅ Shipping API Response: {
     available_methods: [
       { label: "Flat rate", cost: 49, ... }  // Should NOT be empty!
     ]
   }
   ```

---

## 🧪 Quick Test: Add Flat Rate Method

**To quickly verify the integration is working:**

1. **Go to:** WooCommerce → Settings → Shipping → Shipping zones
2. **Edit "Sweden" zone** (or create if doesn't exist)
3. **Add shipping method:** "Flat rate"
4. **Set cost:** 49 SEK
5. **Enable:** Make sure toggle is ON
6. **Save changes**
7. **Test checkout** - You should now see "Flat rate - 49 SEK"

**If this works:**
- ✅ Integration is working perfectly!
- ✅ You can now add DHL method the same way

**If this still doesn't work:**
- Check Step 6 below

---

## 🔍 Step 6: Advanced Debugging

### **Check WordPress Logs**

1. **Enable WordPress debugging:**
   - Edit `wp-config.php`
   - Add:
     ```php
     define('WP_DEBUG', true);
     define('WP_DEBUG_LOG', true);
     define('WP_DEBUG_DISPLAY', false);
     ```

2. **Check debug log:**
   - Location: `wp-content/debug.log`
   - Look for shipping-related errors

### **Test WordPress API Directly**

Use this curl command to test the WordPress endpoint:

```bash
curl -X POST https://crm.cashncarry.se/wp-json/fourlines-mcp/v1/shipping/calculate \
  -H "Content-Type: application/json" \
  -H "X-Fourlines-Key: fmcp_50779937b6858b3987aaa9e4862a2765818030cea4cf18d1afb40e33d6ad1692" \
  -d '{
    "items": [{"product_id": 1234, "quantity": 1}],
    "postcode": "11122",
    "city": "Stockholm",
    "country": "SE"
  }'
```

**Expected response:**
```json
{
  "available_methods": [
    {
      "id": "flat_rate:1",
      "label": "Flat rate",
      "cost": 49,
      ...
    }
  ]
}
```

### **Check Fourlines MCP Plugin**

1. **Verify plugin is active:**
   - Go to: Plugins → Installed Plugins
   - Find: "Fourlines MCP"
   - Status: Should be **Active**

2. **Check plugin settings:**
   - Look for Fourlines MCP settings page
   - Verify API key is configured
   - Test connection to DHL

---

## 📋 Checklist

Use this checklist to verify everything:

### WordPress Configuration:
- [ ] At least one shipping zone exists
- [ ] Zone includes Sweden (or customer's country)
- [ ] At least one shipping method added to zone
- [ ] Shipping method is **Enabled** (toggle ON)
- [ ] Shipping method has cost configured (if flat rate)
- [ ] Changes are **saved**

### DHL Plugin (if using DHL):
- [ ] Fourlines MCP plugin is installed
- [ ] Plugin is **Active**
- [ ] DHL API credentials are configured
- [ ] DHL method is added to shipping zones
- [ ] DHL method is enabled

### Testing:
- [ ] Checkout page loads without errors
- [ ] Shipping address can be entered
- [ ] Console shows `available_methods` is NOT empty
- [ ] Shipping methods appear in UI

---

## 🎯 Most Likely Solution

**Based on the error, the most likely fix is:**

1. **Go to:** WooCommerce → Settings → Shipping → Shipping zones
2. **Create or edit "Sweden" zone**
3. **Add region:** Sweden
4. **Add shipping method:** Flat rate (or DHL if plugin installed)
5. **Set cost:** 49 SEK (or desired amount)
6. **Enable the method**
7. **Save changes**
8. **Test checkout**

This should immediately fix the `available_methods: []` issue!

---

## 💡 After Fixing

Once you see shipping methods in the response:

1. **If using Flat Rate:**
   - ✅ You're done! Shipping works!
   - You can add more methods later

2. **If you want DHL:**
   - Install DHL/Fourlines plugin
   - Configure DHL credentials
   - Add DHL method to zones
   - Remove or keep flat rate as backup

---

## 🆘 Still Not Working?

If you've completed all steps and still see `available_methods: []`:

1. **Share with me:**
   - Screenshot of shipping zones page
   - Screenshot of zone configuration
   - WordPress debug log (if available)
   - Response from curl test (if you ran it)

2. **I can help:**
   - Identify the specific configuration issue
   - Provide custom code fixes if needed
   - Debug the Fourlines MCP plugin

---

## 📞 Quick Reference

**WordPress Admin:** `https://crm.cashncarry.se/wp-admin`

**Key Pages:**
- Shipping Zones: WooCommerce → Settings → Shipping → Shipping zones
- Plugins: Plugins → Installed Plugins
- Debug Log: wp-content/debug.log

**Test Address:**
- Postcode: `111 22`
- City: `Stockholm`
- Country: `Sweden`

**Expected Result:**
```javascript
available_methods: [
  { label: "Flat rate", cost: 49 }
]
```

---

**The fix is simple: Add at least one shipping method to a shipping zone in WooCommerce!** 🚀
