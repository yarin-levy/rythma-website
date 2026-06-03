import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { isPublished } from "@/lib/blog-date";

const SITE_URL = "https://rythma.co";

// Regenerate per request so newly-published posts enter the sitemap as soon as
// their 7am ET publish time passes, without waiting for a rebuild.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = new Date();

  const posts = allPosts
    .filter((post) => isPublished(post.date))
    .map((post) => {
      const postDate = new Date(post.date);
      const daysSincePublish = Math.floor((buildTime.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

      let lastModified: Date;
      if (post.lastVerified) {
        lastModified = new Date(post.lastVerified);
      } else if (post.lastUpdated) {
        lastModified = new Date(post.lastUpdated);
      } else if (daysSincePublish <= 7) {
        lastModified = buildTime;
      } else {
        lastModified = postDate;
      }

      return {
        url: `${SITE_URL}${post.url}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: post.isHub ? 0.9 : 0.8,
      };
    });

  const routes = [
    { url: SITE_URL, changeFrequency: "daily" as const, priority: 1.0, lastModified: buildTime },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily" as const, priority: 0.9, lastModified: buildTime },
  ];

  return [...routes, ...posts];
}
