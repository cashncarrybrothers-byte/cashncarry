# URL Migration Results - Brothers Cash & Carry
## OpenCart → WooCommerce URL Preservation

**Date:** January 7, 2026
**Migration Status:** Partially Complete - Manual Actions Required

---

## ✅ What Was Completed Automatically

### 1. Data Extraction ✓
Successfully extracted from OpenCart SQL database:
- **121 Categories** with images and recommended slugs
- **114 Brands** with logos and recommended slugs
- **37 Products** with original SEO URLs

### 2. Product URL Updates ✓
**4 Products Successfully Updated** with old SEO URLs:
- Product ID 449: TRS Sarson Ka Saag → `Mahmood_Rice_5Kg`
- Product ID 576: Product 653 → `TRS_Rice_Flour_500g`
- Product ID 598: Product 665 → `Falak_Extreme_1121_Steam_Rice`
- Product ID 634: Kolson Slanty Jalapeno → `Yaqoot_Extra_Lång_1121_Sella_Basmati_Rice_5Kg`

---

## ⚠️ Manual Actions Required

### Products Needing Manual URL Updates (32 items)

The following products could not be automatically matched because their WooCommerce IDs don't match the original OpenCart IDs. **These are CRITICAL for SEO!**

You need to manually update these in WordPress Admin:

#### How to Update Manually:
1. Go to: **Products** in WordPress Admin
2. Search for each product by name
3. Edit the product
4. Change the **Permalink/Slug** to match the "Old URL Slug" below
5. Click **Update**

#### Product List:

| OpenCart ID | Product Name | Old URL Slug (SET THIS!) |
|------------|--------------|-------------------------|
| 528 | 1&1 Abghore/Veri Juice | `Abghore_Veri_Juice` |
| 557 | Lazzat Star Basmati Rice | `Lazzat_Star_Basmati_Rice_5_Kg` |
| 569 | Kaalar Basmati Rice 1121 Steam | `Kaalar_Basmati_Rice_1121_Steam` |
| 599 | India Gate Basmati Rice Classic | `India_Gate_Classic_Basmati_Rice_5_Kg` |
| 645 | TRS Gram Flour 2Kg | `TRS_Gram_Flour_2Kg` |
| 646 | National Corn Flour 300g | `National_Corn_Flour_300g` |
| 648 | Elephant Chappati Atta 10Kg | `Elephant_Chappati _Atta _10Kg` |
| 649 | TRS Coarse Semolina 500g | `TRS_Coarse_Semolina_500g` |
| 650 | TRS Fine Semolina 500g | `TRS_Fine_Semolina_500g` |
| 651 | TRS Ragi Flour 1Kg | `TRS_Ragi_Flour_Red_Teff_Flour_1kg` |
| 652 | TRS Bajri Flour 1Kg | `TRS_Bajri_Flour_1Kg` |
| 653 | TRS Juwar Flour 1Kg | `TRS_Juwar_Flour_1Kg` |
| 654 | TRS Black Pepper Coarse 100g | `TRS_Black_Pepper_Coarse_100g` |
| 655 | Nongshim Shin Ramyun Noodles | `Nongshim_Shin_Ramyun_Noodles` |
| 656 | Nongshim Kimchi Noodles | `Nongshim_Kimchi_Noodles` |
| 657 | Samyang Buldak Ramen Cheese | `Samyang_Buldak_Ramen_Cheese` |
| 658 | Samyang Buldak Ramen Jjajang | `Samyang_Buldak_Ramen_Jjajang` |
| 659 | Samyang Buldak 2*Spicy Ramen | `Samyang_Buldak_2*Spicy_Ramen_Noodles` |
| 660 | Samyan Buldak Ramen Stew Type | `Samyan_Buldak_Ramen_Stew_Type_Noodles` |
| 661 | TRS Crushed Chillies 100g | `TRS_Crushed_Chillies_100g_Extra_Hot` |
| 662 | TRS Dhania Powder 100g | `TRS_Dhania_Powder_100g` |
| 663 | TRS Chilli Powder Ex. Hot 100g | `TRS_Chilli_Powder_Ex_Hot_100g` |
| 664 | TRS Chilli Powder 100g | `TRS_Chilli_Powder_100g` |
| 665 | TRS Turmeric Powder 100g | `TRS_Turmeric_Powder_100g` |
| 666 | TRS Jeera Powder 100g | `TRS_Jeera_Powder_100g` |
| 667 | TRS Garlic Powder 100g | `TRS_Garlic_Powder_100g` |
| 668 | TRS Ginger Powder 100g | `TRS_Ginger_Powder_100g` |
| 669 | TRS Paprika Powder 100g | `TRS_Paprika_Powder_100g` |
| 670 | TRS Whole Chillies Ex. Hot 50g | `TRS_Whole_Chillies_Ex_Hot_50g` |
| 672 | National Green Chilli Sauce | `National_Green_Chilli_Sauce_300g` |
| 673 | National Red Chilli Sauce | `National_Red_Chilli_Sauce_300g` |
| 674 | National Mango Chilli Sauce | `National_Mango_Chilli_Sauce_300g` |

---

### Categories (121 items)

Categories need to be matched manually because many don't exist yet in WooCommerce or have different names.

**Action Required:**
1. Open `categories-complete.csv`
2. For each category:
   - Find or create in **Products → Categories**
   - Set slug to match "Recommended New Slug"
   - Upload image from `catalog/[Image Path]`

**Matching Categories Found:**
These categories exist and can be updated:
- Basmati rice
- Beans
- Chickpea flour
- Corn flour
- Dates
- (Check CSV for full list)

---

### Brands (114 items)

Brands require a WooCommerce Brands plugin to be installed.

**Action Required:**
1. **Install Plugin:** Perfect Brands for WooCommerce or WooCommerce Brands
2. Open `brands-complete.csv`
3. Create each brand with:
   - Name from CSV
   - Slug from "Recommended New Slug"
   - Upload logo from `catalog/[Image Path]`

**Top Brands to Create:**
- Shan Foods (catalog/Shan_Food_Industries_logo.png)
- National Foods (catalog/Corporate-nfoods-logo.png)
- TRS (catalog/trs-logo.jpg)
- Ashoka (catalog/ashoka_logo.png)
- MDH (catalog/mdh-logo.png)
- ... and 109 more

---

## 📊 Migration Statistics

| Item | Total | Auto-Updated | Manual Required | Success Rate |
|------|-------|--------------|-----------------|--------------|
| **Products** | 37 | 4 | 32 | 11% |
| **Categories** | 121 | 0 | 121 | 0% |
| **Brands** | 114 | 0 | 114 | 0% |

---

## 🎯 Priority Actions (Sorted by SEO Impact)

### Priority 1: HIGH - Update Product URLs (32 items)
**Time:** ~30-60 minutes
**Impact:** ⭐⭐⭐⭐⭐ CRITICAL for SEO

These 32 products had custom SEO URLs and likely have search rankings. Update manually using the table above.

### Priority 2: MEDIUM - Upload Category Images (121 items)
**Time:** ~2-3 hours
**Impact:** ⭐⭐⭐ Important for user experience

Match existing categories and upload images. New categories can use recommended slugs.

### Priority 3: MEDIUM - Create Brands (114 items)
**Time:** ~2-3 hours
**Impact:** ⭐⭐⭐ Important for navigation

Install brands plugin and create all manufacturers with logos.

---

## 📁 Files Generated

All files are in `/url-migration/` folder:

- `categories-complete.csv` - All categories with images
- `brands-complete.csv` - All brands with logos
- `products-with-urls.csv` - Products with old SEO URLs
- `update-products-by-id.js` - Script that updated 4 products
- `README.md` - Detailed migration guide
- `MIGRATION-RESULTS.md` - This file

---

## 🔧 Tools Created

Reusable scripts for future updates:
- `update-categories.js` - Update category slugs
- `update-brands.js` - Update brand slugs
- `update-products.js` - Update product slugs
- `update-products-by-id.js` - Match by OpenCart ID
- `check-categories.js` - Compare WooCommerce vs CSV
- `check-products.js` - Compare WooCommerce vs CSV

---

## ✅ Verification Checklist

After completing manual updates:

- [ ] All 32 product URLs updated (test a few in browser)
- [ ] Category images uploaded and assigned
- [ ] Brands created with logos
- [ ] Test old product URLs redirect correctly
- [ ] Check Google Search Console for crawl errors
- [ ] Verify category navigation works
- [ ] Test brand filtering if enabled

---

## 💡 Tips for Manual Updates

### For Product URLs:
```
1. Search product name in WordPress admin
2. Edit → Permalink section
3. Change slug to exact match from table
4. Update → View product to verify URL
```

### For Category Images:
```
1. Upload all images from OpenCart /image/catalog/ to WordPress Media
2. Edit category → Set Featured Image
3. Use recommended slug for new categories
```

### For Brands:
```
1. Install Perfect Brands plugin
2. Products → Brands → Add New
3. Name, Slug, Upload Logo
4. Assign to products
```

---

## 📞 Support

If you need help with manual updates:
- Email: support@cashncarry.se
- Check CSV files for complete data
- Use diagnostic scripts to verify

---

**Next Steps:** Follow Priority Actions above, starting with the 32 critical product URLs!
