"use client";

// PostHog product analytics for the whole site (marketing pages, blog, quiz).
// One PostHog project covers all three — we segment with a `section` super
// property + named events rather than splitting into separate projects, so a
// single visitor's journey (blog -> landing -> quiz -> lead) stays intact.
//
// In the App Router there is no full page reload between routes, so PostHog's
// automatic pageview capture is disabled and we send `$pageview` manually on
// every navigation (and `$pageleave` via capture_pageleave).

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Send events to our own domain (/ingest), which next.config.ts rewrites to
// PostHog. This evades ad blockers that block us.i.posthog.com by name.
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest";
// Where the PostHog app itself lives — used for toolbar/links, not ingestion.
const POSTHOG_UI_HOST = "https://us.posthog.com";

/** Derive a coarse section from the path so insights can be filtered per area. */
function sectionFor(pathname: string): "blog" | "quiz" | "website" {
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/quiz")) return "quiz";
  return "website";
}

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    let url = window.origin + pathname;
    const qs = searchParams.toString();
    if (qs) url += "?" + qs;

    // Tag all subsequent events from this view with the section.
    posthog.register({ section: sectionFor(pathname) });
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      ui_host: POSTHOG_UI_HOST,
      capture_pageview: false, // handled manually below for the App Router
      capture_pageleave: true,
      persistence: "localStorage+cookie",
    });
  }, []);

  // If the key isn't set (e.g. local dev without env), render children untouched.
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PHProvider>
  );
}
