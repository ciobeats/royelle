import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'

type UserState = {
  id: string
  email: string | null
}

type StatementLine = {
  revenue?: number | string | null
  units?: number | string | null
  song_title?: string | null
}

function getInitials(email: string | null) {
  if (!email) return 'U'
  const namePart = email.split('@')[0]
  const parts = namePart.split(/[.\-_ ]+/).filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function SideNavPill({
  href,
  label,
  active = false,
}: {
  href: string
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group block w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-purple-600/20 to-fuchsia-500/10 text-white ring-1 ring-purple-400/25 shadow-[0_0_20px_rgba(168,85,247,0.12)]'
          : 'bg-white/[0.02] text-zinc-400 ring-1 ring-white/5 hover:bg-white/[0.05] hover:text-white hover:ring-white/10'
      }`}
    >
      <span className="flex items-center justify-between">
        {label}
        <span
          className={`h-2 w-2 rounded-full transition ${
            active ? 'bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]' : 'bg-transparent'
          }`}
        />
      </span>
    </Link>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-sm shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-white">{value}</p>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-purple-500/30 via-white/10 to-transparent" />
    </div>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#111114] to-[#0a0a0d] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
          ) : null}
        </div>
        <div className="hidden h-3 w-3 rounded-full bg-purple-400/80 shadow-[0_0_14px_rgba(168,85,247,0.9)] md:block" />
      </div>
      {children}
    </section>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<UserState | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    revenue: 0,
    units: 0,
    songs: 0,
    collaborators: 0,
  })

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        const OWNER_EMAIL = 'mitchellmauricio@yahoo.com'

        setUser({
          id: user.id,
          email: user.email ?? null,
        })

        // Owner bypass
        if (user.email === OWNER_EMAIL) {
          const { data: linesData, error: linesError } = await supabase
            .from('statement_lines')
            .select('*')

          if (!linesError && linesData) {
            const typedLines = linesData as StatementLine[]

            const totalRevenue = typedLines.reduce(
              (sum, line) => sum + Number(line.revenue || 0),
              0
            )

            const totalUnits = typedLines.reduce(
              (sum, line) => sum + Number(line.units || 0),
              0
            )

            const uniqueSongs = new Set(
              typedLines.map((line) => line.song_title).filter(Boolean)
            ).size

            setStats({
              revenue: totalRevenue,
              units: totalUnits,
              songs: uniqueSongs,
              collaborators: 0,
            })
          } else if (linesError) {
            console.error('Statement lines error:', linesError)
          }

          setLoading(false)
          return
        }

        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('status, current_period_end')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('created_at', { ascending: false })
          .limit(1)

        if (subscriptionError) {
          console.error('Subscription check error:', subscriptionError)
          setLoading(false)
          router.replace('/pricing')
          return
        }

        if (!subscriptionData || subscriptionData.length === 0) {
          setLoading(false)
          router.replace('/pricing')
          return
        }

        const { data: linesData, error: linesError } = await supabase
          .from('statement_lines')
          .select('*')

        if (!linesError && linesData) {
          const typedLines = linesData as StatementLine[]

          const totalRevenue = typedLines.reduce(
            (sum, line) => sum + Number(line.revenue || 0),
            0
          )

          const totalUnits = typedLines.reduce(
            (sum, line) => sum + Number(line.units || 0),
            0
          )

          const uniqueSongs = new Set(
            typedLines.map((line) => line.song_title).filter(Boolean)
          ).size

          setStats({
            revenue: totalRevenue,
            units: totalUnits,
            songs: uniqueSongs,
            collaborators: 0,
          })
        } else if (linesError) {
          console.error('Statement lines error:', linesError)
        }

        setLoading(false)
      } catch (error) {
        console.error('Dashboard gate error:', error)
        setLoading(false)
        router.replace('/pricing')
      }
    }

    checkUser()
  }, [router, supabase])

  const initials = useMemo(() => getInitials(user?.email ?? null), [user])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050507] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-zinc-400 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            Loading dashboard...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              Royelle Royalty Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 md:block">
              Premium workspace
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-sm font-semibold text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              {initials}
            </div>

            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/login')
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.06]"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-white/10 bg-[#0b0b0e]/90 p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
              <div className="mb-5 rounded-3xl border border-white/10 bg-gradient-to-br from-[#141018] to-[#09090b] p-4 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Royelle logo"
                    width={48}
                    height={48}
                    className="rounded-2xl object-contain"
                  />
                  <div>
                    <p className="text-xl font-semibold tracking-tight text-white">Royelle</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.22em] text-purple-300/80">
                      Royalty intelligence
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <SideNavPill href="/dashboard" label="Dashboard" active />
                <SideNavPill href="/works" label="Works" />
                <SideNavPill href="/statements" label="Statements" />
                <SideNavPill href="/splits" label="Splits" />
                <SideNavPill href="/audit/flags" label="Audit Flags" />
                <SideNavPill href="/payouts" label="Payouts" />
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                    Premium analytics
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    Catalog performance and payout readiness
                  </h2>
                </div>

                <Link
                  href="/upload"
                  className="inline-flex w-fit items-center rounded-2xl border border-purple-500/20 bg-purple-500/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500/15 shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                >
                  + Import statement
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <StatCard
                  label="Total imported royalties"
                  value={`$${stats.revenue.toFixed(2)}`}
                />
                <StatCard
                  label="Total units"
                  value={stats.units.toLocaleString()}
                />
                <StatCard
                  label="Active works"
                  value={stats.songs.toString()}
                />
                <StatCard
                  label="Collaborators paid"
                  value={stats.collaborators.toString()}
                />
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <Panel
                  title="Top earning works"
                  description="Your highest-performing songs will appear here after you import statements."
                >
                  <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-sm text-zinc-400">
                    No royalty data yet. Import a statement to populate song-level insights.
                  </div>
                </Panel>

                <Panel
                  title="Alerts & audit"
                  description="Royelle will flag discrepancies, missing metadata, and payout blockers here."
                >
                  <div className="space-y-3">
                    <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-5 py-5 text-sm text-zinc-400">
                      No audit flags detected yet.
                    </div>

                    <div className="rounded-3xl border border-purple-500/15 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
                      <p className="text-sm font-medium text-white">Recommended next step</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        Import your first royalty statement to start tracking works,
                        statements, splits, and payout readiness.
                      </p>
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <Panel
                  title="Recent activity"
                  description="Track the latest statement imports, updates, and review activity."
                >
                  <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-sm text-zinc-400">
                    No recent activity yet.
                  </div>
                </Panel>

                <Panel
                  title="Payout status"
                  description="Monitor payout readiness and upcoming collaborator disbursements."
                >
                  <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-sm text-zinc-400">
                    No collaborator payouts scheduled yet.
                  </div>
                </Panel>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}