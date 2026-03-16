import fumadocsLogo from "@/public/fumadocs-logo.png"
import nextLogo from "@/public/next.svg"
import Image from "next/image"
import Link from "next/link"

const today = new Date()

export default function Footer() {
  return (
    <footer className="mx-auto mt-10 flex items-center justify-center p-4 text-center text-zinc-500">
      &copy; {today.getFullYear()} Powered by &nbsp;{" "}
      <Link href={"https://nextjs.org/"}>
        <Image
          src={nextLogo}
          alt="Next.js Logo"
          className="inline w-16 dark:invert"
        />
        &nbsp; and
      </Link>
      <Link href="https://fumadocs.dev/">
        <Image src={fumadocsLogo} alt="Next.js Logo" className="inline w-15" />
      </Link>
      . All rights reserved.
    </footer>
  )
}
