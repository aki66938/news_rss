/**
 * 将日期转换为相对时间（如：5分钟前、2小时前、3天前等）
 */
export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) {
    // 日期字符串为空
    return '';
  }
  
  // 尝试解析不同格式的日期
  let date: Date;
  
  try {
    // 首先尝试直接解析
    date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      // 如果日期无效，尝试处理一些RSS常见的日期格式
      // RFC 822格式处理（例如：Wed, 02 Oct 2002 13:00:00 GMT）
      if (dateString.includes(',')) {
        const parts = dateString.split(',');
        if (parts.length > 1) {
          const cleanedDateString = parts.slice(1).join(',').trim();
          date = new Date(cleanedDateString);
        }
      }
      
      // 如果还是无效，返回空字符串
      if (isNaN(date.getTime())) {
        return '未知';
      }
    }
  } catch (error) {
    return '错误';
  }
  
  // 使用当前时间作为基准
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // 处理未来日期
  if (seconds < 0) {
    const futureSeconds = Math.abs(seconds);
    
    // 小于1分钟
    if (futureSeconds < 60) {
      return '即将发布';
    }
    
    // 小于1小时
    if (futureSeconds < 3600) {
      const minutes = Math.floor(futureSeconds / 60);
      return `${minutes}分钟后`;
    }
    
    // 小于1天
    if (futureSeconds < 86400) {
      const hours = Math.floor(futureSeconds / 3600);
      return `${hours}小时后`;
    }
    
    // 小于30天
    if (futureSeconds < 2592000) {
      const days = Math.floor(futureSeconds / 86400);
      return `${days}天后`;
    }
    
    return '将来';
  }
  
  // 返回简洁的格式，适合竖向显示
  // 小于1分钟
  if (seconds < 60) {
    return '刚刚';
  }
  
  // 小于1小时
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    // 去掉前导零
    return `${minutes}分钟`;
  }
  
  // 小于1天
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    // 去掉前导零，将“时”改为“小时”
    return `${hours}小时`;
  }
  
  // 小于30天
  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    // 去掉前导零
    return `${days}天`;
  }
  
  // 小于12个月
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    // 去掉前导零
    return `${months}月`;
  }
  
  // 大于等于12个月
  const years = Math.floor(seconds / 31536000);
  // 去掉前导零
  return `${years}年`;
}
