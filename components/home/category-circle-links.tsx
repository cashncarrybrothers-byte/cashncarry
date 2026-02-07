'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Grid } from "lucide-react";
import type { ProductCategoryFull } from "@/types/woocommerce";

interface CategoryCircleLinksProps {
    categories: ProductCategoryFull[];
}

export function CategoryCircleLinks({ categories }: CategoryCircleLinksProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="w-full py-8 md:py-12 bg-background">
            <div className="w-full px-4 md:px-[50px]">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="h2 text-foreground">Shop by Category</h2>
                    <Link
                        href="/shop"
                        className="label-text text-primary hover:underline"
                    >
                        View All
                    </Link>
                </div>

                {/* Category Grid */}
                <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link
                                href={`/product-category/${cat.slug}`}
                                className="flex flex-col items-center gap-3 min-w-[90px] group"
                            >
                                <div
                                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-card flex items-center justify-center border-2 border-card overflow-hidden transition-all duration-300 group-hover:border-primary/20 group-hover:scale-110"
                                    style={{ boxShadow: 'var(--shadow-soft)' }}
                                >
                                    {cat.image ? (
                                        <Image
                                            src={cat.image.src}
                                            alt={cat.image.alt || cat.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 80px, 96px"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-muted-foreground/30">
                                            {cat.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <span className="label-text text-muted-foreground group-hover:text-primary transition-colors text-center whitespace-nowrap max-w-[100px] truncate">
                                    {cat.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}

                    {/* View All Circle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            href="/shop"
                            className="flex flex-col items-center gap-3 min-w-[90px] group"
                        >
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center border-2 border-muted transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:scale-110"
                                style={{ boxShadow: 'var(--shadow-soft)' }}
                            >
                                <Grid className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors text-center whitespace-nowrap">
                                View All
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
