/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import type { CardConfig } from "./types"

// 默认配置 - 空数组，不预设任何卡片
export const defaultConfig: CardConfig[] = []

// 从本地存储加载配置
export function loadConfig(): CardConfig[] {
  if (typeof window === "undefined") return defaultConfig

  const savedConfig = localStorage.getItem("newsRssConfig")
  if (!savedConfig) {
    // 如果本地存储中没有配置，使用默认配置并保存
    localStorage.setItem("newsRssConfig", JSON.stringify(defaultConfig))
    return defaultConfig
  }

  try {
    return JSON.parse(savedConfig)
  } catch (e) {
    console.error("Failed to parse config:", e)
    return defaultConfig
  }
}

// 清除本地存储中的配置
export function clearLocalConfig(): void {
  if (typeof window === "undefined") return
  
  // 清除本地存储中的所有配置
  localStorage.removeItem("newsRssConfig")
  localStorage.removeItem("newsRssTomlConfig")
  
  console.log("本地存储配置已清除")
  
  // 刷新页面以应用新配置
  window.location.reload()
}

// 保存配置到本地存储和TOML文件
export function saveConfig(config: CardConfig[]): void {
  if (typeof window === "undefined") return

  // 保存到本地存储
  localStorage.setItem("newsRssConfig", JSON.stringify(config))

  // 更新TOML配置文件
  updateTomlConfig(config)
}

// 更新TOML配置文件
async function updateTomlConfig(config: CardConfig[]): Promise<void> {
  try {
    // 构建TOML格式的配置示例（仅用于控制台显示）
    let tomlContent =
      '# News RSS 配置文件\n\n# 基础设置\n[settings]\n# RSSHub 基础URL\nRSSHUB_BASE_URL = "http://192.168.8.110:1200/"\n# 刷新间隔（分钟）\nREFRESH_INTERVAL = 30\n# 默认主题 (light, dark, system)\nDEFAULT_THEME = "system"\n\n# 卡片配置\n'

    config.forEach((card) => {
      tomlContent += `[[cards]]\nid = "${card.id}"\ntitle = "${card.title}"\ncolor = "${card.color}"\nroute = "${card.route}"\nenabled = ${card.enabled}\norder = ${card.order}\n\n`
    })

    console.log("TOML配置已更新:")
    console.log(tomlContent)

    // 调用API更新服务器上的配置文件
    try {
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: config })
      })
      
      if (!response.ok) {
        throw new Error(`更新配置失败: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('配置更新结果:', result)
    } catch (apiError) {
      console.error('调用配置更新API失败:', apiError)
    }

    // 为了兼容性，仍然将TOML内容保存到localStorage
    localStorage.setItem("newsRssTomlConfig", tomlContent)
  } catch (error) {
    console.error("更新TOML配置失败:", error)
  }
}

// 更新卡片顺序
export function updateCardOrder(config: CardConfig[], id: string, newOrder: number): CardConfig[] {
  const updatedConfig = [...config]
  const cardIndex = updatedConfig.findIndex((card) => card.id === id)

  if (cardIndex === -1) return config

  const oldOrder = config[cardIndex].order
  
  // 如果新旧顺序相同，不需要更新
  if (oldOrder === newOrder) return config
  
  // 更新顺序
  updatedConfig.forEach((card) => {
    if (card.id === id) {
      // 设置拖拽卡片的新顺序
      card.order = newOrder
    } else if (oldOrder < newOrder) {
      // 向下拖拽：将中间卡片向上移动
      if (card.order > oldOrder && card.order <= newOrder) {
        card.order -= 1
      }
    } else {
      // 向上拖拽：将中间卡片向下移动
      if (card.order >= newOrder && card.order < oldOrder) {
        card.order += 1
      }
    }
  })
  
  return updatedConfig
}

// 重新启用卡片
export function enableCard(config: CardConfig[], id: string): CardConfig[] {
  return config.map((card) => (card.id === id ? { ...card, enabled: true } : card))
}

// 添加新卡片
export function addCard(config: CardConfig[], newCard: Omit<CardConfig, "order">): CardConfig[] {
  // 找到当前最大的order
  const maxOrder = config.reduce((max, card) => Math.max(max, card.order), -1)

  // 创建完整的卡片配置
  const completeCard: CardConfig = {
    ...newCard,
    order: maxOrder + 1,
  }

  // 添加到配置中
  return [...config, completeCard]
}

