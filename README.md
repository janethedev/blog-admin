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
- 🧪 **单元测试** - 36 个测试用例，覆盖率 98%+

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

## 🧪 单元测试

项目包含完整的单元测试体系，确保代码质量和稳定性。

### 测试统计
- **测试套件**: 3 个全部通过 ✅
- **测试用例**: 37 个全部通过 ✅
- **测试框架**: Jest + React Testing Library

### 测试覆盖率
| 模块 | 覆盖率 | 说明 |
|------|--------|------|
| `format.ts` | 100% | 工具函数（数字格式化、时间处理、文本截断） |
| `article.ts` | 100% | API 服务（CRUD、批量操作、图片上传） |
| `StatisticCards.tsx` | 100% | React 组件（统计卡片） |

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 查看详细覆盖率报告
# 打开 coverage/lcov-report/index.html
```

### 测试文件位置
```
src/
├── utils/__tests__/         # 工具函数测试
│   └── format.test.ts       # 19 个测试用例
├── services/__tests__/      # API 服务测试
│   └── article.test.ts      # 11 个测试用例
└── pages/Dashboard/components/__tests__/
    └── StatisticCards.test.tsx  # 7 个测试用例
```

## 📝 代码规范

项目遵循以下规范：

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型安全
- **Conventional Commits** - 提交规范
- **单元测试** - 核心功能测试覆盖率 100%

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
