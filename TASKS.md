# Brothers Cash & Carry - UI/UX Improvement Tracker

> Priority: P0 = Critical (do first), P1 = High, P2 = Medium, P3 = Nice-to-have
> Status: [ ] Todo, [~] In Progress, [x] Done

---

## Phase 1: Conversion & Trust (P0)

### 1.1 [x] Mobile Sticky Add-to-Cart Bar
- On product pages, show a fixed bottom bar with price + "Add to Cart" when the main button scrolls out of view
- Huge mobile conversion driver — users shouldn't scroll back up to buy
- File: `components/shop/product-template.tsx`, `components/shop/sticky-add-to-cart.tsx`

### 1.2 [x] Trust Badges Row
- Add a row of trust signals below the hero / above product sections on homepage
- Icons: Free delivery over X kr, Secure Payment, Easy Returns, Fresh Guarantee
- Reusable component for product pages too (near add-to-cart)
- File: `components/shared/trust-badges.tsx`

### 1.3 [x] Add-to-Cart Feedback Animation
- When user clicks "Add to Cart", animate a small product thumbnail flying to the cart icon
- Or: brief green checkmark + count bump animation on cart badge
- Implemented: green checkmark + scale animation on cart badge (800ms duration)
- File: `components/shop/product-card.tsx`, `components/cart/cart-icon.tsx`

### 1.4 [x] Product Card Quick-View Hover
- On desktop hover, show a quick "eye" icon that opens a modal with product details
- Saves users from navigating away from shop grid just to check details
- File: `components/shop/product-card.tsx`, new `components/shop/quick-view-modal.tsx`

---

## Phase 2: Navigation & Discovery (P1)

### 2.1 [ ] Recently Viewed Products
- Track last 10 viewed products in localStorage
- Show as a horizontal scroll section on homepage (below hero) and on product pages
- File: new `store/recently-viewed-store.ts`, new `components/shared/recently-viewed.tsx`

### 2.2 [ ] Back-to-Top Button
- Floating button that appears after scrolling 400px down
- Smooth scroll to top, subtle fade animation
- File: new `components/shared/back-to-top.tsx`, add to `app/layout.tsx`

### 2.3 [ ] Enhanced Breadcrumbs
- Current breadcrumbs exist but could be more prominent
- Add structured data (JSON-LD) for SEO
- Show category hierarchy on product pages (Home > Category > Subcategory > Product)
- File: `components/layout/breadcrumbs.tsx`

### 2.4 [ ] Mega Menu with Images
- Current nav is text-only links
- Add category images/icons in a dropdown mega menu on desktop hover
- Show featured products or deals in the mega menu
- File: `components/layout/mega-menu.tsx`, `components/layout/header.tsx`

---

## Phase 3: Homepage Improvements (P1)

### 3.1 [ ] Hero CTA Clarity
- Ensure hero slides have clear, actionable CTAs ("Shop Now", "See Deals")
- Add urgency text for deals ("Ends Sunday", "Limited Stock")
- File: `components/home/split-hero.tsx`

### 3.2 [ ] Social Proof Counter Strip
- "5,000+ Products | 1,200+ Happy Customers | Same-Day Delivery"
- Animated counting numbers on scroll into view
- Place between hero and categories
- File: new `components/home/social-proof-strip.tsx`

### 3.3 [ ] Homepage Section Variety
- Currently 6 ProductShowcase sections in a row (same layout repeated)
- Alternate between: horizontal scroll, 2-row grid, featured large card + smaller cards
- Break monotony with different visual layouts per section
- File: `app/page.tsx`, new layout variants in `components/home/`

---

## Phase 4: Visual Polish & Micro-interactions (P2)

### 4.1 [ ] Button Press Effects
- Add subtle scale-down (0.97) on button press (active state)
- Adds tactile feel across all buttons
- File: `components/ui/button.tsx` or globals.css

### 4.2 [ ] Skeleton Loading Improvements
- Make skeletons match actual content shapes (card with image area, title lines, price)
- Current: may be generic gray bars
- File: `app/shop/loading.tsx`, `app/product/[slug]/loading.tsx`

### 4.3 [ ] Empty State Illustrations
- Replace plain text + icon empty states with friendly illustrations
- Cart empty, wishlist empty, no search results, no products in category
- File: `components/cart/cart-drawer.tsx`, `components/wishlist/wishlist-page.tsx`

### 4.4 [ ] Consistent Page Transitions
- Add smooth fade-in transitions between page navigations
- Use Next.js layout transitions or Framer Motion AnimatePresence
- File: `app/layout.tsx` or new `components/shared/page-transition.tsx`

### 4.5 [ ] Hover Card Refinements
- Product cards: Add subtle border-radius animation, smoother shadow transitions
- Ensure consistent hover behavior across all card types (product, blog, category)
- File: `components/shop/product-card.tsx`, globals.css

---

## Phase 5: Mobile Experience (P2)

### 5.1 [ ] Mobile Bottom Navigation Bar
- Fixed bottom bar: Home, Categories, Search, Cart, Account
- Replace/complement the hamburger menu for key actions
- Most important mobile UX pattern for e-commerce
- File: new `components/layout/mobile-bottom-nav.tsx`, `app/layout.tsx`

### 5.2 [ ] Pull-Down Category Tabs on Shop
- Horizontal scrollable category tabs at top of shop page on mobile
- Quick category switching without opening filters
- File: `components/shop/shop-top-bar.tsx` or new component

### 5.3 [ ] Swipe Gestures on Product Images
- Ensure product gallery supports swipe on mobile
- Swipe between images, pinch to zoom
- File: `components/shop/product-image-gallery.tsx`

### 5.4 [ ] Mobile Product Grid: 2-Column Compact
- Ensure the mobile 2-column grid has optimized spacing and touch targets
- Price and add-to-cart button must be easily tappable
- File: `components/shop/product-grid.tsx`, `components/shop/product-card.tsx`

---

## Phase 6: Accessibility (P2)

### 6.1 [ ] Skip-to-Content Link
- Add hidden "Skip to main content" link for keyboard/screen reader users
- File: `app/layout.tsx`

### 6.2 [ ] ARIA Live Regions
- Announce cart additions, filter changes, and search results to screen readers
- File: `components/cart/cart-icon.tsx`, `components/shop/product-filters.tsx`

### 6.3 [ ] Focus Trap in Modals
- Ensure Tab key cycles within open modals (cart drawer, search, mobile menu)
- Radix/shadcn may handle some, verify all
- File: `components/cart/cart-drawer.tsx`, `components/search/search-modal.tsx`

### 6.4 [ ] Keyboard Navigation for Product Grid
- Arrow key navigation within product grids
- Enter to open, Tab to move between cards
- File: `components/shop/product-grid.tsx`

---

## Phase 7: Advanced Features (P3)

### 7.1 [ ] Product Comparison
- Compare 2-4 products side by side (specs, price, weight)
- "Compare" checkbox on product cards, floating comparison bar
- File: new `store/compare-store.ts`, new `components/shop/compare-*.tsx`

### 7.2 [ ] Social Sharing on Products
- Share buttons (copy link, WhatsApp, Facebook) on product pages
- File: new `components/shared/share-buttons.tsx`

### 7.3 [ ] Stock Notification ("Notify Me")
- For out-of-stock products, email notification signup
- File: new `components/shop/stock-notification.tsx`

### 7.4 [ ] Newsletter Popup
- Timed or exit-intent popup for newsletter signup
- "Get 10% off your first order" — matches footer promise
- File: new `components/shared/newsletter-popup.tsx`

### 7.5 [ ] Dark Mode Toggle in Header
- Visible theme toggle button (sun/moon icon)
- Currently dark mode exists but no user-facing toggle
- File: `components/layout/header.tsx`, `components/theme/theme-toggle.tsx`

---

## Completed

### Typography Token Bridge ✅
- [x] Added CSS variables for typography (`--text-*`) to globals.css
- [x] Added composite `textStyles` map to theme.tokens.ts
- [x] Updated all typography classes to use CSS variables
- [x] Filled missing line-heights and letter-spacing tokens
