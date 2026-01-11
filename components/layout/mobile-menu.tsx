'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Menu,
    Phone,
    Home,
    ShoppingBag,
    BookOpen,
    Info,
    Mail,
    MapPin,
    Clock,
    Crown,
    Facebook,
    Instagram,
    Youtube,
    Percent,
    Heart,
    ChevronDown,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { brandConfig } from '@/config/brand.config';
import { brandProfile } from '@/config/brand-profile';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useSidebar } from './mobile-sidebar-toggle';
import { getStoreStatus, type StoreStatus } from '@/lib/store-hours';

const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/deals', label: 'Deals & Offers', icon: Percent },
    { href: '/shop', label: 'Shop', icon: ShoppingBag },
    { href: '/brands', label: 'Shop by Brands', icon: ShoppingBag },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/my-account', label: 'My Account', icon: Crown },
    { href: '#wishlist', label: 'Wishlist (Coming Soon)', icon: Heart, comingSoon: true },
];

export function MobileMenu() {
    const { isOpen, close } = useSidebar();
    const [isCountriesOpen, setIsCountriesOpen] = useState(false);
    const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

    const countries = [
        { name: "Asia", slug: "asia" },
        { name: "Middle East", slug: "middle-east" },
        { name: "Africa", slug: "africa" },
        { name: "Latin America", slug: "latin-america" },
        { name: "Balkan", slug: "balkan" },
    ];

    useEffect(() => {
        // Update store status on mount and every minute
        const updateStatus = () => setStoreStatus(getStoreStatus());
        updateStatus();

        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Sheet open={isOpen} onOpenChange={(val) => !val && close()}>
            <SheetContent
                side="right"
                className="w-[320px] sm:w-[380px] p-0 bg-gradient-to-br from-background via-background to-primary/5 border-l-2 border-primary/20"
            >
                {/* Header with Logo and Close Button */}
                <div className="relative overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

                    <SheetHeader className="relative px-6 pt-4 pb-3 border-b border-primary/10">
                        <div className="flex items-center justify-start">
                            {/* Logo */}
                            <div className="relative h-20 w-32">
                                <Image
                                    src="https://cashncarry.se/image/cache/catalog/Brothers-cash&carry-1080x621.png"
                                    alt="Brothers Cash & Carry"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </SheetHeader>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-0.5 px-4 py-3 overflow-y-auto max-h-[calc(100vh-240px)]">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isComingSoon = item.comingSoon;

                        return (
                            <Link
                                key={item.href}
                                href={isComingSoon ? '#' : item.href}
                                onClick={(e) => {
                                    if (isComingSoon) {
                                        e.preventDefault();
                                    } else {
                                        close();
                                    }
                                }}
                                className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl text-foreground transition-all duration-300 ${isComingSoon
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]'
                                    }`}
                            >
                                {/* Icon with gradient background */}
                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 ${!isComingSoon && 'group-hover:from-primary/20 group-hover:to-primary/10 group-hover:scale-105'
                                    }`}>
                                    <Icon className={`h-5 w-5 text-primary transition-transform duration-300 ${!isComingSoon && 'group-hover:scale-110'}`} />
                                </div>

                                {/* Label */}
                                <span className="text-base font-medium tracking-wide">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Shop by Country Section */}
                    <div className="mt-2 pt-2 border-t border-primary/5">
                        <button
                            onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                            className="w-full group relative flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                                    <Globe className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-base font-medium tracking-wide">Shop by Country</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isCountriesOpen && "rotate-180")} />
                        </button>

                        <div className={cn(
                            "overflow-hidden transition-all duration-300 flex flex-col gap-0.5 pl-14",
                            isCountriesOpen ? "max-h-[400px] opacity-100 mt-1 mb-2" : "max-h-0 opacity-0"
                        )}>
                            {countries.map((country) => (
                                <Link
                                    key={country.slug}
                                    href={`/product-category/${country.slug}`}
                                    onClick={() => close()}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                                >
                                    {country.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent border-t border-primary/10">
                    {/* Phone Button */}
                    <a
                        href={`tel:${brandConfig.contact.phone}`}
                        className="flex items-center justify-start gap-3 w-full px-5 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4 group"
                    >
                        <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                            <Phone className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                        <span className="text-base tracking-wide">{brandConfig.contact.phone}</span>
                    </a>

                    {/* Quick Info & Socials */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            {brandConfig.social.facebook && (
                                <a
                                    href={brandConfig.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 hover:rotate-3 group"
                                >
                                    <Facebook className="h-4.5 w-4.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            )}
                            {brandConfig.social.instagram && (
                                <a
                                    href={brandConfig.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 hover:rotate-3 group"
                                >
                                    <Instagram className="h-4.5 w-4.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            )}
                            {brandConfig.social.youtube && (
                                <a
                                    href={brandConfig.social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 hover:rotate-3 group"
                                >
                                    <Youtube className="h-4.5 w-4.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            )}
                        </div>

                        <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                            <a
                                href={brandConfig.contact.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 hover:text-primary transition-colors duration-300"
                            >
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{brandConfig.contact.address}</span>
                            </a>
                            {storeStatus && (
                                <div className="flex items-center gap-2.5">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className={storeStatus.isOpen ? 'text-green-600 font-medium' : 'text-red-600'}>
                                        {storeStatus.statusText}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
