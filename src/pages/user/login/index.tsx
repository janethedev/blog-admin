/**
 * 登录页面
 */

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from '@umijs/max';
import { login } from '@/services';
import { TOKEN_KEY } from '@/constants';
import styles from './index.less';

export default function Login() {
  const { initialState, setInitialState } = useModel('@@initialState');

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (initialState?.currentUser) {
      history.push('/');
    }
  }, [initialState]);

  const handleSubmit = async (values: { username: string; password: string; autoLogin?: boolean }) => {
    try {
      const result = await login({
        username: values.username,
        password: values.password,
      });

      if (result.success) {
        const { token, user } = result.data;

        // 存储 token
        localStorage.setItem(TOKEN_KEY, token);

        // 如果选择了记住密码，存储用户名（实际项目中不应存储密码）
        if (values.autoLogin) {
          localStorage.setItem('blog-admin-remember', 'true');
          localStorage.setItem('blog-admin-username', values.username);
        } else {
          localStorage.removeItem('blog-admin-remember');
          localStorage.removeItem('blog-admin-username');
        }

        message.success('登录成功！');

        // 更新全局用户状态
        await setInitialState((s) => ({
          ...s,
          currentUser: user,
        }));

        // 跳转到首页或之前的页面
        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        history.push(redirect || '/');
      } else {
        message.error(result.errorMessage || '登录失败，请重试');
      }
    } catch (error) {
      message.error('登录失败，请检查网络连接');
      console.error('登录错误：', error);
    }
  };

  // 获取记住的用户名
  const rememberedUsername = localStorage.getItem('blog-admin-username') || '';
  const rememberMe = localStorage.getItem('blog-admin-remember') === 'true';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="博客管理系统"
          subTitle="基于 Ant Design Pro 的现代化博客后台"
          initialValues={{
            autoLogin: rememberMe,
            username: rememberedUsername,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as any);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名: admin 或 editor"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码: admin123 或 editor123"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <div style={{ marginBlockEnd: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              记住密码
            </ProFormCheckbox>
          </div>
        </LoginForm>

        <div className={styles.footer}>
          <div className={styles.tips}>
            <p>测试账号：</p>
            <p>👤 管理员：admin / admin123</p>
            <p>✏️ 编辑：editor / editor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
