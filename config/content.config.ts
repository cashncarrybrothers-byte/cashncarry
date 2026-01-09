/**
 * Content Configuration
 *
 * All brand-specific content and copy centralized in one place.
 * To rebrand: Just update this file and brand.config.ts
 *
 * @template Fourlines Grocery Template
 * @author Fourlines Agency
 * @website https://fourlinesagency.com
 */

import { brandConfig } from './brand.config';

export const contentConfig = {
  // Homepage Content
  home: {
    hero: {
      badge: `Quality ${brandConfig.cuisineType}`,
      title: brandConfig.businessName,
      description: `Experience quality groceries and fresh products. From specialty items to everyday essentials, everything you need for your kitchen delivered to your door.`,
      cta: {
        primary: 'Shop Now',
        secondary: 'View Categories',
      },
    },
    features: [
      {
        title: 'Quality Products',
        description: 'Carefully selected products from trusted suppliers',
        icon: 'utensils',
      },
      {
        title: 'Fresh Daily',
        description: 'Fresh produce and products delivered daily',
        icon: 'star',
      },
      {
        title: 'Fast Delivery',
        description: 'Quick and reliable delivery to your doorstep',
        icon: 'clock',
      },
      {
        title: 'Easy Ordering',
        description: 'Simple online ordering with secure payment options',
        icon: 'shopping-bag',
      },
    ],
    featuredSection: {
      title: 'Featured Products',
      description: 'Our most popular items, loved by customers',
      cta: 'View All Products',
    },
    callToAction: {
      title: `Ready to Shop at ${brandConfig.businessName}?`,
      description: `Order now and enjoy quality groceries delivered to your home with fast, reliable service.`,
      buttons: {
        primary: 'Shop Now',
        secondary: 'Browse Categories',
      },
    },
    about: {
      badge: 'Our Story',
      title: 'Quality You Can Trust',
      paragraphs: [
        `${brandConfig.businessName} has been serving our community with quality groceries and exceptional service. We bring you the best products at competitive prices.`,
        `Every product is carefully selected to ensure freshness and quality. From specialty items to everyday essentials, we make grocery shopping convenient and enjoyable.`,
      ],
      cta: 'Learn More About Us',
    },
  },

  // Shop Page Content
  menu: {
    title: 'Shop',
    description: `Discover quality ${brandConfig.cuisineDescription} and everyday essentials. Browse our full selection of products.`,
    metadata: {
      title: `Shop - ${brandConfig.businessName}`,
      description: `Browse our selection of quality groceries and specialty items`,
    },
  },

  // About Page Content
  about: {
    metadata: {
      title: `About Us - ${brandConfig.businessName}`,
      description: `Learn about our story, our commitment to quality, and our dedication to serving our community`,
    },
    hero: {
      title: `About ${brandConfig.businessName}`,
      subtitle: `Bringing quality groceries to your table since 2024`,
    },
    sections: {
      story: {
        title: 'Our Story',
        content: [
          `${brandConfig.businessName} was founded with a simple mission: to provide quality groceries and exceptional service to our community. We believe that everyone deserves access to fresh, quality products at affordable prices.`,
          `From specialty items to everyday essentials, every product in our store is carefully selected to meet our high standards. We work with trusted suppliers and maintain strict quality controls to ensure customer satisfaction.`,
        ],
      },
      philosophy: {
        title: 'Our Philosophy',
        intro: `At ${brandConfig.businessName}, we believe that grocery shopping should be convenient, affordable, and enjoyable. Our commitment to quality means:`,
        points: [
          {
            title: 'Quality Products',
            description: 'Carefully selected items from trusted suppliers',
          },
          {
            title: 'Fresh Daily',
            description: 'Fresh produce and products delivered daily',
          },
          {
            title: 'Competitive Prices',
            description: 'Great value without compromising on quality',
          },
          {
            title: 'Wide Selection',
            description: 'From specialty items to everyday essentials',
          },
          {
            title: 'Customer Service',
            description: 'Dedicated to making your shopping experience excellent',
          },
        ],
      },
      special: {
        title: 'What Makes Us Special',
        content: [
          `Our store features a carefully curated selection of products that represent quality and value. From fresh produce to specialty items, each product is chosen with care.`,
          `Whether you're shopping for a family meal, planning a special occasion, or just need everyday essentials, ${brandConfig.businessName} offers a convenient shopping experience with excellent customer service.`,
        ],
      },
      visit: {
        title: 'Shop With Us',
        content: [
          `Experience the convenience of online grocery shopping with ${brandConfig.businessName}. Our team is dedicated to making every order perfect, from selection to delivery.`,
          `Browse our online store and have quality groceries delivered straight to your doorstep, or visit us in-store for a personalized shopping experience.`,
        ],
      },
    },
    values: [
      {
        emoji: '🛒',
        title: 'Quality First',
        description: 'Carefully selected products that meet our high standards',
      },
      {
        emoji: '🚚',
        title: 'Fast Delivery',
        description: 'Reliable delivery service to get your groceries to you quickly',
      },
      {
        emoji: '⭐',
        title: 'Great Service',
        description: 'Committed to excellence in every order and interaction',
      },
    ],
    cta: {
      title: `Ready to Shop at ${brandConfig.businessName}?`,
      description: 'Browse our products and place your order today',
      buttons: {
        primary: 'Shop Now',
        secondary: 'Contact Us',
      },
    },
  },

  // Contact Page Content
  contact: {
    metadata: {
      title: `Contact Us - ${brandConfig.businessName}`,
      description: 'Get in touch with us for inquiries, feedback, or bulk orders',
    },
    title: 'Get in Touch',
    description: `Have a question, feedback, or special request? We'd love to hear from you. Fill out the form below or reach out directly using our contact information.`,
  },

  // Reservations/Bulk Orders Page Content
  reservations: {
    metadata: {
      title: `Bulk Orders - ${brandConfig.businessName}`,
      description: `Planning a large event or need bulk quantities? Contact us for special pricing and availability.`,
    },
    title: 'Bulk Orders',
    description: `Need large quantities for an event or business? We offer special pricing for bulk orders. Contact us to discuss your needs.`,
    benefits: {
      title: 'Why Order in Bulk?',
      items: [
        {
          title: 'Special Pricing',
          description: 'Get competitive rates on large quantity orders.',
        },
        {
          title: 'Custom Orders',
          description: 'We can source specific items or quantities based on your needs.',
        },
        {
          title: 'Flexible Delivery',
          description: 'Scheduled delivery options to meet your timeline.',
        },
      ],
    },
    howToBook: {
      title: 'How to Order:',
      steps: [
        'Fill out the form below with your requirements.',
        'Specify the products and quantities you need.',
        'Add any special requests or delivery instructions.',
        'Submit and we will contact you with a quote!',
      ],
    },
    walkIns: {
      title: 'In-Store Pickup Available!',
      description: 'Prefer to pick up your order? We can prepare bulk orders for in-store pickup as well.',
    },
    policy: {
      title: 'Bulk Order Policy',
      points: [
        '• Minimum order quantity may apply for bulk pricing',
        '• Orders should be placed at least 48 hours in advance',
        '• Custom quotes provided within 24 hours',
        '• Delivery fees may vary based on quantity and location',
        '• Payment terms available for business accounts',
      ],
    },
    largeGroups: {
      description: 'For large bulk orders, special requests, or any questions, feel free to call us at',
    },
  },

  // Privacy Policy Content
  privacy: {
    metadata: {
      title: `Privacy Policy - ${brandConfig.businessName}`,
      description: 'Our privacy policy and data protection practices',
    },
    title: 'Privacy Policy',
    businessName: brandConfig.businessName,
    email: brandConfig.contact.privacyEmail || brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    address: brandConfig.contact.address,
  },

  // Terms & Conditions Content
  terms: {
    metadata: {
      title: `Terms & Conditions - ${brandConfig.businessName}`,
      description: 'Terms and conditions for using our website and services',
    },
    title: 'Terms & Conditions',
    businessName: brandConfig.businessName,
    email: brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    address: brandConfig.contact.address,
    location: 'Upplands Väsby',
    country: 'Sweden',
  },

  // Common Phrases (used across multiple pages)
  common: {
    orderNow: 'Shop Now',
    viewMenu: 'Browse Products',
    makeReservation: 'Request Bulk Order',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    readMore: 'Read More',
    viewAll: 'View All',
    backToHome: 'Back to Home',

    // Image placeholders
    imagePlaceholders: {
      hero: 'Feature Your Hero Image Here',
      heroSubtext: 'Add an image of your store or featured products',
      restaurant: 'Add Store Image',
      restaurantSubtext: 'Showcase your store interior or team',
    },
  },
} as const;

// Type export
export type ContentConfig = typeof contentConfig;
