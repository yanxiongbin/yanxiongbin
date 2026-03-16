"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button"
import { Check, Share } from "lucide-react"

export function ShareButton({ url }: { url: string }) {
  const [isChecked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(`${window.location.origin}${url}`)
  })

  return (
    <button
      type="button"
      className={cn(buttonVariants({ className: "gap-2" }))}
      onClick={onCopy}
    >
      {isChecked ? <Check className="size-4" /> : <Share className="size-4" />}
      {isChecked ? "Copied URL" : "Share Post"}
    </button>
  )
}
