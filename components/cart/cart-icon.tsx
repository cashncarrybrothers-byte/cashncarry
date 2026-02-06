'use client';

import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export function CartIcon() {
  const { getTotalItems, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const prevCountRef = useRef(0);

  // Only show count after client-side hydration to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const count = getTotalItems();
    setItemCount(count);
    prevCountRef.current = count;
  }, [getTotalItems]);

  // Update count when cart changes and trigger animation on increase
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      const newCount = state.getTotalItems();
      if (newCount > prevCountRef.current) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 800);
      }
      prevCountRef.current = newCount;
      setItemCount(newCount);
    });
    return unsubscribe;
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-transparent"
      onClick={openCart}
      aria-label="Open shopping cart"
    >
      <ShoppingCart
        className={cn(
          'h-6 w-6 transition-all duration-300 text-foreground',
          justAdded && 'scale-110'
        )}
      />
      {mounted && itemCount > 0 && (
        <span
          className={cn(
            'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-primary-foreground transition-all duration-300',
            justAdded
              ? 'bg-green-500 scale-125'
              : 'bg-primary scale-100'
          )}
        >
          {justAdded ? (
            <Check className="h-3 w-3" strokeWidth={3} />
          ) : (
            itemCount > 9 ? '9+' : itemCount
          )}
        </span>
      )}
    </Button>
  );
}
