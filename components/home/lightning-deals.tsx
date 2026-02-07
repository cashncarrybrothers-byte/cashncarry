'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/product-card';
import type { Product } from '@/types/woocommerce';

interface LightningDealsProps {
    products: Product[];
}

export function LightningDeals({ products }: LightningDealsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState({
        hours: 16,
        minutes: 5,
        seconds: 11
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        }
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="bg-primary/5 py-8 md:py-12 overflow-hidden">
            <div className="w-full px-4 md:px-[50px]">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary fill-primary" />
                            <h2 className="h2 text-foreground">
                                Lightning Deals
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 text-primary bg-card px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/20"
                            style={{ boxShadow: 'var(--shadow-sm)' }}
                        >
                            <Timer className="h-3.5 w-3.5 md:h-4 md:w-4 animate-pulse" />
                            <span className="label-text hidden sm:inline">Ends in:</span>
                            <span className="font-mono tabular-nums font-bold text-sm md:text-base">
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
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
                            href="/deals"
                            className="text-primary hover:underline font-semibold text-xs md:text-sm flex items-center gap-1 transition-all"
                        >
                            <span className="hidden sm:inline">See All</span> Deals
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Single Row Horizontal Scroll - 2 products on mobile */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
                >
                    {products.slice(0, 8).map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="min-w-[calc(50%-6px)] w-[calc(50%-6px)] sm:min-w-[200px] sm:w-[200px] md:min-w-[220px] md:w-[220px] lg:min-w-[240px] lg:w-[240px] flex-shrink-0"
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
