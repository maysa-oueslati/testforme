import React from 'react';
import { PageHeader, Menu, Dropdown, Button, Row } from 'antd';
import { Link } from 'react-router-dom';

import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../../logo.svg';
import useStore from '../../app/store';

const menu = (
  <Menu
    items={[
      {
        label: '1st menu item',
        key: '1',
        icon: <UserOutlined />,
      },
      {
        label: '2nd menu item',
        key: '2',
        icon: <UserOutlined />,
      },
      {
        label: '3rd menu item',
        key: '3',
        icon: <UserOutlined />,
      },
    ]}
  />
);

const DropdownMenu = () => (
  <Dropdown
    arrow
    key='more'
    overlay={menu}
    placement='bottomRight'>
    <Button
      type='text'
      icon={<MoreOutlined style={{ fontSize: 20 }} />}
    />
  </Dropdown>
);

const Content = ({ children, extraContent }: any) => (
  <Row>
    <div style={{ flex: 1 }}>{children}</div>
    <div className='image'>{extraContent}</div>
  </Row>
);

export default function Header({
  route,
  content = null,
}: {
  route: string;
  content: any;
}) {
  
  const setAuth = useStore((state) => state.authSlice.setAuth);
  
  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem('token');
  };
  
  const type = route === '/dashboard' ? '' : 'primary';

  return (
    <PageHeader
      title='MIXAP'
      extra={[
        <Button
          key='2'
          shape='round'>
          <Link to='/library'>Accueil</Link>
        </Button>,
        <Button
          key='1'
          shape='round'>
          <Link
            to='/dashboard'
            type={type}>
            Tableau de bord
          </Link>
        </Button>,
        <Button
          onClick={logout}
          key='1'
          shape='round'>
            Log out
        </Button>,
        <DropdownMenu key='more' />,
      ]}
      avatar={{ src: logo }}>
      {content ? <Content>{content}</Content> : null}
    </PageHeader>
  );
}
