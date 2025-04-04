"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import "./theme-toggle.css"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 避免水合不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button 
      className="VPSwitch" 
      type="button" 
      role="switch" 
      title={resolvedTheme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
      aria-checked="true"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="check">
        <span className="icon">
          <span className={`sun-icon ${resolvedTheme !== "dark" ? "active" : ""}`}>
            <Sun size={14} />
          </span>
          <span className={`moon-icon ${resolvedTheme === "dark" ? "active" : ""}`}>
            <Moon size={14} />
          </span>
        </span>
      </span>
    </button>
  )
}

