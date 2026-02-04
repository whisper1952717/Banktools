import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin, Tag } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout';
import { RiskWarningModal } from './components/RiskDisclaimer';
import { isStandalone, getDisplayMode, getPlatform } from './utils/pwa';
import './App.css';

// 路由级别的代码分割 - 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const CompoundCalculator = lazy(() => import('./pages/CompoundCalculator'));
const IRRCalculator = lazy(() => import('./pages/IRRCalculator'));
const AssetAssessment = lazy(() => import('./pages/AssetAssessment'));

/**
 * 加载中组件
 */
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '400px' 
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

/**
 * 主应用组件
 */
function App() {
  const [pwaInfo, setPwaInfo] = useState({
    isStandalone: false,
    displayMode: 'browser',
    platform: 'unknown',
  });

  useEffect(() => {
    // 仅在开发环境显示 PWA 信息
    if (import.meta.env.DEV) {
      setPwaInfo({
        isStandalone: isStandalone(),
        displayMode: getDisplayMode(),
        platform: getPlatform(),
      });
    }
  }, []);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <Router>
        {/* 开发环境 PWA 状态指示器 */}
        {import.meta.env.DEV && (
          <div
            style={{
              position: 'fixed',
              bottom: 10,
              right: 10,
              zIndex: 9999,
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              maxWidth: '300px',
            }}
          >
            <Tag color={pwaInfo.isStandalone ? 'success' : 'default'}>
              {pwaInfo.isStandalone ? '独立模式' : '浏览器模式'}
            </Tag>
            <Tag color="blue">{pwaInfo.displayMode}</Tag>
            <Tag color="purple">{pwaInfo.platform}</Tag>
          </div>
        )}

        {/* 风险提示弹窗 */}
        <RiskWarningModal />

        {/* 主布局 */}
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compound" element={<CompoundCalculator />} />
              <Route path="/irr" element={<IRRCalculator />} />
              <Route path="/assessment" element={<AssetAssessment />} />
              <Route
                path="*"
                element={
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>404</h2>
                    <p>页面未找到</p>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
