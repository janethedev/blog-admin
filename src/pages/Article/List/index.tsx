/**
 * 文章列表页面
 */

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { history } from '@umijs/max';
import { getArticleList, deleteArticle, batchDeleteArticles, batchUpdateArticleStatus } from '@/services';
import { getCategoryList } from '@/services';
import { getTagList } from '@/services';
import type { ArticleListItem, Category, Tag as TagType } from '@/types';
import dayjs from 'dayjs';

export default function ArticleList() {
  const actionRef = useRef<ActionType>(null as any);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);

  // 加载分类和标签数据
  const loadFilters = async () => {
    try {
      const [categoryResult, tagResult] = await Promise.all([
        getCategoryList(),
        getTagList(),
      ]);
      if (categoryResult.success) {
        setCategories(categoryResult.data);
      }
      if (tagResult.success) {
        setTags(tagResult.data);
      }
    } catch (error) {
      console.error('加载筛选数据失败：', error);
    }
  };

  // 初始化时加载筛选数据
  useEffect(() => {
    loadFilters();
  }, []);

  // 删除文章
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteArticle(id);
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的文章');
      return;
    }
    try {
      const result = await batchDeleteArticles({ ids: selectedRowKeys });
      if (result.success) {
        message.success(`成功删除 ${selectedRowKeys.length} 篇文章`);
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      } else {
        message.error('批量删除失败');
      }
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 批量发布/设为草稿
  const handleBatchUpdateStatus = async (status: 'published' | 'draft') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的文章');
      return;
    }
    try {
      const result = await batchUpdateArticleStatus({ ids: selectedRowKeys, status });
      if (result.success) {
        message.success(`成功${status === 'published' ? '发布' : '设为草稿'} ${selectedRowKeys.length} 篇文章`);
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      } else {
        message.error('批量操作失败');
      }
    } catch (error) {
      message.error('批量操作失败');
    }
  };

  const columns: ProColumns<ArticleListItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 300,
      ellipsis: true,
      render: (_, record) => (
        <a onClick={() => history.push(`/article/edit/${record.id}`)}>
          {record.title}
        </a>
      ),
    },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      width: 120,
      valueType: 'select',
      request: async () => {
        return categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
      },
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <Space size={[0, 8]} wrap>
          {record.tags.map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        published: { text: '已发布', status: 'Success' },
        draft: { text: '草稿', status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.status === 'published' ? 'success' : 'default'}>
          {record.status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      width: 80,
      hideInSearch: true,
      render: (_, record) => record.isTop ? <Tag color="red">置顶</Tag> : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      valueType: 'dateTime',
      hideInSearch: true,
      render: (_, record) => dayjs(record.updateTime).format('YYYY-MM-DD HH:mm'),
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => history.push(`/article/edit/${record.id}`)}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这篇文章吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<ArticleListItem>
      headerTitle="文章列表"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => history.push('/article/create')}
        >
          新建文章
        </Button>,
      ]}
      request={async (params, sort) => {
        try {
          const sortField = sort && Object.keys(sort)[0];
          const result = await getArticleList({
            pageNum: params.current || 1,
            pageSize: params.pageSize || 10,
            keyword: params.title,
            categoryId: params.category,
            status: params.status === 'all' ? undefined : params.status,
            sortField: sortField as 'createTime' | 'viewCount' | 'updateTime' | undefined,
            sortOrder: sort && Object.values(sort)[0] === 'ascend' ? 'ascend' : 'descend',
          });

          if (result.success) {
            return {
              data: result.data.list,
              total: result.data.total,
              success: true,
            };
          }
          return {
            data: [],
            total: 0,
            success: false,
          };
        } catch (error) {
          return {
            data: [],
            total: 0,
            success: false,
          };
        }
      }}
      columns={columns}
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as number[]),
      }}
      tableAlertRender={({ selectedRowKeys }) => (
        <Space size={16}>
          <span>已选择 {selectedRowKeys.length} 项</span>
        </Space>
      )}
      tableAlertOptionRender={() => (
        <Space size={16}>
          <a onClick={() => handleBatchUpdateStatus('published')}>批量发布</a>
          <a onClick={() => handleBatchUpdateStatus('draft')}>设为草稿</a>
          <Popconfirm
            title="确认删除"
            description={`确定要删除选中的 ${selectedRowKeys.length} 篇文章吗？`}
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>批量删除</a>
          </Popconfirm>
          <a onClick={() => setSelectedRowKeys([])}>取消选择</a>
        </Space>
      )}
    />
  );
}
