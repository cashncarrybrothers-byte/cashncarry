'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackToTopProps {
    showAfter?: number; // Pixels to scroll before showing button
    className?: string;
}

export function BackToTop({ showAfter = 400, className }: BackToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > showAfter) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Check on mount
        toggleVisibility();

        // Add scroll listener
        window.addEventListener('scroll', toggleVisibility, { passive: true });

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [showAfter]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className={cn(
                'fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-16 opacity-0 pointer-events-none',
                className
            )}
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
