/**
 * 标签相关类型定义
 */

// 标签
export interface Tag {
  id: number;
  name: string;               // 标签名（最多15字符）
  color?: string;             // 颜色（HEX格式，如：#1890ff）
  articleCount: number;       // 文章数量（冗余字段）
  createTime: string;
  updateTime: string;
}

// 创建/更新标签参数
export interface TagFormData {
  name: string;
  color?: string;
}

// 标签查询参数
export interface TagQueryParams {
  keyword?: string;           // 搜索关键词
}

