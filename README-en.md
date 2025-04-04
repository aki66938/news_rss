# News RSS v1.0.0

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/) [![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?logo=framer)](https://www.framer.com/motion/) [![Anime.js](https://img.shields.io/badge/Anime.js-4-red?logo=anime.js)](https://animejs.com/) [![TOML](https://img.shields.io/badge/TOML-3-yellow)](https://toml.io/)

A customizable news aggregation frontend application based on RSSHub API. Build your own RSS aggregator.

Demo: [demo](https://news-rss.vercel.app/)


## Features

- Configurable card layout supporting multiple news sources
- Drag and drop sorting functionality for custom card positioning
- Responsive design that adapts to different devices
- Dark/light theme switching
- Animation effects to enhance user experience
- Loading progress bar animation
- Support for configuring default information sources via TOML file



## Deployment

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Accessible RSSHub service instance

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/yourusername/news-rss.git
cd news-rss
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure RSSHub service

Edit the `config/config.toml` file to set the base URL for the RSSHub service:

```toml
[SETTINGS]
RSSHUB_BASE_URL = "http://your-rsshub-instance:1200/"
```

4. Run in development mode

```bash
npm run dev
# or
yarn dev
```

5. Build and run for production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Configuration

### Card Configuration

You can preset default information cards in the `config/config.toml` file:

```toml
[[CARDS]]
ID = "zhihu-hot"
TITLE = "Zhihu Hot List"
ROUTE = "/zhihu/hot"
ITEM_COUNT = 10
ENABLED = true
ORDER = 1
```

### Custom Themes

The application supports dark and light themes, which can be switched using the theme toggle button on the interface.

## Usage Instructions

1. The homepage displays all configured RSS cards
2. Click the "Add Card" button to add new RSS sources
3. Click the "Edit Layout" button to drag and adjust card positions
4. Click the "Reset Configuration" button to clear local configuration and reload default configuration
5. The refresh button in the upper right corner of each card can refresh the content of that card individually

## License

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
