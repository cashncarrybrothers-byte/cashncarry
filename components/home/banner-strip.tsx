"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BannerStrip() {
    return (
        <section className="w-full pb-[15px]">
            <div className="site-container">
                <Link href="/deals" className="block group relative overflow-hidden rounded-3xl h-[160px] sm:h-[180px] md:h-[200px] shadow-lg hover:shadow-xl transition-shadow">
                    {/* Background Image/Gradient Placeholder - Primary Theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-rose-600 flex flex-col justify-center px-6 sm:px-10 md:px-16">
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2 sm:mb-3 text-yellow-300">
                                    <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></span>
                                    <span className="text-xs font-bold tracking-widest uppercase">Premium Quality</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2 leading-tight">
                                    Basmati Rice & Authentic Spices
                                </h2>
                                <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl font-medium">
                                    Explore our selection of premium Indian & Pakistani ingredients
                                </p>
                            </div>

                            <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform">
                                <ArrowRight className="text-white w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
