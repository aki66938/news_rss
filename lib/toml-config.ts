/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import type { CardConfig } from "./types";

// 使用环境变量检查是否在服务器端
const isServer = typeof window === 'undefined';

// 这个函数将在服务器端运行，用于加载TOML配置
export async function loadTomlConfig() {
  // 如果不是在服务器端，返回默认配置
  if (!isServer) {
    console.warn('试图在客户端加载TOML配置，返回默认配置');
    return getDefaultConfig();
  }
  
  try {
    // 使用动态导入以避免客户端的fs模块问题
    // 这些模块只在服务器端可用
    // @ts-ignore
    const fs = await import('fs');
    // @ts-ignore
    const path = await import('path');
    // @ts-ignore
    const toml = await import('toml');
    
    // 读取配置文件
    const configPath = path.default.resolve(process.cwd(), 'config', 'config.toml');
    const configContent = fs.default.readFileSync(configPath, 'utf-8');
    
    // 解析TOML内容
    const config = toml.default.parse(configContent);
    
    return {
      settings: {
        baseUrl: config.settings.RSSHUB_BASE_URL || "https://rsshub.app/",
        refreshInterval: config.settings.REFRESH_INTERVAL || 30,
        defaultTheme: config.settings.DEFAULT_THEME || "system",
        defaultItemCount: 10 // 默认值为10
      },
      cards: config.cards.map((card: any) => ({
        id: card.id,
        title: card.title,
        color: card.color,
        route: card.route,
        enabled: card.enabled,
        order: card.order,
        baseUrl: config.settings.RSSHUB_BASE_URL || "https://rsshub.app/",
        itemCount: card.itemCount || 10 // 使用默认值10
      }))
    };
  } catch (error) {
    console.error("加载TOML配置失败:", error);
    return getDefaultConfig();
  }
}

// 默认配置
function getDefaultConfig() {
  return {
    settings: {
      baseUrl: "https://rsshub.app/",
      refreshInterval: 30,
      defaultTheme: "system",
      defaultItemCount: 10
    },
    cards: []
  };
}

// 这个函数将在客户端运行，从API获取配置
export async function fetchConfig() {
  try {
    // 在客户端，我们需要从API获取配置
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error(`获取配置失败: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("获取配置失败:", error);
    return null;
  }
}
