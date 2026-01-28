'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Grid } from "lucide-react";

const CATEGORIES = [
    { name: "Fruits & Veg", slug: "fruits-vegetables", emoji: "🥗" },
    { name: "Rice & Grains", slug: "rice", emoji: "🍚" },
    { name: "Atta & Flour", slug: "flour", emoji: "🍞" },
    { name: "Oils & Ghee", slug: "ghee-cream-oil", emoji: "🧴" },
    { name: "Spices", slug: "spices-sauces-and-seasonings", emoji: "🧂" },
    { name: "Pickles", slug: "pickle-paste-chutney", emoji: "🏺" },
    { name: "Pasta", slug: "bulgur-pasta-vermicelli", emoji: "🍝" },
    { name: "Beverages", slug: "beverages", emoji: "🥤" },
];

export function CategoryCircleLinks() {
    return (
        <section className="w-full py-8 md:py-12 bg-background">
            <div className="w-full px-4 md:px-[50px]">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">Shop by Category</h2>
                    <Link
                        href="/shop"
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        View All
                    </Link>
                </div>

                {/* Category Grid */}
                <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={cat.slug}
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
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-card flex items-center justify-center border-2 border-card transition-all duration-300 group-hover:border-primary/20 group-hover:scale-110"
                                    style={{ boxShadow: 'var(--shadow-soft)' }}
                                >
                                    <span className="text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110">
                                        {cat.emoji}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors text-center whitespace-nowrap">
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
