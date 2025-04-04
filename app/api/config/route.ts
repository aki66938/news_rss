import { NextResponse } from 'next/server';
import { loadTomlConfig } from '@/lib/toml-config';

export async function GET() {
  try {
    const config = await loadTomlConfig();
    
    if (!config) {
      return NextResponse.json(
        { error: '无法加载配置' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('配置API错误:', error);
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    );
  }
}
