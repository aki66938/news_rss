import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import './site-icon.css';

interface SiteIconProps {
  url: string;
  size?: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

/**
 * 网站图标组件
 * 使用DuckDuckGo的图标服务获取网站favicon
 */
export function SiteIcon({ url, size = 16, className = '', fallbackIcon }: SiteIconProps) {
  const [siteName, setSiteName] = useState<string>('未知来源');
  const [iconUrl, setIconUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const iconRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!url) {
      setError(true);
      return;
    }
    
    try {
      // 提取域名
      const hostname = new URL(url).hostname;
      setSiteName(hostname);
      
      // 使用DuckDuckGo的图标服务
      setIconUrl(`https://icons.duckduckgo.com/ip3/${hostname}.ico`);
      setError(false);
    } catch (e) {
      console.error('Error parsing URL:', url, e);
      setError(true);
    }
  }, [url]);
  
  // 如果有错误或没有URL，显示默认图标
  if (error || !url) {
    return (
      <div 
        className={cn("site-icon-container", className)}
        data-size={size}
        title="未知来源"
      >
        {fallbackIcon || <Globe size={size} />}
      </div>
    );
  }
  
  // 创建弹跳动画
  const handleBounce = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500); // 动画持续时间
    }
  };

  // 创建旋转动画
  const handleRotate = () => {
    if (!isRotating) {
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 800); // 动画持续时间
    }
  };

  return (
    <div 
      data-size={size}
      title={siteName}
      ref={iconRef}
      onClick={handleRotate}
      onMouseEnter={handleBounce}
      className={cn(
        "site-icon-container", 
        className,
        isAnimating && "site-icon-bounce",
        isRotating && "site-icon-rotate"
      )}
    >
      {iconUrl ? (
        <img 

          src={iconUrl} 
          alt={siteName}
          width={size}
          height={size}
          onError={() => setError(true)}
          className="site-icon-img"
        />
      ) : (
        fallbackIcon || <Globe size={size} />
      )}
    </div>
  );
}
