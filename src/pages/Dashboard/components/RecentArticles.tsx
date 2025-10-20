/**
 * 最近更新文章组件
 */

import { Badge, Card, List, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { history } from '@umijs/max';
import type { RecentArticle } from '@/types';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Text } = Typography;

interface RecentArticlesProps {
  data?: RecentArticle[];
  loading?: boolean;
}

export default function RecentArticles({ data, loading }: RecentArticlesProps) {
  const handleArticleClick = (id: number) => {
    history.push(`/article/edit/${id}`);
  };

  return (
    <Card title="最近更新" loading={loading}>
      <List
        dataSource={data || []}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => handleArticleClick(item.id)}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.title}</span>
                  <Tag color={item.status === 'published' ? 'success' : 'default'}>
                    {item.status === 'published' ? '已发布' : '草稿'}
                  </Tag>
                </div>
              }
              description={
                <Text type="secondary">
                  {dayjs(item.updateTime).fromNow()}更新
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

