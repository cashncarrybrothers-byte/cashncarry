'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Hero slider images
const heroSlides = [
    {
        id: 1,
        image: "https://crm.cashncarry.se/wp-content/uploads/2026/01/AASHIRVAD-BANNER.jpg",
        alt: "Aashirvad Products",
        link: "/shop?brand=aashirvad",
        title: "Premium Aashirvaad Selection",
        subtitle: "Authentic staples for your kitchen. Freshly packed and delivered to your doorstep.",
        buttonText: "Shop Aashirvaad",
        secondaryButtonText: "View All Brands",
        secondaryLink: "/brands"
    },
    {
        id: 2,
        image: "https://crm.cashncarry.se/wp-content/uploads/2026/01/vitalgroup1-2.png",
        alt: "Vital Group Products",
        link: "/shop",
        title: "Vital Everyday Essentials",
        subtitle: "Quality products from Vital Group. Everything you need for your daily cooking.",
        buttonText: "Explore Range",
        secondaryButtonText: "Weekly Deals",
        secondaryLink: "/deals"
    },
    {
        id: 3,
        image: "https://crm.cashncarry.se/wp-content/uploads/2026/01/ambala-banner.jpg",
        alt: "Ambala Products",
        link: "/shop?brand=ambala",
        title: "Authentic Ambala Sweets",
        subtitle: "Experience the tradition of fine Asian confectionery and snacks.",
        buttonText: "Shop Sweets",
        secondaryButtonText: "Quick View",
        secondaryLink: "/shop"
    },
];

export function SplitHero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const goToPrevious = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    return (
        <section className="w-full py-6 md:py-8 bg-background">
            <div className="w-full px-4 md:px-[50px]">
                <div className="flex flex-col gap-6">

                    {/* Main Hero Slider (Full Width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full relative rounded-2xl overflow-hidden h-[280px] sm:h-[380px] md:h-[420px] lg:h-[500px]"
                        style={{ boxShadow: 'var(--shadow-lg)' }}
                    >
                        {/* Slides */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
                                <Image
                                    src={heroSlides[currentSlide].image}
                                    alt={heroSlides[currentSlide].alt}
                                    fill
                                    className="object-cover"
                                    priority={currentSlide === 0}
                                    quality={90}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                />

                                {/* Slide Content Overlay */}
                                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-16 max-w-2xl bg-black/5 sm:bg-transparent">
                                    <motion.h2
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="display-lg md:display-xl text-white mb-3 md:mb-4 drop-shadow-xl font-heading"
                                    >
                                        {heroSlides[currentSlide].title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="body md:body-lg text-white/90 mb-6 md:mb-8 max-w-xs sm:max-w-md drop-shadow-md font-medium line-clamp-2 sm:line-clamp-none"
                                    >
                                        {heroSlides[currentSlide].subtitle}
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="flex flex-wrap gap-2 sm:gap-4"
                                    >
                                        <Button
                                            asChild
                                            size="sm"
                                            className="sm:size-lg rounded-full px-5 sm:px-8 h-10 sm:h-14 text-sm sm:text-base font-bold shadow-xl hover:scale-105 transition-transform"
                                        >
                                            <Link href={heroSlides[currentSlide].link}>
                                                {heroSlides[currentSlide].buttonText}
                                                <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="sm:size-lg rounded-full px-5 sm:px-8 h-10 sm:h-14 text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
                                        >
                                            <Link href={heroSlides[currentSlide].secondaryLink}>
                                                {heroSlides[currentSlide].secondaryButtonText}
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                            aria-label="Previous slide"
                            style={{ opacity: 1 }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                            aria-label="Next slide"
                            style={{ opacity: 1 }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={cn(
                                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                        currentSlide === index
                                            ? "bg-white w-8"
                                            : "bg-white/50 hover:bg-white/80"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                    duration: 5,
                                    ease: "linear",
                                    repeat: Infinity,
                                }}
                                key={currentSlide}
                            />
                        </div>
                    </motion.div>

                    {/* Bottom Promo Banners (50% Split) */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Promo 1 - Spices & Rice Theme */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative rounded-xl overflow-hidden group h-[200px] sm:h-[240px] cursor-pointer"
                            style={{ boxShadow: 'var(--shadow-md)' }}
                        >
                            {/* Background Image */}
                            <Image
                                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-2.jpg"
                                alt="Spices & Rice Deal"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={100}
                            />



                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center z-10">
                                <span className="text-white/80 font-bold text-[10px] uppercase tracking-wider mb-2">Welcome to Brothers Cash & Carry</span>
                                <h1 className="text-xl md:text-2xl font-black mb-1 text-white leading-tight">
                                    International Groceries in Stockholm
                                </h1>
                                <p className="text-sm font-medium mb-4 text-white/90">Asian, African, Latin American & Middle Eastern Products</p>
                                <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1 group/link hover:text-white/80 transition-colors">
                                    Shop Now <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Promo 2 - Exotic Fruits/Fresh Theme */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="relative rounded-xl overflow-hidden group h-[200px] sm:h-[240px] cursor-pointer"
                            style={{ boxShadow: 'var(--shadow-md)' }}
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

