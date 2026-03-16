"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Calendar,
  Code2,
  FileText,
  Filter,
  MapPin,
  Presentation,
  Search,
  Tag,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

interface SlideMetadata {
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

interface TalkInfo {
  dirname: string
  metadata: SlideMetadata
  html_url: string
  displayDate?: string
  previewImage?: string
  pdfUrl?: string
  sourceUrl?: string
}

interface TalksListProps {
  talks: TalkInfo[]
}

export function TalksList({ talks }: TalksListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"date" | "event" | "tags">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const uniqueYears = useMemo(() => {
    const years = talks
      .map((talk) => talk.metadata.date?.substring(0, 4))
      .filter(Boolean) as string[]
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
  }, [talks])

  const uniqueEvents = useMemo(() => {
    const events = talks
      .map((talk) => talk.metadata.event)
      .filter(Boolean) as string[]
    return Array.from(new Set(events)).sort()
  }, [talks])

  const uniqueLocations = useMemo(() => {
    const locations = talks
      .map((talk) => talk.metadata.location)
      .filter(Boolean) as string[]
    return Array.from(new Set(locations)).sort()
  }, [talks])

  const uniqueTags = useMemo(() => {
    const tags = talks.flatMap((talk) => talk.metadata.tags || [])
    return Array.from(new Set(tags)).sort()
  }, [talks])

  const filteredTalks = useMemo(() => {
    return talks.filter((talk) => {
      // Filter by year
      if (selectedYear) {
        const year = talk.metadata.date?.substring(0, 4)
        if (year !== selectedYear) return false
      }

      // Filter by event
      if (selectedEvent) {
        if (talk.metadata.event !== selectedEvent) return false
      }

      // Filter by location
      if (selectedLocation) {
        if (talk.metadata.location !== selectedLocation) return false
      }

      // Filter by tag
      if (selectedTag) {
        if (!talk.metadata.tags?.includes(selectedTag)) return false
      }

      // Filter by search query
      if (!searchQuery.trim()) return true

      const query = searchQuery.toLowerCase()
      const title = talk.metadata.title?.toLowerCase() || ""
      if (title.includes(query)) return true

      const description = talk.metadata.description?.toLowerCase() || ""
      if (description.includes(query)) return true

      const event = talk.metadata.event?.toLowerCase() || ""
      if (event.includes(query)) return true

      const location = talk.metadata.location?.toLowerCase() || ""
      if (location.includes(query)) return true

      if (talk.dirname.toLowerCase().includes(query)) return true

      const tags = talk.metadata.tags || []
      if (tags.some((tag) => tag.toLowerCase().includes(query))) return true

      return false
    })
  }, [
    talks,
    searchQuery,
    selectedYear,
    selectedEvent,
    selectedLocation,
    selectedTag,
  ])

  const sortedTalks = useMemo(() => {
    const sorted = [...filteredTalks]

    sorted.sort((a, b) => {
      let compareValue = 0

      if (sortField === "date") {
        const dateA = a.metadata.date || ""
        const dateB = b.metadata.date || ""
        compareValue = dateA.localeCompare(dateB)
      } else if (sortField === "event") {
        const eventA = a.metadata.event || ""
        const eventB = b.metadata.event || ""
        compareValue = eventA.localeCompare(eventB)
      } else if (sortField === "tags") {
        const tagsA = a.metadata.tags?.join(", ") || ""
        const tagsB = b.metadata.tags?.join(", ") || ""
        compareValue = tagsA.localeCompare(tagsB)
      }

      return sortDirection === "asc" ? compareValue : -compareValue
    })

    return sorted
  }, [filteredTalks, sortField, sortDirection])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-75 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search presentations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-shadow focus-visible:shadow-md"
          />
        </div>
        <div className="inline-flex h-9 items-center rounded-md border border-input bg-background shadow-sm transition-shadow hover:shadow-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none border-r transition-colors hover:bg-accent/50"
              >
                {sortField === "date" && <Calendar className="h-4 w-4" />}
                {sortField === "event" && <Presentation className="h-4 w-4" />}
                {sortField === "tags" && <Tag className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortField("date")}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Date</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField("event")}>
                <Presentation className="mr-2 h-4 w-4" />
                <span>Event</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField("tags")}>
                <Tag className="mr-2 h-4 w-4" />
                <span>Tags</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none transition-colors hover:bg-accent/50"
              >
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortDirection("asc")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortDirection("desc")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                <span>Descending</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="h-9 w-9 p-0 transition-all"
          title={showFilters ? "Hide Filters" : "Show Filters"}
        >
          <Filter
            className={`h-4 w-4 transition-transform ${showFilters ? "scale-110" : ""}`}
          />
        </Button>
      </div>
      {showFilters && (
        <div className="animate-in space-y-2 duration-200 slide-in-from-top-2">
          {/* Year filters */}
          {uniqueYears.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                Year:
              </span>
              {uniqueYears.map((year) => (
                <Badge
                  key={year}
                  variant="outline"
                  className={`cursor-pointer px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedYear === year
                      ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      : "hover:bg-blue-100 hover:shadow-sm dark:hover:bg-blue-950"
                  }`}
                  onClick={() =>
                    setSelectedYear(selectedYear === year ? null : year)
                  }
                >
                  {year}
                </Badge>
              ))}
            </div>
          )}
          {/* Event filters */}
          {uniqueEvents.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                Event:
              </span>
              {uniqueEvents.map((event) => (
                <Badge
                  key={event}
                  variant="outline"
                  className={`cursor-pointer px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedEvent === event
                      ? "bg-purple-500 text-white shadow-sm hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                      : "hover:bg-purple-100 hover:shadow-sm dark:hover:bg-purple-950"
                  }`}
                  onClick={() =>
                    setSelectedEvent(selectedEvent === event ? null : event)
                  }
                >
                  {event}
                </Badge>
              ))}
            </div>
          )}
          {/* Location filters */}
          {uniqueLocations.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                Location:
              </span>
              {uniqueLocations.map((location) => (
                <Badge
                  key={location}
                  variant="outline"
                  className={`cursor-pointer px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedLocation === location
                      ? "bg-green-500 text-white shadow-sm hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      : "hover:bg-green-100 hover:shadow-sm dark:hover:bg-green-950"
                  }`}
                  onClick={() =>
                    setSelectedLocation(
                      selectedLocation === location ? null : location,
                    )
                  }
                >
                  {location}
                </Badge>
              ))}
            </div>
          )}
          {/* Tag filters */}
          {uniqueTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                Tags:
              </span>
              {uniqueTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                      : "hover:bg-orange-100 hover:shadow-sm dark:hover:bg-orange-950"
                  }`}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {/* Clear all filters button */}
          {(selectedYear ||
            selectedEvent ||
            selectedLocation ||
            selectedTag) && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-3 text-xs font-medium transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setSelectedYear(null)
                  setSelectedEvent(null)
                  setSelectedLocation(null)
                  setSelectedTag(null)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
      {sortedTalks.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No presentations found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Showing {sortedTalks.length} of {talks.length} presentation
          {talks.length !== 1 ? "s" : ""}
        </div>
      )}
      {sortedTalks.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedTalks.map((talk) => (
            <Link
              key={talk.dirname}
              href={talk.html_url}
              className="group block"
            >
              <Card className="relative flex h-full flex-col overflow-hidden border-border/40 bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md dark:border-border/50 dark:hover:border-primary/60">
                {/* Preview Area */}
                <div className="relative -mt-6 aspect-video w-full overflow-hidden bg-linear-to-br from-primary/8 to-primary/3">
                  {talk.previewImage ? (
                    <>
                      {/* Preview Image */}
                      <Image
                        src={talk.previewImage}
                        alt={`Preview of ${talk.metadata.title || talk.dirname}`}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      {/* Overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    </>
                  ) : (
                    <>
                      {/* Subtle pattern fallback */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />

                      {/* Center content fallback */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-sm ring-1 ring-primary/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/15 group-hover:shadow-md">
                          <span className="text-4xl font-bold text-primary">
                            {talk.dirname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Hover indicator */}
                  <div className="absolute top-3 right-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <CardHeader className="flex flex-1 flex-col space-y-3 px-5">
                  <div className="space-y-2">
                    <CardTitle className="line-clamp-2 text-base leading-snug font-semibold transition-colors group-hover:text-primary">
                      {talk.metadata.title || talk.dirname}
                    </CardTitle>

                    {talk.metadata.description && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {talk.metadata.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {talk.metadata.event && (
                      <div className="flex items-center gap-2">
                        <Presentation className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                        {talk.metadata.conferenceUrl ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.open(
                                talk.metadata.conferenceUrl,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }}
                            className="line-clamp-1 text-left font-medium text-primary underline-offset-4 hover:underline"
                          >
                            {talk.metadata.event}
                          </button>
                        ) : (
                          <span className="line-clamp-1 font-medium">
                            {talk.metadata.event}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                      <span>{talk.displayDate || talk.dirname}</span>
                    </div>
                    {talk.metadata.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                        <span className="line-clamp-1">
                          {talk.metadata.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto space-y-2.5 pt-2">
                    {/* Action Buttons */}
                    {(talk.pdfUrl || talk.sourceUrl) && (
                      <div className="flex gap-2">
                        {talk.pdfUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.open(
                                talk.pdfUrl,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            PDF
                          </button>
                        )}
                        {talk.sourceUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.open(
                                talk.sourceUrl,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                            Source
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
