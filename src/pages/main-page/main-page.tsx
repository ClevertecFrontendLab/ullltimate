import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';

import './main-page.css';
import { Header } from '@components/header/header';

const { Sider, Content } = Layout;

export const MainPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Layout className='back'>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                  <div className="logo" />
                  <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                      {
                        key: '1',
                        icon: <UserOutlined />,
                        label: 'nav 1',
                      },
                      {
                        key: '2',
                        icon: <VideoCameraOutlined />,
                        label: 'nav 2',
                      },
                      {
                        key: '3',
                        icon: <UploadOutlined />,
                        label: 'nav 3',
                      },
                    ]}
                  />
                </Sider>
                <Layout className="site-layout">
                  <Header />
                  <div className='trapezoid'>
                          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                          className: 'trigger',
                          onClick: () => setCollapsed(!collapsed),
                          })}
                      </div>
                  <Content
                    className="site-layout-background"
                    style={{
                      margin: '24px 16px',
                      padding: 24,
                      minHeight: 280,
                    }}
                  >
                    Content
                  </Content>
                </Layout>
            </Layout>
        </>
    );
};
