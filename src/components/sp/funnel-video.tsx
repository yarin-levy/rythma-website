"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEO_PROGRESS_STEPS, type FunnelVideoSpec } from "@/lib/sp/data";
import { trackVideoCompleted, trackVideoProgress, trackVideoStarted } from "@/lib/sp/analytics";
import { PhoneFrame } from "./ui";

/**
 * A funnel clip in a drawn phone frame.
 *
 * Not gated (decision §12.6): the engine shows Continue at 3s whatever the clip
 * is doing, and progress is logged in 25% steps so a later decision to gate can
 * be made on numbers. A forced 40-second wait on a 4G in-app browser is a bigger
 * risk than a skipped clip.
 *
 * When `src` is empty — which is every clip today — the still-plus-caption
 * fallback renders instead, with the voiceover as body text (blueprint §6,
 * "Shipping without videos"). Nothing about the surrounding screen changes, so
 * dropping the real files in later is a data edit, not a rebuild.
 */
export function FunnelVideo({ spec }: { spec: FunnelVideoSpec }) {
  const video = useRef<HTMLVideoElement | null>(null);
  const [fired, setFired] = useState<number[]>([]);
  const started = useRef(false);
  const hasClip = spec.src.length > 0 || spec.webm.length > 0;

  useEffect(() => {
    // A still is not a play, so it reports neither started nor progress.
    if (!hasClip) return;
    setFired([]);
    started.current = false;
  }, [hasClip, spec.id]);

  function handlePlay() {
    if (started.current) return;
    started.current = true;
    trackVideoStarted(spec.id);
  }

  function handleTimeUpdate() {
    const el = video.current;
    if (!el || !el.duration || Number.isNaN(el.duration)) return;
    const pct = (el.currentTime / el.duration) * 100;
    for (const step of VIDEO_PROGRESS_STEPS) {
      if (pct >= step && !fired.includes(step)) {
        setFired((prev) => (prev.includes(step) ? prev : [...prev, step]));
        trackVideoProgress(spec.id, step);
      }
    }
  }

  return (
    <figure className="flex flex-col gap-4">
      <PhoneFrame>
        {hasClip ? (
          <video
            ref={video}
            className="size-full object-cover"
            poster={spec.poster || undefined}
            autoPlay
            muted
            playsInline
            loop={false}
            preload="metadata"
            onPlay={handlePlay}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => trackVideoCompleted(spec.id)}
          >
            {spec.webm && <source src={spec.webm} type="video/webm" />}
            {spec.src && <source src={spec.src} type="video/mp4" />}
          </video>
        ) : spec.poster ? (
          // A fixed-size
          // still inside a drawn frame; next/image adds a layout wrapper that
          // fights the 9:16 aspect box for no benefit here.
          <img src={spec.poster} alt="" className="size-full object-cover" />
        ) : (
          // No clip and no poster yet. The frame stays, and the clip's own words
          // carry the screen — never a blank state, never a dash as a value.
          <div className="flex size-full flex-col justify-center gap-3 px-5">
            {spec.alt.map((line, i) => (
              <p key={i} className="text-sp-ink text-[length:var(--sp-text-chip)] leading-[1.4]">
                {line}
              </p>
            ))}
          </div>
        )}
      </PhoneFrame>

      <figcaption className="flex flex-col gap-2">
        <p className="text-sp-ink2 text-[length:var(--sp-text-chip)] leading-[1.5]">{spec.caption}</p>
        {spec.note && <p className="text-sp-ink2 text-[length:var(--sp-text-label)] leading-[1.5]">{spec.note}</p>}
        {/* When the clip is present, its voiceover is still available as text. */}
        {hasClip && (
          <details className="text-sp-ink2 text-[length:var(--sp-text-label)]">
            <summary className="sp-tap min-h-[44px] cursor-pointer list-none underline">Read this instead</summary>
            <div className="flex flex-col gap-2 pt-2">
              {spec.alt.map((line, i) => (
                <p key={i} className="leading-[1.5]">
                  {line}
                </p>
              ))}
            </div>
          </details>
        )}
      </figcaption>
    </figure>
  );
}
