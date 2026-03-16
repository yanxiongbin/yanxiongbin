import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import { blog as blogPosts, docs } from "fumadocs-mdx:collections/server"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: "/blog",
})

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"]

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  }
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed")

  return `# ${page.data.title} (${page.url})

${processed}`
}

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
