import LinkButton from "@/components/link-button"
import Resume from "@/components/resume"
import { Card, CardContent } from "@/components/ui/card"
import PortraitImage from "@/public/yanxiongbin.png"
import Image from "next/image"
import { IoDocument, IoMail } from "react-icons/io5"

export default function Home() {
  return (
    <div className="mx-auto pt-10">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 overflow-auto py-6 md:flex-row md:justify-center md:gap-20">
          <Image
            src={PortraitImage}
            alt="Portrait of Xiong-Bin Yan"
            className="h-60 w-60 rounded-full border border-border object-cover"
          />
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-5xl font-bold tracking-tight">
              Xiong-Bin Yan{" "}
              <span className="font-cn font-bold tracking-tight">(燕雄斌)</span>
            </h1>
            <p className="-mt-4 font-mono text-lg text-gray-600 dark:text-gray-400">
              Mathematics · Inverse Problems · Machine Learning 
            </p>
            <div className="flex flex-col items-center gap-3">
              <LinkButton href="mailto:yanxb@lzu.edu.cn">
               <IoMail />
                yanxb@lzu.edu.cn
              </LinkButton>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                 Office: Room  410, Lingyun Building (凌云楼), Lanzhou University Main Campus
              </div>
              </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-10">
        <CardContent>
          <Resume />
        </CardContent>
      </Card>
    </div>
  )
}
