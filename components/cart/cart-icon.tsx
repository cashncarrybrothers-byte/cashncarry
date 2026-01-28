'use client';

import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { getTotalItems, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only show count after client-side hydration to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setItemCount(getTotalItems());
  }, [getTotalItems]);

  // Update count when cart changes
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      setItemCount(state.getTotalItems());
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
      <ShoppingCart className="h-6 w-6 transition-all duration-300 text-foreground" />
      {mounted && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground animate-in zoom-in duration-300">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Button>
  );
}
