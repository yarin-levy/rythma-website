"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  APP_STORE_URL,
  DEFAULT_PROMISES,
  HOPE_PROMISE,
  QUESTIONS,
  RESULTS,
  SYMPTOM_PROMISE,
  TIMELINE,
  WOUND_PROMISE,
  DISMISSED_WOUNDS,
  type PromiseCard,
} from "@/lib/quiz-data";
import type { ScoreResult } from "@/lib/quiz-score";
import { Icon, LockIcon } from "../icons";

// Pulled straight from the app's Stella V2 palette (Core/Theme/V2/Color+V2.swift)
// so the results screen and the app she lands in read as one product. The old
// gold accent here was a one-off and matched nothing in either codebase — lime
// is the real accent, and it's what the app already uses for its own stars.
const LIME = "#C9E229";
const TEAL_DEEP = "#06393D";
const INK = "#17191A";
const PAPER = "#F4EFE3";

/**
 * Screen 14 — the open loop, and the only screen whose job is the install.
 *
 * Deliberately sparse: she gets the count she earned and the band she landed
 * in, then three locked titles and a download button. No feature explanations —
 * the app's onboarding owns product conviction, and every extra sentence here
 * is a reason to keep reading instead of tapping.
 */
export function ResultsScreen({
  score,
  symptoms,
  hope,
  wound,
  onAppStore,
}: {
  score: ScoreResult;
  symptoms: string[];
  /** Q7 — what she said she wants back. Picks the lead card. */
  hope?: string;
  /** Q3 — how she was received. A dismissal forces the doctor-report card. */
  wound?: string;
  onAppStore: () => void;
}) {
  const n = symptoms.length;
  const validation =
    n === 0 ? RESULTS.validation.none : n === 1 ? RESULTS.validation.one : null;

  // ~95% of this traffic is mobile, but on desktop the App Store link is a dead
  // end — so that slice gets a QR instead of nothing. Coarse pointer ≈ touch.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* The CTA is a flex sibling, not an overlay, so this only needs to clear
         the fade gradient above it — not the whole button block. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 pt-3">
        {/* ① Validation count */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          {validation ? (
            <p className="font-display text-[22px] font-medium leading-[1.25] text-foreground">
              {validation}
            </p>
          ) : (
            <>
              <p className="font-display text-[56px] font-semibold leading-none text-primary">
                {n}
              </p>
              <p className="font-display mx-auto mt-2 max-w-[20rem] text-[18px] font-medium leading-[1.3] text-foreground">
                {RESULTS.validation.manyTail(n)}
              </p>
            </>
          )}
        </motion.div>

        {/* ② The locked score — the reason to download */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-5 flex flex-col items-center rounded-[26px] px-5 pb-6 pt-5 text-center"
          style={{ background: TEAL_DEEP, border: `2px solid ${INK}` }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: LIME }}
          >
            Your Peri Score
          </p>

          <div className="relative mt-4 flex size-[136px] items-center justify-center">
            <svg viewBox="0 0 120 120" className="size-[136px] -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="11" />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={LIME}
                strokeWidth="11"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: score.fill }}
                transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
              />
            </svg>

            {/* Her number, shown. The landing promised her a Peri Score, so
                withholding it here was a broken promise at the exact moment
                we ask for the install. */}
            <span
              className="absolute font-display text-[52px] font-semibold leading-none"
              style={{ color: PAPER }}
            >
              {score.display}
            </span>
          </div>

          <p
            className="font-display mt-4 text-[24px] font-semibold leading-none"
            style={{ color: LIME }}
          >
            {score.label}
          </p>
          <p className="mx-auto mt-2.5 max-w-[16rem] text-[12.5px] leading-relaxed text-white/55">
            {RESULTS.gaugeCaption}
          </p>
        </motion.div>

        {/* ③ Three locked cards, each earned by something she actually said */}
        <h2 className="font-display mt-6 text-[17px] font-medium text-foreground">
          {RESULTS.promisesHeading}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {promisesFor(symptoms, hope, wound).map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 rounded-[18px] px-4 py-3"
              style={{ background: "#ffffff", border: `1.5px solid ${INK}` }}
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: "var(--primary)", border: `1.5px solid ${INK}` }}
              >
                <Icon name={p.icon} className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] leading-snug text-ink-muted">
                  {p.eyebrow}
                </span>
                <span className="mt-0.5 block text-[15.5px] font-semibold leading-snug text-foreground">
                  {p.title}
                </span>
              </span>
              <LockIcon className="size-4 shrink-0 text-ink-muted" />
            </motion.li>
          ))}
        </ul>

        {/* ④ Time-gated value. The app cannot learn her retroactively, so every
            line here is something waiting costs her. No countdown, nothing
            invented — the calendar does the work. */}
        <h2 className="font-display mt-7 text-[17px] font-medium text-foreground">
          {TIMELINE.heading}
        </h2>
        <ol className="relative mt-4 flex flex-col gap-4 pl-6">
          <span
            aria-hidden
            className="absolute bottom-2 left-[5px] top-2 w-px"
            style={{ background: "var(--border)" }}
          />
          {TIMELINE.steps.map((s) => (
            <li key={s.label} className="relative">
              <span
                aria-hidden
                className="absolute -left-6 top-[3px] size-[11px] rounded-full"
                style={{ background: "var(--primary)", border: `1.5px solid ${INK}` }}
              />
              <p className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-primary">
                {s.label}
              </p>
              <p className="mt-0.5 text-[14.5px] leading-snug text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>

        {/* ④ Social proof — the app's own strip (PersonalizedPlanScreen):
            deep teal, ink border, lime stars and lime attribution. */}
        <div
          className="mt-5 flex flex-col items-center gap-2 rounded-[18px] px-4 py-4 text-center"
          style={{ background: TEAL_DEEP, border: `1.5px solid ${INK}` }}
        >
          <div className="flex items-center gap-1.5">
            <Stars />
            <span className="text-[13px] font-bold text-white">{RESULTS.rating}</span>
          </div>
          <p className="font-display max-w-[20rem] text-[13.5px] italic leading-snug text-white/90">
            &ldquo;{RESULTS.testimonial.quote}&rdquo;
          </p>
          <p
            className="text-[11.5px] font-bold uppercase tracking-[0.12em]"
            style={{ color: LIME }}
          >
            {RESULTS.testimonial.name}
          </p>
        </div>

        {/* ⑤ Desktop only — the CTA below can't reach an iPhone from here. */}
        {isDesktop && (
          <div className="mt-5 flex flex-col items-center gap-3 text-center">
            {/* Plain <img>, not next/image: the QR is a third-party URL and
                would need a remotePatterns entry for zero benefit. */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(APP_STORE_URL)}`}
              alt="Scan to download Rythma on the App Store"
              width={132}
              height={132}
              loading="lazy"
              className="rounded-xl bg-white p-2"
              style={{ border: `1.5px solid ${INK}` }}
            />
            <p className="max-w-[17rem] text-[12.5px] leading-relaxed text-ink-muted">
              {RESULTS.desktopNote}
            </p>
          </div>
        )}

        {/* ⑥ The close: what she earned, then what it costs to sit on it. */}
        {n > 0 && (
          <p className="font-display mt-6 text-center text-[16px] font-medium leading-snug text-foreground">
            {RESULTS.countLine(n)}
          </p>
        )}
        <p className="mx-auto mt-2.5 max-w-[21rem] text-center text-[13px] leading-relaxed text-ink-soft">
          {RESULTS.regret}
        </p>

      </div>

      {/* ⑦ Sticky download CTA.
          NOT target="_blank": this traffic arrives inside the Instagram and
          Facebook in-app browsers, which block or silently swallow new-tab
          opens — the tap looks broken. Navigating in place lets iOS hand the
          apps.apple.com URL straight to the App Store app. */}
      <div className="relative shrink-0 px-6 pb-2 pt-3">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-0 right-0 h-10"
          style={{ background: "linear-gradient(to bottom, rgba(249,249,248,0), #F9F9F8)" }}
        />
        <a
          href={APP_STORE_URL}
          onClick={onAppStore}
          className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 text-[17px] font-semibold text-primary-foreground shadow-3xl transition-transform active:scale-[0.98]"
        >
          <AppleGlyph />
          {RESULTS.cta}
        </a>
        <p className="mt-2 text-center text-[12px] text-ink-muted">{RESULTS.ctaSub}</p>
      </div>
    </div>
  );
}

/**
 * Three cards, most-earned first:
 *   1. the doctor report, if someone waved her off on Q3 (forced)
 *   2. otherwise the promise matching what she said she wants back (Q7)
 *   3. the rest from her own symptom picks, in the order the grid showed them
 * Deduped by title, so "Mood shifts" can't appear twice for anxiety + mood
 * swings, and the hope card can't repeat a card the wound rule already added.
 */
function promisesFor(symptoms: string[], hope?: string, wound?: string): PromiseCard[] {
  const out: PromiseCard[] = [];
  const seen = new Set<string>();

  const dismissed = !!wound && DISMISSED_WOUNDS.includes(wound);
  if (dismissed) {
    out.push(WOUND_PROMISE);
    seen.add(WOUND_PROMISE.title);
  }

  const lead = hope ? HOPE_PROMISE[hope] : undefined;
  // When the wound card is present it takes the lead slot; the hope card then
  // competes for the remaining two on equal footing with her symptoms.
  if (lead && !seen.has(lead.title) && !dismissed) {
    out.push(lead);
    seen.add(lead.title);
  }

  // Walk the grid in its displayed order so the list feels like her own.
  const order = (QUESTIONS.find((q) => q.id === "symptoms")?.options ?? []).map((o) => o.value);
  for (const value of order) {
    if (out.length >= 3) break;
    if (!symptoms.includes(value)) continue;
    const p = SYMPTOM_PROMISE[value];
    if (!p || seen.has(p.title)) continue;
    out.push(p);
    seen.add(p.title);
  }

  // Dismissed users still get their hope card if her symptoms didn't fill the
  // three slots, then generic fallbacks for anyone who checked nothing.
  for (const p of [...(lead ? [lead] : []), ...DEFAULT_PROMISES]) {
    if (out.length >= 3) break;
    if (seen.has(p.title)) continue;
    out.push(p);
    seen.add(p.title);
  }

  return out;
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M16.36 12.76c.02 2.5 2.2 3.34 2.22 3.35-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.75-.66s-1.67.64-2.72.68c-1.09.04-1.93-1.1-2.63-2.11-1.43-2.07-2.52-5.85-1.05-8.4.73-1.27 2.03-2.07 3.44-2.09 1.07-.02 2.09.72 2.75.72.66 0 1.89-.89 3.19-.76.54.02 2.07.22 3.05 1.66-.08.05-1.82 1.07-1.8 3.19M14.3 5.5c.58-.71.98-1.7.87-2.68-.84.03-1.86.56-2.47 1.27-.54.62-1.02 1.63-.89 2.59.94.07 1.9-.48 2.49-1.18" />
    </svg>
  );
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5" aria-label="Rated 4.9 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-[14px]" fill={LIME}>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
