import "./globals.css";

import { Work_Sans as FontSans, Work_Sans as FontHeading } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TopInfoBar } from "@/components/layout/top-info-bar";
import { MaintenanceTicker } from "@/components/layout/maintenance-ticker";
import { SchemaScript } from "@/lib/schema/schema-script";
import { websiteSchema } from "@/lib/schema";
import { brothersOrganizationSchemaFull } from "@/lib/schema/organization";
// Analytics removed to prevent cross-domain tracking issues
import { VerticalSidebar } from "@/components/layout/vertical-sidebar";
import { ContentHeader } from "@/components/layout/content-header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Footer } from "@/components/layout/footer";
import { GeoMetaTags } from "@/components/seo/geo-meta-tags";
import { HreflangTags } from "@/components/seo/hreflang-tags";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { Toaster } from "@/components/ui/toaster";
import { BackToTop } from "@/components/shared/back-to-top";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";


import { getProductCategories } from "@/lib/woocommerce";

import type { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const fontHeading = FontHeading({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.site_name,
    template: `%s | ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "https://crm.cashncarry.se/wp-content/uploads/2026/01/brothers-cash-and-carry-favicon.png",
    shortcut: "https://crm.cashncarry.se/wp-content/uploads/2026/01/brothers-cash-and-carry-favicon.png",
    apple: "https://crm.cashncarry.se/wp-content/uploads/2026/01/brothers-cash-and-carry-favicon.png",
  },
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
  // OpenGraph with locale configuration
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.site_domain,
    siteName: siteConfig.site_name,
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: [
      {
        url: `${siteConfig.site_domain}/opengraph-image.jpeg`,
        width: 1200,
        height: 630,
        alt: siteConfig.site_name,
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.site_name,
    description: siteConfig.site_description,
    images: [`${siteConfig.site_domain}/twitter-image.jpeg`],
  },
  // Additional metadata
  keywords: [
    "grocery store",
    "online grocery",
    "fresh produce",
    "specialty foods",
    "international groceries",
    "grocery delivery",
    "organic products",
    "quality groceries",
  ],
  authors: [{ name: siteConfig.site_name }],
  creator: siteConfig.site_name,
  publisher: siteConfig.site_name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Viewport configuration for mobile devices
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getProductCategories({ hide_empty: true, per_page: 100 });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Add your WordPress/CMS domain here */}
        {/* <link rel="preconnect" href="YOUR_WORDPRESS_DOMAIN" /> */}
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />

        {/* Preload critical hero image - Add your hero image URL */}
        {/* <link
          rel="preload"
          as="image"
          href="YOUR_HERO_IMAGE_URL"
          fetchPriority="high"
        /> */}

        {/* Geo-Targeting Meta Tags */}
        <GeoMetaTags />

        {/* Hreflang Tags */}
        <HreflangTags canonicalUrl={siteConfig.site_domain} />

        {/* Analytics removed to prevent cross-domain tracking */}
      </head>
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontHeading.variable)} suppressHydrationWarning>
        {/* Analytics tracking removed */}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Maintenance Ticker - Shows when ordering is disabled */}
          <MaintenanceTicker />

          {/* Top Info Bar - Desktop only */}
          <TopInfoBar />

          {/* Main Layout Container */}
          <div className="main-layout">
            {/* Content Header - Search, Login, Cart */}
            <ContentHeader categories={categories} />

            {/* Page Content */}
            <main className="flex-1 w-full">
              {children}
            </main>

            <Footer />
          </div>

          <CartDrawer />
          <WishlistDrawer />
          <MobileMenu />
          <Toaster />

        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <AiChatWidget />
        <BackToTop />

        {/* Global WebSite Schema */}
        <SchemaScript
          id="website-schema"
          schema={websiteSchema({
            name: siteConfig.site_name,
            url: siteConfig.site_domain,
            description: siteConfig.site_description,
            searchUrl: `${siteConfig.site_domain}/shop`,
          })}
        />

        {/* Organization / LocalBusiness / GroceryStore Schema */}
        <SchemaScript
          id="organization-schema"
          schema={brothersOrganizationSchemaFull(siteConfig.site_domain)}
        />
      </body>
    </html>
  );
}
