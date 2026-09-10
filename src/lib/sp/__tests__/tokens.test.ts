import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AA_EXEMPT,
  AA_LARGE,
  AA_TEXT,
  SURFACE_TOKENS,
  TEXT_TOKENS,
  TOKENS,
  contrastRatio,
  type TextTokenName,
} from "../tokens";

const PAGE = SURFACE_TOKENS.page;
const CSS = readFileSync(new URL("../../../app/globals.css", import.meta.url), "utf8");

/** `limeWash` → `--sp-lime-wash`; `ink2` stays `--sp-ink2`. */
function cssVar(token: string): string {
  return `--sp-${token.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
}

/** The `.sp { … }` declaration block, which is where every token must live. */
function spBlock(): string {
  const start = CSS.indexOf("\n.sp {");
  expect(start, "globals.css has no `.sp` token block").toBeGreaterThan(-1);
  const end = CSS.indexOf("\n}", start);
  return CSS.slice(start, end);
}

describe("text tokens clear AA on the page background", () => {
  const graded = (Object.keys(TEXT_TOKENS) as TextTokenName[]).filter((name) => !AA_EXEMPT.includes(name));

  it.each(graded)("%s is at least 4.5:1 on white", (name) => {
    expect(contrastRatio(TEXT_TOKENS[name], PAGE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("white on the primary button fill clears AA", () => {
    expect(contrastRatio("#FFFFFF", TEXT_TOKENS.ink)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("ink on the selected-state wash clears AA", () => {
    expect(contrastRatio(TEXT_TOKENS.ink, SURFACE_TOKENS.limeWash)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

// Yarin's call, 2026-09-10: `ink3` keeps its blueprint value and is exempted
// rather than darkened. These three tests are the whole of what stops that
// decision from spreading — the exemption stays one token long, that token's
// value cannot drift lower, and it still clears the large-text floor.
describe("the AA exemption stays exactly as narrow as it was granted", () => {
  it("exempts ink3 and nothing else", () => {
    expect([...AA_EXEMPT]).toEqual(["ink3"]);
  });

  it("pins ink3's value, so the exemption cannot cover a darker drift", () => {
    expect(TEXT_TOKENS.ink3).toBe("#5F8577");
  });

  it("keeps the exempt token above the large-text floor at least", () => {
    for (const name of AA_EXEMPT) {
      expect(contrastRatio(TEXT_TOKENS[name], PAGE)).toBeGreaterThanOrEqual(AA_LARGE);
    }
  });
});

describe("globals.css mirrors tokens.ts", () => {
  const block = spBlock();

  it.each(Object.keys(TOKENS))("declares %s under .sp", (name) => {
    const value = TOKENS[name as keyof typeof TOKENS];
    const declared = new RegExp(`${cssVar(name)}:\\s*([^;]+);`).exec(block);
    expect(declared, `${cssVar(name)} is not declared in the .sp block`).not.toBeNull();
    const normalize = (s: string) => s.toLowerCase().replace(/\s|0(?=\.\d)/g, "");
    expect(normalize(declared![1])).toBe(normalize(value));
  });

  it("declares no token outside the .sp block, so the site is untouched", () => {
    const outside = CSS.replace(block, "");
    for (const name of Object.keys(TOKENS)) {
      // `@theme inline` may reference the var; it may never define a value.
      const defines = new RegExp(`${cssVar(name)}:\\s*#|${cssVar(name)}:\\s*rgba`).test(outside);
      expect(defines, `${cssVar(name)} is given a value outside .sp`).toBe(false);
    }
  });

  it("has no dark-mode rule in the funnel block", () => {
    expect(block).not.toMatch(/prefers-color-scheme/);
    expect(block).toMatch(/background-color:\s*var\(--sp-page\)/);
  });
});
