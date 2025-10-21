import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCategoryDistribution } from '../../mock/_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ success: false, errorMessage: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    data: getCategoryDistribution(),
  });
}
