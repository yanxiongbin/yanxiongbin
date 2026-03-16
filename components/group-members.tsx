import { PlusIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { type Student, students } from "@/lib/db/students"

function MemberList({ people }: { people: Student[] }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup>
        {people.map((person, index) => (
          <div key={person.name}>
            <Item>
              <ItemMedia className="group-has-[[data-slot=item-description]]/item:translate-y-0 group-has-[[data-slot=item-description]]/item:self-center">
                <Avatar className="size-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle className="text-base">{person.name}</ItemTitle>
                <ItemDescription>{person.period}</ItemDescription>
                <ItemDescription>
                  {person.position && person.position}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <PlusIcon />
                </Button>
              </ItemActions>
            </Item>
            {index !== people.length - 1 && <ItemSeparator />}
          </div>
        ))}
      </ItemGroup>
    </div>
  )
}

export default function GroupMembers() {
  const currentPhDs = students.filter(
    (person) => person.type === "phd" && person.status === "current",
  )
  const formerPhDs = students.filter(
    (person) => person.type === "phd" && person.status === "former",
  )
  const formerPostdocs = students.filter(
    (person) => person.type === "postdoc" && person.status === "former",
  )
  return (
    <section className="mt-10">
      <h1 className="mt-10 text-center text-3xl font-bold md:text-5xl">
        People
      </h1>
      <h2 className="mt-5 mb-5 text-xl font-semibold">
        Current Ph.D. Students
      </h2>
      <MemberList people={currentPhDs} />
      <h2 className="mt-5 mb-5 text-xl font-semibold">Former Ph.D. Students</h2>
      <MemberList people={formerPhDs} />
      <h2 className="mt-5 mb-5 text-xl font-semibold">Former Postdocs</h2>
      <MemberList people={formerPostdocs} />
    </section>
  )
}
