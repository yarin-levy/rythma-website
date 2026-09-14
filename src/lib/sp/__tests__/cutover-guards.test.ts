import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Cutover deletes the v2 quiz outright (docs/quiz-v3-cutover.md). That only
// stays a pure deletion while nothing in v3 reaches into v2 — which it did,
// until M5: sp/analytics.ts re-exported three helpers from quiz-analytics.ts.

const root = fileURLToPath(new URL("../../../../", import.meta.url));

function files(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const rel = join(dir, name);
    return statSync(join(root, rel)).isDirectory() ? files(rel) : /\.(ts|tsx)$/.test(name) ? [rel] : [];
  });
}

const V3_DIRS = [
  "src/lib/sp",
  "src/components/sp",
  "src/app/api/sp",
  "src/app/manage",
  "src/app/open",
  "src/app/.well-known",
];

const V2_MODULES = /@\/lib\/quiz-(analytics|data|score|landing|lead-email)|@\/components\/quiz\/|\/api\/quiz-lead/;

/** Code only: a comment that mentions the old route is not a dependency on it. */
function code(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

describe("v3 can outlive v2", () => {
  it.each(V3_DIRS)("nothing under %s imports the v2 quiz", (dir) => {
    const offenders = files(dir).filter((f) => V2_MODULES.test(code(readFileSync(join(root, f), "utf8"))));
    expect(offenders).toEqual([]);
  });
});
