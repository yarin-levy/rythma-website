import type { Metadata } from "next";
import localFont from "next/font/local";
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
      <head>
        <script
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
      </head>
      <body className={`${inter.variable} ${newsreader.variable} antialiased`}>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Rythma",
              url: "https://rythma.co",
              logo: "https://rythma.co/logo.svg",
              description:
                "Rythma is the period and symptom tracker built for the unpredictability of perimenopause — it learns your patterns and predicts difficult days before they arrive.",
              slogan: "Know your hard days before they hit.",
              knowsAbout: [
                "Perimenopause",
                "Perimenopause symptoms",
                "Menopause",
                "Hot flashes",
                "Hormone changes",
                "Menstrual cycle tracking",
                "Women's midlife health",
              ],
            }),
          }}
        />

        {/* MobileApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "Rythma",
              operatingSystem: "iOS",
              applicationCategory: "HealthApplication",
              description:
                "Rythma learns your patterns and predicts perimenopause symptoms before they arrive, so you can plan your life around hard days.",
              url: "https://rythma.co",
              downloadUrl: "https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611",
              publisher: { "@type": "Organization", name: "Rythma", url: "https://rythma.co" },
            }),
          }}
        />

        <PostHogProvider>{children}</PostHogProvider>
        <Toaster />
      </body>
    </html>
  );
}
