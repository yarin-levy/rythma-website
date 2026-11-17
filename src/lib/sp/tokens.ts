// Starting Picture funnel — the design tokens, as decided in blueprint §2.
//
// This file is the SOURCE OF TRUTH for the token values. The same values are
// declared as CSS custom properties under the `.sp` class in app/globals.css so
// the marketing site is untouched by them; `tokens.test.ts` diffs the two so the
// pair can never drift.
//
// Single theme, white. No dark-mode rule exists anywhere in the funnel and the
// page paints `page` explicitly — the OS setting is deliberately ignored.

/** Tokens that carry words. Every one of these is contrast-checked. */
export const TEXT_TOKENS = {
  /** Headlines, prompts, option text, primary button fill, the locked tile. */
  ink: "#084734",
  /** Secondary text (subs, captions, footers). A solid color, never alpha-muted. */
  ink2: "#3E6A5B",
  /** The quietest text allowed: rail labels, placeholders, hairline labels. */
  ink3: "#5F8577",
} as const;

/** Tokens that never carry words: fills, washes, hairlines. */
export const SURFACE_TOKENS = {
  /** Every screen background. White reads clinical; cream reads spa. */
  page: "#FFFFFF",
  /** Hairlines, chip borders, card borders. Decoration only, never text. */
  hair: "rgba(8,71,52,.16)",
  /** Highlight only, never a button. The wash, the band, the count. */
  lime: "#CEF17B",
  /** Selected-state fill on choice cards and chips. */
  limeWash: "#EAF7CE",
  /** Inside video stills for Rough/Hard states only. Never as UI. */
  amber: "#C4872E",
} as const;

export const TOKENS = { ...SURFACE_TOKENS, ...TEXT_TOKENS } as const;

export type TextTokenName = keyof typeof TEXT_TOKENS;

/** WCAG 2.1 AA for body text. */
export const AA_TEXT = 4.5;

/**
 * Text tokens exempted from the AA floor.
 *
 * `ink3` is `#5F8577`, which is **4.11:1** on white — under AA. Blueprint §2
 * annotates it "≈ 4.6:1"; that annotation is wrong, and the two halves of §2
 * (the token value and the "AA contrast on every text token" floor) therefore
 * contradict each other. Surfaced to Yarin 2026-09-10, who chose to keep the
 * value and exempt it rather than darken it. So this ships real words — section
 * rail labels, input placeholders, hairline/category labels — at 4.11:1.
 *
 * The exemption is deliberately one entry long and `tokens.test.ts` asserts
 * that, so a second token cannot join it quietly. Anything under AA must be
 * 15px+ uppercase with the §2 letter-spacing, never a sentence.
 */
export const AA_EXEMPT: readonly TextTokenName[] = ["ink3"];

/** Large-text AA (18.66px bold / 24px regular). The floor even for the exempt. */
export const AA_LARGE = 3;

// ── WCAG contrast math (sRGB, WCAG 2.1) ─────────────────────────────────────

function channel(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance of an opaque `#rrggbb`. */
export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`luminance: expected #rrggbb, got "${hex}"`);
  const n = Number.parseInt(m[1], 16);
  const r = channel(((n >> 16) & 255) / 255);
  const g = channel(((n >> 8) & 255) / 255);
  const b = channel((n & 255) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two opaque colors. Order does not matter. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
