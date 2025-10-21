import type { VercelRequest, VercelResponse } from '@vercel/node';
import { articles, tags } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const tagId = parseInt(id as string, 10);

  // PUT /api/tags/:id - 更新标签
  if (req.method === 'PUT') {
    const updateData = req.body;
    const index = tags.findIndex((t) => t.id === tagId);

    if (index === -1) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '标签不存在',
      });
    }

    // 检查名称是否与其他标签重复
    const exists = tags.find(
      (t) => t.name === updateData.name && t.id !== tagId,
    );
    if (exists) {
      return res.status(200).json({
        success: false,
        errorCode: '3005',
        errorMessage: '标签名称已存在',
      });
    }

    const updatedTag = {
      ...tags[index],
      ...updateData,
      id: tags[index].id,
      articleCount: tags[index].articleCount,
      updateTime: new Date().toISOString(),
    };

    tags[index] = updatedTag;

    return res.status(200).json({
      success: true,
      data: updatedTag,
      message: '标签更新成功',
    });
  }

  // DELETE /api/tags/:id - 删除标签
  if (req.method === 'DELETE') {
    const index = tags.findIndex((t) => t.id === tagId);

    if (index === -1) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '标签不存在',
      });
    }

    const tag = tags[index];

    // 检查是否有文章关联
    const hasArticles = articles.some((a) => a.tags.includes(tag.id));
    if (hasArticles) {
      return res.status(200).json({
        success: false,
        errorCode: '3003',
        errorMessage: `该标签下还有 ${tag.articleCount} 篇文章，无法删除`,
      });
    }

    tags.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: '标签删除成功',
    });
  }

  return res
    .status(405)
    .json({ success: false, errorMessage: 'Method not allowed' });
}
