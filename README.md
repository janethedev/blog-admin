# 博客管理系统

> 基于 Ant Design Pro 的现代化博客后台管理系统

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Ant Design Pro](https://img.shields.io/badge/Ant%20Design%20Pro-6.x-brightgreen)](https://pro.ant.design/)
[![UmiJS](https://img.shields.io/badge/UmiJS-4.x-orange)](https://umijs.org/)

## ✨ 特性

- 🎯 **TypeScript** - 全栈类型安全
- 📝 **Markdown 编辑器** - 支持实时预览、代码高亮
- 📊 **数据可视化** - 统计图表、访问趋势分析
- 🔐 **权限管理** - JWT 认证、路由守卫
- 🎨 **Pro Components** - ProTable、ProForm 等高级组件
- 🚀 **Mock 数据** - 完整的前端开发环境

## 🛠️ 技术栈

- **核心框架**: React 18 + UmiJS 4 + TypeScript 5
- **UI 组件**: Ant Design 5 + Pro Components
- **编辑器**: @uiw/react-md-editor
- **图表库**: @ant-design/charts
- **Mock**: UmiJS Mock + Mock.js

## 📦 功能模块

- ✅ **仪表盘** - 数据统计、图表可视化
- ✅ **文章管理** - Markdown 编辑、图片上传、批量操作
- ✅ **分类管理** - 基础 CRUD、文章数统计
- ✅ **标签管理** - 颜色标签、搜索排序
- ✅ **系统设置** - 个人信息、头像上传、密码修改

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22.x

### 安装依赖

```bash
npm install
# 或
yarn
```

### 启动开发服务器

```bash
npm start
# 或
yarn start
```

访问 `http://localhost:8000`

### 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | janethedev | 管理员 |

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 📁 项目结构

```
src/
├── pages/          # 页面组件
│   ├── Dashboard/  # 仪表盘
│   ├── Article/    # 文章管理
│   ├── Category/   # 分类管理
│   ├── Tag/        # 标签管理
│   └── Settings/   # 系统设置
├── services/       # API 服务
├── types/          # TypeScript 类型定义
├── constants/      # 常量配置
└── app.tsx         # 运行时配置

mock/               # Mock 数据
config/             # UmiJS 配置
```

## 🔧 开发说明

### Mock 数据

项目使用 UmiJS Mock，所有接口数据都在 `mock/` 目录下。

### 对接真实后端

1. 关闭 Mock，修改 `config/config.ts`
2. 配置 proxy 代理到真实后端
3. 调整 `src/app.tsx` 中的请求拦截器

## 📝 代码规范

项目遵循以下规范：

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型安全
- **Conventional Commits** - 提交规范

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```

## 📄 License

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
