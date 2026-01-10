'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/analytics';

interface OrderSuccessTrackingProps {
  orderId: string;
  orderNumber: string;
  total: string;
  shippingTotal: string;
  lineItems: any[];
  customerEmail: string;
  deliveryCountry?: string;
  estimatedDeliveryDate?: string;
}

export function OrderSuccessTracking({
  orderId,
  orderNumber,
  total,
  shippingTotal,
  lineItems,
}: OrderSuccessTrackingProps) {
  useEffect(() => {
    // Track purchase event
    const totalValue = parseFloat(total);
    const shipping = parseFloat(shippingTotal);

    // Calculate tax (25% VAT is included in Swedish prices)
    const tax = totalValue * 0.2; // 20% of total (25% VAT means 20% of gross)

    trackPurchase(orderNumber, totalValue, lineItems, shipping, tax);
  }, [orderId, orderNumber, total, shippingTotal, lineItems]);

  // Analytics tracking removed to prevent cross-domain issues
  return null;
}
