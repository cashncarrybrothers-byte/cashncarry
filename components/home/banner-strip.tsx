"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BannerStrip() {
    return (
        <section className="w-full py-6 md:py-8">
            <div className="w-full px-4 md:px-[50px]">
                <Link
                    href="/deals"
                    className="block group relative overflow-hidden rounded-2xl h-[140px] sm:h-[160px] md:h-[180px]"
                    style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-500 to-primary flex flex-col justify-center px-6 sm:px-10 md:px-16">
                        {/* Pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '32px 32px'
                            }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-white/80">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                    <span className="text-[10px] font-bold tracking-widest uppercase">Premium Quality</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                                    Basmati Rice & Authentic Spices
                                </h2>
                                <p className="text-white/80 text-sm md:text-base max-w-xl">
                                    Explore our selection of premium Indian & Pakistani ingredients
                                </p>
                            </div>

                            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 group-hover:scale-110 group-hover:bg-white/25 transition-all">
                                <ArrowRight className="text-white w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
