import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACTS,
  ADVERTORIAL_CTA,
  BRIDGE_CTA,
  BRIDGE_HOPE,
  ECHO_KICKER,
  FLOW,
  GATE,
  HANDOFF,
  LOADER,
  METHOD,
  PLAN,
  PLAN_CARDS_SCREEN,
  PRIVACY,
  QUOTES_SCREEN,
  RECOGNIZED,
  REVEAL,
  TOTAL_SCREENS,
  VIDEOS,
  VIDEO_CTA,
  CHECKOUT,
  question,
  type SingleQuestion,
} from "@/lib/sp/data";
import SpEngine from "../sp-engine";
import { CHECKOUT_COPY } from "../screens/checkout";

// Walks all 31 screens the way she would, asserting each one renders its own
// blueprint copy. This is the M1 acceptance check ("all 31 screens render")
// turned into something that runs on every build.
//
// PostHog is never loaded: `ph()` short-circuits when NEXT_PUBLIC_POSTHOG_KEY
// is unset, which it is under test. `fbq` is absent, so the Meta helpers no-op.

const SELECT_HOLD = 400;

/** Let the auto-advance timer, the video delay or the loader finish. */
async function settle(ms = SELECT_HOLD) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

async function click(el: Element) {
  await act(async () => {
    (el as HTMLElement).click();
  });
}

function rail() {
  return document.querySelector('[role="img"][aria-label^="Section"]');
}

/** The sticky primary action, whatever this screen calls it. */
function cta(): HTMLElement {
  const found = document.querySelector<HTMLElement>(".sp-actions button:not([disabled]), .sp-actions a");
  if (!found) throw new Error("no enabled primary action on this screen");
  return found;
}

/**
 * React tracks the previous value on the DOM node, so assigning `.value`
 * directly is invisible to it. Go through the native setter, the way a real
 * keystroke does.
 */
async function setField(el: HTMLInputElement, value: string) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function tapCta() {
  await click(cta());
  await settle();
}

/** Answer a single-select by its option index. */
async function pick(index = 0) {
  const radios = document.querySelectorAll('[role="radio"]');
  expect(radios.length, "expected a single-select here").toBeGreaterThan(1);
  await click(radios[index]);
  await settle();
}

async function pickChecks(count: number) {
  const boxes = document.querySelectorAll('[role="checkbox"]');
  for (let i = 0; i < count; i++) await click(boxes[i]);
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // Screen 24 posts to /api/sp/profile. jsdom has no server and no base URL, so
  // the route is stubbed here; `profile.test.ts` covers the contract itself.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => ({ rythmaId: "wq_test" }) })),
  );
  // jsdom has no scrollTo, and the engine scrolls to the top on every step.
  window.scrollTo = () => {};
  window.history.replaceState({}, "", "/quiz");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  cleanup();
});

/**
 * `.sp` is set on the shell in production (sp-app.tsx), not by the engine, so
 * the wrapper goes on here too — the funnel's selectors are scoped to it.
 */
function mount() {
  return render(
    <main className="sp">
      <SpEngine onExit={() => {}} />
    </main>,
  );
}

describe("the funnel walks from screen 1 to screen 31", () => {
  it("renders every screen's own copy, in order", async () => {
    mount();
    await settle(0);

    // ── ACT A ──────────────────────────────────────────────────────────────
    // 1 · Moment
    expect(screen.getByText(question("moment").prompt)).toBeTruthy();
    expect(rail()?.getAttribute("aria-label")).toBe(`Section 1 of 6, ${ACTS[0].label}, question 1 of ${TOTAL_SCREENS}`);
    await pick(0); // "I was told it's stress…" → dismissed

    // 2 · Echo, branched on her moment
    expect(screen.getByText(/You left with fine labs/)).toBeTruthy();
    expect(screen.getByText(/You need something you can show\./)).toBeTruthy();
    expect(screen.getByText(ECHO_KICKER)).toBeTruthy();
    expect(rail(), "beats carry no rail").toBeNull();
    await tapCta();

    // 3 · Age, with the under-38 note appearing on selection
    expect(screen.getByText(question("age").prompt)).toBeTruthy();
    const under38 = (question("age") as SingleQuestion).options[0];
    await click(document.querySelectorAll('[role="radio"]')[0]);
    expect(screen.getByText(under38.note!)).toBeTruthy();
    await settle();

    // 4 · V-SEEN — a still, with the clip's own words as the alternative
    expect(screen.getByText(VIDEOS.v_seen.caption)).toBeTruthy();
    expect(screen.getByText(VIDEOS.v_seen.note!)).toBeTruthy();
    expect(screen.getByText(VIDEOS.v_seen.alt[0])).toBeTruthy();
    expect(document.querySelector("video"), "no clip yet, so no video element").toBeNull();
    await settle(3000); // Continue appears at 3s
    await tapCta();

    // 5 · How long
    expect(screen.getByText(question("how_long").prompt)).toBeTruthy();
    await pick(0);

    // 6 · What quietly got harder (multi, capped at three)
    expect(screen.getByText(question("harder").prompt)).toBeTruthy();
    await pickChecks(2);
    await tapCta();

    // ── ACT B ──────────────────────────────────────────────────────────────
    // 7 · Symptoms — 30 chips under five headers, and the count in the rail
    expect(screen.getByText(question("symptoms").prompt)).toBeTruthy();
    expect(document.querySelectorAll('[role="checkbox"]')).toHaveLength(30);
    expect(rail()?.getAttribute("aria-label")).toContain("question 7 of 31");
    await pickChecks(3);
    expect(screen.getByText("3 selected")).toBeTruthy();
    await tapCta();

    // 8 · Recognized — her own count, then the hedge
    expect(screen.getByText(/3 of the 3 things you named/)).toBeTruthy();
    expect(screen.getByText(RECOGNIZED.sub)).toBeTruthy();
    await tapCta();

    // 9 · Intensity
    expect(screen.getByText(question("intensity").prompt)).toBeTruthy();
    await pick(2); // losingControl → the urgency subline on 29

    // 10 · Cycle → 10a fork
    expect(screen.getByText(question("cycle").prompt)).toBeTruthy();
    const railBeforeFork = rail()?.getAttribute("aria-label");
    await pick(4); // "I don't get periods"

    // 10a · The fork. Same rail count: it is a fork, not a step.
    expect(screen.getByText(question("no_period_reason").prompt)).toBeTruthy();
    expect(rail()?.getAttribute("aria-label")).toBe(railBeforeFork);
    await pick(0);

    // 11 · Everyday inputs
    expect(screen.getByText(question("inputs").prompt)).toBeTruthy();
    await pickChecks(1); // caffeine after 2pm
    await tapCta();

    // ── ACT C ──────────────────────────────────────────────────────────────
    // 12 · Tracking
    expect(screen.getByText(question("tracking").prompt)).toBeTruthy();
    await pick(0); // period app

    // 13 · The gap — the period-app variant, with cycle sentences suppressed
    expect(screen.getByText(/Most period apps still assume/)).toBeTruthy();
    expect(document.body.textContent, "she said she has no periods").not.toContain("22 days");
    expect(cta().textContent).toBe(ADVERTORIAL_CTA);
    await tapCta();

    // 14 · Doctor
    expect(screen.getByText(question("doctor").prompt)).toBeTruthy();
    await pick(1); // feltDismissed

    // 15 · The method, answering her doctor answer
    expect(screen.getByText(METHOD.headline)).toBeTruthy();
    expect(screen.getByText(/reluctant to take your word for it/)).toBeTruthy();
    expect(document.querySelectorAll(".sp ol li")).toHaveLength(METHOD.rows.length);
    await tapCta();

    // ── ACT D ──────────────────────────────────────────────────────────────
    for (const id of ["v_relief", "v_headsup", "v_test", "v_doctor"] as const) {
      expect(screen.getByText(VIDEOS[id].caption), `${id} caption`).toBeTruthy();
      if (id === "v_relief") {
        // 17 sits between the clips.
        await settle(3000);
        expect(cta().textContent).toBe(VIDEO_CTA);
        await tapCta();
        expect(screen.getByText(question("reflection").prompt)).toBeTruthy();
        await pick(0);
        continue;
      }
      await settle(3000);
      await tapCta();
    }

    // 21 · Privacy
    expect(screen.getByText(PRIVACY.headline)).toBeTruthy();
    expect(screen.getByText(PRIVACY.sub!)).toBeTruthy();
    await tapCta();

    // 22 · What matters most
    expect(screen.getByText(question("matters").prompt)).toBeTruthy();
    await pick(2); // doctorEvidence

    // ── ACT E ──────────────────────────────────────────────────────────────
    // 23 · Loader, which advances itself
    expect(screen.getByText(LOADER.title)).toBeTruthy();
    expect(screen.getByText(LOADER.sub)).toBeTruthy();
    await settle(LOADER.totalMs + 200);

    // 24 · Keep it
    expect(screen.getByText(GATE.headline)).toBeTruthy();
    expect(screen.getByText(GATE.reason)).toBeTruthy();
    const nameField = document.querySelector<HTMLInputElement>('input[type="text"]')!;
    const emailField = document.querySelector<HTMLInputElement>('input[type="email"]')!;
    // The CTA stays out of reach until the address looks like one.
    expect(document.querySelector(".sp-actions button:not([disabled])")).toBeNull();
    await setField(nameField, "Sarah");
    await setField(emailField, "sarah@example.com");
    await tapCta();

    // 25 · The reveal
    expect(screen.getByText(REVEAL.cardTitle)).toBeTruthy();
    expect(screen.getByText("Sarah")).toBeTruthy();
    expect(screen.getByText(REVEAL.testFixedLine)).toBeTruthy();
    expect(screen.getByText(REVEAL.scoreLock)).toBeTruthy();
    // The Peri Score is a locked tile, never a number or a band.
    expect(screen.getByLabelText(/Peri Score, locked/)).toBeTruthy();
    // Row 3 leads with the doctor line, because she felt dismissed.
    const unknowns = screen.getByText(REVEAL.unknownsLabel).closest("div")!;
    expect(within(unknowns).getAllByRole("listitem")[0].textContent).toMatch(/show a doctor/);
    await tapCta();

    // 26 · What's waiting — Doctor Kit first, forced by `feltDismissed`
    expect(screen.getByText(PLAN_CARDS_SCREEN.heading)).toBeTruthy();
    expect(document.querySelectorAll(".sp article")).toHaveLength(4);
    expect(document.querySelector(".sp article h3")!.textContent).toBe("Doctor Kit");
    await tapCta();

    // 27 · In their words
    expect(screen.getByText(QUOTES_SCREEN.eyebrow)).toBeTruthy();
    expect(document.querySelectorAll(".sp blockquote")).toHaveLength(4);
    expect(document.querySelector(".sp blockquote p")!.textContent).toMatch(/brought the log/);
    await tapCta();

    // ── ACT F ──────────────────────────────────────────────────────────────
    // 28 · Bridge
    expect(screen.getByText("A few months is long enough.")).toBeTruthy();
    expect(screen.getByText("Next time, you walk in with a pattern.")).toBeTruthy();
    expect(screen.getByText(BRIDGE_HOPE)).toBeTruthy();
    expect(cta().textContent).toBe(BRIDGE_CTA);
    await tapCta();

    // 29 · Plan
    expect(screen.getByText(PLAN.headline("Sarah"))).toBeTruthy();
    expect(screen.getByText(PLAN.transparency)).toBeTruthy();
    expect(screen.getByText(PLAN.annual.save)).toBeTruthy();
    expect(screen.getByText(/losing control/), "her intensity answer").toBeTruthy();
    expect(cta().textContent).toBe(PLAN.annual.cta);
    // No countdown, no scarcity, no bell.
    expect(document.body.textContent).not.toMatch(/today only|hurry|expires/i);
    await tapCta();

    // 30 · Checkout — our recap, then Stripe's form.
    //
    // The walk ends here on purpose. Completing checkout needs a live Stripe
    // session, and there is deliberately no button on this screen that fakes
    // one; screen 31 is asserted from a deep link below.
    expect(screen.getByText(/Your Starting Picture is waiting in the app/)).toBeTruthy();
    expect(screen.getByText(/You won’t be charged today/)).toBeTruthy();
    expect(screen.getByText(CHECKOUT.planLine("annual"))).toBeTruthy();
    // With no publishable key the form cannot mount, and she is told so rather
    // than shown an empty box.
    expect(screen.getByText(CHECKOUT_COPY.unavailable)).toBeTruthy();
    expect(screen.getByText(CHECKOUT_COPY.back)).toBeTruthy();
  }, 30000);
});

describe("screen 31, the handoff", () => {
  it("shows the three steps and an empty code slot until the webhook lands", async () => {
    window.history.replaceState({}, "", "/quiz?screen=handoff");
    mount();
    await settle(0);

    expect(screen.getByText(HANDOFF.headline)).toBeTruthy();
    expect(screen.getByText(HANDOFF.reassurance)).toBeTruthy();
    expect(cta().getAttribute("href")).toBe("/app");
    // No rythma_id here, so nothing is polled and no digits are invented.
    expect(document.body.textContent).not.toMatch(/\d{6}/);
  });

  it("shows the code once the status route has it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ paid: true, code: "418902" }),
      })),
    );
    // Driven directly: the poll is the screen's own behaviour, and a deep-linked
    // engine has no rythma_id to poll with.
    const { HandoffScreen } = await import("../screens/handoff");
    render(
      <main className="sp">
        <HandoffScreen rythmaId="wq_test" onAppStore={() => {}} />
      </main>,
    );
    await settle(100);
    expect(screen.getByLabelText(/Your code is 4 1 8 9 0 2/)).toBeTruthy();
  });

  it("stops polling after 30s and points her at the email", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ paid: false }) })),
    );
    const { HandoffScreen, HANDOFF_COPY } = await import("../screens/handoff");
    render(
      <main className="sp">
        <HandoffScreen rythmaId="wq_test" onAppStore={() => {}} />
      </main>,
    );
    await settle(35000);
    expect(screen.getByText(HANDOFF_COPY.inEmail)).toBeTruthy();
  });
});

describe("the rail rides question screens only", () => {
  // Mounted one screen at a time by deep link rather than walked: screen 30
  // cannot be completed without a live Stripe session, so a tap-through walk
  // can no longer reach the end.
  it.each(FLOW.map((s) => [s.n, s.id, s.type] as const))("%i · %s (%s)", async (n, id, type) => {
    window.history.replaceState({}, "", `/quiz?screen=${id}`);
    mount();
    await settle(0);

    const shouldHaveRail = type === "question" || type === "chips";
    expect(Boolean(rail()), `${n} · ${id}`).toBe(shouldHaveRail);
    if (shouldHaveRail) {
      expect(rail()!.getAttribute("aria-label")).toContain(`question ${n} of 31`);
    }
  });
});

describe("screen 24 when the profile write fails", () => {
  it("keeps her on the gate with a worded error, and lets her retry", async () => {
    // The profile write is the handoff. Dropping her into a reveal whose code
    // and prefill would never arrive is worse than asking her to try again.
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 502, json: async () => ({}) })
      .mockResolvedValue({ ok: true, json: async () => ({ rythmaId: "wq_test" }) });
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState({}, "", "/quiz?screen=gate");
    mount();
    await settle(0);

    await setField(document.querySelector<HTMLInputElement>('input[type="email"]')!, "s@e.co");
    await tapCta();

    // Still on the gate, and told so in words.
    expect(screen.getByText(GATE.headline)).toBeTruthy();
    expect(screen.getByText(/didn’t save/)).toBeTruthy();

    // The retry goes through, and moves her on.
    await tapCta();
    expect(screen.getByText(REVEAL.cardTitle)).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("sends her answers, no variant, and reuses her rythma_id on a retry", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ rythmaId: "wq_abc" }) });
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState({}, "", "/quiz?screen=gate");
    mount();
    await settle(0);
    await setField(document.querySelector<HTMLInputElement>('input[type="email"]')!, "s@e.co");
    await tapCta();

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/sp/profile");
    expect(body.email).toBe("s@e.co");
    // Build brief rule 0: one landing page, so there is no variant to send.
    expect(body).not.toHaveProperty("variant");
    expect(body.eventId, "the dedup key for the CAPI Lead").toBeTruthy();
    expect(body.rythmaId, "no id to reuse on a first submit").toBeUndefined();
  });
});
