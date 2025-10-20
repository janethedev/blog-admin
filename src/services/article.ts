/**
 * 文章相关 API 服务
 */

import { request } from '@umijs/max';
import type {
  Article,
  ArticleDetail,
  ArticleListItem,
  ArticleQueryParams,
  ArticleFormData,
  BatchDeleteParams,
  BatchUpdateStatusParams,
  ApiResponse,
  ApiListResponse,
  UploadResponse,
} from '@/types';
import { API_PATHS } from '@/constants';

/**
 * 获取文章列表
 */
export async function getArticleList(params?: ArticleQueryParams) {
  return request<ApiListResponse<ArticleListItem>>(API_PATHS.ARTICLE.LIST, {
    method: 'GET',
    params,
  });
}

/**
 * 获取文章详情
 */
export async function getArticleDetail(id: number) {
  return request<ApiResponse<ArticleDetail>>(API_PATHS.ARTICLE.DETAIL(id), {
    method: 'GET',
  });
}

/**
 * 创建文章
 */
export async function createArticle(data: ArticleFormData) {
  return request<ApiResponse<Article>>(API_PATHS.ARTICLE.CREATE, {
    method: 'POST',
    data,
  });
}

/**
 * 更新文章
 */
export async function updateArticle(id: number, data: ArticleFormData) {
  return request<ApiResponse<Article>>(API_PATHS.ARTICLE.UPDATE(id), {
    method: 'PUT',
    data,
  });
}

/**
 * 删除文章
 */
export async function deleteArticle(id: number) {
  return request<ApiResponse<null>>(API_PATHS.ARTICLE.DELETE(id), {
    method: 'DELETE',
  });
}

/**
 * 批量删除文章
 */
export async function batchDeleteArticles(params: BatchDeleteParams) {
  return request<ApiResponse<null>>(API_PATHS.ARTICLE.BATCH_DELETE, {
    method: 'POST',
    data: params,
  });
}

/**
 * 批量更新文章状态
 */
export async function batchUpdateArticleStatus(params: BatchUpdateStatusParams) {
  return request<ApiResponse<null>>(API_PATHS.ARTICLE.BATCH_UPDATE_STATUS, {
    method: 'POST',
    data: params,
  });
}

/**
 * 上传图片
 */
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request<ApiResponse<UploadResponse>>(API_PATHS.UPLOAD.IMAGE, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

