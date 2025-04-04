/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import type { CardConfig, NewsItem } from "./types";

// 定义返回类型
interface RssResponse {
  items: NewsItem[];
  channelUrl?: string;
}

// 验证路由是否有效
function isValidRoute(route: string): boolean {
  // 检查路由是否以斜杠开头
  if (!route.startsWith('/')) {
    return false;
  }
  
  // 检查路由是否只有一个字符
  if (route.length <= 1) {
    return false;
  }
  
  // 检查路由是否包含至少一个斜杠分隔的部分
  const parts = route.split('/');
  return parts.length >= 2 && parts[1].length > 0;
}

// 从API获取RSS数据
export async function fetchRssData(card: CardConfig): Promise<RssResponse> {
  try {
    // 验证路由是否有效
    if (!isValidRoute(card.route)) {
      console.warn(`无效的路由格式: ${card.id}, 路由: ${card.route}`);
      return { items: [] };
    }
    
    console.log(`获取RSS数据: ${card.id}, 路由: ${card.route}`);
    
    // 调用我们创建的API
    // 传递itemCount参数限制返回的文章数量
    // 移除路由开头的斜杠，避免双斜杠问题
    const cleanRoute = card.route.startsWith('/') ? card.route.substring(1) : card.route;
    
    // 使用当前端口发送请求，避免端口不匹配问题
    const currentUrl = window.location.origin;
    const response = await fetch(`${currentUrl}/api/rss?route=${encodeURIComponent(cleanRoute)}&itemCount=${card.itemCount || 10}`);
    
    if (!response.ok) {
      console.error(`获取RSS数据失败: ${response.statusText}`);
      return { items: [] };
    }
    
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      console.warn(`${card.title}没有返回数据项`);
    }
    return {
      items: data.items || [],
      channelUrl: data.channelUrl
    };
  } catch (error) {
    console.error(`获取${card.title}数据失败:`, error);
    return { items: [] };
  }
}

// 刷新卡片数据的工具函数
export async function refreshCardData(card: CardConfig): Promise<RssResponse> {
  try {
    // 获取RSS数据
    const response = await fetchRssData(card);
    console.log(`${card.title}数据刷新成功，获取到${response.items.length}条数据`);
    if (response.channelUrl) {
      console.log(`获取到频道URL: ${response.channelUrl}`);
    }
    return response;
  } catch (error) {
    console.error(`刷新${card.title}数据失败:`, error);
    return { items: [] };
  }
}

