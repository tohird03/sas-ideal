'use client';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import {Button, Form, Input} from 'antd';
import classNames from 'classnames';
import {useLocalStorage} from 'usehooks-ts';
import {ILoginForm} from '@/api/auth/types';
import {ROUTES} from '@/constants';
import {authStore, TokenType} from '@/stores/auth';
import {addNotification} from '@/utils/addNotification';
import {BackgroundAnimate} from './components/BackgroundAnimate';
import styles from './login.scss';

const cn = classNames.bind(styles);

export const Login = observer(() => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [, setAccessToken] = useLocalStorage<TokenType['accessToken']>('accessToken', '');

  const handleSubmit = (values: ILoginForm) => {
    setLoading(true);
    authStore.getSignIn(values)
      .then(res => {
        if (res?.data) {
          setAccessToken(res.data?.accessToken);
          navigate(ROUTES.workers);
          addNotification('Success login');
          authStore.getProfile();
        }
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main>
      <BackgroundAnimate count={20} />
      <section className={cn('login')}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
          className={cn('login__form')}
        >
          <Form.Item
            name="phone"
            label="Username"
            rules={[{required: true}]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{required: true}]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <div className={cn('login__form__submit')}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              disabled={loading}
            >
              Login
            </Button>
          </div>
        </Form>
      </section>
    </main>
  );
});
