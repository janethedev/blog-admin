/**
 * 权限定义
 */

export default function access(initialState: { currentUser?: any } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    // 是否已登录
    canUser: !!currentUser,
    // 是否是管理员
    canAdmin: currentUser?.role === 'admin',
    // 是否是编辑
    canEditor: currentUser?.role === 'editor',
  };
}
