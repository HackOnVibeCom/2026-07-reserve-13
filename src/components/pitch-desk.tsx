"use client";

import { useMemo, useState } from "react";
import { COMMUNITY_LIST, getCommunity } from "@/lib/communities";
import { PROOFLET_PROFILE, SAMPLE_PROFILE } from "@/lib/demo";
import {
  canUseLive,
  consumeLive,
  FREE_LIVE_LIMIT,
  getLiveRemaining,
} from "@/lib/free-tier";
import {
  clearHistory,
  formatSoftMarkdown,
  loadHistory,
  pushHistory,
  type HistoryItem,
} from "@/lib/history";
import { scoreDraft } from "@/lib/risk";
import { pitchToSharePayload, shareUrl } from "@/lib/share";
import type {
  AppProfile,
  CommunityId,
  PitchResult,
} from "@/lib/types";
import { RiskBadge, RiskList } from "./risk-badge";
import { RiskCompare } from "./risk-meter";
import {
  IconCheck,
  IconCopy,
  IconMarkdown,
  IconShare,
} from "./action-icons";

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
  const [copied, setCopied] = useState<"soft" | "md" | "share" | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());
  const [restoredOnly, setRestoredOnly] = useState(false);
  const [liveLeft, setLiveLeft] = useState(() => getLiveRemaining());
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [meterKey, setMeterKey] = useState(0);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const ready = useMemo(() => {
    return Boolean(
      profile.name.trim() &&
        profile.oneLiner.trim() &&
        profile.problem.trim() &&
        profile.whoFor.trim() &&
        profile.differentiator.trim(),
    );
  }, [profile]);

  function setField<K extends keyof AppProfile>(key: K, value: AppProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function applyResult(pitch: PitchResult) {
    setResult(pitch);
    setEditTitle(pitch.softDraft.title || "");
    setEditBody(pitch.softDraft.body);
    setMeterKey((k) => k + 1);
    setShareLink(
      shareUrl(pitchToSharePayload(profile.name, pitch, profile.oneLiner)),
    );
  }

  async function generate(forceDemo = false) {
    setLoading(true);
    setError(null);
    setRestoredOnly(false);

    let useDemo = forceDemo;
    if (!forceDemo && !canUseLive()) {
      useDemo = true;
      setError(
        `Free live drafts used up (${FREE_LIVE_LIMIT}). Running demo drafts (unlimited).`,
      );
    }

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
          forceDemo: useDemo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      const pitch = data as PitchResult;
      if (!useDemo && pitch.mode === "live") {
        setLiveLeft(consumeLive());
      }
      applyResult(pitch);
      setHistory(pushHistory(profile, pitch));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function rescoreSoft() {
    if (!result) return;
    const community = getCommunity(result.communityId);
    const softRisk = scoreDraft(
      editTitle.trim() || undefined,
      editBody,
      community,
    );
    const next: PitchResult = {
      ...result,
      softDraft: {
        title: editTitle.trim() || undefined,
        body: editBody,
      },
      softRisk,
    };
    setResult(next);
    setMeterKey((k) => k + 1);
    setShareLink(
      shareUrl(pitchToSharePayload(profile.name, next, profile.oneLiner)),
    );
    setHistory(pushHistory(profile, next));
  }

  async function copyText(kind: "soft" | "md" | "share", text: string) {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopyError("Clipboard blocked. Select the text and copy manually.");
    }
  }

  async function copySoft() {
    if (!result) return;
    const text = [editTitle || result.softDraft.title, editBody || result.softDraft.body]
      .filter(Boolean)
      .join("\n\n");
    await copyText("soft", text);
  }

  async function copyMarkdown() {
    if (!result) return;
    const temp: PitchResult = {
      ...result,
      softDraft: {
        title: editTitle.trim() || undefined,
        body: editBody,
      },
    };
    await copyText("md", formatSoftMarkdown(temp));
  }

  async function copyShare() {
    if (!shareLink) return;
    await copyText("share", shareLink);
  }

  function restoreHistory(item: HistoryItem) {
    setProfile({
      ...item.profile,
      storeUrl: item.profile.storeUrl || "",
    });
    setCommunityId(item.communityId);
    setRestoredOnly(true);
    const restored: PitchResult = {
      communityId: item.communityId,
      spamDraft: {
        title: "Not stored in history",
        body: "History keeps the soft draft. Hit Regenerate for a full spam contrast.",
      },
      softDraft: {
        title: item.softTitle,
        body: item.softBody,
      },
      spamRisk: {
        level: "medium",
        score: 0,
        findings: [],
        summary: "Spam contrast not stored. Regenerate for a full pair.",
      },
      softRisk: {
        level: item.softRiskLevel,
        score: item.softRiskScore,
        findings: [],
        summary: "Restored from local history on this device.",
      },
      tips: ["History is stored only in this browser."],
      mode: item.mode,
    };
    applyResult(restored);
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
            Soft community posts for a newly launched product, with a live
            risk engine and before/after meters.
          </p>
          <p className="mt-2 text-xs text-[var(--mute)]">
            Free live drafts left:{" "}
            <span className="font-medium text-[var(--ink)]">
              {liveLeft}/{FREE_LIVE_LIMIT}
            </span>
            {" · "}
            Demo drafts unlimited
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setProfile(SAMPLE_PROFILE)}
            className="rounded-full border border-[var(--line-strong)] bg-[var(--paper-2)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:bg-[var(--paper-3)]"
          >
            Sample: Focusrail
          </button>
          <button
            type="button"
            onClick={() => setProfile(PROOFLET_PROFILE)}
            className="rounded-full border border-[var(--line-strong)] bg-[var(--paper-2)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:bg-[var(--paper-3)]"
          >
            Sample: Prooflet
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-5 shadow-[0_1px_0_rgba(20,16,12,0.04)]">
          <Field label="App / product name">
            <input
              className="field"
              value={profile.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Prooflet"
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
              placeholder="Agent operators, indie iOS devs…"
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
            <Field label="URL (optional)">
              <input
                className="field"
                value={profile.storeUrl || ""}
                onChange={(e) => setField("storeUrl", e.target.value)}
                placeholder="https://"
              />
            </Field>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--mute)]">
              Community
            </span>
            <div className="grid gap-2" role="radiogroup" aria-label="Community">
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
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              disabled={!ready || loading}
              onClick={() => generate(false)}
              className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition enabled:hover:bg-[var(--ink-soft)] disabled:opacity-40"
            >
              {loading
                ? "Drafting…"
                : liveLeft > 0
                  ? "Draft with Tact (live)"
                  : "Draft (demo; live used up)"}
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
                Soft draft next to the spam version. Edit, re-score, share.
              </p>
            </div>
            <ol className="space-y-3 text-sm text-[var(--mute)]">
              <li>1. Load a sample or paste your product</li>
              <li>2. Pick the room</li>
              <li>3. Draft, edit, re-score</li>
            </ol>
          </div>
        )}

        {result && (
          <>
            <RiskCompare
              before={result.spamRisk}
              after={result.softRisk}
              animateKey={meterKey}
            />

            <div className="flex flex-wrap items-center justify-end gap-2">
              <IconBtn
                label={copied === "soft" ? "Copied" : "Copy soft draft"}
                onClick={copySoft}
                primary
                done={copied === "soft"}
              >
                {copied === "soft" ? <IconCheck /> : <IconCopy />}
              </IconBtn>
              <IconBtn
                label={copied === "md" ? "Copied" : "Copy markdown"}
                onClick={copyMarkdown}
                done={copied === "md"}
              >
                {copied === "md" ? <IconCheck /> : <IconMarkdown />}
              </IconBtn>
              {shareLink && (
                <IconBtn
                  label={copied === "share" ? "Copied" : "Share link"}
                  onClick={copyShare}
                  done={copied === "share"}
                >
                  {copied === "share" ? <IconCheck /> : <IconShare />}
                </IconBtn>
              )}
            </div>
            {copyError && (
              <p className="text-sm text-[var(--bad)]" role="alert">
                {copyError}
              </p>
            )}

            <div className="grid gap-4 xl:grid-cols-2">
              {!restoredOnly && (
                <DraftCard
                  kind="spam"
                  title={result.spamDraft.title}
                  body={result.spamDraft.body}
                  risk={result.spamRisk}
                />
              )}
              <article className="flex flex-col rounded-2xl border border-[var(--ok)]/25 bg-[var(--ok-bg)]/35 p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                    Soft draft
                  </h3>
                </div>
                <RiskBadge report={result.softRisk} />
                {communityId !== "xtwitter" && (
                  <input
                    className="field mt-4 font-[family-name:var(--font-display)] text-lg"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />
                )}
                <textarea
                  className="field mt-3 min-h-[200px] flex-1 font-sans text-sm leading-relaxed"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <button
                  type="button"
                  onClick={rescoreSoft}
                  className="mt-3 self-start rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--paper)]"
                >
                  Re-score risk
                </button>
              </article>
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

function IconBtn({
  label,
  onClick,
  children,
  primary = false,
  done = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
  done?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
        primary
          ? "bg-[var(--accent)] text-white hover:opacity-90"
          : "border border-[var(--line-strong)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
      } ${done ? "ring-2 ring-[var(--ok)]/40" : ""}`}
    >
      {children}
    </button>
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
