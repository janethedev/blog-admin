/**
 * 文章相关类型定义
 */

import type { Category } from './category';
import type { Tag } from './tag';

// 文章状态
export type ArticleStatus = 'draft' | 'published';

// 文章
export interface Article {
  id: number;
  title: string;                    // 标题（最多100字符）
  content: string;                  // Markdown 内容
  summary: string;                  // 摘要（最多200字符）
  coverImage?: string;              // 封面图 URL
  categoryId: number;               // 分类ID
  tags: number[];                   // 标签ID数组
  author: string;                   // 作者
  authorId: number;                 // 作者ID
  status: ArticleStatus;            // 状态：草稿/已发布
  viewCount: number;                // 浏览量
  likeCount: number;                // 点赞数
  commentCount: number;             // 评论数
  isTop: boolean;                   // 是否置顶
  allowComment: boolean;            // 是否允许评论
  createTime: string;               // 创建时间
  updateTime: string;               // 更新时间
  publishTime?: string;             // 发布时间
}

// 文章列表项（包含关联的分类和标签信息）
export interface ArticleListItem extends Omit<Article, 'content' | 'categoryId' | 'tags'> {
  category: {
    id: number;
    name: string;
  };
  tags: Array<{
    id: number;
    name: string;
    color?: string;
  }>;
}

// 文章详情（包含完整内容和关联信息）
export interface ArticleDetail extends Omit<Article, 'categoryId' | 'tags'> {
  category: {
    id: number;
    name: string;
    slug?: string;
  };
  tags: Array<{
    id: number;
    name: string;
    color?: string;
    slug?: string;
  }>;
}

// 文章查询参数
export interface ArticleQueryParams {
  pageNum?: number;                 // 页码（默认1）
  pageSize?: number;                // 每页数量（默认10）
  keyword?: string;                 // 搜索关键词（标题、内容）
  categoryId?: number;              // 分类筛选
  tagId?: number;                   // 标签筛选
  status?: ArticleStatus | 'all';   // 状态筛选（默认all）
  sortField?: 'createTime' | 'viewCount' | 'updateTime'; // 排序字段
  sortOrder?: 'ascend' | 'descend'; // 排序方式（默认descend）
}

// 创建/更新文章参数
export interface ArticleFormData {
  title: string;
  content: string;
  summary: string;
  coverImage?: string;
  categoryId: number;
  tags: number[];
  status: ArticleStatus;
  isTop: boolean;
  allowComment: boolean;
}

// 批量删除参数
export interface BatchDeleteParams {
  ids: number[];
}

// 批量更新状态参数
export interface BatchUpdateStatusParams {
  ids: number[];
  status: ArticleStatus;
}

