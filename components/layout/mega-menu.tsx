"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Menu, Package } from "lucide-react";
import { useState } from "react";
import { ProductCategoryFull } from "@/types/woocommerce";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
    categories: ProductCategoryFull[];
}

type CategoryTree = ProductCategoryFull & { children: CategoryTree[] };

function buildCategoryTree(categories: ProductCategoryFull[]): CategoryTree[] {
    const map = new Map<number, CategoryTree>();
    const roots: CategoryTree[] = [];
    const validIds = new Set(categories.map(c => c.id));

    // Initialize map
    categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });

    // Build tree
    categories.forEach(cat => {
        const node = map.get(cat.id)!;
        if (cat.parent === 0 || !validIds.has(cat.parent)) {
            roots.push(node);
        } else {
            const parent = map.get(cat.parent);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    // Sort by menu_order or name
    const sortCats = (cats: CategoryTree[]) => {
        cats.sort((a, b) => a.menu_order - b.menu_order || a.name.localeCompare(b.name));
        cats.forEach(c => {
            if (c.children.length > 0) sortCats(c.children);
        });
    };

    sortCats(roots);
    return roots;
}

export function MegaMenu({ categories }: MegaMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    const tree = buildCategoryTree(categories);

    // If tree is empty, don't render anything
    if (tree.length === 0) return null;

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <button
                className="flex items-center gap-2 group transition-all text-foreground font-bold text-sm hover:text-primary py-2"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span>Browse Categories</span>
            </button>

            {/* Mega Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-0 w-[850px] h-[520px] bg-card border border-border rounded-xl shadow-2xl z-50 flex overflow-hidden animate-in fade-in slide-in-from-top-2">

                    {/* Level 1: Parent Categories (Sidebar) */}
                    <div className="w-1/3 border-r border-border overflow-y-auto bg-gradient-to-b from-muted/10 to-muted/5 p-2">
                        <ul className="space-y-1">
                            {tree.map(category => (
                                <li key={category.id}>
                                    <Link
                                        href={`/product-category/${category.slug}`}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                            activeCategory === category.id
                                                ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                                                : "hover:bg-primary/10 hover:text-primary text-foreground hover:scale-[1.01]"
                                        )}
                                        onMouseEnter={() => setActiveCategory(category.id)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* Category Image/Icon */}
                                            {category.image?.src ? (
                                                <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-white">
                                                    <Image
                                                        src={category.image.src}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="32px"
                                                    />
                                                </div>
                                            ) : (
                                                <div className={cn(
                                                    "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                                                    activeCategory === category.id
                                                        ? "bg-primary-foreground/20"
                                                        : "bg-primary/10"
                                                )}>
                                                    <Package className="h-4 w-4" />
                                                </div>
                                            )}
                                            <span className="truncate">{category.name.replace(/&amp;/g, '&')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {category.count > 0 && (
                                                <span className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full font-semibold",
                                                    activeCategory === category.id
                                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                                        : "bg-muted text-muted-foreground"
                                                )}>
                                                    {category.count}
                                                </span>
                                            )}
                                            {category.children.length > 0 && <ChevronRight className="h-4 w-4 opacity-50" />}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Level 2 & 3: Child Categories (Main Content) */}
                    <div className="w-2/3 p-6 overflow-y-auto bg-card">
                        {activeCategory ? (
                            (() => {
                                const activeNode = tree.find(c => c.id === activeCategory);
                                if (!activeNode) return null;

                                if (activeNode.children.length === 0) {
                                    return (
                                        <div className="h-full flex flex-col items-center justify-center text-center">
                                            {/* Category Image or Icon */}
                                            {activeNode.image?.src ? (
                                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-6 shadow-lg">
                                                    <Image
                                                        src={activeNode.image.src}
                                                        alt={activeNode.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-7xl mb-6">🥗</div>
                                            )}
                                            <h3 className="text-2xl font-bold mb-2">{activeNode.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {activeNode.count} {activeNode.count === 1 ? 'product' : 'products'} available
                                            </p>
                                            <p className="text-sm text-muted-foreground mb-6">Browse all products in this category</p>
                                            <Link
                                                href={`/product-category/${activeNode.slug}`}
                                                className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-md"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                View All Products
                                            </Link>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div className="grid grid-cols-2 gap-6">
                                            {activeNode.children.map(child => (
                                                <div key={child.id} className="space-y-2">
                                                    <Link
                                                        href={`/product-category/${child.slug}`}
                                                        className="font-semibold text-sm hover:text-primary flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-primary/5 transition-all group"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {child.image?.src && (
                                                            <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={child.image.src}
                                                                    alt={child.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="24px"
                                                                />
                                                            </div>
                                                        )}
                                                        <span className="flex-1">{child.name.replace(/&amp;/g, '&')}</span>
                                                        {child.count > 0 && (
                                                            <span className="text-xs text-muted-foreground group-hover:text-primary">
                                                                ({child.count})
                                                            </span>
                                                        )}
                                                    </Link>

                                                    {child.children.length > 0 && (
                                                        <ul className="pl-4 space-y-1 border-l-2 border-border/40 ml-2">
                                                            {child.children.slice(0, 5).map(grandChild => (
                                                                <li key={grandChild.id}>
                                                                    <Link
                                                                        href={`/product-category/${grandChild.slug}`}
                                                                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-between px-2 py-1 rounded hover:bg-muted/50 group"
                                                                        onClick={() => setIsOpen(false)}
                                                                    >
                                                                        <span>{grandChild.name.replace(/&amp;/g, '&')}</span>
                                                                        {grandChild.count > 0 && (
                                                                            <span className="text-[10px] opacity-60 group-hover:opacity-100">
                                                                                {grandChild.count}
                                                                            </span>
                                                                        )}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                            {child.children.length > 5 && (
                                                                <li className="text-xs text-muted-foreground/60 px-2 py-1">
                                                                    +{child.children.length - 5} more
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Featured Category Banner */}
                                        <div className="relative w-full h-[140px] rounded-xl overflow-hidden shrink-0 mt-4 group cursor-pointer">
                                            <Link href="/deals" onClick={() => setIsOpen(false)}>
                                                <Image
                                                    src="https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-3.jpg"
                                                    alt="Featured Collection"
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <p className="text-xs font-bold uppercase tracking-wider mb-1 text-amber-300">🔥 Hot Deals</p>
                                                    <p className="font-heading font-bold text-lg">Special Offers & Promotions</p>
                                                    <p className="text-xs opacity-90 mt-1">Save up to 50% on selected items</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                                <div className="text-6xl mb-4">👈</div>
                                <p className="text-sm">Hover over a category to see subcategories</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

