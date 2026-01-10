# URL Redirects Guide - Brothers Cash & Carry

**Last Updated:** 2026-01-11  
**Purpose:** Handle all old Swedish URLs and non-www redirects with 301 permanent redirects for SEO

---

## Overview

This document explains how URL redirects are configured to handle:
1. **Non-www to www migration** (`cashncarry.se` → `www.cashncarry.se`)
2. **Swedish to English page URLs** (`/om_oss` → `/about`)
3. **SEO preservation** (All redirects are 301 permanent)

---

## How It Works

All redirects are handled in **`middleware.ts`** at the Next.js edge level, before any page rendering occurs. This ensures:
- ✅ Fast redirect execution (no server processing)
- ✅ Proper 301 status codes for SEO
- ✅ Google Search Console recognizes the redirects
- ✅ Old indexed URLs remain functional

### Redirect Flow

```
User visits old URL
      ↓
Middleware checks for redirects
      ↓
├─ Non-www? → Redirect to www
├─ Swedish page? → Redirect to English equivalent
└─ No match? → Continue to page
      ↓
User sees correct page
```

---

## Swedish to English URL Mappings

The following Swedish URLs automatically redirect to their English equivalents:

| Old Swedish URL | New English URL | Description |
|----------------|-----------------|-------------|
| `/om_oss` | `/about` | About Us page |
| `/om-oss` | `/about` | About Us (hyphen variant) |
| `/kontakt` | `/contact` | Contact page |
| `/kontakta_oss` | `/contact` | Contact Us |
| `/kontakta-oss` | `/contact` | Contact Us (hyphen) |
| `/vanliga_fragor` | `/faq` | FAQ page |
| `/vanliga-fragor` | `/faq` | FAQ (hyphen) |
| `/faq-sv` | `/faq` | FAQ Swedish version |
| `/leverans` | `/delivery-information` | Delivery info |
| `/leverans-information` | `/delivery-information` | Delivery information |
| `/leveransinformation` | `/delivery-information` | Delivery (no hyphen) |
| `/frakt` | `/delivery-information` | Shipping |
| `/integritetspolicy` | `/privacy-policy` | Privacy policy |
| `/integritet` | `/privacy-policy` | Privacy |
| `/privacy` | `/privacy-policy` | Privacy (English) |
| `/villkor` | `/terms-conditions` | Terms & Conditions |
| `/anvandarvillkor` | `/terms-conditions` | User terms |
| `/retur` | `/refund-return` | Return policy |
| `/aterbetalning` | `/refund-return` | Refund |
| `/returpolicy` | `/refund-return` | Return policy |
| `/blogg` | `/blog` | Blog |
| `/nyheter` | `/blog` | News |
| `/butik` | `/shop` | Shop |
| `/produkter` | `/shop` | Products |
| `/varor` | `/shop` | Goods |

---

## Test Cases

### ✅ Non-www to www Redirect
```
http://cashncarry.se → https://www.cashncarry.se (301)
http://cashncarry.se/shop → https://www.cashncarry.se/shop (301)
```

### ✅ Swedish Page Redirects
```
https://cashncarry.se/om_oss → https://www.cashncarry.se/about (301)
https://www.cashncarry.se/kontakt → https://www.cashncarry.se/contact (301)
https://cashncarry.se/butik → https://www.cashncarry.se/shop (301)
```

### ✅ Combined Redirects (non-www + Swedish)
```
http://cashncarry.se/om_oss → https://www.cashncarry.se/about (301)
                               ↑ Both www AND page redirect applied
```

### ✅ Trailing Slash Handling
```
https://cashncarry.se/om_oss/ → https://www.cashncarry.se/about (301)
https://www.cashncarry.se/kontakt/ → https://www.cashncarry.se/contact (301)
```

### ✅ Case Insensitive
```
https://cashncarry.se/OM_OSS → https://www.cashncarry.se/about (301)
https://cashncarry.se/Om_Oss → https://www.cashncarry.se/about (301)
```

---

## Adding New Redirects

To add a new Swedish → English redirect:

1. Open `middleware.ts`
2. Add to the `swedishToEnglishPages` object:
   ```typescript
   const swedishToEnglishPages: Record<string, string> = {
     // ... existing redirects
     '/nya-sidan': '/new-page',  // Add your redirect here
   };
   ```
3. Commit and deploy

---

## Google Search Console Integration

### Verifying Redirects Work

1. **Google Search Console** → **Coverage** → Check indexed pages
2. Old URLs should show as **"Redirected"** (not 404)
3. New URLs should show as **"Indexed"**

### Updating Sitemaps

The sitemap at `/sitemap.xml` contains only the new English URLs. This tells Google:
- ✅ Index the new English pages
- ✅ Follow redirects from old Swedish URLs
- ✅ Remove old Swedish URLs from search results

### Expected Timeline

- **Week 1-2**: Google recognizes the 301 redirects
- **Week 3-4**: Search results update to show new URLs
- **Month 2-3**: Old URLs fully replaced in search results

---

## Technical Details

### Middleware Configuration

File: `middleware.ts`

```typescript
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|image|robots.txt|sitemap|opengraph-image|twitter-image).*)',
  ],
};
```

**Excluded paths** (no redirect check):
- `/api/*` - API routes
- `/_next/*` - Next.js internal files
- `/favicon.ico` - Favicon
- `/image/*` - Image directory
- `/robots.txt`, `/sitemap*.xml` - SEO files

---

## Monitoring & Troubleshooting

### Check if Redirect is Working

```bash
# Test a Swedish URL redirect
curl -I https://cashncarry.se/om_oss

# Expected response:
HTTP/2 301
location: https://www.cashncarry.se/about
```

### Common Issues

**Issue**: Redirect not working
- ✅ **Check**: Is the URL in the `swedishToEnglishPages` mapping?
- ✅ **Check**: Is Vercel deployment complete?
- ✅ **Fix**: Add the mapping and redeploy

**Issue**: 404 instead of redirect
- ✅ **Check**: URL spelling (case-insensitive)
- ✅ **Check**: Middleware matcher pattern
- ✅ **Fix**: Verify path in `middleware.ts`

**Issue**: Redirect loop
- ✅ **Check**: Target URL exists
- ✅ **Check**: No circular redirects
- ✅ **Fix**: Ensure target is a valid page

---

## Performance Impact

- **Edge Execution**: Redirects happen at CDN level (Vercel Edge)
- **Speed**: ~1-5ms redirect time
- **SEO Impact**: Positive - 301 redirects preserve link equity
- **Server Load**: Zero - handled before server

---

## Maintenance

### Regular Checks

- [ ] Monthly: Review Google Search Console for 404 errors
- [ ] Quarterly: Check redirect performance in Vercel Analytics
- [ ] Yearly: Audit old URLs and remove unused redirects

### Documentation Updates

When adding new redirects, update:
1. ✅ This guide (`URL-REDIRECTS-GUIDE.md`)
2. ✅ `middleware.ts` code
3. ✅ Deployment notes in README

---

## Support

For questions or issues:
- **Developer**: Check `middleware.ts` for redirect logic
- **SEO Team**: Review Google Search Console
- **Deployment**: Check Vercel logs for redirect status

---

**Last Deployment:** Check `git log middleware.ts` for latest changes
