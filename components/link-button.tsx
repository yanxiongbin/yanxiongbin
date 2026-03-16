import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  href: string
  children: ReactNode
}

export default function LinkButton({ href, children }: Props) {
  return (
    <div className="not-prose flex justify-center">
      <Button
        variant="outline"
        asChild
        className="hover:bg-primary hover:text-primary-foreground hover:dark:bg-primary hover:dark:text-primary-foreground"
      >
        <Link href={href}>{children}</Link>
      </Button>
    </div>
  )
}
