/**
 * Update Information Pages to English
 */

import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const WP_URL = process.env.WOOCOMMERCE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const authString = `${WP_USERNAME}:${WP_APP_PASSWORD}`;
const base64Auth = Buffer.from(authString).toString('base64');

// English versions of the pages
const englishPages = [
    {
        oldTitle: 'Integritetspolicy',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: `We receive, collect, and store any information you enter on our website or provide us in any other way. We may use software tools to measure and collect session information, including page response times, length of visits to certain pages, page interaction information, and methods used to browse away from the page.

When you conduct a transaction on our website, as part of the process, we collect the personal information you give us such as your name, address, and email address.

We collect such non-personal and personal information for the following purposes:
- To provide and operate the services;
- To provide our users with ongoing customer assistance and technical support;
- To be able to contact our visitors and users with general or personalized service-related notices and promotional messages;
- To create aggregated statistical data and other aggregated and/or inferred non-personal information, which we or our business partners may use to provide and improve our respective services;
- To comply with any applicable laws and regulations.

All personal data collected by the website is kept most safely with the help of advanced technology.

We may contact you to notify you regarding your account, to troubleshoot problems with your account, to resolve a dispute, to collect fees or monies owed, to poll your opinions through surveys or questionnaires, to send updates about our company, or as otherwise necessary to contact you to enforce our User Agreement, applicable national laws, and any agreement we may have with you. For these purposes, we may contact you via email, telephone, text messages, and postal mail.

We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website.

**Address:** Regndroppsgatan 3, 194 49 Upplands Väsby`
    },
    {
        oldTitle: 'Om oss',
        title: 'About Us',
        slug: 'about-us',
        content: `Brothers Cash & Carry is one of "United Brothers AB" projects. United Brothers AB is a family-owned company that started its business in 2014 by opening its first store named "Asian African Supermarket" in Märsta, Sweden. This small store became known in no time despite having a small selection of Asian, African, and Latin American foods just because of its best prices and high-quality customer service.

The first successful year in the market encouraged us to expand the product range, and by the end of 2015, we started our own import from other countries. Today, this small store is overwhelmingly filled with products from all over the world.

The success journey continues, and with time, the small store wasn't enough for all the different products we deal with. So we decided to start opening more stores. In 2018, we opened our second and relatively larger store in Upplands Väsby called "Väsby Matcenter". There we offer more variety and even food from the Middle East, making it a store that offers you real diversity in food from around the world.

Today we offer you fresh vegetables, spices, beans, lentils, peas, rice, flour, oil, frozen goods, ready-to-eat items, cosmetics, and more from Pakistan, India, Bangladesh, Sri Lanka, Thailand, Philippines, Uganda, Nigeria, Middle East, and Latin America, just to name a few of many countries, at the best prices because our slogan is "Quality @ Affordability".

This success story doesn't end here but instead gives us a new start on an endless journey of success in today's digital world. We are launching our first online grocery store cashncarry.se where you will find quality products from Asia, Africa, Latin America, and the Middle East at even better prices. Our mission is to provide you with the best of your home taste at affordable prices.

**Address:** Regndroppsgatan 3, 194 49 Upplands Väsby`
    },
    {
        oldTitle: 'Allmänna Villkor',
        title: 'Terms & Conditions',
        slug: 'terms-conditions',
        content: `According to distance selling rules, you as a private customer have the right to return/claim your ordered products within 14 days from the day you actually received the item. Claims and returns, with certain exceptions, will only be accepted within 14 days from the first day of receipt of goods.

In case of claims and returns, the customer is recommended to contact "CashnCarry" before returns, otherwise claims/returns will not be accepted. It is the buyer/customer who is responsible for postage/shipping costs for any returns. Claims/returns are only accepted when the customer has contacted us "CashnCarry" before the return and the goods are returned in time, in undamaged condition, and with original packaging.

**We do NOT accept claims/returns for the following products:**
- Pre-ordered products
- Wigs and hair extensions
- Cosmetic products
- Frozen products
- Fresh fruits & vegetables
- Flour
- Oil, jam, pickles, sauces, or other bottled products
- Products on special offers

## Our Specialties

### Customer Care
We give you the best customer care from start until you get your favorite products the way you want. It's no exaggeration to say that one of the main reasons for our success is our customer service.

### Best Prices
Our other specialty is our competitive prices for your home products. Buying directly from the source gives us the opportunity to offer you almost wholesale prices that others cannot.

### Quality Products
Last but not least, we offer you quality products because our sole goal is "Quality @ Affordability". You can fully trust us that you will get the best quality products directly from the source.

**Address:** Regndroppsgatan 3, 194 49 Upplands Väsby`
    },
    {
        oldTitle: 'Leveransinformation',
        title: 'Delivery Information',
        slug: 'delivery-information',
        content: `After an order has been placed and payment has been successful, the customer will receive an email confirming the order. Once payment has been received, products are shipped to the customer within 3-5 business days.

Deliveries do not take place on weekends or holidays except for extra postage costs paid by the customer and the availability of transport.

**Address:** Regndroppsgatan 3, 194 49 Upplands Väsby`
    },
    {
        oldTitle: 'Frequently Asked Questions',
        title: 'Frequently Asked Questions',
        slug: 'faq',
        content: `## Do I need an account to place an order?
No, you can checkout as a guest. However, creating an account allows you to track your orders, save your shipping information, and view your order history.

## What payment methods do you accept?
We accept major credit cards (Visa, MasterCard), Swish, and bank transfer. All payments are processed securely.

## What shipping methods do you provide?
We offer standard shipping within Sweden. Delivery typically takes 3-5 business days after order processing. For Stockholm area, we offer faster local delivery options.

## How long will it take to receive my order?
Orders are typically processed within 1-2 business days. Once shipped, delivery takes 3-5 business days for standard shipping within Sweden.

## What is your return policy?
You can return products within 14 days of receipt. Products must be unopened and in original packaging. Some items like fresh food, frozen products, and cosmetics cannot be returned. Please contact us before returning any items.

## Do you ship internationally?
Currently, we primarily serve customers in Sweden. Please contact us for international shipping inquiries.

**Contact us:** info@cashncarry.se`
    }
];

async function updatePage(pageId, title, slug, content) {
    const response = await fetch(`${WP_URL}/wp-json/wp/v2/pages/${pageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        },
        body: JSON.stringify({ title, slug, content })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
}

async function getPages() {
    const response = await fetch(`${WP_URL}/wp-json/wp/v2/pages?per_page=100`, {
        headers: { 'Authorization': `Basic ${base64Auth}` }
    });
    return response.json();
}

async function main() {
    console.log('🔄 Fetching WordPress pages...\n');

    const wpPages = await getPages();
    console.log(`   Found ${wpPages.length} pages\n`);

    console.log('📤 Updating pages to English...\n');

    let updated = 0;

    for (const englishPage of englishPages) {
        // Find the page by old title
        const wpPage = wpPages.find(p =>
            p.title.rendered === englishPage.oldTitle ||
            p.title.rendered === englishPage.title
        );

        if (wpPage) {
            try {
                await updatePage(wpPage.id, englishPage.title, englishPage.slug, englishPage.content);
                updated++;
                console.log(`   ✅ ${englishPage.oldTitle} → ${englishPage.title}`);
            } catch (error) {
                console.log(`   ❌ ${englishPage.title} - ${error.message}`);
            }
        } else {
            console.log(`   ⏭️ ${englishPage.oldTitle} not found`);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n📊 Complete: ${updated}/${englishPages.length} pages updated to English`);
}

main().catch(console.error);
