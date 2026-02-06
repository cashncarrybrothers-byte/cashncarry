'use client';

import { useEffect, useState } from 'react';
import { useRecentlyViewedStore } from '@/store/recently-viewed-store';
import { ProductCard } from '@/components/shop/product-card';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/woocommerce';

interface RecentlyViewedProps {
    className?: string;
    title?: string;
    excludeProductId?: number; // Exclude current product on product pages
    maxItems?: number;
}

export function RecentlyViewed({
    className,
    title = 'Recently Viewed',
    excludeProductId,
    maxItems = 10,
}: RecentlyViewedProps) {
    const { products } = useRecentlyViewedStore();
    const [mounted, setMounted] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Only render on client to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter out current product if on product page
    const filteredProducts = mounted
        ? products
            .filter((p) => p.id !== excludeProductId)
            .slice(0, maxItems)
        : [];

    // Update scroll button states
    const updateScrollButtons = (container: HTMLElement) => {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('recently-viewed-scroll');
        if (!container) return;

        const scrollAmount = 300;
        const newPosition =
            direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newPosition,
            behavior: 'smooth',
        });

        setTimeout(() => updateScrollButtons(container), 300);
    };

    // Don't render if no products or not mounted
    if (!mounted || filteredProducts.length === 0) {
        return null;
    }

    return (
        <section className={cn('w-full py-8 md:py-12', className)}>
            <div className="w-full px-4 md:px-[50px]">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                            <p className="text-sm text-muted-foreground">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                            </p>
                        </div>
                    </div>

                    {/* Scroll Buttons - Desktop Only */}
                    <div className="hidden md:flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="h-9 w-9 rounded-full"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="h-9 w-9 rounded-full"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Products Scroll Container */}
                <div className="relative">
                    <div
                        id="recently-viewed-scroll"
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        onScroll={(e) => updateScrollButtons(e.currentTarget)}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex-none w-[280px] snap-start"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlays for Scroll Indication */}
                    {canScrollLeft && (
                        <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none hidden md:block" />
                    )}
                    {canScrollRight && (
                        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none hidden md:block" />
                    )}
                </div>
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}
