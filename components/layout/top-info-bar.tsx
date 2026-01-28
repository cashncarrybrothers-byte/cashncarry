"use client";

import { Phone, Mail, MapPin, Clock, ShoppingCart, Wrench } from "lucide-react";
import Link from "next/link";
import { brandConfig } from "@/config/brand.config";
import { useEffect, useState } from "react";
import { getStoreStatus, type StoreStatus } from "@/lib/store-hours";

// Check if ordering is disabled (development/maintenance mode)
const isOrderingDisabled = process.env.NEXT_PUBLIC_ORDERING_DISABLED === 'true';

export function TopInfoBar() {
  const { contact } = brandConfig;
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    // Update store status on mount and every minute
    const updateStatus = () => setStoreStatus(getStoreStatus());
    updateStatus();

    const interval = setInterval(updateStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Format phone number for links
  const phoneClean = contact.phone.replace(/\s+/g, '');

  return (
    <div className="hidden lg:block w-full bg-primary text-primary-foreground py-2 px-4 md:px-[50px]">
      <div className="flex items-center justify-between text-xs md:text-sm font-medium">
        {/* Left side - Contact info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Call Button */}
            <a
              href={`tel:${phoneClean}`}
              className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
              title="Call us"
            >
              <Phone className="h-4 w-4" />
              <span>{contact.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${contact.email}`} className="hover:underline hover:text-white">
              {contact.email}
            </a>
          </div>
        </div>

        {/* Right side - Store hours, online orders & location */}
        <div className="flex items-center gap-6">
          {/* Physical Store Status */}
          {storeStatus && (
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${storeStatus.isOpen
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-red-950 text-white shadow-sm'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${storeStatus.isOpen ? 'bg-white' : 'bg-red-400'}`} />
                  {storeStatus.statusText}
                </span>
                <span className="hidden xl:inline text-white">•</span>
                <span className="hidden xl:inline">{storeStatus.todayHours}</span>
              </div>
            </div>
          )}

          {/* Online Orders Status - Show "Coming Soon" when disabled */}
          {isOrderingDisabled ? (
            <div className="flex items-center gap-2 bg-amber-500/20 px-2 py-1 rounded-md border border-amber-400/30">
              <Wrench className="h-4 w-4 text-amber-200" />
              <span className="text-amber-100 font-semibold text-xs">Online Orders Coming Soon</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-md border border-white/20">
              <ShoppingCart className="h-4 w-4 text-white" />
              <span className="text-white font-semibold text-xs">Orders 24/7</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-white"
            >
              Upplands Väsby
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
