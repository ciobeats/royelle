import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'

type Plan = {
  name: string
  monthlyPrice: string
  yearlyPrice: string
  description: string
  features: string[]
  featured?: boolean
  planKey: 'starter' | 'pro' | 'team'
}

const plans: Plan[] = [
  {
    name: 'Starter',
    planKey: 'starter',
    monthlyPrice: '$19/mo',
    yearlyPrice: '$190/yr',
    description: 'For solo producers and creators getting their catalog organized.',
    features: [
      'Statement imports',
      'Basic dashboard tracking',
      'Song-level visibility',
      'Single workspace',
    ],
  },
  {
    name: 'Pro',
    planKey: 'pro',
    monthlyPrice: '$49/mo',
    yearlyPrice: '$490/yr',
    description:
      'For active creators managing more songs, collaborators, and payout workflows.',
    features: [
      'Everything in Starter',
      'Collaboration tracking',
      'Payout workflow tools',
      'Audit monitoring',
    ],
    featured: true,
  },
  {
    name: 'Team',
    planKey: 'team',
    monthlyPrice: '$99/mo',
    yearlyPrice: '$990/yr',
    description:
      'For managers, labels, and teams that need more oversight and coordination.',
    features: [
      'Everything in Pro',
      'Multi-user workflow',
      'Advanced reporting',
      'Priority support',
    ],
  },
]

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.28em] text-purple-300">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-400">{description}</p>
    </div>
  )
}

function CompareRow({
  label,
  starter,
  pro,
  team,
}: {
  label: string
  starter: string
  pro: string
  team: string
}) {
  return (
    <div className="grid grid-cols-4 gap-4 border-t border-zinc-800 px-4 py-4 text-sm">
      <div className="text-zinc-400">{label}</div>
      <div className="text-white">{starter}</div>
      <div className="text-white">{pro}</div>
      <div className="text-white">{team}</div>
    </div>
  )
}

export default function PricingPage() {
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const handlePlanSelect = async (planKey: Plan['planKey']) => {
    setLoadingPlan(planKey)
    setMessage('')

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planKey,
          billingCycle: billing,
          userId: user.id,
          email: user.email,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setMessage(data?.error || 'Unable to create checkout session.')
        setLoadingPlan(null)
        return
      }

      if (data?.url) {
        window.location.href = data.url
        return
      }

      setMessage('Checkout session created, but no redirect URL was returned.')
    } catch (error) {
      console.error(error)
      setMessage('Something went wrong starting checkout.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/70 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-3xl font-semibold tracking-tight text-white">
              Royelle
            </Link>
            <p className="mt-1 text-sm text-purple-300">
              Royalty intelligence for modern creators
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/testimonials"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Testimonials
            </Link>
            <Link
              href="/faq"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Log in
            </Link>
          </div>
        </header>

        <section className="py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Pricing"
              title="Choose the Royelle plan that fits your catalog."
              description="Start with the essentials, then scale into deeper royalty visibility, collaboration workflows, payout support, and audit intelligence."
            />

            <div className="inline-flex w-fit rounded-2xl border border-zinc-800 bg-zinc-950/90 p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  billing === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  billing === 'yearly'
                    ? 'bg-purple-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.planKey}
                className={`rounded-3xl border p-6 ${
                  plan.featured
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : 'border-zinc-800 bg-zinc-950/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
                  {plan.featured ? (
                    <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-medium text-purple-200">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-4xl font-semibold text-white">
                  {billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </p>
                <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>

                <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                  {plan.features.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan.planKey)}
                  disabled={loadingPlan === plan.planKey}
                  className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                    plan.featured
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border border-zinc-700 text-white hover:bg-zinc-900'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {loadingPlan === plan.planKey ? 'Starting checkout...' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {message ? (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {message}
            </div>
          ) : null}
        </section>

        <section className="py-10">
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/90 p-8">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-purple-300">
                Plan comparison
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                See what changes as you grow.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400">
                Royelle starts with core royalty visibility and expands into fuller
                collaboration, payout, and audit workflows.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-black/30">
              <div className="grid grid-cols-4 gap-4 px-4 py-4 text-sm font-medium text-zinc-400">
                <div>Feature</div>
                <div>Starter</div>
                <div>Pro</div>
                <div>Team</div>
              </div>

              <CompareRow
                label="Statement imports"
                starter="Included"
                pro="Included"
                team="Included"
              />
              <CompareRow
                label="Song-level dashboard"
                starter="Included"
                pro="Included"
                team="Included"
              />
              <CompareRow
                label="Collaboration tracking"
                starter="Basic"
                pro="Advanced"
                team="Advanced"
              />
              <CompareRow
                label="Payout workflows"
                starter="—"
                pro="Included"
                team="Included"
              />
              <CompareRow
                label="Audit monitoring"
                starter="—"
                pro="Included"
                team="Included"
              />
              <CompareRow
                label="Multi-user access"
                starter="—"
                pro="—"
                team="Included"
              />
              <CompareRow
                label="Priority support"
                starter="—"
                pro="—"
                team="Included"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}