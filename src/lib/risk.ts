import type { Community, RiskFinding, RiskLevel, RiskReport } from "./types";

const HARD_SELL =
  /\b(download now|install now|get it free|limited time|don't miss|game.?changer|revolutionary|best app ever|life.?changing)\b/i;
const STORE_PUSH =
  /\b(download (my|the) app|app store|play store|testflight|link in (bio|comments))\b/i;
const PURE_CTA_OPEN =
  /^(hey (guys|everyone|folks)!?\s*)?(i (just )?(launched|released|built) .{0,40}(app|product))/i;
const EMOJI_RUN = /(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*){4,}/u;
const ALL_CAPS_LINE = /^[A-Z0-9\s!?.\-]{16,}$/m;
const URL_RE = /https?:\/\/\S+/gi;
const PROBLEM_HINT =
  /\b(problem|struggle|pain|annoying|hard to|couldn't|kept|every time|frustrated|wasted|manual)\b/i;
const ASK_HINT =
  /\b(feedback|curious|how (do|would|are) you|what do you|roast|thoughts|anyone else|looking for)\b/i;

function levelFromScore(score: number): RiskLevel {
  if (score >= 50) return "high";
  if (score >= 28) return "medium";
  return "low";
}

export function scoreDraft(
  title: string | undefined,
  body: string,
  community: Community,
): RiskReport {
  const findings: RiskFinding[] = [];
  let score = 0;
  const text = `${title ?? ""}\n${body}`.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const firstLine = (title?.trim() || body.trim().split("\n")[0] || "").trim();

  if (HARD_SELL.test(text)) {
    score += 28;
    findings.push({
      id: "hard-sell",
      severity: "high",
      label: "Hard-sell language",
      detail: "Phrases like “download now” or “game-changer” read as ads.",
    });
  }

  if (
    STORE_PUSH.test(firstLine) ||
    /https?:\/\//i.test(firstLine) ||
    /\bdownload now\b/i.test(firstLine)
  ) {
    score += 24;
    findings.push({
      id: "cta-first",
      severity: "high",
      label: "CTA or link first",
      detail: "Opening with the store link or install ask is classic spam posture.",
    });
  }

  if (PURE_CTA_OPEN.test(firstLine) && !PROBLEM_HINT.test(text.slice(0, 280))) {
    score += 16;
    findings.push({
      id: "launch-flex",
      severity: "medium",
      label: "Launch-flex open",
      detail: "Leads with “I launched” without a human problem. Communities bounce.",
    });
  }

  const urls = text.match(URL_RE) ?? [];
  if (urls.length >= 2) {
    score += 18;
    findings.push({
      id: "link-stack",
      severity: "high",
      label: "Multiple links",
      detail: "More than one URL looks promotional. Keep a single soft link late.",
    });
  } else if (urls.length === 1) {
    const idx = text.search(URL_RE);
    const before = text.slice(0, idx);
    if (before.split(/\s+/).length < 40) {
      score += 12;
      findings.push({
        id: "link-early",
        severity: "medium",
        label: "Link appears early",
        detail: "Put substance first; park the URL after the story or ask.",
      });
    }
  }

  if (EMOJI_RUN.test(text)) {
    score += 14;
    findings.push({
      id: "emoji-wall",
      severity: "medium",
      label: "Emoji wall",
      detail: "Dense emoji runs signal marketing, not a founder note.",
    });
  }

  if (ALL_CAPS_LINE.test(text)) {
    score += 16;
    findings.push({
      id: "shouting",
      severity: "high",
      label: "Shouting line",
      detail: "ALL CAPS lines read as ads or rage-bait.",
    });
  }

  if (words > community.maxWords + 40) {
    score += 12;
    findings.push({
      id: "too-long",
      severity: "medium",
      label: "Over-long for venue",
      detail: `${community.name} usually wants ~${community.maxWords} words. This is ${words}.`,
    });
  }

  if (!PROBLEM_HINT.test(text)) {
    score += 14;
    findings.push({
      id: "no-problem",
      severity: "medium",
      label: "No lived problem",
      detail: "Soft pitches open with a real friction people recognize.",
    });
  }

  if (!ASK_HINT.test(text)) {
    score += 10;
    findings.push({
      id: "no-ask",
      severity: "medium",
      label: "No specific ask",
      detail: "Invite a concrete reply (feedback on X, how others handle Y).",
    });
  }

  if (
    community.id === "iosprogramming" ||
    community.id === "androiddev"
  ) {
    const tech =
      /\b(swift|swiftui|kotlin|compose|uikit|jetpack|play console|testflight|xcode|gradle|api|offline|onboarding)\b/i;
    if (!tech.test(text)) {
      score += 12;
      findings.push({
        id: "no-craft",
        severity: "medium",
        label: "Missing craft detail",
        detail: "Dev communities expect one technical or shipping detail.",
      });
    }
  }

  score = Math.min(100, score);
  const level = levelFromScore(score);

  const summary =
    level === "low"
      ? "Reads like a founder sharing work - low spam posture."
      : level === "medium"
        ? "Usable, but a few patterns still lean promotional."
        : "High chance of ignores, downvotes, or mod removal.";

  return { level, score, findings, summary };
}

export function spamTemplate(profile: {
  name: string;
  oneLiner: string;
  storeUrl?: string;
}): { title: string; body: string } {
  const link = profile.storeUrl?.trim() || "https://apps.example.com/you";
  return {
    title: `DOWNLOAD NOW: ${profile.name.toUpperCase()} IS LIVE!!!`,
    body: [
      `Download now: ${link}`,
      ``,
      `Hey guys!!! I just launched ${profile.name} 🔥🔥🔥🔥`,
      ``,
      `${profile.oneLiner}`,
      ``,
      `It is a GAME CHANGER. Don't miss out - limited time!`,
      `Also: ${link}`,
      ``,
      `Please download and leave a 5-star review 🙏🙏🙏`,
    ].join("\n"),
  };
}
