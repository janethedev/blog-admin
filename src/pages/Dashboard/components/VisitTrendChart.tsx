/**
 * 访问趋势图表组件
 */

import { Line } from '@ant-design/charts';
import { Card, Radio } from 'antd';
import { useState } from 'react';
import type { VisitTrendItem } from '@/types';

interface VisitTrendChartProps {
  data?: VisitTrendItem[];
  loading?: boolean;
  onDaysChange?: (days: number) => void;
}

export default function VisitTrendChart({ data, loading, onDaysChange }: VisitTrendChartProps) {
  const [days, setDays] = useState<number>(7);

  const handleDaysChange = (value: number) => {
    setDays(value);
    onDaysChange?.(value);
  };

  // 转换数据格式用于多条线（在配置之前）
  const chartData = data?.flatMap((item) => [
    { date: item.date, value: item.views, type: '访问量' },
    { date: item.date, value: item.visitors, type: '访客数' },
  ]) || [];

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    xAxis: {
      type: 'time' as const,
      label: {
        formatter: (v: string) => {
          const date = new Date(v);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => String(v),
      },
    },
    tooltip: {
      showMarkers: true,
    },
    point: {
      size: 3,
      shape: 'circle',
    },
    lineStyle: {
      lineWidth: 2,
    },
  };

  return (
    <Card
      title="访问趋势"
      extra={
        <Radio.Group value={days} onChange={(e) => handleDaysChange(e.target.value)}>
          <Radio.Button value={7}>近7天</Radio.Button>
          <Radio.Button value={30}>近30天</Radio.Button>
          <Radio.Button value={90}>近90天</Radio.Button>
        </Radio.Group>
      }
      loading={loading}
    >
      <div style={{ height: 300 }}>
        <Line {...config} />
      </div>
    </Card>
  );
}

