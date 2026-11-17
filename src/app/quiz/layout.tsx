import type { Metadata, Viewport } from "next";

// Focused funnel chrome — no site nav/footer. The root layout still provides
// <html>/<body>, fonts, the Meta Pixel and PostHog.

export const metadata: Metadata = {
  // Spec hard rule 1: no health terms in the URL, the <title>, or the meta
  // description. Keep this neutral even though the page is noindex — the title
  // is what Meta's own crawler reads when it categorizes the destination.
  title: "The 2-minute quiz — Rythma",
  description: "Answer a few quick questions and get your personal profile.",
  // These three are NOT optional decoration. Next inherits the root layout's
  // metadata into every route, and the root's keywords ("perimenopause",
  // "menopause", "hormone tracking") plus its og/twitter description ("predicts
  // perimenopause symptoms") are precisely what Meta's link scraper reads when
  // it categorizes an ad destination. Overriding them here is what keeps the
  // pixel out of the "Health & Wellness – Condition" bucket. Removing any of
  // these silently re-inherits the health copy.
  keywords: [],
  openGraph: {
    title: "The 2-minute quiz — Rythma",
    description: "Answer a few quick questions and get your personal profile.",
    url: "https://rythma.co/quiz",
    siteName: "Rythma",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "The 2-minute quiz — Rythma",
    description: "Answer a few quick questions and get your personal profile.",
    images: [],
  },
  // Paid-traffic lander: kept out of organic search so it never competes with
  // the main site, and so the results (which render at this same URL) can never
  // be crawled as a page of their own.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // viewport-fit:cover is what makes env(safe-area-inset-*) work on iPhone.
  viewportFit: "cover",
  // The Starting Picture funnel paints pure white and ignores the OS setting;
  // the old funnel's parchment stays until cutover.
  themeColor: process.env.NEXT_PUBLIC_QUIZ_V3 === "1" ? "#FFFFFF" : "#F9F9F8",
  // No maximumScale lock — pinch-zoom stays available for accessibility. The
  // 16px+ inputs already prevent the iOS focus-zoom jump.
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
