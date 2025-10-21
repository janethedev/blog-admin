import type { VercelRequest, VercelResponse } from '@vercel/node';
import { articles, categories } from '../../mock/_data';
import type { Category } from '../../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 从 URL 中提取路径，例如 /api/categories/1 -> '1'
  const url = req.url || '';
  const pathMatch = url.match(/\/api\/categories\/([^?]+)/);
  const endpoint = pathMatch ? pathMatch[1] : '';

  // 处理带 ID 的路由：PUT/DELETE /api/categories/:id
  if (endpoint && !isNaN(Number(endpoint))) {
    const categoryId = parseInt(endpoint, 10);

    // PUT /api/categories/:id - 更新分类
    if (req.method === 'PUT') {
      const updateData = req.body;
      const index = categories.findIndex((c) => c.id === categoryId);

      if (index === -1) {
        return res.status(200).json({
          success: false,
          errorCode: '1004',
          errorMessage: '分类不存在',
        });
      }

      // 检查名称是否与其他分类重复
      const exists = categories.find(
        (c) => c.name === updateData.name && c.id !== categoryId,
      );
      if (exists) {
        return res.status(200).json({
          success: false,
          errorCode: '3004',
          errorMessage: '分类名称已存在',
        });
      }

      const updatedCategory = {
        ...categories[index],
        ...updateData,
        id: categories[index].id,
        articleCount: categories[index].articleCount,
        updateTime: new Date().toISOString(),
      };

      categories[index] = updatedCategory;

      return res.status(200).json({
        success: true,
        data: updatedCategory,
        message: '分类更新成功',
      });
    }

    // DELETE /api/categories/:id - 删除分类
    if (req.method === 'DELETE') {
      const index = categories.findIndex((c) => c.id === categoryId);

      if (index === -1) {
        return res.status(200).json({
          success: false,
          errorCode: '1004',
          errorMessage: '分类不存在',
        });
      }

      const category = categories[index];

      // 检查是否有文章关联
      const hasArticles = articles.some((a) => a.categoryId === category.id);
      if (hasArticles) {
        return res.status(200).json({
          success: false,
          errorCode: '3002',
          errorMessage: `该分类下还有 ${category.articleCount} 篇文章，无法删除`,
        });
      }

      categories.splice(index, 1);

      return res.status(200).json({
        success: true,
        message: '分类删除成功',
      });
    }
  }

  // GET /api/categories - 获取分类列表
  if (!endpoint && req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: categories,
    });
  }

  // POST /api/categories - 创建分类
  if (!endpoint && req.method === 'POST') {
    const categoryData = req.body;

    // 检查名称是否重复
    const exists = categories.find((c) => c.name === categoryData.name);
    if (exists) {
      return res.status(200).json({
        success: false,
        errorCode: '3004',
        errorMessage: '分类名称已存在',
      });
    }

    const newCategory: Category = {
      id: categories.length + 1,
      ...categoryData,
      articleCount: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    categories.push(newCategory);

    return res.status(200).json({
      success: true,
      data: newCategory,
      message: '分类创建成功',
    });
  }

  return res.status(404).json({
    success: false,
    errorMessage: 'Endpoint not found',
  });
}
