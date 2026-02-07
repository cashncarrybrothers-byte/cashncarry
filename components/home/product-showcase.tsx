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
    variant?: 'default' | 'subtle' | 'featured' | 'dark';
}

export function ProductShowcase({
    title,
    subtitle,
    products,
    moreLink = "/shop",
    variant = 'default',
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

    const getVariantStyles = () => {
        switch (variant) {
            case 'subtle':
                return 'bg-muted/30';
            case 'featured':
                return 'bg-primary/5 border-y border-primary/10';
            case 'dark':
                return 'bg-primary-950 text-white';
            default:
                return 'bg-background';
        }
    };

    const getTitleStyles = () => {
        if (variant === 'dark') return 'text-white';
        return 'text-foreground';
    };

    return (
        <section className={`w-full py-8 md:py-14 transition-colors duration-500 ${getVariantStyles()}`}>
            <div className="w-full px-4 md:px-[50px]">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className={`h2 ${getTitleStyles()} tracking-tight`}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p className={`body-sm mt-2 opacity-80 ${variant === 'dark' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Navigation Arrows - Hidden on mobile */}
                        <button
                            onClick={() => scroll('left')}
                            className={`hidden md:flex w-10 h-10 rounded-full border items-center justify-center transition-all hover:scale-105 active:scale-95 ${variant === 'dark'
                                ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                                : 'bg-white border-border hover:bg-muted text-foreground shadow-sm'
                                }`}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={`hidden md:flex w-10 h-10 rounded-full border items-center justify-center transition-all hover:scale-105 active:scale-95 ${variant === 'dark'
                                ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                                : 'bg-white border-border hover:bg-muted text-foreground shadow-sm'
                                }`}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <Link
                            href={moreLink}
                            className={`flex items-center gap-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all hover:gap-2 ${variant === 'dark' ? 'text-white' : 'text-primary'
                                }`}
                        >
                            <span className="hidden sm:inline">Explore All</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Single Row Horizontal Scroll - 2 products on mobile, more on desktop */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
                >
                    {products.slice(0, 10).map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[calc(60%-12px)] w-[calc(60%-12px)] sm:min-w-[220px] sm:w-[220px] md:min-w-[260px] md:w-[260px] lg:min-w-[280px] lg:w-[280px] flex-shrink-0"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {/* View More Card at the end */}
                    <div className="min-w-[120px] sm:min-w-[180px] flex items-center justify-center">
                        <Link
                            href={moreLink}
                            className={`group flex flex-col items-center gap-3 transition-transform hover:scale-105 ${variant === 'dark' ? 'text-white' : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-colors ${variant === 'dark'
                                ? 'border-white/20 group-hover:bg-white/10'
                                : 'border-neutral-100 group-hover:border-primary group-hover:bg-primary/5'
                                }`}>
                                <ArrowRight className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-tight">Show All</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
