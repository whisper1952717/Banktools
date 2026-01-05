import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Layout from './components/Layout';
import { RiskWarningModal } from './components/RiskDisclaimer';
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
