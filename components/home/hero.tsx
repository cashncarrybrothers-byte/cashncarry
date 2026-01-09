'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    title?: string;
    subtitle?: string;
    badge?: string;
}

export function Hero({
    title = "Fresh Groceries Delivered to Your Door",
    subtitle = "Experience the finest selection of organic produce, pantry staples, and international delicacies. Delivered fresh, daily.",
    badge = "Premium Quality Guaranteed"
}: HeroProps) {
    return (
        <section className="w-full h-auto lg:h-[200px] flex items-center justify-center overflow-hidden bg-background py-4 lg:py-0">
            <div className="w-full px-4 sm:px-6 md:px-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full items-center">

                    {/* Section 1: H1 Heading - Max Width */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center text-center lg:text-left lg:col-span-5"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight leading-none mt-[10px]">
                            International Grocery <br />
                            <span className="text-primary">Delivery Sweden</span>
                        </h1>
                    </motion.div>

                    {/* Section 2: Description - Middle Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col justify-center space-y-2 text-center lg:text-left lg:col-span-5"
                    >
                        <p className="text-sm font-medium text-muted-foreground leading-normal font-sans">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Section 3: Image - Shortest Width */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative h-[150px] lg:h-full w-full flex items-center justify-center lg:justify-end lg:col-span-2"
                    >
                        <div className="relative w-full h-full max-h-[180px]">
                            <Image
                                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/dhl.png"
                                alt="Express Delivery"
                                fill
                                className="object-contain object-center lg:object-right"
                                priority
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
