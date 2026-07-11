import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
              For apps that just went live
            </p>
            <h1 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl">
              Promote the launch.
              <span className="block text-[var(--mute)]">
                Without sounding like an ad.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--mute)]">
              Tact turns your app facts into community-native posts for Reddit
              and Indie Hackers, then scores spam posture with a real rules
              engine. Built for the first two weeks after ship.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
              >
                Open the desk
              </Link>
              <a
                href="#how"
                className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm text-[var(--mute)] transition hover:text-[var(--ink)]"
              >
                See the flow
              </a>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--line)] pt-8 text-sm">
              <div>
                <dt className="text-[var(--mute)]">User</dt>
                <dd className="mt-1 font-medium">Solo indie</dd>
              </div>
              <div>
                <dt className="text-[var(--mute)]">Moment</dt>
                <dd className="mt-1 font-medium">Days 0-14</dd>
              </div>
              <div>
                <dt className="text-[var(--mute)]">Price idea</dt>
                <dd className="mt-1 font-medium">$9 / mo</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[var(--paper-3)]/70 blur-0" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--line-strong)] bg-[var(--paper-2)] shadow-[0_24px_60px_rgba(40,24,8,0.08)]">
              <div className="border-b border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.14em] text-[var(--mute)]">
                Contrast · r/SideProject
              </div>
              <div className="grid sm:grid-cols-2">
                <div className="border-b border-[var(--line)] p-5 sm:border-b-0 sm:border-r">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--bad)]">
                    Spam posture · 86
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg leading-snug">
                    DOWNLOAD NOW: FOCUSRAIL IS LIVE!!!
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--mute)]">
                    Game changer 🔥🔥 Download and leave 5 stars…
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ok)]">
                    Soft draft · 12
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg leading-snug">
                    I built Focusrail after losing 40 minutes between client
                    calls
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--mute)]">
                    Honest problem → what shipped → one ask. Link late.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how"
          className="border-y border-[var(--line)] bg-[var(--paper-2)]/70"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
              One workflow. Clear demo.
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: "01",
                  t: "App facts",
                  d: "Name, lived problem, who it’s for, days live, wedge.",
                },
                {
                  n: "02",
                  t: "Pick the room",
                  d: "r/SideProject, r/iOSProgramming, Indie Hackers, r/androiddev - each with different norms.",
                },
                {
                  n: "03",
                  t: "Soft vs spam",
                  d: "Copy the soft draft. See why the other version would get ignored or removed.",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6"
                >
                  <div className="text-xs tracking-[0.16em] text-[var(--accent)]">
                    {step.n}
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl">
                    {step.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--mute)]">
                    {step.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
                AI writes. Rules judge.
              </h2>
              <p className="mt-4 max-w-md text-[var(--mute)]">
                The model is only half the product. Tact runs a deterministic
                spam-risk engine on every draft: CTA-first, hard-sell phrases,
                early links, emoji walls, missing problem, missing ask, venue
                length, craft detail for dev subs.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-6">
              <h3 className="text-sm font-medium">Business path</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--mute)]">
                <li>
                  <span className="font-medium text-[var(--ink)]">Buyer:</span>{" "}
                  solo mobile indie, week one after launch
                </li>
                <li>
                  <span className="font-medium text-[var(--ink)]">Pain:</span>{" "}
                  free channels convert only if the post doesn’t read like an ad
                </li>
                <li>
                  <span className="font-medium text-[var(--ink)]">Offer:</span> 3
                  free drafts · Pro $9/mo unlimited + more rooms
                </li>
                <li>
                  <span className="font-medium text-[var(--ink)]">First users:</span>{" "}
                  ship Tact itself with Tact - dogfood the soft pitch
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Try Tact on a sample app
            </Link>
            <p className="text-sm text-[var(--mute)]">
              No account. Demo drafts work without an API key.
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t border-[var(--line)] py-8 text-center text-xs text-[var(--mute)]">
        Tact · HackOnVibe July 2026 · promote a newly launched mobile app with
        restraint
      </footer>
    </div>
  );
}
