import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Two kinds of test, one runner:
//  · src/lib/sp/**      — the pure funnel logic and the token table, in node.
//  · src/components/sp/ — the engine walked screen by screen, in jsdom.
//
// The component test exists because the funnel cannot be verified in a hidden
// browser: Chrome throttles timers and rAF in a page that is not being painted,
// which stalls React mid-update. jsdom always renders, so the walk is
// deterministic and lives in the repo instead of in a session transcript.
export default defineConfig({
  // The component test is .tsx; esbuild needs the automatic JSX runtime.
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environmentMatchGlobs: [
      ["src/components/**", "jsdom"],
      ["**", "node"],
    ],
  },
});
