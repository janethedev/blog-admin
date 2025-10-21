import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    data: null,
    message: '退出登录成功',
  });
}
