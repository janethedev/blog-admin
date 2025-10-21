import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRecentArticles } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

  const limit = parseInt((req.query.limit as string) || '5', 10);

  return res.status(200).json({
    success: true,
    data: getRecentArticles(limit),
  });
}
