import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'default' | 'light';
}

export function Breadcrumbs({ items, className, variant = 'default' }: BreadcrumbsProps) {
  const isLight = variant === 'light';

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex flex-wrap items-center gap-1 text-sm',
        isLight ? 'text-white/70' : 'text-muted-foreground',
        className
      )}
    >
      {/* Home Link */}
      <Link
        href="/"
        className={cn(
          'flex items-center transition-colors',
          isLight ? 'hover:text-white' : 'hover:text-foreground'
        )}
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1">
            <ChevronRight className={cn('h-4 w-4 flex-shrink-0', isLight && 'text-white/50')} />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn(
                  'transition-colors whitespace-nowrap',
                  isLight ? 'hover:text-white' : 'hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'break-words',
                  isLast && (isLight ? 'font-medium text-white' : 'font-medium text-foreground')
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
