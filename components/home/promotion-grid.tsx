"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Globe, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromotionGrid() {
    return (
        <section className="w-full py-6 md:py-8 bg-background">
            <div className="w-full px-4 sm:px-6 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Card 1: Shop by Region Promotion */}
                    <Link href="/shop" className="group block aspect-square">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm group-hover:shadow-lg transition-all w-full h-full">
                            <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white">
                                        Shop by Region
                                    </h3>
                                    <ul className="text-sm space-y-1 text-white/80">
                                        <li>✓ Asia</li>
                                        <li>✓ Middle East</li>
                                        <li>✓ Africa & Latin America</li>
                                    </ul>
                                </div>
                                <div className="mt-auto">
                                    <Button size="sm" className="w-full rounded-full bg-white text-emerald-600 hover:bg-gray-100 font-bold">
                                        Browse <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        </div>
                    </Link>

                    {/* Card 2: 99 kr Special Offers */}
                    <Link href="/deals" className="group block aspect-square">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm group-hover:shadow-xl transition-all w-full h-full">
                            <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-1">
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase mb-2">
                                        Limited Offer
                                    </span>
                                    <h3 className="text-5xl font-black text-white">
                                        99 kr
                                    </h3>
                                    <p className="text-xl font-bold text-white/90">
                                        Special Deals
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <Button size="sm" className="w-full rounded-full bg-white text-orange-600 hover:bg-gray-100 font-bold">
                                        Shop Deals <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                        </div>
                    </Link>

                    {/* Card 3: Europe-Wide Delivery */}
                    <div className="group block aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm hover:shadow-lg transition-all w-full h-full">
                        <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white leading-tight">
                                    Europe-Wide Delivery
                                </h3>
                                <p className="text-sm text-white/90">
                                    Fast shipping via DHL to your doorstep.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <Button size="sm" className="w-full rounded-full bg-white text-blue-600 hover:bg-gray-100 font-bold">
                                    Info <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    {/* Card 4: New - Fresh Halal Meat */}
                    <Link href="/product-category/meat" className="group block aspect-square">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-sm group-hover:shadow-lg transition-all w-full h-full">
                            <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Fresh Halal Meat
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        Premium quality cuts delivered fresh.
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <Button size="sm" className="w-full rounded-full bg-white text-rose-600 hover:bg-gray-100 font-bold">
                                        Order Now <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mb-10"></div>
                        </div>
                    </Link>

                    {/* Card 5: Rice & Flour Essentials */}
                    <Link href="/product-category/staples" className="group block aspect-square">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm group-hover:shadow-lg transition-all w-full h-full">
                            <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Wheat className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Rice & Flour
                                    </h3>
                                    <ul className="text-sm space-y-1 text-white/90">
                                        <li>✓ Basmati Rice</li>
                                        <li>✓ Chakki Atta</li>
                                        <li>✓ Bulk Packs</li>
                                    </ul>
                                </div>
                                <div className="mt-auto">
                                    <Button size="sm" className="w-full rounded-full bg-white text-orange-600 hover:bg-gray-100 font-bold">
                                        Shop Staples <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mt-10"></div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
