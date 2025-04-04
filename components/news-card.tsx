"use client"

/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, Settings } from "lucide-react"
import type { CardData, CardConfig } from "@/lib/types"
import { cn } from "@/lib/utils"
import { refreshCardData } from "@/lib/refresh-data"
import { motion, AnimatePresence } from "framer-motion"
import { ConfirmDialog } from "./confirm-dialog"
import CardSettings from "./card-settings"
import { loadConfig, saveConfig } from "@/lib/config"
import { formatRelativeTime } from "@/lib/format-time"
import { SiteIcon } from "./site-icon"
import "./news-card.css"
import "./news-item-time.css"

// 将十六进制颜色转换为RGB格式
function hexToRgb(hex: string) {
  // 移除#号如果存在
  hex = hex.replace(/^#/, '');
  
  // 解析RGB值
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  
  return `${r}, ${g}, ${b}`;
}

interface NewsCardProps {
  data: CardData
  color?: string
  isDraggable: boolean
  onDelete: (id: string) => void
  onUpdate?: (updatedCard: CardConfig) => void
}

export function NewsCard({ data, color = "#666", isDraggable, onDelete, onUpdate }: NewsCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [key, setKey] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [cardConfig, setCardConfig] = useState<CardConfig | null>(null)
  const [channelUrl, setChannelUrl] = useState<string>(data.channelUrl || '')
  
  // 当data变化时更新channelUrl
  useEffect(() => {
    if (data.channelUrl) {
      setChannelUrl(data.channelUrl);
      console.log('Setting channelUrl from data:', data.channelUrl);
    }
  }, [data.channelUrl]);

  // 刷新卡片数据
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // 获取卡片配置
      const config = loadConfig();
      const currentCardConfig = config.find(card => card.id === data.id);
      
      if (currentCardConfig) {
        const result = await refreshCardData(currentCardConfig)
        // 如果返回了频道URL，则保存它
        if (result && result.channelUrl) {
          setChannelUrl(result.channelUrl)
          // 将channelUrl传递给父组件，更新CardData
          if (onUpdate && currentCardConfig) {
            onUpdate({
              ...currentCardConfig,
              channelUrl: result.channelUrl
            })
          }
        }
        // 通过更新key触发重新渲染和动画
        setKey((prev) => prev + 1)
      }
    } catch (error) {
      console.error(`Failed to refresh ${data.id}:`, error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // 打开设置对话框
  const handleOpenSettings = () => {
    // 获取当前卡片配置
    const config = loadConfig();
    const currentCardConfig = config.find(card => card.id === data.id);
    if (currentCardConfig) {
      setCardConfig(currentCardConfig);
      setShowSettings(true);
    }
  }
  
  // 更新卡片设置
  const handleUpdateSettings = (updatedCard: CardConfig) => {
    // 更新本地配置
    const config = loadConfig();
    const updatedConfig = config.map(card => 
      card.id === updatedCard.id ? { ...card, itemCount: updatedCard.itemCount } : card
    );
    
    // 保存更新后的配置
    saveConfig(updatedConfig);
    
    // 如果提供了onUpdate回调，则调用它
    if (onUpdate) {
      onUpdate(updatedCard);
    }
    
    // 刷新数据
    handleRefresh();
  }

  // 处理删除按钮点击
  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  // 确认删除
  const handleConfirmDelete = () => {
    onDelete(data.id)
  }

  // 统一的动画变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  }

  return (
    <>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("h-full", isDraggable && "cursor-move z-10")}
        id={`card-${data.id}`}
      >
        <Card className="colored-glass-card h-full overflow-hidden theme-transition card-border-themed">
          {/* 使用CSS类设置动态颜色 */}
          <style jsx>{`
            .dynamic-color-element {
              --card-color: ${color};
              --card-color-rgb: ${hexToRgb(color)};
            }
          `}</style>
          <div className="card-color-overlay dynamic-color-element"></div>
          {/* 移除了顶部蓝色条 */}
          <CardHeader className="p-4 pb-2 flex flex-row relative z-10 card-border-header-themed">
            {/* 网站图标移到左侧，增大图标尺寸 */}
            <div className="mr-3 flex items-center">
              {channelUrl ? (
                <SiteIcon url={channelUrl} size={28} className="site-icon-card" />
              ) : (
                <span className="card-color-dot-large dynamic-color-element"></span>
              )}
            </div>
            
            <div className="flex flex-col flex-1">
              <div className="flex flex-row items-center justify-between w-full mb-1">
                <div className="flex flex-col">
                  <CardTitle className="text-base font-semibold card-title-themed">
                    {data.title}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    更新于: {new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
                <div className="flex gap-1 self-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background/50 card-button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    <span className="sr-only">刷新</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/20 text-destructive card-button"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">删除</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 relative z-10">
            {data.loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : data.error ? (
              <div className="text-destructive text-sm p-4">{data.error}</div>
            ) : data.items.length === 0 ? (
              <div className="text-muted-foreground text-sm p-4">暂无数据</div>
            ) : (
              <AnimatePresence mode="wait" key={key}>
                <div 
                  className="news-items-list space-y-1 card-content-area"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '0 0 12px 12px' 
                  }}
                >
                  {/* 打印第一个新闻项的日期，用于调试 */}
                  {data.items.length > 0 ? <>{console.log('First news item date:', data.items[0].date)}</> : null}
                  {data.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="news-item"
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-primary transition-colors group py-1.5 px-1 rounded-md hover:bg-primary/5"
                      >
                        <span className="card-item-number dynamic-color-element">
                          {index + 1}.
                        </span>
                        <div className="flex flex-1 items-center">
                          <span className="line-clamp-2 group-hover:text-primary transition-colors flex-1">{item.title}</span>
                          {item.hot && <span className="hot-tag">热门</span>}
                          <div className="news-item-time">
                            {item.date ? (
                              <>
                                <span className="time-number">{formatRelativeTime(item.date).replace(/[^0-9]/g, '')}</span>
                                <span className="time-unit">{formatRelativeTime(item.date).replace(/[0-9]/g, '')}</span>
                              </>
                            ) : '无时间'}
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="删除卡片"
        description={`确定要删除"${data.title}"卡片吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
      />
    </>
  )
}

