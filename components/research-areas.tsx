import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import type * as PageTree from "fumadocs-core/page-tree"
import Image from "next/image"
import Link from "next/link"

const coverImages = {
  fractional: "/research/anomalous_diffusion.png",
  inverse: "/research/Ai_for_IP.png",
  FWI: "/research/FWI.png",
}

const researchOrder = {
  inverse: 0,
  FWI: 1,
  fractional: 2,
}

export default function ResearchAreas({ metas }: { metas: PageTree.Node[] }) {
  metas.sort((a: PageTree.Node, b: PageTree.Node) => {
    const indexA =
      researchOrder[(a.$id ? a.$id : "") as keyof typeof researchOrder]
    const indexB =
      researchOrder[(b.$id ? b.$id : "") as keyof typeof researchOrder]
    return indexA - indexB
    })
  return (
    <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {metas.map((meta) => {
        const id = meta.$id
        return (
          <Item key={id} variant="outline" asChild>
            <Link href={`/docs/${id}`}>
              <ItemHeader>
                {meta.$id && (
                  <Image
                    src={coverImages[id as keyof typeof coverImages]}
                    alt={meta.$id}
                    width={640}
                    height={640}
                    className="w-full rounded-sm object-contain bg-white"
                  />
                )}
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="text-base">{meta.name}</ItemTitle>
                <ItemDescription className="text-base">
                  {/* @ts-expect-error this is intentional */}
                  {meta.description}
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
