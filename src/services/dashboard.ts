/**
 * 仪表盘相关 API 服务
 */

import { request } from '@umijs/max';
import type {
  DashboardStatistics,
  VisitTrendItem,
  CategoryDistributionItem,
  RecentArticle,
  ApiResponse,
} from '@/types';
import { API_PATHS } from '@/constants';

/**
 * 获取统计数据
 */
export async function getStatistics() {
  return request<ApiResponse<DashboardStatistics>>(API_PATHS.DASHBOARD.STATISTICS, {
    method: 'GET',
  });
}

/**
 * 获取访问趋势
 */
export async function getVisitTrend(params?: { days?: number }) {
  return request<ApiResponse<VisitTrendItem[]>>(API_PATHS.DASHBOARD.VISIT_TREND, {
    method: 'GET',
    params,
  });
}

/**
 * 获取分类分布
 */
export async function getCategoryDistribution() {
  return request<ApiResponse<CategoryDistributionItem[]>>(
    API_PATHS.DASHBOARD.CATEGORY_DISTRIBUTION,
    {
      method: 'GET',
    }
  );
}

/**
 * 获取最近文章
 */
export async function getRecentArticles(params?: { limit?: number }) {
  return request<ApiResponse<RecentArticle[]>>(API_PATHS.DASHBOARD.RECENT_ARTICLES, {
    method: 'GET',
    params,
  });
}

