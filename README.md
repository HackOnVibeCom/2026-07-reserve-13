# Tact

**Community posts for a newly launched mobile app — without the hard sell.**

Tact is a micro-product for solo indies in the first two weeks after ship. You enter app facts, pick a community room, and get:

1. A **spam posture** draft (the post people almost write)
2. A **soft draft** matched to venue norms
3. A **deterministic spam-risk score** (rules engine, not vibes)
4. Concrete findings + tips

Built for [HackOnVibe — July 2026](https://dorahacks.io/hackathon/hack-on-vibe-2026-07/detail) theme: *effective promotion of a newly launched mobile app*.

## Product

| | |
|--|--|
| **User** | Solo mobile indie, days 0–14 post-launch |
| **Job** | Write one community post that won’t get ignored or removed |
| **Rooms** | r/SideProject, r/iOSProgramming, Indie Hackers, r/androiddev |
| **Pricing idea** | Free: 3 drafts · Pro $9/mo |

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Optional live drafts via [OpenRouter](https://openrouter.ai)
- Offline-capable **demo drafts** when no API key is set

## Links

- **Live:** https://tact-liard.vercel.app
- **Desk:** https://tact-liard.vercel.app/app
- **GitHub:** https://github.com/ShalyX/tact

## Setup

```bash
npm install
cp .env.example .env.local   # optional: OPENROUTER_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Open desk**.

### Environment

| Variable | Required | Notes |
|----------|----------|--------|
| `OPENROUTER_API_KEY` | No | Live model drafts |
| `OPENROUTER_MODEL` | No | Default `openai/gpt-4o-mini` |

Without a key, use **Demo drafts only** — fully works for judges.

## Demo path (~90s)

1. Open `/app`
2. Click **Load sample: Focusrail**
3. Keep **r/SideProject**
4. **Draft with Tact** (or Demo drafts only)
5. Compare red spam vs green soft · show risk findings
6. **Copy soft draft**

## What we built during the hackathon

- Product identity: **Tact** (not a generic “AI pitch lab”)
- Landing + desk split (`/` pitch, `/app` tool)
- Venue-specific norms for 4 communities
- Deterministic risk engine (`src/lib/risk.ts`)
- Live OpenRouter generation with JSON drafts + demo fallback
- Sample app profile for zero-friction demos

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## License

MIT
