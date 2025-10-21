import type { VercelRequest, VercelResponse } from '@vercel/node';
import { articles, categories, tags } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const articleId = parseInt(id as string, 10);

  // GET /api/articles/:id - 获取文章详情
  if (req.method === 'GET') {
    const article = articles.find((a) => a.id === articleId);

    if (!article) {
      return res.status(200).json({
        success: false,
        errorCode: '3001',
        errorMessage: '文章不存在',
      });
    }

    // 补充分类和标签信息
    const category = categories.find((c) => c.id === article.categoryId);
    const articleTags = tags.filter((t) => article.tags.includes(t.id));

    const articleDetail = {
      ...article,
      category: {
        id: category?.id || 0,
        name: category?.name || '未分类',
        slug: category?.slug || '',
      },
      tags: articleTags.map((t) => ({
        id: t.id,
        name: t.name,
        color: t.color,
      })),
    };

    return res.status(200).json({
      success: true,
      data: articleDetail,
    });
  }

  // PUT /api/articles/:id - 更新文章
  if (req.method === 'PUT') {
    const updateData = req.body;
    const index = articles.findIndex((a) => a.id === articleId);

    if (index === -1) {
      return res.status(200).json({
        success: false,
        errorCode: '3001',
        errorMessage: '文章不存在',
      });
    }

    const oldArticle = articles[index];
    const updatedArticle = {
      ...oldArticle,
      ...updateData,
      id: oldArticle.id,
      updateTime: new Date().toISOString(),
    };

    // 如果状态从草稿变为已发布，更新发布时间
    if (oldArticle.status === 'draft' && updateData.status === 'published') {
      updatedArticle.publishTime = new Date().toISOString();
    }

    articles[index] = updatedArticle;

    return res.status(200).json({
      success: true,
      data: updatedArticle,
      message: '文章更新成功',
    });
  }

  // DELETE /api/articles/:id - 删除文章
  if (req.method === 'DELETE') {
    const index = articles.findIndex((a) => a.id === articleId);

    if (index === -1) {
      return res.status(200).json({
        success: false,
        errorCode: '3001',
        errorMessage: '文章不存在',
      });
    }

    const article = articles[index];

    // 更新分类和标签的文章数
    if (article.status === 'published') {
      const category = categories.find((c) => c.id === article.categoryId);
      if (category) {
        category.articleCount--;
      }

      article.tags.forEach((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        if (tag) {
          tag.articleCount--;
        }
      });
    }

    articles.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: '文章删除成功',
    });
  }

  return res
    .status(405)
    .json({ success: false, errorMessage: 'Method not allowed' });
}
