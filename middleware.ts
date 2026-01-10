import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Swedish to English URL mapping for old site
const swedishToEnglishPages: Record<string, string> = {
  '/om_oss': '/about',
  '/om-oss': '/about',
  '/kontakt': '/contact',
  '/kontakta_oss': '/contact',
  '/kontakta-oss': '/contact',
  '/vanliga_fragor': '/faq',
  '/vanliga-fragor': '/faq',
  '/faq-sv': '/faq',
  '/leverans': '/delivery-information',
  '/leverans-information': '/delivery-information',
  '/leveransinformation': '/delivery-information',
  '/frakt': '/delivery-information',
  '/integritetspolicy': '/privacy-policy',
  '/integritet': '/privacy-policy',
  '/privacy': '/privacy-policy',
  '/villkor': '/terms-conditions',
  '/anvandarvillkor': '/terms-conditions',
  '/retur': '/refund-return',
  '/aterbetalning': '/refund-return',
  '/returpolicy': '/refund-return',
  '/blogg': '/blog',
  '/nyheter': '/blog',
  '/butik': '/shop',
  '/produkter': '/shop',
  '/varor': '/shop',
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Get the URL to work with
  const url = request.nextUrl.clone();

  // STEP 1: Handle non-www to www redirect (301 permanent)
  if (host === 'cashncarry.se' || host.startsWith('cashncarry.se:')) {
    url.host = 'www.cashncarry.se';
    // Continue with same pathname to check for Swedish redirects
  }

  // STEP 2: Handle Swedish to English page redirects
  const lowerPathname = pathname.toLowerCase();

  // Check for exact match
  if (swedishToEnglishPages[lowerPathname]) {
    url.pathname = swedishToEnglishPages[lowerPathname];
    return NextResponse.redirect(url, 301); // 301 = Permanent redirect
  }

  // Check if any Swedish path is a prefix (for paths with trailing slashes)
  for (const [swedishPath, englishPath] of Object.entries(swedishToEnglishPages)) {
    if (lowerPathname === `${swedishPath}/` || lowerPathname.startsWith(`${swedishPath}/`)) {
      url.pathname = url.pathname.replace(new RegExp(`^${swedishPath}`, 'i'), englishPath);
      return NextResponse.redirect(url, 301);
    }
  }

  // STEP 3: If host changed (non-www to www) but path didn't need redirect
  if (url.host !== host) {
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image (image directory)
     * - robots.txt, sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|image|robots.txt|sitemap|opengraph-image|twitter-image).*)',
  ],
};
