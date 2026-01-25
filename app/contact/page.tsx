import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandProfile } from "@/config/brand-profile";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    ExternalLink,
    ArrowRight,
    ShoppingBag,
    Send
} from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { GoogleMapCompact } from "@/components/shared/google-map";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: `Contact ${brandProfile.name} | Asian, African & Latin American Groceries Upplands Väsby`,
    description: `Contact Brothers Cash & Carry in Upplands Väsby, Stockholm. Visit our store at Regndroppsgatan 3, call 076 567 04 54, WhatsApp +46765670454, or email support@cashncarry.se. Asian, African, Latin American & Middle Eastern groceries.`,
    alternates: {
        canonical: '/contact',
    },
    keywords: 'Contact Brothers Cash Carry, Upplands Väsby grocery store, Asian grocery contact, African food store Stockholm, Latin American grocery, grocery store opening hours Upplands Väsby',
};

// Contact methods data
const contactMethods = [
    {
        title: "WhatsApp",
        description: "Fastest response for order status or product availability",
        icon: MessageCircle,
        color: "bg-green-500/10 text-green-600",
        link: `https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`,
        linkText: brandProfile.contact.whatsapp,
        external: true,
    },
    {
        title: "Call Us",
        description: "Give us a call during store hours for immediate help",
        icon: Phone,
        color: "bg-blue-500/10 text-blue-600",
        link: `tel:${brandProfile.contact.phone}`,
        linkText: brandProfile.contact.phoneFormatted,
        external: false,
    },
    {
        title: "Email",
        description: "For detailed inquiries or feedback, send us an email",
        icon: Mail,
        color: "bg-purple-500/10 text-purple-600",
        link: `mailto:${brandProfile.contact.email}`,
        linkText: brandProfile.contact.email,
        external: false,
    },
    {
        title: "Visit Store",
        description: `${brandProfile.address.street}, ${brandProfile.address.postalCode} ${brandProfile.address.city}`,
        icon: MapPin,
        color: "bg-orange-500/10 text-orange-600",
        link: `https://maps.google.com/?q=${encodeURIComponent(brandProfile.address.formatted)}`,
        linkText: "Get Directions",
        external: true,
    },
];

export default function ContactPage() {
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section with Background */}
            <section className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://crm.cashncarry.se/wp-content/uploads/2026/01/Brothers-Cashncarry.png"
                        alt="Brothers Cash & Carry Store"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 lg:py-32">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                            We&apos;re Here to Help
                        </span>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Get in Touch{" "}
                            <span className="text-primary">With Us</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
                            Visit us in person at our store in Upplands Väsby, message us on WhatsApp,
                            or reach out via email. We&apos;re here for all your international grocery needs.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="rounded-full">
                                <a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                                <a href={`tel:${brandProfile.contact.phone}`}>
                                    <Phone className="mr-2 h-5 w-5" /> Call Now
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Methods Section */}
            <section className="relative z-20 -mt-12">
                <div className="container mx-auto px-4">
                    <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactMethods.map((method, index) => (
                                <a
                                    key={index}
                                    href={method.link}
                                    target={method.external ? "_blank" : undefined}
                                    rel={method.external ? "noopener noreferrer" : undefined}
                                    className="group p-4 rounded-xl border hover:border-primary/50 hover:shadow-md transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <method.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                                    <span className="text-primary font-medium text-sm inline-flex items-center gap-1">
                                        {method.linkText}
                                        {method.external && <ExternalLink className="w-3 h-3" />}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Form (3/5) */}
                        <div className="lg:col-span-3">
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                                Send a Message
                            </span>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                                We&apos;d Love to Hear From You
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Have a question about our products, delivery, or anything else?
                                Fill out the form below and we&apos;ll get back to you as soon as possible.
                            </p>

                            <div className="bg-card rounded-2xl border p-6 md:p-8">
                                <ContactForm />
                            </div>
                        </div>

                        {/* Sidebar (2/5) */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 space-y-6">
                                {/* Opening Hours */}
                                <div className="bg-card rounded-2xl border p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Opening Hours</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {daysOfWeek.map((day) => {
                                            const hours = brandProfile.hours[day];
                                            const isWeekend = day === 'saturday' || day === 'sunday';
                                            return (
                                                <div
                                                    key={day}
                                                    className={`flex justify-between items-center py-2 px-3 rounded-lg ${isWeekend ? 'bg-muted/50' : ''}`}
                                                >
                                                    <span className="font-medium capitalize">{day}</span>
                                                    <span className="text-muted-foreground">{hours.display}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="rounded-2xl overflow-hidden border shadow-lg">
                                    <GoogleMapCompact className="h-[250px]" />
                                    <div className="p-4 bg-card">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium mb-1">Store Location</p>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {brandProfile.address.street}<br />
                                                    {brandProfile.address.postalCode} {brandProfile.address.city}
                                                </p>
                                                <a
                                                    href={`https://maps.google.com/?q=${encodeURIComponent(brandProfile.address.formatted)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                                                >
                                                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ Link */}
                                <div className="bg-muted/30 rounded-2xl border p-6">
                                    <h3 className="font-semibold text-lg mb-2">Looking for Answers?</h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Check our FAQ for quick answers about delivery, payments, and products.
                                    </p>
                                    <Button asChild variant="outline" className="w-full rounded-full">
                                        <Link href="/faq">
                                            View FAQ <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Ready to Shop?
                        </h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            Explore our wide selection of authentic international groceries from Asia, Africa,
                            Latin America, and the Middle East.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" variant="secondary" className="rounded-full">
                                <Link href="/shop">
                                    Start Shopping <ShoppingBag className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-white/30 hover:bg-white/10">
                                <Link href="/about">
                                    Learn About Us
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
