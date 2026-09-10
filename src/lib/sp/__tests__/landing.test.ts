import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LANDING, LP_HEADLINE } from "../landing";
import { bannedHits, collectStrings } from "../copy-guards";

const SOURCE = readFileSync(new URL("../landing.ts", import.meta.url), "utf8");

/** The source with comments stripped — these tests are about code, not prose. */
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// The LP module is the compliance line. It is the only funnel copy that reaches
// the HTML at /quiz, so if it ever imports data.ts the questions, beats, video
// captions and the evidence footer that names a condition body come with it —
// into the server markup Meta's crawler reads (blueprint §9).
describe("the LP module is import-free", () => {
  it("imports nothing at all — not data.ts, not anything", () => {
    const imports = SOURCE.match(/^\s*(import|export\s+\*\s+from|export\s+\{[^}]*\}\s+from)\b.*$/gm);
    expect(imports ?? [], `landing.ts gained an import:\n${(imports ?? []).join("\n")}`).toEqual([]);
  });

  it("has no dynamic import or require either", () => {
    expect(SOURCE).not.toMatch(/\bimport\s*\(/);
    expect(SOURCE).not.toMatch(/\brequire\s*\(/);
  });
});

// The acceptance check for M1 is `curl /quiz | grep -iE 'perimenopause|
// menopause|hormone|symptom|hot flash'` returning nothing. These are the same
// terms, asserted against the strings that actually render server-side.
describe("no condition term reaches the server HTML", () => {
  const strings = [...collectStrings(LANDING), LP_HEADLINE];

  it.each(["perimenopause", "menopause", "hormone", "symptom", "hot flash"])("says nothing about %s", (term) => {
    for (const s of strings) expect(s.toLowerCase()).not.toContain(term);
  });

  it("carries no banned substring except the allowed clarity line", () => {
    for (const s of strings) expect(bannedHits(s), s).toEqual([]);
  });

  it("keeps the clarity footer as its own string, so the guard can allow it", () => {
    expect(LANDING.subItalic).toBe("Clarity, not a diagnosis.");
    expect(LANDING.sub).not.toMatch(/diagnos/);
  });
});

// Build brief rule 0 (Yarin, 2026-09-10): one landing page, one headline, the
// same for every ad. The six `?a=` territories of blueprint §4/§12.9 are gone.
// These tests are what stops them growing back through the URL.
describe("one page, one headline", () => {
  it("is the locked going-mad line", () => {
    expect(LP_HEADLINE).toBe("You\u2019re not going mad. Tracking alone was never enough.");
  });

  it("exports a single headline, not a table of them", () => {
    expect(typeof LP_HEADLINE).toBe("string");
  });

  it("has no variant lookup left to call", async () => {
    const exports = (await import("../landing")) as Record<string, unknown>;
    for (const gone of ["LP_HEADLINES", "landingHeadline", "landingVariant", "LP_VARIANT_DEFAULT"]) {
      expect(exports[gone], `${gone} is back`).toBeUndefined();
    }
  });

  it("reads nothing from a query string — the module has no parameter at all", () => {
    expect(CODE).not.toMatch(/searchParams|URLSearchParams|\?a=/);
    expect(CODE).not.toMatch(/variant/i);
  });
});
