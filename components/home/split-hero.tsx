'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SplitHero() {
    return (
        <section className="w-full py-[15px] bg-background">
            <div className="site-container">
                <div className="flex flex-col gap-[15px]">

                    {/* Main Large Banner (Full Width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full relative rounded-[2rem] overflow-hidden group shadow-xl h-[350px] sm:h-[450px]"
                    >
                        {/* Background Image */}
                        <Image
                            src="https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-1.jpg"
                            alt="Cash & Carry Cover"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            quality={100}
                        />



                        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 text-white/90 z-10">
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
                                className="font-heading text-3xl sm:text-5xl font-black mb-4 leading-tight text-white"
                            >
                                Your Favorite <br />
                                <span className="text-[#ffff04]">International Market</span>
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

                    {/* Bottom Promo Banners (50% Split) */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-[15px]">

                        {/* Promo 1 - Spices & Rice Theme */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative rounded-[2rem] overflow-hidden shadow-md group h-[180px] sm:h-[212px]"
                        >
                            {/* Background Image */}
                            <Image
                                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-2.jpg"
                                alt="Spices & Rice Deal"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={100}
                            />



                            <div className="absolute inset-0 p-8 flex flex-col justify-center z-10">
                                <span className="text-green-400 font-bold text-[10px] uppercase tracking-wider mb-2">Deal of the day</span>
                                <h3 className="font-heading text-2xl font-black mb-1 text-[#00ff00]">Extra 20% OFF</h3>
                                <p className="text-sm font-bold mb-4 text-white">On All Spices & Rice Essentials</p>
                                <Link href="/deals" className="text-xs font-black uppercase tracking-tighter text-white flex items-center gap-1 group/link hover:text-green-400 transition-colors">
                                    Check Deals <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Promo 2 - Exotic Fruits/Fresh Theme */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="relative rounded-[2rem] overflow-hidden shadow-md group h-[180px] sm:h-[212px]"
                        >
                            {/* Background Image */}
                            <Image
                                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-3.jpg"
                                alt="Exotic Fruits"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={100}
                                priority
                            />

                            <div className="absolute inset-0 p-8 flex flex-col justify-center z-10">
                                <span className="text-white/90 font-bold text-[10px] uppercase tracking-wider mb-2">Fresh Arrival</span>
                                <h3 className="font-heading text-2xl font-black mb-1 text-white">Exotic Fruits</h3>
                                <p className="text-sm text-gray-100 font-bold mb-4">Starting at <span className="text-white text-lg">29 kr</span></p>
                                <Link href="/product-category/vegetables" className="text-xs font-black uppercase tracking-tighter text-white flex items-center gap-1 group/link hover:text-white/80 transition-colors">
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
