/**
 * 系统设置页面
 */

import { LockOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Tabs,
  Upload,
} from 'antd';
import type { UploadProps } from 'antd';
import { useState } from 'react';
import { updateProfile, uploadAvatar, changePassword } from '@/services';
import type { CurrentUser } from '@/types';
import './index.less';

export default function Settings() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const currentUser = initialState?.currentUser;

  // 上传头像（Mock 环境优化版）
  const handleAvatarUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      
      // Mock 环境：直接生成假的头像 URL（模拟上传成功）
      // 实际项目接入真实后端时，再改为调用 uploadAvatar(file as File)
      const mockAvatarUrl = `https://avatars.githubusercontent.com/u/${Date.now()}`;
      
      // 直接更新用户头像信息
      const result = await updateProfile({ avatar: mockAvatarUrl });
      
      if (result.success) {
        message.success('头像上传成功');
        
        // 刷新用户信息，更新顶部导航栏
        if (initialState?.fetchUserInfo) {
          const newUserInfo = await initialState.fetchUserInfo();
          setInitialState({
            ...initialState,
            currentUser: newUserInfo,
          });
        }
        
        onSuccess?.({ url: mockAvatarUrl });
      } else {
        message.error('头像上传失败');
        onError?.(new Error('Upload failed'));
      }
    } catch (error) {
      console.error('头像上传错误：', error);
      message.error('头像上传失败');
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  // 更新个人信息
  const handleUpdateProfile = async (values: any) => {
    try {
      const result = await updateProfile(values);
      
      if (result.success) {
        message.success('个人信息更新成功');
        
        // 刷新用户信息
        if (initialState?.fetchUserInfo) {
          const newUserInfo = await initialState.fetchUserInfo();
          setInitialState({
            ...initialState,
            currentUser: newUserInfo,
          });
        }
        
        return true;
      } else {
        message.error('个人信息更新失败');
        return false;
      }
    } catch (error) {
      message.error('个人信息更新失败');
      return false;
    }
  };

  // 修改密码
  const handleChangePassword = async (values: any) => {
    try {
      const result = await changePassword(values);
      
      if (result.success) {
        message.success('密码修改成功，请重新登录');
        passwordForm.resetFields();
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/user/login';
        }, 3000);
        
        return true;
      } else {
        message.error('密码修改失败');
        return false;
      }
    } catch (error) {
      message.error('密码修改失败');
      return false;
    }
  };

  // 个人信息表单
  const ProfileTab = () => (
    <Row gutter={24}>
      <Col xs={24} lg={8}>
        <Card title="头像设置" variant="borderless">
          <div className="avatar-section">
            <Avatar 
              size={120} 
              src={currentUser?.avatar} 
              icon={<UserOutlined />}
              className="avatar-preview"
            />
            <Upload
              customRequest={handleAvatarUpload}
              showUploadList={false}
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('只能上传图片文件！');
                  return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('图片大小不能超过 2MB！');
                  return false;
                }
                return true;
              }}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? '上传中...' : '更换头像'}
              </Button>
            </Upload>
            <div className="avatar-tips">
              <p>支持 JPG、PNG、GIF 格式</p>
              <p>文件大小不超过 2MB</p>
            </div>
          </div>
        </Card>
        
        <Card title="基本信息" variant="borderless" style={{ marginTop: 24 }}>
          <div className="user-info">
            <div className="info-item">
              <span className="label">用户名：</span>
              <span className="value">{currentUser?.username}</span>
            </div>
            <div className="info-item">
              <span className="label">角色：</span>
              <span className="value">
                {currentUser?.role === 'admin' ? '管理员' : '编辑'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">状态：</span>
              <span className="value">
                {currentUser?.status === 'active' ? '正常' : '禁用'}
              </span>
            </div>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} lg={16}>
        <Card title="编辑资料" variant="borderless">
          <ProForm
            form={profileForm}
            layout="vertical"
            initialValues={{
              nickname: currentUser?.nickname,
              email: currentUser?.email,
              bio: currentUser?.bio,
            }}
            onFinish={handleUpdateProfile}
            submitter={{
              searchConfig: {
                submitText: '保存修改',
              },
              resetButtonProps: {
                style: { display: 'none' },
              },
            }}
          >
            <ProFormText
              name="nickname"
              label="昵称"
              placeholder="请输入昵称"
              rules={[
                { required: true, message: '请输入昵称' },
                { max: 20, message: '昵称不能超过20个字符' },
              ]}
              fieldProps={{
                prefix: <UserOutlined />,
              }}
            />
            
            <ProFormText
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            />
            
            <ProFormTextArea
              name="bio"
              label="个人简介"
              placeholder="请输入个人简介"
              fieldProps={{
                rows: 4,
                maxLength: 200,
                showCount: true,
              }}
            />
          </ProForm>
        </Card>
      </Col>
    </Row>
  );

  // 修改密码表单
  const PasswordTab = () => (
    <Row justify="center">
      <Col xs={24} lg={12}>
        <Card title="修改密码" variant="borderless">
          <ProForm
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            submitter={{
              searchConfig: {
                submitText: '确认修改',
                resetText: '重置',
              },
            }}
          >
            <ProFormText.Password
              name="oldPassword"
              label="当前密码"
              placeholder="请输入当前密码"
              rules={[
                { required: true, message: '请输入当前密码' },
              ]}
              fieldProps={{
                prefix: <LockOutlined />,
              }}
            />
            
            <ProFormText.Password
              name="newPassword"
              label="新密码"
              placeholder="请输入新密码（至少6位）"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6位' },
                { max: 20, message: '密码不能超过20位' },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                  message: '密码必须包含字母和数字',
                },
              ]}
              fieldProps={{
                prefix: <LockOutlined />,
              }}
            />
            
            <ProFormText.Password
              name="confirmPassword"
              label="确认密码"
              placeholder="请再次输入新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
              fieldProps={{
                prefix: <LockOutlined />,
              }}
            />
            
            <div className="password-tips">
              <h4>密码要求：</h4>
              <ul>
                <li>长度为 6-20 个字符</li>
                <li>必须包含字母和数字</li>
                <li>建议使用字母、数字和特殊字符的组合</li>
              </ul>
            </div>
          </ProForm>
        </Card>
      </Col>
    </Row>
  );

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          个人信息
        </span>
      ),
      children: <ProfileTab />,
    },
    {
      key: 'password',
      label: (
        <span>
          <LockOutlined />
          修改密码
        </span>
      ),
      children: <PasswordTab />,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '系统设置',
        breadcrumb: {},
      }}
    >
      <Card>
        <Tabs items={tabItems} />
      </Card>
    </PageContainer>
  );
}
