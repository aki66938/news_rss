"use client"

/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import React, { useEffect, useRef, useState } from 'react';
import './loading-bar.css';

interface LoadingBarProps {
  isLoading: boolean;
  progress?: number; // 0-100
  color?: string;
  height?: number;
  duration?: number;
}

/**
 * 页面加载进度条组件
 */
export function LoadingBar({ 
  isLoading, 
  progress, 
  color = '#0066FF', 
  height = 3,
  duration = 800
}: LoadingBarProps) {
  const [visible, setVisible] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理加载状态变化
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      // 如果没有指定进度，则自动增加进度
      if (progress === undefined) {
        // 自动增加进度到80%
        animateProgressTo(80);
      }
    } else {
      // 加载完成，快速完成进度条
      if (visible) {
        setCurrentProgress(100);
        // 动画完成后隐藏进度条
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setVisible(false);
          setCurrentProgress(0);
        }, 500);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, visible]);

  // 处理外部传入的进度变化
  useEffect(() => {
    if (progress !== undefined && isLoading) {
      setCurrentProgress(progress);
    }
  }, [progress, isLoading]);

  // 动画进度到指定值
  const animateProgressTo = (target: number) => {
    let start = currentProgress;
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = start + (target - start) * easedProgress;
      
      setCurrentProgress(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  // 缓动函数
  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  };

  if (!visible) return null;

  return (
    <div 
      className="loading-bar-container"
      style={{ height: `${height}px` }}
    >
      <div 
        ref={barRef}
        className="loading-bar"
        style={{ 
          width: `${currentProgress}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}
