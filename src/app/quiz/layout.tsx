import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

// Focused funnel chrome — no site nav/footer. The root layout still provides
// <html>/<body>, the site fonts, the Meta Pixel and PostHog.

// The Starting Picture funnel's two faces (blueprint §2), declared HERE and not
// in the root layout. next/font preloads a font on every route under the layout
// that declares it, so declaring these at the root made the homepage and every
// blog post preload 78 KB of type they never use (build brief rule 6: don't
// touch the marketing site). Scoped to /quiz, only the funnel pays for them.
//
// `display: swap` keeps both off the LCP path: the headline paints in the
// fallback serif at once and swaps when Instrument Serif lands. The variables are
// set on the wrapper below, which is an ancestor of `.sp`.
const instrumentSerif = localFont({
  src: "../fonts/instrument-serif.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * The italic, declared on its own so it is NOT preloaded. The LP's only italic
 * is one short clause below the headline, and preloading it put a fourth
 * 21 KB font in the queue ahead of the text that decides LCP. The brief asks for
 * two preloads — the serif regular (the headline) and Archivo (everything else)
 * — and this is how it gets exactly two. globals.css points italic serif text at
 * this family; until it lands, the regular face renders and the browser slants it.
 */
const instrumentSerifItalic = localFont({
  src: "../fonts/instrument-serif-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif-italic",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const archivo = localFont({
  src: "../fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

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
  // `display: contents` so the wrapper carries the font variables without
  // becoming a box: the funnel shell's own layout is unchanged.
  return (
    <div
      className={`${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${archivo.variable}`}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
}
