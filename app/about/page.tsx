import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandProfile } from "@/config/brand-profile";
import {
    ShoppingBag,
    Heart,
    Users,
    Award,
    MessageCircle,
    Mail,
    MapPin,
    Clock,
    Truck,
    Globe,
    Store,
    CheckCircle2,
    ArrowRight,
    Star,
    Phone
} from "lucide-react";
import { GoogleMapCompact } from "@/components/shared/google-map";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: `About ${brandProfile.name} - Asian, African & Latin American Groceries | Upplands Väsby`,
    description: `${brandProfile.name} - Family-owned grocery store since 2014 offering authentic Asian, African, Latin American and Middle Eastern products in Upplands Väsby, Stockholm. Quality @ Affordability.`,
    alternates: {
        canonical: '/about',
    },
    keywords: 'Brothers Cash Carry, Asian grocery Stockholm, African grocery Upplands Väsby, Latin American food, Middle Eastern groceries, United Brothers AB, Asian Afrikan Supermarket, Väsby Matcenter',
};

// Stats data
const stats = [
    { value: "10+", label: "Years Experience", icon: Clock },
    { value: "5000+", label: "Products", icon: ShoppingBag },
    { value: "50+", label: "Countries Sourced", icon: Globe },
    { value: "10K+", label: "Happy Customers", icon: Users },
];

// Timeline data
const timeline = [
    {
        year: "2014",
        title: "The Beginning",
        description: "Started as 'Asian Afrikan Supermarket' in Märsta, offering authentic Asian and African products.",
    },
    {
        year: "2015",
        title: "Direct Imports",
        description: "Began importing directly from multiple countries, expanding our product range significantly.",
    },
    {
        year: "2018",
        title: "Väsby Matcenter",
        description: "Opened our flagship store in Upplands Väsby with an expanded selection including Middle Eastern products.",
    },
    {
        year: "2024",
        title: "Going Digital",
        description: "Launched cashncarry.se to bring authentic international groceries to customers across Sweden.",
    },
];

// Product categories
const productCategories = [
    {
        title: "Fresh Produce",
        description: "Seasonal vegetables and exotic fruits from Asia, Africa, and Latin America.",
        icon: Heart,
        color: "bg-green-500/10 text-green-600",
    },
    {
        title: "Spices & Seasonings",
        description: "Aromatic spices from Shan, MDH, TRS, National Foods, and more.",
        icon: Award,
        color: "bg-orange-500/10 text-orange-600",
    },
    {
        title: "Rice & Grains",
        description: "Premium Basmati rice, chapati flour, lentils, and authentic grains.",
        icon: ShoppingBag,
        color: "bg-amber-500/10 text-amber-600",
    },
    {
        title: "Frozen Foods",
        description: "Convenient frozen meals, snacks from Haldiram's, Laziza, and more.",
        icon: Store,
        color: "bg-blue-500/10 text-blue-600",
    },
    {
        title: "Beverages",
        description: "Traditional drinks, juices, and beverages from around the world.",
        icon: Globe,
        color: "bg-purple-500/10 text-purple-600",
    },
    {
        title: "Halal Products",
        description: "Wide range of certified halal meat and food products.",
        icon: CheckCircle2,
        color: "bg-emerald-500/10 text-emerald-600",
    },
];

// Values
const values = [
    {
        title: "Authenticity",
        description: "We source genuine products directly from their countries of origin, ensuring you get the real taste of home.",
        icon: Award,
    },
    {
        title: "Quality",
        description: "Every product meets our high standards. We never compromise on freshness and quality.",
        icon: Star,
    },
    {
        title: "Affordability",
        description: "Our motto 'Quality @ Affordability' means premium products at prices that respect your budget.",
        icon: Heart,
    },
    {
        title: "Community",
        description: "We're more than a store - we're a gathering place for diverse communities in Sweden.",
        icon: Users,
    },
];

// Testimonials
const testimonials = [
    {
        text: "Glad att jag hittade denna butik! Bra sortiment, hittade allt jag behövde och mer. Vänlig och hjälpsam personal.",
        author: "Linda",
        rating: 5,
    },
    {
        text: "Kul med ett annat sortiment än det som finns på vanliga matbutikskedjorna. Kommer tveklöst återkomma!",
        author: "Michaela Svanberg",
        rating: 5,
    },
    {
        text: "Best place for Asian groceries in the Stockholm area. Great prices and friendly staff who know their products.",
        author: "Ahmed K.",
        rating: 5,
    },
];

export default function AboutPage() {
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
                            Established 2014
                        </span>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Your Trusted Source for{" "}
                            <span className="text-primary">International Groceries</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
                            Family-owned and operated since 2014, bringing authentic flavors from Asia, Africa,
                            Latin America, and the Middle East to Sweden.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="/shop">
                                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                                <Link href="/contact">
                                    Contact Us
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-20 -mt-12">
                <div className="container mx-auto px-4">
                    <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image Column */}
                        <div className="relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://crm.cashncarry.se/wp-content/uploads/2025/05/whatsapp-image-2025-05-06-at-23.02.51-90cce80c.jpeg"
                                    alt="Brothers Cash & Carry Store Interior"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block">
                                <div className="text-3xl font-bold mb-1">10+</div>
                                <div className="text-sm opacity-90">Years serving our community</div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div>
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                                Our Story
                            </span>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                                From a Small Shop to Your Favorite International Market
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    <strong className="text-foreground">Brothers Cash & Carry</strong> is proudly brought to you by
                                    United Brothers AB, a family-owned company that started its journey in 2014. Our first shop,
                                    "Asian Afrikan Supermarket" in Märsta, quickly became famous for offering the best prices
                                    and top-quality customer service.
                                </p>
                                <p>
                                    Our success encouraged us to expand. By 2015, we started our own imports from multiple
                                    countries, transforming our little shop into a treasure trove of products from around the world.
                                    In 2018, we opened our flagship store "Väsby Matcenter" in Upplands Väsby.
                                </p>
                                <p>
                                    Today, with <strong className="text-foreground">cashncarry.se</strong>, we bring the same
                                    quality and value online, delivering authentic products from Asia, Africa, Latin America,
                                    and the Middle East directly to your doorstep.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                            Our Journey
                        </span>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold">
                            Growing With Our Community
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {timeline.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-card rounded-xl p-6 h-full border hover:shadow-lg transition-shadow">
                                    <div className="text-primary font-bold text-2xl mb-2">{item.year}</div>
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.description}</p>
                                </div>
                                {index < timeline.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                            What We Offer
                        </span>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Products From Around The World
                        </h2>
                        <p className="text-muted-foreground">
                            We source authentic products from Pakistan, India, Bangladesh, Sri Lanka, Thailand,
                            Philippines, Uganda, Nigeria, Middle East, and Latin America.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productCategories.map((category, index) => (
                            <div
                                key={index}
                                className="group bg-card rounded-xl p-6 border hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4`}>
                                    <category.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                                <p className="text-muted-foreground text-sm">{category.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button asChild size="lg" variant="outline" className="rounded-full">
                            <Link href="/shop">
                                Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="font-semibold text-sm uppercase tracking-wider mb-3 block opacity-80">
                            Why Choose Us
                        </span>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Our Core Values
                        </h2>
                        <p className="opacity-80">
                            These principles guide everything we do at Brothers Cash & Carry.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                                <p className="text-sm opacity-80">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                            Testimonials
                        </span>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-xl p-6 border relative"
                            >
                                {/* Quote Mark */}
                                <div className="text-6xl text-primary/10 font-serif absolute top-4 right-6">"</div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                <p className="text-muted-foreground mb-4 relative z-10">
                                    "{testimonial.text}"
                                </p>
                                <div className="font-semibold">{testimonial.author}</div>
                                <div className="text-xs text-muted-foreground">Google Reviews</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact & Location Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                                Get In Touch
                            </span>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                                Visit Our Store
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Come visit us at our store in Upplands Väsby or reach out through any of
                                the channels below. We'd love to hear from you!
                            </p>

                            <div className="space-y-4">
                                {/* Address */}
                                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">Store Address</div>
                                        <div className="text-muted-foreground text-sm">
                                            {brandProfile.address.street}<br />
                                            {brandProfile.address.postalCode} {brandProfile.address.city}
                                        </div>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">Opening Hours</div>
                                        <div className="text-muted-foreground text-sm">
                                            Mon-Fri: 9 AM - 8 PM<br />
                                            Sat-Sun: 10 AM - 7 PM
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Methods */}
                                <div className="grid grid-cols-2 gap-4">
                                    <a
                                        href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`}
                                        className="flex items-center gap-3 p-4 bg-card rounded-xl border hover:border-primary/50 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="font-semibold text-sm">WhatsApp</div>
                                            <div className="text-xs text-muted-foreground">Chat with us</div>
                                        </div>
                                    </a>
                                    <a
                                        href={`tel:${brandProfile.contact.phone}`}
                                        className="flex items-center gap-3 p-4 bg-card rounded-xl border hover:border-primary/50 transition-colors"
                                    >
                                        <Phone className="w-5 h-5 text-primary" />
                                        <div>
                                            <div className="font-semibold text-sm">Call Us</div>
                                            <div className="text-xs text-muted-foreground">{brandProfile.contact.phoneFormatted}</div>
                                        </div>
                                    </a>
                                    <a
                                        href={`mailto:${brandProfile.contact.email}`}
                                        className="flex items-center gap-3 p-4 bg-card rounded-xl border hover:border-primary/50 transition-colors"
                                    >
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="font-semibold text-sm">Email</div>
                                            <div className="text-xs text-muted-foreground">Send a message</div>
                                        </div>
                                    </a>
                                    <Link
                                        href="/delivery-information"
                                        className="flex items-center gap-3 p-4 bg-card rounded-xl border hover:border-primary/50 transition-colors"
                                    >
                                        <Truck className="w-5 h-5 text-orange-600" />
                                        <div>
                                            <div className="font-semibold text-sm">Delivery</div>
                                            <div className="text-xs text-muted-foreground">View info</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="h-full min-h-[400px]">
                            <div className="h-full rounded-2xl overflow-hidden shadow-lg border">
                                <GoogleMapCompact className="h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Ready to Explore?
                        </h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            Discover our full range of authentic international groceries from Asia, Africa,
                            Latin America, and the Middle East.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" variant="secondary" className="rounded-full">
                                <Link href="/shop">
                                    Start Shopping <ShoppingBag className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-white/30 hover:bg-white/10">
                                <Link href="/shop/categories">
                                    Browse Categories
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
