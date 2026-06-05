"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { EMAIL_CAPTURE, PRIVACY_URL } from "@/lib/quiz-data";

/**
 * Email capture (brief §3, Screen 12) — framed as accepting the invitation.
 * This is the single most important conversion event (fires Meta `Lead`).
 */
export function EmailScreen({
  onSubmit,
}: {
  /** Resolves true on success; the orchestrator handles analytics + advance. */
  onSubmit: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || status === "loading") return;
    setStatus("loading");
    const ok = await onSubmit(email.trim());
    if (!ok) setStatus("error");
    // on success the orchestrator advances away from this screen
  };

  return (
    <div className="flex h-full flex-col bg-background px-6 pb-2 pt-6">
      <div className="flex flex-1 flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[38px]"
        >
          {EMAIL_CAPTURE.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-[18px] leading-relaxed text-ink-soft"
        >
          {EMAIL_CAPTURE.body}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
            className="quiz-tap flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[18px] font-semibold text-primary-foreground shadow-3xl transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {status === "loading" ? "Saving your place…" : EMAIL_CAPTURE.cta}
            {status !== "loading" && <span aria-hidden>→</span>}
          </button>
        </motion.form>

        {status === "error" && (
          <p className="mt-3 text-center text-[14px] text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
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
