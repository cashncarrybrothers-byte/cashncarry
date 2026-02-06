'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/woocommerce';
import { trackAddToCart } from '@/lib/analytics';
import { decodeHtmlEntities } from '@/lib/utils';
import type { Product, ProductVariation } from '@/types/woocommerce';

interface StickyAddToCartProps {
  product: Product;
  variation?: ProductVariation | null;
  quantity: number;
  /** Ref to the main add-to-cart section to track visibility */
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

export function StickyAddToCart({
  product,
  variation,
  quantity,
  triggerRef,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const isOrderingDisabled = process.env.NEXT_PUBLIC_ORDERING_DISABLED === 'true';

  // Observe when the main add-to-cart button scrolls out of view
  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the main section is NOT visible
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [triggerRef]);

  const stockStatus = variation?.stock_status || product.stock_status;
  const isOutOfStock = stockStatus === 'outofstock';
  const hasVariations = product.type === 'variable' && product.variations?.length > 0;
  const needsVariation = hasVariations && !variation;
  const currentPrice = variation?.price || product.sale_price || product.price || '0';

  const handleAdd = () => {
    if (isOutOfStock || needsVariation || isOrderingDisabled) return;

    addItem(product, quantity, variation || undefined);
    trackAddToCart(product, quantity, variation?.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgb(0_0_0/0.1)] px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Product info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {decodeHtmlEntities(product.name)}
            </p>
            <p className="text-base font-bold text-primary">
              {formatPrice(currentPrice, 'SEK')}
            </p>
          </div>

          {/* Add to Cart button */}
          <Button
            onClick={handleAdd}
            disabled={isOutOfStock || isAdded || needsVariation || isOrderingDisabled}
            className="shrink-0 rounded-full px-6 py-5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {isAdded ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : isOrderingDisabled ? (
              'Coming Soon'
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : needsVariation ? (
              'Select Options'
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
