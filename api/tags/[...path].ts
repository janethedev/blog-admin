import type { VercelRequest, VercelResponse } from '@vercel/node';
import { articles, tags } from '../../mock/_data';
import type { Tag } from '../../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const pathArray = (req.query.path as string[]) || [];
  const endpoint = pathArray[0];

  // 处理带 ID 的路由：PUT/DELETE /api/tags/:id
  if (endpoint && !isNaN(Number(endpoint))) {
    const tagId = parseInt(endpoint, 10);

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
  }

  // GET /api/tags - 获取标签列表
  if (!endpoint && req.method === 'GET') {
    const { keyword } = req.query;

    let filteredTags = [...tags];

    // 关键词搜索
    if (keyword) {
      const kw = (keyword as string).toLowerCase();
      filteredTags = filteredTags.filter((t) =>
        t.name.toLowerCase().includes(kw),
      );
    }

    return res.status(200).json({
      success: true,
      data: filteredTags,
    });
  }

  // POST /api/tags - 创建标签
  if (!endpoint && req.method === 'POST') {
    const tagData = req.body;

    // 检查名称是否重复
    const exists = tags.find((t) => t.name === tagData.name);
    if (exists) {
      return res.status(200).json({
        success: false,
        errorCode: '3005',
        errorMessage: '标签名称已存在',
      });
    }

    const newTag: Tag = {
      id: tags.length + 1,
      ...tagData,
      articleCount: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    tags.push(newTag);

    return res.status(200).json({
      success: true,
      data: newTag,
      message: '标签创建成功',
    });
  }

  return res.status(404).json({
    success: false,
    errorMessage: 'Endpoint not found',
  });
}
