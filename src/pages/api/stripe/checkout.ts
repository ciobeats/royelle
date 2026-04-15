import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
})

const PRICE_MAP: Record<string, { monthly?: string; yearly?: string }> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  team: {
    monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY,
    yearly: process.env.STRIPE_PRICE_TEAM_YEARLY,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { plan, billingCycle, userId, email } = req.body as {
      plan?: 'starter' | 'pro' | 'team'
      billingCycle?: 'monthly' | 'yearly'
      userId?: string
      email?: string
    }

    if (!plan || !billingCycle || !userId || !email) {
      return res.status(400).json({ error: 'Missing required checkout fields.' })
    }

    const priceId = PRICE_MAP[plan]?.[billingCycle]

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid pricing configuration.' })
    }

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = req.headers.host
    const origin = `${protocol}://${host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
        plan,
        billingCycle,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return res.status(500).json({ error: 'Unable to create checkout session.' })
  }
}