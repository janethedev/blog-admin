import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  generateVisitTrend,
  getCategoryDistribution,
  getRecentArticles,
  getStatistics,
} from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      errorMessage: 'Method not allowed',
    });
  }

  // 从 URL 中提取路径，例如 /api/dashboard/statistics -> 'statistics'
  const url = req.url || '';
  const pathMatch = url.match(/\/api\/dashboard\/([^?]+)/);
  const endpoint = pathMatch ? pathMatch[1] : '';

  // GET /api/dashboard/statistics
  if (endpoint === 'statistics') {
    return res.status(200).json({
      success: true,
      data: getStatistics(),
    });
  }

  // GET /api/dashboard/visitTrend
  if (endpoint === 'visitTrend') {
    const days = parseInt((req.query.days as string) || '7', 10);
    return res.status(200).json({
      success: true,
      data: generateVisitTrend(days),
    });
  }

  // GET /api/dashboard/categoryDistribution
  if (endpoint === 'categoryDistribution') {
    return res.status(200).json({
      success: true,
      data: getCategoryDistribution(),
    });
  }

  // GET /api/dashboard/recentArticles
  if (endpoint === 'recentArticles') {
    const limit = parseInt((req.query.limit as string) || '5', 10);
    return res.status(200).json({
      success: true,
      data: getRecentArticles(limit),
    });
  }

  return res.status(404).json({
    success: false,
    errorMessage: 'Endpoint not found',
  });
}
