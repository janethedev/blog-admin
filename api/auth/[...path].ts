import type { VercelRequest, VercelResponse } from '@vercel/node';
import { users } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 从 URL 中提取路径，例如 /api/auth/login -> 'login'
  const url = req.url || '';
  const pathMatch = url.match(/\/api\/auth\/([^?]+)/);
  const endpoint = pathMatch ? pathMatch[1] : '';

  // POST /api/auth/login
  if (endpoint === 'login' && req.method === 'POST') {
    const { username, password } = (req.body || {}) as {
      username?: string;
      password?: string;
    };

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(200).json({
        success: false,
        errorCode: '2003',
        errorMessage: '用户名或密码错误',
      });
    }

    // 支持明文密码 janethedev（与 mock/auth.ts 保持一致）
    const validPasswords: Record<string, string> = {
      admin: 'janethedev',
    };

    if (
      user.password !== password &&
      password !== validPasswords[username || '']
    ) {
      return res.status(200).json({
        success: false,
        errorCode: '2003',
        errorMessage: '用户名或密码错误',
      });
    }

    const { password: _omit, ...userInfo } = user as any;

    user.lastLoginTime = new Date().toISOString();

    return res.status(200).json({
      success: true,
      data: {
        token: `mock-token-${user.id}-${Date.now()}`,
        user: userInfo,
      },
    });
  }

  // GET /api/auth/currentUser
  if (endpoint === 'currentUser' && req.method === 'GET') {
    const authHeader = (req.headers['authorization'] ||
      req.headers['Authorization']) as string | undefined;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(200).json({
        success: false,
        errorCode: '2001',
        errorMessage: '未登录或登录已过期',
      });
    }

    const user = users[0];
    const { password: _omit, ...userInfo } = user as any;

    return res.status(200).json({
      success: true,
      data: userInfo,
    });
  }

  // POST /api/auth/logout
  if (endpoint === 'logout' && req.method === 'POST') {
    return res.status(200).json({
      success: true,
      data: null,
      message: '退出登录成功',
    });
  }

  return res.status(404).json({
    success: false,
    errorMessage: 'Endpoint not found',
  });
}
