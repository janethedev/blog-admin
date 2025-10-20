/**
 * 分类管理页面
 */

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/services';
import type { Category } from '@/types';
import dayjs from 'dayjs';

export default function CategoryManagement() {
  const actionRef = useRef<ActionType>(null as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // 新建分类
  const handleCreate = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  // 编辑分类
  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setModalVisible(true);
  };

  // 删除分类
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteCategory(id);
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

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, values)
        : await createCategory(values);

      if (result.success) {
        message.success(editingCategory ? '更新成功' : '创建成功');
        setModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(editingCategory ? '更新失败' : '创建失败');
        return false;
      }
    } catch (error) {
      message.error(editingCategory ? '更新失败' : '创建失败');
      return false;
    }
  };

  const columns: ProColumns<Category>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 200,
      render: (_, record) => (
        <Tag color="blue" style={{ fontSize: 14 }}>
          {record.name}
        </Tag>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      width: 200,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '文章数',
      dataIndex: 'articleCount',
      width: 100,
      hideInSearch: true,
      sorter: true,
      render: (_, record) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {record.articleCount}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      hideInSearch: true,
      render: (_, record) => dayjs(record.createTime).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description={
            record.articleCount > 0
              ? `该分类下有 ${record.articleCount} 篇文章，确定要删除吗？`
              : '确定要删除这个分类吗？'
          }
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
    <>
      <ProTable<Category>
        headerTitle="分类列表"
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
            onClick={handleCreate}
          >
            新建分类
          </Button>,
        ]}
        request={async (params, sort) => {
          try {
            const result = await getCategoryList();
            
            if (result.success) {
              let list = result.data;

              // 搜索过滤
              if (params.name) {
                list = list.filter((item) =>
                  item.name.toLowerCase().includes((params.name as string).toLowerCase())
                );
              }

              // 排序
              if (sort && sort.articleCount) {
                list = [...list].sort((a, b) => {
                  if (sort.articleCount === 'ascend') {
                    return a.articleCount - b.articleCount;
                  }
                  return b.articleCount - a.articleCount;
                });
              }

              return {
                data: list,
                success: true,
                total: list.length,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <ModalForm
        title={editingCategory ? '编辑分类' : '新建分类'}
        open={modalVisible}
        modalProps={{
          onCancel: () => {
            setModalVisible(false);
            setEditingCategory(null);
          },
        }}
        onFinish={handleSubmit}
        initialValues={
          editingCategory || {
            name: '',
            slug: '',
            description: '',
          }
        }
      >
        <ProFormText
          name="name"
          label="分类名称"
          placeholder="请输入分类名称"
          rules={[
            { required: true, message: '请输入分类名称' },
            { max: 50, message: '分类名称最多50个字符' },
          ]}
        />
        <ProFormText
          name="slug"
          label="Slug"
          placeholder="请输入 URL 友好的标识符（如：frontend）"
          rules={[
            { required: true, message: '请输入 Slug' },
            { pattern: /^[a-z0-9-]+$/, message: 'Slug 只能包含小写字母、数字和连字符' },
            { max: 50, message: 'Slug 最多50个字符' },
          ]}
          tooltip="用于 URL 的唯一标识符，只能包含小写字母、数字和连字符"
        />
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入分类描述"
          fieldProps={{
            maxLength: 200,
            showCount: true,
            rows: 3,
          }}
        />
      </ModalForm>
    </>
  );
}
