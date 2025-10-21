/**
 * Mock 数据生成文件
 */

import mockjs from 'mockjs';
import type { User, Article, Category, Tag } from '@/types';

// 用户数据
export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'e10adc3949ba59abbe56e057f20f883e', // MD5(admin123)
    nickname: 'Administrator',
    avatar: 'https://avatars.githubusercontent.com/u/1',
    email: 'admin@blog.com',
    role: 'admin',
    bio: '全栈开发者，热爱技术分享',
    status: 'active',
    lastLoginTime: new Date().toISOString(),
    createTime: '2024-01-01T00:00:00Z',
    updateTime: new Date().toISOString(),
  },
];

// 分类数据
export const categories: Category[] = [
  {
    id: 1,
    name: '前端开发',
    slug: 'frontend',
    description: '前端技术相关文章，包括 React、Vue、TypeScript 等',
    icon: 'CodeOutlined',
    sort: 1,
    articleCount: 0, // 会在生成文章后更新
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '后端开发',
    slug: 'backend',
    description: '后端技术相关文章，包括 Node.js、Java、数据库等',
    icon: 'CloudOutlined',
    sort: 2,
    articleCount: 0,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: '数据库',
    slug: 'database',
    description: '数据库技术，包括 MySQL、MongoDB、Redis 等',
    icon: 'DatabaseOutlined',
    sort: 3,
    articleCount: 0,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'DevOps',
    slug: 'devops',
    description: '运维部署相关，包括 Docker、CI/CD、Linux 等',
    icon: 'ToolOutlined',
    sort: 4,
    articleCount: 0,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: '架构设计',
    slug: 'architecture',
    description: '系统架构、设计模式、最佳实践',
    icon: 'AppstoreOutlined',
    sort: 5,
    articleCount: 0,
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
  },
];

// 标签数据
export const tags: Tag[] = [
  { id: 1, name: 'React', color: '#61dafb', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Vue', color: '#42b883', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'TypeScript', color: '#3178c6', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Node.js', color: '#339933', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Docker', color: '#2496ed', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Webpack', color: '#8dd6f9', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 7, name: 'Next.js', color: '#000000', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 8, name: 'MySQL', color: '#4479a1', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 9, name: 'MongoDB', color: '#47a248', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
  { id: 10, name: 'Redis', color: '#dc382d', articleCount: 0, createTime: '2024-01-01T00:00:00Z', updateTime: '2024-01-01T00:00:00Z' },
];

// 文章标题模板（用于生成更真实的标题）
const articleTitles = [
  'React 18 新特性详解：并发渲染与自动批处理',
  'TypeScript 5.0 新特性一览：装饰器与 const 类型参数',
  'Vue 3 Composition API 最佳实践指南',
  'Node.js 性能优化：从理论到实践',
  'Docker 容器化部署完整指南',
  'Webpack 5 打包优化实战',
  'Next.js 13 App Router 深度解析',
  'MySQL 查询优化：索引设计与 SQL 调优',
  'MongoDB 聚合管道实战技巧',
  'Redis 缓存策略与最佳实践',
  '前端性能优化：从页面加载到运行时优化',
  '微前端架构设计与实践',
  'GraphQL 在现代 Web 应用中的应用',
  'CSS-in-JS 方案对比：styled-components vs Emotion',
  'Vite 构建工具深入理解',
  'Nest.js 企业级后端开发指南',
  'Tailwind CSS 实用技巧分享',
  'React Hooks 最佳实践与常见陷阱',
  'Vue 3 响应式系统原理剖析',
  'Node.js 微服务架构实践',
  'Kubernetes 入门与实践',
  'CI/CD 流程搭建：GitHub Actions 实战',
  'TypeScript 类型体操：高级类型技巧',
  'Monorepo 项目管理：pnpm + Turborepo',
  'WebAssembly 入门与性能优化',
  'Serverless 架构设计与实践',
  '前端工程化：从规范到自动化',
  'React 性能优化终极指南',
  'Vue Router 4 最佳实践',
  'Express.js 与 Koa 对比分析',
  'Nginx 反向代理与负载均衡配置',
  'Linux 服务器运维常用命令',
  'Git 进阶：高级命令与工作流',
  'ESLint + Prettier 代码规范配置',
  'Jest 单元测试完全指南',
  'Cypress 端到端测试实践',
  'Ant Design Pro 企业级应用开发',
  'Material-UI 组件库深度定制',
  'Three.js 3D 可视化入门',
  'D3.js 数据可视化实战',
  'WebSocket 实时通信应用开发',
  'OAuth 2.0 认证授权详解',
  'JWT Token 安全最佳实践',
  'XSS 与 CSRF 攻击防御',
  'HTTPS 协议与 SSL 证书配置',
  'RESTful API 设计规范',
  'GraphQL Schema 设计最佳实践',
  'RabbitMQ 消息队列入门',
  'Elasticsearch 全文搜索引擎实战',
  '分布式系统设计：CAP 理论与实践',
];

// 文章内容模板
const articleContentTemplate = `# {{title}}

## 前言

{{description}}

## 核心概念

### 概念一

{{content1}}

### 概念二

{{content2}}

## 实战案例

### 案例一：基础应用

\`\`\`javascript
{{code1}}
\`\`\`

### 案例二：进阶技巧

\`\`\`javascript
{{code2}}
\`\`\`

## 最佳实践

1. **性能优化**：{{practice1}}
2. **代码质量**：{{practice2}}
3. **团队协作**：{{practice3}}

## 常见问题

### Q1: {{question1}}

A: {{answer1}}

### Q2: {{question2}}

A: {{answer2}}

## 总结

{{summary}}

## 参考资料

- [官方文档](https://example.com)
- [GitHub 仓库](https://github.com/example/repo)
- [在线示例](https://demo.example.com)
`;

// 生成文章数据（50条）
export const articles: Article[] = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;
  const categoryId = mockjs.Random.integer(1, 5);
  const tagIds = mockjs.Random.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, mockjs.Random.integer(1, 3));
  const status = mockjs.Random.boolean() ? 'published' : 'draft';
  // 生成最近 1-30 天的创建时间
  const createTime = new Date(Date.now() - mockjs.Random.integer(1, 30) * 24 * 60 * 60 * 1000).toISOString();
  // 生成最近 0-7 天的更新时间
  const updateTime = new Date(Date.now() - mockjs.Random.integer(0, 7) * 24 * 60 * 60 * 1000).toISOString();
  
  const title = articleTitles[index] || mockjs.Random.ctitle(10, 30);
  const content = articleContentTemplate
    .replace('{{title}}', title)
    .replace('{{description}}', mockjs.Random.cparagraph(3, 5))
    .replace('{{content1}}', mockjs.Random.cparagraph(5, 8))
    .replace('{{content2}}', mockjs.Random.cparagraph(5, 8))
    .replace('{{code1}}', 'const example = () => {\n  console.log("Hello World");\n};')
    .replace('{{code2}}', 'const advanced = async () => {\n  const data = await fetchData();\n  return data;\n};')
    .replace('{{practice1}}', mockjs.Random.csentence())
    .replace('{{practice2}}', mockjs.Random.csentence())
    .replace('{{practice3}}', mockjs.Random.csentence())
    .replace('{{question1}}', mockjs.Random.csentence() + '？')
    .replace('{{answer1}}', mockjs.Random.cparagraph(2, 3))
    .replace('{{question2}}', mockjs.Random.csentence() + '？')
    .replace('{{answer2}}', mockjs.Random.cparagraph(2, 3))
    .replace('{{summary}}', mockjs.Random.cparagraph(3, 4));

  return {
    id,
    title,
    content,
    summary: mockjs.Random.csentence(50, 100),
    coverImage: mockjs.Random.boolean() ? `https://picsum.photos/800/400?random=${id}` : undefined,
    categoryId,
    tags: tagIds,
    author: 'Administrator',
    authorId: 1,
    status,
    viewCount: mockjs.Random.integer(50, 1000),
    likeCount: mockjs.Random.integer(0, 100),
    commentCount: mockjs.Random.integer(0, 50),
    isTop: index < 3, // 前3篇置顶
    allowComment: true,
    createTime,
    updateTime,
    publishTime: status === 'published' ? createTime : undefined,
  };
});

// 更新分类和标签的文章计数
categories.forEach((category) => {
  category.articleCount = articles.filter(
    (article) => article.categoryId === category.id && article.status === 'published'
  ).length;
});

tags.forEach((tag) => {
  tag.articleCount = articles.filter(
    (article) => article.tags.includes(tag.id) && article.status === 'published'
  ).length;
});

// 生成访问趋势数据（最近30天）
export const generateVisitTrend = (days: number = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 先生成访客数，然后基于访客数生成访问量
    const visitors = mockjs.Random.integer(100, 300);
    // 访问量 = 访客数 × (1 到 2.5 之间的倍数)，确保 views >= visitors
    const views = Math.floor(visitors * mockjs.Random.float(1, 2.5, 2, 2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      views,
      visitors,
    });
  }
  
  return data;
};

// 生成分类分布数据
export const getCategoryDistribution = () => {
  return categories.map((category) => ({
    name: category.name,
    value: category.articleCount,
  }));
};

// 获取最近更新的文章
export const getRecentArticles = (limit: number = 5) => {
  return articles
    .sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
    .slice(0, limit)
    .map((article) => ({
      id: article.id,
      title: article.title,
      status: article.status,
      updateTime: article.updateTime,
    }));
};

// 统计数据
export const getStatistics = () => {
  const publishedArticles = articles.filter((a) => a.status === 'published');
  
  return {
    articleCount: publishedArticles.length,
    articleGrowth: mockjs.Random.float(0, 20, 1, 1),
    viewCount: articles.reduce((sum, a) => sum + a.viewCount, 0),
    viewGrowth: mockjs.Random.float(0, 30, 1, 1),
    commentCount: articles.reduce((sum, a) => sum + a.commentCount, 0),
    commentGrowth: mockjs.Random.float(-5, 15, 1, 1),
    userCount: users.length,
    userGrowth: 0,
  };
};

