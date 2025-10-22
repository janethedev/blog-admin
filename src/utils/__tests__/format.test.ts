/**
 * Format 工具函数单元测试
 */

import {
  formatNumber,
  formatRelativeTime,
  isValidEmail,
  truncateText,
} from '../format';

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    it('should return original number string when less than 1000', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(1)).toBe('1');
      expect(formatNumber(999)).toBe('999');
    });

    it('should format numbers >= 1000 with "k" suffix', () => {
      expect(formatNumber(1000)).toBe('1.0k');
      expect(formatNumber(1500)).toBe('1.5k');
      expect(formatNumber(5280)).toBe('5.3k');
      expect(formatNumber(9999)).toBe('10.0k');
    });

    it('should format numbers >= 10000 with "w" suffix', () => {
      expect(formatNumber(10000)).toBe('1.0w');
      expect(formatNumber(25000)).toBe('2.5w');
      expect(formatNumber(85000)).toBe('8.5w');
      expect(formatNumber(100000)).toBe('10.0w');
    });

    it('should handle edge cases', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-100)).toBe('-100');
    });
  });

  describe('formatRelativeTime', () => {
    beforeAll(() => {
      // 固定当前时间为 2024-01-01 12:00:00
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should return "刚刚" for time less than 1 minute ago', () => {
      const time = new Date('2024-01-01T11:59:30Z');
      expect(formatRelativeTime(time)).toBe('刚刚');
    });

    it('should return minutes ago for time less than 1 hour ago', () => {
      const time = new Date('2024-01-01T11:45:00Z');
      expect(formatRelativeTime(time)).toBe('15分钟前');
    });

    it('should return hours ago for time less than 1 day ago', () => {
      const time = new Date('2024-01-01T09:00:00Z');
      expect(formatRelativeTime(time)).toBe('3小时前');
    });

    it('should return days ago for time less than 1 week ago', () => {
      const time = new Date('2023-12-29T12:00:00Z');
      expect(formatRelativeTime(time)).toBe('3天前');
    });

    it('should return weeks ago for time less than 1 month ago', () => {
      const time = new Date('2023-12-18T12:00:00Z');
      expect(formatRelativeTime(time)).toBe('2周前');
    });

    it('should return months ago for time more than 1 month ago', () => {
      const time = new Date('2023-11-01T12:00:00Z');
      expect(formatRelativeTime(time)).toBe('2个月前');
    });

    it('should accept string date format', () => {
      const result = formatRelativeTime('2024-01-01T11:45:00Z');
      expect(result).toBe('15分钟前');
    });
  });

  describe('truncateText', () => {
    it('should return original text when length is less than maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('Test', 10)).toBe('Test');
    });

    it('should return original text when length equals maxLength', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });

    it('should truncate text and add ellipsis when exceeds maxLength', () => {
      expect(truncateText('Hello World!', 5)).toBe('Hello...');
      expect(truncateText('This is a long text', 10)).toBe('This is a ...');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('should handle Chinese characters', () => {
      expect(truncateText('这是一段很长的中文文本内容', 5)).toBe(
        '这是一段很...',
      );
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('admin@localhost.dev')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidEmail('a@b.c')).toBe(true); // 最短有效邮箱
      expect(isValidEmail('test@domain')).toBe(false); // 缺少顶级域名
    });
  });
});
