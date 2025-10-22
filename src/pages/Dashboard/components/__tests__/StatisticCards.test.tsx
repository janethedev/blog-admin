/**
 * StatisticCards 组件单元测试
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import type { DashboardStatistics } from '@/types';
import StatisticCards from '../StatisticCards';

describe('StatisticCards Component', () => {
  const mockData: DashboardStatistics = {
    articleCount: 120,
    articleGrowth: 15,
    viewCount: 8650,
    viewGrowth: -5,
    commentCount: 230,
    commentGrowth: 8,
    userCount: 45,
    userGrowth: 0,
  };

  it('should render all statistic cards titles', () => {
    render(<StatisticCards data={mockData} loading={false} />);

    expect(screen.getByText('文章总数')).toBeTruthy();
    expect(screen.getByText('总访问量')).toBeTruthy();
    expect(screen.getByText('评论总数')).toBeTruthy();
    expect(screen.getByText('用户数量')).toBeTruthy();
  });

  it('should display correct statistic values', () => {
    render(<StatisticCards data={mockData} loading={false} />);

    // 检查数值是否正确显示（Ant Design Statistic 会格式化数字，添加千位分隔符）
    expect(screen.getByText('120')).toBeTruthy(); // articleCount
    expect(screen.getByText('8,650')).toBeTruthy(); // viewCount - 格式化后带逗号
    expect(screen.getByText('230')).toBeTruthy(); // commentCount
    expect(screen.getByText('45')).toBeTruthy(); // userCount
  });

  it('should show positive growth trend correctly', () => {
    const { container } = render(
      <StatisticCards data={mockData} loading={false} />,
    );

    // 正增长应该显示为绿色
    const growthElements = container.querySelectorAll(
      '[style*="rgb(82, 196, 26)"]',
    );
    expect(growthElements.length).toBeGreaterThan(0);
  });

  it('should show negative growth trend correctly', () => {
    const { container } = render(
      <StatisticCards data={mockData} loading={false} />,
    );

    // 负增长应该显示为红色
    const growthElements = container.querySelectorAll(
      '[style*="rgb(255, 77, 79)"]',
    );
    expect(growthElements.length).toBeGreaterThan(0);
  });

  it('should handle undefined data gracefully', () => {
    render(<StatisticCards loading={false} />);

    // 应该显示默认值 0，而不是崩溃
    expect(screen.getByText('文章总数')).toBeTruthy();
    expect(screen.getByText('总访问量')).toBeTruthy();
  });

  it('should show loading state correctly', () => {
    const { container } = render(
      <StatisticCards data={mockData} loading={true} />,
    );

    // 验证组件在 loading 状态下能正常渲染，不会崩溃
    expect(container.firstChild).toBeTruthy();
  });

  it('should render suffix correctly', () => {
    render(<StatisticCards data={mockData} loading={false} />);

    expect(screen.getByText('篇')).toBeTruthy(); // 文章总数的后缀
    expect(screen.getByText('条')).toBeTruthy(); // 评论总数的后缀
    expect(screen.getByText('人')).toBeTruthy(); // 用户数量的后缀
  });
});
