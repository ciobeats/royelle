import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccess(data.message || "You’re on the waitlist.");
      setEmail("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Royelle | Coming Soon</title>
        <meta
          name="description"
          content="Join the Royelle waitlist for launch updates and first access."
        />
      </Head>

      <main className="min-h-screen overflow-hidden bg-[#050507] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-12%] h-[420px] w-[420px] rounded-full bg-violet-700/12 blur-3xl" />
          <div className="absolute right-[-8%] top-[12%] h-[340px] w-[340px] rounded-full bg-fuchsia-600/10 blur-3xl" />
          <div className="absolute bottom-[-12%] left-[22%] h-[320px] w-[320px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.08),transparent_22%)]" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:54px_54px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10 xl:px-12">
          <header className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(168,85,247,0.15)]">
                <div className="royelle-glow-pulse absolute inset-0 rounded-[22px] bg-violet-500/10 blur-md" />
                <img
                  src="/logo.png"
                  alt="Royelle Logo"
                  className="relative h-[80%] w-[80%] object-contain drop-shadow-[0_0_14px_rgba(168,85,247,0.4)]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div>
                <div className="text-[1.7rem] font-semibold tracking-[0.32em] text-white">
                  ROYELLE
                </div>
                <div className="mt-1 text-[1.05rem] text-white/55">
                  Music royalty intelligence
                </div>
              </div>
            </div>

            <div className="rounded-full border border-violet-400/25 bg-violet-500/10 px-5 py-3 text-base text-violet-200 backdrop-blur-xl md:text-lg">
              Coming Soon
            </div>
          </header>

          <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/75 backdrop-blur-xl md:text-base">
                Built for artists, producers, managers, and labels
              </div>

              <h1 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl xl:text-[5.4rem]">
                Know what
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent">
                  you’re owed.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-xl leading-10 text-white/62 md:text-[1.7rem]">
                Royelle helps music creators track royalties, verify payouts,
                and manage collaborator splits without messy spreadsheets or
                guesswork.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-300 backdrop-blur-xl md:text-base">
                  Waitlist now open
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 backdrop-blur-xl md:text-base">
                  Early access for creators and teams
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-9 rounded-[30px] border border-white/10 bg-white/5 p-4 shadow-[0_0_36px_rgba(88,28,135,0.14)] backdrop-blur-2xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email for early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-[22px] border border-white/10 bg-[#0b0b11] px-6 py-5 text-lg text-white placeholder:text-white/32 outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30 md:text-xl"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`rounded-[22px] px-7 py-5 text-lg font-medium text-white transition-all duration-300 md:text-xl ${
                      loading
                        ? "cursor-not-allowed bg-white/10 opacity-70"
                        : "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_14px_28px_rgba(139,92,246,0.28)] hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_28px_rgba(168,85,247,0.45)]"
                    }`}
                  >
                    {loading ? "Joining..." : "Join Waitlist"}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between px-2 text-sm text-white/40 md:text-base">
                  <span>No spam. Just launch updates.</span>
                  <span>Free to join</span>
                </div>

                <p className="mt-3 px-2 text-xs text-white/45 md:text-sm">
                  🔒 Early access limited • First users prioritized
                </p>

                <p className="mt-2 px-2 text-sm text-white/50 md:text-base">
                  Join creators already getting early access updates.
                </p>

                {success ? (
                  <p className="animate-fadeIn mt-4 px-2 text-sm text-emerald-400 md:text-base">
                    {success}
                  </p>
                ) : null}

                {error ? (
                  <p className="mt-4 px-2 text-sm text-red-400 md:text-base">
                    {error}
                  </p>
                ) : null}
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/42 md:text-base">
                <span>Built for modern royalty ops</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span>Cleaner than spreadsheets</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span>Made for independent music businesses</span>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  ["Track", "All royalties in one place"],
                  ["Verify", "Catch missing payouts faster"],
                  ["Split", "Handle collaborators cleanly"],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
                  >
                    <div className="text-sm text-white/45">{title}</div>
                    <div className="mt-3 text-[1.15rem] font-medium leading-7 text-white">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent blur-2xl" />

              <div className="relative w-full max-w-[620px] rounded-[36px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="rounded-[30px] border border-white/10 bg-[#07070b]/95 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg text-white/45">Royelle Preview</div>
                      <div className="mt-3 max-w-[420px] text-4xl font-semibold leading-tight">
                        Built for music revenue clarity
                      </div>
                      <div className="mt-4 max-w-md text-lg leading-8 text-white/50 md:text-xl">
                        Track royalties, monitor payouts, and manage splits in
                        one clean dashboard.
                      </div>
                    </div>

                    <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-base text-violet-200">
                      Beta
                    </div>
                  </div>

                  <div className="relative mt-8 overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_28%)]" />

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                          <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                            Total Royalties
                          </div>
                          <div className="mt-3 text-3xl font-semibold text-white">
                            $12,482.21
                          </div>
                          <div className="mt-2 text-sm text-emerald-400">
                            +8.4% this month
                          </div>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                          <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                            Pending Payouts
                          </div>
                          <div className="mt-3 text-3xl font-semibold text-white">
                            $2,194.08
                          </div>
                          <div className="mt-2 text-sm text-violet-300">
                            3 collaborators
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <div className="text-base font-medium text-white">
                                Revenue Sources
                              </div>
                              <div className="text-sm text-white/40">
                                Last 30 days
                              </div>
                            </div>

                            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50">
                              Live Preview
                            </div>
                          </div>

                          <div className="flex h-32 items-end gap-2">
                            {[26, 34, 30, 44, 41, 56, 52, 66, 61, 74].map(
                              (h, i) => (
                                <div
                                  key={i}
                                  className="relative flex-1 rounded-full bg-white/[0.03]"
                                >
                                  <div
                                    className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-violet-600 via-violet-400 to-fuchsia-300 shadow-[0_0_18px_rgba(168,85,247,0.2)]"
                                    style={{ height: `${h}%` }}
                                  />
                                </div>
                              )
                            )}
                          </div>

                          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[11px] text-white/35">
                            {["SP", "AM", "YT", "TT", "PUB"].map((label) => (
                              <div key={label}>{label}</div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                          <div className="text-base font-medium text-white">
                            Recent Sources
                          </div>
                          <div className="mt-1 text-sm text-white/40">
                            Last payout sync
                          </div>

                          <div className="mt-4 space-y-3">
                            {[
                              ["Spotify", "$1,204.22"],
                              ["Apple Music", "$842.19"],
                              ["YouTube CID", "$320.48"],
                              ["Publishing", "$514.32"],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="flex items-center justify-between rounded-[16px] border border-white/10 bg-black/20 px-4 py-3"
                              >
                                <span className="text-sm text-white/70">{label}</span>
                                <span className="text-sm font-medium text-white">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {[
                          ["Producer", "50%"],
                          ["Artist", "30%"],
                          ["Label", "20%"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-[20px] border border-white/10 bg-white/[0.045] p-5 text-center backdrop-blur-xl"
                          >
                            <div className="text-xs uppercase tracking-[0.16em] text-white/40">
                              {label}
                            </div>
                            <div className="mt-3 text-2xl font-semibold text-white">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-5 py-5 backdrop-blur-xl">
                      <div className="text-base font-medium text-white">
                        Waitlist building
                      </div>
                      <div className="mt-2 text-sm leading-7 text-white/50">
                        Priority access for early creators and teams.
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-5 py-5 backdrop-blur-xl">
                      <div className="text-base font-medium text-white">
                        Launch updates
                      </div>
                      <div className="mt-2 text-sm leading-7 text-white/50">
                        Email only when it matters.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 py-6 text-sm text-white/35">
            © 2026 Royelle. Launching soon for modern music revenue.
          </footer>
        </div>
      </main>
    </>
  );
}