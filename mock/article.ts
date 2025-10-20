/**
 * 文章相关 Mock API
 */

import type { Request, Response } from 'express';
import { articles, categories, tags } from './_data';
import type { Article, ArticleListItem } from '@/types';

// 辅助函数：根据文章生成列表项
const toListItem = (article: Article): ArticleListItem => {
  const category = categories.find((c) => c.id === article.categoryId);
  const articleTags = tags.filter((t) => article.tags.includes(t.id));
  
  const { content, categoryId, tags: tagIds, ...rest } = article;
  
  return {
    ...rest,
    category: {
      id: category?.id || 0,
      name: category?.name || '未分类',
    },
    tags: articleTags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
    })),
  };
};

export default {
  // 获取文章列表
  'GET /api/articles': (req: Request, res: Response) => {
    const {
      pageNum = 1,
      pageSize = 10,
      keyword,
      categoryId,
      tagId,
      status,
      sortField = 'updateTime',
      sortOrder = 'descend',
    } = req.query;
    
    let filteredArticles = [...articles];
    
    // 关键词搜索
    if (keyword) {
      const kw = (keyword as string).toLowerCase();
      filteredArticles = filteredArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(kw) ||
          a.content.toLowerCase().includes(kw) ||
          a.summary.toLowerCase().includes(kw)
      );
    }
    
    // 分类筛选
    if (categoryId) {
      filteredArticles = filteredArticles.filter(
        (a) => a.categoryId === parseInt(categoryId as string, 10)
      );
    }
    
    // 标签筛选
    if (tagId) {
      filteredArticles = filteredArticles.filter((a) =>
        a.tags.includes(parseInt(tagId as string, 10))
      );
    }
    
    // 状态筛选
    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter((a) => a.status === status);
    }
    
    // 排序
    filteredArticles.sort((a, b) => {
      const field = sortField as string;
      let aValue: any = a[field as keyof Article];
      let bValue: any = b[field as keyof Article];
      
      // 日期字段转换为时间戳
      if (field.includes('Time')) {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortOrder === 'ascend') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
    
    // 分页
    const page = parseInt(pageNum as string, 10);
    const size = parseInt(pageSize as string, 10);
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedArticles = filteredArticles.slice(start, end);
    
    return res.json({
      success: true,
      data: {
        list: paginatedArticles.map(toListItem),
        total: filteredArticles.length,
        pageNum: page,
        pageSize: size,
      },
    });
  },
  
  // 获取文章详情
  'GET /api/articles/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const article = articles.find((a) => a.id === parseInt(id, 10));
    
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
        slug: t.slug,
      })),
    };
    
    return res.json({
      success: true,
      data: articleDetail,
    });
  },
  
  // 创建文章
  'POST /api/articles': (req: Request, res: Response) => {
    const articleData = req.body;
    
    const newArticle: Article = {
      id: articles.length + 1,
      ...articleData,
      author: 'Administrator',
      authorId: 1,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      publishTime: articleData.status === 'published' ? new Date().toISOString() : undefined,
    };
    
    articles.push(newArticle);
    
    // 更新分类和标签的文章数
    const category = categories.find((c) => c.id === newArticle.categoryId);
    if (category && newArticle.status === 'published') {
      category.articleCount++;
    }
    
    newArticle.tags.forEach((tagId) => {
      const tag = tags.find((t) => t.id === tagId);
      if (tag && newArticle.status === 'published') {
        tag.articleCount++;
      }
    });
    
    return res.json({
      success: true,
      data: newArticle,
      message: '文章创建成功',
    });
  },
  
  // 更新文章
  'PUT /api/articles/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const index = articles.findIndex((a) => a.id === parseInt(id, 10));
    
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
    
    return res.json({
      success: true,
      data: updatedArticle,
      message: '文章更新成功',
    });
  },
  
  // 删除文章
  'DELETE /api/articles/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = articles.findIndex((a) => a.id === parseInt(id, 10));
    
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
    
    return res.json({
      success: true,
      message: '文章删除成功',
    });
  },
  
  // 批量删除文章
  'POST /api/articles/batchDelete': (req: Request, res: Response) => {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(200).json({
        success: false,
        errorCode: '1001',
        errorMessage: '参数错误',
      });
    }
    
    ids.forEach((id) => {
      const index = articles.findIndex((a) => a.id === id);
      if (index !== -1) {
        const article = articles[index];
        
        // 更新统计
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
      }
    });
    
    return res.json({
      success: true,
      message: `成功删除 ${ids.length} 篇文章`,
    });
  },
  
  // 批量更新状态
  'POST /api/articles/batchUpdateStatus': (req: Request, res: Response) => {
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
    
    return res.json({
      success: true,
      message: `成功更新 ${ids.length} 篇文章`,
    });
  },
};

