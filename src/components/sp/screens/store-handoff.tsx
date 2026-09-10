"use client";

import { CLARITY_FOOTER, EVIDENCE_FOOTER, HANDOFF } from "@/lib/sp/data";
import { Actions, EvidenceFooter, Footnote, Screen, SerifHeadline } from "../ui";

const APP_STORE_URL = "/app";

/**
 * Path B (blueprint §11, `NEXT_PUBLIC_CHECKOUT_PATH=B`): screens 30 and 31
 * collapse into a single App Store handoff, with no payment on the web at all.
 *
 * Kept compiling and reachable for the day counsel or Apple says Path A cannot
 * stand. It costs nothing now and is a one-flag revert later. Nothing here
 * mentions a price, a plan or a code, because on this path she has bought
 * nothing yet — the app's own paywall meets her instead.
 */
export function StoreHandoffScreen({ onAppStore }: { onAppStore: () => void }) {
  return (
    <Screen>
      <SerifHeadline lines={[HANDOFF.headline]} />
      <p className="text-sp-ink2 text-[length:var(--sp-text-body)] leading-[1.5]">{HANDOFF.reassurance}</p>
      <Actions>
        <a
          href={APP_STORE_URL}
          onClick={onAppStore}
          className="sp-tap bg-sp-ink text-sp-page flex min-h-[60px] w-full items-center justify-center rounded-full px-6 text-[length:var(--sp-text-body)] font-semibold"
        >
          {HANDOFF.steps[0].text}
        </a>
        <Footnote>{CLARITY_FOOTER}</Footnote>
      </Actions>
      <EvidenceFooter text={EVIDENCE_FOOTER} />
    </Screen>
  );
}
