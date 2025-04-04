import { NewsGrid } from "@/components/news-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { DebugPanel } from "@/components/debug-panel"

export default function Home() {
  return (
    <div className="bg-background transition-colors duration-300">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/40 via-background to-background dark:from-slate-900/50 dark:via-background dark:to-background"></div>
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center">
              <span className="font-bold">N</span>
            </div>
            <h1 className="text-xl font-bold">News RSS</h1>
          </div>
          <ThemeToggle />
        </header>
        <NewsGrid />
      </div>
      <DebugPanel />
    </div>
  )
}

