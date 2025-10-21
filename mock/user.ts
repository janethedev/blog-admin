/**
 * 用户设置相关 Mock API
 */

import type { Request, Response } from 'express';
import { users } from './_data';

export default {
  // 更新个人信息
  'PUT /api/user/profile': (req: Request, res: Response) => {
    const updateData = req.body;
    
    // 从 token 获取用户 ID（简化处理）
    const userId = 1;
    const user = users.find((u) => u.id === userId);
    
    if (!user) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '用户不存在',
      });
    }
    
    // 更新用户信息
    Object.assign(user, {
      ...updateData,
      updateTime: new Date().toISOString(),
    });
    
    const { password: _, ...userInfo } = user;
    
    return res.json({
      success: true,
      data: userInfo,
      message: '个人信息更新成功',
    });
  },
  
  // 上传头像
  'POST /api/user/avatar': (req: Request, res: Response) => {
    // 模拟文件上传
    const userId = 1;
    const user = users.find((u) => u.id === userId);
    
    if (!user) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '用户不存在',
      });
    }
    
    // 模拟上传成功，返回图片 URL
    const avatarUrl = `https://avatars.githubusercontent.com/u/${Date.now()}`;
    user.avatar = avatarUrl;
    user.updateTime = new Date().toISOString();
    
    return res.json({
      success: true,
      data: {
        url: avatarUrl,
        filename: 'avatar.jpg',
        size: 102400,
      },
      message: '头像上传成功',
    });
  },
  
  // 修改密码
  'POST /api/user/changePassword': (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    // 验证参数
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(200).json({
        success: false,
        errorCode: '1001',
        errorMessage: '参数不完整',
      });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(200).json({
        success: false,
        errorCode: '1001',
        errorMessage: '两次输入的密码不一致',
      });
    }
    
    const userId = 1;
    const user = users.find((u) => u.id === userId);
    
    if (!user) {
      return res.status(200).json({
        success: false,
        errorCode: '1004',
        errorMessage: '用户不存在',
      });
    }
    
    // 验证旧密码（简化处理）
    if (oldPassword !== 'janethedev' && user.password !== oldPassword) {
      return res.status(200).json({
        success: false,
        errorCode: '1001',
        errorMessage: '旧密码错误',
      });
    }
    
    // 更新密码（实际应该加密）
    user.password = newPassword;
    user.updateTime = new Date().toISOString();
    
    return res.json({
      success: true,
      message: '密码修改成功',
    });
  },
};
