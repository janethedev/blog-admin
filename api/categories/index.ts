import type { VercelRequest, VercelResponse } from '@vercel/node';
import { categories } from '../../mock/_data';
import type { Category } from '../../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // GET /api/categories - 获取分类列表
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: categories,
    });
  }

  // POST /api/categories - 创建分类
  if (req.method === 'POST') {
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

  return res
    .status(405)
    .json({ success: false, errorMessage: 'Method not allowed' });
}
