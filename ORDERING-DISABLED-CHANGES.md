# Ordering Disabled - Changes Documentation

This document lists all changes made to disable ordering functionality during development. When ready to re-enable ordering, revert these changes.

## Quick Re-enable

To re-enable ordering, set in `.env.local`:
```
NEXT_PUBLIC_ORDERING_DISABLED="false"
```

However, this only re-enables the **Add to Cart** and **WhatsApp Order Button** components. The direct WhatsApp links were removed from pages and need to be manually restored.

---

## Files Changed

### 1. `components/layout/top-info-bar.tsx`

**What was removed:**
- WhatsApp button in the left side contact info section
- WhatsApp icon component

**What was changed:**
- "Orders 24/7" badge now conditionally shows "Online Orders Coming Soon" when `isOrderingDisabled` is true

**To restore WhatsApp button, add back after the Call Button (around line 40):**
```tsx
// Add this WhatsApp Icon Component at the top of file (after imports):
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// Add this after the Call Button <a> tag, inside the gap-3 div:
const whatsappLink = `https://wa.me/${phoneClean.replace('+', '')}`;

<a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-2 py-1 rounded-md transition-colors shadow-sm"
  title="Chat on WhatsApp"
>
  <WhatsAppIcon className="h-4 w-4" />
  <span className="hidden xl:inline">WhatsApp</span>
</a>
```

**To always show "Orders 24/7":** Remove the conditional and always show the orders badge.

---

### 2. `app/contact/page.tsx`

**What was removed:**
- WhatsApp from `contactMethods` array
- WhatsApp button in hero section

**To restore, add WhatsApp back to contactMethods array (first item):**
```tsx
{
    title: "WhatsApp",
    description: "Fastest response for order status or product availability",
    icon: MessageCircle,
    color: "bg-green-500/10 text-green-600",
    link: `https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`,
    linkText: brandProfile.contact.whatsapp,
    external: true,
},
```

**To restore hero WhatsApp button, replace the current buttons with:**
```tsx
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
```

---

### 3. `app/about/page.tsx`

**What was changed:**
- WhatsApp link replaced with Contact page link in the contact methods grid

**To restore, replace the Contact link with WhatsApp:**
```tsx
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
```

---

### 4. `app/faq/page.tsx`

**What was changed:**
- WhatsApp ordering FAQ answer updated to say "coming soon"
- WhatsApp link removed from sidebar

**To restore FAQ answer:**
```tsx
{
    q: "Can I order groceries through WhatsApp?",
    a: "Yes! You can place orders via WhatsApp directly from product pages, cart, or checkout. You can also chat with our support team for any help with your order."
},
```

**To restore sidebar WhatsApp link, add before the email link:**
```tsx
<a
    href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
>
    <MessageCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
    <div>
        <p style={{ fontSize: '13.53px', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.03em' }}>WhatsApp</p>
        <p className="text-muted-foreground" style={{ fontSize: '12.8px', fontWeight: 300, lineHeight: 1.57, letterSpacing: '0.03em' }}>Chat with us instantly</p>
    </div>
</a>
```

---

### 5. `app/delivery-information/page.tsx`

**What was changed:**
- WhatsApp "Chat Now" button replaced with Email button

**To restore:**
```tsx
<div className="border rounded-lg p-6 bg-muted/30 text-center">
    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">Delivery Help?</h3>
    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">Contact our delivery team via WhatsApp.</p>
    <a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
        Chat Now
    </a>
</div>
```

---

### 6. `app/europe-delivery/page.tsx`

**What was changed:**
- WhatsApp "WhatsApp Inquiries" button replaced with Email button

**To restore:**
```tsx
<div className="border rounded-lg p-6 bg-muted/30 text-center">
    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">European Support</h3>
    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">Have questions about shipping to your specific country?</p>
    <a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
        WhatsApp Inquiries
    </a>
</div>
```

---

### 7. `app/delivery-goteborg-malmo/page.tsx`

**What was changed:**
- WhatsApp "Chat Now" button replaced with Email button

**To restore:**
```tsx
<div className="border rounded-lg p-6 bg-muted/30 text-center">
    <h3 style={{ fontSize: '18.91px', fontWeight: 500 }} className="mb-2">Questions?</h3>
    <p style={{ fontSize: '13.53px' }} className="text-muted-foreground mb-4">Chat with us on WhatsApp for regional delivery inquiries.</p>
    <a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} className="inline-block w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
        Chat Now
    </a>
</div>
```

---

### 8. `app/terms-conditions/page.tsx`

**What was changed:**
- WhatsApp Support link replaced with Phone link
- Import changed: `MessageCircle` removed, `Phone` added

**To restore:**
```tsx
// Import: add MessageCircle back
import { FileText, ShoppingCart, CreditCard, Truck, Scale, Shield, Mail, MessageCircle, MapPin } from 'lucide-react';

// Replace phone link with:
<a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
    <MessageCircle className="h-4 w-4 text-primary" />
    <span style={{ fontSize: '13.53px' }}>WhatsApp Support</span>
</a>
```

---

### 9. `app/refund-return/page.tsx`

**What was changed:**
- WhatsApp Support link replaced with Phone link
- Import changed: `MessageCircle` removed, `Phone` added

**To restore:**
```tsx
// Import: add MessageCircle back
import { RotateCcw, Package, Clock, CheckCircle2, XCircle, Mail, MessageCircle, MapPin } from 'lucide-react';

// Replace phone link with (as first item in the space-y-3 div):
<a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
    <MessageCircle className="h-4 w-4 text-primary" />
    <span style={{ fontSize: '13.53px' }}>WhatsApp Support</span>
</a>
```

---

### 10. `app/privacy-policy/page.tsx`

**What was changed:**
- WhatsApp link replaced with Phone link
- Import changed: `MessageCircle` removed, `Phone` added

**To restore:**
```tsx
// Import: add MessageCircle back
import { ShieldCheck, Lock, Eye, FileText, MessageCircle, Mail, MapPin } from 'lucide-react';

// Replace phone link with:
<a href={`https://wa.me/${brandProfile.contact.whatsapp.replace(/\D/g, '')}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
    <MessageCircle className="h-4 w-4 text-primary" />
    <span style={{ fontSize: '13.53px' }}>Privacy via WhatsApp</span>
</a>
```

---

### 11. `components/layout/mobile-floating-cta.tsx`

**What was changed:**
- "Order Now" button conditionally shows "Visit Store" when ordering is disabled

**To restore (or just set NEXT_PUBLIC_ORDERING_DISABLED=false):**
The component already handles this automatically based on the env variable. No manual changes needed if you set `NEXT_PUBLIC_ORDERING_DISABLED="false"`.

---

## Components That Auto-Enable (No Manual Changes Needed)

These components already check `NEXT_PUBLIC_ORDERING_DISABLED` and will automatically work when set to `false`:

1. **`components/whatsapp/whatsapp-order-button.tsx`** - WhatsApp order buttons on product pages and cart
2. **`components/shop/add-to-cart-button.tsx`** - Add to cart buttons
3. **`components/cart/cart-drawer.tsx`** - Cart drawer checkout flow
4. **`app/(shop)/checkout/page.tsx`** - Checkout page
5. **`components/layout/maintenance-ticker.tsx`** - Maintenance banner

---

## Re-Enable Checklist

When ready to launch ordering:

- [ ] Set `NEXT_PUBLIC_ORDERING_DISABLED="false"` in `.env.local`
- [ ] Restore WhatsApp button in `top-info-bar.tsx`
- [ ] Restore WhatsApp in `contact/page.tsx` (contactMethods + hero)
- [ ] Restore WhatsApp in `about/page.tsx`
- [ ] Restore WhatsApp FAQ answer and sidebar link in `faq/page.tsx`
- [ ] Restore WhatsApp in `delivery-information/page.tsx`
- [ ] Restore WhatsApp in `europe-delivery/page.tsx`
- [ ] Restore WhatsApp in `delivery-goteborg-malmo/page.tsx`
- [ ] Restore WhatsApp in `terms-conditions/page.tsx`
- [ ] Restore WhatsApp in `refund-return/page.tsx`
- [ ] Restore WhatsApp in `privacy-policy/page.tsx`
- [ ] Test all ordering flows
- [ ] Deploy

---

*Document created: January 27, 2026*
*Last updated: January 27, 2026*
