/**
 * 用户相关类型定义
 */

// 用户角色
export type UserRole = 'admin' | 'editor';

// 用户状态
export type UserStatus = 'active' | 'disabled';

// 用户信息
export interface User {
  id: number;
  username: string;              // 用户名（登录用）
  password: string;              // 密码（加密存储）
  nickname: string;              // 昵称（显示用）
  avatar?: string;               // 头像URL
  email: string;                 // 邮箱
  role: UserRole;                // 角色
  bio?: string;                  // 个人简介
  status: UserStatus;            // 状态
  lastLoginTime?: string;        // 最后登录时间
  createTime: string;
  updateTime: string;
}

// 当前用户信息（不包含密码）
export interface CurrentUser extends Omit<User, 'password'> {}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应数据
export interface LoginResult {
  token: string;
  user: CurrentUser;
}

// 修改密码参数
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 更新个人信息参数
export interface UpdateProfileParams {
  nickname?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

