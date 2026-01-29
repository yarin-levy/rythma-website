import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rythma - Know Your Hard Days Before They Hit",
  description: "Rythma is the app that learns your patterns and predicts perimenopause symptoms before they arrive. Finally plan your life around perimenopause, not the other way around.",
  keywords: ["perimenopause", "menopause", "symptom tracker", "health app", "women's health", "hormone tracking"],
  openGraph: {
    title: "Rythma - Know Your Hard Days Before They Hit",
    description: "Rythma learns your patterns and predicts perimenopause symptoms before they arrive.",
    url: "https://rythma.co",
    siteName: "Rythma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rythma - Know Your Hard Days Before They Hit",
    description: "Rythma learns your patterns and predicts perimenopause symptoms before they arrive.",
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
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
