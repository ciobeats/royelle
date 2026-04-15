import Link from 'next/link'

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
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-zinc-400">{description}</p>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  )
}

function PriceCard({
  name,
  price,
  description,
  items,
  featured = false,
}: {
  name: string
  price: string
  description: string
  items: string[]
  featured?: boolean
}) {
  return (
    <div
      className={`rounded-3xl border p-6 ${
        featured
          ? 'border-purple-500/40 bg-purple-500/10'
          : 'border-zinc-800 bg-zinc-950/90'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        {featured ? (
          <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-medium text-purple-200">
            Most popular
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-4xl font-semibold text-white">{price}</p>
      <p className="mt-3 text-sm text-zinc-400">{description}</p>

      <ul className="mt-6 space-y-3 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition ${
          featured
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'border border-zinc-700 text-white hover:bg-zinc-900'
        }`}
      >
        Choose {name}
      </Link>
    </div>
  )
}

function TestimonialCard({
  quote,
  role,
}: {
  quote: string
  role: string
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6">
      <p className="text-sm leading-7 text-zinc-300">“{quote}”</p>
      <p className="mt-5 text-sm font-medium text-white">{role}</p>
    </div>
  )
}

function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5">
      <h3 className="text-lg font-semibold text-white">{question}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{answer}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/70 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-3xl font-semibold tracking-tight text-white">Royelle</div>
            <p className="mt-1 text-sm text-purple-300">
              Royalty intelligence for modern creators
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing"
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Pricing
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
            <Link
              href="/signup"
              className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-purple-300">What is Royelle</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Royalty tracking, audit visibility, and collaborator payouts in one platform.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Royelle helps producers, artists, and teams upload royalty statements,
              monitor song-level earnings, track splits, prepare collaborator payouts,
              and spot discrepancies before money slips through the cracks.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-2xl bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
              >
                Start free
              </Link>
              <Link
                href="/pricing"
                className="rounded-2xl border border-zinc-700 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-900"
              >
                View pricing
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Track</p>
                <p className="mt-3 text-lg font-semibold text-white">Statement earnings</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Manage</p>
                <p className="mt-3 text-lg font-semibold text-white">Collaborator splits</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Audit</p>
                <p className="mt-3 text-lg font-semibold text-white">Potential discrepancies</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-purple-950/20 p-6">
            <div className="rounded-3xl border border-zinc-800 bg-black/50 p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Why Royelle</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Built for transparency, not confusion.
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <p className="font-medium text-white">Centralized statement ingestion</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Bring royalty CSVs into one clean workspace instead of juggling spreadsheets
                    and scattered files.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <p className="font-medium text-white">Clear split and payout workflows</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Keep collaborators aligned on ownership and payout readiness from one dashboard.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                  <p className="font-medium text-white">Audit-first mindset</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Royelle is designed to help you catch missing metadata, inconsistencies,
                    and underpayment risks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <SectionTitle
            eyebrow="Why Royelle"
            title="A royalty workspace built for independent creators and growing teams."
            description="Royelle is not just a dashboard. It is the place where royalty statements, song data, collaborations, payouts, and audits come together in one product."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              title="Statement imports"
              description="Upload royalty files and transform raw CSVs into structured, usable royalty records."
            />
            <FeatureCard
              title="Song-level visibility"
              description="Track performance by song, not just by statement totals."
            />
            <FeatureCard
              title="Collaboration management"
              description="Organize ownership splits and keep payout workflows cleaner."
            />
            <FeatureCard
              title="Audit insights"
              description="Surface potential payout blockers, missing metadata, and discrepancies early."
            />
          </div>
        </section>

        <section className="py-14">
          <SectionTitle
            eyebrow="How it works"
            title="From import to payout in one workflow."
            description="Royelle is designed to simplify the royalty process end to end."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            <FeatureCard
              title="1. Import"
              description="Upload royalty statements from your existing sources."
            />
            <FeatureCard
              title="2. Organize"
              description="Map songs, metadata, and collaborator relationships."
            />
            <FeatureCard
              title="3. Audit"
              description="Review anomalies, missing fields, and payout issues."
            />
            <FeatureCard
              title="4. Payout"
              description="Prepare clearer collaborator payout workflows."
            />
          </div>
        </section>

        <section className="py-14">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Pricing"
              title="Simple subscription tiers for creators and teams."
              description="Start lean, then grow into a fuller royalty operating system as your catalog expands."
            />
            <Link
              href="/pricing"
              className="hidden rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-900 md:inline-flex"
            >
              View full pricing
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <PriceCard
              name="Starter"
              price="$19/mo"
              description="For solo producers and creators getting their catalog organized."
              items={[
                'Statement imports',
                'Basic dashboard tracking',
                'Song-level visibility',
                'Single workspace',
              ]}
            />
            <PriceCard
              name="Pro"
              price="$49/mo"
              description="For active creators managing more songs, collaborators, and payout workflows."
              items={[
                'Everything in Starter',
                'Collaboration tracking',
                'Payout workflow tools',
                'Audit monitoring',
              ]}
              featured
            />
            <PriceCard
              name="Team"
              price="$99/mo"
              description="For managers, labels, and teams that need more oversight and coordination."
              items={[
                'Everything in Pro',
                'Multi-user workflow',
                'Advanced reporting',
                'Priority support',
              ]}
            />
          </div>
        </section>

        <section className="py-14">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Testimonials"
              title="What Royelle users should feel."
              description="These are the kinds of outcomes Royelle is built to deliver."
            />
            <Link
              href="/testimonials"
              className="hidden rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-900 md:inline-flex"
            >
              View all testimonials
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <TestimonialCard
              quote="Royelle gives me one place to actually understand what my songs are doing instead of chasing numbers across files."
              role="Independent Producer"
            />
            <TestimonialCard
              quote="The collaboration workflow is what stood out. It feels like the missing layer between statements and payouts."
              role="Artist Team"
            />
            <TestimonialCard
              quote="The audit angle is the part that makes this feel bigger than a dashboard."
              role="Catalog Manager"
            />
          </div>
        </section>

        <section className="py-14">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              eyebrow="FAQs"
              title="Questions people will have before they trust Royelle."
              description="Your landing page should answer the big objections clearly."
            />
            <Link
              href="/faq"
              className="hidden rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-900 md:inline-flex"
            >
              View all FAQs
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <FaqItem
              question="What is Royelle?"
              answer="Royelle is a music royalty tracking platform built to help creators and teams import statements, track earnings, manage collaborations, prepare payouts, and audit for issues."
            />
            <FaqItem
              question="Who is Royelle for?"
              answer="Royelle is for producers, artists, managers, labels, and any team that wants clearer royalty visibility and collaboration tracking."
            />
            <FaqItem
              question="Can I upload royalty statements from different sources?"
              answer="That is the goal. Royelle is being designed to support flexible CSV ingestion so users can work with multiple royalty report formats over time."
            />
            <FaqItem
              question="Does Royelle collect royalties for me?"
              answer="No. Royelle is focused on tracking, organization, audit visibility, and payout workflow support rather than directly collecting royalties."
            />
          </div>
        </section>

        <section className="py-14">
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950/90 p-8 md:p-10">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle
                eyebrow="Contact us"
                title="Talk to Royelle"
                description="Whether you want early access, partnership info, or product updates, this section should make it easy to reach you."
              />
              <Link
                href="/contact"
                className="hidden rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-900 md:inline-flex"
              >
                Contact page
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
                <p className="text-sm text-zinc-400">General inquiries</p>
                <p className="mt-2 font-medium text-white">hello@royelle.app</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
                <p className="text-sm text-zinc-400">Partnerships</p>
                <p className="mt-2 font-medium text-white">partners@royelle.app</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
                <p className="text-sm text-zinc-400">Support</p>
                <p className="mt-2 font-medium text-white">support@royelle.app</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 px-6 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-white">Royelle</p>
              <p className="mt-1 text-sm text-zinc-500">
                Royalty intelligence for creators, collaborators, and teams.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
              <Link href="/testimonials" className="hover:text-white">
                Testimonials
              </Link>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact us
              </Link>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}