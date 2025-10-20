/**
 * 分类相关 API 服务
 */

import { request } from '@umijs/max';
import type { Category, CategoryFormData, ApiResponse } from '@/types';
import { API_PATHS } from '@/constants';

/**
 * 获取分类列表
 */
export async function getCategoryList() {
  return request<ApiResponse<Category[]>>(API_PATHS.CATEGORY.LIST, {
    method: 'GET',
  });
}

/**
 * 创建分类
 */
export async function createCategory(data: CategoryFormData) {
  return request<ApiResponse<Category>>(API_PATHS.CATEGORY.CREATE, {
    method: 'POST',
    data,
  });
}

/**
 * 更新分类
 */
export async function updateCategory(id: number, data: CategoryFormData) {
  return request<ApiResponse<Category>>(API_PATHS.CATEGORY.UPDATE(id), {
    method: 'PUT',
    data,
  });
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number) {
  return request<ApiResponse<null>>(API_PATHS.CATEGORY.DELETE(id), {
    method: 'DELETE',
  });
}

