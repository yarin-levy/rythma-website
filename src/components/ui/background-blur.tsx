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
      {/* Base white background */}
      <div className="absolute inset-0 bg-[#F9FAFB]" />

      {/* Animated orbs */}
      <div className="absolute inset-0">
        {/* Main raspberry orb - top center */}
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full animate-orb-1"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(225, 29, 72, 0.25) 0%, rgba(225, 29, 72, 0.08) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Tangerine orb - left */}
        <div
          className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full animate-orb-2"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Cyan orb - right */}
        <div
          className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] rounded-full animate-orb-3"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(8, 145, 178, 0.15) 0%, rgba(8, 145, 178, 0.03) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        {/* Secondary raspberry orb - bottom right */}
        <div
          className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full animate-orb-4"
          style={{
            background: "radial-gradient(circle at 60% 40%, rgba(225, 29, 72, 0.12) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
        />

        {/* Soft tangerine glow - center */}
        <div
          className="absolute top-[0%] left-[30%] w-[700px] h-[700px] rounded-full animate-orb-5"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255, 237, 213, 0.4) 0%, rgba(254, 226, 226, 0.2) 30%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
