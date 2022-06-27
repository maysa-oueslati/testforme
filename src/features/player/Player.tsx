import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Layout, Space, Typography } from 'antd';
import {
  ArrowLeftOutlined,
  PieChartOutlined,
  FileOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;

export default function Player() {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme='light'
        collapsible={false}
        collapsedWidth={64}
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'transparent',
        }}>
        <Space direction='vertical'>
          <Button
            style={{
              height: 46,
            }}
            size='middle'
            onClick={() => navigate(-1)}
            type='text'>
            <ArrowLeftOutlined
              style={{
                fontSize: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </Button>

          <Space
            direction='vertical'
            style={{
              height: '100%',
              marginTop: '25vh',
            }}>
            <Button
              key='1'
              style={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PieChartOutlined
                style={{
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Button>
            <Button
              key='2'
              style={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <UserOutlined
                style={{
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Button>
            <Button
              key='3'
              style={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TeamOutlined
                style={{
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Button>
            <Button
              key='4'
              style={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FileOutlined
                style={{
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Button>
          </Space>
        </Space>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, minHeight: 360 }}>
            <Typography.Title level={2}>Player</Typography.Title>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
