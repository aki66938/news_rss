import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { CardConfig } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { cards } = await request.json();
    
    if (!Array.isArray(cards)) {
      return NextResponse.json(
        { error: '无效的卡片配置数据' },
        { status: 400 }
      );
    }
    
    // 构建TOML格式的配置
    let tomlContent = '# News RSS 配置文件\n\n';
    
    // 基础设置部分
    tomlContent += '# 基础设置\n[settings]\n';
    tomlContent += '# RSSHub 基础URL\n';
    tomlContent += 'RSSHUB_BASE_URL = "http://192.168.8.110:1200/"\n';
    tomlContent += '# 刷新间隔（分钟）\n';
    tomlContent += 'REFRESH_INTERVAL = 30\n';
    tomlContent += '# 默认主题 (light, dark, system)\n';
    tomlContent += 'DEFAULT_THEME = "system"\n\n';
    
    // 卡片配置部分
    tomlContent += '# 卡片配置\n';
    cards.forEach((card: CardConfig) => {
      tomlContent += `[[cards]]\n`;
      tomlContent += `id = "${card.id}"\n`;
      tomlContent += `title = "${card.title}"\n`;
      if (card.color) tomlContent += `color = "${card.color}"\n`;
      tomlContent += `route = "${card.route}"\n`;
      tomlContent += `enabled = ${card.enabled}\n`;
      tomlContent += `order = ${card.order}\n`;
      if (card.itemCount) tomlContent += `itemCount = ${card.itemCount}\n`;
      tomlContent += `\n`;
    });
    
    // 保存到配置文件
    const configPath = path.join(process.cwd(), 'config', 'config.toml');
    fs.writeFileSync(configPath, tomlContent, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新配置失败:', error);
    return NextResponse.json(
      { error: '更新配置失败' },
      { status: 500 }
    );
  }
}
