"use client";

import { useEffect, useState } from "react";
import { HANDOFF } from "@/lib/sp/data";
import { Actions, Footnote, Screen, SerifHeadline } from "../ui";

// The repo's own branded hop (next.config.ts), not Apple's URL directly: it
// carries no condition term, and the destination stays repointable.
const APP_STORE_URL = "/app";

/** Every 2s after success until `paid`, then stop (build brief M3). */
const POLL_MS = 2000;
const POLL_LIMIT_MS = 30000;

/**
 * NEW STRINGS (for Yarin). The blueprint gives screen 31 its three steps and
 * its reassurance, but not the two states the code slot can be in while it is
 * being fetched. The brief names the second one ("check your email").
 */
export const HANDOFF_COPY = {
  fetching: "Getting your code…",
  inEmail: "Your code is in the email we just sent.",
  /** §2b: say which address, because the app redeems the code with it. */
  sameEmail: "Enter it with the email you used here.",
} as const;

/**
 * Screen 31 — the handoff. Install, tap the door, enter the code.
 *
 * The code is minted by the Stripe webhook, server to server, so the browser
 * polls for it. A miss is not a failure: after 30 seconds this stops asking and
 * points her at the email the webhook has already sent, which is the same six
 * digits. She is never blocked on our infrastructure winning a race.
 */
export function HandoffScreen({
  rythmaId,
  onAppStore,
}: {
  /** Absent when she reached this screen without paying (Path B, or dev). */
  rythmaId?: string;
  onAppStore: () => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const [givenUp, setGivenUp] = useState(false);

  useEffect(() => {
    if (!rythmaId) return;
    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/sp/profile/${encodeURIComponent(rythmaId!)}/status`);
        if (res.ok) {
          const body = (await res.json()) as { paid?: boolean; code?: string };
          if (body.paid && body.code) {
            if (!cancelled) setCode(body.code);
            return;
          }
        }
      } catch {
        // A failed poll is indistinguishable from a slow webhook; keep trying
        // until the cap, then fall back to the email.
      }
      if (cancelled) return;
      if (Date.now() - startedAt >= POLL_LIMIT_MS) {
        setGivenUp(true);
        return;
      }
      timer = setTimeout(poll, POLL_MS);
    }

    let timer = setTimeout(poll, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [rythmaId]);

  const digits = (code ?? "").padEnd(6, " ").slice(0, 6).split("");
  const waiting = Boolean(rythmaId) && !code && !givenUp;

  return (
    <Screen>
      <SerifHeadline lines={[HANDOFF.headline]} />

      <ol className="border-sp-hair flex flex-col border-t">
        {HANDOFF.steps.map((step, i) => (
          <li
            key={i}
            className="border-sp-hair text-sp-ink flex gap-3 border-b py-4 text-[length:var(--sp-text-body)] leading-[1.4]"
          >
            <span className="text-sp-ink3 shrink-0 font-semibold tabular-nums" aria-hidden>
              {i + 1}
            </span>
            <span>
              {step.text}
              {"strong" in step && step.strong && (
                <>
                  {" "}
                  <strong className="font-semibold">{step.strong}</strong>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-center gap-3">
        <div
          className="flex justify-center gap-2"
          role="img"
          aria-label={code ? `Your code is ${digits.join(" ")}` : HANDOFF_COPY.fetching}
        >
          {digits.map((digit, i) => (
            <span
              key={i}
              className="border-sp-hair font-sp-serif text-sp-ink flex size-12 items-center justify-center rounded-xl border-[1.5px] text-[28px] tabular-nums"
            >
              {digit.trim()}
            </span>
          ))}
        </div>
        {waiting && <Footnote>{HANDOFF_COPY.fetching}</Footnote>}
        {givenUp && <Footnote>{HANDOFF_COPY.inEmail}</Footnote>}
        {code && <Footnote>{HANDOFF_COPY.sameEmail}</Footnote>}
      </div>

      <p className="text-sp-ink2 text-[length:var(--sp-text-body)] leading-[1.5]">{HANDOFF.reassurance}</p>

      <Actions>
        <a
          href={APP_STORE_URL}
          onClick={onAppStore}
          className="sp-tap bg-sp-ink text-sp-page flex min-h-[60px] w-full items-center justify-center rounded-full px-6 text-[length:var(--sp-text-body)] font-semibold"
        >
          {HANDOFF.steps[0].text}
        </a>
        <Footnote>{HANDOFF.small}</Footnote>
      </Actions>
    </Screen>
  );
}
