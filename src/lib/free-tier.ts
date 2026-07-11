const KEY = "tact-live-used-v1";
export const FREE_LIVE_LIMIT = 3;

export function getLiveUsed(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(window.localStorage.getItem(KEY) || "0");
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export function getLiveRemaining(): number {
  return Math.max(0, FREE_LIVE_LIMIT - getLiveUsed());
}

export function canUseLive(): boolean {
  return getLiveRemaining() > 0;
}

export function consumeLive(): number {
  const next = getLiveUsed() + 1;
  try {
    window.localStorage.setItem(KEY, String(next));
  } catch {
    // ignore
  }
  return Math.max(0, FREE_LIVE_LIMIT - next);
}

export function resetLiveQuotaForTests(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
