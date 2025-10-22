/**
 * Article Service 单元测试
 */

import { 
  getArticleList, 
  getArticleDetail,
  createArticle, 
  updateArticle,
  deleteArticle,
  batchDeleteArticles,
  batchUpdateArticleStatus,
  uploadImage,
} from '../article';
import { request } from '@umijs/max';

// Mock @umijs/max 的 request 函数
jest.mock('@umijs/max', () => ({
  request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

describe('Article Service', () => {
  beforeEach(() => {
    // 每个测试前清除所有 mock
    jest.clearAllMocks();
  });

  describe('getArticleList', () => {
    it('should fetch article list successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          list: [
            { id: 1, title: 'Test Article 1' },
            { id: 2, title: 'Test Article 2' },
          ],
          total: 2,
          pageNum: 1,
          pageSize: 10,
        },
      };

      mockRequest.mockResolvedValue(mockResponse);

      const params = {
        pageNum: 1,
        pageSize: 10,
        keyword: 'test',
      };

      const result = await getArticleList(params);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith('/api/articles', {
        method: 'GET',
        params,
      });
      expect(result.success).toBe(true);
      expect(result.data.list).toHaveLength(2);
      expect(result.data.total).toBe(2);
    });

    it('should handle empty params', async () => {
      const mockResponse = {
        success: true,
        data: { list: [], total: 0 },
      };

      mockRequest.mockResolvedValue(mockResponse);

      await getArticleList();

      expect(mockRequest).toHaveBeenCalledWith('/api/articles', {
        method: 'GET',
        params: undefined,
      });
    });
  });

  describe('getArticleDetail', () => {
    it('should fetch article detail by id', async () => {
      const mockArticle = {
        id: 123,
        title: 'Test Article',
        content: '# Hello World',
        categoryId: 1,
        tags: [1, 2],
        status: 'published',
      };

      mockRequest.mockResolvedValue({
        success: true,
        data: mockArticle,
      });

      const result = await getArticleDetail(123);

      expect(mockRequest).toHaveBeenCalledWith('/api/articles/123', {
        method: 'GET',
      });
      expect(result.data.id).toBe(123);
      expect(result.data.title).toBe('Test Article');
    });
  });

  describe('createArticle', () => {
    it('should create new article with correct data', async () => {
      const newArticle = {
        title: 'New Article',
        content: '# Content',
        summary: 'This is a test article summary',
        categoryId: 1,
        tags: [1, 2],
        status: 'draft' as const,
        isTop: false,
        allowComment: true,
      };

      const mockResponse = {
        success: true,
        data: { id: 1, ...newArticle },
      };

      mockRequest.mockResolvedValue(mockResponse);

      const result = await createArticle(newArticle);

      expect(mockRequest).toHaveBeenCalledWith('/api/articles', {
        method: 'POST',
        data: newArticle,
      });
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(1);
    });
  });

  describe('updateArticle', () => {
    it('should update existing article', async () => {
      const updateData = {
        title: 'Updated Title',
        content: '# Updated Content',
        summary: 'Updated article summary',
        categoryId: 2,
        tags: [3],
        status: 'published' as const,
        isTop: true,
        allowComment: true,
      };

      mockRequest.mockResolvedValue({
        success: true,
        data: { id: 5, ...updateData },
      });

      const result = await updateArticle(5, updateData);

      expect(mockRequest).toHaveBeenCalledWith('/api/articles/5', {
        method: 'PUT',
        data: updateData,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('deleteArticle', () => {
    it('should delete article by id', async () => {
      mockRequest.mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await deleteArticle(123);

      expect(mockRequest).toHaveBeenCalledWith('/api/articles/123', {
        method: 'DELETE',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('batchDeleteArticles', () => {
    it('should delete multiple articles', async () => {
      const ids = [1, 2, 3, 4, 5];

      mockRequest.mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await batchDeleteArticles({ ids });

      expect(mockRequest).toHaveBeenCalledWith('/api/articles/batchDelete', {
        method: 'POST',
        data: { ids },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('batchUpdateArticleStatus', () => {
    it('should update status for multiple articles to published', async () => {
      const params = {
        ids: [1, 2, 3],
        status: 'published' as const,
      };

      mockRequest.mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await batchUpdateArticleStatus(params);

      expect(mockRequest).toHaveBeenCalledWith('/api/articles/batchUpdateStatus', {
        method: 'POST',
        data: params,
      });
      expect(result.success).toBe(true);
    });

    it('should update status for multiple articles to draft', async () => {
      const params = {
        ids: [4, 5],
        status: 'draft' as const,
      };

      mockRequest.mockResolvedValue({
        success: true,
        data: null,
      });

      await batchUpdateArticleStatus(params);

      expect(mockRequest).toHaveBeenCalledWith('/api/articles/batchUpdateStatus', {
        method: 'POST',
        data: params,
      });
    });
  });

  describe('uploadImage', () => {
    it('should upload image file successfully', async () => {
      // 创建模拟的图片文件
      const mockFile = new File(['test image content'], 'test.png', { 
        type: 'image/png' 
      });

      const mockResponse = {
        success: true,
        data: {
          url: 'https://example.com/images/test-12345.png',
          filename: 'test-12345.png',
          size: 1024,
        },
      };

      mockRequest.mockResolvedValue(mockResponse);

      const result = await uploadImage(mockFile);

      // 验证请求调用
      expect(mockRequest).toHaveBeenCalledWith('/api/upload/image', {
        method: 'POST',
        data: expect.any(FormData),
        requestType: 'form',
      });

      // 验证返回结果
      expect(result.success).toBe(true);
      expect(result.data.url).toBe('https://example.com/images/test-12345.png');
      expect(result.data.filename).toBe('test-12345.png');
    });

    it('should handle upload failure with error message', async () => {
      const mockFile = new File(['test'], 'large-file.png', { 
        type: 'image/png' 
      });

      const mockErrorResponse = {
        success: false,
        errorCode: '5001',
        errorMessage: '文件大小超过限制（最大 5MB）',
      };

      mockRequest.mockResolvedValue(mockErrorResponse);

      const result = await uploadImage(mockFile);

      expect(mockRequest).toHaveBeenCalledWith('/api/upload/image', {
        method: 'POST',
        data: expect.any(FormData),
        requestType: 'form',
      });

      expect(result.success).toBe(false);
      // 类型断言：当 success 为 false 时，响应包含 errorMessage
      expect((result as any).errorMessage).toBe('文件大小超过限制（最大 5MB）');
    });
  });
});

