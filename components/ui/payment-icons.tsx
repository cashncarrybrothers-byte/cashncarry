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
    const sizeClasses = {
        sm: 'h-5',
        md: 'h-6',
        lg: 'h-8',
    };

    const iconSize = sizeClasses[size];

    return (
        <div className={cn('space-y-2', className)}>
            {showLabel && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                    Secure payments powered by Stripe
                </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Visa */}
                <div className="bg-white rounded px-2 py-1 border border-neutral-200">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="white" />
                        <path d="M19.5 21H17L18.7 11H21.2L19.5 21Z" fill="#1434CB" />
                        <path d="M28.5 11.2C28 11 27.2 10.8 26.2 10.8C23.7 10.8 22 12.1 22 14C22 15.4 23.3 16.2 24.3 16.7C25.3 17.2 25.7 17.5 25.7 18C25.7 18.7 24.9 19 24.1 19C23 19 22.4 18.8 21.5 18.4L21.1 18.2L20.7 21C21.4 21.3 22.6 21.5 23.9 21.5C26.6 21.5 28.2 20.2 28.2 18.2C28.2 17.1 27.5 16.2 26 15.5C25.1 15 24.6 14.7 24.6 14.2C24.6 13.8 25.1 13.3 26.1 13.3C26.9 13.3 27.5 13.5 28 13.7L28.3 13.8L28.5 11.2Z" fill="#1434CB" />
                        <path d="M32.2 11H30.2C29.6 11 29.1 11.2 28.9 11.8L25.2 21H27.9L28.4 19.5H31.7L32 21H34.4L32.2 11ZM29.2 17.4C29.4 16.9 30.3 14.5 30.3 14.5C30.3 14.5 30.5 14 30.6 13.6L30.8 14.4C30.8 14.4 31.4 17 31.5 17.4H29.2Z" fill="#1434CB" />
                        <path d="M16.3 11L13.8 17.8L13.5 16.3C13 14.7 11.5 12.9 9.8 12L12 21H14.8L19 11H16.3Z" fill="#1434CB" />
                        <path d="M12 11H7.5L7.5 11.2C10.8 12 13 14.3 13.5 16.3L12.9 11.9C12.8 11.2 12.3 11 12 11Z" fill="#F9A533" />
                    </svg>
                </div>

                {/* Mastercard */}
                <div className="bg-white rounded px-2 py-1 border border-neutral-200">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="white" />
                        <circle cx="18" cy="16" r="8" fill="#EB001B" />
                        <circle cx="30" cy="16" r="8" fill="#F79E1B" />
                        <path d="M24 10.5C25.9 12 27.2 14.4 27.2 17C27.2 19.6 25.9 22 24 23.5C22.1 22 20.8 19.6 20.8 17C20.8 14.4 22.1 12 24 10.5Z" fill="#FF5F00" />
                    </svg>
                </div>

                {/* Amex */}
                <div className="bg-[#006FCF] rounded px-2 py-1">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="#006FCF" />
                        <path d="M10 20L12.5 14H14.5L17 20H15L14.5 19H12.5L12 20H10ZM13 17.5H14L13.5 16L13 17.5Z" fill="white" />
                        <path d="M17.5 20V14H20.5L21.5 17L22.5 14H25.5V20H24V16L22.5 20H20.5L19 16V20H17.5Z" fill="white" />
                        <path d="M26 20V14H31V15.5H28V16.5H30.5V18H28V18.5H31V20H26Z" fill="white" />
                        <path d="M32 20L34 17L32 14H34.5L35.5 15.5L36.5 14H39L37 17L39 20H36.5L35.5 18.5L34.5 20H32Z" fill="white" />
                    </svg>
                </div>

                {/* Klarna */}
                <div className="bg-[#FFB3C7] rounded px-2 py-1">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="#FFB3C7" />
                        <path d="M12 11H14V21H12V11Z" fill="black" />
                        <path d="M15 11H17.5C17.5 13.5 16.5 15.5 14.5 17L18 21H15L11.5 17L13.5 15.5C14.5 14.5 15 13 15 11Z" fill="black" />
                        <path d="M19 11H21V21H19V11Z" fill="black" />
                        <path d="M26 11H28V21H26V11Z" fill="black" />
                        <path d="M30 16C30 13.2 32.2 11 35 11C36.5 11 37.8 11.6 38.7 12.6L37.3 14C36.7 13.4 35.9 13 35 13C33.3 13 32 14.3 32 16C32 17.7 33.3 19 35 19C35.9 19 36.7 18.6 37.3 18L38.7 19.4C37.8 20.4 36.5 21 35 21C32.2 21 30 18.8 30 16Z" fill="black" />
                        <circle cx="23" cy="19" r="2" fill="black" />
                    </svg>
                </div>

                {/* Apple Pay */}
                <div className="bg-black rounded px-2 py-1">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="black" />
                        <path d="M14 12C13.2 12 12.5 12.7 12.5 13.7V14.3C12.5 14 13.1 13.5 13.8 13.5C14.5 13.5 15 14 15.2 14.3V13.5C15.2 12.7 14.6 12 14 12Z" fill="white" />
                        <path d="M13.8 14.5C12.8 14.5 12 15.3 12 16.5V19C12 20.2 12.8 21 13.8 21C14.3 21 14.8 20.8 15.2 20.4V20.8H16.5V14.7H15.2V15.1C14.8 14.7 14.3 14.5 13.8 14.5ZM14 19.5C13.4 19.5 13.2 19 13.2 18.5V17C13.2 16.5 13.5 16 14 16C14.5 16 14.9 16.5 14.9 17V18.5C14.9 19 14.5 19.5 14 19.5Z" fill="white" />
                        <path d="M20 14.5C19.2 14.5 18.5 15 18.2 15.5V14.7H17V23H18.2V20.5C18.5 20.8 19 21 19.6 21C20.8 21 21.8 20 21.8 18.3V17.2C21.8 15.5 21 14.5 20 14.5ZM20.5 18.3C20.5 19.2 20 19.5 19.5 19.5C19 19.5 18.5 19 18.5 18.3V17.2C18.5 16.5 19 16 19.5 16C20 16 20.5 16.3 20.5 17.2V18.3Z" fill="white" />
                        <path d="M25 14.5C24.2 14.5 23.5 15 23.2 15.5V14.7H22V23H23.2V20.5C23.5 20.8 24 21 24.6 21C25.8 21 26.8 20 26.8 18.3V17.2C26.8 15.5 26 14.5 25 14.5ZM25.5 18.3C25.5 19.2 25 19.5 24.5 19.5C24 19.5 23.5 19 23.5 18.3V17.2C23.5 16.5 24 16 24.5 16C25 16 25.5 16.3 25.5 17.2V18.3Z" fill="white" />
                        <path d="M28 12H29.2V21H28V12Z" fill="white" />
                        <path d="M33 14.5C31.5 14.5 30.5 15.7 30.5 17.5V18C30.5 19.8 31.5 21 33.2 21C34.2 21 35 20.5 35.5 19.8L34.5 19C34.2 19.4 33.8 19.6 33.3 19.6C32.5 19.6 32 19 32 18.2H35.8V17.5C35.8 15.7 34.8 14.5 33 14.5ZM32 17C32 16.2 32.4 15.8 33 15.8C33.6 15.8 34 16.2 34.2 17H32Z" fill="white" />
                        <text x="37" y="19" fill="white" fontSize="6" fontFamily="Arial" fontWeight="bold">Pay</text>
                    </svg>
                </div>

                {/* Google Pay */}
                <div className="bg-white rounded px-2 py-1 border border-neutral-200">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="white" />
                        <path d="M22.5 16.5V20H21V12H24.5C25.3 12 26 12.3 26.5 12.8C27.1 13.3 27.4 14 27.4 14.8C27.4 15.6 27.1 16.3 26.5 16.8C26 17.3 25.3 17.5 24.4 17.5H22.5V16.5ZM22.5 13.5V16H24.5C25 16 25.4 15.8 25.7 15.5C26 15.2 26.2 14.8 26.2 14.3C26.2 13.8 26 13.4 25.7 13.1C25.4 12.8 25 12.6 24.5 12.6H22.5V13.5Z" fill="#5F6368" />
                        <path d="M30.5 14.5C31.3 14.5 32 14.8 32.5 15.3L33.5 14.3C32.8 13.6 31.8 13.2 30.5 13.2C28.5 13.2 27 14.7 27 16.7C27 18.7 28.5 20.2 30.5 20.2C31.8 20.2 32.8 19.7 33.5 18.9L32.5 17.9C32 18.4 31.3 18.8 30.5 18.8C29.3 18.8 28.3 17.9 28.3 16.7C28.3 15.5 29.3 14.5 30.5 14.5Z" fill="#5F6368" />
                        <path d="M37 13.3H38.3V20H37V13.3Z" fill="#5F6368" />
                        <path d="M12 15.5C12 14 13.2 12.8 14.7 12.8C15.5 12.8 16.2 13.1 16.7 13.6L15.8 14.5C15.5 14.2 15.1 14 14.7 14C14 14 13.3 14.7 13.3 15.5C13.3 16.3 14 17 14.7 17C15.3 17 15.8 16.7 16 16.2H14.5V15H17.3C17.3 15.2 17.3 15.3 17.3 15.5C17.3 17.2 16.2 18.5 14.7 18.5C13.2 18.5 12 17.2 12 15.5Z" fill="#4285F4" />
                        <circle cx="19" cy="15.5" r="2.5" fill="#34A853" />
                        <circle cx="19" cy="15.5" r="2.5" fill="#FBBC05" />
                        <circle cx="19" cy="15.5" r="2.5" fill="#EA4335" />
                    </svg>
                </div>

                {/* Swish */}
                <div className="bg-white rounded px-2 py-1 border border-neutral-200">
                    <svg className={cn(iconSize, 'w-auto')} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="32" rx="4" fill="white" />
                        <path d="M14 16C14 13 16 11 19 11C21 11 22.5 12 23.5 13.5L21.5 15C21 14 20 13.5 19 13.5C17.5 13.5 16.5 14.5 16.5 16C16.5 17.5 17.5 18.5 19 18.5C20 18.5 21 18 21.5 17L23.5 18.5C22.5 20 21 21 19 21C16 21 14 19 14 16Z" fill="#20AB5A" />
                        <path d="M24 11H26.5L28.5 17L30.5 11H33L29.5 21H27.5L24 11Z" fill="#20AB5A" />
                        <path d="M35 16C35 18 36.5 19 38 19C39 19 39.5 18.5 39.5 18C39.5 17.5 39 17 38 17C36 16.5 34.5 15.5 34.5 14C34.5 12.5 36 11 38 11C39.5 11 41 11.5 42 13L40 14.5C39.5 13.5 39 13 38 13C37.5 13 37 13.3 37 14C37 14.5 37.5 15 38.5 15C40.5 15.5 42 16.5 42 18C42 19.5 40.5 21 38 21C36 21 34 20 33 18L35 16Z" fill="#20AB5A" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

/**
 * Compact version for smaller spaces
 */
export function PaymentIconsCompact({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}>
            {/* Visa */}
            <div className="bg-white rounded px-1.5 py-0.5 border border-neutral-200">
                <span className="text-[10px] font-bold text-[#1434CB]">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="bg-white rounded px-1.5 py-0.5 border border-neutral-200 flex items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] -ml-1.5"></span>
            </div>
            {/* Klarna */}
            <div className="bg-[#FFB3C7] rounded px-1.5 py-0.5">
                <span className="text-[10px] font-bold text-black">Klarna</span>
            </div>
            {/* Apple Pay */}
            <div className="bg-black rounded px-1.5 py-0.5">
                <span className="text-[10px] font-medium text-white"> Pay</span>
            </div>
            {/* Google Pay */}
            <div className="bg-white rounded px-1.5 py-0.5 border border-neutral-200">
                <span className="text-[10px] font-medium text-neutral-700">G Pay</span>
            </div>
            {/* Swish */}
            <div className="bg-white rounded px-1.5 py-0.5 border border-neutral-200">
                <span className="text-[10px] font-bold text-[#20AB5A]">Swish</span>
            </div>
        </div>
    );
}
