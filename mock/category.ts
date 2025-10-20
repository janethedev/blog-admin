/**
 * 分类相关 Mock API
 */

import type { Request, Response } from 'express';
import { categories, articles } from './_data';
import type { Category } from '@/types';

export default {
  // 获取分类列表
  'GET /api/categories': (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: categories,
    });
  },
  
  // 创建分类
  'POST /api/categories': (req: Request, res: Response) => {
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
    
    return res.json({
      success: true,
      data: newCategory,
      message: '分类创建成功',
    });
  },
  
  // 更新分类
  'PUT /api/categories/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const index = categories.findIndex((c) => c.id === parseInt(id, 10));
    
    if (index === -1) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '分类不存在',
      });
    }
    
    // 检查名称是否与其他分类重复
    const exists = categories.find(
      (c) => c.name === updateData.name && c.id !== parseInt(id, 10)
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
    
    return res.json({
      success: true,
      data: updatedCategory,
      message: '分类更新成功',
    });
  },
  
  // 删除分类
  'DELETE /api/categories/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = categories.findIndex((c) => c.id === parseInt(id, 10));
    
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
    
    return res.json({
      success: true,
      message: '分类删除成功',
    });
  },
};

