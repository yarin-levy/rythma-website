"use client";

import { motion } from "motion/react";
import {
  AGE_REVEAL,
  REVEAL,
  REVEAL_BENEFITS,
  REVEAL_REVIEW_CARD,
  REVEAL_REVIEW_TOP,
  REVEAL_SOCIAL,
  WOUND_ECHO,
  type RevealBenefit,
  type RevealReview,
} from "@/lib/quiz-data";

const GOLD = "#E7B24C";

function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-[15px]" fill={GOLD}>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function AvatarRow() {
  return (
    <div className="flex -space-x-2.5">
      {REVEAL_SOCIAL.avatars.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          width={32}
          height={32}
          loading="eager"
          className="size-8 rounded-full border-2 border-[#0A565B] object-cover"
        />
      ))}
    </div>
  );
}

function BenefitIcon({ icon }: { icon: RevealBenefit["icon"] }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "size-5" };
  if (icon === "calendar")
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    );
  if (icon === "pattern")
    return (
      <svg {...common}>
        <path d="M3 12c2 0 2-5 4-5s2 9 4 9 2-9 4-9 2 5 4 5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ReviewLine({ review }: { review: RevealReview }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Stars n={review.stars} />
      <p className="text-[15px] font-medium text-[#F9F9F8]">
        &ldquo;{review.quote}&rdquo;
      </p>
      <p className="text-[12px] uppercase tracking-[0.12em] text-white/55">{review.name}</p>
    </div>
  );
}

/**
 * Acceptance reveal (brief §3, Screen 11) — the emotional peak, in the brand's
 * deep teal with cream type for a distinct, intimate "you've arrived" moment.
 * Scrollable content with the CTA pinned to the thumb zone. Age line leads
 * (hardest-hitting beat), wound echo pairs with it; then a gentle push to the app.
 */
export function RevealScreen({
  age,
  wound,
  onClaim,
}: {
  age?: string;
  wound?: string;
  onClaim: () => void;
}) {
  const ageLine = age ? AGE_REVEAL[age] : undefined;
  const woundLine = wound ? WOUND_ECHO[wound] : undefined;

  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="flex h-full flex-col text-[#F9F9F8]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3">
        {/* ① Social-proof block — faces + community count + a real review */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-7 flex flex-col items-center gap-2.5 text-center"
        >
          <AvatarRow />
          <p className="text-[13px] font-medium text-white/80">{REVEAL_SOCIAL.joinedLine}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <Stars />
            <p className="text-[13px] text-white/75">
              <span className="font-semibold text-[#F9F9F8]">&ldquo;{REVEAL_REVIEW_TOP.quote}&rdquo;</span>{" "}
              — {REVEAL_REVIEW_TOP.name}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.14, delayChildren: 0.05 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          {/* ② Hero */}
          <motion.h1
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display text-[42px] font-semibold leading-[1.04] tracking-tight text-[#F9F9F8] sm:text-[48px]"
          >
            {REVEAL.headline}
          </motion.h1>

          <motion.p variants={item} className="max-w-md text-[18px] leading-relaxed text-white/80">
            {REVEAL.body}
          </motion.p>

          {/* ③ Personalized validation box */}
          {ageLine && (
            <motion.div
              variants={item}
              className="w-full rounded-2xl border border-white/12 bg-white/[0.07] px-5 py-4 text-left"
            >
              <p className="text-[16px] leading-relaxed text-[#F9F9F8]">{ageLine}</p>
              {woundLine && (
                <p className="mt-3 border-t border-white/12 pt-3 text-[16px] leading-relaxed text-[#F9F9F8]">
                  {woundLine}
                </p>
              )}
            </motion.div>
          )}

          {/* ④ Flip line */}
          <motion.p
            variants={item}
            className="font-display text-[19px] font-medium italic leading-snug"
            style={{ color: GOLD }}
          >
            {REVEAL.flipLine}
          </motion.p>
        </motion.div>

        {/* Divider */}
        <div className="mx-auto my-8 h-px w-16 bg-white/15" />

        {/* ⑤ Bridge */}
        <h2 className="font-display mb-5 text-center text-[22px] font-medium leading-snug text-[#F9F9F8]">
          {REVEAL.bridge}
        </h2>

        {/* ⑥ Benefits */}
        <ul className="flex flex-col gap-3.5">
          {REVEAL_BENEFITS.map((b) => (
            <li key={b.title} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F9F9F8]">
                <BenefitIcon icon={b.icon} />
              </span>
              <p className="pt-1 text-[16px] leading-snug text-white/85">
                <span className="font-semibold text-[#F9F9F8]">{b.title}</span> — {b.text}
              </p>
            </li>
          ))}
        </ul>

        {/* ⑦ Reinforcing review card */}
        <div className="mt-7 rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-5">
          <ReviewLine review={REVEAL_REVIEW_CARD} />
        </div>

        {/* ⑧ Reassurance */}
        <p className="mx-auto mt-6 max-w-xs text-center text-[13px] leading-relaxed text-white/55">
          {REVEAL.reassurance}
        </p>
      </div>

      {/* ⑨ Sticky CTA */}
      <div className="relative shrink-0 px-6 pb-2 pt-3">
        {/* fade so content scrolls under the CTA */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 left-0 right-0 h-8"
          style={{ background: "linear-gradient(to bottom, rgba(0,56,60,0), #003a3e)" }}
        />
        <button
          type="button"
          onClick={onClaim}
          className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#F9F9F8] px-6 text-[18px] font-semibold text-primary shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform active:scale-[0.98]"
        >
          {REVEAL.cta}
          <span aria-hidden>→</span>
        </button>
        <p className="mt-2.5 text-center text-[12px] text-white/55">{REVEAL.ctaSub}</p>
      </div>
    </div>
  );
}
