/**
 * 文章编辑/新建页面
 */

import { ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { history, useParams } from '@umijs/max';
import MDEditor from '@uiw/react-md-editor';
import {
  getArticleDetail,
  createArticle,
  updateArticle,
  uploadImage,
} from '@/services';
import { getCategoryList } from '@/services';
import { getTagList } from '@/services';
import type { ArticleDetail, Category, Tag as TagType } from '@/types';
import dayjs from 'dayjs';
import './index.less';

export default function ArticleEdit() {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);

  const isEdit = !!id;

  // 加载文章详情
  const loadArticle = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const result = await getArticleDetail(Number(id));
      if (result.success && result.data) {
        const article = result.data;
        form.setFieldsValue({
          title: article.title,
          summary: article.summary,
          categoryId: article.category.id,
          tagIds: article.tags.map((tag) => tag.id),
          isTop: article.isTop,
          allowComment: article.allowComment,
        });
        setContent(article.content);
        if (article.coverImage) {
          setCoverImage([
            {
              uid: '-1',
              name: 'cover.jpg',
              status: 'done',
              url: article.coverImage,
            },
          ]);
        }
      } else {
        message.error('文章加载失败');
        history.back();
      }
    } catch (error) {
      message.error('文章加载失败');
      history.back();
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  // 加载分类和标签
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

  useEffect(() => {
    loadFilters();
    if (isEdit) {
      loadArticle();
    }
  }, [isEdit, loadArticle]);

  // 自动保存草稿
  useEffect(() => {
    const timer = setInterval(() => {
      const values = form.getFieldsValue();
      if (values.title || content) {
        localStorage.setItem(
          'article_draft',
          JSON.stringify({
            ...values,
            content,
            timestamp: Date.now(),
          }),
        );
      }
    }, 30000); // 每30秒保存一次

    return () => clearInterval(timer);
  }, [form, content]);

  // 恢复草稿
  useEffect(() => {
    if (!isEdit) {
      const draft = localStorage.getItem('article_draft');
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          const timeDiff = Date.now() - draftData.timestamp;
          if (timeDiff < 24 * 60 * 60 * 1000) { // 24小时内的草稿
            message.info('检测到草稿，已自动恢复');
            form.setFieldsValue(draftData);
            setContent(draftData.content || '');
          }
        } catch (error) {
          console.error('恢复草稿失败：', error);
        }
      }
    }
  }, [isEdit, form]);

  // 处理封面上传
  const handleCoverUpload = async (file: File) => {
    try {
      const result = await uploadImage(file);
      if (result.success && result.data) {
        setCoverImage([
          {
            uid: '-1',
            name: file.name,
            status: 'done',
            url: result.data.url,
          },
        ]);
        return result.data.url;
      }
      message.error('上传失败');
      return null;
    } catch (error) {
      message.error('上传失败');
      return null;
    }
  };

  // 处理 Markdown 编辑器中的图片上传
  const handleMdImageUpload = async (file: File) => {
    try {
      const result = await uploadImage(file);
      if (result.success && result.data) {
        return result.data.url;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // 保存或发布文章
  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (!content.trim()) {
        message.warning('请输入文章内容');
        return;
      }

      setSubmitting(true);

      const articleData: any = {
        title: values.title,
        content,
        summary: values.summary || content.substring(0, 200),
        coverImage: coverImage[0]?.url || '',
        categoryId: values.categoryId,
        tags: values.tagIds || [],
        status,
        isTop: values.isTop || false,
        allowComment: values.allowComment !== undefined ? values.allowComment : true,
      };

      const result = isEdit
        ? await updateArticle(Number(id), articleData)
        : await createArticle(articleData);

      if (result.success) {
        message.success(`${status === 'published' ? '发布' : '保存'}成功`);
        localStorage.removeItem('article_draft'); // 清除草稿
        history.push('/article/list');
      } else {
        message.error(result.errorMessage || `${status === 'published' ? '发布' : '保存'}失败`);
      }
    } catch (error) {
      console.error('提交失败：', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: isEdit ? '编辑文章' : '新建文章',
        breadcrumb: {},
        extra: [
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
            返回
          </Button>,
          <Button
            key="draft"
            icon={<SaveOutlined />}
            loading={submitting}
            onClick={() => handleSubmit('draft')}
          >
            保存草稿
          </Button>,
          <Button
            key="publish"
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={() => handleSubmit('published')}
          >
            发布文章
          </Button>,
        ],
      }}
      loading={loading}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isTop: false,
            allowComment: true,
          }}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[
              { required: true, message: '请输入文章标题' },
              { max: 100, message: '标题最多100个字符' },
            ]}
          >
            <Input placeholder="请输入文章标题" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="文章分类"
                name="categoryId"
                rules={[{ required: true, message: '请选择文章分类' }]}
              >
                <Select
                  placeholder="请选择分类"
                  options={categories.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="文章标签"
                name="tagIds"
                rules={[{ required: true, message: '请选择至少一个标签' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="文章摘要" name="summary">
            <Input.TextArea
              placeholder="请输入文章摘要，不填写将自动截取正文前200字"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item label="封面图片">
            <Upload
              listType="picture-card"
              fileList={coverImage}
              beforeUpload={(file) => {
                handleCoverUpload(file);
                return false;
              }}
              onRemove={() => setCoverImage([])}
              maxCount={1}
            >
              {coverImage.length === 0 && '上传封面'}
            </Upload>
          </Form.Item>

          <Form.Item label="文章内容" required>
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={600}
                preview="live"
                textareaProps={{
                  placeholder: '请输入文章内容，支持 Markdown 语法...',
                }}
              />
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="置顶" name="isTop" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="允许评论" name="allowComment" valuePropName="checked">
                <Switch checkedChildren="允许" unCheckedChildren="禁止" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  );
}
