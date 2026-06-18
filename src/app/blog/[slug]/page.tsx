import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { format } from "date-fns";
import { MDXContent } from "@/components/mdx-content";
import { BlogNav } from "@/components/blog/blog-nav";
import { CTAButton } from "@/components/blog/cta-button";
import { BlogSidebarCard } from "@/components/blog/blog-sidebar-card";
import { blogFAQs } from "@/lib/blog-faqs";
import { isPublished } from "@/lib/blog-date";

const SITE_URL = "https://rythma.co";

// Render per request so the time-based publish gate (isPublished) is evaluated
// live — a scheduled post flips from 404 to 200 the moment its 7am ET publish
// time passes, with no rebuild or external scheduler.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};
  if (!isPublished(post.date)) return {};

  return {
    title: `${post.title} | Rythma Blog`,
    description: post.description,
    authors: post.author ? [{ name: post.author }] : [{ name: "The Rythma Team" }],
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.lastUpdated || post.date,
      authors: post.author ? [post.author] : ["The Rythma Team"],
      images: [{ url: post.image || "/og-cover.jpg" }],
      siteName: "Rythma",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image || "/og-cover.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  if (!isPublished(post.date)) notFound();

  const faqs = blogFAQs[slug];

  // Related posts — same-cluster first, then most-recent published as fallback.
  // This adds 3–4 internal links to every post, creating crawl paths between
  // pages so Google can discover and prioritize the "Discovered – not indexed"
  // backlog, and reinforcing topical clusters for ranking.
  const byDateDesc = (a: (typeof allPosts)[number], b: (typeof allPosts)[number]) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();
  const published = allPosts.filter((p) => p.slug !== slug && isPublished(p.date));
  const sameCluster = (post.cluster ? published.filter((p) => p.cluster === post.cluster) : []).sort(byDateDesc);
  const fallback = published.filter((p) => !sameCluster.includes(p)).sort(byDateDesc);
  const relatedPosts = [...sameCluster, ...fallback].slice(0, 4);

  return (
    <>
      <BlogNav />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="flex gap-10">
          <article className="min-w-0 max-w-3xl flex-1">
            <header className="mb-8">
              <h1 className="font-display mb-4 text-3xl font-medium tracking-tight text-ink sm:text-5xl">
                {post.title}
              </h1>
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                {post.author && <span>By {post.author}</span>}
                <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
              </div>
              <div className="mb-8">
                <CTAButton />
              </div>
            </header>

            <a
              href="https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611"
              target="_blank"
              rel="noopener noreferrer"
              className="relative mb-8 block aspect-video cursor-pointer overflow-hidden rounded-2xl transition-opacity hover:opacity-90"
            >
              <Image src={post.image || "/og-cover.jpg"} alt={post.title} fill className="object-cover" priority />
            </a>

            <MDXContent code={post.body.code} />

            <div className="mt-12 flex flex-col items-center gap-6">
              <CTAButton variant="large" />
            </div>

            {relatedPosts.length > 0 && (
              <section className="mt-16 border-t border-border pt-10">
                <h2 className="font-display mb-6 text-2xl font-medium tracking-tight text-ink">
                  Keep reading
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related._id}
                      href={related.url}
                      className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                    >
                      {related.cluster && (
                        <span className="mb-1 inline-block text-xs uppercase tracking-wide text-primary">
                          {related.cluster.replace("-", " ")}
                        </span>
                      )}
                      <h3 className="font-display text-lg font-medium text-ink transition-colors group-hover:text-primary">
                        {related.title}
                      </h3>
                      {related.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{related.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  headline: post.title,
                  description: post.description,
                  image: post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/og-cover.jpg`,
                  datePublished: post.date,
                  dateModified: post.lastUpdated || post.date,
                  author: { "@type": "Organization", name: post.author || "The Rythma Team" },
                  publisher: {
                    "@type": "Organization",
                    name: "Rythma",
                    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
                  },
                  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
                }),
              }}
            />

            {faqs && faqs.length > 0 && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: { "@type": "Answer", text: faq.answer },
                    })),
                  }),
                }}
              />
            )}
          </article>

          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-24">
              <BlogSidebarCard />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
