"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/woocommerce";

interface ProductShowcaseProps {
    title: string;
    products: Product[];
    moreLink?: string;
}

export function ProductShowcase({ title, products, moreLink = "/shop" }: ProductShowcaseProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full py-[5px] md:py-[7.5px]">
            <div className="site-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">
                        {title}
                    </h2>
                    <Button variant="ghost" size="sm" className="rounded-full text-xs h-8 font-bold text-primary" asChild>
                        <Link href={moreLink} className="flex items-center gap-1">
                            <span>View All</span>
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative">
                    <div className="flex overflow-x-auto gap-[5px] md:gap-6 pb-6 scrollbar-hide snap-x">
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[200px] w-[200px] sm:min-w-[240px] sm:w-[240px] md:min-w-[280px] md:w-[280px] snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
