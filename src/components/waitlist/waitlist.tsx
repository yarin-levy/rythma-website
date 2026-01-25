"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Waitlist error:", error);
      setStatus("error");
    }
  };

  return (
    <section
      id="waitlist"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 100% 80% at center,
          rgba(255,255,255,1) 0%,
          rgba(255,255,255,1) 50%,
          rgba(225,29,72,0.05) 70%,
          rgba(225,29,72,0.1) 85%,
          rgba(249,250,251,1) 100%
        )`,
        boxShadow: `
          inset 0 0 60px rgba(225, 29, 72, 0.06),
          inset 0 0 120px rgba(225, 29, 72, 0.03)
        `,
      }}
    >
      <div className="mx-auto max-w-2xl px-6 text-center relative z-10">
        <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl mb-3">
          Ready to stop guessing?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join 2,000+ women on the waitlist.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center">
            <svg className="w-14 h-14 mb-4 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-xl font-semibold text-foreground">You&apos;re on the list!</p>
            <p className="text-muted-foreground mt-2">We&apos;ll let you know as soon as Rythma launches.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3.5 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-transparent shadow-md text-base"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-raspberry hover:bg-raspberry/90 text-white px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg animate-pulse-glow"
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
            {status === "error" && (
              <p className="mt-3 text-sm text-red-500">
                Something went wrong. Please try again.
              </p>
            )}
            <p className="mt-5 text-sm text-muted-foreground">
              <span className="font-semibold text-raspberry">First 500</span> get 50% off for life
            </p>
          </>
        )}
      </div>
    </section>
  );
}
