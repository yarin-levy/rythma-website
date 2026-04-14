"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function BackgroundBlur({ className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Base cream background */}
      <div className="absolute inset-0 bg-[#F9F9F8]" />

      {/* Animated orbs */}
      <div className="absolute inset-0">
        {/* Main teal orb - top center */}
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full animate-orb-1"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(0, 70, 74, 0.2) 0%, rgba(0, 70, 74, 0.06) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Warm amber orb - left */}
        <div
          className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full animate-orb-2"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(196, 135, 46, 0.15) 0%, rgba(196, 135, 46, 0.04) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Accent deep orb - right */}
        <div
          className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] rounded-full animate-orb-3"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(0, 96, 100, 0.12) 0%, rgba(0, 96, 100, 0.03) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        {/* Secondary teal orb - bottom right */}
        <div
          className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full animate-orb-4"
          style={{
            background: "radial-gradient(circle at 60% 40%, rgba(0, 70, 74, 0.1) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
        />

        {/* Soft sage glow - center */}
        <div
          className="absolute top-[0%] left-[30%] w-[700px] h-[700px] rounded-full animate-orb-5"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(45, 125, 95, 0.12) 0%, rgba(0, 70, 74, 0.06) 30%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
