"use client"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Airplay, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const itemVariants = cva("size-7 rounded-full p-1.5 text-muted-foreground", {
  variants: {
    active: {
      true: "bg-accent text-accent-foreground",
      false: "text-muted-foreground",
    },
  },
})
const full = [
  ["light", Sun],
  ["dark", Moon],
  ["system", Airplay],
]

export function ThemeToggle({ mode = "light-dark" }) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])
  const container = cn("inline-flex items-center rounded-full border p-1")
  if (mode === "light-dark") {
    const value = mounted ? resolvedTheme : null
    return (
      <button
        type="button"
        className={container}
        onClick={() => setTheme(value === "light" ? "dark" : "light")}
        data-theme-toggle=""
      >
        {full.map(([key, Icon]) => {
          if (key === "system") return null
          return (
            <Icon
              key={key as React.Key}
              fill="currentColor"
              className={cn(itemVariants({ active: value === key }))}
            />
          )
        })}
      </button>
    )
  }
  const value = mounted ? theme : null
  return (
    <div className={container}>
      {full.map(([key, Icon]) => (
        <button
          type="button"
          key={key as React.Key}
          className={cn(itemVariants({ active: value === key }))}
          onClick={() => setTheme(key as string)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  )
}
