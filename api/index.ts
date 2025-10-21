import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  articles,
  categories,
  generateVisitTrend,
  getCategoryDistribution,
  getRecentArticles,
  getStatistics,
  tags,
  users,
} from '../mock/_data';
import type { Article, ArticleListItem, Category, Tag } from '../src/types';

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const method = req.method || 'GET';

  // ==================== Auth Routes ====================
  // POST /api/auth/login
  if (url.includes('/api/auth/login') && method === 'POST') {
    const { username, password } = (req.body || {}) as {
      username?: string;
      password?: string;
    };
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res
        .status(200)
        .json({
          success: false,
          errorCode: '2003',
          errorMessage: '用户名或密码错误',
        });
    }
    const validPasswords: Record<string, string> = { admin: 'janethedev' };
    if (
      user.password !== password &&
      password !== validPasswords[username || '']
    ) {
      return res
        .status(200)
        .json({
          success: false,
          errorCode: '2003',
          errorMessage: '用户名或密码错误',
        });
    }
    const { password: _omit, ...userInfo } = user as any;
    user.lastLoginTime = new Date().toISOString();
    return res
      .status(200)
      .json({
        success: true,
        data: { token: `mock-token-${user.id}-${Date.now()}`, user: userInfo },
      });
  }

  // GET /api/auth/currentUser
  if (url.includes('/api/auth/currentUser') && method === 'GET') {
    const authHeader = (req.headers['authorization'] ||
      req.headers['Authorization']) as string | undefined;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return res
        .status(200)
        .json({
          success: false,
          errorCode: '2001',
          errorMessage: '未登录或登录已过期',
        });
    }
    const user = users[0];
    const { password: _omit, ...userInfo } = user as any;
    return res.status(200).json({ success: true, data: userInfo });
  }

  // POST /api/auth/logout
  if (url.includes('/api/auth/logout') && method === 'POST') {
    return res
      .status(200)
      .json({ success: true, data: null, message: '退出登录成功' });
  }

  // ==================== Dashboard Routes ====================
  if (url.includes('/api/dashboard/statistics') && method === 'GET') {
    return res.status(200).json({ success: true, data: getStatistics() });
  }
  if (url.includes('/api/dashboard/visitTrend') && method === 'GET') {
    const days = parseInt((req.query.days as string) || '7', 10);
    return res
      .status(200)
      .json({ success: true, data: generateVisitTrend(days) });
  }
  if (url.includes('/api/dashboard/categoryDistribution') && method === 'GET') {
    return res
      .status(200)
      .json({ success: true, data: getCategoryDistribution() });
  }
  if (url.includes('/api/dashboard/recentArticles') && method === 'GET') {
    const limit = parseInt((req.query.limit as string) || '5', 10);
    return res
      .status(200)
      .json({ success: true, data: getRecentArticles(limit) });
  }

  // ==================== Articles Routes ====================
  const articlesMatch = url.match(/\/api\/articles(?:\/([^?]+))?/);
  if (articlesMatch) {
    const endpoint = articlesMatch[1] || '';

    // POST /api/articles/batchDelete
    if (endpoint === 'batchDelete' && method === 'POST') {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res
          .status(200)
          .json({
            success: false,
            errorCode: '1001',
            errorMessage: '参数错误',
          });
      }
      ids.forEach((id) => {
        const index = articles.findIndex((a) => a.id === id);
        if (index !== -1) {
          const article = articles[index];
          if (article.status === 'published') {
            const category = categories.find(
              (c) => c.id === article.categoryId,
            );
            if (category) category.articleCount--;
            article.tags.forEach((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (tag) tag.articleCount--;
            });
          }
          articles.splice(index, 1);
        }
      });
      return res
        .status(200)
        .json({ success: true, message: `成功删除 ${ids.length} 篇文章` });
    }

    // POST /api/articles/batchUpdateStatus
    if (endpoint === 'batchUpdateStatus' && method === 'POST') {
      const { ids, status } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res
          .status(200)
          .json({
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
          if (oldStatus === 'draft' && status === 'published') {
            article.publishTime = new Date().toISOString();
            const category = categories.find(
              (c) => c.id === article.categoryId,
            );
            if (category) category.articleCount++;
            article.tags.forEach((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (tag) tag.articleCount++;
            });
          } else if (oldStatus === 'published' && status === 'draft') {
            const category = categories.find(
              (c) => c.id === article.categoryId,
            );
            if (category) category.articleCount--;
            article.tags.forEach((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (tag) tag.articleCount--;
            });
          }
        }
      });
      return res
        .status(200)
        .json({ success: true, message: `成功更新 ${ids.length} 篇文章` });
    }

    // Handle article by ID
    if (endpoint && !isNaN(Number(endpoint))) {
      const articleId = parseInt(endpoint, 10);
      // GET /api/articles/:id
      if (method === 'GET') {
        const article = articles.find((a) => a.id === articleId);
        if (!article) {
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '3001',
              errorMessage: '文章不存在',
            });
        }
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
        return res.status(200).json({ success: true, data: articleDetail });
      }
      // PUT /api/articles/:id
      if (method === 'PUT') {
        const updateData = req.body;
        const index = articles.findIndex((a) => a.id === articleId);
        if (index === -1) {
          return res
            .status(200)
            .json({
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
        if (
          oldArticle.status === 'draft' &&
          updateData.status === 'published'
        ) {
          updatedArticle.publishTime = new Date().toISOString();
        }
        articles[index] = updatedArticle;
        return res
          .status(200)
          .json({
            success: true,
            data: updatedArticle,
            message: '文章更新成功',
          });
      }
      // DELETE /api/articles/:id
      if (method === 'DELETE') {
        const index = articles.findIndex((a) => a.id === articleId);
        if (index === -1) {
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '3001',
              errorMessage: '文章不存在',
            });
        }
        const article = articles[index];
        if (article.status === 'published') {
          const category = categories.find((c) => c.id === article.categoryId);
          if (category) category.articleCount--;
          article.tags.forEach((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            if (tag) tag.articleCount--;
          });
        }
        articles.splice(index, 1);
        return res.status(200).json({ success: true, message: '文章删除成功' });
      }
    }

    // GET /api/articles - list
    if (!endpoint && method === 'GET') {
      const {
        pageNum = '1',
        pageSize = '10',
        keyword,
        categoryId,
        tagId,
        status,
        sortField = 'updateTime',
        sortOrder = 'descend',
      } = req.query;
      let filteredArticles = [...articles];
      if (keyword) {
        const kw = (keyword as string).toLowerCase();
        filteredArticles = filteredArticles.filter(
          (a) =>
            a.title.toLowerCase().includes(kw) ||
            a.content.toLowerCase().includes(kw) ||
            a.summary.toLowerCase().includes(kw),
        );
      }
      if (categoryId)
        filteredArticles = filteredArticles.filter(
          (a) => a.categoryId === parseInt(categoryId as string, 10),
        );
      if (tagId)
        filteredArticles = filteredArticles.filter((a) =>
          a.tags.includes(parseInt(tagId as string, 10)),
        );
      if (status && status !== 'all')
        filteredArticles = filteredArticles.filter((a) => a.status === status);
      filteredArticles.sort((a, b) => {
        if (a.isTop && !b.isTop) return -1;
        if (!a.isTop && b.isTop) return 1;
        const field = sortField as string;
        let aValue: any = a[field as keyof Article];
        let bValue: any = b[field as keyof Article];
        if (field.includes('Time')) {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        if (sortOrder === 'ascend') return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
      });
      const page = parseInt(pageNum as string, 10);
      const size = parseInt(pageSize as string, 10);
      const paginatedArticles = filteredArticles.slice(
        (page - 1) * size,
        page * size,
      );
      return res
        .status(200)
        .json({
          success: true,
          data: {
            list: paginatedArticles.map(toListItem),
            total: filteredArticles.length,
            pageNum: page,
            pageSize: size,
          },
        });
    }

    // POST /api/articles - create
    if (!endpoint && method === 'POST') {
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
        publishTime:
          articleData.status === 'published'
            ? new Date().toISOString()
            : undefined,
      };
      articles.push(newArticle);
      const category = categories.find((c) => c.id === newArticle.categoryId);
      if (category && newArticle.status === 'published')
        category.articleCount++;
      newArticle.tags.forEach((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        if (tag && newArticle.status === 'published') tag.articleCount++;
      });
      return res
        .status(200)
        .json({ success: true, data: newArticle, message: '文章创建成功' });
    }
  }

  // ==================== Categories Routes ====================
  const categoriesMatch = url.match(/\/api\/categories(?:\/([^?]+))?/);
  if (categoriesMatch) {
    const endpoint = categoriesMatch[1] || '';
    if (endpoint && !isNaN(Number(endpoint))) {
      const categoryId = parseInt(endpoint, 10);
      // PUT /api/categories/:id
      if (method === 'PUT') {
        const updateData = req.body;
        const index = categories.findIndex((c) => c.id === categoryId);
        if (index === -1)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '1004',
              errorMessage: '分类不存在',
            });
        const exists = categories.find(
          (c) => c.name === updateData.name && c.id !== categoryId,
        );
        if (exists)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '3004',
              errorMessage: '分类名称已存在',
            });
        const updatedCategory = {
          ...categories[index],
          ...updateData,
          id: categories[index].id,
          articleCount: categories[index].articleCount,
          updateTime: new Date().toISOString(),
        };
        categories[index] = updatedCategory;
        return res
          .status(200)
          .json({
            success: true,
            data: updatedCategory,
            message: '分类更新成功',
          });
      }
      // DELETE /api/categories/:id
      if (method === 'DELETE') {
        const index = categories.findIndex((c) => c.id === categoryId);
        if (index === -1)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '1004',
              errorMessage: '分类不存在',
            });
        const category = categories[index];
        const hasArticles = articles.some((a) => a.categoryId === category.id);
        if (hasArticles)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '3002',
              errorMessage: `该分类下还有 ${category.articleCount} 篇文章，无法删除`,
            });
        categories.splice(index, 1);
        return res.status(200).json({ success: true, message: '分类删除成功' });
      }
    }
    // GET /api/categories
    if (!endpoint && method === 'GET') {
      return res.status(200).json({ success: true, data: categories });
    }
    // POST /api/categories
    if (!endpoint && method === 'POST') {
      const categoryData = req.body;
      const exists = categories.find((c) => c.name === categoryData.name);
      if (exists)
        return res
          .status(200)
          .json({
            success: false,
            errorCode: '3004',
            errorMessage: '分类名称已存在',
          });
      const newCategory: Category = {
        id: categories.length + 1,
        ...categoryData,
        articleCount: 0,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };
      categories.push(newCategory);
      return res
        .status(200)
        .json({ success: true, data: newCategory, message: '分类创建成功' });
    }
  }

  // ==================== Tags Routes ====================
  const tagsMatch = url.match(/\/api\/tags(?:\/([^?]+))?/);
  if (tagsMatch) {
    const endpoint = tagsMatch[1] || '';
    if (endpoint && !isNaN(Number(endpoint))) {
      const tagId = parseInt(endpoint, 10);
      // PUT /api/tags/:id
      if (method === 'PUT') {
        const updateData = req.body;
        const index = tags.findIndex((t) => t.id === tagId);
        if (index === -1)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '1004',
              errorMessage: '标签不存在',
            });
        const exists = tags.find(
          (t) => t.name === updateData.name && t.id !== tagId,
        );
        if (exists)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '3005',
              errorMessage: '标签名称已存在',
            });
        const updatedTag = {
          ...tags[index],
          ...updateData,
          id: tags[index].id,
          articleCount: tags[index].articleCount,
          updateTime: new Date().toISOString(),
        };
        tags[index] = updatedTag;
        return res
          .status(200)
          .json({ success: true, data: updatedTag, message: '标签更新成功' });
      }
      // DELETE /api/tags/:id
      if (method === 'DELETE') {
        const index = tags.findIndex((t) => t.id === tagId);
        if (index === -1)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '1004',
              errorMessage: '标签不存在',
            });
        const tag = tags[index];
        const hasArticles = articles.some((a) => a.tags.includes(tag.id));
        if (hasArticles)
          return res
            .status(200)
            .json({
              success: false,
              errorCode: '3003',
              errorMessage: `该标签下还有 ${tag.articleCount} 篇文章，无法删除`,
            });
        tags.splice(index, 1);
        return res.status(200).json({ success: true, message: '标签删除成功' });
      }
    }
    // GET /api/tags
    if (!endpoint && method === 'GET') {
      const { keyword } = req.query;
      let filteredTags = [...tags];
      if (keyword) {
        const kw = (keyword as string).toLowerCase();
        filteredTags = filteredTags.filter((t) =>
          t.name.toLowerCase().includes(kw),
        );
      }
      return res.status(200).json({ success: true, data: filteredTags });
    }
    // POST /api/tags
    if (!endpoint && method === 'POST') {
      const tagData = req.body;
      const exists = tags.find((t) => t.name === tagData.name);
      if (exists)
        return res
          .status(200)
          .json({
            success: false,
            errorCode: '3005',
            errorMessage: '标签名称已存在',
          });
      const newTag: Tag = {
        id: tags.length + 1,
        ...tagData,
        articleCount: 0,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };
      tags.push(newTag);
      return res
        .status(200)
        .json({ success: true, data: newTag, message: '标签创建成功' });
    }
  }

  return res
    .status(404)
    .json({ success: false, errorMessage: 'Endpoint not found' });
}
