/**
 * 应用运行时配置
 */

import { AppstoreOutlined } from '@ant-design/icons';
import {
  history,
  type RequestConfig,
  type RunTimeLayoutConfig,
} from '@umijs/max';
import { message } from 'antd';
import { AvatarDropdown } from '@/components';
import { TOKEN_KEY } from '@/constants';
import { getCurrentUser } from '@/services';
import type { CurrentUser } from '@/types';

// 全局初始状态
export async function getInitialState(): Promise<{
  currentUser?: CurrentUser;
  fetchUserInfo?: () => Promise<CurrentUser | undefined>;
}> {
  // 获取用户信息的函数
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return undefined;
      }

      const result = await getCurrentUser();
      if (result.success) {
        return result.data;
      }
    } catch (error) {
      console.error('获取用户信息失败：', error);
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (window.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      currentUser,
      fetchUserInfo,
    };
  }

  return {
    fetchUserInfo,
  };
}

// ProLayout 配置
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    // 自定义 logo（和登录页面一致）
    logo: () => <AppstoreOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    // 右上角用户信息
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: initialState?.currentUser?.nickname,
      render: (_, avatarChildren) => {
        // 使用 AvatarDropdown 组件包裹头像，提供下拉菜单功能
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>;
      },
    },
    // 水印
    waterMarkProps: {
      content: initialState?.currentUser?.nickname,
    },
    // 页脚
    footerRender: () => {
      return (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          博客管理系统 © {new Date().getFullYear()} Created by{' '}
          {initialState?.currentUser?.nickname || 'Admin'}
        </div>
      );
    },
    // 右上角菜单
    actionsRender: () => {
      return [];
    },
    // 无权限时的处理
    unAccessible: <div>无权限访问</div>,
    // 页面切换时的钩子 - 处理未登录跳转
    onPageChange: () => {
      const { location } = history;
      const { currentUser } = initialState || {};

      // 白名单：不需要登录就能访问的页面
      const whiteList = ['/user/login'];

      // 如果是白名单页面，直接返回
      if (whiteList.includes(location.pathname)) {
        return;
      }

      // 如果未登录，跳转到登录页
      if (!currentUser) {
        history.push({
          pathname: '/user/login',
          search: `?redirect=${encodeURIComponent(location.pathname + location.search)}`,
        });
      }
    },
  };
};

// 请求配置
export const request: RequestConfig = {
  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 添加 token
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // umi-request 的响应拦截器接收的是解析后的数据
      // 处理错误响应
      if (response && response.success === false) {
        // token 过期或未登录
        if (response.errorCode === '2001' || response.errorCode === '2002') {
          message.error('登录已过期，请重新登录');
          localStorage.removeItem(TOKEN_KEY);
          // 跳转到登录页
          if (window.location.pathname !== '/user/login') {
            window.location.href = `/user/login?redirect=${encodeURIComponent(
              window.location.pathname + window.location.search,
            )}`;
          }
        }
      }

      return response;
    },
  ],
  // 错误处理
  errorConfig: {
    errorHandler: (error: any) => {
      if (error.response) {
        // 请求已发出，但服务器响应状态码不在 2xx 范围
        message.error(`请求错误：${error.response.status}`);
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        message.error('网络错误，请检查网络连接');
      } else {
        // 发送请求时出了点问题
        message.error('请求失败，请稍后重试');
      }
      throw error;
    },
  },
};
