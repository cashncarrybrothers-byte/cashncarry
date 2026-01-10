/**
 * Organization Schema Generator
 * Framework-agnostic function for generating Organization/GroceryStore schema
 */

import type { Organization, OrganizationInput } from './types';
import { generateSchemaId, formatOpeningHours, cleanSchema } from './base';

/**
 * Generate Organization Schema (GroceryStore, LocalBusiness, etc.)
 *
 * @param config - Organization configuration
 * @returns Complete Organization schema object
 */
export function organizationSchema(config: OrganizationInput): Organization {
  const schema: Organization = {
    '@context': 'https://schema.org',
    '@type': config.types || ['Organization', 'GroceryStore', 'LocalBusiness'],
    '@id': generateSchemaId(config.url, 'organization'),
    name: config.name,
    url: config.url,
  };

  // Optional fields
  if (config.alternateName) {
    schema.alternateName = config.alternateName;
  }

  if (config.description) {
    schema.description = config.description;
  }

  if (config.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: config.logo,
    };
  }

  if (config.image) {
    schema.image = config.image;
  }

  if (config.telephone) {
    schema.telephone = config.telephone;
  }

  if (config.email) {
    schema.email = config.email;
  }

  if (config.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: config.address.street,
      addressLocality: config.address.city,
      postalCode: config.address.postalCode,
      addressCountry: config.address.country,
      ...(config.address.region && { addressRegion: config.address.region }),
    };
  }

  if (config.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    };
  }

  if (config.openingHours && config.openingHours.length > 0) {
    schema.openingHoursSpecification = formatOpeningHours(config.openingHours);
  }

  if (config.cuisine && config.cuisine.length > 0) {
    schema.servesCuisine = config.cuisine;
  }

  if (config.priceRange) {
    schema.priceRange = config.priceRange;
  }

  if (config.socialMedia && config.socialMedia.length > 0) {
    schema.sameAs = config.socialMedia.filter(Boolean);
  }

  if (config.foundingDate) {
    schema.foundingDate = config.foundingDate;
  }

  return cleanSchema(schema);
}

/**
 * Pre-configured Brothers Cash & Carry Organization Schema
 * Grocery Store focused schema with delivery services
 */
export function brothersOrganizationSchema(baseUrl: string = 'https://cashncarry.se'): Organization {
  return organizationSchema({
    name: 'Brothers Cash & Carry',
    alternateName: 'Brothers Cash and Carry',
    description: 'International Grocery Store in Upplands Väsby, Sweden. Fresh produce, spices, rice, and authentic food products from Asia, Africa, Latin America, and the Middle East. Fast delivery across Sweden.',
    url: baseUrl,
    logo: 'https://crm.cashncarry.se/wp-content/uploads/2026/01/brothers-cash-and-carry-favicon.png',
    image: 'https://crm.cashncarry.se/wp-content/uploads/2026/01/brothers-cash-and-carry-storefront.jpg',
    telephone: '+4687788855',
    email: 'support@cashncarry.se',
    address: {
      street: 'Regndroppsgatan 3',
      city: 'Upplands Väsby',
      region: 'Stockholm County',
      postalCode: '194 49',
      country: 'SE',
    },
    geo: {
      latitude: 59.51839,
      longitude: 17.91128,
    },
    openingHours: [
      { day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '20:00' },
      { day: ['Saturday', 'Sunday'], opens: '10:00', closes: '19:00' },
    ],
    priceRange: '$$',
    socialMedia: [
      'https://www.facebook.com/cashncarryse',
      'https://www.instagram.com/cashncarryse',
    ],
    foundingDate: '2014',
    types: ['Organization', 'GroceryStore', 'LocalBusiness'],
  });
}

/**
 * Full-featured Brothers Cash & Carry Organization Schema
 * Includes delivery services, payment methods, and service areas
 */
export function brothersOrganizationSchemaFull(baseUrl: string = 'https://cashncarry.se'): Organization {
  const baseSchema = brothersOrganizationSchema(baseUrl);

  return {
    ...baseSchema,

    slogan: 'Quality @ Affordability',

    // Payment methods
    paymentAccepted: [
      'Credit Card',
      'Debit Card',
      'Visa',
      'MasterCard',
      'Apple Pay',
      'Google Pay',
      'Klarna',
      'Swish',
      'Cash',
    ],
    currenciesAccepted: 'SEK',

    // Products/Categories offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'International Groceries',
      description: 'Authentic food products from Asia, Africa, Latin America, and Middle East',
    },

    // Knowledge areas
    knowsAbout: [
      'International Groceries',
      'Asian Spices',
      'African Food Products',
      'Middle Eastern Food',
      'Latin American Groceries',
      'Halal Products',
      'Basmati Rice',
      'Ethnic Food Store',
    ],

    // Delivery Services
    makesOffer: [
      // Stockholm Delivery (Local)
      {
        '@type': 'Offer',
        name: 'Stockholm North Delivery',
        description: 'Local delivery within Stockholm North areas for orders under 500kr',
        priceSpecification: {
          '@type': 'DeliveryChargeSpecification',
          price: '99.00',
          priceCurrency: 'SEK',
          eligibleTransactionVolume: {
            '@type': 'PriceSpecification',
            minPrice: 0,
            maxPrice: 499.99,
            priceCurrency: 'SEK',
          },
        },
        areaServed: [
          { '@type': 'Place', name: 'Upplands Väsby' },
          { '@type': 'Place', name: 'Märsta' },
          { '@type': 'Place', name: 'Vallentuna' },
          { '@type': 'Place', name: 'Sollentuna' },
          { '@type': 'Place', name: 'Täby' },
          { '@type': 'Place', name: 'Kista' },
          { '@type': 'Place', name: 'Solna' },
        ],
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '99.00',
            currency: 'SEK',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            cutoffTime: '14:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 1,
              unitCode: 'DAY',
            },
          },
          doesNotShip: false,
          shippingLabel: 'Local Delivery (North Stockholm)',
        },
      },
      // FREE Stockholm Delivery (500kr+)
      {
        '@type': 'Offer',
        name: 'FREE Local Delivery',
        description: 'Free delivery for orders 500kr and above in local areas',
        priceSpecification: {
          '@type': 'DeliveryChargeSpecification',
          price: '0.00',
          priceCurrency: 'SEK',
          eligibleTransactionVolume: {
            '@type': 'PriceSpecification',
            minPrice: 500,
            priceCurrency: 'SEK',
          },
        },
        areaServed: [
          { '@type': 'Place', name: 'Upplands Väsby' },
          { '@type': 'Place', name: 'Märsta' },
          { '@type': 'Place', name: 'Vallentuna' },
          { '@type': 'Place', name: 'Sollentuna' },
          { '@type': 'Place', name: 'Täby' },
          { '@type': 'Place', name: 'Stockholm' },
        ],
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'SEK',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            cutoffTime: '14:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
          },
          doesNotShip: false,
          shippingLabel: 'FREE Local Delivery (500kr+)',
        },
      },
      // PostNord National Delivery
      {
        '@type': 'Offer',
        name: 'Sweden National Delivery',
        description: 'Delivery to all of Sweden with PostNord.',
        areaServed: {
          '@type': 'Country',
          name: 'SE',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'SEK',
            description: 'Shipping calculated at checkout',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            },
            cutoffTime: '12:00',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 4,
              unitCode: 'DAY',
            },
          },
          carrier: {
            '@type': 'Organization',
            name: 'PostNord',
            url: 'https://www.postnord.se',
          },
          doesNotShip: false,
          shippingLabel: 'National Delivery (PostNord)',
        },
      },
    ],

    // Service areas
    areaServed: [
      {
        '@type': 'City',
        name: 'Upplands Väsby',
      },
      {
        '@type': 'City',
        name: 'Stockholm',
      },
      {
        '@type': 'Country',
        name: 'Sweden',
      },
    ],

    // Amenities
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Halal Products Available', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Fresh Produce', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'International Groceries', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Online Shopping', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bulk Orders', value: true },
    ],

    // Aggregate rating (placeholder - update with real data)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
      bestRating: '5',
      worstRating: '1',
    },

    // Order action
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: baseUrl + '/shop/',
      },
    },
  };
}

// Keep legacy exports for backward compatibility
export {
  brothersOrganizationSchema as idealIndiskaOrganizationSchema,
  brothersOrganizationSchemaFull as idealIndiskaOrganizationSchemaFull,
  brothersOrganizationSchema as anmolOrganizationSchema,
  brothersOrganizationSchemaFull as anmolOrganizationSchemaFull
};

