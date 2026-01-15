# Stripe Configuration Guide - Brothers Cash & Carry

## ✅ Configuration Status

### Environment Variables (Configured)
- ✅ **Publishable Key**: `pk_live_51Spm978k53oVaAJw...` (configured)
- ✅ **Secret Key**: `sk_live_51Spm978k53oVaAJw...` (configured)
- ⏳ **Webhook Secret**: Not yet configured (optional but recommended)

### API Endpoints (Ready)
- ✅ **Payment Intent Creation**: `/api/stripe/create-payment-intent`
- ✅ **Webhook Handler**: `/api/stripe/webhook` (newly created)
- ✅ **Payment Return Page**: `/checkout/stripe-return`
- ✅ **Order Payment Page**: `/checkout/order-pay/[orderId]`

---

## 🔧 Stripe Dashboard Configuration

### 1. Update Business Information

Login to your Stripe Dashboard and update:

**Settings → Account details → Public details**
- **Business name**: `Brothers Cash & Carry`
- **Website**: `https://www.cashncarry.se`
- **Support email**: `admin@cashncarry.se`
- **Support phone**: `+46765670454`

### 2. Configure Webhook Endpoints (IMPORTANT: Configure BOTH)

You need **TWO webhook endpoints** because you have both a Next.js frontend and WooCommerce backend:

#### **Webhook #1: Next.js Frontend** (Custom checkout logic)

**Settings → Webhooks → Add endpoint**

**Webhook URL**: `https://www.cashncarry.se/api/stripe/webhook`

**Events to select**:
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed
- `charge.dispute.created` - Customer disputed charge (chargeback)

**After creating the webhook**:
1. Copy the **Signing secret** (starts with `whsec_...`)
2. Add it to your `.env.local` file:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
   ```

#### **Webhook #2: WooCommerce Backend** (Automatic order updates)

**Settings → Webhooks → Add endpoint**

**Webhook URL**: `https://crm.cashncarry.se/?wc-api=wc_stripe`

**Events to select**: Select **all events** (WooCommerce will filter what it needs)

**Why both?**
- Webhook #1 handles payments from your Next.js checkout with custom logic
- Webhook #2 ensures WooCommerce orders are automatically updated
- This provides redundancy and ensures no payment events are missed

### 3. Enable Payment Methods

**Settings → Payment methods**

Ensure these are enabled:
- ✅ **Cards** (Visa, Mastercard, Amex)
- ✅ **Apple Pay** (automatically available on Safari/iOS)
- ✅ **Google Pay** (automatically available on Chrome)
- ✅ **Klarna** (popular in Sweden - highly recommended!)
- ✅ **Link** (Stripe's one-click checkout)

**For Swedish customers, also consider**:
- **Swish** (if available in your Stripe account)
- **SEPA Direct Debit** (for European customers)

### 4. Configure Branding

**Settings → Branding**

Upload your logo and set brand colors to match your website:
- **Primary color**: `#166534` (forest green)
- **Icon**: Upload your Brothers Cash & Carry logo

This will make the Stripe payment forms match your brand.

---

## 🌐 URL Configuration in Stripe

Verify these URLs are correctly set in your Stripe Dashboard:

### Business URLs
- **Website**: `https://www.cashncarry.se`
- **Terms of Service**: `https://www.cashncarry.se/terms` (if you have one)
- **Privacy Policy**: `https://www.cashncarry.se/privacy` (if you have one)

### Return URLs (for redirect-based payments)
- **Success URL**: `https://www.cashncarry.se/checkout/stripe-return`
- **Cancel URL**: `https://www.cashncarry.se/checkout`

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ `.env.local` is in `.gitignore` - keys won't be committed to Git
- ✅ Never share your Secret Key publicly
- ✅ Use test keys (`pk_test_` / `sk_test_`) for development
- ✅ Use live keys (`pk_live_` / `sk_live_`) for production only

### Webhook Security
- ⚠️ **Important**: Configure the webhook secret to verify webhook authenticity
- Without the webhook secret, anyone could send fake payment notifications
- The webhook handler will work without it, but with reduced security

---

## 💰 Supported Payment Methods

Your current implementation supports:

### Instant Payment Methods
- **Credit/Debit Cards** (Visa, Mastercard, Amex)
- **Apple Pay** (Safari/iOS users)
- **Google Pay** (Chrome users with Google account)
- **Link** (Stripe's saved payment info)

### Buy Now, Pay Later
- **Klarna** (very popular in Sweden!)

### Bank Transfers (if enabled)
- **SEPA Direct Debit**
- **Swish** (Sweden-specific, if available)

---

## 🧪 Testing the Integration

### Test Mode (Recommended First)
1. Get test keys from Stripe Dashboard (toggle to "Test mode")
2. Replace live keys with test keys in `.env.local`
3. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`
   - Any future expiry date, any CVC

### Live Mode
- Currently configured with live keys
- Real payments will be processed
- Real money will be charged to customers

---

## 📊 Payment Flow

1. **Customer adds items to cart** → Proceeds to checkout
2. **Customer chooses Stripe payment** → Frontend creates Payment Intent
3. **Payment Intent created** → `/api/stripe/create-payment-intent`
4. **Customer enters payment details** → Stripe Payment Element
5. **Payment processed** → Stripe confirms payment
6. **Webhook notification** → `/api/stripe/webhook` receives event
7. **Order updated** → WooCommerce order status updated (TODO)

---

## 🚀 Next Steps

### Immediate (Required)
1. ✅ Configure webhook endpoint in Stripe Dashboard
2. ✅ Add webhook secret to `.env.local`
3. ✅ Test a payment in test mode
4. ✅ Enable Klarna for Swedish customers

### Soon (Recommended)
1. 🔄 Integrate webhook handler with WooCommerce API
   - Update order status when payment succeeds/fails
   - Send confirmation emails
2. 🔄 Add payment method icons to checkout page
3. 🔄 Set up Stripe Radar for fraud prevention
4. 🔄 Configure email receipts in Stripe Dashboard

### Optional (Nice to Have)
1. 📧 Set up custom email templates in Stripe
2. 📊 Enable Stripe Tax for automatic tax calculation
3. 💳 Add saved payment methods for returning customers
4. 🔔 Set up Slack/email notifications for disputes

---

## 🆘 Troubleshooting

### Payment not working?
1. Check browser console for errors
2. Verify keys are correct in `.env.local`
3. Ensure you're using the correct mode (test vs live)
4. Check Stripe Dashboard → Logs for API errors

### Webhook not receiving events?
1. Verify webhook URL is correct: `https://www.cashncarry.se/api/stripe/webhook`
2. Check webhook secret is configured
3. Test webhook in Stripe Dashboard → Webhooks → Send test webhook
4. Check server logs for webhook errors

### Payment succeeds but order not updated?
1. This is expected - webhook integration with WooCommerce is TODO
2. You can manually update orders in WooCommerce admin
3. Or implement the WooCommerce API integration (next step)

---

## 📞 Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Test Card Numbers**: https://stripe.com/docs/testing

---

## 🔐 Important Notes

- Your Stripe account is in **LIVE MODE** with real keys configured
- Real payments will be processed and real money will be charged
- Test thoroughly before going live with customers
- Keep your Secret Key secure and never commit it to Git
- Monitor your Stripe Dashboard regularly for disputes and issues

---

**Configuration completed on**: 2026-01-15
**Configured by**: Antigravity AI Assistant
**Status**: ✅ Ready for testing
