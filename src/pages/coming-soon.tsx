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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-12%] h-[320px] w-[320px] rounded-full bg-violet-700/12 blur-3xl sm:h-[420px] sm:w-[420px]" />
          <div className="absolute right-[-8%] top-[12%] h-[260px] w-[260px] rounded-full bg-fuchsia-600/10 blur-3xl sm:h-[340px] sm:w-[340px]" />
          <div className="absolute bottom-[-12%] left-[22%] h-[240px] w-[240px] rounded-full bg-violet-500/10 blur-3xl sm:h-[320px] sm:w-[320px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.08),transparent_22%)]" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:54px_54px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-8 md:px-10 xl:px-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(168,85,247,0.15)] sm:h-[68px] sm:w-[68px] sm:rounded-[22px]">
                <div className="royelle-glow-pulse absolute inset-0 rounded-[18px] bg-violet-500/10 blur-md sm:rounded-[22px]" />
                <img
                  src="/logo.png"
                  alt="Royelle Logo"
                  className="relative h-[80%] w-[80%] object-contain drop-shadow-[0_0_14px_rgba(168,85,247,0.4)]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="truncate text-[1.2rem] font-semibold tracking-[0.24em] text-white sm:text-[1.7rem] sm:tracking-[0.32em]">
                  ROYELLE
                </div>
                <div className="mt-1 text-sm text-white/55 sm:text-[1.05rem]">
                  Music royalty intelligence
                </div>
              </div>
            </div>

            <div className="self-start rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-base">
              Coming Soon
            </div>
          </header>

          <section className="grid flex-1 items-start gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:py-10">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/75 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-sm md:text-base">
                Built for artists, producers, managers, and labels
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[0.95] tracking-tight sm:mt-8 sm:text-5xl md:text-6xl xl:text-[5.4rem]">
                Know what
                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent">
                  you’re owed.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-white/62 sm:mt-7 sm:text-lg sm:leading-9 md:text-[1.7rem] md:leading-10">
                Royelle helps music creators track royalties, verify payouts,
                and manage collaborator splits without messy spreadsheets or
                guesswork.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-sm md:text-base">
                  Waitlist now open
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-xl sm:px-5 sm:py-3 sm:text-sm md:text-base">
                  Early access for creators and teams
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7 rounded-[24px] border border-white/10 bg-white/5 p-3 shadow-[0_0_36px_rgba(88,28,135,0.14)] backdrop-blur-2xl sm:mt-9 sm:rounded-[30px] sm:p-4"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email for early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-[18px] border border-white/10 bg-[#0b0b11] px-5 py-4 text-base text-white placeholder:text-white/32 outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/30 sm:rounded-[22px] sm:px-6 sm:py-5 sm:text-lg md:text-xl"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-[18px] px-5 py-4 text-base font-medium text-white transition-all duration-300 sm:rounded-[22px] sm:px-7 sm:py-5 sm:text-lg md:text-xl ${
                      loading
                        ? "cursor-not-allowed bg-white/10 opacity-70"
                        : "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_14px_28px_rgba(139,92,246,0.28)] hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_28px_rgba(168,85,247,0.45)]"
                    }`}
                  >
                    {loading ? "Joining..." : "Join Waitlist"}
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-1 px-1 text-xs text-white/40 sm:px-2 sm:text-sm md:flex-row md:items-center md:justify-between md:text-base">
                  <span>No spam. Just launch updates.</span>
                  <span>Free to join</span>
                </div>

                <p className="mt-3 px-1 text-xs text-white/45 sm:px-2 sm:text-sm">
                  🔒 Early access limited • First users prioritized
                </p>

                <p className="mt-2 px-1 text-sm text-white/50 sm:px-2 md:text-base">
                  Join creators already getting early access updates.
                </p>

                {success ? (
                  <p className="animate-fadeIn mt-4 px-1 text-sm text-emerald-400 sm:px-2 md:text-base">
                    {success}
                  </p>
                ) : null}

                {error ? (
                  <p className="mt-4 px-1 text-sm text-red-400 sm:px-2 md:text-base">
                    {error}
                  </p>
                ) : null}
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/42 sm:gap-4 sm:text-sm md:text-base">
                <span>Built for modern royalty ops</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span>Cleaner than spreadsheets</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span>Made for independent music businesses</span>
              </div>

              <div className="mt-7 grid gap-3 sm:mt-9 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Track", "All royalties in one place"],
                  ["Verify", "Catch missing payouts faster"],
                  ["Split", "Handle collaborators cleanly"],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="rounded-[20px] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl sm:rounded-[24px] sm:p-5"
                  >
                    <div className="text-sm text-white/45">{title}</div>
                    <div className="mt-2 text-lg font-medium leading-7 text-white sm:mt-3 sm:text-[1.15rem]">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex min-w-0 items-center justify-center">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent blur-2xl sm:rounded-[40px]" />

              <div className="relative w-full min-w-0 max-w-[620px] rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[36px] sm:p-5">
                <div className="rounded-[24px] border border-white/10 bg-[#07070b]/95 p-4 sm:rounded-[30px] sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-base text-white/45 sm:text-lg">
                        Royelle Preview
                      </div>
                      <div className="mt-2 max-w-[420px] text-3xl font-semibold leading-tight sm:mt-3 sm:text-4xl">
                        Built for music revenue clarity
                      </div>
                      <div className="mt-3 max-w-md text-base leading-7 text-white/50 sm:mt-4 sm:text-lg sm:leading-8 md:text-xl">
                        Track royalties, monitor payouts, and manage splits in
                        one clean dashboard.
                      </div>
                    </div>

                    <div className="self-start rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 sm:px-4 sm:py-3 sm:text-base">
                      Beta
                    </div>
                  </div>

                  <div className="relative mt-6 overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-3 sm:mt-8 sm:rounded-[26px] sm:p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_28%)]" />

                    <div className="grid gap-3 sm:gap-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:rounded-[22px] sm:p-5">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
                            Total Royalties
                          </div>
                          <div className="mt-3 truncate text-2xl font-semibold text-white sm:text-3xl">
                            $12,482.21
                          </div>
                          <div className="mt-2 text-sm text-emerald-400">
                            +8.4% this month
                          </div>
                        </div>

                        <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:rounded-[22px] sm:p-5">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 sm:text-xs">
                            Pending Payouts
                          </div>
                          <div className="mt-3 truncate text-2xl font-semibold text-white sm:text-3xl">
                            $2,194.08
                          </div>
                          <div className="mt-2 text-sm text-violet-300">
                            3 collaborators
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:rounded-[22px] sm:p-5">
                          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="text-base font-medium text-white">
                                Revenue Sources
                              </div>
                              <div className="text-sm text-white/40">
                                Last 30 days
                              </div>
                            </div>

                            <div className="self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50">
                              Live Preview
                            </div>
                          </div>

                          <div className="flex h-24 items-end gap-1.5 sm:h-32 sm:gap-2">
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

                          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[10px] text-white/35 sm:text-[11px]">
                            {["SP", "AM", "YT", "TT", "PUB"].map((label) => (
                              <div key={label}>{label}</div>
                            ))}
                          </div>
                        </div>

                        <div className="min-w-0 rounded-[18px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:rounded-[22px] sm:p-5">
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
                                className="flex items-center justify-between gap-3 rounded-[14px] border border-white/10 bg-black/20 px-4 py-3 sm:rounded-[16px]"
                              >
                                <span className="truncate text-sm text-white/70">
                                  {label}
                                </span>
                                <span className="shrink-0 text-sm font-medium text-white">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        {[
                          ["Producer", "50%"],
                          ["Artist", "30%"],
                          ["Label", "20%"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-[18px] border border-white/10 bg-white/[0.045] p-4 text-center backdrop-blur-xl sm:rounded-[20px] sm:p-5"
                          >
                            <div className="text-[11px] uppercase tracking-[0.16em] text-white/40 sm:text-xs">
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

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.045] px-4 py-4 backdrop-blur-xl sm:rounded-[22px] sm:px-5 sm:py-5">
                      <div className="text-base font-medium text-white">
                        Waitlist building
                      </div>
                      <div className="mt-2 text-sm leading-7 text-white/50">
                        Priority access for early creators and teams.
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-white/[0.045] px-4 py-4 backdrop-blur-xl sm:rounded-[22px] sm:px-5 sm:py-5">
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

          <footer className="border-t border-white/10 py-5 text-xs text-white/35 sm:py-6 sm:text-sm">
            © 2026 Royelle. Launching soon for modern music revenue.
          </footer>
        </div>
      </main>
    </>
  );
}