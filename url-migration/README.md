# URL Migration Guide - Brothers Cash & Carry
## OpenCart to WooCommerce URL Preservation

This folder contains the extracted URLs and images from your OpenCart database to help preserve SEO rankings when migrating to WooCommerce.

---

## 📁 Files Generated

### 1. **categories-complete.csv** (121 categories)
Contains all product categories with:
- Category ID
- Category Name
- Old URL Slug (if exists in OpenCart)
- Image Path (from catalog folder)
- Recommended New Slug

### 2. **brands-complete.csv** (114 brands)
Contains all manufacturers/brands with:
- Brand ID
- Brand Name
- Old URL Slug (if exists in OpenCart)
- Image Path (from catalog folder)
- Recommended New Slug

### 3. **products-with-urls.csv** (37 products)
Contains products that had custom SEO URLs in OpenCart:
- Product ID
- Product Name
- Old URL Slug
- Recommended New Slug

---

## 🎯 Next Steps

### For Categories (121 items)

1. **Open WordPress Admin** → WooCommerce → Products → Categories
2. **For each category in categories-complete.csv:**
   - Find or create the category by name
   - Set the **Slug** to match the "Old URL Slug" column (if it exists)
   - If "Old URL Slug" is empty, use the "Recommended New Slug"
   - Upload the category image from: `/catalog/[Image Path]`

**Example:**
```
Category: Basmati rice
Old Slug: (empty - no SEO URL in OpenCart)
Recommended: basmati-rice
Image: catalog/basmatirice-cat-logo.jpg
```

### For Brands (114 items)

1. **Install WooCommerce Brands Plugin** (if not already installed)
2. **Go to:** Products → Brands
3. **For each brand in brands-complete.csv:**
   - Create/find the brand by name
   - Set the **Slug** to match the "Old URL Slug" (if exists)
   - If empty, use the "Recommended New Slug"
   - Upload the brand logo from: `/catalog/[Image Path]`

**Example:**
```
Brand: Shan Foods
Old Slug: (empty)
Recommended: shan-foods
Image: catalog/Shan_Food_Industries_logo.png
```

### For Products (37 products)

These 37 products had custom SEO URLs in OpenCart. **Important for SEO!**

1. **Go to:** WooCommerce → Products
2. **For each product in products-with-urls.csv:**
   - Find the product by ID or name
   - Edit the product
   - Set the **Permalink slug** to match the "Old URL Slug" exactly
   - This preserves the original URL structure

**Example:**
```
Product: Mahmood Rice 4.5Kg
Old Slug: Mahmood_Rice_5Kg
→ Set WordPress slug to: Mahmood_Rice_5Kg
```

---

## 📌 Image Migration

All images are located in the `/catalog/` folder from your OpenCart installation:

1. **Locate your OpenCart image folder:**
   ```
   /path/to/opencart/image/catalog/
   ```

2. **Upload to WordPress:**
   - Go to Media → Add New
   - Upload all images from catalog folder
   - Maintain the same filenames

3. **Or use FTP:**
   - Upload to: `/wp-content/uploads/`
   - Create a `catalog` subfolder to maintain paths

---

## ⚠️ Important SEO Notes

### Categories & Brands
- Most categories and brands **don't have** old SEO URLs in your OpenCart database
- Use the "Recommended New Slug" which is generated from the name
- This is actually GOOD - you can create better, cleaner URLs now

### Products
- Only 37 products out of all your products had custom SEO URLs
- These are the **CRITICAL** ones to preserve for SEO
- Make sure to match the old slugs exactly for these 37 products

### URL Redirects
If you want to be extra careful about SEO:

1. **Install Redirection Plugin** in WordPress
2. **Create 301 redirects** for important pages:
   ```
   Old: /index.php?route=product_id=598
   New: /product/falak-extreme-1121-steam-rice
   ```

---

## 📊 Statistics

| Item | Total Count | With SEO URLs | Need Manual Setup |
|------|-------------|---------------|-------------------|
| Categories | 121 | 0 | All (new slugs) |
| Brands | 114 | 0 | All (new slugs) |
| Products | 37 | 37 | Match old slugs |

---

## 🔍 Finding Items by ID

If you need to find items in WordPress by their old OpenCart ID:

### Categories
OpenCart categories starting from ID 222 onwards are your real categories.
IDs below 222 appear to be test/demo categories.

### Brands
All brand IDs from 5-146 are valid brands from your store.

### Products
The 37 products with URLs are your most SEO-important products.

---

## ✅ Verification Checklist

After migration, verify:

- [ ] All 121 categories have images assigned
- [ ] All 114 brands have logos assigned
- [ ] 37 products with old URLs are accessible at their original URLs
- [ ] Test a few product URLs in Google Search Console
- [ ] Check for broken image links
- [ ] Verify category navigation works correctly

---

## 📧 Support

For issues or questions about this migration:
- Email: support@cashncarry.se
- Review the CSV files for specific item details

---

**Generated:** January 7, 2026
**Database Export:** 2026-01-05_21-01-23.sql
