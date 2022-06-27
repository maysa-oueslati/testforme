import React, { useEffect, useState } from 'react';
import { useRxCollection } from 'rxdb-hooks';
import { Button, Form, Input, Layout } from 'antd';
import logo from '../../logo.svg';
import useStore from '../../app/store';

function setToken({email, password}) {
  sessionStorage.setItem('token', JSON.stringify({email, password}));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const user = tokenString ? JSON.parse(tokenString) : null;
  return user;
}

const Login = () => {
  const setAuth = useStore((state) => state.authSlice.setAuth);
  const collection = useRxCollection('users');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    const precheck = async () => {
      const token = getToken();
      if (token) {
        const user = await collection?.findOne({
          selector: {
            email: token.email,
            password: token.password,
          }
        }).exec();

        if (user) {
          setAuth(user.get('email'));
        }
      }
    };

    precheck();
  }, [collection])

  const handleSubmit = async () => {

    const user = await collection?.findOne({
      selector: {
        email,
        password,
      }
    }).exec();
    
    if (user) {
      setAuth(email)
      setToken({email, password})
    }
  };
  
  return (
    <Layout className="layout">
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <span>
          <img src={logo} width={60} height={60} alt="" />
        </span>
        <span style={{
          fontSize: '24px',
          fontWeight: 600,
          verticalAlign: 'middle',
        }}>MIXAP</span>
      </div>
      
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input onChange={(e) => setEmail(e.target.value)} value={email} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)} value={password} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Login;
