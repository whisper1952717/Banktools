import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 主布局组件
 * 包含页头、内容区域和页脚
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AntLayout className="layout-container">
      {/* 页头 */}
      <Header className="layout-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">金融常用计算工具</span>
            <span className="logo-version">2026版</span>
          </Link>
          
          {!isHome && (
            <nav className="nav-menu">
              <Link 
                to="/compound" 
                className={location.pathname === '/compound' ? 'nav-item active' : 'nav-item'}
              >
                复利计算
              </Link>
              <Link 
                to="/irr" 
                className={location.pathname === '/irr' ? 'nav-item active' : 'nav-item'}
              >
                IRR测算
              </Link>
              <Link 
                to="/assessment" 
                className={location.pathname === '/assessment' ? 'nav-item active' : 'nav-item'}
              >
                资产体检
              </Link>
            </nav>
          )}
        </div>
      </Header>

      {/* 内容区域 */}
      <Content className="layout-content">
        <div className="content-wrapper">
          {children}
        </div>
      </Content>

      {/* 页脚 */}
      <Footer className="layout-footer">
        <div className="footer-content">
          <div className="disclaimer">
            <p className="disclaimer-text">
              ⚠️ <strong>投资有风险，决策需谨慎</strong>
            </p>
            <p className="disclaimer-text">
              本工具仅供参考，不构成投资建议
            </p>
          </div>
          
          <div className="footer-links">
            <a href="#" className="footer-link">使用条款</a>
            <span className="footer-divider">|</span>
            <a href="#" className="footer-link">隐私政策</a>
          </div>
          
          <div className="copyright">
            © 2026 金融常用计算工具
          </div>
        </div>
      </Footer>
    </AntLayout>
  );
};

export default Layout;
