import { NextResponse } from 'next/server';
import { loadTomlConfig } from '@/lib/toml-config';
import { XMLParser } from 'fast-xml-parser';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route');
    const itemCount = searchParams.get('itemCount') ? parseInt(searchParams.get('itemCount')!) : null;
    
    if (!route) {
      return NextResponse.json(
        { error: '缺少路由参数' },
        { status: 400 }
      );
    }
    
    // 加载配置获取基础URL
    const config = await loadTomlConfig();
    if (!config) {
      return NextResponse.json(
        { error: '无法加载配置' },
        { status: 500 }
      );
    }
    
    const baseUrl = config.settings.baseUrl;
    // 确保路由和基础URL之间没有重复的斜杠
    const formattedRoute = route.startsWith('/') ? route.substring(1) : route;
    const fullUrl = `${baseUrl}${formattedRoute}`;
    
    // 从RSSHub获取数据
    console.log(`正在获取RSS数据: ${fullUrl}`);
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `获取RSS数据失败: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // 解析RSS数据
    const data = await response.text();
    console.log('Raw XML data sample:', data.substring(0, 500)); // 打印原始 XML 数据的一部分
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => ['item'].includes(name) // 确保 item 始终作为数组处理
    });
    const result = parser.parse(data);
    
    // 提取条目
    const channel = result.rss?.channel;
    const rawItems = channel?.item || [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    
    // 提取频道URL
    const channelUrl = channel?.link || '';
    
    // 打印原始数据以进行调试
    console.log('Raw RSS items:', JSON.stringify(items[0], null, 2));
    
    const formattedItems = items.map((item, index) => {
      // 确保日期字段正确映射
      const formattedItem = {
        id: `item-${Date.now()}-${index}`, // 添加唯一ID
        title: item.title || '无标题',
        link: item.link || '#',
        date: item.pubDate || '',
        description: item.description || ''
      };
      
      // 打印格式化后的数据
      if (index === 0) {
        console.log('Formatted item with date:', formattedItem);
      }
      
      return formattedItem;
    });
    
    // 如果指定了显示数量，则限制返回的文章数量
    const limitedItems = itemCount ? formattedItems.slice(0, itemCount) : formattedItems;
    
    return NextResponse.json({ 
      items: limitedItems,
      channelUrl: channelUrl // 返回频道URL
    });
  } catch (error) {
    console.error('RSS API错误:', error);
    return NextResponse.json(
      { error: '获取RSS数据失败' },
      { status: 500 }
    );
  }
}
