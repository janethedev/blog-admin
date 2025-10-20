/**
 * 常量定义
 */

// API 基础路径
export const API_BASE_URL = '/api';

// API 路径
export const API_PATHS = {
  // 认证相关
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    CURRENT_USER: `${API_BASE_URL}/auth/currentUser`,
  },
  
  // 仪表盘相关
  DASHBOARD: {
    STATISTICS: `${API_BASE_URL}/dashboard/statistics`,
    VISIT_TREND: `${API_BASE_URL}/dashboard/visitTrend`,
    CATEGORY_DISTRIBUTION: `${API_BASE_URL}/dashboard/categoryDistribution`,
    RECENT_ARTICLES: `${API_BASE_URL}/dashboard/recentArticles`,
  },
  
  // 文章相关
  ARTICLE: {
    LIST: `${API_BASE_URL}/articles`,
    DETAIL: (id: number) => `${API_BASE_URL}/articles/${id}`,
    CREATE: `${API_BASE_URL}/articles`,
    UPDATE: (id: number) => `${API_BASE_URL}/articles/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/articles/${id}`,
    BATCH_DELETE: `${API_BASE_URL}/articles/batchDelete`,
    BATCH_UPDATE_STATUS: `${API_BASE_URL}/articles/batchUpdateStatus`,
  },
  
  // 分类相关
  CATEGORY: {
    LIST: `${API_BASE_URL}/categories`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id: number) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/categories/${id}`,
  },
  
  // 标签相关
  TAG: {
    LIST: `${API_BASE_URL}/tags`,
    CREATE: `${API_BASE_URL}/tags`,
    UPDATE: (id: number) => `${API_BASE_URL}/tags/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/tags/${id}`,
  },
  
  // 用户相关
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    AVATAR: `${API_BASE_URL}/user/avatar`,
    CHANGE_PASSWORD: `${API_BASE_URL}/user/changePassword`,
  },
  
  // 上传相关
  UPLOAD: {
    IMAGE: `${API_BASE_URL}/upload/image`,
  },
} as const;

// 默认分页配置
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUM = 1;

// 文章状态映射
export const ARTICLE_STATUS_MAP = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'success' },
} as const;

// 用户角色映射
export const USER_ROLE_MAP = {
  admin: { text: '管理员', color: 'red' },
  editor: { text: '编辑', color: 'blue' },
} as const;

// 用户状态映射
export const USER_STATUS_MAP = {
  active: { text: '正常', color: 'success' },
  disabled: { text: '禁用', color: 'error' },
} as const;

// 默认头像
export const DEFAULT_AVATAR = 'https://avatars.githubusercontent.com/u/1';

// Token 存储键
export const TOKEN_KEY = 'blog-admin-token';

// 用户信息存储键
export const USER_INFO_KEY = 'blog-admin-user';

// 图片上传限制
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPT_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ACCEPT_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// 文章编辑器配置
export const EDITOR_CONFIG = {
  AUTO_SAVE_INTERVAL: 30000, // 30秒自动保存
  DEBOUNCE_DELAY: 3000,      // 3秒防抖
  MAX_TITLE_LENGTH: 100,     // 标题最大长度
  MAX_SUMMARY_LENGTH: 200,   // 摘要最大长度
} as const;

