"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/woocommerce";
import { useRef } from "react";

interface ProductShowcaseProps {
    title: string;
    subtitle?: string;
    products: Product[];
    moreLink?: string;
}

export function ProductShowcase({
    title,
    subtitle,
    products,
    moreLink = "/shop",
}: ProductShowcaseProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!products || products.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="w-full py-6 md:py-10">
            <div className="w-full px-4 md:px-[50px]">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Navigation Arrows - Hidden on mobile */}
                        <button
                            onClick={() => scroll('left')}
                            className="hidden md:flex w-9 h-9 rounded-full bg-card border border-border items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5 text-foreground" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="hidden md:flex w-9 h-9 rounded-full bg-card border border-border items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5 text-foreground" />
                        </button>
                        <Link
                            href={moreLink}
                            className="flex items-center gap-1 text-xs md:text-sm font-semibold text-primary hover:underline transition-colors"
                        >
                            <span className="hidden sm:inline">View All</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Single Row Horizontal Scroll - 2 products on mobile, more on desktop */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
                >
                    {products.slice(0, 8).map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[200px] sm:w-[200px] md:min-w-[220px] md:w-[220px] lg:min-w-[240px] lg:w-[240px] flex-shrink-0"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
