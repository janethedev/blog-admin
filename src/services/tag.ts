/**
 * 标签相关 API 服务
 */

import { request } from '@umijs/max';
import type { Tag, TagFormData, TagQueryParams, ApiResponse } from '@/types';
import { API_PATHS } from '@/constants';

/**
 * 获取标签列表
 */
export async function getTagList(params?: TagQueryParams) {
  return request<ApiResponse<Tag[]>>(API_PATHS.TAG.LIST, {
    method: 'GET',
    params,
  });
}

/**
 * 创建标签
 */
export async function createTag(data: TagFormData) {
  return request<ApiResponse<Tag>>(API_PATHS.TAG.CREATE, {
    method: 'POST',
    data,
  });
}

/**
 * 更新标签
 */
export async function updateTag(id: number, data: TagFormData) {
  return request<ApiResponse<Tag>>(API_PATHS.TAG.UPDATE(id), {
    method: 'PUT',
    data,
  });
}

/**
 * 删除标签
 */
export async function deleteTag(id: number) {
  return request<ApiResponse<Tag>>(API_PATHS.TAG.DELETE(id), {
    method: 'DELETE',
  });
}

