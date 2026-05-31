import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    lastUpdated: { type: "date", required: false },
    lastVerified: {
      type: "date",
      required: false,
      description: "Date sources and facts in this post were last re-verified.",
    },
    author: { type: "string", required: false },
    image: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    cluster: {
      type: "string",
      required: false,
      description: "Content cluster this post belongs to. Used for internal linking.",
    },
    isHub: {
      type: "boolean",
      required: false,
      description: "If true, this is a hub post that other cluster posts link back to.",
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => post._raw.flattenedPath.replace("blog/", ""),
    },
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.flattenedPath.replace("blog/", "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push("line--highlighted");
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: { className: ["anchor"], ariaLabel: "Link to section" },
        },
      ],
    ],
  },
});
