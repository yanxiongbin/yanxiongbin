//import GroupMembers from "@/components/group-members"
import ResearchAreas from "@/components/research-areas"
import { source } from "@/lib/source"

export default function ResearchPage() {
  const pageTreeMeta = source.pageTree.children
  return (
    <>
      <section className="mt-12">
        <h1 className="text-center text-3xl font-bold md:text-5xl">
          Research Interests
        </h1>
        <p className="mt-10 mb-8 indent-8 text-lg">
          Welcome to my homepage. I am a mathematician working on inverse problems, 
          fractional partial differential equations, scientific computing, and deep 
          learning methods. I am particularly interested in the interplay between 
          mathematics and artificial intelligence, and in developing learning-based 
          approaches for challenging problems in science and engineering.
        </p>
      </section>
      <ResearchAreas metas={pageTreeMeta} />
      {/*<GroupMembers />*/}
    </>
  )
}
