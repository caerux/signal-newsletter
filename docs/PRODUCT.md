# Signal — Product

> Signal = Where ideas start.

A thinking and writing tool for people who create content. Not a news reader — an intelligence layer that compresses what's happening into signals you can act on.

---

## 1. Core Hypothesis

Writers, creators, and operators don't suffer from a lack of content. They suffer from **a lack of angle**. The internet is noisy; the story itself is rarely scarce. What's scarce is:

1. Knowing **which story matters** this week
2. Seeing **why it matters** in one sentence
3. Finding the **angle no one else is taking**
4. Starting the draft **before the momentum dies**

Signal collapses those four steps into one dashboard.

---

## 2. Who It's For

### Primary persona — "The Medium Writer"
Indie writer who publishes 2-8 articles/month on Medium or Substack. Has opinions. Has an audience of 500-50,000. Reads 4-8 newsletters daily, bookmarks 20+ articles/week, finishes maybe 1 into a post. Biggest pain: "I have ideas, I just can't start."

### Secondary — "The Indie Hacker / Founder"
Builds a product, writes about it. Uses writing as distribution. Needs to stay on top of their vertical without losing 2 hours/day. Will pay $15-30/mo for something that saves 5 hours/week.

### Tertiary — "The Developer Relations / Content Marketer"
Paid to write content. Needs to be early on trends, cite sources, and produce drafts that others can polish. Wants the generator, the sources, and the idea pool.

### Future personas (v2+)
- **The Student** — uses Signal for research papers and discussion posts
- **The Journalist** — story development, source tracking
- **The Investor / Analyst** — market intel, company research
- **The Creator** — ideation for YouTube scripts, TikToks, carousels

---

## 3. The Core Loop

```
Discover → Summarize → Ideate → Draft → Publish → Archive
  (Today)   (Insight)  (Ideas) (Drafts)  (Export)  (Archive)
```

The product succeeds when a user can go from "opening the tab at 8am" to "a draft on Medium by 9am" without context-switching.

Every feature in Signal has to serve this loop. If it doesn't, it's a distraction.

---

## 4. MVP Features (v1 — week 1)

| Feature | What it does |
|---|---|
| **RSS Feed Aggregator** | ~20 curated tech sources, deduped, sorted by relevance × recency |
| **Category filter** | AI, Startups, Dev Tools, Product, Design (5 to start) |
| **Signal chips** | Trending / Rising / Cooling indicators, computed from source velocity |
| **AI Insight Panel** | 3-bullet summary, "why it matters" quote, sharp "key takeaway" |
| **Article Idea Generator** | 3 blog titles + 3 angles + 3 writing prompts per story |
| **Writing Queue** | Bookmark stories to a personal queue, status (idea / drafting / done) |
| **Medium-style Draft Generator** | Markdown draft you can copy/export |
| **Auth & Personalization** | Supabase magic link + GitHub OAuth, saved prefs |
| **Keyboard-first UX** | `⌘K` search, `J/K` navigate, `S` save, `D` draft, `[` / `]` toggle panels |
| **Light theme (MVP)** | Soft Neobrutalism design system, dark mode Phase 2 |

---

## 5. What Signal is NOT (keep this sharp)

- ❌ Not a news reader (Feedly, Inoreader)
- ❌ Not a link saver (Pocket, Instapaper)
- ❌ Not a writing platform (Medium, Substack, Ghost)
- ❌ Not an SEO tool (SurferSEO, Clearscope)
- ❌ Not a social listener (Brand24, Buzzsumo)
- ❌ Not a research assistant (Perplexity — though overlap exists)

Signal is the **bridge between input and output**. The 15-30 minutes between "I read a thing" and "I pressed publish."

---

## 6. Expansion — Sources (adding more inputs)

Beyond curated RSS, future source types:

### Near-term (v1.1 — weeks 2-4)
- **HackerNews** — top posts + comment sentiment
- **Product Hunt** — daily launches
- **Reddit** — top posts from configured subreddits
- **GitHub Trending** — daily/weekly repo + release digest
- **Twitter/X** — curated lists via API, threads from followed accounts
- **Newsletter-to-feed** — email aliasing so users can forward newsletters into Signal

### Mid-term (v1.2 — month 2)
- **YouTube channels** — auto-transcribe + summarize new videos
- **Podcasts** — transcribe episodes, extract quotable moments
- **Substack / Ghost** publications — native RSS but with deeper parsing
- **Arxiv / scholarly** — for research-oriented users
- **Discord / Slack communities** — pull insights from channels users choose

### Long-term (v2+)
- **User-submitted links** — one-click browser extension: highlight a tweet, click save → Signal ingests and contextualizes
- **Readwise / Pocket sync** — import user's existing reading backlog
- **Notion / Obsidian integration** — pull from personal knowledge base
- **Company blogs** — auto-monitor competitors' blogs for assigned users
- **Earnings calls, SEC filings** — for finance/investor persona
- **Live data overlays** — stock moves, crypto, sports, weather for relevant verticals

---

## 7. Expansion — Verticals (beyond tech)

Signal's core engine (ingest → signal detection → summarize → ideate → draft) is **content-agnostic**. We launch on tech because:

1. RSS ecosystem is rich
2. Writer persona is dense there
3. We understand the domain

But the same engine works for any vertical. Expansion order by feasibility × market:

| Vertical | Signals | Opportunity |
|---|---|---|
| **Tech / AI** (launch) | Model releases, acquisitions, tools | Indie writers, devrel, founders |
| **Startups / VC** | Funding, launches, valuations | Operators, investors, analysts |
| **Crypto / Web3** | Protocol updates, token news | Creator + trader overlap |
| **Finance / Markets** | Earnings, Fed moves, M&A | Analysts, fintwit, newsletter writers |
| **Design / Creator** | Tool launches, tutorials, trends | Designers, creators, agencies |
| **Climate / Sustainability** | Policy, research, startups | Growing writer niche |
| **Health / Longevity** | Research, FDA, trends | Huge creator market |
| **Gaming** | Releases, patches, tournaments | Content-hungry audience |
| **Sports** | Scores, trades, injuries | Commentary culture |
| **Entertainment** | Releases, reviews, gossip | Newsletter wave (Puck, etc.) |
| **Books / Literature** | Releases, reviews, think pieces | Substack heavy |
| **Food / Wine** | Reviews, trends, openings | Niche but loyal |
| **Fashion / Beauty** | Collections, launches, drops | Visual-heavy, needs image layer |
| **Parenting / Family** | Research, products, policy | High willingness-to-pay |
| **Education** | Pedagogy, edtech, policy | Teachers write a lot |

**Launch strategy:** Each new vertical is a separate "Pack" users can turn on. Source list + prompt tuning is vertical-specific. Core product unchanged.

---

## 8. Expansion — Outputs (beyond Medium)

Draft generator currently targets Medium. Each output format is a prompt template + export integration.

### Near-term (v1.1)
- **Substack** (markdown paste)
- **LinkedIn article** (long-form)
- **Twitter/X thread** (numbered, with character limits)
- **Dev.to** (markdown + frontmatter for tags)
- **Hashnode** (markdown with their metadata)

### Mid-term (v1.2)
- **Newsletter** (own-publication feature — Signal hosts a user newsletter)
- **LinkedIn carousel / post** (short-form)
- **Instagram carousel** (slide-by-slide text + image prompts)
- **YouTube video script** (hook → intro → body → CTA structure)
- **Podcast script** (2-3 speakers, with interview questions)
- **Reddit post** (subreddit-aware tone)

### Long-term (v2+)
- **TikTok / Reels script** (hook-heavy, short-form)
- **Presentation deck** (outline + speaker notes, Google Slides export)
- **Pitch deck slide** (for founders)
- **Internal memo** (Slack/Notion format)
- **Email cold outreach** (from a trend insight)

### Publishing integrations (most valuable)
- **Medium API** — direct publish
- **Substack API** — direct publish
- **LinkedIn API** — direct post
- **Ghost API** — for indie publications
- **Buffer / Typefully** — queue thread for later

---

## 9. Expansion — AI Layer

### MVP AI features
- Summarize article → 3 bullets + why-matters + takeaway
- Generate ideas → 3 titles + 3 angles + 3 prompts
- Generate draft → full Medium-style post in markdown

### v1.1 AI additions
- **Style transfer** — "write this in MY voice" (analyze user's past articles, mimic tone)
- **Counterpoint mode** — "write the opposite argument" button
- **Fact-check** — flag claims, link to supporting/contradicting sources
- **Outline-first mode** — generate outline only, user fills in prose
- **Compare coverage** — "3 sources said X, 1 said Y" — identify the contrarian angle
- **Citation extraction** — pull quotes, data points, with source links ready for pasting

### v1.2 AI additions
- **Research mode** — "go deep on this topic" — queries multiple sources, cross-refs, builds a mini-brief
- **Summarize any URL** — paste link → get the Signal treatment on any page
- **Book / podcast summary** — long-form audio/text → key takeaways + article angles
- **Meeting notes → article** — paste a transcript, get a blog post
- **Trend detector** — "what's rising that isn't trending yet" — predictive signal
- **Title A/B generator** — 10 variants, ranked by past-performance pattern

### v2+ AI moonshots
- **Personal editor** — ongoing critique of user's draft, in their voice standards
- **Performance predictor** — estimate claps/reads based on title + content
- **Anti-plagiarism + originality score** — "how much of this is already out there?"
- **Image generation** — header + inline images matching the post's vibe (DALLE / Flux)
- **Audio version** — TTS of the article, publish as podcast or audiogram
- **Video version** — AI avatar reads the key takeaway as a 60-sec social video

---

## 10. Adjacent Products (verticals of Signal)

At some point, specific vertical packs justify becoming standalone products with vertical-specific UX.

- **Signal for Teams** — Shared workspace, editorial calendar, role assignments. $29/seat/month.
- **Signal for Investors** — Companies-based dashboards, earnings call intel, portfolio feed.
- **Signal for Journalists** — Story development, source tracking, tip ingestion.
- **Signal for Research** — Academic sources, citation graph, paper summaries.
- **Signal for Sales** — Monitor prospects, trigger events, draft outreach.
- **Signal API** — Devs buy raw signal data (deduped, summarized, ranked) to build on top.

Each is a new product surface but reuses 80% of the core engine.

---

## 11. Monetization

### Free tier
- 5 sources
- 1 category
- 10 AI summaries/day
- 3 drafts/week
- No export integrations

### Pro — ₹499/month (~$6) or $9/mo outside India
- Unlimited sources
- All categories / verticals
- Unlimited AI summaries
- Unlimited drafts
- All export formats (Medium, Substack, LinkedIn, Twitter, etc.)
- Voice / style analysis
- Writing queue, personal dashboard

### Studio — ₹1,499/month (~$18) or $24/mo outside India
- Everything in Pro
- Research mode
- Newsletter hosting
- Image generation
- Analytics (article performance tracking)
- Priority AI (faster, better models)

### Team — ₹2,499/seat/month (v2+)
- Shared workspace
- Editorial calendar
- Collaboration / comments
- Admin controls

### API — usage-based (v2+)
- $0.01/signal extraction
- $0.05/draft generation
- For devs building adjacent products

---

## 12. Differentiation vs. Alternatives

| Tool | What they do | How we differ |
|---|---|---|
| **Feedly** | RSS reader with AI summaries | We're writer-focused, not reader-focused. Writing is the output. |
| **Readwise** | Read-later + highlights | Signal is discovery-first. Readwise integrates as input. |
| **Perplexity** | AI search | Signal is proactive (feeds you) vs. reactive (you ask). |
| **Superhuman AI** | Email intelligence | Different surface. Though we could integrate. |
| **Jasper / Copy.ai** | AI writing generic | We're trend-grounded — draft starts from real news. |
| **Notion AI** | Workspace AI | Not feed-oriented. Signal's feed is the seed. |
| **Buzzsumo** | Trend analytics for marketers | Enterprise, B2B. Signal is indie + affordable. |
| **Substack** | Publishing platform | Signal feeds Substack. Could be complementary or competitive long-term. |

**Our moat over time:**
1. **Source curation quality** — human + AI-selected sources outperform random RSS
2. **Idea quality** — prompts tuned per vertical, per user voice
3. **Loop speed** — discover → draft in 15 minutes (fastest in category)
4. **Taste** — editorial POV (what's worth reading this week), not just aggregation

---

## 13. Risks

| Risk | Mitigation |
|---|---|
| **AI summary quality is mediocre** | Invest in prompts, use strongest available model, let users rate outputs |
| **Sources become stale or spam** | Human editorial review, user upvoting, trending-source detection |
| **Users treat it as a reader, never write** | Nudge draft CTA aggressively, gamify streaks ("you've saved 7 but drafted 0") |
| **LLM costs blow up margins** | Aggressive caching of summaries (same article = same summary forever), rate limits on free tier |
| **Medium / Substack build this in-house** | Be horizontal (cross-platform) while they stay vertical (their platform only) |
| **Niche too small (tech writers)** | Vertical expansion playbook — launch Packs (design, startups, finance) in v1.2 |
| **Legal: copyright for summarization** | Summaries + links are fair use; we never reproduce full articles; legal review before launch |

---

## 14. Success Metrics

### Activation
- Sign-up → first draft generated within 24h (target: 40%)

### Engagement
- DAU / MAU (target: 35%+ = daily-use product)
- Avg. sessions per week per active user (target: 5+)
- Time to first "save" on a new session (target: < 90 sec)

### Retention
- Week-1 retention (target: 60%)
- Week-4 retention (target: 35%)

### Output
- **Drafts generated per user per week** — the North Star. If this grows, everything grows.
- Drafts → published on Medium (measure via integration) (target: 30% of drafts)

### Monetization
- Free → Pro conversion (target: 5%)
- ARPU (target: $10/mo blended)
- LTV / CAC (target: 3× within 6 months)

---

## 15. Go-to-Market

### Launch sequence
1. **Private beta** (50 invited writers) — month 1 post-MVP
2. **Product Hunt launch** — month 2
3. **Hacker News / Indie Hackers** — launch week
4. **Twitter/X** — organic by building in public
5. **Content marketing** — publish Signal's own daily newsletter using Signal (dogfood + distribution)

### Content moats
- Publish "State of X" reports (State of AI writing, State of indie dev, etc.) generated FROM Signal data
- Open-source the RSS source curation repo (community contributes new sources)
- Free weekly public digest (gateway drug to paid product)

### Partnerships
- Medium, Substack, Ghost — "write with Signal" badge
- Podcast networks — transcript partnerships
- Newsletter creators — referral revenue share
