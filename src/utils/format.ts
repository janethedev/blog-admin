/**
 * 格式化工具函数
 */

/**
 * 格式化数字：超过1000显示为 k，超过10000显示为 w
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * 格式化日期为相对时间
 * @param date 日期字符串或 Date 对象
 * @returns 相对时间描述，如 "刚刚"、"3分钟前"
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date().getTime();
  const targetTime = new Date(date).getTime();
  const diff = now - targetTime;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (diff < minute) {
    return '刚刚';
  }
  if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  }
  if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  }
  if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  }
  if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  }
  return `${Math.floor(diff / month)}个月前`;
}

/**
 * 截断文本并添加省略号
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * 验证是否为有效的邮箱地址
 * @param email 邮箱字符串
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
