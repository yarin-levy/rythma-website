import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "sonner";
import { PostHogProvider } from "@/components/posthog-provider";
import "./globals.css";

// Self-hosted (from @fontsource-variable, copied into ./fonts). No build-time
// dependency on Google's CDN — faster LCP for paid traffic + GDPR-friendly.
const inter = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/newsreader-italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rythma.co"),
  title: "Rythma - Know Your Hard Days Before They Hit",
  description: "Rythma is the app that learns your patterns and predicts perimenopause symptoms before they arrive. Finally plan your life around perimenopause, not the other way around.",
  keywords: ["perimenopause", "menopause", "symptom tracker", "health app", "women's health", "hormone tracking"],
  // Declare the homepage canonical so Google doesn't treat rythma.co, rythma.co/,
  // and the http/www redirect variants as separate duplicate URLs. (This was the
  // only page missing a canonical — the trigger for GSC's "Duplicate without
  // user-selected canonical" warning.)
  alternates: { canonical: "https://rythma.co" },
  openGraph: {
    title: "Rythma - Know Your Hard Days Before They Hit",
    description: "Rythma learns your patterns and predicts perimenopause symptoms before they arrive.",
    url: "https://rythma.co",
    siteName: "Rythma",
    type: "website",
    images: [{ url: "/og-cover.jpg", width: 1200, height: 675 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rythma - Know Your Hard Days Before They Hit",
    description: "Rythma learns your patterns and predicts perimenopause symptoms before they arrive.",
    images: ["/og-cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} antialiased`}>
        {/* FB Pixel loads after hydration (next/script) so it doesn't block
            first paint / LCP the way the old inline <head> script did. */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '862926626501765');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=862926626501765&ev=PageView&noscript=1"
          />
        </noscript>
        {/* Organization + MobileApplication schema render on the homepage only
            (components/site-schema.tsx). Keeping them here put "Perimenopause",
            "Hot flashes" and applicationCategory:"HealthApplication" into the
            HTML of /quiz, which must stay neutral for Meta's crawler. */}

        <PostHogProvider>{children}</PostHogProvider>
        <Toaster />
      </body>
    </html>
  );
}
