import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & Help Center - Rythma",
  description:
    "Get help with Rythma. Find answers to common questions or contact our support team.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
