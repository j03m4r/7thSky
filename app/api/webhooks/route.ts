import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from 'next/headers';

import { stripe } from "@/libs/stripe";
import {
    upsertProductRecord,
    upsertPriceRecord,
    manageSubscriptionStatusChange,
    updatePurchasedItems
} from '@/libs/supabaseAdmin';

const relativeEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

export async function POST(
    request: Request
  ) {
      const body = await request.text()
      const sig = headers().get('Stripe-Signature');
  
      const webhookSecret =
        process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
        process.env.STRIPE_WEBHOOK_SECRET;
      let event: Stripe.Event;
  
      try {
        if (!sig || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err: any) {
        console.log(`❌ Error message: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
      }
  
    if (relativeEvents.has(event.type)) {
      try {
        switch (event.type) {
          case 'product.created':
          case 'product.updated':
            await upsertProductRecord(event.data.object as Stripe.Product);
            break;
          case 'price.created':
          case 'price.updated':
            await upsertPriceRecord(event.data.object as Stripe.Price);
            break;
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            break;
          case 'checkout.session.completed':
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await updatePurchasedItems(checkoutSession.customer as string);
            
            break;
          default:
            throw new Error('Unhandled relevant event!');
        }
      } catch (error) {
        console.log(error);
        return new NextResponse('Webhook error: "Webhook handler failed. View logs."', { status: 400 });
      }
    }
  
    return NextResponse.json({ received: true }, { status: 200 });
};