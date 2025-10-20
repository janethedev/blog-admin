/**
 * 标签管理页面
 */

import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProFormTextArea, ProTable } from '@ant-design/pro-components';
import { Button, ColorPicker, Form, message, Popconfirm, Space, Tag } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useEffect, useRef, useState } from 'react';
import { getTagList, createTag, updateTag, deleteTag } from '@/services';
import type { Tag as TagType } from '@/types';
import dayjs from 'dayjs';

const presetColors = [
  '#f50', '#2db7f5', '#87d068', '#108ee9',
  '#722ed1', '#eb2f96', '#fa8c16', '#13c2c2',
  '#52c41a', '#faad14', '#1890ff', '#f5222d',
];

export default function TagManagement() {
  const actionRef = useRef<ActionType>(null as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#1890ff');

  // 新建标签
  const handleCreate = () => {
    setEditingTag(null);
    setSelectedColor('#1890ff');
    setModalVisible(true);
  };

  // 编辑标签
  const handleEdit = (record: TagType) => {
    setEditingTag(record);
    setSelectedColor(record.color || '#1890ff');
    setModalVisible(true);
  };

  // 删除标签
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteTag(id);
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
      const tagData = {
        ...values,
        color: selectedColor,
      };

      const result = editingTag
        ? await updateTag(editingTag.id, tagData)
        : await createTag(tagData);

      if (result.success) {
        message.success(editingTag ? '更新成功' : '创建成功');
        setModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(editingTag ? '更新失败' : '创建失败');
        return false;
      }
    } catch (error) {
      message.error(editingTag ? '更新失败' : '创建失败');
      return false;
    }
  };

  const columns: ProColumns<TagType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      width: 200,
      render: (_, record) => (
        <Tag color={record.color} style={{ fontSize: 14 }}>
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
      title: '颜色',
      dataIndex: 'color',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: record.color,
              border: '1px solid #d9d9d9',
            }}
          />
          <span style={{ fontFamily: 'monospace' }}>{record.color}</span>
        </Space>
      ),
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
              ? `该标签下有 ${record.articleCount} 篇文章，确定要删除吗？`
              : '确定要删除这个标签吗？'
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
      <ProTable<TagType>
        headerTitle="标签列表"
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
            新建标签
          </Button>,
        ]}
        request={async (params, sort) => {
          try {
            const result = await getTagList();
            
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
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        modalProps={{
          onCancel: () => {
            setModalVisible(false);
            setEditingTag(null);
          },
        }}
        onFinish={handleSubmit}
        initialValues={
          editingTag || {
            name: '',
            slug: '',
            description: '',
          }
        }
      >
        <ProFormText
          name="name"
          label="标签名称"
          placeholder="请输入标签名称"
          rules={[
            { required: true, message: '请输入标签名称' },
            { max: 30, message: '标签名称最多30个字符' },
          ]}
        />
        <ProFormText
          name="slug"
          label="Slug"
          placeholder="请输入 URL 友好的标识符（如：react）"
          rules={[
            { required: true, message: '请输入 Slug' },
            { pattern: /^[a-z0-9-]+$/, message: 'Slug 只能包含小写字母、数字和连字符' },
            { max: 50, message: 'Slug 最多50个字符' },
          ]}
          tooltip="用于 URL 的唯一标识符，只能包含小写字母、数字和连字符"
        />
        <Form.Item
          label="标签颜色"
          required
          tooltip="选择标签显示的颜色"
        >
          <ColorPicker
            value={selectedColor}
            onChange={(color: Color) => setSelectedColor(color.toHexString())}
            presets={[
              {
                label: '推荐',
                colors: presetColors,
              },
            ]}
            showText
          />
        </Form.Item>
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入标签描述"
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
