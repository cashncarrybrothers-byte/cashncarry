import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductTagBySlug, getProducts, getProductCategories } from '@/lib/woocommerce';
import { getProductBrands } from '@/lib/woocommerce/brands';
import { ArchiveTemplate } from '@/components/templates';
import { ShopTopBar } from '@/components/shop/shop-top-bar';
import { BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/site.config';

interface ProductTagPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: ProductTagPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        const tag = await getProductTagBySlug(slug);

        if (!tag) {
            return {
                title: 'Tag Not Found',
            };
        }

        return {
            title: `${tag.name} Products | Brothers Cash & Carry`,
            description: tag.description || `Shop products tagged with ${tag.name} at Brothers Cash & Carry`,
            openGraph: {
                title: tag.name,
                description: tag.description,
                url: `${siteConfig.site_domain}/product-tag/${slug}`,
            },
        };
    } catch {
        return {
            title: 'Tag Not Found',
        };
    }
}

export default async function ProductTagPage({ params, searchParams }: ProductTagPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    // Get the tag slug
    const tagSlug = resolvedParams.slug;

    let tag;
    try {
        tag = await getProductTagBySlug(tagSlug);
    } catch (error) {
        notFound();
    }

    if (!tag) {
        notFound();
    }

    // Fetch categories and brands for filters
    const [categories, brandsData] = await Promise.all([
        getProductCategories(),
        getProductBrands({ hide_empty: true })
    ]);

    // Fetch products for this tag
    const page = parseInt(resolvedSearchParams.page as string) || 1;
    const perPage = 20;

    const { data: products, total, totalPages } = await getProducts({
        tag: tag.id.toString(),
        page,
        per_page: perPage,
        orderby: (resolvedSearchParams.orderby as any) || 'date',
        order: (resolvedSearchParams.order as 'asc' | 'desc') || 'desc',
    });

    // Build breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Shop', href: '/shop' },
        { label: `Tag: ${tag.name}` }
    ];

    return (
        <ArchiveTemplate
            title={`Tag: ${tag.name}`}
            description={tag.description}
            breadcrumbs={breadcrumbs}
            products={products}
            totalProducts={total}
            currentPage={page}
            totalPages={totalPages}
            basePath={`/product-tag/${tagSlug}`}
            gridColumns={8}
            filterBar={
                <Suspense fallback={<Skeleton className="h-16 w-full" />}>
                    <ShopTopBar
                        categories={categories}
                        brands={brandsData}
                        totalProducts={total}
                    />
                </Suspense>
            }
        />
    );
}
