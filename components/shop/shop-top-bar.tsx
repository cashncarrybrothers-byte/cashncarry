'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronRight, Filter, X, ArrowUpDown, Package, Grid3X3, LayoutGrid } from 'lucide-react';
import { cn, decodeHtmlEntities } from '@/lib/utils';
import type { ProductCategoryFull } from '@/types/woocommerce';
import type { ProductBrand } from '@/lib/woocommerce/brands';

// Helper to build category tree
type CategoryWithChildren = ProductCategoryFull & {
    children: CategoryWithChildren[];
};

function buildCategoryTree(categories: ProductCategoryFull[]): CategoryWithChildren[] {
    const categoryMap = new Map<number, CategoryWithChildren>();
    categories.forEach((cat) => {
        categoryMap.set(cat.id, { ...cat, children: [] });
    });
    const rootCategories: CategoryWithChildren[] = [];
    categories.forEach((cat) => {
        const current = categoryMap.get(cat.id)!;
        if (cat.parent === 0) {
            rootCategories.push(current);
        } else {
            const parent = categoryMap.get(cat.parent);
            if (parent) parent.children.push(current);
            else rootCategories.push(current); // Fallback
        }
    });
    return rootCategories;
}

interface ShopTopBarProps {
    categories: ProductCategoryFull[];
    brands?: ProductBrand[];
    totalProducts: number;
    className?: string;
}

export function ShopTopBar({ categories, brands = [], totalProducts, className }: ShopTopBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams?.toString() || '');
            if (searchQuery) {
                params.set('search', searchQuery);
            } else {
                params.delete('search');
            }
            params.delete('page'); // Reset pagination when search changes
            router.push(`?${params.toString()}`);
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, router]); // Intentionally exclude searchParams to avoid infinite loop

    // Handle Sort
    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');

        // Handle price sorting specially
        if (value === 'price-asc') {
            params.set('orderby', 'price');
            params.set('order', 'asc');
        } else if (value === 'price-desc') {
            params.set('orderby', 'price');
            params.set('order', 'desc');
        } else {
            // For other sorts (date, popularity, etc.)
            params.set('orderby', value);
            params.delete('order'); // Let WooCommerce use default order
        }

        router.push(`?${params.toString()}`);
    };

    // Handle Category Click
    const handleCategoryClick = (slug: string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('category', slug);
        params.delete('page');
        router.push(`?${params.toString()}`);
        setMobileFiltersOpen(false);
    };

    // Handle Brand Click
    const handleBrandClick = (slug: string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('brand', slug);
        params.delete('page');
        router.push(`?${params.toString()}`);
        setMobileFiltersOpen(false);
    };

    // Clear category filter
    const clearCategoryFilter = () => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('category');
        router.push(`?${params.toString()}`);
    };

    // Organize Categories
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

    // Filter out uncategorized and sort by product count
    const mainCategories = useMemo(() => {
        return categoryTree
            .filter(c => !c.name.toLowerCase().includes('uncategorized'))
            .sort((a, b) => (b.count || 0) - (a.count || 0));
    }, [categoryTree]);

    // Get current active category
    const activeCategory = searchParams?.get('category');
    const activeCategoryData = categories.find(c => c.slug === activeCategory);

    return (
        <div className={cn("w-full space-y-3", className)}>
            {/* Search & Sort Row */}
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm p-2 rounded-lg border border-border/50">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden gap-2 shrink-0">
                            <Filter className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Categories</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0">
                        <SheetHeader className="p-4 border-b bg-muted/30">
                            <SheetTitle className="flex items-center gap-2">
                                <LayoutGrid className="h-5 w-5 text-primary" />
                                Browse Categories
                            </SheetTitle>
                        </SheetHeader>

                        {/* Mobile Categories List */}
                        <div className="overflow-y-auto h-[calc(100vh-120px)]">
                            {/* All Products Option */}
                            <button
                                onClick={() => {
                                    clearCategoryFilter();
                                    setMobileFiltersOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 text-left border-b transition-colors",
                                    !activeCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
                                )}
                            >
                                <span>All Products</span>
                                <Badge variant="secondary" className="text-xs">{totalProducts}</Badge>
                            </button>

                            {/* Category List with Expandable Subcategories */}
                            {mainCategories.map((cat) => (
                                <div key={cat.id} className="border-b border-border/50">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={cn(
                                                "flex-1 flex items-center justify-between px-4 py-3 text-left transition-colors",
                                                activeCategory === cat.slug ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
                                            )}
                                        >
                                            <span>{decodeHtmlEntities(cat.name)}</span>
                                            {cat.count > 0 && (
                                                <Badge variant="outline" className="text-xs ml-2">{cat.count}</Badge>
                                            )}
                                        </button>
                                        {cat.children.length > 0 && (
                                            <button
                                                onClick={() => setExpandedMobileCategory(
                                                    expandedMobileCategory === cat.id ? null : cat.id
                                                )}
                                                className="p-3 hover:bg-muted/50 transition-colors"
                                            >
                                                <ChevronRight className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    expandedMobileCategory === cat.id && "rotate-90"
                                                )} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Subcategories */}
                                    {cat.children.length > 0 && expandedMobileCategory === cat.id && (
                                        <div className="bg-muted/30 border-t border-border/30">
                                            {cat.children.map((child) => (
                                                <button
                                                    key={child.id}
                                                    onClick={() => handleCategoryClick(child.slug)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-6 py-2.5 text-sm text-left transition-colors",
                                                        activeCategory === child.slug
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <span>{decodeHtmlEntities(child.name)}</span>
                                                    {child.count > 0 && (
                                                        <span className="text-xs opacity-60">{child.count}</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Brands Section in Mobile */}
                            {brands && brands.length > 0 && (
                                <div className="mt-4 p-4">
                                    <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Shop by Brand
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {brands.slice(0, 12).map((brand) => (
                                            <button
                                                key={brand.id}
                                                onClick={() => handleBrandClick(brand.slug)}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs rounded-full border transition-colors",
                                                    searchParams?.get('brand') === brand.slug
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background hover:bg-muted border-border"
                                                )}
                                            >
                                                {decodeHtmlEntities(brand.name)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Search Bar */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm bg-background border-border/50 focus:border-primary/30"
                    />
                </div>

                {/* Sort Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 shrink-0">
                            <ArrowUpDown className="h-4 w-4" />
                            <span className="hidden sm:inline">Sort</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSort('date')}>Newest</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort('popularity')}>Popularity</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort('price-asc')}>Price: Low to High</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort('price-desc')}>Price: High to Low</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Brand Filter - Desktop Only */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 shrink-0 hidden lg:flex">
                            <Package className="h-4 w-4" />
                            Brands
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="end">
                        <div className="p-3 bg-muted/30 border-b">
                            <h4 className="font-medium text-sm">Shop by Brand</h4>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {brands && brands.length > 0 ? (
                                <div className="grid grid-cols-2 gap-1">
                                    {brands.map((brand) => (
                                        <button
                                            key={brand.id}
                                            onClick={() => handleBrandClick(brand.slug)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left",
                                                searchParams?.get('brand') === brand.slug
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <span className="truncate">{decodeHtmlEntities(brand.name)}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No brands available.
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Category Quick Buttons - Desktop */}
            <div className="hidden lg:block">
                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
                >
                    {/* All Products Button */}
                    <button
                        onClick={clearCategoryFilter}
                        className={cn(
                            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                            !activeCategory
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background hover:bg-muted border-border hover:border-primary/30"
                        )}
                    >
                        All Products
                    </button>

                    {/* Main Category Buttons with Dropdowns for Subcategories */}
                    {mainCategories.map((cat) => (
                        cat.children.length > 0 ? (
                            <DropdownMenu key={cat.id}>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={cn(
                                            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5",
                                            activeCategory === cat.slug || cat.children.some(c => c.slug === activeCategory)
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                : "bg-background hover:bg-muted border-border hover:border-primary/30"
                                        )}
                                    >
                                        {decodeHtmlEntities(cat.name)}
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuItem
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className="font-medium"
                                    >
                                        All {decodeHtmlEntities(cat.name)}
                                        {cat.count > 0 && (
                                            <Badge variant="secondary" className="ml-auto text-xs">{cat.count}</Badge>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {cat.children.map((child) => (
                                        <DropdownMenuItem
                                            key={child.id}
                                            onClick={() => handleCategoryClick(child.slug)}
                                            className={cn(
                                                activeCategory === child.slug && "bg-primary/10 text-primary"
                                            )}
                                        >
                                            {decodeHtmlEntities(child.name)}
                                            {child.count > 0 && (
                                                <span className="ml-auto text-xs text-muted-foreground">{child.count}</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className={cn(
                                    "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                    activeCategory === cat.slug
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-background hover:bg-muted border-border hover:border-primary/30"
                                )}
                            >
                                {decodeHtmlEntities(cat.name)}
                            </button>
                        )
                    ))}
                </div>
            </div>

            {/* Mobile Category Scroll - Horizontal Pills */}
            <div className="lg:hidden">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                    {/* All Products Pill */}
                    <button
                        onClick={clearCategoryFilter}
                        className={cn(
                            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap",
                            !activeCategory
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border"
                        )}
                    >
                        All
                    </button>

                    {/* Category Pills - Show top categories */}
                    {mainCategories.slice(0, 10).map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className={cn(
                                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap",
                                activeCategory === cat.slug || cat.children.some(c => c.slug === activeCategory)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-border"
                            )}
                        >
                            {decodeHtmlEntities(cat.name)}
                        </button>
                    ))}

                    {/* More Categories Button */}
                    {mainCategories.length > 10 && (
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-primary/50 text-primary whitespace-nowrap"
                        >
                            +{mainCategories.length - 10} More
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {(activeCategory || searchParams?.get('brand')) && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Filters:</span>

                    {activeCategory && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                            {activeCategoryData?.name || activeCategory}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={clearCategoryFilter}
                            />
                        </Badge>
                    )}

                    {searchParams?.get('brand') && (
                        <Badge variant="secondary" className="gap-1 text-xs bg-primary/10 text-primary border-primary/20">
                            {brands?.find(b => b.slug === searchParams.get('brand'))?.name || searchParams.get('brand')}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams?.toString() || '');
                                    params.delete('brand');
                                    router.push(`?${params.toString()}`);
                                }}
                            />
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 text-xs text-muted-foreground hover:text-destructive px-2"
                        onClick={() => router.push('/shop')}
                    >
                        Clear All
                    </Button>
                </div>
            )}
        </div>
    );
}
