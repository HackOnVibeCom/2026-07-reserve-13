"use client";

import { useEffect, useMemo, useState } from "react";
import { COMMUNITY_LIST } from "@/lib/communities";
import { SAMPLE_PROFILE } from "@/lib/demo";
import {
  clearHistory,
  formatSoftMarkdown,
  loadHistory,
  pushHistory,
  type HistoryItem,
} from "@/lib/history";
import type {
  AppProfile,
  CommunityId,
  PitchResult,
} from "@/lib/types";
import { RiskBadge, RiskList } from "./risk-badge";

const empty: AppProfile = {
  name: "",
  oneLiner: "",
  problem: "",
  whoFor: "",
  platform: "ios",
  daysLive: 3,
  differentiator: "",
  storeUrl: "",
};

export function PitchDesk() {
  const [profile, setProfile] = useState<AppProfile>(empty);
  const [communityId, setCommunityId] =
    useState<CommunityId>("sideproject");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PitchResult | null>(null);
  const [copied, setCopied] = useState<"soft" | "md" | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const ready = useMemo(() => {
    return (
      profile.name.trim() &&
      profile.oneLiner.trim() &&
      profile.problem.trim() &&
      profile.whoFor.trim() &&
      profile.differentiator.trim()
    );
  }, [profile]);

  function setField<K extends keyof AppProfile>(key: K, value: AppProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function generate(forceDemo = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            ...profile,
            daysLive: Number(profile.daysLive) || 0,
          },
          communityId,
          forceDemo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const pitch = data as PitchResult;
      setResult(pitch);
      setHistory(pushHistory(profile, pitch));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function copySoft() {
    if (!result) return;
    const text = [result.softDraft.title, result.softDraft.body]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied("soft");
    setTimeout(() => setCopied(null), 1600);
  }

  async function copyMarkdown() {
    if (!result) return;
    await navigator.clipboard.writeText(formatSoftMarkdown(result));
    setCopied("md");
    setTimeout(() => setCopied(null), 1600);
  }

  function restoreHistory(item: HistoryItem) {
    setResult({
      communityId: item.communityId,
      spamDraft: {
        title: "Saved entry (soft draft only)",
        body: "Open a fresh draft to regenerate the spam contrast.",
      },
      softDraft: {
        title: item.softTitle,
        body: item.softBody,
      },
      spamRisk: {
        level: "high",
        score: 80,
        findings: [],
        summary: "Not rescored. Generate again for a full contrast.",
      },
      softRisk: {
        level: item.softRiskLevel,
        score: item.softRiskScore,
        findings: [],
        summary: "Restored from local history on this device.",
      },
      tips: ["History is stored only in this browser."],
      mode: item.mode,
    });
    setCommunityId(item.communityId);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <section className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Desk
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
            Write the post. Check the room.
          </h1>
          <p className="mt-3 max-w-md text-[var(--mute)]">
            Tact drafts a soft community post for your newly launched app,
            shows the spam version you almost wrote, and scores both with a
            deterministic risk engine.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setProfile(SAMPLE_PROFILE)}
            className="rounded-full border border-[var(--line-strong)] bg-[var(--paper-2)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:bg-[var(--paper-3)]"
          >
            Load sample: Focusrail
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-5 shadow-[0_1px_0_rgba(20,16,12,0.04)]">
          <Field label="App name">
            <input
              className="field"
              value={profile.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Focusrail"
            />
          </Field>
          <Field label="One-liner">
            <textarea
              className="field min-h-[72px]"
              value={profile.oneLiner}
              onChange={(e) => setField("oneLiner", e.target.value)}
              placeholder="What it does in one plain sentence"
            />
          </Field>
          <Field label="Lived problem">
            <textarea
              className="field min-h-[72px]"
              value={profile.problem}
              onChange={(e) => setField("problem", e.target.value)}
              placeholder="The friction you actually hit"
            />
          </Field>
          <Field label="Who it's for">
            <input
              className="field"
              value={profile.whoFor}
              onChange={(e) => setField("whoFor", e.target.value)}
              placeholder="Solo freelancers on client days"
            />
          </Field>
          <Field label="What makes it different">
            <input
              className="field"
              value={profile.differentiator}
              onChange={(e) => setField("differentiator", e.target.value)}
              placeholder="One wedge, not a feature list"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Platform">
              <select
                className="field"
                value={profile.platform}
                onChange={(e) =>
                  setField(
                    "platform",
                    e.target.value as AppProfile["platform"],
                  )
                }
              >
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="both">iOS + Android</option>
                <option value="web">Web</option>
              </select>
            </Field>
            <Field label="Days live">
              <input
                type="number"
                min={0}
                className="field"
                value={profile.daysLive}
                onChange={(e) =>
                  setField("daysLive", Number(e.target.value) || 0)
                }
              />
            </Field>
            <Field label="Store URL (optional)">
              <input
                className="field"
                value={profile.storeUrl || ""}
                onChange={(e) => setField("storeUrl", e.target.value)}
                placeholder="https://"
              />
            </Field>
          </div>

          <Field label="Community">
            <div className="grid gap-2">
              {COMMUNITY_LIST.map((c) => (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition ${
                    communityId === c.id
                      ? "border-[var(--ink)] bg-[var(--paper)]"
                      : "border-[var(--line)] bg-[var(--paper)]/50 hover:border-[var(--line-strong)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="community"
                    className="mt-1"
                    checked={communityId === c.id}
                    onChange={() => setCommunityId(c.id)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-[var(--ink)]">
                      {c.name}
                    </span>
                    <span className="block text-xs text-[var(--mute)]">
                      {c.tone}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              disabled={!ready || loading}
              onClick={() => generate(false)}
              className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition enabled:hover:bg-[var(--ink-soft)] disabled:opacity-40"
            >
              {loading ? "Drafting…" : "Draft with Tact"}
            </button>
            <button
              type="button"
              disabled={!ready || loading}
              onClick={() => generate(true)}
              className="rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-sm text-[var(--mute)] transition hover:text-[var(--ink)] disabled:opacity-40"
            >
              Demo drafts only
            </button>
            {result && (
              <button
                type="button"
                disabled={!ready || loading}
                onClick={() => generate(false)}
                className="rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-sm text-[var(--mute)] transition hover:text-[var(--ink)] disabled:opacity-40"
              >
                Regenerate
              </button>
            )}
          </div>
          {error && (
            <p className="text-sm text-[var(--bad)]" role="alert">
              {error}
            </p>
          )}
        </div>

        {history.length > 0 && (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-[var(--ink)]">
                Recent on this device
              </h2>
              <button
                type="button"
                onClick={() => {
                  clearHistory();
                  setHistory([]);
                }}
                className="text-xs text-[var(--mute)] transition hover:text-[var(--ink)]"
              >
                Clear
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => restoreHistory(item)}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-left transition hover:border-[var(--line-strong)]"
                  >
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-[var(--ink)]">
                        {item.appName}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-[var(--mute)]">
                        {item.softRiskLevel} · {item.softRiskScore}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-[var(--mute)]">
                      {item.softTitle || item.softBody.slice(0, 80)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-5">
        {!result && (
          <div className="flex min-h-[420px] flex-col justify-between rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--paper-2)]/60 p-8">
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
                Side-by-side output
              </p>
              <p className="mt-2 max-w-sm text-sm text-[var(--mute)]">
                Spam posture on the left. Soft post on the right. Risk score
                from rules, not vibes.
              </p>
            </div>
            <ol className="space-y-3 text-sm text-[var(--mute)]">
              <li>1. Load the sample or paste your app facts</li>
              <li>2. Pick the room you will actually post in</li>
              <li>3. Copy the soft draft, edit one lived detail, post</li>
            </ol>
          </div>
        )}

        {result && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--mute)]">
                Mode · {result.mode}
                {result.model ? ` · ${result.model}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copySoft}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {copied === "soft" ? "Copied soft draft" : "Copy soft draft"}
                </button>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-sm text-[var(--mute)] transition hover:text-[var(--ink)]"
                >
                  {copied === "md" ? "Copied markdown" : "Copy markdown"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <DraftCard
                kind="spam"
                title={result.spamDraft.title}
                body={result.spamDraft.body}
                risk={result.spamRisk}
              />
              <DraftCard
                kind="soft"
                title={result.softDraft.title}
                body={result.softDraft.body}
                risk={result.softRisk}
              />
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-5">
              <h2 className="text-sm font-medium text-[var(--ink)]">
                Soft draft findings
              </h2>
              <div className="mt-3">
                <RiskList report={result.softRisk} />
              </div>
              <h2 className="mt-6 text-sm font-medium text-[var(--ink)]">
                Tips for this room
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--mute)]">
                {result.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--mute)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function DraftCard({
  kind,
  title,
  body,
  risk,
}: {
  kind: "spam" | "soft";
  title?: string;
  body: string;
  risk: PitchResult["softRisk"];
}) {
  return (
    <article
      className={`flex flex-col rounded-2xl border p-5 ${
        kind === "spam"
          ? "border-[var(--bad)]/25 bg-[var(--bad-bg)]/40"
          : "border-[var(--ok)]/25 bg-[var(--ok-bg)]/35"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
          {kind === "spam" ? "Spam posture" : "Soft draft"}
        </h3>
      </div>
      <RiskBadge report={risk} />
      {title && (
        <h4 className="mt-4 font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--ink)]">
          {title}
        </h4>
      )}
      <pre className="mt-3 flex-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--ink-soft)]">
        {body}
      </pre>
    </article>
  );
}
