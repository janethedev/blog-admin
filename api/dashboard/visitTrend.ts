import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateVisitTrend } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

  const days = parseInt((req.query.days as string) || '7', 10);

  return res.status(200).json({
    success: true,
    data: generateVisitTrend(days),
  });
}
