"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { EMAIL_CAPTURE, PRIVACY_URL } from "@/lib/quiz-data";

/**
 * Screen 13 — skippable by design. The results are what she came for, and the
 * open loop on the next screen is what drives the install; holding the results
 * hostage behind an email would cost more installs than the list is worth.
 *
 * The email never touches the pixel or the URL. It goes to /api/quiz-lead, which
 * is also the only thing that may forward it to Meta (hashed, via the CAPI).
 */
export function EmailScreen({
  onSubmit,
  onSkip,
}: {
  /** Resolves true on success; the engine advances and fires `Lead`. */
  onSubmit: (email: string) => Promise<boolean>;
  onSkip: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || status === "loading") return;
    setStatus("loading");
    const ok = await onSubmit(email.trim());
    if (!ok) setStatus("error");
    // on success the engine moves us to the results
  };

  return (
    <div className="flex h-full flex-col px-6 pb-2 pt-6">
      {/* justify-end, not center: it keeps the submit button in the thumb zone,
          and keeps its large drop shadow off the middle of the screen where it
          renders as a visible grey slab. */}
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto pb-3">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-[30px] font-medium leading-[1.14] tracking-tight text-foreground sm:text-[34px]"
        >
          {EMAIL_CAPTURE.headline}
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col gap-3"
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="go"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={EMAIL_CAPTURE.placeholder}
            required
            aria-label="Email address"
            className="quiz-tap h-[58px] w-full rounded-2xl border border-border bg-card px-5 text-[16px] text-foreground shadow-sm outline-none placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            /* Tighter shadow than the other CTAs: the skip link and the legal
               line sit under this button, and shadow-3xl's 100px spread lands
               on both as a grey slab. */
            className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[18px] font-semibold text-primary-foreground shadow-[0_10px_28px_rgba(0,70,74,0.20)] transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {status === "loading" ? "Sending…" : EMAIL_CAPTURE.cta}
          </button>
        </motion.form>

        {status === "error" && (
          <p className="mt-3 text-center text-[14px] text-destructive">
            Something went wrong. Please try again.
          </p>
        )}

        <motion.button
          type="button"
          onClick={onSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="quiz-tap mx-auto mt-5 min-h-[44px] px-4 text-[15px] font-medium text-ink-soft underline underline-offset-4"
        >
          {EMAIL_CAPTURE.skip}
        </motion.button>
      </div>

      <p className="shrink-0 px-2 pb-1 text-center text-[13px] leading-relaxed text-ink-muted">
        {EMAIL_CAPTURE.microcopy}{" "}
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
