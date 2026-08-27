import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { isPublished } from "@/lib/blog-date";

const SITE_URL = "https://rythma.co";

// Regenerate per request so newly-published posts enter the sitemap as soon as
// their 7am ET publish time passes, without waiting for a rebuild.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  // lastmod must be honest — Google learns to ignore sitemaps whose dates
  // change on every fetch. Use the real content dates only (this route is
  // force-dynamic, so `new Date()` here would restamp every request).
  const published = allPosts.filter((post) => isPublished(post.date));

  const posts = published.map((post) => {
    const lastModified = new Date(post.lastVerified ?? post.lastUpdated ?? post.date);
    return {
      url: `${SITE_URL}${post.url}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: post.isHub ? 0.9 : 0.8,
    };
  });

  // Home and /blog genuinely change when a new post publishes — stamp them
  // with the newest published post's date rather than the request time.
  const newestPostDate = published.reduce(
    (max, post) => (new Date(post.date) > max ? new Date(post.date) : max),
    new Date(0)
  );

  const routes = [
    { url: SITE_URL, changeFrequency: "daily" as const, priority: 1.0, lastModified: newestPostDate },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily" as const, priority: 0.9, lastModified: newestPostDate },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/support`, changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  return [...routes, ...posts];
}
