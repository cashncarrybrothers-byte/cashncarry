"use client";

import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  X,
  Globe
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/cart-icon";
import { WishlistIcon } from "@/components/wishlist/wishlist-icon";

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
  icon?: any;
}

import type { ProductCategoryFull } from "@/types/woocommerce";

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
  "Hotpot": Flame,
  "Holiday Season": Gift,
  "New Arrivals": Star,
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
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      close();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-card border-r border-border overflow-y-auto z-50 transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ boxShadow: isOpen ? 'var(--shadow-xl)' : 'none' }}
      >
        {/* Header with Logo & Close */}
        <div className="sticky top-0 bg-primary p-4 flex items-center justify-between z-10">
          <Link href="/" onClick={close} className="block">
            <div className="relative w-32 h-10">
              <Image
                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/borthers-logo.png"
                alt="Brothers Cash & Carry"
                fill
                className="object-contain"
                sizes="128px"
                priority
                unoptimized
              />
            </div>
          </Link>
          <button
            onClick={close}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-muted/50"
            />
          </form>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Link
              href="/deals"
              onClick={close}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 rounded-xl hover:bg-primary/15 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Percent className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold text-primary">
                  Deals & Offers
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/shop"
              onClick={close}
              className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-semibold">All Products</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/brands"
              onClick={close}
              className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-semibold">Shop by Brands</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Shop by Country */}
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold">Shop by Country</span>
              </div>
              {isCountryOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {isCountryOpen && (
              <div className="p-2 space-y-1 bg-card">
                {countries.map((country) => {
                  const isActive = pathname?.includes(`/product-category/${country.slug}`);
                  return (
                    <Link
                      key={country.slug}
                      href={`/product-category/${country.slug}`}
                      onClick={close}
                      className={cn(
                        "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-white"
                          : "text-foreground hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {country.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Charts */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">Top Charts</h2>
            </div>
            <div className="space-y-1">
              <Link
                href="/shop?sort=bestsellers"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">1</div>
                <span>Best Sellers</span>
              </Link>
              <Link
                href="/shop?sort=new"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
                <span>New Arrivals</span>
              </Link>
              <Link
                href="/shop?sort=trending"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</div>
                <span>Trending Now</span>
              </Link>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h2 className="text-sm font-bold mb-3 px-1">Categories</h2>
            <div className="space-y-1">
              {categories.slice(0, 12).map((category) => {
                const IconComponent = categoryIcons[category.name] || Package;
                const isHovered = hoveredCategory === category.id;
                const decodedName = category.name.replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'");

                return (
                  <Link
                    key={category.id}
                    href={`/product-category/${category.slug}`}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group",
                      isHovered ? "bg-primary/10" : "hover:bg-muted"
                    )}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className={cn(
                      "p-1.5 rounded-lg transition-all",
                      isHovered
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium transition-colors flex-1",
                      isHovered ? "text-primary font-semibold" : ""
                    )}>
                      {decodedName}
                    </span>
                    {category.count > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {category.count}
                      </span>
                    )}
                  </Link>
                );
              })}
              {categories.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg">
                  No categories found.
                </div>
              )}
              {categories.length > 12 && (
                <Link
                  href="/shop/categories"
                  onClick={close}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:underline"
                >
                  View All Categories
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="pt-4 border-t border-border space-y-1">
            <Link
              href="/my-account"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">My Account</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Wishlist</span>
              <div className="ml-auto">
                <WishlistIcon />
              </div>
            </Link>
            <Link
              href="/my-account?tab=orders"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">My Orders</span>
            </Link>
            <Link
              href="/cart"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Cart</span>
              <div className="ml-auto">
                <CartIcon />
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
