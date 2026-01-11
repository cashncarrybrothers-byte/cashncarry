import type { Product, ProductReview } from '@/types/woocommerce';
import { wooCommerceProductSchema } from '@/lib/schema';
import { siteConfig } from '@/site.config';

interface ProductSchemaProps {
  product: Product;
  reviews?: ProductReview[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function ProductSchema({ product, reviews = [] }: ProductSchemaProps) {
  const baseUrl = siteConfig.site_domain;

  // Generate product schema without brandName to avoid duplicate brand field
  // WooCommerce products should extract brand from product metadata or attributes
  const productSchema = wooCommerceProductSchema(product, {
    baseUrl,
    // Do NOT pass brandName or sellerName - causes duplicate brand field
  });

  // Add reviews to schema if available (only real reviews)
  if (reviews && reviews.length > 0) {
    productSchema.review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.reviewer,
      },
      datePublished: review.date_created,
      reviewBody: review.review.replace(/\<[^\>]*\>/g, ''),
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }));
  }

  // Return only product schema
  // Breadcrumbs are handled by the page template separately
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}
