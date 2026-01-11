"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "./mobile-sidebar-toggle";
import {
  Search,
  TrendingUp,
  Percent,
  ShoppingCart,
  Apple,
  Beef,
  Milk,
  Croissant,
  Fish,
  Carrot,
  Wine,
  IceCream,
  Cookie,
  Coffee,
  ChevronRight,
  Home,
  User,
  Heart,
  Package,
  Flame,
  Gift,
  Star,
  ChefHat,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/cart-icon";
import { WishlistIcon } from "@/components/wishlist/wishlist-icon";
import { UserNav } from "@/components/layout/user-nav";

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
  icon?: any;
}

import type { ProductCategoryFull } from "@/types/woocommerce";

// ... existing imports

// Map category names to icons
const categoryIcons: Record<string, any> = {
  "Fruits & Vegetables": Apple,
  "Fruits": Apple,
  "Vegetables": Carrot,
  "Meat & Seafood": Beef,
  "Meat": Beef,
  "Seafood": Fish,
  "Dairy & Eggs": Milk,
  "Bakery": Croissant,
  "Fresh Bakery": Croissant,
  "Beverages": Wine,
  "Frozen Foods": IceCream,
  "Frozen": IceCream,
  "Snacks": Cookie,
  "Coffee & Tea": Coffee,
  "Hotpot": Flame, // Need to import Flame
  "Holiday Season": Gift, // Need to import Gift
  "New Arrivals": Star, // Need to import Star
  "Deals": Percent,
};

const countries = [
  { name: "Asia", slug: "asia" },
  { name: "Middle East", slug: "middle-east" },
  { name: "Africa", slug: "africa" },
  { name: "Latin America", slug: "latin-america" },
  { name: "Balkan", slug: "balkan" },
];

interface VerticalSidebarProps {
  categories: ProductCategoryFull[];
}

export function VerticalSidebar({ categories = [] }: VerticalSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();

  // Group categories if needed? For now just list them.
  // ... useEffect for click outside

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "fixed left-0 top-0 lg:top-[44px] h-screen lg:h-[calc(100vh-44px)] w-64 bg-background border-r border-border overflow-y-auto z-40 transition-transform duration-300",
          // Mobile: slide in/out
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col p-2 space-y-2">
          {/* Logo */}
          <Link href="/" className="block w-full py-1 hover:opacity-90 transition-opacity">
            <div className="relative w-full aspect-[1.8]">
              <Image
                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/borthers-logo.png"
                alt="Brothers Cash & Carry"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 256px"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Select Store / Country Section */}
          <div className="mx-0 rounded-xl bg-blue-50 dark:bg-blue-950/20 overflow-hidden mb-2">
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className="flex items-center justify-between w-full p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Select store</span>
              </div>
              {isStoreOpen ? (
                <ChevronUp className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-blue-500" />
              )}
            </button>

            {isStoreOpen && (
              <div className="pb-2 px-2 space-y-0.5">
                {countries.map((country) => {
                  const isActive = pathname?.includes(`/product-category/${country.slug}`);
                  return (
                    <Link
                      key={country.slug}
                      href={`/product-category/${country.slug}`}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-blue-700 text-white shadow-sm"
                          : "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                      )}
                    >
                      {country.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Bar - Visible on mobile sidebar primarily */}
          <div className="relative lg:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-background"
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Link
              href="/deals"
              className="flex items-center justify-between px-3 py-2 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-500 rounded-md shadow-sm">
                  <Percent className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  Deals & Offers
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-red-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg hover:border-green-600 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-muted-foreground group-hover:text-green-600" />
                <span className="text-sm font-medium">All Products</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/brands"
              className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span className="text-sm font-medium">Shop by Brands</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Top Charts */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h2 className="text-sm font-bold text-foreground">Top Charts</h2>
            </div>
            <div className="space-y-0.5">
              <Link
                href="/shop?sort=bestsellers"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-green-600 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-[10px] font-bold">1</div>
                <span className="font-medium">Best Sellers</span>
              </Link>
              <Link
                href="/shop?sort=new"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-green-600 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">2</div>
                <span className="font-medium">New Arrivals</span>
              </Link>
              <Link
                href="/shop?sort=trending"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-green-600 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">3</div>
                <span className="font-medium">Trending Now</span>
              </Link>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h2 className="text-sm font-bold text-foreground mb-2 px-1">Categories</h2>
            <div className="space-y-0.5">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.name] || Package;
                const isHovered = hoveredCategory === category.id;
                // Decode HTML entities (e.g., &amp; -> &)
                const decodedName = category.name.replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'");

                return (
                  <Link
                    key={category.id}
                    href={`/product-category/${category.slug}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group border border-transparent",
                      isHovered ? "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900" : "hover:bg-muted"
                    )}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className={cn(
                      "p-1.5 rounded-md transition-all duration-300",
                      isHovered
                        ? "bg-green-600 text-white shadow-md scale-105"
                        : "bg-muted text-muted-foreground group-hover:bg-green-100 dark:group-hover:bg-green-950/30 group-hover:text-green-600"
                    )}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isHovered ? "text-green-700 dark:text-green-400 font-bold" : "text-foreground"
                    )}>
                      {decodedName}
                    </span>
                    {category.count > 0 && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted group-hover:bg-white dark:group-hover:bg-black/20 text-muted-foreground">
                        {category.count}
                      </span>
                    )}
                  </Link>
                );
              })}
              {categories.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
                  No categories found.
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="pt-2 border-t border-border space-y-0.5">
            <Link
              href="/my-account"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">My Account</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Wishlist</span>
              <div className="ml-auto">
                <WishlistIcon />
              </div>
            </Link>
            <Link
              href="/my-account?tab=orders"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">My Orders</span>
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cart</span>
              <div className="ml-auto">
                <CartIcon />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
