import React, { useState } from 'react';
import { CardConfig } from '@/lib/types';
import { saveConfig } from '@/lib/config';

interface CardSettingsProps {
  card: CardConfig;
  onUpdate: (updatedCard: CardConfig) => void;
  onClose: () => void;
}

export default function CardSettings({ card, onUpdate, onClose }: CardSettingsProps) {
  const [itemCount, setItemCount] = useState(card.itemCount || 10);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // 创建更新后的卡片配置
      const updatedCard: CardConfig = {
        ...card,
        itemCount: itemCount
      };
      
      // 调用父组件的更新函数
      onUpdate(updatedCard);
      onClose();
    } catch (error) {
      console.error('更新卡片设置失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">卡片设置: {card.title}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="itemCount" className="block text-sm font-medium mb-1">
              显示文章数量
            </label>
            <input
              id="itemCount"
              type="number"
              min="1"
              max="50"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入显示的文章数量"
              title="设置此卡片显示的最大文章数量"
            />
            <p className="text-xs text-gray-500 mt-1">
              设置此卡片显示的最大文章数量（1-50）
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
            >
              {isUpdating ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
