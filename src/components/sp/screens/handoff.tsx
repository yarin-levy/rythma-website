"use client";

import { HANDOFF } from "@/lib/sp/data";
import { Actions, Footnote, Screen, SerifHeadline } from "../ui";

// The repo's own branded hop (next.config.ts), not Apple's URL directly: it
// carries no condition term, and the destination stays repointable.
const APP_STORE_URL = "/app";

/**
 * Screen 31 — the handoff. Replaces the App Store button as the last screen:
 * install, tap the door, enter the code.
 *
 * M1 has no code, because nothing has been paid. The slot renders as six empty
 * tabular cells — the shape of what she'll get, with no fabricated value in it
 * (grok handout §8.6). M3 fills it by polling the profile's status.
 */
export function HandoffScreen({ code, onAppStore }: { code?: string; onAppStore: () => void }) {
  const digits = (code ?? "").padEnd(6, " ").slice(0, 6).split("");

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

      <div
        className="flex justify-center gap-2"
        role="img"
        aria-label={code ? `Your code is ${digits.join(" ")}` : HANDOFF.steps[2].text}
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
