/**
 * Brand Configuration - Brothers Cash & Carry
 *
 * Centralized branding for the Cash N Carry online grocery store.
 */

export const brandConfig = {
  // Business Information
  businessName: "Brothers Cash & Carry",
  tagline: "Quality @ Affordability",
  description: "Your trusted source for authentic groceries from Asia, Africa, Latin America, and the Middle East. Quality products at affordable prices, delivered to your door.",

  // Cuisine Type
  cuisineType: "International Groceries",
  cuisineDescription: "authentic international grocery products from Asia, Africa, Latin America & Middle East",

  // Contact Information
  contact: {
    address: "Regndroppsgatan 3, 194 49 Upplands Väsby, Sweden",
    phone: "+46765670454",
    phoneSecondary: "+46765670454",
    whatsapp: "+46765670454",
    email: "support@cashncarry.se",
    reservationEmail: "orders@cashncarry.se",
    privacyEmail: "privacy@cashncarry.se",
    googleMapsUrl: "https://maps.google.com/?q=Regndroppsgatan+3,+194+49+Upplands+Väsby",
    googleBusinessProfile: "https://maps.google.com/?q=Brothers+Cash+Carry+Upplands+Väsby",
  },

  // Business Hours
  hours: {
    weekday: "Monday - Friday: 9:00 – 20:00",
    saturday: "Saturday: 10:00 – 19:00",
    sunday: "Sunday: 10:00 – 19:00",
    delivery: "Free delivery on orders over 500 SEK",
    europe: "Delivery across Sweden",
  },

  // Features
  features: {
    hasHalalCertification: true,
    hasVegetarianOptions: true,
    hasVeganOptions: true,
    hasDelivery: true,
    hasOnlineOrdering: true,
    hasEuropeShipping: false,
  },

  // Dietary Options (for filters)
  dietaryOptions: [
    { id: 'halal', label: 'Halal', enabled: true },
    { id: 'vegetarian', label: 'Vegetarian', enabled: true },
    { id: 'vegan', label: 'Vegan', enabled: true },
    { id: 'organic', label: 'Organic', enabled: true },
    { id: 'gluten-free', label: 'Gluten Free', enabled: true },
  ],

  // Social Media
  social: {
    facebook: "https://www.facebook.com/cashncarryse",
    instagram: "https://www.instagram.com/cashncarryse",
    twitter: "",
    youtube: "",
    tiktok: "",
  },

  // Currency
  currency: {
    code: "SEK",
    symbol: "kr",
  },

  // SEO
  seo: {
    defaultTitle: "Brothers Cash & Carry - International Groceries in Sweden",
    titleTemplate: "%s | Brothers Cash & Carry",
    defaultDescription: "Shop quality international groceries online. Fresh produce, spices, rice, frozen foods & more from Asia, Africa, Latin America, and the Middle East. Fast delivery in Sweden.",
    keywords: ["international grocery", "asian grocery", "african grocery", "middle eastern food", "latin american food", "halal food", "grocery delivery sweden", "ethnic food store", "cashncarry"],
  },
} as const;

// Type export for TypeScript
export type BrandConfig = typeof brandConfig;
