"use client";

import { ReactNode, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs, BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/components/shop/add-to-cart-button';
import { Plus } from 'lucide-react';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductImageGallery } from '@/components/shop/product-image-gallery';
import { ProductVariationSelector } from '@/components/shop/product-variation-selector';
import { ProductReviews } from '@/components/shop/product-reviews';
import { ProductSchema } from '@/components/shop/product-schema';
import { StockIndicator } from '@/components/shop/stock-indicator';
import { QuantitySelector } from '@/components/shop/quantity-selector';
import { ProductRecommendations } from '@/components/ai/product-recommendations';
import { StickyAddToCart } from '@/components/shop/sticky-add-to-cart';
import { StripeExpressCheckout } from '@/components/checkout/stripe-express-checkout';
import { WishlistButton } from '@/components/wishlist/wishlist-button';
import { WhatsAppOrderButton } from '@/components/whatsapp/whatsapp-order-button';
import { PaymentIcons } from '@/components/ui/payment-icons';
import { TrustBadges } from '@/components/shared/trust-badges';
import { formatPrice, getDiscountPercentage } from '@/lib/woocommerce';
import { decodeHtmlEntities } from '@/lib/utils';
import { trackViewContent } from '@/lib/analytics';
import { CommerceRules } from '@/config/commerce-rules';
import type { Product, ProductReview, ProductVariation } from '@/types/woocommerce';

interface ProductTemplateProps {
  product: Product;
  breadcrumbs?: BreadcrumbItem[];
  relatedProducts?: Product[];
  reviews?: ProductReview[];
  additionalContent?: ReactNode;
}

export function ProductTemplate({
  product,
  breadcrumbs,
  relatedProducts = [],
  reviews = [],
  additionalContent,
}: ProductTemplateProps) {
  const discount = getDiscountPercentage(product);
  const hasVariations = product.type === 'variable' && product.variations.length > 0;
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCartRef = useRef<HTMLDivElement>(null);

  // Track product view event
  useEffect(() => {
    trackViewContent(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Fetch variations if product has them
  useEffect(() => {
    if (hasVariations) {
      console.log('🔍 Fetching variations for product:', product.id);
      setIsLoadingVariations(true);
      fetch(`/api/products/${product.id}/variations`)
        .then(res => res.json())
        .then(data => {
          console.log('✅ Received variations:', data);
          console.log('📋 Product attributes:', product.attributes);
          setVariations(data);
          setIsLoadingVariations(false);
        })
        .catch(err => {
          console.error('❌ Failed to fetch variations:', err);
          setIsLoadingVariations(false);
        });
    }
  }, [hasVariations, product.id, product.attributes]);

  return (
    <>
      {/* SEO Schema */}
      <ProductSchema product={product} reviews={reviews} />

      <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
        <div className="container-archive py-6 md:py-8">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} className="mb-4" />
          )}

          {/* Product Content - 3 Column Layout (Always in One Row) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Column 1: You May Also Like (LEFT) */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="lg:col-span-2 order-3 lg:order-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-4">
                    You May Also Like
                  </h3>
                  {/* Desktop: Vertical list */}
                  <div className="hidden lg:block space-y-3">
                    {relatedProducts.slice(0, 4).map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="group relative bg-background border border-border hover:border-primary/30 rounded-lg p-3 transition-all duration-300 hover:shadow-md"
                      >
                        <Link href={`/product/${relatedProduct.slug}`} className="flex gap-3">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            {relatedProduct.images && relatedProduct.images[0] ? (
                              <Image
                                src={relatedProduct.images[0].src}
                                alt={relatedProduct.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 style={{ fontSize: '15.13px', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-foreground line-clamp-2 group-hover:text-foreground/70 transition-colors">
                              {decodeHtmlEntities(relatedProduct.name)}
                            </h4>
                            <div className="mt-1">
                              {relatedProduct.on_sale && relatedProduct.sale_price && relatedProduct.sale_price !== '' ? (
                                <div className="flex items-baseline gap-1.5">
                                  <span style={{ fontSize: '14.31px', fontWeight: 600, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-primary">
                                    {formatPrice(relatedProduct.sale_price, 'SEK')}
                                  </span>
                                  <span style={{ fontSize: '12.8px', fontWeight: 300, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-muted-foreground line-through">
                                    {formatPrice(relatedProduct.regular_price, 'SEK')}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ fontSize: '14.31px', fontWeight: 600, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-primary">
                                  {formatPrice(relatedProduct.price, 'SEK')}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        {/* Add to Cart Plus Button */}
                        <Button
                          size="icon"
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105 transition-all"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic here
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* Mobile: 2 per row grid */}
                  <div className="grid grid-cols-2 gap-3 lg:hidden">
                    {relatedProducts.slice(0, 4).map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="group relative bg-background border border-border hover:border-primary/30 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
                      >
                        <Link href={`/product/${relatedProduct.slug}`} className="block">
                          {/* Product Image */}
                          <div className="relative aspect-square overflow-hidden bg-muted">
                            {relatedProduct.images && relatedProduct.images[0] ? (
                              <Image
                                src={relatedProduct.images[0].src}
                                alt={relatedProduct.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-2">
                            <h4 className="text-xs font-medium text-foreground line-clamp-2 mb-1">
                              {decodeHtmlEntities(relatedProduct.name)}
                            </h4>
                            <div>
                              {relatedProduct.on_sale && relatedProduct.sale_price && relatedProduct.sale_price !== '' ? (
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm font-semibold text-primary">
                                    {formatPrice(relatedProduct.sale_price, 'SEK')}
                                  </span>
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(relatedProduct.regular_price, 'SEK')}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm font-semibold text-primary">
                                  {formatPrice(relatedProduct.price, 'SEK')}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        {/* Add to Cart Plus Button */}
                        <Button
                          size="icon"
                          className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105 transition-all z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic here
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Column 2: Product Images (CENTER) - First on mobile */}
            <div className={relatedProducts && relatedProducts.length > 0 ? "lg:col-span-6 order-1 lg:order-2" : "lg:col-span-8 order-1"}>
              <div className="relative bg-white dark:bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50">
                <ProductImageGallery
                  images={product.images || []}
                  productName={product.name}
                />
              </div>
            </div>

            {/* Column 3: Product Info (RIGHT) - Second on mobile */}
            <div className={relatedProducts && relatedProducts.length > 0 ? "lg:col-span-4 space-y-6 order-2 lg:order-3" : "lg:col-span-4 space-y-6 order-2"}>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-primary material-symbols-outlined text-sm">verified</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Premium Quality</span>
                </div>
                {product.categories && product.categories.length > 0 && (
                  <>
                    {product.categories.map((category) => (
                      <Link key={category.id} href={`/product-category/${category.slug}`}>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer">
                          {decodeHtmlEntities(category.name)}
                        </Badge>
                      </Link>
                    ))}
                  </>
                )}
                {product.featured && (
                  <Badge className="bg-secondary text-primary">
                    ⭐ Featured
                  </Badge>
                )}
                {product.on_sale && discount > 0 && (
                  <Badge variant="destructive">
                    -{discount}% OFF
                  </Badge>
                )}
              </div>

              {/* Title & SKU */}
              <div>
                {/* Brand Display using WooCommerce Brands */}
                {product.brands && product.brands.length > 0 && (
                  <div className="mb-3">
                    {product.brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brand/${brand.slug}`}
                        className="inline-flex items-center gap-3 group"
                      >
                        {typeof brand.image === 'object' && brand.image?.src ? (
                          <div className="relative w-12 h-12 bg-white rounded-full border border-border p-1 overflow-hidden shadow-sm group-hover:border-primary/50 transition-colors">
                            <Image
                              src={brand.image.src}
                              alt={brand.name}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                            {decodeHtmlEntities(brand.name)}
                          </Badge>
                        )}
                        {typeof brand.image === 'object' && brand.image?.src && (
                          <span style={{ fontSize: '15.13px', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-muted-foreground group-hover:text-foreground transition-colors">
                            {decodeHtmlEntities(brand.name)}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-4">
                  {decodeHtmlEntities(product.name)}
                </h1>
                {product.sku && (
                  <p style={{ fontSize: '13.53px', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.03em' }} className="mt-2 text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                )}

                {/* Rating */}
                {product.rating_count > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          style={{ fontSize: '16px' }}
                          className={
                            i < Math.floor(parseFloat(product.average_rating))
                              ? 'text-secondary'
                              : 'text-muted-foreground/30'
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span style={{ fontSize: '14.31px', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.03em' }} className="ml-2 text-foreground">
                        {product.average_rating}
                      </span>
                      <span style={{ fontSize: '14.31px', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.03em' }} className="ml-1 text-muted-foreground">
                        ({product.rating_count} {product.rating_count === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-foreground">
                    {formatPrice(hasVariations && selectedVariation ? selectedVariation.price : product.price, 'SEK')}
                  </span>
                  <span className="text-muted-foreground font-medium">/ unit</span>
                </div>
                <p className="text-primary text-sm font-bold mt-1">
                  {product.stock_status === 'instock' ? 'In Stock - Ready for Delivery' : 'Out of Stock'}
                </p>
              </div>

              {/* Stock Status */}
              <StockIndicator
                product={selectedVariation || product}
                variant="detailed"
              />

              {product.short_description && (
                <p className="text-muted-foreground leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Product Variations */}
              {hasVariations && (
                <div>
                  {isLoadingVariations ? (
                    <div style={{ fontSize: '15.13px', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.03em' }} className="py-3 text-muted-foreground">Loading options...</div>
                  ) : (
                    <ProductVariationSelector
                      product={product}
                      variations={variations}
                      onVariationChange={(variation) => {
                        console.log('Selected variation:', variation);
                        setSelectedVariation(variation);
                      }}
                    />
                  )}
                </div>
              )}

              {/* Add to Cart Section */}
              <div ref={addToCartRef} className="space-y-3 bg-primary/5 rounded-2xl p-5">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: '15.13px', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-foreground">Quantity:</span>
                  <QuantitySelector
                    initialQuantity={1}
                    min={1}
                    max={(() => {
                      // Check commerce rules quantity limit
                      const commerceLimit = CommerceRules.getQuantityLimit(product.id);
                      const stockLimit = selectedVariation?.stock_quantity || product.stock_quantity || 99;

                      // Use the lower of commerce limit or stock limit
                      return commerceLimit !== null ? Math.min(commerceLimit, stockLimit) : stockLimit;
                    })()}
                    onChange={setQuantity}
                  />
                </div>

                {/* Quantity Limit Notice */}
                {(() => {
                  const quantityLimit = CommerceRules.getQuantityLimit(product.id);
                  if (quantityLimit !== null) {
                    return (
                      <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span style={{ fontSize: '13.53px', fontWeight: 400 }}>
                          Limited to {quantityLimit} unit{quantityLimit > 1 ? 's' : ''} per order
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Add to Cart & Wishlist Buttons */}
                <div className="flex gap-3">
                  <AddToCartButton
                    product={product}
                    variation={selectedVariation}
                    quantity={quantity}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-5"
                    style={{ fontSize: '17.89px', fontWeight: 500, lineHeight: 1.52, letterSpacing: '0.03em' }}
                  />
                  <WishlistButton
                    product={product}
                    variation={selectedVariation || undefined}
                    size="lg"
                    variant="outline"
                    className="rounded-full py-5 px-6 border-2 hover:bg-red-50 dark:hover:bg-red-950/20"
                  />
                </div>

                {/* Express Checkout - Apple Pay / Google Pay (like WordPress) */}
                <StripeExpressCheckout
                  amount={parseFloat(selectedVariation?.price || product.price || '0') * quantity}
                  currency="SEK"
                  onSuccess={(result) => {
                    console.log('Express checkout success:', result);
                    // Redirect to order confirmation or handle success
                  }}
                  onError={(error) => {
                    console.error('Express checkout error:', error);
                  }}
                />

                {/* WhatsApp Order Button */}
                <WhatsAppOrderButton
                  context="product"
                  product={product}
                  variation={selectedVariation || undefined}
                  quantity={quantity}
                  requireCustomerInfo={true}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full py-5 border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                  label="Order via WhatsApp"
                />

                {/* Additional Info */}
                <div style={{ fontSize: '14.31px', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.03em' }} className="space-y-1 text-muted-foreground">
                  {product.shipping_required && (
                    <p className="flex items-center gap-2">
                      <span>📦</span> Shipping calculated at checkout
                    </p>
                  )}

                </div>
              </div>

              {/* Product Meta */}
              {product.tags && product.tags.length > 0 && (
                <div className="border-t border-border pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span style={{ fontSize: '14.31px', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.03em' }} className="text-foreground">Tags:</span>
                    {product.tags.map((tag) => (
                      <Link key={tag.id} href={`/product-tag/${tag.slug}`}>
                        <Badge variant="outline" style={{ fontSize: '12.8px', fontWeight: 300, lineHeight: 1.57, letterSpacing: '0.03em' }} className="border-border cursor-pointer hover:bg-primary/5 transition-colors">
                          {decodeHtmlEntities(tag.name)}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="border-t border-border pt-4 mt-4">
                <PaymentIcons size="sm" />
              </div>

              {/* Trust Badges */}
              <TrustBadges variant="compact" className="pt-3" />

              {/* Additional Product Info */}
              {additionalContent}
            </div>
          </div>

          {/* Product Detailed Information - Sequential Layout */}
          <div className="mt-12 space-y-16">
            {/* 1. Additional Information (Specifications) */}
            {hasProductAdditionalInfo(product) && (
              <section className="py-12 border-t border-border">
                <h2 className="text-2xl font-bold mb-8">Detailed Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  {product.sku && (
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">SKU</span>
                      <span className="font-bold">{product.sku}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Weight</span>
                      <span className="font-bold">{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Dimensions</span>
                      <span className="font-bold">{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm</span>
                    </div>
                  )}
                  {product.categories && product.categories.length > 0 && (
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Category</span>
                      <span className="font-bold text-right">{product.categories.map(c => decodeHtmlEntities(c.name)).join(', ')}</span>
                    </div>
                  )}
                  {product.brands && product.brands.length > 0 && (
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Brand</span>
                      <span className="font-bold">{product.brands.map(b => decodeHtmlEntities(b.name)).join(', ')}</span>
                    </div>
                  )}
                  {product.attributes && product.attributes.map((attr) => (
                    <div key={attr.id || attr.name} className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">{attr.name}</span>
                      <span className="font-bold text-right">{attr.options ? attr.options.join(', ') : 'N/A'}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Stock Status</span>
                    <span className="font-bold">{product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              </section>
            )}

            {/* 2. Description */}
            {product.description && (
              <section className="py-12 border-t border-border">
                <h2 className="text-2xl font-bold mb-8">Description</h2>
                <div
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </section>
            )}

            {/* 3. Reviews */}
            {(reviews.length > 0 || product.reviews_allowed) && (
              <section className="py-12 border-t border-border">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="w-full">
                    <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
                    {/* Note: ProductReviews component is already imported in ProductTabs, 
                        but we need to make sure it's available here. 
                        I'll add the import at the top of the file. */}
                    <ProductReviews
                      productId={product.id}
                      reviews={reviews}
                      averageRating={product.average_rating}
                      ratingCount={product.rating_count}
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="bg-primary/5 py-12">
        <div className="container-archive">
          <ProductRecommendations currentProduct={product} maxRecommendations={6} />
        </div>
      </div>

      {/* Mobile Sticky Add-to-Cart */}
      <StickyAddToCart
        product={product}
        variation={selectedVariation}
        quantity={quantity}
        triggerRef={addToCartRef}
      />
    </>
  );
}

// Helper functions for sequential layout
function hasProductAdditionalInfo(product: any): boolean {
  return !!(
    product.sku ||
    product.weight ||
    product.dimensions?.length ||
    product.dimensions?.width ||
    product.dimensions?.height ||
    (product.categories && product.categories.length > 0) ||
    (product.brands && product.brands.length > 0) ||
    (product.attributes && product.attributes.length > 0)
  );
}
