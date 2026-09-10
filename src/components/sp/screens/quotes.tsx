"use client";

import { QUOTES, QUOTES_SCREEN } from "@/lib/sp/data";
import { Actions, Label, PrimaryButton, Screen } from "../ui";

/**
 * Screen 27. The four attested member quotes, first name and age, in the order
 * reveal.ts chose from her moment. No stars, no ratings, no "review", and
 * nothing framed as a store review (grok handout §8.5).
 */
export function QuotesScreen({ order, onContinue }: { order: readonly string[]; onContinue: () => void }) {
  const quotes = order.map((id) => QUOTES.find((q) => q.id === id)!);

  return (
    <Screen>
      <Label>{QUOTES_SCREEN.eyebrow}</Label>

      <div className="flex flex-1 flex-col justify-center gap-6">
        {quotes.map((quote) => (
          <blockquote key={quote.id} className="border-sp-hair border-t pt-4">
            <p className="font-sp-serif text-sp-ink text-[26px] leading-[1.2] italic">{quote.text}</p>
            <footer className="text-sp-ink2 mt-2 text-[length:var(--sp-text-label)]">— {quote.attribution}</footer>
          </blockquote>
        ))}
      </div>

      <Actions>
        <PrimaryButton onClick={onContinue}>{QUOTES_SCREEN.cta}</PrimaryButton>
      </Actions>
    </Screen>
  );
}
