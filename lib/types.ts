/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

// 卡片配置类型
export interface CardConfig {
  id: string
  title: string
  icon?: string
  color?: string
  route: string
  enabled: boolean
  order: number
  baseUrl: string
  itemCount?: number // 显示的文章数量
  channelUrl?: string // 频道URL，用于显示站点图标
}

// 新闻项类型
export interface NewsItem {
  id: string
  title: string
  link: string
  date?: string
  description?: string
  hot?: boolean
  channelUrl?: string // 频道URL，用于显示站点图标
}

// 卡片数据类型
export interface CardData {
  id: string
  title: string
  items: NewsItem[]
  loading: boolean
  error?: string
  channelUrl?: string // 频道URL，用于显示站点图标
}

