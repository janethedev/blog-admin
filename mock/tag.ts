/**
 * 标签相关 Mock API
 */

import type { Request, Response } from 'express';
import { tags, articles } from './_data';
import type { Tag } from '@/types';

export default {
  // 获取标签列表
  'GET /api/tags': (req: Request, res: Response) => {
    const { keyword } = req.query;
    
    let filteredTags = [...tags];
    
    // 关键词搜索
    if (keyword) {
      const kw = (keyword as string).toLowerCase();
      filteredTags = filteredTags.filter((t) =>
        t.name.toLowerCase().includes(kw)
      );
    }
    
    return res.json({
      success: true,
      data: filteredTags,
    });
  },
  
  // 创建标签
  'POST /api/tags': (req: Request, res: Response) => {
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
    
    return res.json({
      success: true,
      data: newTag,
      message: '标签创建成功',
    });
  },
  
  // 更新标签
  'PUT /api/tags/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const index = tags.findIndex((t) => t.id === parseInt(id, 10));
    
    if (index === -1) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '标签不存在',
      });
    }
    
    // 检查名称是否与其他标签重复
    const exists = tags.find(
      (t) => t.name === updateData.name && t.id !== parseInt(id, 10)
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
    
    return res.json({
      success: true,
      data: updatedTag,
      message: '标签更新成功',
    });
  },
  
  // 删除标签
  'DELETE /api/tags/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = tags.findIndex((t) => t.id === parseInt(id, 10));
    
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
    
    return res.json({
      success: true,
      message: '标签删除成功',
    });
  },
};

