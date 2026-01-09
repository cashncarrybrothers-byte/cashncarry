import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandProfile } from "@/config/brand-profile";
import { ShoppingBag, Heart, Users, Award, MessageCircle, Mail, MapPin } from "lucide-react";
import { GoogleMapCompact } from "@/components/shared/google-map";

export const metadata: Metadata = {
  title: `About ${brandProfile.name} - Asian, African & Latin American Groceries | Upplands Väsby`,
  description: `${brandProfile.name} - Family-owned grocery store since 2014 offering authentic Asian, African, Latin American and Middle Eastern products in Upplands Väsby, Stockholm. Quality @ Affordability.`,
  alternates: {
    canonical: '/about',
  },
  keywords: 'Brothers Cash Carry, Asian grocery Stockholm, African grocery Upplands Väsby, Latin American food, Middle Eastern groceries, United Brothers AB, Asian Afrikan Supermarket, Väsby Matcenter',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted/30 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-20 text-left">
          <div className="max-w-3xl">
            <h1 style={{
              fontSize: '31.25px',
              fontWeight: 700,
              lineHeight: 1.47,
              letterSpacing: '0.02em'
            }} className="mb-4">
              About {brandProfile.name}
            </h1>
            <p className="text-muted-foreground" style={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.52,
              letterSpacing: '0.03em'
            }}>
              {brandProfile.tagline} Your trusted family-owned grocery store for authentic Asian, African, Latin American, and Middle Eastern products in Upplands Väsby, Stockholm.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Area (2/3) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Our Story */}
              <div>
                <h2 style={{
                  fontSize: '25px',
                  fontWeight: 600,
                  lineHeight: 1.47,
                  letterSpacing: '0.02em'
                }} className="mb-6">
                  Our Journey: From Märsta to Upplands Väsby
                </h2>
                <div className="space-y-6 text-muted-foreground" style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.52,
                  letterSpacing: '0.03em'
                }}>
                  <p>
                    Brothers Cash & Carry is proudly brought to you by <strong>United Brothers AB</strong>, a family-owned company that started its journey in 2014. Our first shop, "Asian Afrikan Supermarket" in Märsta, quickly became famous for offering the best prices and top-quality customer service for Asian, African, and Latin American food products.
                  </p>
                  <p>
                    Our success in the first year encouraged us to expand. By 2015, we started our own imports from multiple countries, and our little shop transformed into a treasure trove of products from around the world. The demand continued to grow, and in 2018, we opened our second, larger store - "Väsby Matcenter" in Upplands Väsby - offering even more variety including Middle Eastern products.
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm border mt-8">
                    <Image
                      src="https://crm.cashncarry.se/wp-content/uploads/2025/05/whatsapp-image-2025-05-06-at-23.02.51-90cce80c.jpeg"
                      alt="Brothers Cash & Carry Store in Upplands Väsby"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                  <p className="mt-8">
                    In today&apos;s digital world, we&apos;re excited to bring our store online at <strong>cashncarry.se</strong>. Now you can find quality products from Asia, Africa, Latin America, and the Middle East at even better prices, all from the comfort of your home. Our mission remains the same: to provide you with the best of your home taste at affordable prices.
                  </p>
                </div>
              </div>

              {/* What We Offer */}
              <div>
                <h2 style={{
                  fontSize: '25px',
                  fontWeight: 600,
                  lineHeight: 1.47,
                  letterSpacing: '0.02em'
                }} className="mb-6">
                  What We Offer: Products from Around the World
                </h2>
                <div className="space-y-4 text-muted-foreground mb-8" style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.52,
                  letterSpacing: '0.03em'
                }}>
                  <p>
                    Today we provide you with an extensive selection of products from <strong>Pakistan, India, Bangladesh, Sri Lanka, Thailand, Philippines, Uganda, Nigeria, Middle East, and Latin America</strong>, just to name a few. Our inventory includes:
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { title: "Fresh Vegetables & Fruits", desc: "Seasonal produce from Asia, Africa and Latin America delivered fresh to our store.", icon: Heart },
                    { title: "Spices & Seasonings", desc: "Aromatic whole and ground spices from top brands like Shan, MDH, TRS, and National Foods.", icon: Award },
                    { title: "Rice, Flour & Grains", desc: "Premium Basmati rice, Chapati flour, lentils, peas, and beans for authentic cooking.", icon: ShoppingBag },
                    { title: "Frozen & Ready-to-Eat", desc: "Convenient frozen foods, ready meals, and traditional snacks from Haldiram's, Laziza, and more.", icon: Users },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-xl border bg-card/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">{item.title}</h3>
                      <p style={{ fontSize: '15.13px' }} className="text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <section className="space-y-6 pt-12 border-t">
                <h2 style={{ fontSize: '25px', fontWeight: 600 }}>What Our Customers Say</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      text: "Glad att jag hittade denna butik! Bra sortiment, hittade allt jag behövde och mer. Vänlig och hjälpsam personal.",
                      author: "Linda",
                      source: "Google Reviews"
                    },
                    {
                      text: "Kul med ett annat sortiment än det som finns på vanliga matbutikskedjorna. Kommer tveklöst återkomma!",
                      author: "Michaela Svanberg",
                      source: "Google Reviews"
                    }
                  ].map((t, i) => (
                    <div key={i} className="p-6 rounded-2xl border bg-muted/10 italic">
                      <p className="text-muted-foreground mb-4" style={{ fontSize: '15.13px' }}>&quot;{t.text}&quot;</p>
                      <div className="not-italic">
                        <p className="font-semibold" style={{ fontSize: '14.31px' }}>{t.author}</p>
                        <p className="text-xs text-muted-foreground">{t.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Store Values */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-4">
                    Our Values
                  </h3>
                  <div className="space-y-6">
                    {[
                      { title: "Authenticity", desc: "Genuine products you can trust.", icon: Award },
                      { title: "Freshness", desc: "High standards for all produce.", icon: Heart },
                      { title: "Friendly Service", desc: "Welcoming and helpful assistance.", icon: Users },
                    ].map((value, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <value.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p style={{ fontSize: '13.53px', fontWeight: 500 }}>{value.title}</p>
                          <p style={{ fontSize: '12.8px' }} className="text-muted-foreground">{value.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Sidebar Card */}
                <div className="border rounded-lg p-6 bg-card">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-4">
                    Contact Us
                  </h3>
                  <div className="space-y-4">
                    <a
                      href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>WhatsApp</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12.8px' }}>{brandProfile.contact.whatsapp}</p>
                      </div>
                    </a>
                    <a
                      href="mailto:support@cashncarry.se"
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Email</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12.8px' }}>support@cashncarry.se</p>
                      </div>
                    </a>
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                      <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p style={{ fontSize: '13.53px', fontWeight: 500 }}>Visit Store</p>
                        <p className="text-muted-foreground" style={{ fontSize: '12.8px' }}>
                          {brandProfile.address.street}, {brandProfile.address.area}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Location Map */}
                <div className="bg-card">
                  <GoogleMapCompact />
                  <div className="p-4 border border-t-0 rounded-b-lg bg-muted/10">
                    <p className="text-xs text-center text-muted-foreground">
                      {brandProfile.address.street}, {brandProfile.address.postalCode} {brandProfile.address.area}
                    </p>
                  </div>
                </div>

                {/* New Customer? CTA */}
                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 style={{
                    fontSize: '18.91px',
                    fontWeight: 500,
                    lineHeight: 1.52,
                    letterSpacing: '0.03em'
                  }} className="mb-2">
                    Ready to Shop?
                  </h3>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: '13.53px' }}>
                    Explore our full range of authentic products from Asia, Africa, Latin America, and Middle East.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    style={{ fontSize: '13.53px', fontWeight: 500 }}
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
