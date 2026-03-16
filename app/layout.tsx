import "@/app/globals.css"
import { RootProvider } from "fumadocs-ui/provider/next"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Noto_Sans_SC } from "next/font/google"

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  title: "Xiong-Bin Yan's Homepage",
  description: "Welcome to my personal website!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${jetBrainsMono.variable} ${notoSansSC.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
