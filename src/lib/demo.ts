import type { AppProfile, CommunityId, PitchResult } from "./types";
import { getCommunity } from "./communities";
import { scoreDraft, spamTemplate } from "./risk";

const DEMO_SOFT: Record<
  CommunityId,
  (p: AppProfile) => { title?: string; body: string }
> = {
  sideproject: (p) => ({
    title: `I built ${p.name} after I ${stripLeadingI(p.problem).slice(0, 68).replace(/\.$/, "")}`,
    body: [
      `For the last few months I kept hitting the same thing: ${p.problem}`,
      ``,
      `So I shipped ${p.name} — ${p.oneLiner}`,
      ``,
      `Who it's for: ${p.whoFor}.`,
      `What I think is different: ${p.differentiator}.`,
      ``,
      `It went live about ${p.daysLive} day${p.daysLive === 1 ? "" : "s"} ago on ${platformLabel(p.platform)}.`,
      ``,
      `I'm not trying to spam the sub — honestly looking for blunt feedback:`,
      `1) Does the problem sound real to you?`,
      `2) What would make a first-week post like this useful vs annoying?`,
      ``,
      p.storeUrl
        ? `If you want to poke at it: ${p.storeUrl}`
        : `Happy to share a link if anyone wants to try it.`,
    ].join("\n"),
  }),
  iosprogramming: (p) => ({
    title: `Shipped ${p.name} on iOS — how do you handle first-week community posts?`,
    body: [
      `Just put ${p.name} live (${p.daysLive}d). ${p.oneLiner}`,
      ``,
      `Origin: ${p.problem}`,
      ``,
      `Built for ${p.whoFor}. Differentiation I'm betting on: ${p.differentiator}.`,
      ``,
      `Curious from people who've shipped: when you post about a new app here, what actually gets useful replies vs gets ignored? Trying to avoid the pure “download my app” energy.`,
      ``,
      p.storeUrl
        ? `Store: ${p.storeUrl}`
        : `Can drop TestFlight/App Store link if useful.`,
    ].join("\n"),
  }),
  indiehackers: (p) => ({
    title: `Day ${p.daysLive}: promoting ${p.name} without paid UA`,
    body: [
      `Launched ${p.name} ${p.daysLive} day${p.daysLive === 1 ? "" : "s"} ago.`,
      `${p.oneLiner}`,
      ``,
      `Problem I was solving for myself / users: ${p.problem}`,
      `Audience: ${p.whoFor}`,
      `Wedge: ${p.differentiator}`,
      ``,
      `Distribution experiment this week: write community posts that read like a founder note, not an ad — and measure replies, not vanity views.`,
      ``,
      `What I'd love feedback on: which channels actually work for a brand-new mobile app when you have $0 UA budget?`,
      p.storeUrl ? `\nLink: ${p.storeUrl}` : "",
    ].join("\n"),
  }),
  androiddev: (p) => ({
    title: `Launched ${p.name} on Play — tradeoffs + anti-spam promo question`,
    body: [
      `${p.name} has been on Play for ~${p.daysLive} day${p.daysLive === 1 ? "" : "s"}. ${p.oneLiner}`,
      ``,
      `Motivation: ${p.problem}`,
      `For: ${p.whoFor}. Bet: ${p.differentiator}.`,
      ``,
      `Not a growth-hack post — curious how other Android indies announce a launch without getting roasted. Do you lead with architecture choices, Play Console lessons, or user problem?`,
      ``,
      p.storeUrl
        ? `Play link if anyone wants to look: ${p.storeUrl}`
        : `Can share the listing if useful.`,
    ].join("\n"),
  }),
};

function platformLabel(p: AppProfile["platform"]): string {
  if (p === "ios") return "the App Store";
  if (p === "android") return "Google Play";
  if (p === "both") return "iOS + Android";
  return "web / installable";
}

function stripLeadingI(text: string): string {
  return text.trim().replace(/^i\s+/i, "");
}

export const SAMPLE_PROFILE: AppProfile = {
  name: "Focusrail",
  oneLiner:
    "A focus timer that blocks the distracting apps you actually open between client calls — not a generic pomodoro skin.",
  problem:
    "every freelancing afternoon I told myself “one more scroll” between Zoom calls and lost 40 minutes",
  whoFor: "solo freelancers and consultants who work from their phone calendar",
  platform: "ios",
  daysLive: 4,
  differentiator:
    "blocklists are per-context (client day vs deep work) and it never guilt-trips you with streak shame",
  storeUrl: "https://apps.apple.com/app/focusrail-demo",
};

export function buildDemoPitch(
  profile: AppProfile,
  communityId: CommunityId,
): PitchResult {
  const community = getCommunity(communityId);
  const spam = spamTemplate(profile);
  const soft = DEMO_SOFT[communityId](profile);
  return {
    communityId,
    spamDraft: spam,
    softDraft: soft,
    spamRisk: scoreDraft(spam.title, spam.body, community),
    softRisk: scoreDraft(soft.title, soft.body, community),
    tips: [
      `Match ${community.name}: ${community.rules[0]}`,
      "Put one lived detail only you would know — generic AI polish gets ignored.",
      "One link max, after the ask.",
      "Reply to every comment in the first hour; that is part of the pitch.",
    ],
    mode: "demo",
  };
}
