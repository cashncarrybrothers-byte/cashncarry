import Link from 'next/link';
import Image from 'next/image';
import { brandProfile } from '@/config/brand-profile';
import { Facebook, Instagram, MapPin, Phone, Mail, Youtube } from 'lucide-react';
import { PaymentIconsCompact } from '@/components/ui/payment-icons';

export async function Footer() {
  return (
    <footer className="w-full">
      {/* Newsletter Section */}
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="w-full px-4 md:px-[50px]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Get the freshest deals first
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sign up for our newsletter and get 10% off your first order.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-full border-none px-5 py-3 shadow-sm focus:ring-2 focus:ring-primary bg-card text-foreground text-sm"
              />
              <button
                type="button"
                className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer - Signature Red Background */}
      <div className="bg-primary py-12 md:py-16">
        <div className="w-full px-4 md:px-[50px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <div className="relative h-14 w-44">
                  <Image
                    src="https://crm.cashncarry.se/wp-content/uploads/2026/01/borthers-logo.png"
                    alt={brandProfile.name}
                    fill
                    className="object-contain"
                    sizes="176px"
                    unoptimized
                  />
                </div>
              </Link>
              <p className="text-sm text-white">
                Your trusted destination for authentic international groceries, fresh produce, and quality ingredients.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {brandProfile.social.instagram && (
                  <Link
                    href={brandProfile.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </Link>
                )}
                {brandProfile.social.facebook && (
                  <Link
                    href={brandProfile.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </Link>
                )}
                {brandProfile.social.youtube && (
                  <Link
                    href={brandProfile.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </Link>
                )}
                {brandProfile.social.tiktok && (
                  <Link
                    href={brandProfile.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                    aria-label="TikTok"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Column 2: Shop */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/shop" className="text-sm text-white hover:underline transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="text-sm text-white hover:underline transition-colors">
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/vegetables" className="text-sm text-white hover:underline transition-colors">
                    Fresh Produce
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/spices" className="text-sm text-white hover:underline transition-colors">
                    Spices & Seasonings
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="text-sm text-white hover:underline transition-colors">
                    Brands
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Service</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/contact" className="text-sm text-white hover:underline transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-white hover:underline transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/refund-return" className="text-sm text-white hover:underline transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/delivery-information" className="text-sm text-white hover:underline transition-colors">
                    Delivery Information
                  </Link>
                </li>
                <li>
                  <Link href="/europe-delivery" className="text-sm text-white hover:underline transition-colors">
                    Europe Delivery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: About */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">About Us</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-sm text-white hover:underline transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-white hover:underline transition-colors">
                    Blog & Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-white hover:underline transition-colors">
                    Store Locator
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-sm text-white hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-sm text-white hover:underline transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-6 mt-8 border-t border-white/20">
            <a
              href={`tel:${brandProfile.contact.phone}`}
              className="flex items-center gap-2 text-sm text-white hover:underline transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{brandProfile.contact.phoneFormatted}</span>
            </a>
            <a
              href={`mailto:${brandProfile.contact.email}`}
              className="flex items-center gap-2 text-sm text-white hover:underline transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{brandProfile.contact.email}</span>
            </a>
            <a
              href={brandProfile.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white hover:underline transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>Upplands Väsby, Sweden</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Darker Red */}
      <div className="bg-primary-dark py-4">
        <div className="w-full px-4 md:px-[50px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-white">
              © {new Date().getFullYear()} Brothers Cash & Carry. All Rights Reserved.
            </p>

            <div className="opacity-90">
              <PaymentIconsCompact />
            </div>

            <p className="text-sm text-white">
              Designed by{' '}
              <a
                href="https://fourlines.agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline font-medium"
              >
                Fourlines Agency
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
