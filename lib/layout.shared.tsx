import PortraitImage from "@/public/yanxiongbin.png"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import Image from "next/image"

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */

export const linkItems = [
  { text: "Research", url: "/research" },
  { text: "Publications", url: "/publications" },
  { text: "Talks", url: "/talks" },
  //{ text: "Blog", url: "/blog" },
  {
    type: "menu" as const,
    text: "Docs",
    items: [
      {
        text: "Inverse Problems",
        description: "AI for inverse problems",
        url: "/docs/inverse",
      },
      {
        text: "Full-Waveform Inversion (FWI)",
        description: "AI for full-waveform inversion",
        url: "/docs/FWI",
      },
      {
        text: "Anomalous Diffusion",
        description: "Inverse problems of anomalous diffusion equations",
        url: "/docs/fractional",
      },
    ],
  },
]

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      transparentMode: "always",
      title: (
        <>
          <Image
            src={PortraitImage}
            alt="Portrait of Xiong-Bin Yan"
            className="size-6 rounded-full"
          />
          Home
        </>
      ),
    },
    searchToggle: {
      enabled: false,
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    githubUrl: "https://github.com/yanxiongbin",
  }
}
