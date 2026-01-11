'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Grid } from "lucide-react";

const CATEGORIES = [
    { name: "Fruits & Veg", slug: "fruits-vegetables", emoji: "🥗", color: "bg-emerald-100", darkColor: "dark:bg-emerald-900/30", textColor: "text-emerald-700" },
    { name: "Rice & Grains", slug: "rice", emoji: "🍚", color: "bg-orange-100", darkColor: "dark:bg-orange-900/30", textColor: "text-orange-700" },
    { name: "Atta & Flour", slug: "flour", emoji: "🍞", color: "bg-stone-100", darkColor: "dark:bg-stone-900/30", textColor: "text-stone-700" },
    { name: "Oils & Ghee", slug: "ghee-cream-oil", emoji: "🧴", color: "bg-amber-100", darkColor: "dark:bg-amber-900/30", textColor: "text-amber-700" },
    { name: "Spices", slug: "spices-sauces-and-seasonings", emoji: "🧂", color: "bg-red-100", darkColor: "dark:bg-red-900/30", textColor: "text-red-700" },
    { name: "Pickles", slug: "pickle-paste-chutney", emoji: "🏺", color: "bg-lime-100", darkColor: "dark:bg-lime-900/30", textColor: "text-lime-700" },
    { name: "Pasta", slug: "bulgur-pasta-vermicelli", emoji: "🍝", color: "bg-yellow-100", darkColor: "dark:bg-yellow-900/30", textColor: "text-yellow-700" },
    { name: "Beverages", slug: "beverages", emoji: "🥤", color: "bg-cyan-100", darkColor: "dark:bg-cyan-900/30", textColor: "text-cyan-700" },
];

export function CategoryCircleLinks() {
    return (
        <section className="w-full py-[5px] md:py-[7.5px] bg-background">
            <div className="site-container">
                <div className="grid grid-cols-3 md:grid-cols-9 gap-4 sm:gap-6">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link
                                href={`/product-category/${cat.slug}`}
                                className="flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] ${cat.color} ${cat.darkColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md border border-white/50`}>
                                    <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:drop-shadow-md transition-all">{cat.emoji}</span>
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-center text-foreground group-hover:text-primary transition-colors truncate w-full">
                                    {cat.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}

                    {/* View All */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            href="/shop"
                            className="flex flex-col items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md border border-white/50">
                                <Grid className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-center text-foreground group-hover:text-primary transition-colors">
                                View All
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
