"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CardConfig } from "@/lib/types"

interface AddCardDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (cardConfig: Omit<CardConfig, "order">) => void
}

export function AddCardDialog({ isOpen, onClose, onAdd }: AddCardDialogProps) {
  const [title, setTitle] = useState("")
  const [route, setRoute] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [color, setColor] = useState("#3b82f6")
  const [error, setError] = useState<string | null>(null)
  
  // 从API加载默认的 RSSHUB_BASE_URL
  useEffect(() => {
    async function loadDefaultBaseUrl() {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error(`获取配置失败: ${response.statusText}`);
        }
        
        const config = await response.json();
        if (config && config.settings && config.settings.baseUrl) {
          setBaseUrl(config.settings.baseUrl);
        } else {
          // 如果无法获取配置，使用默认值
          setBaseUrl("https://rsshub.app/");
        }
      } catch (error) {
        console.error("获取配置失败:", error);
        setBaseUrl("https://rsshub.app/");
      }
    }
    
    loadDefaultBaseUrl();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证表单
    if (!title.trim()) {
      setError("请输入卡片标题")
      return
    }

    if (!route.trim()) {
      setError("请输入RSSHub路由")
      return
    }

    // 确保路由以/开头
    const formattedRoute = route.startsWith("/") ? route : `/${route}`

    // 创建新卡片配置
    const newCard: Omit<CardConfig, "order"> = {
      id: `card-${Date.now()}`,
      title: title.trim(),
      route: formattedRoute,
      baseUrl: baseUrl.trim(),
      color,
      enabled: true,
    }

    // 提交新卡片
    onAdd(newCard)

    // 重置表单
    setTitle("")
    setRoute("")
    // 重置为配置中的值，而不是硬编码的值
    async function resetBaseUrl() {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error(`获取配置失败: ${response.statusText}`);
        }
        
        const config = await response.json();
        if (config && config.settings && config.settings.baseUrl) {
          setBaseUrl(config.settings.baseUrl);
        }
      } catch (error) {
        console.error("重置基础URL失败:", error);
      }
    }
    resetBaseUrl();
    setColor("#3b82f6")
    setError(null)

    // 关闭对话框
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] glass-effect">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>添加新卡片</DialogTitle>
            <DialogDescription>输入RSSHub路由信息创建新的卡片。</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                卡片标题
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：知乎热榜"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="route" className="text-right">
                RSSHub路由
              </Label>
              <Input
                id="route"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="例如：/zhihu/pin/daily"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="baseUrl" className="text-right">
                基础URL
              </Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="例如：https://rsshub.app"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                卡片颜色
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            {error && <div className="text-destructive text-sm mt-2 text-center">{error}</div>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">添加卡片</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

