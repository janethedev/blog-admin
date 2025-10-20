/**
 * 仪表盘相关类型定义
 */

// 统计数据
export interface DashboardStatistics {
  articleCount: number;          // 文章总数
  articleGrowth: number;         // 文章增长百分比
  viewCount: number;             // 总访问量
  viewGrowth: number;            // 访问量增长百分比
  commentCount: number;          // 评论总数
  commentGrowth: number;         // 评论增长百分比
  userCount: number;             // 用户数
  userGrowth: number;            // 用户增长百分比
}

// 访问趋势数据点
export interface VisitTrendItem {
  date: string;                  // 日期（YYYY-MM-DD）
  views: number;                 // 访问量
  visitors: number;              // 访客数
}

// 分类分布数据
export interface CategoryDistributionItem {
  name: string;                  // 分类名称
  value: number;                 // 文章数量
}

// 最近文章
export interface RecentArticle {
  id: number;
  title: string;
  status: 'draft' | 'published';
  updateTime: string;
}

