import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives webhook events from Stripe for payment status updates.
 * Configure this webhook URL in your Stripe Dashboard:
 * https://www.cashncarry.se/api/stripe/webhook
 * 
 * Events to listen for:
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - charge.refunded
 * - charge.dispute.created
 */

export async function POST(request: NextRequest) {
    try {
        // Check if Stripe is configured
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY is not configured');
            return NextResponse.json(
                { error: 'Stripe not configured' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Get the raw body for signature verification
        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            console.error('No Stripe signature found');
            return NextResponse.json(
                { error: 'No signature' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        // Verify webhook signature if webhook secret is configured
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            try {
                event = stripe.webhooks.constructEvent(
                    body,
                    signature,
                    process.env.STRIPE_WEBHOOK_SECRET
                );
            } catch (err) {
                console.error('Webhook signature verification failed:', err);
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 400 }
                );
            }
        } else {
            // If no webhook secret is configured, parse the event directly
            // NOTE: This is less secure and should only be used for testing
            console.warn('STRIPE_WEBHOOK_SECRET not configured - webhook signature verification skipped');
            event = JSON.parse(body);
        }

        // Handle the event
        console.log(`Received Stripe webhook: ${event.type}`);

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSuccess(paymentIntent);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailure(paymentIntent);
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                await handleRefund(charge);
                break;
            }

            case 'charge.dispute.created': {
                const dispute = event.data.object as Stripe.Dispute;
                await handleDispute(dispute);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
    console.log(`Amount: ${paymentIntent.amount} ${paymentIntent.currency}`);
    console.log(`Customer: ${paymentIntent.metadata.customer_email || 'N/A'}`);

    // TODO: Update WooCommerce order status to 'processing' or 'completed'
    // You can use the metadata to find the corresponding WooCommerce order
    // Example: const orderId = paymentIntent.metadata.order_id;

    // For now, just log the success
    console.log('Payment metadata:', paymentIntent.metadata);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    console.log(`Payment failed: ${paymentIntent.id}`);
    console.log(`Reason: ${paymentIntent.last_payment_error?.message || 'Unknown'}`);

    // TODO: Update WooCommerce order status to 'failed'
    // Send notification email to customer and admin

    console.log('Payment metadata:', paymentIntent.metadata);
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
    console.log(`Refund processed: ${charge.id}`);
    console.log(`Amount refunded: ${charge.amount_refunded} ${charge.currency}`);

    // TODO: Update WooCommerce order status to 'refunded'
    // Send notification email to customer

    console.log('Charge metadata:', charge.metadata);
}

/**
 * Handle dispute (chargeback)
 */
async function handleDispute(dispute: Stripe.Dispute) {
    console.log(`Dispute created: ${dispute.id}`);
    console.log(`Reason: ${dispute.reason}`);
    console.log(`Amount: ${dispute.amount} ${dispute.currency}`);

    // TODO: Send urgent notification to admin
    // Update order with dispute information

    console.log('Dispute metadata:', dispute.metadata);
}
