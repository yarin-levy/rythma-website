import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };

// Two projects, one runner:
//  · logic     — the pure funnel modules and the token table, in node.
//  · component — the engine walked screen by screen, in jsdom.
//
// The component project exists because the funnel cannot be verified in a
// hidden browser: Chrome throttles timers and rAF in a page it is not painting,
// which stalls React mid-update. jsdom always renders, so the walk is
// deterministic and lives in the repo rather than in a session transcript.
export default defineConfig({
  // The component test is .tsx; esbuild needs the automatic JSX runtime.
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  resolve: { alias },
  test: {
    projects: [
      {
        esbuild: { jsx: "automatic", jsxImportSource: "react" },
        resolve: { alias },
        test: {
          name: "logic",
          environment: "node",
          include: ["src/lib/**/*.test.ts", "src/app/**/*.test.ts"],
        },
      },
      {
        esbuild: { jsx: "automatic", jsxImportSource: "react" },
        resolve: { alias },
        test: {
          name: "component",
          environment: "jsdom",
          include: ["src/components/**/*.test.tsx"],
        },
      },
    ],
  },
});
