/**
 * FAQ Schema Generator
 * Framework-agnostic function for generating FAQPage schema
 */

import type { FAQPage, Question } from './types';
import { generateSchemaId, cleanSchema } from './base';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQInput {
    pageUrl: string;
    faqs: FAQItem[];
    name?: string;
    description?: string;
}

/**
 * Generate FAQPage Schema
 *
 * @param config - FAQ configuration
 * @returns Complete FAQPage schema object
 */
export function faqSchema(config: FAQInput): FAQPage {
    const schema: FAQPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': generateSchemaId(config.pageUrl, 'faqpage'),
        mainEntity: config.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    if (config.name) {
        schema.name = config.name;
    }

    if (config.description) {
        schema.description = config.description;
    }

    return cleanSchema(schema);
}

/**
 * Pre-configured FAQ for Brothers Cash & Carry
 * Common questions about delivery, products, and services
 */
export function brothersFAQSchema(baseUrl: string = 'https://cashncarry.se'): FAQPage {
    return faqSchema({
        pageUrl: `${baseUrl}/faq`,
        name: 'Frequently Asked Questions - Brothers Cash & Carry',
        description: 'Common questions about our products, delivery, and services',
        faqs: [
            {
                question: 'Do you offer free delivery?',
                answer: 'Yes! We offer FREE delivery for orders over 500 SEK in our local delivery areas including Upplands Väsby, Märsta, Vallentuna, Sollentuna, and Täby. For orders under 500 SEK, a delivery fee of 99 SEK applies.',
            },
            {
                question: 'Do you deliver across Sweden?',
                answer: 'Yes, we deliver to all of Sweden using PostNord. Shipping rates are calculated at checkout based on your location and the weight of your order.',
            },
            {
                question: 'Do you offer same-day delivery?',
                answer: 'Yes! We offer same-day delivery to local areas in North Stockholm if you place your order before 2 PM (14:00). Delivery typically happens between 5 PM and 9 PM.',
            },
            {
                question: 'Are your products Halal?',
                answer: 'Yes, we have a large selection of Halal products. We specialize in authentic international groceries that meet Halal requirements.',
            },
            {
                question: 'What types of products do you sell?',
                answer: 'We offer a wide range of international groceries including fresh vegetables, spices, beans, lentils, peas, rice, flour, oil, frozen foods, cosmetics, and more from Asia, Africa, Latin America, and the Middle East.',
            },
            {
                question: 'What are your store opening hours?',
                answer: 'Our physical store is open Monday to Friday from 09:00 to 20:00, and Saturday to Sunday from 10:00 to 19:00.',
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'Online, we accept Credit/Debit Cards, Swish, Klarna, Apple Pay, and Google Pay. In our physical store, we also accept cash.',
            },
            {
                question: 'Can I return or exchange products?',
                answer: 'Yes, we have a return policy for unopened and non-perishable products. Please contact us at support@cashncarry.se or call 08 778 88 55 for assistance with returns.',
            },
            {
                question: 'Do you have a physical store I can visit?',
                answer: 'Yes! Our store is located at Regndroppsgatan 3, 194 49 Upplands Väsby. You are welcome to visit us during our opening hours.',
            },
            {
                question: 'How can I contact you?',
                answer: 'You can reach us by phone at 08 778 88 55 or email at support@cashncarry.se. We are also active on Facebook and Instagram @cashncarryse.',
            },
        ],
    });
}

// Keep legacy export for backward compatibility
export { brothersFAQSchema as idealIndiskaFAQSchema };

