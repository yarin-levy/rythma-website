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
  description: "Rythma learns your patterns and predicts perimenopause symptoms before they arrive. Finally plan your life around perimenopause—not the other way around.",
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
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
