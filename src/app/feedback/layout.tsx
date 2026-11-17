import type { Metadata, Viewport } from "next";

// Survey for existing and former subscribers, reached only from our emails.
// Focused chrome (no site nav) and kept out of search.
export const metadata: Metadata = {
  title: "Help us make Rythma better",
  description: "Six quick questions. About two minutes.",
  keywords: [],
  openGraph: {
    title: "Help us make Rythma better",
    description: "Six quick questions. About two minutes.",
    url: "https://rythma.co/feedback",
    siteName: "Rythma",
    type: "website",
    images: [],
  },
  twitter: { card: "summary", title: "Help us make Rythma better", images: [] },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F9F9F8",
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
