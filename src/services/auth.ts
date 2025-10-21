/**
 * 认证相关 API 服务
 */

import { request } from '@umijs/max';
import type {
  LoginParams,
  LoginResult,
  CurrentUser,
  ApiResponse,
  ApiErrorResponse,
} from '@/types';
import { API_PATHS } from '@/constants';

/**
 * 用户登录
 */
export async function login(params: LoginParams) {
  return request<ApiResponse<LoginResult> | ApiErrorResponse>(API_PATHS.AUTH.LOGIN, {
    method: 'POST',
    data: params,
    skipErrorHandler: true, // 跳过全局错误处理，由页面自己处理
  });
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  return request<ApiResponse<CurrentUser>>(API_PATHS.AUTH.CURRENT_USER, {
    method: 'GET',
  });
}

/**
 * 退出登录
 */
export async function logout() {
  return request<ApiResponse<null>>(API_PATHS.AUTH.LOGOUT, {
    method: 'POST',
  });
}

