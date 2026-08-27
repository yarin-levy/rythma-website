# Post Checklist — required for every new blog post

Every authoring skill/agent must satisfy this checklist before saving a post.
`npm run validate:content` enforces the mechanical parts and gates every build
(local, CI, and Vercel) — a post that violates them cannot deploy.

## Structure (in order)

1. **Quick answer** — first paragraph, italicized, self-contained, ≤200 words,
   with specific numbers/facts. A reader (or AI engine) must get the core
   answer from this block alone.
2. **Intent front-load** — 2–3 short paragraphs: who this is for, what problem
   it solves, why this page answers it.
3. **Modular H2 sections** — each H2/H3 must stand alone as a citable answer.
   Headings mirror real queries ("How long does…", "What happens if…",
   "Can you…"). For stats posts, lead the heading with the number.
4. **Scannable extractables** — at least one per post where the format fits:
   key-facts table (explainers), comparison table (alternatives/lists),
   numbered steps (procedures).
5. **FAQ — 5 real Q&As** (4 minimum). First sentence answers directly;
   60–120 words each. **Write them into `src/lib/blog-faqs.ts` under the post
   slug** — the post template renders them visibly AND emits FAQPage schema
   from the same data, so they always match. Do NOT also write an in-body
   "## Frequently Asked Questions" section unless it's word-for-word identical
   to the lib entry (the validator rejects mismatches).
6. **Related posts** — 2–4 internal links to posts that exist (validator
   checks every `/blog/...` link resolves).
7. **About Product box** — verbatim from `content/product-context.md`.
8. **Legal disclaimer** — required (health niche = YMYL). Verbatim from
   product-context.md.

## Metadata

- `title` ≤60 chars (hard fail >65), unique, primary query phrasing.
- `description` ≤160 chars (hard fail >165), starts with the answer or the
  strongest fact, not the brand.
- `date` = actual publish date (YYYY-MM-DD; future dates auto-publish at
  7am ET via the date gate + daily rebuild).
- `lastUpdated` — set ONLY when the content genuinely changed. Never bump it
  for freshness theater; sitemap lastmod is derived from it.
- `lastVerified` — set when sources were re-checked without a rewrite.
- `cluster` — must match an existing cluster (see content-strategy.md);
  every post links up to its cluster hub.
- One primary keyword/intent per URL. Before writing, check no existing post
  targets the same query (cannibalization).

## Writing rules

- Specific beats vague: "4 years on average, 2–8 year range" > "a few years".
- Date claims: "as of 2026", "in a 2024 study". Old data is fine if labeled.
- Primary sources with working links (gov/medical bodies/original studies).
  Name the org in prose ("according to SWAN…") — no bare "studies show".
- Paraphrase + cite; never quote >15 words; never reproduce tables verbatim.
- No fabricated stats, prices, ratings, or review counts. No AggregateRating
  schema, ever.
- Honest limits: say what tracking/the app can't do. Hype kills AI citations.
- Product CTA soft and factual; skip the dedicated CTA section when the
  topic–product connection is weak.

## MDX hazards (build breakers)

- Never write a bare `<` before a number (`<1 year`, `<90 days`) — MDX parses
  it as JSX and the build dies. Write "under 1 year". Same for `{` in prose.
- Only `.mdx` files in `content/blog/` — the content compiler loads every
  file in that directory.

## Final gate

Run `npm run validate:content`. Zero errors required. It checks: frontmatter
limits, bare-`<` hazards, internal-link validity, FAQ presence and
in-body/schema parity, and stray non-MDX files.
