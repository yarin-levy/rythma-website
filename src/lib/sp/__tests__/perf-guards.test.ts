import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// M5: Lighthouse mobile ≥ 90 on the landing page. Each guard below is a finding
// from a Lighthouse run, pinned so it cannot quietly come back. The numbers they
// protect (clean build, 3 runs): 79 before → median 91 after.

// fileURLToPath, not .pathname: the repo path has a space in it.
const root = fileURLToPath(new URL("../../../../", import.meta.url));
const read = (p: string) => readFileSync(join(root, p), "utf8");

function sourceFiles(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const rel = join(dir, name);
    if (statSync(join(root, rel)).isDirectory()) return name === "__tests__" ? [] : sourceFiles(rel);
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [rel] : [];
  });
}

describe("Stripe never loads on the landing page", () => {
  // The default `@stripe/stripe-js` entry injects js.stripe.com on import. The LP
  // pre-fetches the engine, so the default entry anywhere in its import graph
  // loaded 242 KB of Stripe — the largest main-thread task on the LP — for every
  // visitor who only read the headline.
  it("imports Stripe's browser SDK only through the pure entry", () => {
    const offenders = sourceFiles("src").filter((f) => /from ["']@stripe\/stripe-js["']/.test(read(f)));
    expect(offenders).toEqual([]);
  });

  it("keeps the checkout screen out of the engine's static imports", () => {
    const engine = read("src/components/sp/sp-engine.tsx");
    expect(engine).not.toMatch(/^import[^;]*["']\.\/screens\/checkout["']/m);
    expect(engine).toMatch(/import\(["']\.\/screens\/checkout["']\)/);
  });
});

describe("the headline is the LCP candidate from the first paint", () => {
  // An element that starts at opacity 0 is not an LCP candidate. The fade-in made
  // the small line under the button the LCP element, timed by its font swap.
  it("gives the LP no opacity entrance animation", () => {
    expect(read("src/components/sp/landing.tsx")).not.toMatch(/sp-rise|animation-delay/);
  });
});

describe("fonts", () => {
  it("keeps the funnel's faces out of the root layout, so the site does not preload them", () => {
    expect(read("src/app/layout.tsx")).not.toMatch(/instrument-serif|archivo/i);
  });

  it("declares them on /quiz, with the italic not preloaded — two preloads, not three", () => {
    const quiz = read("src/app/quiz/layout.tsx");
    expect(quiz).toMatch(/instrument-serif\.woff2/);
    expect(quiz).toMatch(/archivo\.woff2/);
    const italic = quiz.slice(quiz.indexOf("instrument-serif-italic.woff2"));
    expect(italic.slice(0, 300)).toMatch(/preload:\s*false/);
  });

  it("uses font-display: swap on every funnel face, so no font blocks a paint", () => {
    const declarations = read("src/app/quiz/layout.tsx").match(/localFont\(\{[\s\S]*?\}\);/g) ?? [];
    expect(declarations.length).toBe(3);
    for (const d of declarations) expect(d).toMatch(/display:\s*"swap"/);
  });
});

describe("the engine is not parsed in the middle of the landing page's load", () => {
  it("warms on idle or intent, not on a fixed timer", () => {
    const shell = read("src/components/sp/sp-app.tsx");
    expect(shell).toMatch(/requestIdleCallback/);
    expect(shell).not.toMatch(/setTimeout\(\(\) => void import\("\.\/sp-engine"\), \d+\)/);
    expect(read("src/components/sp/landing.tsx")).toMatch(/onPointerDown=\{onIntent\}/);
  });
});
