"use client"

/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { LoadingBar } from './loading-bar';
import { usePathname, useSearchParams } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
  setProgress: () => {},
});

export const useLoading = () => useContext(LoadingContext);

// 创建一个内部组件来使用useSearchParams
function LoadingProviderInner({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 监听路由变化自动触发加载状态
  useEffect(() => {
    startLoading();
    // 模拟页面加载完成
    const timer = setTimeout(() => {
      stopLoading();
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const stopLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const updateProgress = (value: number) => {
    setProgress(Math.min(Math.max(value, 0), 100));
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        startLoading,
        stopLoading,
        setProgress: updateProgress,
      }}
    >
      <LoadingBar 
        isLoading={isLoading} 
        progress={progress}
        color="#0066FF"
        height={3}
      />
      {children}
    </LoadingContext.Provider>
  );
}

// 导出的主组件，使用Suspense包裹内部组件
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
}
