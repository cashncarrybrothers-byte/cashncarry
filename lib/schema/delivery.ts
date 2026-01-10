/**
 * Delivery Service Schema Generator
 * Creates DeliveryService and Service schemas for delivery information pages
 */

import type { Service } from './types';
import { cleanSchema } from './base';

/**
 * Generate Stockholm Delivery Service Schema
 * For /delivery-information page
 */
export function stockholmDeliveryServiceSchema(baseUrl: string = 'https://cashncarry.se') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#stockholm-delivery-service`,
    name: 'Stockholm Grocery Delivery Service',
    description: 'Free delivery on orders over 500 SEK to all of Stockholm. same-day delivery available to North Stockholm areas.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Brothers Cash & Carry',
    },
    serviceType: 'Grocery Delivery',
    areaServed: [
      { '@type': 'City', name: 'Stockholm' },
      { '@type': 'Place', name: 'Upplands Väsby' },
      { '@type': 'Place', name: 'Märsta' },
      { '@type': 'Place', name: 'Vallentuna' },
      { '@type': 'Place', name: 'Sollentuna' },
      { '@type': 'Place', name: 'Täby' },
      { '@type': 'Place', name: 'Rotebro' },
      { '@type': 'Place', name: 'Kista' },
      { '@type': 'Place', name: 'Solna' },
      { '@type': 'Place', name: 'Sundbyberg' },
      { '@type': 'Place', name: 'Bromma' },
      { '@type': 'Place', name: 'Södermalm' },
      { '@type': 'Place', name: 'Kungsholmen' },
      { '@type': 'Place', name: 'Norrmalm' },
      { '@type': 'Place', name: 'Vasastan' },
      { '@type': 'Place', name: 'Östermalm' },
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'FREE Stockholm Delivery',
        description: 'Free delivery for orders 500 SEK and above',
        price: '0',
        priceCurrency: 'SEK',
        eligibleTransactionVolume: {
          '@type': 'PriceSpecification',
          minPrice: 500,
          priceCurrency: 'SEK',
        },
      },
      {
        '@type': 'Offer',
        name: 'Standard Stockholm Delivery',
        description: 'Flat delivery fee for orders below 500 SEK',
        price: '99',
        priceCurrency: 'SEK',
        eligibleTransactionVolume: {
          '@type': 'PriceSpecification',
          maxPrice: 499.99,
          priceCurrency: 'SEK',
        },
      },
      {
        '@type': 'Offer',
        name: 'Same-Day Evening Delivery',
        description: 'Same-day delivery to North Stockholm (order before 2 PM)',
        price: '99',
        priceCurrency: 'SEK',
        areaServed: [
          { '@type': 'Place', name: 'Upplands Väsby' },
          { '@type': 'Place', name: 'Märsta' },
          { '@type': 'Place', name: 'Vallentuna' },
          { '@type': 'Place', name: 'Sollentuna' },
          { '@type': 'Place', name: 'Täby' },
          { '@type': 'Place', name: 'Rotebro' },
          { '@type': 'Place', name: 'Kista' },
        ],
      },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46765670454',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu', 'Punjabi', 'Arabic'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Europe Delivery Service Schema (PostNord)
 * For /europe-delivery page
 */
export function europeDeliveryServiceSchema(baseUrl: string = 'https://cashncarry.se') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#europe-delivery-service`,
    name: 'Europe-Wide Grocery Delivery Service',
    description: 'Authentic international groceries delivered across Europe via PostNord. Fast shipping and no customs hassle within EU.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Brothers Cash & Carry',
    },
    serviceType: 'International Grocery Delivery',
    areaServed: {
      '@type': 'Continent',
      name: 'Europe',
    },
    offers: {
      '@type': 'Offer',
      name: 'PostNord Europe Delivery',
      description: 'PostNord shipping to selected European countries. Rates calculated at checkout based on weight and destination.',
      priceCurrency: 'SEK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'SEK',
        description: 'Rates calculated at checkout based on weight and destination',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46765670454',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu', 'Punjabi', 'Arabic'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate Göteborg & Malmö Delivery Service Schema
 * For /delivery-goteborg-malmo page
 */
export function goteborgMalmoDeliveryServiceSchema(baseUrl: string = 'https://cashncarry.se') {
  const schema: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#goteborg-malmo-delivery-service`,
    name: 'Göteborg & Malmö Grocery Delivery Service',
    description: 'Fast delivery of international groceries to Göteborg and Malmö via PostNord.',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Brothers Cash & Carry',
    },
    serviceType: 'Grocery Delivery',
    areaServed: [
      {
        '@type': 'City',
        name: 'Göteborg',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Göteborg',
          addressRegion: 'Västra Götaland County',
          addressCountry: 'SE',
        },
      },
      {
        '@type': 'City',
        name: 'Malmö',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Malmö',
          addressRegion: 'Skåne County',
          addressCountry: 'SE',
        },
      },
    ],
    offers: {
      '@type': 'Offer',
      name: 'PostNord Delivery to Göteborg & Malmö',
      description: 'Reliable shipping via PostNord. Delivery typically in 1-3 business days.',
      priceCurrency: 'SEK',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0.00',
        priceCurrency: 'SEK',
        description: 'Shipping rates calculated at checkout',
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/shop`,
      servicePhone: '+46765670454',
      availableLanguage: ['Swedish', 'English', 'Hindi', 'Urdu', 'Punjabi', 'Arabic'],
    },
  };

  return cleanSchema(schema);
}

/**
 * Generate FAQ Page Schema for Delivery
 */
export function deliveryFAQSchema(baseUrl: string = 'https://cashncarry.se') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is there free delivery in Stockholm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer FREE local delivery on all orders of 500 kr or more across all of Stockholm. For orders below 500 kr, a flat delivery fee of 99 kr applies.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer same-day delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer same-day evening delivery to local areas in North Stockholm (Upplands Väsby, Märsta, Vallentuna, Sollentuna, Täby, Rotebro, Kista). Place your order before 2 PM (14:00) to receive delivery the same evening between 5 PM - 9 PM.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you deliver to the rest of Sweden?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We deliver to all of Sweden via PostNord. Shipping costs are calculated at checkout based on weight and destination.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does delivery take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For Stockholm local delivery: Same-day or next-day. For the rest of Sweden via PostNord: Typically 1-3 business days depending on your location.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I track my delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All PostNord orders include a tracking number sent via email. For our local delivery service, we will contact you via SMS or phone with a delivery window.',
        },
      },
    ],
  };
}
