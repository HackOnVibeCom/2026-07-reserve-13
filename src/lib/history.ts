import type { CommunityId, PitchResult, AppProfile } from "./types";

const KEY = "tact-history-v1";
const MAX = 8;

export type HistoryItem = {
  id: string;
  savedAt: string;
  communityId: CommunityId;
  appName: string;
  softTitle?: string;
  softBody: string;
  softRiskLevel: PitchResult["softRisk"]["level"];
  softRiskScore: number;
  mode: PitchResult["mode"];
};

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function pushHistory(
  profile: AppProfile,
  result: PitchResult,
): HistoryItem[] {
  const item: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    communityId: result.communityId,
    appName: profile.name,
    softTitle: result.softDraft.title,
    softBody: result.softDraft.body,
    softRiskLevel: result.softRisk.level,
    softRiskScore: result.softRisk.score,
    mode: result.mode,
  };
  const next = [item, ...loadHistory().filter((h) => h.id !== item.id)].slice(
    0,
    MAX,
  );
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota
  }
  return next;
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function formatSoftMarkdown(result: PitchResult): string {
  const title = result.softDraft.title?.trim();
  const body = result.softDraft.body.trim();
  if (title) return `# ${title}\n\n${body}\n`;
  return `${body}\n`;
}
