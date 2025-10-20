/**
 * 仪表盘页面
 */

import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import {
  getStatistics,
  getVisitTrend,
  getCategoryDistribution,
  getRecentArticles,
} from '@/services';
import type {
  DashboardStatistics,
  VisitTrendItem,
  CategoryDistributionItem,
  RecentArticle,
} from '@/types';
import StatisticCards from './components/StatisticCards';
import VisitTrendChart from './components/VisitTrendChart';
import CategoryDistributionChart from './components/CategoryDistributionChart';
import RecentArticles from './components/RecentArticles';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<DashboardStatistics>();
  const [visitTrend, setVisitTrend] = useState<VisitTrendItem[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistributionItem[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      const result = await getStatistics();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败：', error);
    }
  };

  // 加载访问趋势
  const loadVisitTrend = async (days: number = 7) => {
    try {
      const result = await getVisitTrend({ days });
      if (result.success) {
        setVisitTrend(result.data);
      }
    } catch (error) {
      console.error('获取访问趋势失败：', error);
    }
  };

  // 加载分类分布
  const loadCategoryDistribution = async () => {
    try {
      const result = await getCategoryDistribution();
      if (result.success) {
        setCategoryDistribution(result.data);
      }
    } catch (error) {
      console.error('获取分类分布失败：', error);
    }
  };

  // 加载最近文章
  const loadRecentArticles = async () => {
    try {
      const result = await getRecentArticles({ limit: 5 });
      if (result.success) {
        setRecentArticles(result.data);
      }
    } catch (error) {
      console.error('获取最近文章失败：', error);
    }
  };

  // 初始化加载所有数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadStatistics(),
        loadVisitTrend(),
        loadCategoryDistribution(),
        loadRecentArticles(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // 处理访问趋势天数切换
  const handleVisitTrendDaysChange = (days: number) => {
    loadVisitTrend(days);
  };

  return (
    <PageContainer
      title="仪表盘"
      subTitle="数据统计与概览"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 统计卡片 */}
        <StatisticCards data={statistics} loading={loading} />

        {/* 访问趋势和分类分布 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <VisitTrendChart
              data={visitTrend}
              loading={loading}
              onDaysChange={handleVisitTrendDaysChange}
            />
          </Col>
          <Col xs={24} lg={8}>
            <CategoryDistributionChart
              data={categoryDistribution}
              loading={loading}
            />
          </Col>
        </Row>

        {/* 最近更新文章 */}
        <RecentArticles data={recentArticles} loading={loading} />
      </Space>
    </PageContainer>
  );
}

