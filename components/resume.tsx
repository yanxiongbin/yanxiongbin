import { Badge } from "@/components/ui/badge"
import { Building2, Calendar } from "lucide-react"
import Link from "next/link"

const experiences = [
  {
    title: "Associate Professor, Master's Supervisor (硕士生导师)",
    company: "Lanzhou University",
    period: "2025 - Present",
    description:
      "My research focuses on developing deep-learning-based methods for scientific computing across theory, algorithms, and engineering, particularly in full-waveform inversion",
    tags: ["Inverse Problems", "Scientific Machine Learning", "Full Waveform Inversion"],
  },
  {
    title: "Postdoctoral Researcher",
    company: "Shanghai Jiao Tong University",
    period: "2022 - 2024",
    description:
      "Conducted research on inverse problems for partial differential equations and deep learning methods for scientific computing.",
    tags: [ "Inverse Problems", "Deep Learning"],
  },
  {
    title: "Integrated B.S.-Ph.D. Program in Computational Mathematics",
    company: "Lanzhou University",
    period: "2015 - 2022",
    description:
      "Completed an integrated B.S.-Ph.D. program in Computational Mathematics under the supervision of Prof. Ting Wei.",
    tags: ["Inverse Problems", "Fractional Partial Differential Equations"],
  },
  {
    title: "B.S. in Mathematics",
    company: "Lanzhou University",
    period: "2011 - 2015",
    description:
      "Completed undergraduate study in Mathematics at the School of Mathematics and Statistics, Lanzhou University.",
    tags: [],
  },
]


export default function Resume() {
  return (
    <div className="mx-auto px-2 py-4">
      <div className="relative ml-3">
        {/* Timeline line */}
        <div className="absolute top-4 bottom-0 left-0 border-l-2" />
        {experiences.map(({ company, description, period, tags, title }) => (
          <div key={title} className="relative pb-12 pl-8 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute top-3 left-px h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background" />

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-base font-medium">{company}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{period}</span>
                </div>
              </div>
              <div className="text-sm text-pretty text-muted-foreground sm:text-base">
                {description}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
