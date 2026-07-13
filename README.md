# Tact

**Community posts for a newly launched product — without the hard sell.**

Tact drafts venue-native soft posts (Reddit, Indie Hackers, Product Hunt maker notes, X), shows the spam version you almost wrote, scores spam posture with a deterministic rules engine, lets you edit and re-score, and share a judge link.

Built for [HackOnVibe — July 2026](https://dorahacks.io/hackathon/hack-on-vibe-2026-07/detail) · team **Gremlin Prime**.

## Live demos

| Host | URL |
|------|-----|
| **Primary (API + desk)** | https://tact-liard.vercel.app |
| Desk | https://tact-liard.vercel.app/app |
| Team status | https://hackonvibe.com/find-team |
| HackOnVibe repo | https://github.com/HackOnVibeCom/2026-07-gremlin-prime |
| Live Demo | https://youtu.be/wAWfEYigh7E?si=SK9qLL5NkSmqFJxx |

> Cloudflare Pages auto-deploy is wired via `.github/workflows/deploy.yml`.  
> The full product (live LLM drafts + `/api/pitch`) runs on **Vercel** because it needs a Node API runtime. CF pipeline may treat this as Next SSR; use the Vercel URL for the working demo.

## Product

| | |
|--|--|
| **User** | Solo builder, days 0–30 after ship |
| **Job** | Write one community post that will not get ignored or removed |
| **Rooms** | r/SideProject, r/iOSProgramming, Indie Hackers, r/androiddev, Product Hunt maker, X/Twitter |
| **Free tier** | 3 live drafts / browser · unlimited demo drafts |

## Features

- Soft vs spam dual drafts
- Deterministic spam-risk engine + before/after meters
- Edit soft draft → re-score
- Local history, shareable `/p?d=…` links
- Dark / light / system theme
- Sample apps: Focusrail + Prooflet

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Optional live drafts via OpenRouter
- Demo drafts work with no API key

## Setup

```bash
npm install
cp .env.example .env.local   # optional: OPENROUTER_API_KEY
npm run dev
```

```bash
npm test
npm run build
```

## Demo path (~90s)

1. Open `/app`
2. Load **Sample: Prooflet** (or Focusrail)
3. Pick a room → **Draft with Tact** or **Demo drafts only**
4. Compare risk meters → edit soft draft → **Re-score**
5. Share icon for a judge link

## What we built during the hackathon

- Product identity: **Tact**
- Landing + desk, 6 venue rooms, risk engine, free-tier live quota
- Live prompt hardened against marketing-ese
- Prooflet dogfood pack under `docs/prooflet-live-pack.md`

## License

MIT
