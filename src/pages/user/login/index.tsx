/**
 * 登录页面 - 根据 Figma Login2 设计稿实现
 * 设计稿: https://www.figma.com/design/fEDnRxBAMkll062ZlZAEZ3/Login-登录页--Community-?node-id=4135-624
 */

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, Form, message } from 'antd';
import { useEffect, useState } from 'react';
import loginBgImage from '@/assets/images/login-bg.png';
import { TOKEN_KEY } from '@/constants';
import { login } from '@/services';
import styles from './index.less';

type LoginType = 'account' | 'phone';

export default function Login() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginType, setLoginType] = useState<LoginType>('account'); // 默认账号密码登录
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (initialState?.currentUser) {
      history.push('/');
    }
  }, [initialState]);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [countdown]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 验证码登录暂时使用账号密码模拟
      const result = await login({
        username: loginType === 'account' ? values.username : 'admin',
        password: loginType === 'account' ? values.password : 'admin123',
      });

      if (result.success) {
        const { token, user } = result.data;
        localStorage.setItem(TOKEN_KEY, token);

        if (values.remember) {
          localStorage.setItem('blog-admin-remember', 'true');
        } else {
          localStorage.removeItem('blog-admin-remember');
        }

        message.success('登录成功！');

        await setInitialState((s) => ({
          ...s,
          currentUser: user,
        }));

        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        history.push(redirect || '/');
      } else {
        message.error(result.errorMessage || '登录失败，请重试');
      }
    } catch (error) {
      message.error('登录失败，请检查网络连接');
      console.error('登录错误：', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取验证码
  const handleGetCaptcha = () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.warning('请先输入手机号');
      return;
    }
    if (!/^1\d{10}$/.test(phone)) {
      message.warning('手机号格式错误');
      return;
    }

    message.success('验证码已发送');
    setCountdown(60);
  };

  return (
    <div className={styles.loginContainer}>
      {/* 左侧：背景插图 */}
      <div className={styles.loginLeft}>
        <img src={loginBgImage} alt="登录背景" className={styles.bgImage} />
      </div>

      {/* 右侧：登录表单 */}
      <div className={styles.loginRight}>
        <div className={styles.loginFormWrapper}>
          {/* Logo 和标题 */}
          <div className={styles.loginHeader}>
            <div className={styles.logo}>
              <svg
                width="39"
                height="31"
                viewBox="0 0 39 31"
                fill="none"
                aria-label="博客系统Logo"
              >
                <title>博客系统Logo</title>
                <path
                  d="M19.5 4L4 11.5V19.5L19.5 27L35 19.5V11.5L19.5 4Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className={styles.loginTitle}>欢迎登录</h1>
          </div>

          {/* 登录方式切换 */}
          <div className={styles.loginTabs}>
            <div
              className={`${styles.tabItem} ${loginType === 'account' ? styles.tabActive : ''}`}
              onClick={() => setLoginType('account')}
            >
              账号密码登录
            </div>
            <div className={styles.tabDivider} />
            <div
              className={`${styles.tabItem} ${loginType === 'phone' ? styles.tabActive : ''}`}
              onClick={() => setLoginType('phone')}
            >
              验证码登录
            </div>
          </div>

          {/* 表单区域 */}
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              remember: true,
            }}
            className={styles.loginForm}
          >
            {loginType === 'account' ? (
              <>
                {/* 账号密码登录 */}
                <div className={styles.inputWrapper}>
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      placeholder: '请输入账号',
                      variant: 'borderless',
                    }}
                    rules={[
                      {
                        required: true,
                        message: '请输入账号！',
                      },
                    ]}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      placeholder: '请输入密码',
                      variant: 'borderless',
                      iconRender: (visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />,
                    }}
                    rules={[
                      {
                        required: true,
                        message: '请输入密码！',
                      },
                    ]}
                  />
                </div>
              </>
            ) : (
              <>
                {/* 验证码登录 */}
                <div className={styles.inputWrapper}>
                  <ProFormText
                    name="phone"
                    fieldProps={{
                      size: 'large',
                      placeholder: '请输入手机号',
                      variant: 'borderless',
                    }}
                    rules={[
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ]}
                  />
                </div>
                <div className={styles.captchaWrapper}>
                  <div className={styles.inputWrapper}>
                    <ProFormText
                      name="captcha"
                      fieldProps={{
                        size: 'large',
                        placeholder: '请输入验证码',
                        variant: 'borderless',
                      }}
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]}
                    />
                  </div>
                  <div
                    className={styles.getCaptchaBtn}
                    onClick={countdown === 0 ? handleGetCaptcha : undefined}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </div>
                </div>
              </>
            )}

            {/* 记住我 / 忘记密码 */}
            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <ProFormCheckbox name="remember" noStyle>
                  <span className={styles.checkboxText}>记住我</span>
                </ProFormCheckbox>
              </div>
              {loginType === 'account' ? (
                <a className={styles.forgotLink}>忘记密码?</a>
              ) : (
                <a className={styles.forgotLink}>收不到验证码?</a>
              )}
            </div>

            {/* 登录按钮 */}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.loginButton}
            >
              登 录
            </Button>

            {/* 注册链接 */}
            <div className={styles.registerLink}>
              <span className={styles.registerText}>没有账户？</span>
              <a className={styles.registerAction}>立即注册</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
