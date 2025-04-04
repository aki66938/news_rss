# News RSS v1.0.0

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/) [![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?logo=framer)](https://www.framer.com/motion/) [![Anime.js](https://img.shields.io/badge/Anime.js-4-red?logo=anime.js)](https://animejs.com/) [![TOML](https://img.shields.io/badge/TOML-3-yellow)](https://toml.io/)

一个基于RSSHub API的可定制新闻聚合前端应用。通过简洁美观的界面，轻松浏览来自不同来源的RSS信息。

## 功能特点

- 可配置的卡片布局，支持多种新闻源
- 拖拽排序功能，自定义卡片位置
- 响应式设计，适配不同设备
- 深色/浅色主题切换
- 动画效果增强用户体验
- 加载进度条动画
- 支持通过TOML文件配置默认信息源



## 部署方法

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器
- 可访问的RSSHub服务实例

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/news-rss.git
cd news-rss
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 配置RSSHub服务

编辑 `config/config.toml` 文件，设置RSSHub服务的基础URL：

```toml
[SETTINGS]
RSSHUB_BASE_URL = "http://your-rsshub-instance:1200/"
```

4. 开发模式运行

```bash
npm run dev
# 或
yarn dev
```

5. 生产环境构建与运行

```bash
npm run build
npm run start
# 或
yarn build
yarn start
```

## 配置说明

### 卡片配置

在 `config/config.toml` 文件中可以预设默认的信息卡片：

```toml
[[CARDS]]
ID = "zhihu-hot"
TITLE = "知乎热榜"
ROUTE = "/zhihu/hot"
ITEM_COUNT = 10
ENABLED = true
ORDER = 1
```

### 自定义主题

应用支持深色和浅色主题，可以通过界面上的主题切换按钮进行切换。

## 使用说明

1. 首页显示所有已配置的RSS卡片
2. 点击「添加卡片」按钮可以添加新的RSS源
3. 点击「编辑布局」按钮可以拖拽调整卡片位置
4. 点击「重置配置」按钮可以清除本地配置并重新加载默认配置
5. 每个卡片右上角的刷新按钮可以单独刷新该卡片的内容

## 许可证

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
