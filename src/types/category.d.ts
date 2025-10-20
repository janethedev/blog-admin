/**
 * 分类相关类型定义
 */

// 分类
export interface Category {
  id: number;
  name: string;                  // 分类名称（最多20字符）
  slug: string;                  // URL别名（如：frontend）
  description?: string;          // 描述（最多100字符）
  icon?: string;                 // 图标
  sort: number;                  // 排序（数字越小越靠前）
  articleCount: number;          // 文章数量（冗余字段）
  createTime: string;
  updateTime: string;
}

// 创建/更新分类参数
export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort?: number;
}

