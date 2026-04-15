import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
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

      if (session?.user) {
        router.replace('/dashboard')
        return
      }

      setCheckingSession(false)
    }

    checkExistingSession()
  }, [router, supabase])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setLoading(false)
      setMessage('Please enter your email and password.')
      return
    }

    if (password.length < 6) {
      setLoading(false)
      setMessage('Password must be at least 6 characters long.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    if (data.user?.identities?.length === 0) {
      setMessage('An account with this email may already exist. Try logging in instead.')
      return
    }

    if (data.user) {
      setMessage('Account created successfully. You can now log in.')
      setTimeout(() => {
        router.push('/login')
      }, 1200)
      return
    }

    setMessage('Signup completed.')
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
                Get started
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
                Create your Royelle account.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                Start building your royalty workspace with statement imports, split tracking,
                payout workflows, and audit visibility in one platform.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">
              What you get
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="font-medium text-white">Import royalty statements</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Bring CSV royalty data into one clean dashboard.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="font-medium text-white">Track songs and splits</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Organize ownership, collaborators, and payout readiness.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <p className="font-medium text-white">Audit for issues</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Catch missing metadata and potential discrepancies earlier.
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
                Create your account
              </h1>
              <p className="mt-2 text-zinc-400">Start using Royelle.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
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
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-purple-500"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Use at least 6 characters.
                </p>
              </div>

              {message ? (
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-100">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-600 px-4 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-sm text-zinc-400">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="text-purple-300 hover:text-purple-200">
                  Log in
                </Link>
              </p>

              <p>
                Want to compare plans first?{' '}
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