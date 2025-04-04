"use client"

/**
 * News RSS v1.0.0
 * 基于RSSHub的新闻聚合前端
 * @author aki66938
 * @license MIT
 */

import { useState, useEffect } from "react"
import { NewsCard } from "./news-card"
import { loadConfig, saveConfig, updateCardOrder, addCard, clearLocalConfig } from "@/lib/config"
import type { CardConfig, CardData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Grid, Plus, X, RefreshCw, Trash2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion, AnimatePresence } from "framer-motion"
import { AddCardDialog } from "./add-card-dialog"
import { refreshCardData } from "@/lib/refresh-data"

export function NewsGrid() {
  const [config, setConfig] = useState<CardConfig[]>([])
  const [cardsData, setCardsData] = useState<CardData[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // 计算每行卡片数量
  const getColumnCount = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 4
  }

  // 初始化卡片数据
  const initializeCardsData = (config: CardConfig[]) => {
    const enabledCards = config.filter((card) => card.enabled)

    if (enabledCards.length === 0) {
      console.log("没有启用的卡片")
      return []
    }

    return enabledCards
      .sort((a, b) => a.order - b.order)
      .map((card) => ({
        id: card.id,
        title: card.title,
        items: [],
        loading: true,
      }))
  }

  // 加载卡片数据
  const loadCardData = async (cards: CardConfig[]) => {
    const enabledCards = cards.filter((card) => card.enabled)
    
    // 创建初始卡片数据（显示加载状态）
    const initialData = initializeCardsData(enabledCards)
    setCardsData(initialData)
    
    // 并行加载所有卡片数据
    const dataPromises = enabledCards.map(async (card) => {
      try {
        // 设置加载状态
        setCardsData((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, loading: true } : c))
        )
        
        // 获取卡片数据
        const result = await refreshCardData(card)
        
        // 更新卡片数据
        setCardsData((prev) =>
          prev.map((c) => {
            if (c.id === card.id) {
              return {
                ...c,
                items: result.items || [], // 确保返回的是NewsItem[]类型
                channelUrl: result.channelUrl,
                loading: false
              };
            }
            return c;
          })
        )
      } catch (error) {
        console.error(`加载${card.title}数据失败:`, error)
        setCardsData((prev) =>
          prev.map((c) =>
            c.id === card.id ? { ...c, loading: false, error: `加载失败` } : c
          )
        )
      }
    })
    
    // 等待所有数据加载完成
    await Promise.all(dataPromises)
  }

  useEffect(() => {
    // 先从本地存储加载配置
    const loadedConfig = loadConfig()
    console.log("从本地存储加载的配置:", loadedConfig)
    
    // 如果本地存储有配置，则使用本地存储的配置
    if (loadedConfig && loadedConfig.length > 0) {
      setConfig(loadedConfig)
      loadCardData(loadedConfig)
    } else {
      // 如果本地存储没有配置，则从服务器加载配置
      fetchServerConfig()
    }

    // 设置加载完成标志
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }, [])
  
  // 从服务器加载配置
  const fetchServerConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (!response.ok) {
        throw new Error(`获取配置失败: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('从服务器加载的配置:', data)
      
      if (data && data.cards && data.cards.length > 0) {
        // 保存到本地存储
        saveConfig(data.cards)
        // 设置状态
        setConfig(data.cards)
        // 加载卡片数据
        loadCardData(data.cards)
      } else {
        console.log('服务器配置为空，使用默认配置')
      }
    } catch (error) {
      console.error('加载服务器配置失败:', error)
    }
  }

  // 处理卡片拖拽开始
  const handleDragStart = (id: string) => {
    setDraggedCardId(id)
  }

  // 处理卡片拖拽结束
  const handleDragEnd = (id: string) => {
    if (!draggedCardId) return

    // 获取拖拽的卡片和目标位置
    const draggedCard = config.find((card) => card.id === draggedCardId)
    const targetCard = config.find((card) => card.id === id)

    if (draggedCard && targetCard && draggedCard.id !== targetCard.id) {
      // 更新卡片顺序
      const updatedConfig = updateCardOrder(config, draggedCard.id, targetCard.order)
      setConfig(updatedConfig)
      saveConfig(updatedConfig)

      // 更新卡片数据顺序
      const sortedData = [...cardsData].sort((a, b) => {
        const cardA = updatedConfig.find((c) => c.id === a.id)
        const cardB = updatedConfig.find((c) => c.id === b.id)
        return (cardA?.order || 0) - (cardB?.order || 0)
      })

      setCardsData(sortedData)
    }

    setDraggedCardId(null)
  }

  // 处理删除卡片
  const handleDeleteCard = (id: string) => {
    // 更新配置
    const updatedConfig = config.map((card) => (card.id === id ? { ...card, enabled: false } : card))
    setConfig(updatedConfig)
    saveConfig(updatedConfig)

    // 更新卡片数据
    setCardsData((prev) => prev.filter((card) => card.id !== id))
  }

  // 处理卡片设置更新
  const handleCardUpdate = (updatedCard: CardConfig) => {
    // 更新配置
    const updatedConfig = config.map(card => 
      card.id === updatedCard.id ? { ...card, itemCount: updatedCard.itemCount } : card
    );
    setConfig(updatedConfig);
    
    // 重新加载卡片数据
    loadCardData([updatedCard]);
  }
  
  // 处理添加卡片
  const handleAddCard = async (newCardConfig: Omit<CardConfig, "order">) => {
    // 更新配置
    const updatedConfig = addCard(config, newCardConfig)
    setConfig(updatedConfig)
    saveConfig(updatedConfig)

    // 创建新卡片数据（初始加载状态）
    const newCardData: CardData = {
      id: newCardConfig.id,
      title: newCardConfig.title,
      items: [],
      loading: true,
    }

    // 添加到卡片数据
    setCardsData((prev) => [...prev, newCardData])
    
    try {
      // 找到完整的卡片配置（包含order）
      const fullCardConfig = updatedConfig.find((c) => c.id === newCardConfig.id)
      
      if (fullCardConfig) {
        // 获取卡片数据
        const result = await refreshCardData(fullCardConfig)
        
        // 更新卡片数据
        setCardsData((prev) =>
          prev.map((c) => {
            if (c.id === newCardConfig.id) {
              return {
                ...c,
                items: result.items || [], // 确保返回的是NewsItem[]类型
                channelUrl: result.channelUrl,
                loading: false
              };
            }
            return c;
          })
        )
      }
    } catch (error) {
      console.error(`加载${newCardConfig.title}数据失败:`, error)
      setCardsData((prev) =>
        prev.map((c) =>
          c.id === newCardConfig.id ? { ...c, loading: false, error: `加载失败` } : c
        )
      )
    }
  }

  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  // 卡片动画变体
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex justify-end gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearLocalConfig();
            // 清除后从服务器重新加载配置
            fetchServerConfig();
          }}
          className="flex items-center gap-1 glass-effect text-red-500"
        >
          <Trash2 className="h-4 w-4" />
          <span>重置配置</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1 glass-effect"
        >
          <Plus className="h-4 w-4" />
          <span>添加卡片</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className="flex items-center gap-1 glass-effect"
        >
          {isEditMode ? (
            <>
              <X className="h-4 w-4" />
              <span>完成</span>
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              <span>编辑布局</span>
            </>
          )}
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="grid gap-4 theme-transition"
        style={{
          gridTemplateColumns: `repeat(${getColumnCount()}, minmax(0, 1fr))`,
        }}
      >
        <AnimatePresence>
          {cardsData
            .filter(card => {
              // 只显示有数据的卡片
              return card.items && card.items.length > 0;
            })
            .map((card, index) => {
              const cardConfig = config.find((c) => c.id === card.id)
              return (
                <motion.div 
                  key={card.id} 
                  variants={cardVariants} 
                  exit="exit" 
                  layout 
                  className="h-full"
                  drag={isEditMode}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={1}
                  dragMomentum={false}
                  onDragStart={() => handleDragStart(card.id)}
                  onDragEnd={() => {
                    // 当拖拽结束时，找出最近的卡片并交换位置
                    handleDragEnd(card.id);
                  }}
                >
                  <NewsCard
                    data={card}
                    color={cardConfig?.color}
                    isDraggable={isEditMode}
                    onDelete={handleDeleteCard}
                    onUpdate={handleCardUpdate}
                  />
                </motion.div>
              )
            })}
        </AnimatePresence>
      </motion.div>

      {cardsData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="text-muted-foreground mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 opacity-50"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 8h7" />
              <path d="M8 12h6" />
              <path d="M11 16h5" />
            </svg>
            <h3 className="text-lg font-medium">没有可显示的卡片</h3>
            <p className="mt-2 text-sm">点击"添加卡片"按钮创建新的卡片。</p>
          </div>
        </motion.div>
      )}

      <AddCardDialog isOpen={showAddDialog} onClose={() => setShowAddDialog(false)} onAdd={handleAddCard} />
    </div>
  )
}

