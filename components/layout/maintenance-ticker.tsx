'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export function MaintenanceTicker() {
    const [isVisible, setIsVisible] = useState(true);

    // Check if ordering is disabled
    const isOrderingDisabled = process.env.NEXT_PUBLIC_ORDERING_DISABLED === 'true';

    // Don't render if ordering is not disabled or if user dismissed the banner
    if (!isOrderingDisabled || !isVisible) {
        return null;
    }

    return (
        <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-3 py-3 text-center">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 animate-pulse" />
                    <p className="text-sm font-medium md:text-base">
                        <span className="font-bold">Notice:</span> We're working on improvements to serve you better.
                        <span className="hidden sm:inline"> Ordering will start soon. Thank you for your patience!</span>
                        <span className="sm:hidden"> Orders starting soon!</span>
                    </p>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
                        aria-label="Dismiss notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
