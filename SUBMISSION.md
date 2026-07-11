# DoraHacks / HackOnVibe submission pack — Tact

## Project name
**Tact**

## One-liner
Community posts for a newly launched mobile app that read like a founder note — not an ad — with deterministic spam-risk scoring.

## Theme fit
HackOnVibe July 2026 theme: **effective promotion of a newly launched mobile app**.  
Tact targets the free-channel moment (Reddit, Indie Hackers) in days 0–14 after go-live, where spam posture kills distribution.

## Track
**Business Success** (primary) — clear buyer, $9/mo pricing path, dogfood GTM.  
World Impact optional secondary narrative: healthier public forums / less spam.

## Target users
Solo indie iOS/Android builders who just shipped and need one good community post without sounding promotional.

## What we built during the hackathon
- Full product: landing + desk
- 4 venue-native rooms with norms
- Soft vs spam dual drafts
- Rules-based risk engine (CTA-first, hard-sell, links, emoji walls, problem/ask gaps, length, craft detail)
- Live LLM drafts via OpenRouter + demo fallback for judges
- Sample app (Focusrail) for one-click demo

## Links
- Live demo: *(add Vercel URL after deploy)*
- GitHub: *(add after push)*
- Demo video: *(unlisted YouTube, ≤3 min — use docs/demo-script.md)*

## How to run
```bash
git clone <repo>
cd tact
npm install
npm run dev
# open /app → Load sample → Draft
```

## Business potential
| | |
|--|--|
| Buyer | Solo mobile indie |
| Pain | Free promo channels punish hard-sell posts |
| Offer | 3 free drafts / Pro $9 mo |
| First users | Promote Tact with Tact; indie Twitter + r/SideProject |

## Honest limits
- Does not auto-post to Reddit
- Risk score is product rules, not platform moderation API
- Live quality depends on model; demo path is deterministic for judging
