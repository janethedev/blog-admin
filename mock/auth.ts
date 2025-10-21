/**
 * 认证相关 Mock API
 */

import type { Request, Response } from 'express';
import { users } from './_data';

export default {
  // 用户登录
  'POST /api/auth/login': (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    // 查找用户
    const user = users.find((u) => u.username === username);
    
    if (!user) {
      return res.status(200).json({
        success: false,
        errorCode: '2003',
        errorMessage: '用户名或密码错误',
      });
    }
    
    // 简单的密码验证（实际应该用加密比对）
    const validPasswords: Record<string, string> = {
      admin: 'janethedev'
    };

    if (user.password !== password && password !== validPasswords[username]) {
      return res.status(200).json({
        success: false,
        errorCode: '2003',
        errorMessage: '用户名或密码错误',
      });
    }
    
    // 登录成功
    const { password: _, ...userInfo } = user;
    
    // 更新最后登录时间
    user.lastLoginTime = new Date().toISOString();
    
    return res.json({
      success: true,
      data: {
        token: `mock-token-${user.id}-${Date.now()}`,
        user: userInfo,
      },
    });
  },
  
  // 获取当前用户信息
  'GET /api/auth/currentUser': (req: Request, res: Response) => {
    // 从请求头获取 token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(200).json({
        success: false,
        errorCode: '2001',
        errorMessage: '未登录或登录已过期',
      });
    }
    
    // 简单的 token 验证（从 token 中提取用户 ID）
    const userId = parseInt(token.split('-')[2] || '1');
    const user = users.find((u) => u.id === userId) || users[0];
    
    const { password: _, ...userInfo } = user;
    
    return res.json({
      success: true,
      data: userInfo,
    });
  },
  
  // 退出登录
  'POST /api/auth/logout': (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: null,
      message: '退出登录成功',
    });
  },
};

