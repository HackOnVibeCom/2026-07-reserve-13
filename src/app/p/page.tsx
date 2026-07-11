import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getCommunity } from "@/lib/communities";
import { decodeSharePayload } from "@/lib/share";
import type { CommunityId } from "@/lib/types";

export const metadata = {
  title: "Shared draft · Tact",
  description: "Shared soft community draft and risk summary from Tact.",
};

type Props = {
  searchParams: Promise<{ d?: string }>;
};

export default async function SharePage({ searchParams }: Props) {
  const sp = await searchParams;
  const payload = sp.d ? decodeSharePayload(sp.d) : null;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        {!payload && (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-8">
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
              Missing or invalid share link
            </h1>
            <p className="mt-3 text-[var(--mute)]">
              Open a draft from the desk and use Copy share link.
            </p>
            <Link
              href="/app"
              className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-[var(--paper)]"
            >
              Open desk
            </Link>
          </div>
        )}

        {payload && (
          <article className="space-y-8">
            <header>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Shared result · {payload.mode}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--ink)]">
                {payload.appName}
              </h1>
              {payload.oneLiner && (
                <p className="mt-3 text-lg text-[var(--mute)]">
                  {payload.oneLiner}
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--mute)]">
                Room:{" "}
                {safeCommunityName(payload.communityId)}
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <ScoreCard
                label="Spam posture"
                level={payload.spamLevel}
                score={payload.spamScore}
                tone="bad"
              />
              <ScoreCard
                label="Soft draft"
                level={payload.softLevel}
                score={payload.softScore}
                tone="ok"
              />
            </div>

            <section className="rounded-2xl border border-[var(--ok)]/25 bg-[var(--ok-bg)]/30 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                Soft draft
              </h2>
              {payload.softTitle && (
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                  {payload.softTitle}
                </h3>
              )}
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--ink-soft)]">
                {payload.softBody}
              </pre>
            </section>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/app"
                className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-[var(--paper)]"
              >
                Open Tact desk
              </Link>
              <Link
                href="/"
                className="rounded-full border border-[var(--line-strong)] px-5 py-2.5 text-sm text-[var(--mute)]"
              >
                Product
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

function safeCommunityName(id: CommunityId | string): string {
  try {
    return getCommunity(id as CommunityId).name;
  } catch {
    return String(id);
  }
}

function ScoreCard({
  label,
  level,
  score,
  tone,
}: {
  label: string;
  level: string;
  score: number;
  tone: "ok" | "bad";
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tone === "ok"
          ? "border-[var(--ok)]/25 bg-[var(--ok-bg)]/40"
          : "border-[var(--bad)]/25 bg-[var(--bad-bg)]/40"
      }`}
    >
      <div className="text-xs uppercase tracking-[0.12em] text-[var(--mute)]">
        {label}
      </div>
      <div className="mt-2 text-2xl font-medium text-[var(--ink)]">
        {level} · {score}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--paper-3)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(2, Math.min(100, score))}%`,
            background: tone === "ok" ? "var(--ok)" : "var(--bad)",
          }}
        />
      </div>
    </div>
  );
}
