import { SplitHero } from "@/components/home/split-hero";
import { TrustBadges } from "@/components/shared/trust-badges";
import { RecentlyViewed } from "@/components/shared/recently-viewed";
import { CategoryCircleLinks } from "@/components/home/category-circle-links";
import { LightningDeals } from "@/components/home/lightning-deals";
import { BannerStrip } from "@/components/home/banner-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { getProducts, getProductCategories } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { brandConfig } from "@/config/brand.config";

// Revalidate page every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${brandConfig.businessName} - International Groceries in Sweden`,
  description: "Shop international groceries online. Products from Asia, Africa, Latin America & Middle East. Fresh produce, spices, rice, halal meat & more. Fast delivery in Stockholm area!",
};

export default async function HomePage() {
  // Fetch data in parallel - 8 products per section for 8-column grid
  const [categoriesRes, trendingRes, newArrivalsRes, dealsRes, mostSearchedRes, vegRes, snacksRes] = await Promise.all([
    getProductCategories({ per_page: 12, orderby: 'count', order: 'desc', parent: 0 }),
    getProducts({ per_page: 8, orderby: 'popularity', order: 'desc' }),
    getProducts({ per_page: 8, orderby: 'date', order: 'desc' }), // Newest products first
    getProducts({ per_page: 8, on_sale: true, orderby: 'date', order: 'desc' }),
    getProducts({ per_page: 8, orderby: 'rating', order: 'desc' }), // Proxy for "Most Searched"
    getProducts({ per_page: 8, category: 'fruits-vegetables', orderby: 'date', order: 'desc' }),
    getProducts({ per_page: 8, category: 'snacks', orderby: 'date', order: 'desc' }),
  ]);

  // Enrich categories with images if missing
  const categoriesWithImages = await Promise.all(
    (categoriesRes || []).map(async (cat) => {
      // If category already has an image, return it
      if (cat.image?.src) return cat;

      try {
        // Fetch 1 product from this category to get an image
        const products = await getProducts({ category: String(cat.id), per_page: 1 });

        if (products.data.length > 0 && products.data[0].images?.length > 0) {
          // Use the product image as the category image
          const productImage = products.data[0].images[0];
          return {
            ...cat,
            image: {
              id: 0,
              src: productImage.src,
              name: cat.name,
              alt: productImage.alt || cat.name,
              date_created: new Date().toISOString(),
              date_created_gmt: new Date().toISOString(),
              date_modified: new Date().toISOString(),
              date_modified_gmt: new Date().toISOString(),
            }
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch fallback image for category ${cat.name}`);
      }

      return cat;
    })
  );

  const trendingProducts = trendingRes.data || [];
  const newProducts = newArrivalsRes.data || [];
  const dealProducts = dealsRes.data || [];
  const mostSearchedProducts = mostSearchedRes.data || [];
  const vegProducts = vegRes.data || [];
  const snacksProducts = snacksRes.data || [];

  return (
    <main className="flex min-h-screen flex-col bg-background pb-16 overflow-x-hidden">
      {/* 1. Split Hero Section */}
      <SplitHero />

      {/* 2. Trust Badges */}
      <TrustBadges className="py-6 md:py-8" />

      {/* 3. Category Quick-Links */}
      <CategoryCircleLinks categories={categoriesWithImages} />


      {/* 3. Lightning Deals (Full Width Background) */}
      <LightningDeals products={dealProducts} />

      {/* 4. Banner Strip */}
      <BannerStrip />

      {/* 5. Customer Favorites */}
      <ProductShowcase
        title="Customer Favorites"
        products={trendingProducts}
        moreLink="/shop?sort=bestsellers"
        variant="subtle"
      />

      {/* 5.5. Recently Viewed Products */}
      <RecentlyViewed />

      {/* 6. Most Searched Products */}
      <ProductShowcase
        title="Most Searched Products"
        products={mostSearchedProducts}
        moreLink="/shop?orderby=rating"
      />

      {/* 7. Fresh Veg and Fruits */}
      <ProductShowcase
        title="Fresh Fruits & Vegetables"
        products={vegProducts}
        moreLink="/product-category/fruits-vegetables"
        variant="featured"
      />

      {/* 8. Snacks */}
      <ProductShowcase
        title="Snacks & Munchies"
        products={snacksProducts}
        moreLink="/product-category/snacks"
      />

      {/* 9. New Arrivals */}
      <ProductShowcase
        title="New Arrivals"
        products={newProducts}
        moreLink="/shop?sort=new"
        variant="dark"
      />

      {/* 10. Special Offers - At bottom since Lightning Deals is at top */}
      <ProductShowcase
        title="Special Offers"
        products={dealProducts}
        moreLink="/deals"
      />

      {/* 11. Social Proof Section */}
      <Testimonials />
    </main>
  );
}
