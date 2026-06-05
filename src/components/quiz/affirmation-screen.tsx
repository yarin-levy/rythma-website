"use client";

import { motion } from "motion/react";

/** Full-bleed warm line shown ~1.2s between questions — makes her feel heard. */
export function AffirmationScreen({ text }: { text: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="font-display text-[26px] font-medium italic leading-snug text-primary sm:text-[30px]">
          {text}
        </p>
      </motion.div>
    </div>
  );
}
