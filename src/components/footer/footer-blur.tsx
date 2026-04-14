"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function FooterBlur({ className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 -z-10 h-full w-full overflow-hidden",
        className,
      )}
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-[#F9F9F8]" />

      {/* Animated orbs matching hero */}
      <div className="absolute inset-0">
        {/* Main teal orb */}
        <div
          className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 70%, rgba(0, 70, 74, 0.15) 0%, rgba(0, 70, 74, 0.04) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Warm amber orb - left */}
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 60%, rgba(196, 135, 46, 0.12) 0%, rgba(196, 135, 46, 0.03) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Accent deep orb - right */}
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(0, 96, 100, 0.1) 0%, rgba(0, 96, 100, 0.02) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>
    </div>
  );
}
