/**
 * 通用类型定义
 */

// API 统一响应格式 - 成功
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// API 统一响应格式 - 失败
export interface ApiErrorResponse {
  success: false;
  errorCode: string;
  errorMessage: string;
  data?: any;
}

// API 列表响应格式
export interface ApiListResponse<T = any> {
  success: true;
  data: {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
}

// 分页参数
export interface PaginationParams {
  pageNum?: number;              // 页码（从1开始）
  pageSize?: number;             // 每页数量（默认10）
}

// 文件上传响应
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

// 错误码枚举
export enum ErrorCode {
  // 通用错误 (1xxx)
  UNKNOWN_ERROR = '1000',
  VALIDATION_ERROR = '1001',
  RESOURCE_NOT_FOUND = '1004',
  
  // 认证错误 (2xxx)
  UNAUTHORIZED = '2001',
  TOKEN_EXPIRED = '2002',
  INVALID_CREDENTIALS = '2003',
  PERMISSION_DENIED = '2004',
  
  // 业务错误 (3xxx)
  ARTICLE_NOT_FOUND = '3001',
  CATEGORY_HAS_ARTICLES = '3002',
  TAG_HAS_ARTICLES = '3003',
  DUPLICATE_CATEGORY_NAME = '3004',
  DUPLICATE_TAG_NAME = '3005',
  
  // 文件上传错误 (4xxx)
  FILE_TOO_LARGE = '4001',
  INVALID_FILE_TYPE = '4002',
  UPLOAD_FAILED = '4003'
}

