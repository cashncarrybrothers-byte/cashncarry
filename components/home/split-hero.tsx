'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SplitHero() {
    return (
        <section className="w-full py-8 bg-background">
            <div className="site-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Large Banner (8/12) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-8 relative rounded-[2rem] overflow-hidden group shadow-xl h-[350px] sm:h-[450px] bg-gradient-to-br from-primary via-red-600 to-rose-700"
                    >
                        {/* Abstract Pattern overlay */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest border border-white/30"
                            >
                                Weekly Specials
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="font-heading text-3xl sm:text-5xl font-black mb-4 leading-tight"
                            >
                                Your Favorite <br />
                                <span className="text-secondary">International Market</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm sm:text-base text-gray-100 mb-6 max-w-md font-medium leading-relaxed"
                            >
                                Authentic flavors from Asia, Africa, and the Middle East delivered straight to your doorstep in Sweden.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold py-6 px-8 rounded-full w-fit transition-all shadow-xl group">
                                    <Link href="/shop" className="flex items-center gap-2 text-base">
                                        Shop Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side Promo Banners (4/12) */}
                    <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">

                        {/* Promo 1 - Spices & Rice Theme */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative rounded-[2rem] overflow-hidden shadow-md group h-[180px] sm:h-[212px] bg-amber-100 dark:bg-amber-900/20 border border-amber-200/50"
                        >
                            <div className="absolute inset-0 p-8 flex flex-col justify-center">
                                <span className="text-amber-600 font-bold text-[10px] uppercase tracking-wider mb-2">Deal of the day</span>
                                <h3 className="font-heading text-2xl font-black mb-1 text-amber-800 dark:text-amber-200">Extra 20% OFF</h3>
                                <p className="text-sm font-bold mb-4 text-amber-700 dark:text-amber-300">On All Spices & Rice Essentials</p>
                                <Link href="/deals" className="text-xs font-black uppercase tracking-tighter text-amber-900 dark:text-amber-100 flex items-center gap-1 group/link">
                                    Check Deals <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Promo 2 - Exotic Fruits/Fresh Theme */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="relative rounded-[2rem] overflow-hidden shadow-md group h-[180px] sm:h-[212px] bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200/50"
                        >
                            <div className="absolute inset-0 p-8 flex flex-col justify-center">
                                <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider mb-2">Fresh Arrival</span>
                                <h3 className="font-heading text-2xl font-black mb-1 text-emerald-800 dark:text-emerald-200">Exotic Fruits</h3>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-bold mb-4">Starting at <span className="text-emerald-600 text-lg">29 kr</span></p>
                                <Link href="/product-category/vegetables" className="text-xs font-black uppercase tracking-tighter text-emerald-900 dark:text-emerald-100 flex items-center gap-1 group/link">
                                    Shop Fresh <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
