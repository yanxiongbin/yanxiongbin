import { TalksList } from "@/components/talks-list"
import type { TalkMetadata, TalksCollection } from "@/types/talks-metadata"

interface TalkInfo {
  dirname: string
  metadata: {
    title?: string
    date?: string
    event?: string
    location?: string
    description?: string
    tags?: string[]
    theme?: string
    layout?: string
    conferenceUrl?: string
  }
  html_url: string
  displayDate?: string
  previewImage?: string
  pdfUrl?: string
  sourceUrl?: string
}

async function getTalksMetadata(): Promise<TalksCollection> {
  const res = await fetch(
    "https://zheng-talks.netlify.app/talks-metadata.json",
    {
      next: { revalidate: 3600 }, // Revalidate every hour
    },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch talks metadata")
  }

  return res.json()
}

function transformTalkMetadata(talk: TalkMetadata): TalkInfo {
  // Type guard for custom string fields
  const getCustomString = (key: string): string | undefined => {
    const value = talk.custom?.[key]
    return typeof value === "string" ? value : undefined
  }

  const slidesUrl =
    talk.slidesUrl || `https://zheng-talks.netlify.app/${talk.id}`

  // Generate preview image URL (Slidev exports og-image.png with 16:9 ratio)
  const previewImage = `${slidesUrl}/og-image.png`

  return {
    dirname: talk.id,
    metadata: {
      title: talk.title,
      date: talk.date,
      event: talk.conference,
      location: talk.location,
      description: talk.description,
      tags: talk.tags,
      theme: getCustomString("theme"),
      layout: getCustomString("layout"),
      conferenceUrl: talk.conferenceUrl,
    },
    html_url: slidesUrl,
    displayDate: talk.date,
    previewImage,
    pdfUrl: talk.pdfUrl,
    sourceUrl: talk.sourceUrl,
  }
}

async function getTalksInfo(): Promise<TalkInfo[]> {
  const collection = await getTalksMetadata()

  // Filter only published talks and transform to TalkInfo format
  const talks = collection.talks
    .filter((talk) => talk.published !== false)
    .map(transformTalkMetadata)

  // Sort by date in descending order (newest first)
  return talks.sort((a, b) => {
    const dateA = a.metadata.date || a.dirname
    const dateB = b.metadata.date || b.dirname
    return dateB.localeCompare(dateA)
  })
}

export default async function Page() {
  const talks = []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Talks & Presentations</h1>
      {talks.length > 0 ? <TalksList talks={talks} /> : null}
    </div>
  )
}
