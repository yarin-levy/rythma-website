"use client";

import Image from "next/image";
import { useMDXComponent } from "next-contentlayer2/hooks";

const MDXComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-display mb-4 mt-10 text-3xl font-medium tracking-tight text-ink sm:text-4xl" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-display mb-4 mt-10 scroll-mt-24 text-2xl font-medium tracking-tight text-ink sm:text-3xl" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold text-ink" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-5 leading-7 text-ink-soft" {...props}>{children}</p>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href?.startsWith("/") || href?.startsWith("#");
    return (
      <a
        href={href}
        className="text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
        {...(!isInternal && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-5 ml-6 list-disc space-y-2 text-ink-soft" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-5 ml-6 list-decimal space-y-2 text-ink-soft" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props}>{children}</li>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-ink" {...props}>{children}</code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mb-5 overflow-x-auto rounded-xl bg-muted p-4 text-sm" {...props}>{children}</pre>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border bg-muted/60" {...props}>{children}</thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-border" {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props}>{children}</tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left font-semibold text-ink" {...props}>{children}</th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-ink-soft" {...props}>{children}</td>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 rounded-r-xl border-l-4 border-primary bg-muted/40 px-6 py-4 text-ink-soft italic" {...props}>{children}</blockquote>
  ),
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    return <Image src={src} alt={alt || ""} width={800} height={450} className="my-8 rounded-2xl" />;
  },
};

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return (
    <div className="max-w-none text-base">
      <Component components={MDXComponents} />
    </div>
  );
}
