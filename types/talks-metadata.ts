/**
 * Metadata schema for talks/presentations
 */
export interface TalkMetadata {
  /** Unique identifier based on folder name (e.g., "2025-12-28") */
  id: string

  /** Title of the talk/presentation */
  title: string

  /** Presentation date in ISO 8601 format (YYYY-MM-DD) */
  date: string

  /** Speaker name */
  speaker?: string

  /** Speaker affiliation/organization */
  affiliation?: string

  /** Conference or event name */
  conference?: string

  /** Conference location (city, country) */
  location?: string

  /** Conference URL */
  conferenceUrl?: string

  /** Language of the presentation (e.g., "en", "zh-CN") */
  language?: string

  /** Final URL where the slides are hosted */
  slidesUrl?: string

  /** URL to the PDF version of the slides */
  pdfUrl?: string

  /** URL to the source code/repository */
  sourceUrl?: string

  /** Brief description of the talk */
  description?: string

  /** Tags/topics covered in the talk */
  tags?: string[]

  /** Collaborators or co-authors */
  collaborators?: string[]

  /** Whether the talk is published/public */
  published?: boolean

  /** Custom metadata fields */
  custom?: Record<string, unknown>
}

/**
 * Configuration file for talk metadata
 * Can be placed in each talk directory as metadata.json
 */
export interface TalkMetadataConfig {
  /** Conference or event name */
  conference?: string

  /** Conference location */
  location?: string

  /** Conference URL */
  conference_url?: string

  /** Brief description */
  description?: string

  /** Tags */
  tags?: string[]

  /** Collaborators */
  collaborators?: string[]

  /** Whether published */
  published?: boolean

  /** Custom fields */
  custom?: Record<string, unknown>
}

/**
 * Collection of all talks metadata
 */
export interface TalksCollection {
  /** Timestamp of when the collection was generated */
  generatedAt: string

  /** Total number of talks */
  count: number

  /** Array of all talk metadata */
  talks: TalkMetadata[]
}
