import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LANDING, LP_HEADLINES, landingHeadline, landingVariant } from "../landing";
import { bannedHits, collectStrings } from "../copy-guards";

const SOURCE = readFileSync(new URL("../landing.ts", import.meta.url), "utf8");

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
  const strings = [...collectStrings(LANDING), ...Object.values(LP_HEADLINES)];

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

describe("the ?a= variant", () => {
  it("has the six territories, and every one has a headline", () => {
    expect(Object.keys(LP_HEADLINES)).toEqual(["1", "2", "3", "4", "5", "6"]);
    for (let a = 1; a <= 6; a++) expect(landingHeadline(a).length).toBeGreaterThan(0);
  });

  it.each([
    ["3", 3],
    ["1", 1],
    ["6", 6],
    ["7", 1],
    ["0", 1],
    ["-2", 1],
    ["banana", 1],
    ["", 1],
    [undefined, 1],
  ])("clamps ?a=%s to variant %i", (raw, expected) => {
    expect(landingVariant(raw)).toBe(expected);
  });

  it("takes the first value when the param repeats", () => {
    expect(landingVariant(["4", "2"])).toBe(4);
  });

  it("is an integer, so no health term can ever sit in the query string", () => {
    for (const key of Object.keys(LP_HEADLINES)) expect(key).toMatch(/^\d$/);
  });
});
