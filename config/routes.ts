/**
 * 博客管理系统路由配置
 */
export default [
  // 登录页面（无布局）
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  // 仪表盘
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './Dashboard',
    access: 'canUser',
  },
  // 文章管理
  {
    path: '/article',
    name: 'article',
    icon: 'fileText',
    access: 'canUser',
    routes: [
      {
        path: '/article',
        redirect: '/article/list',
      },
      {
        path: '/article/list',
        name: 'list',
        component: './Article/List',
      },
      {
        path: '/article/create',
        name: 'create',
        component: './Article/Edit',
        hideInMenu: true,
      },
      {
        path: '/article/edit/:id',
        name: 'edit',
        component: './Article/Edit',
        hideInMenu: true,
      },
    ],
  },
  // 分类管理
  {
    path: '/category',
    name: 'category',
    icon: 'folder',
    component: './Category',
    access: 'canUser',
  },
  // 标签管理
  {
    path: '/tag',
    name: 'tag',
    icon: 'tags',
    component: './Tag',
    access: 'canUser',
  },
  // 系统设置
  {
    path: '/settings',
    name: 'settings',
    icon: 'setting',
    component: './Settings',
    access: 'canUser',
  },
  // 默认重定向到仪表盘
  {
    path: '/',
    redirect: '/dashboard',
  },
  // 404 页面
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
