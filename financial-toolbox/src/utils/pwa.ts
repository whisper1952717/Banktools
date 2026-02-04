/**
 * PWA 工具函数
 * 用于检测和管理 PWA 相关功能
 */

/**
 * 检测应用是否在独立模式下运行
 * @returns {boolean} 如果在独立模式下运行返回 true
 */
export function isStandalone(): boolean {
  // 检查 display-mode 媒体查询
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // 检查 iOS Safari 的独立模式
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  // 检查安卓 Chrome 的独立模式
  if (document.referrer.includes('android-app://')) {
    return true;
  }

  return false;
}

/**
 * 检测 PWA 是否已安装
 * @returns {boolean} 如果已安装返回 true
 */
export function isPWAInstalled(): boolean {
  return isStandalone();
}

/**
 * 获取当前显示模式
 * @returns {string} 显示模式：'standalone', 'fullscreen', 'minimal-ui', 或 'browser'
 */
export function getDisplayMode(): string {
  const modes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
  
  for (const mode of modes) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return mode;
    }
  }
  
  return 'browser';
}

/**
 * 检测是否支持 Service Worker
 * @returns {boolean} 如果支持返回 true
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * 检测平台类型
 * @returns {string} 平台类型：'android', 'ios', 'desktop', 或 'unknown'
 */
export function getPlatform(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) {
    return 'android';
  }
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  
  if (/windows|mac|linux/.test(userAgent)) {
    return 'desktop';
  }
  
  return 'unknown';
}
