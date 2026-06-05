import type { Metadata, Viewport } from "next";

// Focused funnel chrome — no site nav/footer. The root layout still provides
// <html>/<body>, fonts, and the Meta Pixel.

export const metadata: Metadata = {
  title: "Is Rythma built for you? — Rythma",
  description:
    "Answer 8 quick questions about how you've been feeling and find out if Rythma is built for you.",
  // Paid-traffic lander — keep it out of organic search to avoid competing with
  // the main site. Remove this if you want it indexable.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // viewport-fit:cover is what makes env(safe-area-inset-*) work on iPhone.
  viewportFit: "cover",
  themeColor: "#F9F9F8",
  // No maximumScale lock — keep pinch-zoom available for accessibility. The
  // 16px+ inputs already prevent the iOS focus-zoom jump.
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
