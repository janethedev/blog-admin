/**
 * 统计卡片组件
 */

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import type { DashboardStatistics } from '@/types';

interface StatisticCardsProps {
  data?: DashboardStatistics;
  loading?: boolean;
}

const { Statistic } = StatisticCard;

export default function StatisticCards({ data, loading }: StatisticCardsProps) {
  const renderTrend = (value: number) => {
    const isUp = value >= 0;
    return (
      <span style={{ color: isUp ? '#52c41a' : '#ff4d4f' }}>
        {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <StatisticCard
          statistic={{
            title: '文章总数',
            value: data?.articleCount || 0,
            suffix: '篇',
            description: renderTrend(data?.articleGrowth || 0),
          }}
          loading={loading}
          chart={<div style={{ height: 46 }}>{/* 可以添加迷你图表 */}</div>}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticCard
          statistic={{
            title: '总访问量',
            value: data?.viewCount || 0,
            description: renderTrend(data?.viewGrowth || 0),
          }}
          loading={loading}
          chart={<div style={{ height: 46 }}>{/* 可以添加迷你图表 */}</div>}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticCard
          statistic={{
            title: '评论总数',
            value: data?.commentCount || 0,
            suffix: '条',
            description: renderTrend(data?.commentGrowth || 0),
          }}
          loading={loading}
          chart={<div style={{ height: 46 }}>{/* 可以添加迷你图表 */}</div>}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticCard
          statistic={{
            title: '用户数量',
            value: data?.userCount || 0,
            suffix: '人',
            description: renderTrend(data?.userGrowth || 0),
          }}
          loading={loading}
          chart={<div style={{ height: 46 }}>{/* 可以添加迷你图表 */}</div>}
        />
      </Col>
    </Row>
  );
}
