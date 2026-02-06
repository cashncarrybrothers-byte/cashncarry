'use client';

import { Globe, ShieldCheck, RotateCcw, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const badges = [
  {
    icon: Globe,
    title: 'Europe Wide Shipping',
    subtitle: 'We deliver across Europe',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    subtitle: 'SSL encrypted checkout',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    subtitle: 'Hassle-free returns',
  },
  {
    icon: Leaf,
    title: 'Fresh Guarantee',
    subtitle: 'Quality you can trust',
  },
] as const;

interface TrustBadgesProps {
  className?: string;
  /** Compact variant for product pages (inline, smaller) */
  variant?: 'default' | 'compact';
}

export function TrustBadges({ className, variant = 'default' }: TrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('grid grid-cols-2 gap-3', className)}>
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <badge.icon className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-xs font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className={cn('w-full', className)}>
      <div className="w-full px-4 md:px-[50px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border/50 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <badge.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {badge.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
