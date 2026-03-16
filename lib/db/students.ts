export type Student = {
  name: string
  avatar: string
  email: string
  period: string
  position?: string
  type: "phd" | "postdoc" | "master"
  status: "current" | "former"
}

export const students: Student[] = [
  {
    name: "Yekun Zhu",
    avatar: "/people/zhu-yekun.jpg",
    email: "shadcn@vercel.com",
    period: "2021 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Nan Zhou",
    avatar: "/people/zhou-nan.jpg",
    email: "maxleiter@vercel.com",
    period: "2022 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Chen Min",
    avatar: "/people/min-chen.jpg",
    email: "evilrabbit@vercel.com",
    period: "2022 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Jishen Peng",
    avatar: "/people/peng-jishen.jpg",
    email: "evilrabbit@vercel.com",
    period: "2024 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Enze Jiang",
    avatar: "/people/jiang-enze.jpg",
    email: "evilrabbit@vercel.com",
    period: "2024 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Tongrun Lin",
    avatar: "/people/lin-tongrun.jpg",
    email: "evilrabbit@vercel.com",
    period: "2025 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Gengyuan Liu",
    avatar: "/people/liu-gengyuan.jpg",
    email: "evilrabbit@vercel.com",
    period: "2025 - present",
    type: "phd",
    status: "current",
  },
  {
    name: "Keke Wu",
    avatar: "/people/wu-keke.png",
    email: "evilrabbit@vercel.com",
    period: "2021 - 2024",
    position:
      "First position: Postdoc at Suzhou Institute for Advanced Research, University of Science and Technology of China",
    type: "phd",
    status: "former",
  },
  {
    name: "Xiongbin Yan",
    avatar: "/people/yan-xiongbin.jpg",
    email: "evilrabbit@vercel.com",
    period: "2022 - 2024",
    position:
      "First position: Associate Professor of Institute of Computational Mathematics, Lanzhou University",
    type: "postdoc",
    status: "former",
  },
]
