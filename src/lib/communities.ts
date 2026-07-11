import type { Community, CommunityId } from "./types";

export const COMMUNITIES: Record<CommunityId, Community> = {
  sideproject: {
    id: "sideproject",
    name: "r/SideProject",
    venue: "Reddit",
    tone: "Builders sharing work-in-progress. Curious, not salesy.",
    rules: [
      "Lead with the problem you hit, not the download link",
      "Share what you built and one concrete lesson",
      "One soft ask at most; link only after context",
      "No ALL-CAPS launch hype or emoji walls",
    ],
    titleHint: "I built X after struggling with Y - feedback welcome",
    maxWords: 220,
  },
  iosprogramming: {
    id: "iosprogramming",
    name: "r/iOSProgramming",
    venue: "Reddit",
    tone: "Practitioners. Technical honesty beats marketing copy.",
    rules: [
      "Mention stack, platform, and what is actually shipping",
      "Ask a specific technical or product question",
      "Avoid pure growth / ASO flex posts",
      "Store link only after substance",
    ],
    titleHint: "Shipped my first iOS app - curious how you handle X",
    maxWords: 200,
  },
  indiehackers: {
    id: "indiehackers",
    name: "Indie Hackers",
    venue: "Forum",
    tone: "Builders trading numbers, distribution, and process.",
    rules: [
      "State who it is for and the distribution experiment",
      "Be honest about stage (just launched, N users, etc.)",
      "Ask for a concrete kind of feedback",
      "No fake traction or hype metrics",
    ],
    titleHint: "Just launched: promoting a mobile app without paid UA",
    maxWords: 260,
  },
  androiddev: {
    id: "androiddev",
    name: "r/androiddev",
    venue: "Reddit",
    tone: "Dev-first. Show craft; soft-sell is tolerated only with substance.",
    rules: [
      "Talk about architecture, Play Console reality, or a real shipping pain",
      "No pure marketing blasts",
      "Invite critique on a concrete choice",
      "Link after the technical meat",
    ],
    titleHint: "Launched on Play - tradeoffs I made on X",
    maxWords: 200,
  },
  producthunt: {
    id: "producthunt",
    name: "Product Hunt maker comment",
    venue: "Product Hunt",
    tone: "Maker note under your own launch: human, specific, grateful, not a second sales page.",
    rules: [
      "Write as the maker, first person",
      "Explain who it is for and the problem in plain language",
      "Invite a concrete try or critique, not pure hype",
      "One link max; no emoji walls or fake social proof",
    ],
    titleHint: "(optional heading) Why I built this",
    maxWords: 160,
  },
  xtwitter: {
    id: "xtwitter",
    name: "X / Twitter",
    venue: "X",
    tone: "Short founder post. Specific problem, one wedge, soft CTA. No thread of ads.",
    rules: [
      "Keep it under ~240 characters of substance when possible",
      "Lead with problem or insight, not Download now",
      "At most one link",
      "No engagement-bait ALL CAPS or emoji spam",
    ],
    titleHint: "(no title; body is the post)",
    maxWords: 55,
  },
};

export const COMMUNITY_LIST = Object.values(COMMUNITIES);

export function getCommunity(id: CommunityId): Community {
  return COMMUNITIES[id];
}
