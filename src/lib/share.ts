import type { PitchResult, SharePayload } from "./types";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function pitchToSharePayload(
  appName: string,
  result: PitchResult,
  oneLiner?: string,
): SharePayload {
  return {
    v: 1,
    appName,
    communityId: result.communityId,
    softTitle: result.softDraft.title,
    softBody: result.softDraft.body.slice(0, 2500),
    softLevel: result.softRisk.level,
    softScore: result.softRisk.score,
    spamLevel: result.spamRisk.level,
    spamScore: result.spamRisk.score,
    mode: result.mode,
    oneLiner: oneLiner?.slice(0, 200),
  };
}

export function encodeSharePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  if (typeof TextEncoder !== "undefined") {
    return toBase64Url(new TextEncoder().encode(json));
  }
  // node fallback
  return Buffer.from(json, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodeSharePayload(raw: string): SharePayload | null {
  try {
    const text =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder().decode(fromBase64Url(raw))
        : Buffer.from(
            raw.replace(/-/g, "+").replace(/_/g, "/") +
              "=".repeat((4 - (raw.length % 4)) % 4),
            "base64",
          ).toString("utf8");
    const data = JSON.parse(text) as SharePayload;
    if (data?.v !== 1 || !data.softBody || !data.appName) return null;
    return data;
  } catch {
    return null;
  }
}

export function shareUrl(payload: SharePayload, origin?: string): string {
  const d = encodeSharePayload(payload);
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "https://tact-liard.vercel.app");
  return `${base}/p?d=${d}`;
}
