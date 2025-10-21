import type { VercelRequest, VercelResponse } from '@vercel/node';
import { users } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

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
