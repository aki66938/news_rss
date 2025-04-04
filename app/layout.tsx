import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LoadingProvider } from "@/components/loading-provider"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "News RSS",
  description: "A customizable RSS news aggregator",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <LoadingProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                {children}
              </main>
            <footer className="py-6 border-t border-border/40 bg-muted/20">
              <div className="container flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                <div>
                  基于 <a href="https://docs.rsshub.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">RSSHUB</a> | 根据 MIT 许可证发布
                </div>
                <div>
                  © 2025. 一个开源项目。
                </div>
              </div>
            </footer>
            </div>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'