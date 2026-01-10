# WordPress Backend (crm.cashncarry.se) - Deindexing Checklist

**Goal:** Prevent crm.cashncarry.se from appearing in Google search results  
**Why:** Security, duplicate content prevention, professional SEO

---

## ✅ **Immediate Actions** (Do Today)

### **Step 1: WordPress Settings** (5 minutes)

1. Login to WordPress:
   - URL: `https://crm.cashncarry.se/wp-admin`
   - Username: [Your admin username]
   - Password: [Your admin password]

2. Go to **Settings → Reading**

3. Find: **"Search engine visibility"**

4. ✅ **Enable:** "Discourage search engines from indexing this site"

5. Click **Save Changes**

**Result:** WordPress adds `<meta name="robots" content="noindex, nofollow">` to all pages

---

### **Step 2: Create robots.txt** (5 minutes)

**Option A: Via FTP/cPanel File Manager**

1. Connect to your hosting (where crm.cashncarry.se is hosted)
2. Navigate to WordPress root directory (usually `public_html/crm/` or similar)
3. Create file: `robots.txt`
4. Add this content:

```txt
# robots.txt for crm.cashncarry.se - WordPress Backend
# This is a headless CMS - DO NOT INDEX

User-agent: *
Disallow: /

# WordPress specific blocks
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /wp-includes/
Disallow: /wp-content/plugins/
Disallow: /wp-content/themes/
Disallow: /wp-json/

# WooCommerce
Disallow: /wp-json/wc/
Disallow: /cart/
Disallow: /checkout/
Disallow: /my-account/

# No sitemap
```

5. Save and upload

**Option B: Via WordPress Plugin (if Yoast SEO installed)**

1. Install **Yoast SEO** plugin (if not installed)
2. Go to **SEO → Tools → File Editor**
3. Click **Create robots.txt file**
4. Paste the content above
5. Save

---

### **Step 3: Verify Configuration** (2 minutes)

1. **Check robots.txt:**
   - Visit: `https://crm.cashncarry.se/robots.txt`
   - Should show: `User-agent: * Disallow: /`

2. **Check meta tags:**
   - Visit: `https://crm.cashncarry.se`
   - Right-click → View Page Source
   - Search for: `<meta name="robots"`
   - Should see: `content="noindex, nofollow"`

3. **Test in Google:**
   - Search: `site:crm.cashncarry.se`
   - **Current:** May show results
   - **After 2-4 weeks:** Should show "No results found"

---

## 📊 **Monitor Deindexing** (Weekly Check)

### **Week 1-2:**
- [ ] Check `site:crm.cashncarry.se` in Google
- [ ] Indexed pages should start decreasing

### **Week 3-4:**
- [ ] Check again - most/all pages should be removed
- [ ] If still indexed, proceed to "Step 4"

### **Month 2:**
- [ ] Final check - should show "No results found"

---

## 🔧 **Optional: Advanced Protection**

### **Step 4: Google Search Console Removal Request** (If Needed)

Only do this if crm.cashncarry.se is currently indexed:

1. **Add Property:**
   - Go to: [Google Search Console](https://search.google.com/search-console)
   - Click: **Add Property**
   - Enter: `https://crm.cashncarry.se`

2. **Verify Ownership:**
   - Download HTML verification file
   - Upload to WordPress root directory via FTP
   - Click **Verify**

3. **Request Removal:**
   - Go to: **Removals** (left sidebar)
   - Click: **New Request**
   - Select: **Temporarily remove URL**
   - Enter: `crm.cashncarry.se/` (with trailing slash)
   - Click: **Submit**

4. **Result:**
   - Removes from Google for 6 months
   - Gives robots.txt time to work permanently

---

### **Step 5: IP Restriction** (Highest Security - Optional)

Add to `.htaccess` in WordPress root:

```apache
# Restrict backend to specific IPs only
<IfModule mod_rewrite.c>
RewriteEngine On

# Allow your office/home IP
# Replace with your actual IP address
RewriteCond %{REMOTE_ADDR} !^123\.456\.789\.0$
RewriteCond %{REQUEST_URI} ^/wp-admin [OR]
RewriteCond %{REQUEST_URI} ^/wp-login\.php

RewriteRule ^ - [F,L]
</IfModule>

# Block search engine crawlers
RewriteCond %{HTTP_USER_AGENT} (googlebot|bingbot|baiduspider|yandex) [NC]
RewriteRule .* - [F,L]
```

**Note:** This blocks ALL access except from your IP. Use carefully.

---

## 🎯 **Expected Results**

### **Before:**
```
site:crm.cashncarry.se
About 150 results (0.42 seconds)
Results:
- crm.cashncarry.se/wp-admin
- crm.cashncarry.se/wp-login.php
- crm.cashncarry.se/shop
- crm.cashncarry.se/products
...
```

### **After (2-4 weeks):**
```
site:crm.cashncarry.se
No results found

Only www.cashncarry.se pages appear in search!
```

---

## 📋 **Completion Checklist**

- [ ] WordPress Settings → "Discourage search engines" enabled
- [ ] robots.txt created with `Disallow: /`
- [ ] Verified robots.txt at crm.cashncarry.se/robots.txt
- [ ] Verified noindex meta tag in page source
- [ ] Tested `site:crm.cashncarry.se` in Google
- [ ] (Optional) Submitted removal request in Search Console
- [ ] (Optional) Added IP restrictions
- [ ] Scheduled monthly check to verify deindexing

---

## ⚠️ **Important Notes**

1. **Don't block your API endpoints** - Next.js needs access to:
   - `/wp-json/wc/v3/*` (WooCommerce API)
   - `/wp-json/wp/v2/*` (WordPress API)
   
   These are protected by authentication, not by blocking bots.

2. **Keep image access open** - Your frontend loads images from:
   - `/wp-content/uploads/*`
   
   These should remain accessible (robots.txt allows this by default).

3. **Monitor weekly** - Check deindexing progress every week for first month.

---

## 🔍 **Troubleshooting**

### **Issue: Still seeing crm.cashncarry.se in Google after 4 weeks**

**Solution:**
1. Verify robots.txt is actually live
2. Check WordPress Settings again
3. Submit removal request in Search Console
4. Contact your hosting provider to ensure robots.txt isn't being overridden

### **Issue: Frontend images not loading**

**Solution:**
1. Check that `/wp-content/uploads/` is NOT blocked in robots.txt
2. Verify CORS headers allow www.cashncarry.se to load images

### **Issue: WooCommerce API not working**

**Solution:**
1. API endpoints should NOT be blocked from legitimate requests
2. Only block crawlers, not authenticated API calls
3. Check IP restrictions aren't blocking Vercel servers

---

## 📞 **Support**

- **WordPress Settings:** Login to wp-admin
- **File Access:** cPanel or FTP credentials
- **Google Search Console:** search.google.com/search-console
- **Hosting Support:** Contact if robots.txt issues persist

---

**Last Updated:** 2026-01-11  
**Next Review:** Check deindexing progress weekly for 4 weeks
