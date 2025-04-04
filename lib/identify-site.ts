/**
 * 根据URL识别网站类型
 * 返回对应的图标名称和网站名称
 */
export interface SiteInfo {
  icon: string;  // 图标名称，对应lucide-react图标库
  name: string;  // 网站名称
}

export function identifySiteFromUrl(url: string): SiteInfo | null {
  if (!url) return null;
  
  try {
    const hostname = new URL(url).hostname;
    
    // 匹配常见社交媒体和网站
    if (hostname.includes('zhihu.com')) {
      return { icon: 'MessageCircle', name: '知乎' };
    } else if (hostname.includes('weibo.com') || hostname.includes('weibo.cn')) {
      return { icon: 'MessageSquare', name: '微博' };
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return { icon: 'Twitter', name: 'Twitter' };
    } else if (hostname.includes('facebook.com')) {
      return { icon: 'Facebook', name: 'Facebook' };
    } else if (hostname.includes('github.com')) {
      return { icon: 'Github', name: 'GitHub' };
    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return { icon: 'Youtube', name: 'YouTube' };
    } else if (hostname.includes('instagram.com')) {
      return { icon: 'Instagram', name: 'Instagram' };
    } else if (hostname.includes('linkedin.com')) {
      return { icon: 'Linkedin', name: 'LinkedIn' };
    } else if (hostname.includes('reddit.com')) {
      return { icon: 'MessageSquare', name: 'Reddit' };
    } else if (hostname.includes('bilibili.com')) {
      return { icon: 'Play', name: 'Bilibili' };
    } else if (hostname.includes('douyin.com') || hostname.includes('tiktok.com')) {
      return { icon: 'Music', name: '抖音/TikTok' };
    } else if (hostname.includes('qq.com')) {
      return { icon: 'MessageCircle', name: 'QQ/腾讯' };
    } else if (hostname.includes('163.com')) {
      return { icon: 'Mail', name: '网易' };
    } else if (hostname.includes('sina.com')) {
      return { icon: 'Rss', name: '新浪' };
    } else if (hostname.includes('baidu.com')) {
      return { icon: 'Search', name: '百度' };
    } else if (hostname.includes('google.com')) {
      return { icon: 'Search', name: 'Google' };
    } else if (hostname.includes('bing.com')) {
      return { icon: 'Search', name: 'Bing' };
    }
    
    // 默认返回地球图标
    return { icon: 'Globe', name: hostname };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}
