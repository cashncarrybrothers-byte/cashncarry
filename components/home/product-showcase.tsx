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
        <section className="w-full py-[15px]">
            <div className="site-container">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground tracking-tight">
                        {title}
                    </h2>
                    <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium h-9 text-primary hover:text-primary hover:bg-primary/5" asChild>
                        <Link href={moreLink} className="flex items-center gap-1.5">
                            <span>View All</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative">
                    <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[200px] w-[200px] sm:min-w-[240px] sm:w-[240px] md:min-w-[260px] md:w-[260px] snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
