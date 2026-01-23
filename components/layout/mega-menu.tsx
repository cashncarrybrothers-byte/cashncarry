"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Menu } from "lucide-react";
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
                <div className="absolute top-full left-0 mt-0 w-[800px] h-[500px] bg-card border border-border rounded-xl shadow-2xl z-50 flex overflow-hidden animate-in fade-in slide-in-from-top-2">

                    {/* Level 1: Parent Categories (Sidebar) */}
                    <div className="w-1/3 border-r border-border overflow-y-auto bg-muted/5 p-2">
                        <ul className="space-y-1">
                            {tree.map(category => (
                                <li key={category.id}>
                                    <Link
                                        href={`/product-category/${category.slug}`}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                            activeCategory === category.id
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "hover:bg-primary/10 hover:text-primary text-foreground"
                                        )}
                                        onMouseEnter={() => setActiveCategory(category.id)}
                                    >
                                        <span className="truncate">{category.name.replace(/&amp;/g, '&')}</span>
                                        {category.children.length > 0 && <ChevronRight className="h-4 w-4 opacity-50" />}
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
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                            <div className="text-6xl mb-4">🥗</div>
                                            <h3 className="text-xl font-bold mb-2">{activeNode.name}</h3>
                                            <p className="text-sm">Browse all products in this category</p>
                                            <Link
                                                href={`/product-category/${activeNode.slug}`}
                                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/90"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                View Products
                                            </Link>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div className="grid grid-cols-2 gap-6">
                                            {activeNode.children.map(child => (
                                                <div key={child.id} className="space-y-1">
                                                    <Link
                                                        href={`/product-category/${child.slug}`}
                                                        className="font-medium text-sm hover:text-primary block px-2 py-1"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {child.name.replace(/&amp;/g, '&')}
                                                    </Link>

                                                    {child.children.length > 0 && (
                                                        <ul className="pl-4 space-y-1 border-l border-border/40 ml-2">
                                                            {child.children.map(grandChild => (
                                                                <li key={grandChild.id}>
                                                                    <Link
                                                                        href={`/product-category/${grandChild.slug}`}
                                                                        className="text-sm text-muted-foreground hover:text-primary transition-colors block px-2 py-1"
                                                                        onClick={() => setIsOpen(false)}
                                                                    >
                                                                        {grandChild.name.replace(/&amp;/g, '&')}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Featured Category Image */}
                                        <div className="relative w-full h-[140px] rounded-xl overflow-hidden shrink-0 mt-4">
                                            <Image
                                                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-3.jpg"
                                                alt="Featured Collection"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20" />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <p className="text-xs font-bold uppercase tracking-wider mb-1">New Arrivals</p>
                                                <p className="font-heading font-bold text-lg">Exotic Fruits</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                                <p>Hover over a category to see more details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
