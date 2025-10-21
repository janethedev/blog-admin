import type { VercelRequest, VercelResponse } from '@vercel/node';
import { articles, categories, tags } from '../../mock/_data';
import type { Article, ArticleListItem } from '../../src/types';

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
  // GET /api/articles - 获取文章列表
  if (req.method === 'GET') {
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

    // 关键词搜索
    if (keyword) {
      const kw = (keyword as string).toLowerCase();
      filteredArticles = filteredArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(kw) ||
          a.content.toLowerCase().includes(kw) ||
          a.summary.toLowerCase().includes(kw),
      );
    }

    // 分类筛选
    if (categoryId) {
      filteredArticles = filteredArticles.filter(
        (a) => a.categoryId === parseInt(categoryId as string, 10),
      );
    }

    // 标签筛选
    if (tagId) {
      filteredArticles = filteredArticles.filter((a) =>
        a.tags.includes(parseInt(tagId as string, 10)),
      );
    }

    // 状态筛选
    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter((a) => a.status === status);
    }

    // 排序：置顶文章始终在最前面
    filteredArticles.sort((a, b) => {
      // 优先按置顶状态排序
      if (a.isTop && !b.isTop) return -1;
      if (!a.isTop && b.isTop) return 1;

      // 置顶状态相同时，按指定字段排序
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

    return res.status(200).json({
      success: true,
      data: {
        list: paginatedArticles.map(toListItem),
        total: filteredArticles.length,
        pageNum: page,
        pageSize: size,
      },
    });
  }

  // POST /api/articles - 创建文章
  if (req.method === 'POST') {
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

    return res.status(200).json({
      success: true,
      data: newArticle,
      message: '文章创建成功',
    });
  }

  return res
    .status(405)
    .json({ success: false, errorMessage: 'Method not allowed' });
}
