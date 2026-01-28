"use client";

import { Search, User, ShoppingCart, Menu, X, ChevronDown, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "./mobile-sidebar-toggle";
import { CartIcon } from "@/components/cart/cart-icon";
import { UserNav } from "@/components/layout/user-nav";
import { WishlistIcon } from "@/components/wishlist/wishlist-icon";
import { cn } from "@/lib/utils";

import { ProductCategoryFull } from "@/types/woocommerce";

import { MegaMenu } from "./mega-menu";

interface ContentHeaderProps {
  categories?: ProductCategoryFull[];
}

export function ContentHeader({ categories = [] }: ContentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, toggle } = useSidebar();
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const router = useRouter();

  const COUNTRY_SLUGS = ["asia", "middle-east", "africa", "latin-america", "balkan", "balka"];

  // Categories to display in generic browse dropdown (Exclude countries & uncategorized)
  const browseCategories = categories.filter(cat =>
    !COUNTRY_SLUGS.includes(cat.slug.toLowerCase()) &&
    cat.slug.toLowerCase() !== 'uncategorized'
  );

  // Categories for the "Shop by country" dropdown
  const countryCategories = categories.filter(cat =>
    COUNTRY_SLUGS.includes(cat.slug.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border/50 shadow-soft">
      <div className="w-full px-4 md:px-[50px]">
        {/* Main Header Row: Logo, Search, Icons */}
        <div className="flex items-center justify-between h-[72px] gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <div className="relative w-36 h-12 md:w-40 md:h-14 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/borthers-logo.png"
                alt="Brothers Cash & Carry"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="relative flex items-center w-full h-12 rounded-full bg-muted overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <div className="pl-5 pr-2 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground px-2"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-[calc(100%-8px)] mr-1 px-6 rounded-full font-bold text-sm transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Account - Desktop */}
            <div className="hidden sm:block">
              <UserNav />
            </div>

            {/* Wishlist */}
            <div className="hidden sm:block">
              <WishlistIcon />
            </div>

            {/* Cart */}
            <CartIcon />

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggle}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Row - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 py-3 border-t border-border/30">
          {/* Mega Menu */}
          <MegaMenu categories={browseCategories} />

          {/* Divider */}
          <div className="h-5 w-px bg-border/50" />

          {/* Shop by Country Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span className="text-lg">🌍</span>
              <span>Shop by Country</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isCountryOpen && "rotate-180")} />
            </button>

            {isCountryOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-2 animate-fade-in">
                <div className="max-h-[60vh] overflow-y-auto px-1">
                  {countryCategories.length > 0 ? (
                    countryCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/product-category/${category.slug}`}
                        className="flex items-center px-4 py-2.5 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                        onClick={() => setIsCountryOpen(false)}
                      >
                        {category.name.replace(/&amp;/g, '&')}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                      No country categories found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/deals"
              className="text-sm font-semibold text-primary flex items-center gap-1"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Special Offers
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>

            {/* Delivery Info Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                Delivery
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/delivery-information"
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Stockholm & Sweden
                  </Link>
                  <Link
                    href="/europe-delivery"
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Europe Delivery
                  </Link>
                  <Link
                    href="/delivery-goteborg-malmo"
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Göteborg & Malmö
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Search Row */}
        <div className="lg:hidden pb-3 pt-1">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center w-full h-11 rounded-full bg-muted overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="pl-4 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground px-3"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
