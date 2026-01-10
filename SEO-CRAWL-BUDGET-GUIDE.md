# SEO Crawl Budget Optimization Guide

**Last Updated:** 2026-01-11  
**Purpose:** Maximize Google's crawl efficiency by blocking irrelevant pages and URL parameters

---

## What We're Blocking and Why

### ✅ **Blocked Pages/Parameters**

#### **1. User Action Pages** (Waste 100% of crawl budget)
- `/cart` - Empty cart varies per user
- `/checkout` - Personal user data
- `/my-account` - Private user area
- `/login`, `/register` - No search value
- `/wishlist` - User-specific lists

#### **2. Add-to-Cart URLs** (Creates 279+ duplicate pages!)
```
BLOCKED: /product/basmati-rice?add-to-cart=193
INDEXED: /product/basmati-rice (Clean product page)
```
**Impact:** Without blocking, Google would index:
- 279 products × 1 add-to-cart URL = **279 duplicate pages**
- Wastes crawl budget on non-content

#### **3. Search Result URLs** (Infinite combinations)
```
BLOCKED: /shop?s=rice&orderby=price&min_price=100
INDEXED: /shop (Main shop page)
         /product-category/rice (Category page)
```
**Impact:** Prevents millions of duplicate URLs from:
- Every search query
- Every sort option
- Every price filter
- Every combination

#### **4. Pagination Parameters**
```
BLOCKED: /shop?page=2, /shop?page=3...
ALLOWED: Google finds these through "Load More" links
```

#### **5. Tracking Parameters**
```
BLOCKED: /product?utm_source=facebook&fbclid=ABC123
INDEXED: /product (Clean URL)
```

---

## Expected Crawl Budget Savings

### **Before Optimization:**
- Google crawls: 279 products + 279 add-to-cart + 1000s of filter combinations = **~2,000+ URLs**
- Actual content pages: 279 products + 122 categories = **~400 pages**
- **Wasted crawl: ~80%**

### **After Optimization:**
- Google crawls: Only clean product, category, and content pages = **~400 URLs**
- All crawl budget goes to valuable content
- **Wasted crawl: ~5%**

---

## robots.txt Configuration

### **Now Blocking:**

1. **User Pages:**
   - `/cart`, `/checkout`, `/my-account`
   - `/login`, `/register`, `/wishlist`

2. **Action Parameters:**
   - `?add-to-cart=*`
   - `?removed_item=*`
   - `?cart_item_key=*`

3. **Search & Filters:**
   - `?s=*`, `?search=*`
   - `?orderby=*`, `?min_price=*`, `?max_price=*`
   - `?filter_*`

4. **Pagination:**
   - `?page=*`, `?paged=*`

5. **Tracking:**
   - `?utm_*`, `?fbclid=*`, `?gclid=*`

---

## Additional Recommendations

### **1. Google Search Console - URL Parameters**

Go to: **Settings** → **Crawling** → **URL Parameters**

Tell Google how to handle:
- `add-to-cart` → "No URLs" (These don't change content)
- `orderby` → "Paginated" (Let Google choose representative URL)
- `s` → "No URLs" (Search results have no SEO value)
- `utm_source` → "No URLs" (Tracking only)

### **2. Canonical Tags** (Already implemented in Next.js)

Your product pages should have:
```html
<link rel="canonical" href="https://www.cashncarry.se/product/basmati-rice" />
```

This tells Google:
- `/product/basmati-rice?add-to-cart=193` → Canonical: `/product/basmati-rice`
- `/product/basmati-rice?utm_source=fb` → Canonical: `/product/basmati-rice`

### **3. Meta Robots Tags** (For dynamic pages)

For checkout pages, add:
```html
<meta name="robots" content="noindex, nofollow" />
```

This provides double protection (robots.txt + meta tag).

---

## Monitoring Impact

### **Week 1-2: Google Search Console**
- Check **Crawl Stats** → Should see crawl rate stabilize
- Check **Coverage** → "Excluded by robots.txt" should increase
- Check **Indexed Pages** → Should decrease to ~400

### **Week 3-4: Index Cleanup**
- Google removes parameter URLs from index
- Clean product pages get more crawl priority
- Product pages may rank higher (more authority per page)

### **Month 2-3: Traffic Impact**
- Better rankings for product pages (concentrated link equity)
- Cleaner search results (only relevant pages shown)
- Faster page discovery (Google finds new products quicker)

---

## What Google CAN Still Crawl

✅ **All your valuable content:**
- `/shop` - Main shop page
- `/product/*` - All product pages (clean URLs)
- `/product-category/*` - All category pages
- `/brand/*` - All brand pages
- `/blog`, `/about`, `/contact`, `/faq`
- `/delivery-information`

Google will **NOT** waste time on:
- ❌ User cart contents
- ❌ Checkout flows
- ❌ Search result pages
- ❌ Filtered product listing variations
- ❌ Parameter URLs

---

## Crawl Budget Best Practices

### **DO:**
- ✅ Block user-specific pages
- ✅ Block parameter URLs that create duplicates
- ✅ Use canonical tags
- ✅ Keep site architecture shallow (3 clicks max to any product)
- ✅ Fix 404 errors promptly
- ✅ Use XML sitemaps for important pages

### **DON'T:**
- ❌ Block category/product pagination entirely (Google needs to find products)
- ❌ Block `/api/*` routes (these are auto-excluded in Next.js middleware)
- ❌ Over-use Disallow (be strategic)
- ❌ Block CSS/JS files (Google needs these for rendering)

---

## Expected Results

### **Immediate (Week 1):**
- Crawl stats show fewer URLs crawled
- "Excluded by robots.txt" increases in Search Console

### **Short-term (Month 1):**
- Parameter URLs drop from Google index
- Product pages get crawled more frequently
- New products appear in search faster

### **Long-term (Month 2-3):**
- Better rankings (link equity concentrated)
- Higher CTR (cleaner search results)
- Improved crawl efficiency (Google prioritizes your important pages)

---

## Testing Your robots.txt

1. **Google's Robots Testing Tool:**
   - Search Console → **robots.txt Tester**
   - Test URLs:
     - `/cart` → Should be blocked ✓
     - `/product/basmati-rice?add-to-cart=193` → Should be blocked ✓
     - `/product/basmati-rice` → Should be allowed ✓

2. **Validate Syntax:**
   - https://www.google.com/ping?sitemap=https://www.cashncarry.se/robots.txt

---

## File Locations

- **robots.txt:** `public/robots.txt`
- **Sitemap:** `app/api/sitemap/route.ts`
- **Middleware:** `middleware.ts` (already excludes `/api/*`)

---

## Support & Monitoring

Monitor monthly in **Google Search Console**:
- Crawl Stats → Crawl requests per day
- Coverage → Excluded by robots.txt
- Performance → Click-through rate

---

**Last Updated:** 2026-01-11  
**Next Review:** Monitor in 30 days to verify impact
