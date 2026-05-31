import Image from "next/image";
import Link from "next/link";

const APP_STORE_URL = "https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611";

export function CTAButton({ variant = "default" }: { variant?: "default" | "large" }) {
  const { width, height } = variant === "large" ? { width: 200, height: 67 } : { width: 160, height: 54 };
  return (
    <Link
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-opacity hover:opacity-80"
      aria-label="Download Rythma on the App Store"
    >
      <Image src="/app-store-badge.svg" alt="Download on the App Store" width={width} height={height} />
    </Link>
  );
}
