"use client";

import { useTheme } from "./theme-provider";

const LABELS = {
  light: "Light",
  dark: "Dark",
  system: "System",
} as const;

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.4 15.3A8.5 8.5 0 0 1 8.7 3.6 8.5 8.5 0 1 0 20.4 15.3Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { preference, resolved, cycle } = useTheme();
  const label = preference === "system" ? `System (${resolved})` : LABELS[preference];

  return (
    <button
      type="button"
      onClick={cycle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--paper-2)] text-[var(--ink-soft)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] [&>svg]:h-4 [&>svg]:w-4 ${className}`}
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Theme: ${label}. Click for next mode.`}
    >
      {preference === "light" && <SunIcon />}
      {preference === "dark" && <MoonIcon />}
      {preference === "system" && <SystemIcon />}
    </button>
  );
}
