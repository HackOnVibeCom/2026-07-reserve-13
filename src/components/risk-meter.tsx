"use client";

import type { RiskLevel, RiskReport } from "@/lib/types";

const LEVEL_COLOR: Record<RiskLevel, string> = {
  low: "var(--ok)",
  medium: "var(--warn)",
  high: "var(--bad)",
};

export function RiskMeter({
  label,
  report,
  animateKey,
}: {
  label: string;
  report: RiskReport;
  animateKey?: string | number;
}) {
  const width = Math.max(2, Math.min(100, report.score));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium uppercase tracking-[0.12em] text-[var(--mute)]">
          {label}
        </span>
        <span className="font-medium text-[var(--ink)]">
          {report.level} · {report.score}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--paper-3)] ring-1 ring-[var(--line)]">
        <div
          key={animateKey ?? report.score}
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${width}%`,
            background: LEVEL_COLOR[report.level],
          }}
        />
      </div>
    </div>
  );
}

export function RiskCompare({
  before,
  after,
  animateKey,
}: {
  before: RiskReport;
  after: RiskReport;
  animateKey?: string | number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)] p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--mute)]">
        Risk before → after
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <RiskMeter label="Spam posture" report={before} animateKey={animateKey} />
        <RiskMeter label="Soft draft" report={after} animateKey={animateKey} />
      </div>
      <p className="mt-3 text-xs text-[var(--mute)]">
        Higher score = more spam posture. Soft should land lower when the room
        norms hold.
      </p>
    </div>
  );
}
