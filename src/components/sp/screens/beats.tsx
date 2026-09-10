"use client";

import { ADVERTORIAL_CTA, BRIDGE_CTA, CLARITY_FOOTER, ECHO_KICKER, RECOGNIZED, type RuledScreen } from "@/lib/sp/data";
import type { Bridge } from "@/lib/sp/reveal";
import type { Echo } from "@/lib/sp/data";
import { Actions, Footnote, PrimaryButton, Prompt, RuledRows, Screen, SerifHeadline, Sub } from "../ui";

/** Screen 2. Serif, italic on the last clause, one kicker under every version. */
export function EchoScreen({ echo, onContinue }: { echo?: Echo; onContinue: () => void }) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-8">
        {echo && <SerifHeadline lines={echo.lines} />}
        <p className="text-sp-ink text-[length:var(--sp-text-body)] font-semibold">{ECHO_KICKER}</p>
      </div>
      <Actions>
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </Actions>
    </Screen>
  );
}

/**
 * Screen 8. The first place "perimenopause" appears — client-side only, and
 * only after she has named symptoms (blueprint §9, Meta copy rule).
 */
export function RecognizedScreen({
  count,
  headline,
  onContinue,
}: {
  count: number;
  headline: string;
  onContinue: () => void;
}) {
  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-6">
        <span className="font-sp-serif text-sp-ink text-[64px] leading-none tabular-nums" aria-hidden>
          {count}
        </span>
        <h2 className="text-sp-ink text-[length:var(--sp-text-prompt)] leading-[1.2] font-semibold">{headline}</h2>
        <Sub>
          {RECOGNIZED.sub} <em className="font-sp-serif italic">{RECOGNIZED.subItalic}</em>
        </Sub>
      </div>
      <Actions>
        <PrimaryButton onClick={onContinue}>{RECOGNIZED.cta}</PrimaryButton>
      </Actions>
    </Screen>
  );
}

/** Screen 13. Three short paragraphs, branched on 12 and cycle-suppressed by 10. */
export function AdvertorialScreen({
  paragraphs,
  onContinue,
}: {
  paragraphs: readonly string[];
  onContinue: () => void;
}) {
  return (
    <Screen>
      <div className="flex flex-col gap-5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.5]">
            {p}
          </p>
        ))}
      </div>
      <Actions>
        <PrimaryButton onClick={onContinue}>{ADVERTORIAL_CTA}</PrimaryButton>
      </Actions>
    </Screen>
  );
}

/**
 * Screens 15 and 21 — the same ruled shape, numbered or not. 15 carries an echo
 * from her doctor answer on top, which turns a diagram into a reply.
 */
export function RuledBeatScreen({
  screen,
  echo,
  onContinue,
}: {
  screen: RuledScreen;
  echo?: string;
  onContinue: () => void;
}) {
  return (
    <Screen>
      {echo && (
        <p className="font-sp-serif text-sp-ink2 text-[length:var(--sp-text-body)] leading-[1.4] italic">{echo}</p>
      )}
      <Prompt>{screen.headline}</Prompt>
      <RuledRows rows={screen.rows} numbered={screen.numbered} />
      {screen.sub && <Footnote>{screen.sub}</Footnote>}
      <Actions>
        <PrimaryButton onClick={onContinue}>{screen.cta}</PrimaryButton>
      </Actions>
    </Screen>
  );
}

/** Screen 28. {Duration}. {Moment}. {Hope}. The hope line is locked. */
export function BridgeScreen({ bridge, onContinue }: { bridge: Bridge; onContinue: () => void }) {
  const lead = [bridge.duration, bridge.moment].filter(Boolean) as string[];

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-6">
        {lead.length > 0 && <SerifHeadline lines={lead} italicLast={false} />}
        <p className="font-sp-serif text-sp-ink text-[length:var(--sp-text-serif)] leading-[1.1] italic">
          {bridge.hope}
        </p>
      </div>
      <Actions>
        <PrimaryButton onClick={onContinue}>{BRIDGE_CTA}</PrimaryButton>
        <Footnote>{CLARITY_FOOTER}</Footnote>
      </Actions>
    </Screen>
  );
}
