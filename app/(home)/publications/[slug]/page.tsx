import { PublicationList } from "@/components/publication-list"
import pubs from "@/lib/db/publications.json"

export default async function TagPage(
  props: PageProps<"/publications/[slug]">
) {
  const { slug } = await props.params
  const filteredPubs = pubs.filter(publication =>
    publication.tags?.includes(slug)
  )

  return (
    <div className="pt-10">
      <section>
        <h1 className="text-center">Publications</h1>
      </section>
      <section className="items-center">
        <PublicationList publications={filteredPubs} />
      </section>
    </div>
  )
}
