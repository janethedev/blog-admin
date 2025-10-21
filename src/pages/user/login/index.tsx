/**
 * 登录页面 - 根据 Figma Login2 设计稿实现
 * 设计稿: https://www.figma.com/design/fEDnRxBAMkll062ZlZAEZ3/Login-登录页--Community-?node-id=4135-624
 */

import {
  AppstoreOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Alert, App, Button, Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import loginBgImage from '@/assets/images/login-bg.png';
import { TOKEN_KEY } from '@/constants';
import { login } from '@/services';
import styles from './index.less';

const { Link } = Typography;

type LoginType = 'account' | 'phone';

function LoginPage() {
  const { message } = App.useApp(); // 使用 App.useApp() 获取 message 实例
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginType, setLoginType] = useState<LoginType>('account'); // 默认账号密码登录
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState<string>(''); // 错误消息状态
  const [isErrorVisible, setIsErrorVisible] = useState(false); // 控制错误提示动画

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (initialState?.currentUser) {
      history.push('/');
    }
  }, [initialState]);

  // 页面加载时读取记住的用户名
  useEffect(() => {
    const remembered = localStorage.getItem('blog-admin-remember');
    const savedUsername = localStorage.getItem('blog-admin-username');

    if (remembered === 'true' && savedUsername) {
      form.setFieldsValue({
        username: savedUsername,
        remember: true,
      });
    }
  }, [form]);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [countdown]);

  // 错误提示自动消失
  useEffect(() => {
    if (errorMsg) {
      setIsErrorVisible(true);

      // 3.5秒后开始淡出动画
      const fadeOutTimer = setTimeout(() => {
        setIsErrorVisible(false);
      }, 3500);

      // 4秒后完全移除（等待淡出动画完成）
      const removeTimer = setTimeout(() => {
        setErrorMsg('');
      }, 4000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    }
    return undefined;
  }, [errorMsg]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setErrorMsg(''); // 清除之前的错误
    setIsErrorVisible(false); // 重置动画状态
    try {
      // 验证码登录暂时使用账号密码模拟
      const result = await login({
        username: loginType === 'account' ? values.username : 'admin',
        password: loginType === 'account' ? values.password : 'janethedev',
      });

      if (result.success) {
        const { token, user } = result.data;
        localStorage.setItem(TOKEN_KEY, token);

        // 保存或清除记住的用户名
        if (values.remember) {
          localStorage.setItem('blog-admin-remember', 'true');
          localStorage.setItem('blog-admin-username', values.username || '');
        } else {
          localStorage.removeItem('blog-admin-remember');
          localStorage.removeItem('blog-admin-username');
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
        setErrorMsg(result.errorMessage || '用户名或密码错误');
      }
    } catch (error) {
      setErrorMsg('登录失败，请检查网络连接');
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

      {/* 错误提示框 - 在 loginRight 正上方 */}
      {errorMsg && (
        <Alert
          message={errorMsg}
          type="error"
          showIcon
          closable
          onClose={() => {
            setIsErrorVisible(false);
            setTimeout(() => setErrorMsg(''), 500);
          }}
          className={`${styles.errorAlert} ${!isErrorVisible ? styles.exiting : ''}`}
        />
      )}

      {/* 右侧：登录表单 */}
      <div className={styles.loginRight}>
        <div className={styles.loginFormWrapper}>
          {/* Logo 和标题 */}
          <div className={styles.loginHeader}>
            <div className={styles.logo}>
              <AppstoreOutlined
                className={styles.logoIcon}
                aria-label="博客系统Logo"
              />
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
                      autoComplete: 'username',
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
                      autoComplete: 'current-password',
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
                  <Button
                    size="large"
                    className={styles.getCaptchaBtn}
                    disabled={countdown > 0}
                    onClick={handleGetCaptcha}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
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
                <Link className={styles.forgotLink}>忘记密码?</Link>
              ) : (
                <Link className={styles.forgotLink}>收不到验证码?</Link>
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
              <Link className={styles.registerAction}>立即注册</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

// 使用 App 组件包裹以提供 message 等静态方法
export default function Login() {
  return (
    <App>
      <LoginPage />
    </App>
  );
}
