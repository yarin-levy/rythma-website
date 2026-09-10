import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LANDING, landingHeadline } from "@/lib/sp/landing";
import { REVEAL, question } from "@/lib/sp/data";
import { SpApp } from "../sp-app";

// The engine is behind `dynamic(..., { ssr: false })`. Importing it here warms
// the module registry so the lazy boundary resolves within a tick instead of
// leaving the tests racing a chunk load.
await import("../sp-engine");

// The shell: which of the two things it shows, and when. The engine's own
// behaviour is covered by flow.test.tsx.

/**
 * The engine arrives through `dynamic(..., { ssr: false })`, so its chunk has to
 * resolve before it renders. Flush a few microtask turns rather than one.
 */
async function settle(ms = 0) {
  await act(async () => {
    for (let i = 0; i < 8; i++) await Promise.resolve();
    if (ms) vi.advanceTimersByTime(ms);
    for (let i = 0; i < 8; i++) await Promise.resolve();
  });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  window.scrollTo = () => {};
  window.history.replaceState({}, "", "/quiz");
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe("the mini LP", () => {
  it("is what she lands on, with her variant's headline", async () => {
    render(<SpApp variant={4} />);
    await settle();
    expect(screen.getByText(landingHeadline(4))).toBeTruthy();
    expect(screen.getByText(LANDING.cta)).toBeTruthy();
    expect(screen.queryByText(question("moment").prompt)).toBeNull();
  });
});

// `?screen=` positions the engine, but the engine does not mount until she taps
// Begin — so the deep link has to open it too. Without this the link silently
// did nothing and left the reviewer on the landing page.
describe("the ?screen= deep link", () => {
  it("opens the engine straight onto the screen, skipping the LP", async () => {
    window.history.replaceState({}, "", "/quiz?screen=reveal");
    render(<SpApp variant={1} devLinks />);
    await settle(50);
    expect(screen.getByText(REVEAL.cardTitle)).toBeTruthy();
    expect(screen.getByText(REVEAL.scoreLock)).toBeTruthy();
    expect(screen.queryByText(LANDING.cta), "the LP should be gone").toBeNull();
  });

  it("opens on a screen number too", async () => {
    window.history.replaceState({}, "", "/quiz?screen=1");
    render(<SpApp variant={1} devLinks />);
    await settle(50);
    expect(screen.getByText(question("moment").prompt)).toBeTruthy();
  });

  it("is inert when the route did not enable it — production keeps one URL", async () => {
    window.history.replaceState({}, "", "/quiz?screen=reveal");
    render(<SpApp variant={1} devLinks={false} />);
    await settle(50);
    expect(screen.getByText(LANDING.cta)).toBeTruthy();
    expect(screen.queryByText(REVEAL.scoreLock)).toBeNull();
  });

  it("leaves the LP alone when there is no screen param", async () => {
    render(<SpApp variant={1} devLinks />);
    await settle(50);
    expect(screen.getByText(LANDING.cta)).toBeTruthy();
  });
});
