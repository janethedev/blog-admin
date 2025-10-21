import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tags } from '../../mock/_data';
import type { Tag } from '../../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // GET /api/tags - 获取标签列表
  if (req.method === 'GET') {
    const { keyword } = req.query;

    let filteredTags = [...tags];

    // 关键词搜索
    if (keyword) {
      const kw = (keyword as string).toLowerCase();
      filteredTags = filteredTags.filter((t) =>
        t.name.toLowerCase().includes(kw),
      );
    }

    return res.status(200).json({
      success: true,
      data: filteredTags,
    });
  }

  // POST /api/tags - 创建标签
  if (req.method === 'POST') {
    const tagData = req.body;

    // 检查名称是否重复
    const exists = tags.find((t) => t.name === tagData.name);
    if (exists) {
      return res.status(200).json({
        success: false,
        errorCode: '3005',
        errorMessage: '标签名称已存在',
      });
    }

    const newTag: Tag = {
      id: tags.length + 1,
      ...tagData,
      articleCount: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    tags.push(newTag);

    return res.status(200).json({
      success: true,
      data: newTag,
      message: '标签创建成功',
    });
  }

  return res
    .status(405)
    .json({ success: false, errorMessage: 'Method not allowed' });
}
