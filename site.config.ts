/**
 * Site Configuration - Brothers Cash & Carry
 */

type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  site_tagline?: string;
};

export const siteConfig: SiteConfig = {
  site_name: "Brothers Cash & Carry",
  site_description: "Your trusted source for authentic international groceries from Asia, Africa, Latin America, and the Middle East. Quality products at affordable prices, delivered to your door in Sweden.",
  site_domain: "https://cashncarry.se",
  site_tagline: "Quality @ Affordability",
};
