"use client";

import { PLAN_CARDS, PLAN_CARDS_SCREEN, VIDEOS, type PlanCardId } from "@/lib/sp/data";
import { Actions, Label, PrimaryButton, Prompt, Screen } from "../ui";

/**
 * Screen 26. Four cards, ordered by what she said matters most (22), then by
 * her hard-day answer (17), with `feltDismissed` forcing Doctor Kit first — the
 * order arrives already computed from reveal.ts.
 *
 * Each card carries a still from its clip. Until the clips land there is no
 * still, so the card shows the frame and its own words; nothing is faked.
 */
export function PlanCardsScreen({ order, onContinue }: { order: readonly PlanCardId[]; onContinue: () => void }) {
  const cards = order.map((id) => PLAN_CARDS.find((c) => c.id === id)!);

  return (
    <Screen>
      <Prompt>{PLAN_CARDS_SCREEN.heading}</Prompt>

      <div className="flex flex-col gap-3">
        {cards.map((card) => {
          const poster = VIDEOS[card.video]?.poster;
          return (
            <article key={card.id} className="border-sp-hair flex gap-4 rounded-2xl border-[1.5px] p-3">
              <div className="border-sp-ink shrink-0 overflow-hidden rounded-xl border-2">
                <div className="bg-sp-page aspect-[9/16] w-14">
                  {poster && (
                    // A
                    // fixed 9:16 still inside a drawn frame.
                    <img src={poster} alt="" className="size-full object-cover" />
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-1">
                <Label>{card.eyebrow}</Label>
                <h3 className="text-sp-ink text-[length:var(--sp-text-body)] leading-[1.25] font-semibold">
                  {card.title}
                </h3>
              </div>
            </article>
          );
        })}
      </div>

      <ol className="border-sp-hair flex flex-col border-t">
        {PLAN_CARDS_SCREEN.timeline.map((row) => (
          <li
            key={row.when}
            className="border-sp-hair text-sp-ink flex flex-wrap gap-x-2 border-b py-3 text-[length:var(--sp-text-chip)] leading-[1.4]"
          >
            <strong className="font-semibold tabular-nums">{row.when}</strong>
            <span className="text-sp-ink2">{row.what}</span>
          </li>
        ))}
      </ol>

      <Actions>
        <PrimaryButton onClick={onContinue}>{PLAN_CARDS_SCREEN.cta}</PrimaryButton>
      </Actions>
    </Screen>
  );
}
