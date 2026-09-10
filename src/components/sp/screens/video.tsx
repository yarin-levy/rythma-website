"use client";

import { useEffect, useState } from "react";
import { VIDEO_CONTINUE_DELAY_MS, VIDEO_CTA, type FunnelVideoSpec } from "@/lib/sp/data";
import { FunnelVideo } from "../funnel-video";
import { Actions, PrimaryButton, Screen } from "../ui";

/**
 * A video screen. Continue fades in at 3s and nothing is gated — she can always
 * leave (decision §12.6). The frame, caption and text alternative are the
 * video component's job; the timing is this screen's.
 */
export function VideoScreen({ spec, onContinue }: { spec: FunnelVideoSpec; onContinue: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), VIDEO_CONTINUE_DELAY_MS);
    return () => clearTimeout(t);
  }, [spec.id]);

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center pt-2">
        <FunnelVideo spec={spec} />
      </div>
      <Actions>
        <div
          className={`w-full transition-opacity duration-300 ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <PrimaryButton onClick={onContinue}>{VIDEO_CTA}</PrimaryButton>
        </div>
      </Actions>
    </Screen>
  );
}
