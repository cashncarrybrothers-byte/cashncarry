'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, Package, Truck, Shield, Check, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/woocommerce';
import { formatPrice, getDiscountPercentage, hasVariations } from '@/lib/woocommerce';
import { useCartStore } from '@/store/cart-store';
import { cn, decodeHtmlEntities } from '@/lib/utils';
import { WishlistToggle } from '@/components/wishlist/wishlist-button';

interface QuickViewModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { addItem } = useCartStore();
    const discount = getDiscountPercentage(product);

    const handleAddToCart = () => {
        if (hasVariations(product)) {
            // Redirect to product page for variable products
            window.location.href = `/product/${product.slug}`;
            return;
        }

        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        setTimeout(() => {
            setIsAdding(false);
            onClose();
        }, 800);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-card shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground transition-all hover:bg-background hover:scale-110 hover:rotate-90 shadow-lg"
                            aria-label="Close quick view"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0 overflow-y-auto max-h-[90vh]">
                            {/* Left: Image Gallery */}
                            <div className="relative bg-white p-8 flex flex-col">
                                {/* Badges */}
                                <div className="absolute left-6 top-6 flex flex-col gap-2 z-10">
                                    {product.featured && (
                                        <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md border-0">
                                            <Star className="mr-1 h-3 w-3 fill-current" /> Featured
                                        </Badge>
                                    )}
                                    {product.on_sale && discount > 0 && (
                                        <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md border-0">
                                            -{discount}%
                                        </Badge>
                                    )}
                                    {product.stock_status === 'outofstock' && (
                                        <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                                            Sold Out
                                        </Badge>
                                    )}
                                </div>

                                {/* Main Image */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-4 border border-border/20">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[selectedImageIndex]?.src || product.images[0].src}
                                            alt={product.images[selectedImageIndex]?.alt || product.name}
                                            fill
                                            className="object-contain p-4"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {product.images && product.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {product.images.slice(0, 5).map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={cn(
                                                    "relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                                                    selectedImageIndex === index
                                                        ? "border-primary shadow-md"
                                                        : "border-border/40 opacity-60 hover:opacity-100"
                                                )}
                                            >
                                                <Image
                                                    src={image.src}
                                                    alt={image.alt || `${product.name} thumbnail ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Product Details */}
                            <div className="flex flex-col p-8 bg-card">
                                {/* Category */}
                                {product.categories && product.categories.length > 0 && (
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                        {decodeHtmlEntities(product.categories[0].name)}
                                    </p>
                                )}

                                {/* Product Name */}
                                <h2 className="mb-3 font-heading text-2xl font-bold leading-tight text-foreground">
                                    {decodeHtmlEntities(product.name)}
                                </h2>

                                {/* Price */}
                                <div className="mb-6 flex items-baseline gap-3">
                                    {product.on_sale && product.sale_price && product.sale_price !== '' ? (
                                        <>
                                            <span className="text-3xl font-bold text-primary">
                                                {formatPrice(product.sale_price, 'SEK')}
                                            </span>
                                            <span className="text-lg text-muted-foreground line-through">
                                                {formatPrice(product.regular_price, 'SEK')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-foreground">
                                            {formatPrice(product.price ? String(product.price) : '0', 'SEK')}
                                        </span>
                                    )}
                                </div>

                                {/* Short Description */}
                                {product.short_description && (
                                    <div
                                        className="mb-6 text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: product.short_description
                                        }}
                                    />
                                )}

                                {/* Trust Badges */}
                                <div className="mb-6 grid grid-cols-3 gap-3">
                                    <div className="flex flex-col items-center rounded-xl bg-muted/40 p-3 text-center">
                                        <Truck className="mb-1.5 h-5 w-5 text-primary" />
                                        <span className="text-xs font-medium text-foreground">Fast Delivery</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-xl bg-muted/40 p-3 text-center">
                                        <Shield className="mb-1.5 h-5 w-5 text-primary" />
                                        <span className="text-xs font-medium text-foreground">Secure Payment</span>
                                    </div>
                                    <div className="flex flex-col items-center rounded-xl bg-muted/40 p-3 text-center">
                                        <Package className="mb-1.5 h-5 w-5 text-primary" />
                                        <span className="text-xs font-medium text-foreground">Quality Assured</span>
                                    </div>
                                </div>

                                {/* Stock Status */}
                                <div className="mb-6">
                                    {product.stock_status === 'instock' ? (
                                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="font-medium">In Stock</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-destructive">
                                            <div className="h-2 w-2 rounded-full bg-destructive" />
                                            <span className="font-medium">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Quantity Selector & Add to Cart */}
                                <div className="mt-auto space-y-4">
                                    {!hasVariations(product) && product.stock_status === 'instock' && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-foreground">Quantity:</span>
                                            <div className="flex items-center rounded-lg border border-border bg-background">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-muted"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-muted"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={product.stock_status === 'outofstock' || isAdding}
                                            className={cn(
                                                "flex-1 h-12 text-base font-semibold rounded-xl transition-all",
                                                isAdding
                                                    ? "bg-green-500 text-white hover:bg-green-500"
                                                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                                            )}
                                        >
                                            {isAdding ? (
                                                <>
                                                    <Check className="mr-2 h-5 w-5" />
                                                    Added to Cart
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                                    {hasVariations(product) ? 'Select Options' : 'Add to Cart'}
                                                </>
                                            )}
                                        </Button>

                                        <div className="shrink-0">
                                            <WishlistToggle product={product} size="lg" />
                                        </div>
                                    </div>

                                    {/* View Full Details Link */}
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="block text-center text-sm font-medium text-primary hover:underline transition-colors"
                                    >
                                        View Full Product Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
