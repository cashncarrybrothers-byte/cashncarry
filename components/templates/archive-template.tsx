import { ReactNode, Suspense } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductPagination } from '@/components/shop/product-pagination';
import { ProductSort } from '@/components/shop/product-sort';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import type { Product } from '@/types/woocommerce';

interface ArchiveTemplateProps {
  title: string;
  description?: string | ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  basePath: string;
  sidebar?: ReactNode;
  filterBar?: ReactNode;
  gridColumns?: 2 | 3 | 4 | 5;
  heroImage?: string;
}

const DEFAULT_HERO_IMAGE = 'https://crm.cashncarry.se/wp-content/uploads/2026/01/web-cover-1.jpg';

export function ArchiveTemplate({
  title,
  description,
  breadcrumbs,
  products,
  totalProducts,
  currentPage,
  totalPages,
  basePath,
  sidebar,
  filterBar,
  gridColumns = 3,
  heroImage = DEFAULT_HERO_IMAGE,
}: ArchiveTemplateProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      {/* Hero Section with Background Image */}
      <section className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full px-5 py-10 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-4">
                <Breadcrumbs items={breadcrumbs} variant="light" />
              </div>
            )}

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 max-w-2xl">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <div className="max-w-xl">
                {typeof description === 'string' ? (
                  <p className="text-base md:text-lg text-white/90 leading-relaxed">{description}</p>
                ) : (
                  <div className="text-white/90">{description}</div>
                )}
              </div>
            )}

            {/* Product Count Badge */}
            <div className="mt-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
                {totalProducts} Products Available
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-5 py-6 md:py-8 max-w-full">
        {/* Filter Bar Section */}
        <div className="mb-6 md:mb-8">
          {/* Custom Filter Bar (Top) */}
          {filterBar ? (
            <div>
              {filterBar}
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-primary">{products.length}</span> of{' '}
                <span className="font-medium text-primary">{totalProducts}</span> products
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                {sidebar && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="py-4">
                        {sidebar}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}

                {/* Sorting */}
                <div className={sidebar ? '' : 'ml-auto'}>
                  <Suspense fallback={<Skeleton className="h-10 w-[200px]" />}>
                    <ProductSort showLabel={false} />
                  </Suspense>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className={sidebar ? 'lg:grid lg:grid-cols-4 lg:gap-8' : ''}>
          {/* Sidebar (Desktop) */}
          {sidebar && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">{sidebar}</div>
            </aside>
          )}

          {/* Product Grid */}
          <div className={sidebar ? 'lg:col-span-3' : ''}>
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={gridColumns} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <ProductPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={basePath}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-primary/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold text-primary">
                  No products found
                </h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn&apos;t find any products matching your criteria. Try adjusting your filters or browse all products.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-2xl">
                    <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                      Development Note
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Products may not load in local development due to Vercel Security Checkpoint.
                      <br />
                      <strong>Don&apos;t worry:</strong> Products will load correctly when deployed to Vercel.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
