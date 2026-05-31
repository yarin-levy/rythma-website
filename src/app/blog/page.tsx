import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { format } from "date-fns";
import Image from "next/image";
import { BlogNav } from "@/components/blog/blog-nav";
import { isPublished } from "@/lib/blog-date";

export const metadata = {
  title: "Blog | Rythma",
  description:
    "Clear, well-sourced answers about perimenopause symptoms, patterns, and tracking — from the team behind Rythma.",
  alternates: { canonical: "https://rythma.co/blog" },
  openGraph: {
    title: "Blog | Rythma",
    description:
      "Clear, well-sourced answers about perimenopause symptoms, patterns, and tracking.",
    images: [{ url: "/og-cover.jpg" }],
  },
};

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => isPublished(post.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <BlogNav />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-display mb-4 text-4xl font-medium tracking-tight text-ink md:text-5xl">
            The Rythma Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-ink-soft">
            Clear, well-sourced answers about perimenopause — symptoms, patterns, and how to track them.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={post.url}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image || "/og-cover.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                {post.cluster && (
                  <span className="mb-2 inline-block text-xs uppercase tracking-wide text-primary">
                    {post.cluster.replace("-", " ")}
                  </span>
                )}
                <h2 className="font-display mb-2 text-xl font-medium text-ink transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mb-4 line-clamp-3 text-sm text-ink-soft">{post.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-ink-muted">
                  {post.author && <span>{post.author}</span>}
                  <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <div className="py-12 text-center text-ink-soft">
            <p>No blog posts yet. Check back soon.</p>
          </div>
        )}
      </div>
    </>
  );
}
