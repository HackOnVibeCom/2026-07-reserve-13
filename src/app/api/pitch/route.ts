import { NextResponse } from "next/server";
import { getCommunity, COMMUNITIES } from "@/lib/communities";
import { buildDemoPitch } from "@/lib/demo";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";
import { scoreDraft, spamTemplate } from "@/lib/risk";
import type {
  AppProfile,
  CommunityId,
  PitchRequest,
  PitchResult,
} from "@/lib/types";

export const runtime = "nodejs";

function isCommunityId(v: unknown): v is CommunityId {
  return typeof v === "string" && v in COMMUNITIES;
}

function validateProfile(p: unknown): p is AppProfile {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    o.name.trim().length > 0 &&
    typeof o.oneLiner === "string" &&
    typeof o.problem === "string" &&
    typeof o.whoFor === "string" &&
    typeof o.differentiator === "string" &&
    typeof o.daysLive === "number" &&
    ["ios", "android", "both", "web"].includes(String(o.platform))
  );
}

export async function POST(req: Request) {
  let body: PitchRequest;
  try {
    body = (await req.json()) as PitchRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!validateProfile(body.profile) || !isCommunityId(body.communityId)) {
    return NextResponse.json(
      { error: "Provide a complete app profile and community." },
      { status: 400 },
    );
  }

  const profile: AppProfile = {
    ...body.profile,
    name: body.profile.name.trim(),
    oneLiner: body.profile.oneLiner.trim(),
    problem: body.profile.problem.trim(),
    whoFor: body.profile.whoFor.trim(),
    differentiator: body.profile.differentiator.trim(),
    storeUrl: body.profile.storeUrl?.trim() || undefined,
    daysLive: Math.max(0, Math.min(3650, Number(body.profile.daysLive) || 0)),
  };

  if (body.forceDemo || !process.env.OPENROUTER_API_KEY) {
    const demo = buildDemoPitch(profile, body.communityId);
    return NextResponse.json(demo);
  }

  // Best-effort live-model throttle (per IP, in-memory, resets on cold start).
  const rl = rateLimit({
    key: `live:${clientKeyFromRequest(req)}`,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Live draft limit reached. Try demo drafts, or wait ~${rl.retryAfterSec}s.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      },
    );
  }

  try {
    const live = await generateLive(profile, body.communityId);
    return NextResponse.json(live);
  } catch {
    const demo = buildDemoPitch(profile, body.communityId);
    return NextResponse.json({
      ...demo,
      tips: [
        "Live model unavailable. Showing structured demo drafts so the flow still works.",
        ...demo.tips,
      ],
    } satisfies PitchResult);
  }
}

async function generateLive(
  profile: AppProfile,
  communityId: CommunityId,
): Promise<PitchResult> {
  const community = getCommunity(communityId);
  const model =
    process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini";
  const apiKey = process.env.OPENROUTER_API_KEY!;

  const system = `You write community posts for founders who just shipped a product (mobile or web).
Return ONLY valid JSON with this shape:
{
  "softTitle": string,
  "softBody": string,
  "spamTitle": string,
  "spamBody": string,
  "tips": string[3]
}

Rules for softTitle/softBody (the good draft):
- Match the venue norms exactly.
- Lead with a lived problem or concrete friction, not a download CTA.
- Sound like a real founder: short sentences, specific details from the profile, slightly imperfect.
- Use the product's actual differentiator and problem wording; do not invent fake metrics, users, partners, or awards.
- One optional link only if provided, placed late (end of post).
- Include one concrete ask for feedback.
- Stay under ${community.maxWords} words for the body.
- For X/Twitter: no separate title needed (softTitle can be empty string); keep body tight.
- For Product Hunt: first-person maker note, not a second landing page.

Hard ban list for soft drafts (never use these):
- "I've noticed", "In today's world", "revolutionize/revolutionary", "game changer", "unlock the potential"
- "seamless", "cutting-edge", "excited to announce", "super excited", "don't miss out"
- "Check us out", "Check it out", "sign up today", "jump right in"
- "This is where X comes in", "We created X to solve this" as the whole thesis with no specifics
- Emoji walls, ALL CAPS hype, fake social proof, engagement bait

Prefer: plain verbs, one specific example, honest stage (days live), one clear ask.

Rules for spamTitle/spamBody:
- Intentionally bad launch spam for contrast (hype, early CTA, emoji, pressure, empty adjectives).
- Still about the same product.

Venue: ${community.name} (${community.venue})
Tone: ${community.tone}
Norms:
${community.rules.map((r) => `- ${r}`).join("\n")}
Title hint: ${community.titleHint}`;

  const user = `App profile:
Name: ${profile.name}
One-liner: ${profile.oneLiner}
Problem: ${profile.problem}
Who for: ${profile.whoFor}
Platform: ${profile.platform}
Days live: ${profile.daysLive}
Differentiator: ${profile.differentiator}
Store URL: ${profile.storeUrl || "(none)"}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://tact.local",
      "X-Title": "Tact",
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${t.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty model response");

  let parsed: {
    softTitle?: string;
    softBody?: string;
    spamTitle?: string;
    spamBody?: string;
    tips?: string[];
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Model returned non-JSON");
  }

  const fallbackSpam = spamTemplate(profile);
  const softTitle = (parsed.softTitle || "").trim() || undefined;
  const softBody = (parsed.softBody || "").trim();
  if (!softBody) throw new Error("Missing soft body");

  const spamTitle =
    (parsed.spamTitle || "").trim() || fallbackSpam.title;
  const spamBody = (parsed.spamBody || "").trim() || fallbackSpam.body;

  const tips =
    Array.isArray(parsed.tips) && parsed.tips.length
      ? parsed.tips.map(String).slice(0, 5)
      : [
          community.rules[0],
          "Reply in-thread; the post is only half the pitch.",
          "One link max, after the ask.",
        ];

  return {
    communityId,
    spamDraft: { title: spamTitle, body: spamBody },
    softDraft: { title: softTitle, body: softBody },
    spamRisk: scoreDraft(spamTitle, spamBody, community),
    softRisk: scoreDraft(softTitle, softBody, community),
    tips,
    mode: "live",
    model,
  };
}
