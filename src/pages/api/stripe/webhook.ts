import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

function getPlanKeyFromPriceId(priceId: string | null) {
  if (!priceId) return null

  if (
    priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_STARTER_YEARLY
  ) {
    return 'starter'
  }

  if (
    priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_PRO_YEARLY
  ) {
    return 'pro'
  }

  if (
    priceId === process.env.STRIPE_PRICE_TEAM_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_TEAM_YEARLY
  ) {
    return 'team'
  }

  return null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawBody = await buffer(req)
  const signature = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send('Webhook Error')
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const priceId = subscription.items.data[0]?.price?.id ?? null
        const planKey = getPlanKeyFromPriceId(priceId)

        await supabase.from('subscriptions').upsert(
          {
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            plan_key: planKey,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'stripe_subscription_id',
          }
        )

        console.log('✅ Subscription saved from checkout.session.completed')
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription
      const priceId = subscription.items.data[0]?.price?.id ?? null
      const planKey = getPlanKeyFromPriceId(priceId)

      await supabase.from('subscriptions').upsert(
        {
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          plan_key: planKey,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'stripe_subscription_id',
        }
      )

      console.log('✅ Subscription updated')
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      console.log('✅ Subscription canceled')
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ error: 'Webhook handler failed.' })
  }
}