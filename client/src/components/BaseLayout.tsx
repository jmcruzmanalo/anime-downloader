import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Footer, Content } = Layout;

const BaseLayout: React.FC = ({ children }) => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
          <Menu.Item>
            <Link to={'/'}>Downloads</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={'/search'}>Search</Link>
          </Menu.Item>
        </Menu>
      </Header>

      <ContentStyled>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {children}
        </div>
      </ContentStyled>
      <Footer style={{ textAlign: 'center' }}>Eii wasap</Footer>
    </Layout>
  );
};

const ContentStyled = styled(Content)`
  padding: 50px;
  padding-bottom: 0px;
  min-height: calc(100vh - 133px);
`;

export default BaseLayout;
