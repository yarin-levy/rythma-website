"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { APP_STORE_URL, DOWNLOAD } from "@/lib/quiz-data";
import { trackDownloadClick } from "@/lib/quiz-analytics";

/**
 * Download handoff (brief §3, Screen 13). Primary CTA is the official App Store
 * badge. On desktop, the app is mobile-only — show a QR + "open on your phone".
 */
export function DownloadScreen() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Coarse pointer + no fine pointer ≈ touch device. Anything else → desktop.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setIsDesktop(!coarse);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex size-16 items-center justify-center rounded-full bg-primary/10"
      >
        <svg viewBox="0 0 24 24" className="size-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-[34px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[38px]"
      >
        {DOWNLOAD.headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="max-w-[22rem] text-[18px] leading-relaxed text-ink-soft"
      >
        {DOWNLOAD.body}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.26 }}
        className="flex flex-col items-center gap-4 pt-2"
      >
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackDownloadClick}
          className="quiz-tap inline-block transition-transform active:scale-[0.97]"
        >
          <img src="/app-store-badge.svg" alt="Download on the App Store" className="h-[56px] w-auto" />
        </a>

        {isDesktop && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(APP_STORE_URL)}`}
              alt="Scan to download Rythma on the App Store"
              width={140}
              height={140}
              loading="lazy"
              className="rounded-xl border border-border bg-white p-2"
            />
            <p className="max-w-[18rem] text-[13px] leading-relaxed text-ink-muted">
              {DOWNLOAD.desktopNote}
            </p>
          </div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="font-display pt-2 text-[16px] font-medium italic text-primary"
      >
        {DOWNLOAD.closing}
      </motion.p>
    </div>
  );
}
