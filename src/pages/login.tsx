import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setCheckingSession(false)
        return
      }

      try {
        const { data: subscriptionData, error } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', session.user.id)
          .in('status', ['active', 'trialing'])
          .limit(1)

        if (error) {
          console.error('Login subscription check error:', error)
          setCheckingSession(false)
          return
        }

        if (subscriptionData && subscriptionData.length > 0) {
          router.replace('/dashboard')
          return
        }

        router.replace('/pricing')
      } catch (err) {
        console.error('Session check failed:', err)
        setCheckingSession(false)
      }
    }

    checkExistingSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setLoading(false)
      setMessage('Please enter your email and password.')
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (error) {
      setLoading(false)
      setMessage(error.message)
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    setLoading(false)

    if (data.user || session?.user) {
      const userId = data.user?.id || session?.user?.id

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .limit(1)

      if (subscriptionError) {
        console.error('Login subscription lookup error:', subscriptionError)
        router.replace('/pricing')
        return
      }

      if (subscriptionData && subscriptionData.length > 0) {
        router.replace('/dashboard')
      } else {
        router.replace('/pricing')
      }

      return
    }

    setMessage('Login succeeded, but no active session was found.')
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="text-zinc-400">Checking session...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-purple-950/20 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              ← Back to home
            </Link>

            <div className="mt-12">
              <p className="text-sm uppercase tracking-[0.28em] text-purple-300">
                Welcome back
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
                Log in to your royalty workspace.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                Access your dashboard, statement imports, audit visibility, and
                collaborator payout workflows all in one place.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">
              Why Royelle
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="font-medium text-white">Track statement earnings</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Turn imported royalty files into clean song-level visibility.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="font-medium text-white">Audit with confidence</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Catch inconsistencies, missing metadata, and payout blockers earlier.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="font-medium text-white">Prepare payouts clearly</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Keep collaborator workflows organized as your catalog grows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-black/30">
            <div className="mb-8">
              <Link
                href="/"
                className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white lg:hidden"
              >
                ← Back to home
              </Link>

              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-zinc-400">Log in to Royelle.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {message ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-600 px-4 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-sm text-zinc-400">
              <p>
                Need an account?{' '}
                <Link href="/signup" className="text-purple-300 hover:text-purple-200">
                  Sign up
                </Link>
              </p>

              <p>
                Want to explore first?{' '}
                <Link href="/pricing" className="text-purple-300 hover:text-purple-200">
                  View pricing
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}