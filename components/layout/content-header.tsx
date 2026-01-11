"use client";

import { Search, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "./mobile-sidebar-toggle";
import { CartIcon } from "@/components/cart/cart-icon";
import { UserNav } from "@/components/layout/user-nav";
import { cn } from "@/lib/utils";

import { ProductCategoryFull } from "@/types/woocommerce";

interface ContentHeaderProps {
  categories?: ProductCategoryFull[];
}

export function ContentHeader({ categories = [] }: ContentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, toggle } = useSidebar();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b border-border shadow-sm">
      <div className="w-full px-4 md:px-8">
        {/* Row 1: Logo, Search, Icons */}
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-40 h-14">
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

          {/* Search Bar - Middle - Expanded */}
          <div className="hidden lg:flex flex-1 max-w-4xl desktop-search-container">
            <form onSubmit={handleSearch} className="relative group w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for groceries, fresh produce and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-2.5 text-sm border-2 border-border/40 rounded-full focus:outline-none focus:border-primary focus:ring-0 bg-white hover:bg-white transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm"
              />
            </form>
          </div>

          {/* Right Icons: Support, Login, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors border border-border">
              <span className="sr-only">Support</span>
              <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <div className="hidden sm:block">
              <UserNav />
            </div>
            <CartIcon />
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggle}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
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

        {/* Row 2: Categories & Navigation */}
        <div className="hidden lg:flex items-center gap-8 py-2 border-t border-border/10">
          {/* Categories Dropdown Trigger */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 group transition-all text-foreground font-bold text-sm hover:text-primary"
            >
              <Menu className="h-5 w-5" />
              <span>Browse Categories</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isCategoryOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 py-3 animate-in fade-in slide-in-from-top-2">
                <div className="max-h-[70vh] overflow-y-auto px-2 space-y-1 scrollbar-thin">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/product-category/${category.slug}`}
                      className="flex items-center px-4 py-2.5 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium border border-transparent hover:border-primary/10"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {category.name.replace(/&amp;/g, '&')}
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                      No categories found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/shop"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              Shop Online
            </Link>
            <Link
              href="/deals"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/shop"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/blog"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              Contact
            </Link>

            {/* Delivery Dropdown */}
            <div className="relative group">
              <button className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
                Delivery Info
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/delivery-information"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Stockholm & Sweden Delivery
                  </Link>
                  <Link
                    href="/europe-delivery"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Europe Delivery
                  </Link>
                  <Link
                    href="/delivery-goteborg-malmo"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    Göteborg & Malmö Delivery
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="text-[13px] font-bold text-foreground/80 hover:text-primary transition-colors"
            >
              Store Locator
            </Link>
          </nav>
        </div>

        {/* Mobile Search Row - visible on small screens only */}
        <div className="lg:hidden pb-4 pt-1">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-muted-foreground/70" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-6 py-2.5 text-sm border border-border/60 rounded-full focus:outline-none focus:border-primary bg-muted/30"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
