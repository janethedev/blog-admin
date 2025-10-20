/**
 * 文件上传相关 Mock API
 */

import type { Request, Response } from 'express';

export default {
  // 上传图片
  'POST /api/upload/image': (req: Request, res: Response) => {
    // 模拟图片上传
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    
    return res.json({
      success: true,
      data: {
        url: `https://picsum.photos/800/600?random=${timestamp}`,
        filename: `image-${randomId}.jpg`,
        size: Math.floor(Math.random() * 1000000) + 100000, // 100KB - 1MB
      },
      message: '图片上传成功',
    });
  },
};

