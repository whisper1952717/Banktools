import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 注册 PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker 注册成功:', registration.scope);
      })
      .catch((error) => {
        console.warn('Service Worker 注册失败，应用将在无离线支持模式下运行:', error);
        // 应用继续正常运行，只是没有离线功能
      });
  });
} else {
  console.warn('浏览器不支持 Service Worker，应用将在无离线支持模式下运行');
  // 优雅降级，应用正常运行
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
