import remarkReadingTime from "@/lib/remark-plugins/remark-reading-time.mjs"
import { remarkMdxFiles } from "fumadocs-core/mdx-plugins"
import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config"
import lastModified from "fumadocs-mdx/plugins/last-modified"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      created: z.iso.date().or(z.date()).optional(),
      updated: z.iso.date().or(z.date()).optional(),
    }),
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: {
    schema: metaSchema,
  },
})

export const blog = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string().optional(),
    date: z.iso.date().or(z.date()).optional(),
  }),
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkMdxFiles, remarkReadingTime],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    valueToExport: ["readingTime"],
  },
  plugins: [lastModified()],
})
