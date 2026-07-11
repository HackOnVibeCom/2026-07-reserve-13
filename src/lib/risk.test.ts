import { describe, expect, it } from "vitest";
import { getCommunity } from "./communities";
import { scoreDraft, spamTemplate } from "./risk";
import { buildDemoPitch, SAMPLE_PROFILE } from "./demo";
import { formatSoftMarkdown } from "./history";

describe("scoreDraft", () => {
  const community = getCommunity("sideproject");

  it("flags hard-sell spam as high risk", () => {
    const spam = spamTemplate(SAMPLE_PROFILE);
    const report = scoreDraft(spam.title, spam.body, community);
    expect(report.level).toBe("high");
    expect(report.score).toBeGreaterThanOrEqual(50);
    expect(report.findings.some((f) => f.id === "hard-sell")).toBe(true);
  });

  it("scores a careful soft draft as low risk", () => {
    const title = "I built Focusrail after losing afternoons between client calls";
    const body = [
      "I kept struggling with doomscrolling after every Zoom.",
      "So I shipped a small focus timer for solo freelancers.",
      "Curious how you handle first-week posts without sounding like an ad?",
      "Feedback welcome on whether the problem sounds real.",
    ].join("\n");
    const report = scoreDraft(title, body, community);
    expect(report.level).toBe("low");
    expect(report.score).toBeLessThan(28);
  });

  it("flags CTA or link first", () => {
    const report = scoreDraft(
      "Download my app now",
      "Please install https://apps.example.com/x right away",
      community,
    );
    expect(report.findings.some((f) => f.id === "cta-first")).toBe(true);
  });
});

describe("demo pitch", () => {
  it("returns dual drafts with scores", () => {
    const pitch = buildDemoPitch(SAMPLE_PROFILE, "sideproject");
    expect(pitch.mode).toBe("demo");
    expect(pitch.spamRisk.level).toBe("high");
    expect(pitch.softRisk.level).toBe("low");
    expect(pitch.softDraft.body.length).toBeGreaterThan(40);
  });
});

describe("formatSoftMarkdown", () => {
  it("includes title heading when present", () => {
    const pitch = buildDemoPitch(SAMPLE_PROFILE, "indiehackers");
    const md = formatSoftMarkdown(pitch);
    expect(md.startsWith("# ")).toBe(true);
    expect(md).toContain(pitch.softDraft.body.slice(0, 20));
  });
});
