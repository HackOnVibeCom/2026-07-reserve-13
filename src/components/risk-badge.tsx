import type { RiskLevel, RiskReport } from "@/lib/types";

const STYLES: Record<RiskLevel, string> = {
  low: "bg-[var(--ok-bg)] text-[var(--ok)] ring-[var(--ok)]/20",
  medium: "bg-[var(--warn-bg)] text-[var(--warn)] ring-[var(--warn)]/20",
  high: "bg-[var(--bad-bg)] text-[var(--bad)] ring-[var(--bad)]/20",
};

export function RiskBadge({ report }: { report: RiskReport }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ring-1 ring-inset ${STYLES[report.level]}`}
      >
        {report.level} risk · {report.score}
      </span>
      <span className="text-sm text-[var(--mute)]">{report.summary}</span>
    </div>
  );
}

export function RiskList({ report }: { report: RiskReport }) {
  if (!report.findings.length) {
    return (
      <p className="text-sm text-[var(--mute)]">
        No spam patterns flagged by the rules engine.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {report.findings.map((f) => (
        <li
          key={f.id}
          className="border-l-2 border-[var(--line-strong)] pl-3 text-sm"
        >
          <div className="font-medium text-[var(--ink)]">{f.label}</div>
          <div className="text-[var(--mute)]">{f.detail}</div>
        </li>
      ))}
    </ul>
  );
}
