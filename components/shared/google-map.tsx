/**
 * Google Map Component
 * Global reusable map component for Brothers Cash & Carry store location
 *
 * Single source of truth for map embed URL
 * Update the mapEmbedUrl constant to change the map globally
 */

import { cn } from "@/lib/utils";

// SINGLE SOURCE: Update this URL to change the map across the entire site
const MAP_EMBED_URL = "https://maps.google.com/maps?q=Regndroppsgatan+3,+194+49+Upplands+Väsby,+Sweden&t=&z=15&ie=UTF8&iwloc=&output=embed";

interface GoogleMapProps {
  className?: string;
  height?: string;
  title?: string;
  showBorder?: boolean;
}

export function GoogleMap({
  className,
  height = "450px",
  title = "Brothers Cash & Carry - Upplands Väsby, Stockholm",
  showBorder = true
}: GoogleMapProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", showBorder && "rounded-lg border", className)}>
      <iframe
        src={MAP_EMBED_URL}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="w-full"
      />
    </div>
  );
}

/**
 * Compact version for sidebars
 */
export function GoogleMapCompact({ className }: { className?: string }) {
  return (
    <GoogleMap
      height="250px"
      className={className}
      title="Store Location Map"
    />
  );
}

/**
 * Full-width version for main sections
 */
export function GoogleMapFull({ className }: { className?: string }) {
  return (
    <GoogleMap
      height="500px"
      className={className}
      title="Visit Our Store - Brothers Cash & Carry"
    />
  );
}
