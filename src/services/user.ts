/**
 * 用户设置相关 API 服务
 */

import { request } from '@umijs/max';
import type { UpdateProfileParams, CurrentUser, UploadResponse, ApiResponse, ChangePasswordParams } from '@/types';
import { API_PATHS } from '@/constants';

/**
 * 更新个人信息
 */
export async function updateProfile(data: UpdateProfileParams) {
  return request<ApiResponse<CurrentUser>>(API_PATHS.USER.PROFILE, {
    method: 'PUT',
    data,
  });
}

/**
 * 上传头像
 */
export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request<ApiResponse<UploadResponse>>(API_PATHS.USER.AVATAR, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

/**
 * 修改密码
 */
export async function changePassword(data: ChangePasswordParams) {
  return request<ApiResponse<null>>(API_PATHS.USER.CHANGE_PASSWORD, {
    method: 'POST',
    data,
  });
}

