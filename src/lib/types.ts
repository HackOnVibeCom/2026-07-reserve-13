export type RiskLevel = "low" | "medium" | "high";

export type CommunityId =
  | "sideproject"
  | "iosprogramming"
  | "indiehackers"
  | "androiddev"
  | "producthunt"
  | "xtwitter";

export interface AppProfile {
  name: string;
  oneLiner: string;
  problem: string;
  whoFor: string;
  platform: "ios" | "android" | "both" | "web";
  daysLive: number;
  differentiator: string;
  storeUrl?: string;
}

export interface Community {
  id: CommunityId;
  name: string;
  venue: string;
  tone: string;
  rules: string[];
  titleHint: string;
  maxWords: number;
}

export interface RiskFinding {
  id: string;
  severity: RiskLevel;
  label: string;
  detail: string;
}

export interface RiskReport {
  level: RiskLevel;
  score: number; // 0-100, higher = riskier
  findings: RiskFinding[];
  summary: string;
}

export interface PitchResult {
  communityId: CommunityId;
  spamDraft: {
    title?: string;
    body: string;
  };
  softDraft: {
    title?: string;
    body: string;
  };
  spamRisk: RiskReport;
  softRisk: RiskReport;
  tips: string[];
  mode: "live" | "demo";
  model?: string;
}

export interface PitchRequest {
  profile: AppProfile;
  communityId: CommunityId;
  forceDemo?: boolean;
}

/** Compact payload for shareable links (no secrets). */
export interface SharePayload {
  v: 1;
  appName: string;
  communityId: CommunityId;
  softTitle?: string;
  softBody: string;
  softLevel: RiskLevel;
  softScore: number;
  spamLevel: RiskLevel;
  spamScore: number;
  mode: "live" | "demo";
  oneLiner?: string;
}
