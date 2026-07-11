"use client";

import { useTheme } from "./theme-provider";

const LABELS = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { preference, resolved, cycle } = useTheme();
  const label =
    preference === "system"
      ? `System (${resolved})`
      : LABELS[preference];

  return (
    <button
      type="button"
      onClick={cycle}
      className={`rounded-full border border-[var(--line-strong)] bg-[var(--paper-2)] px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] ${className}`}
      aria-label={`Theme: ${label}. Click to change.`}
      title="Cycle light / dark / system"
    >
      {preference === "light" && "Light"}
      {preference === "dark" && "Dark"}
      {preference === "system" && "System"}
    </button>
  );
}
