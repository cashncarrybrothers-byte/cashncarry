import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromotionGrid } from "@/components/home/promotion-grid";
import { BannerStrip } from "@/components/home/banner-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
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
  // Fetch data in parallel
  const [categoriesRes, trendingRes, newArrivalsRes, dealsRes, mostSearchedRes, vegRes, snacksRes] = await Promise.all([
    getProductCategories({ per_page: 6, orderby: 'count', order: 'desc', parent: 0 }),
    getProducts({ per_page: 8, orderby: 'popularity' }),
    getProducts({ per_page: 8, orderby: 'date' }),
    getProducts({ per_page: 8, on_sale: true }),
    getProducts({ per_page: 8, orderby: 'rating' }), // Proxy for "Most Searched"
    getProducts({ per_page: 8, category: 'vegetables' }),
    getProducts({ per_page: 8, category: 'snacks' }),
  ]);

  const categories = categoriesRes || [];
  const trendingProducts = trendingRes.data || [];
  const newProducts = newArrivalsRes.data || [];
  const dealProducts = dealsRes.data || [];
  const mostSearchedProducts = mostSearchedRes.data || [];
  const vegProducts = vegRes.data || [];
  const snacksProducts = snacksRes.data || [];

  return (
    <main className="flex min-h-screen flex-col bg-background pb-20 overflow-x-hidden max-w-full">
      {/* 1. Hero Section */}
      <Hero
        title="International Groceries in Sweden"
        subtitle="From Asia, Africa, Latin America & Middle East - authentic products, fresh produce, spices, rice, and more. Quality @ Affordability, delivered to your door."
        badge="Free Delivery Over 500 SEK"
      />

      {/* 2. Promotion/Deals Grid */}
      <PromotionGrid />

      {/* 3. Top Categories */}
      <CategoryGrid categories={categories} />

      {/* 4. Special Offers */}
      <ProductShowcase
        title="Special Offers"
        products={dealProducts}
        moreLink="/deals"
      />

      {/* 5. Banner Strip */}
      <BannerStrip />

      {/* 6. Customer Favorites */}
      <ProductShowcase
        title="Customer Favorites"
        products={trendingProducts}
        moreLink="/shop?sort=bestsellers"
      />

      {/* 7. Most Searched Products */}
      <ProductShowcase
        title="Most Searched Products"
        products={mostSearchedProducts}
        moreLink="/shop?orderby=rating"
      />

      {/* 8. Fresh Veg and Fruits */}
      <ProductShowcase
        title="Fresh Fruits & Vegetables"
        products={vegProducts}
        moreLink="/product-category/vegetables"
      />

      {/* 9. Snacks */}
      <ProductShowcase
        title="Snacks & Munchies"
        products={snacksProducts}
        moreLink="/product-category/snacks"
      />

      {/* 10. New Arrivals */}
      <ProductShowcase
        title="New Arrivals"
        products={newProducts}
        moreLink="/shop?sort=new"
      />
    </main>
  );
}
