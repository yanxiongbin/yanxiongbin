import { ShareButton } from "@/app/(home)/blog/[slug]/page.client"
import { buttonVariants } from "@/components/ui/button"
import { createMetadata } from "@/lib/metadata"
import { blog } from "@/lib/source"
import { cn } from "@/lib/utils"
import { getMDXComponents } from "@/mdx-components"
import { InlineTOC } from "fumadocs-ui/components/inline-toc"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import path from "node:path"

export default async function Page(props: PageProps<"/blog/[slug]">) {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()
  const Mdx = page.data.body
  const toc = page.data.toc

  return (
    <>
      <div className="mb-8 flex flex-row gap-4 text-sm">
        <div>
          <p className="mb-1 text-fd-muted-foreground">Written by</p>
          <p className="font-medium">{page.data.author}</p>
        </div>
        <div>
          <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
          <p className="font-medium">
            {new Date(
              page.data.date ??
                path.basename(page.path, path.extname(page.path)),
            ).toDateString()}
          </p>
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-semibold">{page.data.title}</h1>
      <p className="mb-8 text-fd-muted-foreground">{page.data.description}</p>

      <div className="prose min-w-0 flex-1">
        <div className="not-prose mb-8 flex flex-row gap-2">
          <ShareButton url={page.url} />
          <Link
            href="/blog"
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              }),
            )}
          >
            Back
          </Link>
        </div>
        <InlineTOC items={toc} />
        <Mdx components={getMDXComponents()} />
      </div>
    </>
  )
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()

  return createMetadata({
    title: page.data.title,
    description:
      page.data.description ?? "The library for building documentation sites",
  })
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }))
}
