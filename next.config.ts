import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/blog": [".contentlayer/generated/**"],
    "/blog/[slug]": [".contentlayer/generated/**"],
  },
  // Required for the PostHog reverse proxy: PostHog's API uses trailing
  // slashes, so don't let Next strip/redirect them on /ingest paths.
  skipTrailingSlashRedirect: true,
  // PostHog reverse proxy — route analytics through our own domain (/ingest)
  // so ad blockers / privacy extensions can't recognize and drop the requests.
  // (US cloud hosts; assets come from us-assets, everything else from us.i.)
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/7.x/**",
      },
    ],
  },
  async redirects() {
    return [
      // Branded App Store link for ads, bio links, email signatures and print.
      // No country code in the destination: Apple then routes each visitor to
      // their own storefront instead of pinning everyone to the US store.
      // Deliberately NOT permanent — a 308 gets cached hard by browsers, and the
      // whole point of owning this hop is being able to change where it goes.
      {
        source: "/app",
        destination: "https://apps.apple.com/app/id6762185611",
        permanent: false,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default withContentlayer(nextConfig);
