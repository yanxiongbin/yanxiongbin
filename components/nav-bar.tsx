import Image from "next/image"
import Link from "next/link"
import { NavDropdownMenu } from "@/components/nav-dropdown-menu"
import { NavMenu } from "@/components/nav-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import PortraitImage from "@/public/portrait.jpg"

const navLinks = [
  { href: "/research", text: "Research" },
  { href: "/publications", text: "Publications" },
  { href: "https://github.com/mazhengcn", text: "Github" },
]

const TAGS = ["Inverse Problems", "Machine Learning", "Medical Imaging"]

export default function NavBar() {
  return (
    <header className="fixed z-20 w-full p-2 mx-auto backdrop-blur-md bg-background/80 transidtion-colors duration-300 border-b">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center gap-3">
          <Link href="/" className="group flex flex-auto items-center">
            <Image
              src={PortraitImage}
              alt="Portrait of Zheng Ma"
              className="h-8 w-8 rounded-full"
            />
            <h2 className="p-2 text-lg font-semibold tracking-tighter">Home</h2>
          </Link>
          <div className="hidden items-center md:flex">
            <NavMenu tags={TAGS} />
          </div>
          <div className="flex-1"></div>
          {/* <ModeToggle /> */}
          <ThemeToggle mode="light-dark" />
          <NavDropdownMenu navLinks={navLinks} className="md:hidden" />
        </nav>
      </div>
    </header>
  )
}
