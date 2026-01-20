'use client';

import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/woocommerce';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Gift, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 500; // SEK

export function CartThresholdMessages({
  className,
  showFreeShipping = true,
}: {
  className?: string;
  showFreeShipping?: boolean;
}) {
  // Free shipping feature has been removed
  // This component now returns null to hide all free shipping messages
  return null;
}
