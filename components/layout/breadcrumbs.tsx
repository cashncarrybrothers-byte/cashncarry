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
  showStructuredData?: boolean; // Enable SEO structured data
}

export function Breadcrumbs({
  items,
  className,
  variant = 'default',
  showStructuredData = true
}: BreadcrumbsProps) {
  const isLight = variant === 'light';

  // Generate structured data for SEO
  const structuredData = showStructuredData ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': typeof window !== 'undefined' ? window.location.origin : 'https://www.cashncarry.se'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': item.label,
        'item': item.href
          ? (typeof window !== 'undefined' ? `${window.location.origin}${item.href}` : `https://www.cashncarry.se${item.href}`)
          : undefined
      }))
    ]
  } : null;

  return (
    <>
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-sm md:text-base',
          isLight ? 'text-white/70' : 'text-muted-foreground',
          className
        )}
      >
        {/* Home Link */}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-1.5 transition-all duration-200 rounded-md px-2 py-1 -ml-2',
            isLight
              ? 'hover:text-white hover:bg-white/10'
              : 'hover:text-foreground hover:bg-muted'
          )}
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Home</span>
        </Link>

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className="flex items-center gap-1.5">
              <ChevronRight
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isLight ? 'text-white/40' : 'text-muted-foreground/50'
                )}
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-all duration-200 whitespace-nowrap rounded-md px-2 py-1',
                    isLight
                      ? 'hover:text-white hover:bg-white/10'
                      : 'hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'break-words px-2 py-1 rounded-md',
                    isLast && (
                      isLight
                        ? 'font-semibold text-white bg-white/10'
                        : 'font-semibold text-foreground bg-primary/10'
                    )
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
    </>
  );
}

