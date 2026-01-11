'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/shop/product-card';
import type { Product } from '@/types/woocommerce';

interface LightningDealsProps {
    products: Product[];
}

export function LightningDeals({ products }: LightningDealsProps) {
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

    if (!products || products.length === 0) return null;

    return (
        <section className="bg-red-50 dark:bg-red-900/10 py-[5px] md:py-[7.5px] overflow-hidden">
            <div className="site-container">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground">Lightning Deals</h2>
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm border border-red-100 dark:border-red-900/30">
                            <Timer className="h-4 w-4 animate-pulse text-secondary" />
                            <span>Ends in:</span>
                            <span className="font-mono tabular-nums">
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/deals"
                        className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 group transition-all"
                    >
                        See All Deals
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[5px] md:gap-6">
                    {products.slice(0, 5).map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ProductCard
                                product={product}
                                className="border-red-100 dark:border-red-900/20 hover:border-secondary/50"
                            />
                            {/* Progress bar simulation like in reference */}
                            <div className="mt-3 space-y-1.5 px-1">
                                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.floor(Math.random() * 40) + 10}%` }}
                                        viewport={{ once: true }}
                                        className="bg-secondary h-full rounded-full"
                                    />
                                </div>
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                                    Limited Time Only
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
