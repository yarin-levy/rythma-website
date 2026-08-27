#!/usr/bin/env node
/**
 * Pre-build content validator. Fails the build (CI + `npm run build`) when a
 * post would break the MDX compiler, ship dishonest metadata, or emit schema
 * that doesn't match visible content.
 *
 * Checks:
 *  1. content/blog contains only .mdx files (the contentlayer glob loads
 *     everything in that directory).
 *  2. Frontmatter: title/description/date present; title ≤65 chars,
 *     description ≤165 chars, date is a valid YYYY-MM-DD.
 *  3. No bare `<` before a digit outside code fences (`<1 year` breaks MDX —
 *     write "under 1 year").
 *  4. Internal /blog/... links point to posts that actually exist.
 *  5. FAQ parity: every post has an entry in src/lib/blog-faqs.ts (the
 *     FAQPage schema source). If the post ALSO has an in-body FAQ section,
 *     its questions must exactly match the lib entry, since the page only
 *     renders one of the two.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const BLOG_DIR = "content/blog";
const FAQ_FILE = "src/lib/blog-faqs.ts";

const errors = [];
const warnings = [];

// --- Parse blogFAQs: slug -> [questions] ---
const faqSource = readFileSync(FAQ_FILE, "utf8");
const faqEntries = {};
{
  const slugRe = /^  "([a-z0-9-]+)": \[/gm;
  const indices = [];
  let m;
  while ((m = slugRe.exec(faqSource))) indices.push({ slug: m[1], start: m.index });
  indices.forEach((entry, i) => {
    const end = i + 1 < indices.length ? indices[i + 1].start : faqSource.length;
    const block = faqSource.slice(entry.start, end);
    faqEntries[entry.slug] = [...block.matchAll(/question:\s*"((?:[^"\\]|\\.)*)"/g)].map((q) =>
      q[1].replace(/\\"/g, '"').trim()
    );
  });
}

const files = readdirSync(BLOG_DIR);
const slugs = new Set(files.filter((f) => f.endsWith(".mdx")).map((f) => basename(f, ".mdx")));

for (const file of files) {
  if (!file.endsWith(".mdx")) {
    errors.push(`${BLOG_DIR}/${file}: non-.mdx file in the content documents directory (contentlayer will try to load it as a post)`);
    continue;
  }
  const slug = basename(file, ".mdx");
  const raw = readFileSync(join(BLOG_DIR, file), "utf8");

  // --- Frontmatter ---
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    errors.push(`${file}: missing frontmatter`);
    continue;
  }
  const fm = fmMatch[1];
  const body = raw.slice(fmMatch[0].length);
  const field = (name) => fm.match(new RegExp(`^${name}:\\s*"([^"]*)"`, "m"))?.[1];

  const title = field("title");
  const description = field("description");
  const date = field("date");
  if (!title) errors.push(`${file}: missing title`);
  else if (title.length > 65) errors.push(`${file}: title is ${title.length} chars (max 65, ideal ≤60)`);
  else if (title.length > 60) warnings.push(`${file}: title is ${title.length} chars (ideal ≤60)`);
  if (!description) errors.push(`${file}: missing description`);
  else if (description.length > 165) errors.push(`${file}: description is ${description.length} chars (max 165, ideal ≤160)`);
  else if (description.length > 160) warnings.push(`${file}: description is ${description.length} chars (ideal ≤160)`);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
    errors.push(`${file}: missing or invalid date (need YYYY-MM-DD)`);
  }

  // --- MDX hazards: bare < before a digit, outside code fences/inline code ---
  const withoutCode = body.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const hazard of withoutCode.matchAll(/<\s?\d/g)) {
    const line = body.slice(0, body.indexOf(hazard[0])).split("\n").length;
    errors.push(`${file}: bare "<" before a number (≈body line ${line}) — breaks the MDX compiler; write "under X" instead`);
  }

  // --- Internal links point to real posts ---
  for (const link of withoutCode.matchAll(/\]\(\/blog\/([a-z0-9-]+)(?:#[^)]*)?\)/g)) {
    if (!slugs.has(link[1])) errors.push(`${file}: internal link to /blog/${link[1]} — no such post`);
  }

  // --- FAQ parity (announcements don't need FAQs) ---
  const cluster = field("cluster");
  const libQuestions = faqEntries[slug];
  if (cluster === "announcements") {
    // skip
  } else if (!libQuestions || libQuestions.length === 0) {
    errors.push(`${file}: no entry in ${FAQ_FILE} — post will ship without FAQPage schema and without a visible FAQ section`);
  } else {
    const faqHeading = body.match(/^#{2,3}\s+(?:FAQ|Frequently asked)[^\n]*\n/im);
    if (faqHeading) {
      const afterHeading = body.slice(faqHeading.index + faqHeading[0].length);
      const nextH2 = afterHeading.search(/\n## [^#]/);
      const faqBlock = nextH2 === -1 ? afterHeading : afterHeading.slice(0, nextH2);
      const inlineQuestions = [...faqBlock.matchAll(/^###\s+(.+)$/gm)].map((q) => q[1].trim());
      const same =
        inlineQuestions.length === libQuestions.length &&
        inlineQuestions.every((q, i) => q === libQuestions[i]);
      if (!same) {
        errors.push(
          `${file}: in-body FAQ questions differ from ${FAQ_FILE} entry — FAQPage schema must match the visible Q&As exactly`
        );
      }
    }
  }
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`❌ ${e}`);
  console.error(`\n${errors.length} content error(s). Fix before building.`);
  process.exit(1);
}
console.log(`✅ Content OK: ${slugs.size} posts validated (${warnings.length} warning(s)).`);
