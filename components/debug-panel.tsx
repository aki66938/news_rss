"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Bug } from "lucide-react"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [configData, setConfigData] = useState<{
    localStorage: string
    tomlConfig: string
  }>({ localStorage: "", tomlConfig: "" })

  const handleOpen = () => {
    // 获取当前配置
    let localStorageData = "未找到配置"
    let parsedLocalStorage = {}

    try {
      const rawData = window.localStorage.getItem("newsRssConfig")
      if (rawData) {
        parsedLocalStorage = JSON.parse(rawData)
        localStorageData = JSON.stringify(parsedLocalStorage, null, 2)
      }
    } catch (error) {
      console.error("解析localStorage数据失败:", error)
      localStorageData = "解析配置失败: " + String(error)
    }

    const tomlConfig = window.localStorage.getItem("newsRssTomlConfig") || "未找到TOML配置"

    setConfigData({
      localStorage: localStorageData,
      tomlConfig,
    })

    setIsOpen(true)
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={handleOpen}
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full glass-effect"
        title="调试面板"
      >
        <Bug className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto glass-effect">
          <DialogHeader>
            <DialogTitle>调试面板</DialogTitle>
            <DialogDescription>查看当前配置状态</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <h3 className="text-lg font-medium mb-2">本地存储配置</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[200px] text-xs">
                {configData.localStorage}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">TOML配置</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[200px] text-xs whitespace-pre-wrap">
                {configData.tomlConfig}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

