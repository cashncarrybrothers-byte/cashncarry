'use client';

import { cn } from '@/lib/utils';

interface PaymentIconsProps {
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Payment method icons component
 * Shows logos for: Visa, Mastercard, Amex, Klarna, Apple Pay, Google Pay, Swish
 */
export function PaymentIcons({ className, showLabel = true, size = 'md' }: PaymentIconsProps) {
    // Size logic can be simplified or removed if we just want responsive width
    // But keeping it for backward compatibility and control
    const sizeClasses = {
        sm: 'h-6',
        md: 'h-8',
        lg: 'h-10',
    };

    const heightClass = sizeClasses[size] || 'h-8';

    return (
        <div className={cn('space-y-2', className)}>
            {showLabel && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                    Secure payments powered by Stripe
                </p>
            )}
            <div className="flex items-center justify-center">
                {/* Single Payment Methods Image */}
                <img
                    src="https://crm.cashncarry.se/wp-content/uploads/2026/01/payment-methods.png"
                    alt="Accepted Payment Methods: Visa, Mastercard, Klarna, Apple Pay, Google Pay, Swish"
                    className={cn('w-auto object-contain', heightClass)}
                />
            </div>
        </div>
    );
}

/**
 * Compact version for smaller spaces (Cart, Footer, etc.)
 */
export function PaymentIconsCompact({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <img
                src="https://crm.cashncarry.se/wp-content/uploads/2026/01/payment-methods.png"
                alt="Payment Methods"
                className="h-6 w-auto object-contain"
            />
        </div>
    );
}
