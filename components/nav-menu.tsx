"use client"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function NavMenu({ tags }: { tags: string[] }) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(navigationMenuTriggerStyle())}
          >
            <Link href="/research">Research</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/publications">Publications</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem asChild className={navigationMenuTriggerStyle()}>
          <Link href="https://github.com/mazhengcn">Github</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                {tags?.map((tag) => (
                  <NavigationMenuLink asChild key={tag}>
                    <Link href={`/tags/${tag}`}>
                      <div className="font-medium">{tag}</div>
                      <div className="text-muted-foreground">
                        Browse posts tagged with &quot;{tag}&quot;.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
