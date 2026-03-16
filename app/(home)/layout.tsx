import BackToTopButton from "@/components/back-to-top"
import Footer from "@/components/footer"
import { baseOptions, linkItems } from "@/lib/layout.shared"
import { HomeLayout } from "fumadocs-ui/layouts/home"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HomeLayout {...baseOptions()} links={linkItems}>
      <main>
        <article className="mx-auto max-w-5xl px-8">{children}</article>
      </main>
      <BackToTopButton />
      <Footer />
    </HomeLayout>
  )
}
