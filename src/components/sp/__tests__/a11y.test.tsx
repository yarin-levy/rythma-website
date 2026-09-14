import { act, cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FLOW, LOADER, SYMPTOM_CATEGORIES, VIDEOS } from "@/lib/sp/data";
import SpEngine from "../sp-engine";
import { SpApp } from "../sp-app";
import { FunnelVideo } from "../funnel-video";
import { LoaderScreen } from "../screens/loader";
import { railSentence } from "../rail";

// M5: the reduced-motion pass and the VoiceOver pass, as tests.
//
// axe runs on every one of the 31 screens and the landing page. Two rules are
// off, both for stated reasons: `color-contrast`, because jsdom has no layout
// to measure (contrast is checked against the token table in tokens.test.ts,
// where ink3's exemption is Yarin's recorded decision); and `region`, because
// each screen is mounted in isolation rather than inside the full page landmarks.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
};

async function violations(node: Element) {
  const result = await axe.run(node, AXE_OPTIONS);
  return result.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.html.slice(0, 80)).join(" | ")}`);
}

async function settle() {
  await act(async () => {
    for (let i = 0; i < 8; i++) await Promise.resolve();
  });
}

function reducedMotion(on: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: on && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

beforeEach(() => {
  window.scrollTo = () => {};
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => ({ paid: false }) })),
  );
  reducedMotion(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/quiz");
  cleanup();
});

describe("axe finds nothing on any screen", () => {
  it.each(FLOW.map((s) => [s.n, s.id] as const))("%i · %s", async (_n, id) => {
    window.history.replaceState({}, "", `/quiz?screen=${id}`);
    const { container } = render(
      <main className="sp">
        <SpEngine onExit={() => {}} />
      </main>,
    );
    await settle();
    expect(await violations(container)).toEqual([]);
  });

  it("the landing page", async () => {
    const { container } = render(<SpApp />);
    await settle();
    expect(await violations(container)).toEqual([]);
  });
});

describe("VoiceOver: the chips", () => {
  async function chips() {
    window.history.replaceState({}, "", "/quiz?screen=symptoms");
    const view = render(
      <main className="sp">
        <SpEngine onExit={() => {}} />
      </main>,
    );
    await settle();
    return view;
  }

  it("puts every chip in a group named for its body system", async () => {
    await chips();
    const groups = [...document.querySelectorAll('[role="group"]')];
    expect(groups).toHaveLength(SYMPTOM_CATEGORIES.length);
    for (const group of groups) {
      const label = document.getElementById(group.getAttribute("aria-labelledby") ?? "");
      expect(label?.textContent, "group has no label").toBeTruthy();
      expect(group.querySelectorAll('[role="checkbox"]').length).toBeGreaterThan(0);
    }
    expect(groups.map((g) => document.getElementById(g.getAttribute("aria-labelledby")!)!.textContent)).toEqual(
      SYMPTOM_CATEGORIES.map((c) => c.label),
    );
  });

  it("names each chip by its label alone and reports its state", async () => {
    await chips();
    const chip = document.querySelector('[role="checkbox"]')!;
    expect(chip.getAttribute("aria-checked")).toBe("false");
    expect(chip.textContent).toBe("Hot flashes");
    await act(async () => (chip as HTMLElement).click());
    expect(chip.getAttribute("aria-checked")).toBe("true");
    // The check glyph appears on selection and is decoration: it must not add
    // to the accessible name, which stays the label alone.
    expect(chip.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(chip.textContent).toBe("Hot flashes");
  });

  it("announces the running count politely when it changes", async () => {
    await chips();
    const live = document.querySelector('[aria-live="polite"][aria-atomic="true"]')!;
    expect(live.textContent).toBe("");
    const boxes = document.querySelectorAll('[role="checkbox"]');
    await act(async () => (boxes[0] as HTMLElement).click());
    await act(async () => (boxes[1] as HTMLElement).click());
    expect(live.textContent).toBe("2 selected");
  });

  it("keeps every chip at least 44px tall", async () => {
    await chips();
    for (const chip of document.querySelectorAll('[role="checkbox"]')) {
      expect(chip.className).toMatch(/min-h-\[44px\]/);
    }
  });
});

describe("VoiceOver: the rail", () => {
  it("reads as the blueprint's sentence, and nothing else from the rail", async () => {
    window.history.replaceState({}, "", "/quiz?screen=symptoms");
    render(
      <main className="sp">
        <SpEngine onExit={() => {}} />
      </main>,
    );
    await settle();
    const spoken = document.querySelector("[data-sp-rail]");
    expect(spoken?.textContent).toBe("Section 2 of 6, What’s changed, question 7 of 31");
    expect(spoken?.className).toContain("sr-only");
    // The visual label, the count and the bar are hidden, so it is read once.
    expect(document.querySelectorAll('[role="img"]')).toHaveLength(0);
  });

  it("speaks act labels in sentence case, as the blueprint writes them", () => {
    expect(railSentence(1, "YOUR MOMENT", 1)).toBe("Section 1 of 6, Your moment, question 1 of 31");
    expect(railSentence(5, "YOUR STARTING PICTURE", 23)).toBe(
      "Section 5 of 6, Your starting picture, question 23 of 31",
    );
  });

  it("puts the back button first in focus order, named", async () => {
    window.history.replaceState({}, "", "/quiz?screen=moment");
    render(
      <main className="sp">
        <SpEngine onExit={() => {}} />
      </main>,
    );
    await settle();
    const first = document.querySelector("button");
    expect(first?.getAttribute("aria-label")).toBe("Go back");
  });
});

describe("prefers-reduced-motion drops every stagger (blueprint §2)", () => {
  it("shows all four loader lines at once, instead of ticking them in", async () => {
    reducedMotion(true);
    render(
      <main className="sp">
        <LoaderScreen onComplete={() => {}} />
      </main>,
    );
    await settle();
    const lines = [...document.querySelectorAll("li")];
    expect(lines).toHaveLength(LOADER.lines.length);
    for (const li of lines) expect(li.className).not.toMatch(/opacity-0/);
  });

  it("still ticks them in for everyone else", async () => {
    reducedMotion(false);
    render(
      <main className="sp">
        <LoaderScreen onComplete={() => {}} />
      </main>,
    );
    await settle();
    const hidden = [...document.querySelectorAll("li")].filter((li) => /opacity-0/.test(li.className));
    expect(hidden.length).toBe(LOADER.lines.length);
  });

  const withClip = { ...VIDEOS.v_relief, src: "/clip.mp4" };

  it("does not autoplay a clip under reduced motion", async () => {
    reducedMotion(true);
    render(<FunnelVideo spec={withClip} />);
    await settle();
    const video = document.querySelector("video")!;
    expect(video.autoplay).toBe(false);
  });

  it("autoplays otherwise — muted, inline — and always offers a way to pause", async () => {
    reducedMotion(false);
    render(<FunnelVideo spec={withClip} />);
    await settle();
    const video = document.querySelector("video")!;
    expect(video.autoplay).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    // WCAG 2.2.2: moving content longer than five seconds needs a pause.
    expect(video.controls).toBe(true);
  });
});
