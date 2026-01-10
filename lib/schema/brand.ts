/**
 * Brand Schema Generator
 * Framework-agnostic function for generating Brand schema
 */

import type { Brand } from './types';
import { createImageObject, cleanSchema } from './base';

/**
 * Generate Brand Schema
 *
 * @param name - Brand name
 * @param options - Additional brand options
 * @returns Brand schema object
 */
export function brandSchema(
  name: string,
  options?: {
    url?: string;
    logo?: string;
    description?: string;
    logoWidth?: number;
    logoHeight?: number;
  }
): Brand {
  const schema: Brand = {
    '@type': 'Brand',
    name,
  };

  if (options?.url) {
    schema.url = options.url;
  }

  if (options?.logo) {
    if (options.logoWidth && options.logoHeight) {
      schema.logo = createImageObject(options.logo, {
        width: options.logoWidth,
        height: options.logoHeight,
      });
    } else {
      schema.logo = options.logo;
    }
  }

  if (options?.description) {
    schema.description = options.description;
  }

  return cleanSchema(schema);
}

/**
 * Pre-configured Brothers Cash & Carry Brand Schema
 */
export function brothersBrandSchema(): Brand {
  return brandSchema('Brothers Cash & Carry', {
    url: 'https://cashncarry.se',
    logo: 'https://crm.cashncarry.se/wp-content/uploads/2026/01/brothers-cash-and-carry-favicon.png',
    description: 'Premier destination for authentic international groceries from Asia, Africa, Latin America, and the Middle East, delivering across Sweden.',
  });
}

// Keep legacy export for backward compatibility
export { brothersBrandSchema as idealIndiskaBrandSchema };

