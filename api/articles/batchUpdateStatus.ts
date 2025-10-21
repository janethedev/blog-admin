import type { VercelRequest, VercelResponse } from '@vercel/node';
import { articles, categories, tags } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(200).json({
      success: false,
      errorCode: '1001',
      errorMessage: '参数错误',
    });
  }

  ids.forEach((id) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      const oldStatus = article.status;
      article.status = status;
      article.updateTime = new Date().toISOString();

      // 更新统计
      if (oldStatus === 'draft' && status === 'published') {
        article.publishTime = new Date().toISOString();

        const category = categories.find((c) => c.id === article.categoryId);
        if (category) {
          category.articleCount++;
        }

        article.tags.forEach((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (tag) {
            tag.articleCount++;
          }
        });
      } else if (oldStatus === 'published' && status === 'draft') {
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
    }
  });

  return res.status(200).json({
    success: true,
    message: `成功更新 ${ids.length} 篇文章`,
  });
}
