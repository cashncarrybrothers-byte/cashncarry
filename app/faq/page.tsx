import { Metadata } from 'next';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { brandProfile } from '@/config/brand-profile';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | Brothers Cash & Carry',
    description: 'Get answers to common questions about ordering international groceries in Stockholm, delivery options across Sweden, payment methods, and our products.',
    alternates: {
        canonical: '/faq',
    },
};

const faqs = [
    {
        category: "Ordering & Payment",
        questions: [
            {
                q: "How do I place an order?",
                a: "Placing an order is easy! Simply browse our website, add your desired items to the shopping cart, and proceed to checkout. You'll enter your delivery address, choose from Local delivery, pickup, or PostNord options, and complete payment securely."
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe gateway. We also offer Klarna, Swish, Google Pay, and Apple Pay. All transactions are encrypted and secure."
            },
            {
                q: "Do I need an account to place an order?",
                a: "No, you can check out as a guest. However, creating an account lets you view order history, save your address for faster checkout, and receive exclusive offers and promotions."
            },
            {
                q: "Can I order groceries through WhatsApp?",
                a: "WhatsApp ordering is coming soon! Currently, you can browse our products online and visit our store in Upplands Väsby. Online ordering will be available shortly."
            },
            {
                q: "Do you offer discounts?",
                a: "Yes! We're one of Sweden's most competitively priced stores for international groceries. Our slogan is 'quality @ affordability'. Check our special offers page for the latest deals."
            },
        ]
    },
    {
        category: "Delivery & Shipping",
        questions: [
            {
                q: "Do you deliver groceries in Stockholm?",
                a: "Absolutely! We offer our own local delivery service across all of Stockholm. We specialize in fast and reliable delivery of international groceries. Visit our Delivery Information page for full details."
            },
            {
                q: "Is there free delivery in Stockholm?",
                a: "Yes! FREE local delivery on all orders of 500 kr or more in our local delivery areas. For orders below 500 kr, a flat delivery fee of 99 kr applies."
            },
            {
                q: "Do you offer same-day delivery?",
                a: "Yes! For local areas in North Stockholm (including Upplands Väsby, Märsta, Vallentuna, Sollentuna, Täby, Kista), we offer same-day evening delivery for orders placed before 2 PM (14:00)."
            },
            {
                q: "Do you deliver to the rest of Sweden?",
                a: "Yes! We deliver nationwide using our trusted partner, PostNord. Shipping costs are calculated automatically at checkout based on weight and your delivery address."
            },
            {
                q: "Do you deliver to other countries in Europe?",
                a: "Currently, we focus on nationwide delivery within Sweden. For special inquiries regarding international shipping, please contact our support team."
            },
        ]
    },
    {
        category: "Our Products",
        questions: [
            {
                q: "What happens if an item I ordered is out of stock?",
                a: "We operate a busy physical store, and sometimes items may sell out before our online inventory updates. If this happens, we'll contact you immediately with the option of a full refund or a suitable replacement product."
            },
            {
                q: "How do you ensure the freshness of vegetables and frozen items?",
                a: "Freshness is our priority. Fresh produce and frozen goods are handled with care and delivered through our local delivery service to maintain the cold chain from our store to your door."
            },
            {
                q: "I'm looking for a specific brand or product not on your website.",
                a: "We're always expanding our range! If there's a specific brand or item you'd love to see, email us at support@cashncarry.se. We value your suggestions!"
            },
            {
                q: "What countries do your products come from?",
                a: "We carry a wide range of products from Asia, Africa, Latin America, and the Middle East, specializing in authentic flavors from across the globe."
            },
        ]
    },
    {
        category: "Returns & Refunds",
        questions: [
            {
                q: "What is your return policy?",
                a: "We accept returns on non-perishable items within 14 days of receipt, provided they're unopened, unused, and in original packaging. Perishable items (fresh produce, frozen goods) are not eligible for return. Read our complete Refund and Return Policy for full details."
            },
        ]
    },
    {
        category: "Physical Store Location",
        questions: [
            {
                q: "Do you have a physical store?",
                a: "Yes! Visit us at Regndroppsgatan 3, 194 49 Upplands Väsby, Sweden."
            },
            {
                q: "What are your store hours?",
                a: "Monday-Friday: 09:00 - 20:00, Saturday-Sunday: 10:00 - 19:00. Note that hours may vary on public holidays."
            },
        ]
    },
];


export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 style={{
                            fontSize: '31.25px',
                            fontWeight: 700,
                            lineHeight: 1.47,
                            letterSpacing: '0.02em'
                        }} className="mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-muted-foreground" style={{
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: 1.52,
                            letterSpacing: '0.03em'
                        }}>
                            Everything you need to know about ordering authentic international groceries from Asia, Africa, Latin America, and the Middle East. Can't find your answer? We're here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* FAQ Categories */}
                        <div className="lg:col-span-2">
                            <div className="space-y-12">
                                {faqs.map((category, idx) => (
                                    <div key={idx}>
                                        <h2 style={{
                                            fontSize: '25px',
                                            fontWeight: 600,
                                            lineHeight: 1.47,
                                            letterSpacing: '0.02em'
                                        }} className="mb-6">
                                            {category.category}
                                        </h2>
                                        <Accordion type="single" collapsible className="space-y-4">
                                            {category.questions.map((faq, qIdx) => (
                                                <AccordionItem
                                                    key={qIdx}
                                                    value={`${idx}-${qIdx}`}
                                                    className="border rounded-lg px-6 bg-card"
                                                >
                                                    <AccordionTrigger className="text-left hover:no-underline py-4">
                                                        <span style={{
                                                            fontSize: '16px',
                                                            fontWeight: 500,
                                                            lineHeight: 1.52,
                                                            letterSpacing: '0.03em'
                                                        }}>{faq.q}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground pb-4" style={{
                                                        fontSize: '16px',
                                                        fontWeight: 400,
                                                        lineHeight: 1.52,
                                                        letterSpacing: '0.03em'
                                                    }}>
                                                        {faq.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar - Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="border rounded-lg p-6 bg-card">
                                    <h3 style={{
                                        fontSize: '18.91px',
                                        fontWeight: 500,
                                        lineHeight: 1.52,
                                        letterSpacing: '0.03em'
                                    }} className="mb-4">
                                        Still have questions?
                                    </h3>
                                    <p className="text-muted-foreground mb-6" style={{
                                        fontSize: '13.53px',
                                        fontWeight: 400,
                                        lineHeight: 1.57,
                                        letterSpacing: '0.03em'
                                    }}>
                                        Can't find the answer you're looking for? Our customer support team is ready to help.
                                    </p>
                                    <div className="space-y-4">
                                        <a
                                            href="mailto:support@cashncarry.se"
                                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                        >
                                            <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p style={{
                                                    fontSize: '13.53px',
                                                    fontWeight: 500,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>Email</p>
                                                <p className="text-muted-foreground" style={{
                                                    fontSize: '12.8px',
                                                    fontWeight: 300,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>support@cashncarry.se</p>
                                            </div>
                                        </a>
                                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                                            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p style={{
                                                    fontSize: '13.53px',
                                                    fontWeight: 500,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>Visit Our Store</p>
                                                <p className="text-muted-foreground" style={{
                                                    fontSize: '12.8px',
                                                    fontWeight: 300,
                                                    lineHeight: 1.57,
                                                    letterSpacing: '0.03em'
                                                }}>
                                                    {brandProfile.address.street}<br />
                                                    {brandProfile.address.postalCode} {brandProfile.address.city}<br />
                                                    Sweden
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-6 bg-muted/30">
                                    <h3 style={{
                                        fontSize: '18.91px',
                                        fontWeight: 500,
                                        lineHeight: 1.52,
                                        letterSpacing: '0.03em'
                                    }} className="mb-2">
                                        New Customer?
                                    </h3>
                                    <p className="text-muted-foreground mb-4" style={{
                                        fontSize: '13.53px',
                                        fontWeight: 400,
                                        lineHeight: 1.57,
                                        letterSpacing: '0.03em'
                                    }}>
                                        Create an account for exclusive offers and faster checkout.
                                    </p>
                                    <Link
                                        href="/shop"
                                        className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                        style={{
                                            fontSize: '13.53px',
                                            fontWeight: 500,
                                            lineHeight: 1.57,
                                            letterSpacing: '0.03em'
                                        }}
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
