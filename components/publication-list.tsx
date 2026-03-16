"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import type pubs from "@/lib/db/publications.json"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Filter,
  Search,
  Tag,
  Type,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

type Publication = (typeof pubs)[number]

interface PublicationsListProps {
  publications: Publication[]
  showSearch?: boolean
}

export function PublicationList({
  publications,
  showSearch = true,
}: PublicationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<"year" | "type" | "tags">("year")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const uniqueYears = useMemo(() => {
    const years = publications
      .map((pub) => pub.issued?.["date-parts"]?.[0]?.[0]?.toString())
      .filter(Boolean) as string[]
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
  }, [publications])

  const uniqueTypes = useMemo(() => {
    const types = publications.map((pub) => {
      if (pub.type === "article-journal") return "journal"
      if (pub.type === "paper-conference") return "conference"
      if (pub.type === "chapter") return "chapter"
      return "other"
    })
    return Array.from(new Set(types)).sort()
  }, [publications])

  const uniqueStatuses = useMemo(() => {
    const statuses = publications.map((pub) => {
      if (pub["container-title"] === "arXiv") return "preprint"
      if (pub.issued.status) return pub.issued.status
      return "published"
    })
    return Array.from(new Set(statuses)).sort()
  }, [publications])

  const uniqueTags = useMemo(() => {
    const tags = publications.flatMap((pub) => pub.tags || [])
    return Array.from(new Set(tags)).sort()
  }, [publications])

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      // Filter by year
      if (selectedYear) {
        const year = pub.issued?.["date-parts"]?.[0]?.[0]?.toString()
        if (year !== selectedYear) return false
      }

      // Filter by type
      if (selectedType) {
        const type =
          pub.type === "article-journal"
            ? "journal"
            : pub.type === "paper-conference"
              ? "conference"
              : pub.type === "chapter"
                ? "chapter"
                : "other"
        if (type !== selectedType) return false
      }

      // Filter by status
      if (selectedStatus) {
        const status =
          pub["container-title"] === "arXiv"
            ? "preprint"
            : pub.issued.status
              ? pub.issued.status
              : "published"
        if (status !== selectedStatus) return false
      }

      // Filter by tag
      if (selectedTag) {
        if (!pub.tags?.includes(selectedTag)) return false
      }

      // Filter by search query
      if (!searchQuery.trim()) return true

      const query = searchQuery.toLowerCase()
      // Search in title
      if (pub.title?.toLowerCase().includes(query)) return true

      // Search in author names
      const authorString =
        pub.author

          ?.map((a: { family: string; given: string }) =>
            `${a.given} ${a.family}`.toLowerCase(),
          )
          .join(" ") || ""
      if (authorString.includes(query)) return true

      // Search in year
      const year = pub.issued?.["date-parts"]?.[0]?.[0]?.toString() || ""
      if (year.includes(query)) return true

      // Search in type
      const type =
        pub.type === "article-journal"
          ? "journal"
          : pub.type === "paper-conference"
            ? "conference"
            : pub.type === "chapter"
              ? "chapter"
              : "other"
      if (type.includes(query)) return true

      // Search in tags
      if (pub.tags?.some((tag) => tag.toLowerCase().includes(query)))
        return true

      // Search in journal/container-title
      if (pub["container-title"]?.toLowerCase().includes(query)) return true

      return false
    })
  }, [
    publications,
    searchQuery,
    selectedYear,
    selectedType,
    selectedStatus,
    selectedTag,
  ])

  const sortedPublications = useMemo(() => {
    const sorted = [...filteredPublications]

    sorted.sort((a, b) => {
      let compareValue = 0

      if (sortField === "year") {
        const yearA = Number(a.issued?.["date-parts"]?.[0]?.[0]) || 0
        const yearB = Number(b.issued?.["date-parts"]?.[0]?.[0]) || 0
        compareValue = yearA - yearB
      } else if (sortField === "type") {
        const getType = (pub: Publication) =>
          pub.type === "article-journal"
            ? "journal"
            : pub.type === "paper-conference"
              ? "conference"
              : pub.type === "chapter"
                ? "chapter"
                : "other"
        const typeA = getType(a)
        const typeB = getType(b)
        compareValue = typeA.localeCompare(typeB)
      } else if (sortField === "tags") {
        const tagsA = a.tags?.join(", ") || ""
        const tagsB = b.tags?.join(", ") || ""
        compareValue = tagsA.localeCompare(tagsB)
      }

      return sortDirection === "asc" ? compareValue : -compareValue
    })

    return sorted
  }, [filteredPublications, sortField, sortDirection])

  const totalNum = publications.length
  const filteredNum = sortedPublications.length

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-75 flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search publications by title, author, year, type, tags, or journal..."
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
                  {sortField === "year" && <Calendar className="h-4 w-4" />}
                  {sortField === "type" && <Type className="h-4 w-4" />}
                  {sortField === "tags" && <Tag className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSortField("year")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Year</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("type")}>
                  <Type className="mr-2 h-4 w-4" />
                  <span>Type</span>
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
      )}
      {showSearch && showFilters && (
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
          {/* Type filters */}
          {uniqueTypes.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                Type:
              </span>
              {uniqueTypes.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className={`cursor-pointer px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? "bg-purple-500 text-white shadow-sm hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                      : "hover:bg-purple-100 hover:shadow-sm dark:hover:bg-purple-950"
                  }`}
                  onClick={() =>
                    setSelectedType(selectedType === type ? null : type)
                  }
                >
                  {type}
                </Badge>
              ))}
            </div>
          )}
          {/* Status filters */}
          {uniqueStatuses.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                Status:
              </span>
              {uniqueStatuses.map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={`cursor-pointer px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedStatus === status
                      ? "bg-green-500 text-white shadow-sm hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      : "hover:bg-green-100 hover:shadow-sm dark:hover:bg-green-950"
                  }`}
                  onClick={() =>
                    setSelectedStatus(selectedStatus === status ? null : status)
                  }
                >
                  {status}
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
          {(selectedYear || selectedType || selectedStatus || selectedTag) && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-3 text-xs font-medium transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setSelectedYear(null)
                  setSelectedType(null)
                  setSelectedStatus(null)
                  setSelectedTag(null)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
      {sortedPublications.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No publications found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        showSearch && (
          <div className="text-sm text-muted-foreground">
            Showing {sortedPublications.length} of {totalNum} publication
            {totalNum !== 1 ? "s" : ""}
          </div>
        )
      )}
      <ItemGroup className="gap-6">
        {sortedPublications.map((pub: Publication, index: number) => {
          // Format author names
          const authorString =
            pub.author
              ?.map(
                (a: { family: string; given: string }) =>
                  `${a.given} ${a.family}`,
              )
              .join(", ") || "Unknown Author"

          // Get journal name from container-title
          const journal = pub["container-title"] || ""

          const type =
            pub.type === "article-journal"
              ? "journal"
              : pub.type === "paper-conference"
                ? "conference"
                : pub.type === "chapter"
                  ? "chapter"
                  : "other"

          // Extract year from issued.date-parts
          const year = pub.issued?.["date-parts"]?.[0]?.[0] || "N/A"

          // Determine status based on container-title or other fields
          const status =
            pub["container-title"] === "arXiv"
              ? "preprint"
              : pub.issued.status
                ? pub.issued.status
                : "published"

          // PDF link
          const pdfLink =
            pub["pdf-link"] ?? `https://arxiv.org/pdf/${pub.arXiv}`

          return (
            <HoverCard key={pub.id}>
              <HoverCardTrigger asChild>
                <Item
                  variant="outline"
                  className="transition-colors hover:bg-accent/50"
                >
                  <ItemMedia variant="icon">{filteredNum - index}</ItemMedia>
                  <ItemContent>
                    <ItemTitle className="font-semibold">{pub.title}</ItemTitle>
                    <ItemDescription className="text-foreground/80">
                      {authorString}
                    </ItemDescription>
                    <ItemDescription className="italic">
                      {journal}
                    </ItemDescription>
                    <ItemDescription className="mt-1 flex w-full flex-wrap items-center gap-2 text-xs">
                      <Badge className="px-1 font-mono tabular-nums">
                        {year}
                      </Badge>
                      <Badge variant="secondary" className="px-1 font-mono">
                        {type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`${
                          status === "published"
                            ? "bg-lime-600 text-white dark:bg-lime-700"
                            : "bg-orange-300 text-black"
                        } px-1 font-mono`}
                      >
                        {status}
                      </Badge>
                      {pub.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="px-1 font-mono"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-col">
                    <Button variant="outline" size="sm">
                      <Link href={`https://www.doi.org/${pub.DOI}`}>URL</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={pdfLink}>PDF</Link>
                    </Button>
                  </ItemActions>
                </Item>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto max-w-3xl bg-background/80 p-6 font-mono text-sm/relaxed backdrop-blur-md">
                {pub.abstract ? pub.abstract : "No abstract available."}
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </ItemGroup>
    </div>
  )
}
