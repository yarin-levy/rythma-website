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
      <div className="absolute inset-0 bg-[#F9FAFB]" />

      {/* Animated orbs matching hero */}
      <div className="absolute inset-0">
        {/* Main raspberry orb */}
        <div
          className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 70%, rgba(225, 29, 72, 0.2) 0%, rgba(225, 29, 72, 0.05) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Tangerine orb - left */}
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.03) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Cyan orb - right */}
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(8, 145, 178, 0.12) 0%, rgba(8, 145, 178, 0.02) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>
    </div>
  );
}
