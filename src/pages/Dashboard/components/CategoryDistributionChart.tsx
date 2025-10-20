/**
 * 分类分布图表组件
 */

import { Pie } from '@ant-design/charts';
import { Card } from 'antd';
import type { CategoryDistributionItem } from '@/types';

interface CategoryDistributionChartProps {
  data?: CategoryDistributionItem[];
  loading?: boolean;
}

export default function CategoryDistributionChart({ data, loading }: CategoryDistributionChartProps) {
  const total = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  const config = {
    data: data || [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    // 先使用普通饼图，不用环形
    legend: {
      position: 'bottom' as const,
    },
    // 使用 tooltip 显示详细信息
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.name, value: `${datum.value} 篇` };
      },
    },
  };

  return (
    <Card 
      title="分类分布" 
      loading={loading}
      extra={<span>总计：{total} 篇</span>}
    >
      <div style={{ height: 300 }}>
        <Pie {...config} />
      </div>
    </Card>
  );
}