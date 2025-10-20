/**
 * 仪表盘相关 Mock API
 */

import type { Request, Response } from 'express';
import {
  getStatistics,
  generateVisitTrend,
  getCategoryDistribution,
  getRecentArticles,
} from './_data';

export default {
  // 获取统计数据
  'GET /api/dashboard/statistics': (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: getStatistics(),
    });
  },
  
  // 获取访问趋势
  'GET /api/dashboard/visitTrend': (req: Request, res: Response) => {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days as string, 10);
    
    return res.json({
      success: true,
      data: generateVisitTrend(daysNum),
    });
  },
  
  // 获取分类分布
  'GET /api/dashboard/categoryDistribution': (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: getCategoryDistribution(),
    });
  },
  
  // 获取最近文章
  'GET /api/dashboard/recentArticles': (req: Request, res: Response) => {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit as string, 10);
    
    return res.json({
      success: true,
      data: getRecentArticles(limitNum),
    });
  },
};

