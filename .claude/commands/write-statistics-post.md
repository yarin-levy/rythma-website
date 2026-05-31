# Write Statistics Post

Generate a "[Topic] Statistics [YEAR]" blog post packed with verified, sourced data points. Statistics posts establish topical authority and get cited heavily by AI search engines.

This skill reads product details from `content/product-context.md`. It does NOT hardcode product-specific values.

## Usage

```
/write-statistics-post [topic]
```

Examples (the topic is whatever your product's audience cares about):
```
/write-statistics-post remote work
/write-statistics-post small business marketing
/write-statistics-post web design
/write-statistics-post freelance writing
```

To write the next queued statistics post:
```
/write-statistics-post
```

---

## What This Skill Produces

MDX file at `content/blog/[topic-slug]-statistics-[year].mdx` with:
- 8-17 verified statistics with working source links
- 2500-3500 words
- Self-contained passages per stat (each citable independently by AI models)
- Thematic analysis synthesizing the numbers
- 5 FAQ entries auto-populated to `src/lib/blog-faqs.ts`
- 2-4 internal links to related existing posts
- Legal disclaimer (only if topic is YMYL)
- About Product box

---

## Core Principles

1. **Quality over quantity on stats.** Target is 8-17 stats. Stop at however many verified stats you found — better 9 bulletproof stats than 15 where 3 are made up.

2. **URL verification is non-negotiable.** Every stat must link to a source URL that resolves AND contains the claimed stat. Drop any unverifiable stat.

3. **Source hierarchy:** Primary sources (government reports, original studies, company data) > secondary sources (blog summaries, "stat roundups"). Aggregators citing aggregators are not citable.

4. **Dated data.** Every stat needs a year. Old data is fine if labeled. Don't present 2019 numbers as current.

5. **Recency beats comprehensiveness.** A 2025 study with 9 relevant stats beats a 2020 study with 20.

6. **Paraphrase, don't quote.** Never reproduce a stat's exact wording. State the number and context in your voice, then cite.

---

## Execution Steps

### STEP 0 — Pre-flight Checks

```bash
test -f content/product-context.md || { echo "ERROR: content/product-context.md missing"; exit 1; }
test -f content/topic-queue.md || { echo "ERROR: content/topic-queue.md missing"; exit 1; }
test -d content/blog || { echo "ERROR: content/blog missing"; exit 1; }
test -f src/lib/blog-faqs.ts || { echo "ERROR: src/lib/blog-faqs.ts missing"; exit 1; }
```

Halt if any fail.

### STEP 1 — Load Product Context

Read `content/product-context.md`. Extract:
- Product name (use in About Product box)
- Author byline
- CTA URL and button text
- Banned phrases list
- Legal disclaimer (if YMYL)
- About Product snippet (verbatim)
- Social proof line (if exists)
- Product-to-topic connection guidance (this determines CTA intensity)

The connection guidance matters. If the topic is strongly related to the product, the CTA section can be direct. If only moderately related, soften it. If weakly related, skip the dedicated CTA section entirely and rely only on the About Product box at the end.

### STEP 2 — Select Target Topic

**If topic provided:** Use it. Derive slug.
**If not:** Find first unchecked `{skill: write-statistics-post}` entry in `content/topic-queue.md`. Extract topic from `{topic: X}` metadata.

If no queued topic exists: halt with "No statistics posts in queue. Add an entry or provide a topic."

### STEP 3 — Derive Slug

Format: `[topic-slug]-statistics-[year]`

Examples:
- "remote work" → `remote-work-statistics-2026`
- "small business marketing" → `small-business-marketing-statistics-2026`
- "freelance writing" → `freelance-writing-statistics-2026`

Year in slug means a 2027 update can live at a new URL without breaking inbound links.

### STEP 4 — Overwrite Protection

```bash
if [ -f "content/blog/[slug].mdx" ]; then
  echo "WARNING: content/blog/[slug].mdx already exists."
  exit 1
fi
```

### STEP 5 — Research Phase

This is the longest and most important step. Real time investment here = post quality.

**Search strategy (minimum 8-12 searches):**

```
"[topic] statistics [current year]"
"[topic] statistics [previous year]"
"[topic] data"
"[topic] report [year]"
"[topic] survey"
"[topic] research study"
"[topic] trends"
"how many [topic-relevant entity]"
"[topic] growth"
"[topic] revenue"
"[topic] percentage"
"[specific sub-topic] statistics"
```

**Tier 1 sources (highest citation value):**
- Government reports: Census, BLS, OECD, Eurostat, IMF, World Bank, national statistics offices
- UN agencies: relevant to topic (ILO, WHO, UNESCO, UNCTAD)
- Central banks (for financial/economic topics)
- Peer-reviewed academic studies
- Major consulting firms: McKinsey, Bain, BCG, Deloitte, PwC, KPMG
- Established research firms: Gallup, Pew Research, Gartner, Forrester, Edelman, Statista (with original source attribution)
- Industry-specific authorities (varies by topic — e.g., HubSpot for marketing, GitHub Octoverse for developer trends)

**Tier 2 sources (acceptable with verification):**
- Industry associations with documented methodology
- Major media investigations (NYT, WSJ, FT, Reuters, Bloomberg — with their linked primary sources)
- Academic institutions' published research
- Company data releases (when the company is the canonical source for that data)

**Never cite:**
- Random blogs
- Press release wires without original source
- AI-generated content farms
- Affiliate/comparison sites that invent numbers for linkbait
- "X stats you need to know" listicles that don't link to primary sources

**For each candidate stat, record:**
- Exact number
- Exact phrasing of the claim (so you don't distort it)
- Source organization
- Year of data (not year of publication — the actual data year)
- Direct URL to the source page containing the stat
- Methodology notes (sample size, method) if available

### STEP 6 — URL Verification (HARD GATE)

Before selecting final stats, web_fetch every candidate URL. For each:

1. Does the URL return 200 OK?
2. Does the page contain the specific stat you're planning to cite?
3. Is the page the original source, or secondary?

Verification outcomes:
- **Pass:** URL works AND contains the stat → include
- **Fail (dead URL):** drop the stat
- **Fail (stat not found):** drop or find better source
- **Partial:** secondary source acceptable IF Tier 1/2 AND names the primary

**Minimum threshold: 8 verified stats. If you can't reach 8 after thorough research, halt.** Report: "Could not find 8+ verifiable statistics on [topic]. Consider expanding scope or picking a different topic."

### STEP 7 — Select Final Stats (8-17)

From verified candidates, prioritize:
- Surprising or counterintuitive numbers (higher citation probability)
- Specific numbers ("42%" beats "about 40%")
- Stats with clear implications (tells a story)
- Mix of problem stats and solution/trend stats
- Recent data (past 2-3 years)
- Varied sources (don't cite 15 stats all from one report)

De-prioritize:
- Obvious or uninteresting numbers
- Stats requiring extensive caveats
- Data over 5 years old (unless it's the only source for that claim)
- Multiple stats from the same study covering the same thing

Order:
- Strongest / most surprising first
- Group related stats near each other
- End with forward-looking stats

Don't pad. 8-12 is the sweet spot for citation quality.

### STEP 8 — Identify Related Existing Posts

List `content/blog/`, read frontmatter, identify 2-4 topically relevant posts for internal linking. Skip if too few exist yet (early days).

### STEP 9 — Draft the Post

#### 9.1 — Frontmatter

```yaml
---
title: "[Topic] Statistics [YEAR]: [Key Hook]"
description: "[Lead stat], [second stat], and [third stat]. [X] data points on [topic]."
date: "[TODAY]"
lastUpdated: "[TODAY]"
author: "[AUTHOR_BYLINE from product-context.md]"
image: "/og-image.jpg"
tags: ["statistics", "[topic-tag]", "[related-tag-1]", "[related-tag-2]"]
cluster: "statistics"
isHub: false
---
```

Title:
- Format: "[Topic] Statistics [YEAR]: [Hook]"
- Hook teases a specific finding: "Remote Work Statistics 2026: 35% Still Hybrid"
- Hard max 60 characters

Description:
- Start with 2-3 specific stats
- Mention total count of stats
- Hard max 160 characters

#### 9.2 — Quick Answer Block (MANDATORY, ≤200 words, italicized)

```mdx
*The [topic] landscape in [YEAR] shows [lead finding with number]. [Second key stat with number]. [Third stat with number]. This report compiles [X] data points from [primary source categories] covering [what the stats cover]. Whether you're [who the audience is], these numbers provide the evidence base for [what you can do with them].*
```

Pack 3-4 specific numbers. Self-contained (reader gets core story from this alone). Under 200 words.

#### 9.3 — Context Paragraphs

2-3 paragraphs after quick answer:

**Paragraph 1:** Why this topic matters now. Broader trends connection.
**Paragraph 2:** What the post covers. Mention stat count. Name source categories.

Avoid banned phrases from product-context.md.

#### 9.4 — Individual Stat Sections

Each stat gets its own H2. Structure:

```mdx
## [N]. [Stat as a clear statement with the number]

[FIRST SENTENCE: State the stat plainly. "82% of [audience] report [finding]."]

[120-180 WORD BODY: Context. What does this mean? Why does it matter? Comparison to previous data or expectations? Methodology? Who does this affect?]

[IMPLICATION SENTENCE: What should the reader take away?]

*Source: [Source Organization — Report Title (Year)](URL)*
```

Rules:
- First sentence has the stat plainly with the number
- Body 120-180 words (count)
- Every paragraph self-contained — AI models extract sections as citations
- Source link at end in italics
- Don't editorialize beyond what the data supports
- Name the source org in prose ("according to Gallup") at least once

H2 headline pattern:
- Start with the number: "## 1. 35 million people work as digital freelancers globally"
- Not: "## 1. How many freelancers are there?"

Numbers in headlines = more citable.

#### 9.5 — Thematic Analysis Section

After the last stat, H2 titled "What these numbers tell us" or similar. 200-350 words.

```mdx
## What these numbers tell us

[Paragraph 1: Synthesize what the stats reveal together. Core story. 3-4 sentences.]

[Paragraph 2: Practical implication for the reader. 3-4 sentences.]

[Paragraph 3: Forward-looking. Trend trajectory. 2-3 sentences.]

**[Bold sentence summarizing the key takeaway.]**
```

This section makes the post worth citing as a whole, not just for individual stats.

#### 9.6 — Product CTA Section (CONDITIONAL)

Length and presence depend on topic-to-product connection from product-context.md:

- **Strong connection:** 150-250 words. Direct CTA.
- **Moderate connection:** 100-150 words. Soft CTA.
- **Weak connection:** Skip this section entirely. Use only About Product box later.

For strong connection:

```mdx
## How [PRODUCT_NAME] fits into this landscape

[1-2 paragraphs connecting the topic's core problem to how the product helps. Factual, not salesy. Mention specific features that address what the stats reveal.]

For [audience mentioned in stats], [pain point these numbers reflect]. [PRODUCT_NAME] [solves this how].

> [[CTA_BUTTON_TEXT]]([CTA_URL])

[Social proof line if exists]
```

For weak connection, just skip this whole section.

#### 9.7 — FAQ Section (MANDATORY, 5 questions)

```mdx
## Frequently Asked Questions

### How many [topic entities] are there in [YEAR]?

[Direct numerical answer in first sentence. 60-120 words total. Cite source.]

### What percentage of [entities] [specific question]?

[Direct answer. Numbers first. Context second.]

### How has [topic] changed since [year]?

[Direct answer comparing current to past data. Trend direction.]

### What's the biggest [topic] statistic that surprises people?

[Answer naming the most counterintuitive stat from the post.]

### Where do these [topic] statistics come from?

[Name the top 3-4 sources used. Builds credibility and transparency.]
```

Rules:
- First sentence directly answers the question
- Self-contained (no "as mentioned above")
- Include specific numbers in at least 4 of 5 answers
- The "where do stats come from" FAQ builds source authority

#### 9.8 — Related Guides

```mdx
## Related guides

- [Related post 1](/blog/slug)
- [Related post 2](/blog/slug)
- [Related post 3](/blog/slug)
```

2-4 internal links. Only to posts that exist. TODO comment if <2 exist.

#### 9.9 — Inline Internal Links

Weave 1-2 internal links into stat sections or analysis where natural. Anchor text must read naturally.

#### 9.10 — About Product Box

Paste verbatim from product-context.md. Place after Related Guides.

#### 9.11 — Legal Disclaimer

Paste verbatim ONLY if the product is YMYL (legal, medical, financial, etc.). Skip otherwise.

### STEP 10 — Citation Formatting

In-prose attribution boosts citation probability by 30-40%:

```mdx
According to [Source Organization], [stat]. [Context.]

*Source: [Source — Title (Year)](URL)*
```

Name the source org in prose at least once per stat. Don't rely solely on the citation link at the end.

**Copyright rules:**
- No verbatim quotes over 15 words
- Paraphrase statistical claims in your voice
- When citing a specific finding, briefly describe methodology: "Based on a survey of 2,300 workers in 28 countries, the ILO found..."

### STEP 11 — Validation Loop

#### 11.1 — Character limits (HARD GATE)
- Title ≤60 chars
- Description ≤160 chars
- Rewrite if over

#### 11.2 — Banned phrases scan

Scan body for banned phrases from product-context.md. Plus statistics-specific flags:
- "Studies show" (too vague — name the study)
- "Research has proven" (research rarely "proves")
- "Experts say" (name the experts)
- "Everyone knows" (no)

#### 11.3 — URL verification (FINAL PASS)

Re-verify every URL in the final post. Between research and drafting, URLs can change.

For each URL: web_fetch, confirm 200 OK, confirm stat is still on the page.

If this drops count below 8: halt. Report the gap.

#### 11.4 — Stat count audit

Count H2-level stat sections. Must be 8-17. If <8: more research or stop. If >17: drop weakest.

#### 11.5 — Word count check

- Total: 2500-3500 words target
- Quick answer block: ≤200 words
- Each stat section: 120-180 words (excluding source link)
- Analysis: 200-350 words

#### 11.6 — Fabrication check

Read every stat. Ask: "Am I 100% confident this exact number appears in the source I'm linking?"

Any doubt → re-verify or drop.

### STEP 12 — Update FAQ Registry

Append to `src/lib/blog-faqs.ts` under post slug key. Preserve existing entries.

```typescript
export const blogFAQs: Record<string, FAQ[]> = {
  // ... existing entries preserved ...
  "[topic-slug]-statistics-[year]": [
    {
      question: "How many...",
      answer: "...",
    },
    // ... 4 more entries
  ],
};
```

### STEP 13 — Update Topic Queue

Mark entry in `content/topic-queue.md` as published:
```
- [x] **[Topic] Statistics [YEAR]** {skill: write-statistics-post} {published: YYYY-MM-DD}
```

### STEP 14 — Save the Post

Write validated MDX to `content/blog/[slug].mdx`. Direct publish.

### STEP 15 — Report

```
✅ Post created: content/blog/[topic-slug]-statistics-[year].mdx

📊 Stats:
- Word count: [X] (target 2500-3500)
- Verified statistics: [N] (target 8-17)
- Title length: [X]/60
- Description length: [X]/160
- Source URLs: [X] unique domains, all verified
- FAQs added: 5
- Internal links: [X] inline + [X] in Related guides

📈 Statistics included:
1. [Stat 1 summary]
2. [Stat 2 summary]
[...]

📉 Statistics dropped during verification:
- [Any that failed URL verification or couldn't trace to primary]
- [Or: "None"]

🔗 Top sources:
- [Source 1] — [N stats]
- [Source 2] — [N stats]

🚀 Next steps:
1. Preview: npm run dev → /blog/[slug]
2. Fact-check 3-5 most surprising stats manually
3. Commit and push when ready
```

---

## Common Pitfalls

1. **Statistical laundering.** Site A cites Site B cites Site C invented the number. Trace to primary source. If you can't, drop the stat.

2. **Outdated data presented as current.** A 2019 stat is fine to cite — but label it "in 2019." Don't let readers think it's 2026 data.

3. **Context inflation.** A survey of 300 freelancers in one US city doesn't support a claim about freelancers globally. Match the claim to the study's actual scope.

4. **Padding to a stat count.** 10 great stats > 17 mediocre. You can stop at 8.

5. **Forced CTA on weak topics.** If the topic-product connection is weak, the dedicated CTA section damages credibility. Skip it.

6. **Copying stat phrasing verbatim.** Paraphrase. Reports have polished language but copying is copyright infringement and reads as AI-generated.

7. **Missing methodology.** "Based on a survey of X respondents" is citation fuel. Include it.

8. **Forgetting the year in the slug.** Statistics go stale. `[topic]-statistics` becomes wrong next year. `[topic]-statistics-2026` is future-proof.

---

**Skill version:** 1.0
**Last updated:** Adapted from a working production blog system
