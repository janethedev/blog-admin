import type { VercelRequest, VercelResponse } from '@vercel/node';
import { users } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

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
