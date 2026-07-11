# DoraHacks / HackOnVibe submission pack · Tact

## Paste-ready fields

### Project name
```
Tact
```

### One-line description
```
Soft community posts for a newly launched product—scored for spam posture with a deterministic risk engine, not vibes.
```

### Track
```
Business Success
```

### Target users
```
Solo founders and indie builders in the first days after ship (mobile or web) who need one good post for Reddit, Product Hunt, Indie Hackers, or X without sounding like an ad.
```

### Product description (main body)
```
Theme fit: effective promotion of a newly launched product.

Problem
Free channels still work after launch, but spam posture kills the post. Founders either freeze or paste “DOWNLOAD NOW” energy into rooms that punish it.

What Tact does
1. Enter product facts (problem, who for, wedge, days live, URL).
2. Pick a room: r/SideProject, r/iOSProgramming, r/androiddev, Indie Hackers, Product Hunt maker comment, or X/Twitter.
3. Get a soft draft and a spam contrast.
4. See before/after risk meters from a rules engine (CTA-first, hard-sell, early links, emoji walls, missing problem/ask, venue length, craft detail for dev rooms).
5. Edit the soft draft and re-score.
6. Share a judge link (/p?d=…).

AI role
Live drafts use an LLM with a hard ban list against marketing-ese. Demo drafts are deterministic for judges. The risk score is rules-based product logic, not a platform moderation API.

Business
- Buyer: solo indie, week one after launch
- Offer: 3 free live drafts per browser · unlimited demo · Pro $9/mo idea for more live + history sync
- GTM: dogfood Tact to promote Tact; same flow for any launch (we dogfooded Prooflet)

Honest limits
- Does not auto-post to communities
- Live prose still benefits from a short human edit
- Risk score is Tact’s rules, not Reddit/X/PH moderation
```

### What we built during the hackathon
```
- Working web app: landing + desk (Next.js)
- 6 venue-native rooms including Product Hunt maker notes and X
- Soft vs spam dual drafts (live OpenRouter + demo fallback)
- Deterministic spam-risk engine + animated before/after meters
- Free tier: 3 live drafts / browser; demo unlimited
- In-place edit + re-score
- Local history, dark/light/system theme, icon share/copy
- Shareable result pages for judges
- Samples: Focusrail (mobile) and Prooflet (web launch)
- Source on HackOnVibe team repo + Vercel production deploy
```

### Links
```
Live demo: https://tact-liard.vercel.app
Desk: https://tact-liard.vercel.app/app
GitHub (HackOnVibe): https://github.com/HackOnVibeCom/2026-07-gremlin-prime
GitHub (mirror): https://github.com/ShalyX/tact
Demo video: [PASTE UNLISTED YOUTUBE URL]
Team: Gremlin Prime · https://hackonvibe.com/find-team
```

### How to run (judges)
```
Open https://tact-liard.vercel.app/app
→ Sample: Prooflet (or Focusrail)
→ Pick r/SideProject
→ Demo drafts only
→ Compare meters, edit soft draft, Re-score, share icon

Local:
git clone https://github.com/HackOnVibeCom/2026-07-gremlin-prime.git
cd 2026-07-gremlin-prime
npm install && npm run dev
```

### Demo video title / description (YouTube)
**Title**
```
Tact · HackOnVibe July 2026 · soft launch posts with real risk rules
```

**Description**
```
Tact helps founders promote a newly launched product without sounding like an ad.

Live: https://tact-liard.vercel.app/app
Repo: https://github.com/HackOnVibeCom/2026-07-gremlin-prime

HackOnVibe — July 2026 · Business Success track · team Gremlin Prime
```

---

## Judging map

| Criterion | How Tact answers |
|-----------|------------------|
| Usefulness & execution | Working end-to-end desk, clear flow, live + demo |
| AI & product depth | LLM drafts + rules engine + re-score + free tier |
| Business potential | Clear buyer, $9/mo path, dogfood GTM |

## Recording checklist

- [ ] Record from `docs/demo-script.md` (dark theme, Prooflet sample)
- [ ] Upload unlisted YouTube
- [ ] Paste URL into DoraHacks + into “Demo video” above
- [ ] Confirm desk opens in private window without login
