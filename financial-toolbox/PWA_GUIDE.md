# PWA 功能指南

## 概述

金融工具箱现已支持 PWA（渐进式 Web 应用）功能，可以像原生应用一样安装到您的设备上，提供更好的用户体验。

## 主要功能

### ✅ 独立模式运行
- 添加到主屏幕后，应用以独立模式运行
- 不显示浏览器地址栏和导航栏
- 类似原生应用的体验

### ✅ 离线访问
- 首次访问后，核心功能可离线使用
- 自动缓存应用资源
- 网络恢复时自动更新

### ✅ 快速启动
- 从主屏幕直接启动
- 显示品牌启动画面
- 加载速度更快

### ✅ 自适应图标
- 支持安卓自适应图标系统
- 适配各种图标形状（圆形、方形、圆角矩形）
- 图标在所有设备上显示完美

## 安卓设备安装指南

### Chrome for Android

1. 使用 Chrome 浏览器访问应用
2. 点击浏览器菜单（右上角三个点）
3. 选择"添加到主屏幕"或"安装应用"
4. 确认安装
5. 应用图标将出现在主屏幕上

### Samsung Internet

1. 使用 Samsung Internet 浏览器访问应用
2. 点击浏览器菜单
3. 选择"添加页面到"
4. 选择"主屏幕"
5. 确认添加

### Edge for Android

1. 使用 Edge 浏览器访问应用
2. 点击浏览器菜单（底部三个点）
3. 选择"添加到手机"
4. 确认安装

### Firefox for Android

Firefox 目前对 PWA 的支持有限，但应用仍可正常使用，只是无法安装到主屏幕。

## iOS 设备安装指南

### Safari for iOS

1. 使用 Safari 浏览器访问应用
2. 点击分享按钮（底部中间的方框箭头）
3. 向下滚动，选择"添加到主屏幕"
4. 输入名称（可选）
5. 点击"添加"

## 功能验证

### 检查独立模式

安装后，从主屏幕启动应用：
- ✅ 应用应该全屏显示
- ✅ 不显示浏览器地址栏
- ✅ 状态栏颜色为蓝色（#1890ff）
- ✅ 在任务切换器中显示为独立应用

### 检查离线功能

1. 首次访问应用（确保完全加载）
2. 关闭网络连接（飞行模式或关闭 WiFi/数据）
3. 从主屏幕启动应用
4. ✅ 应用应该正常加载和显示
5. ✅ 所有计算工具应该可以使用

### 检查启动画面

从主屏幕启动应用时：
- ✅ 应该显示白色背景的启动画面
- ✅ 启动画面中央显示应用图标
- ✅ 启动画面在应用加载完成后消失

## 开发环境测试

### 启用 PWA 开发模式

PWA 功能在开发环境中默认启用。运行开发服务器：

```bash
npm run dev
```

### 查看 PWA 状态

在开发环境中，应用右下角会显示 PWA 状态指示器：
- **独立模式/浏览器模式**: 当前运行模式
- **display-mode**: 显示模式（standalone/browser）
- **平台**: 设备平台（android/ios/desktop）

### 测试 Service Worker

1. 打开浏览器开发者工具
2. 进入 Application 面板
3. 查看 Service Workers 部分
4. 验证 Service Worker 已注册并激活

### 测试离线功能

1. 在开发者工具的 Network 面板中
2. 勾选"Offline"选项
3. 刷新页面
4. 验证应用可以从缓存加载

## 浏览器兼容性

| 浏览器 | 安装支持 | 独立模式 | 离线功能 | 备注 |
|--------|---------|---------|---------|------|
| Chrome for Android | ✅ | ✅ | ✅ | 完全支持 |
| Samsung Internet | ✅ | ✅ | ✅ | 完全支持 |
| Edge for Android | ✅ | ✅ | ✅ | 完全支持 |
| Firefox for Android | ⚠️ | ⚠️ | ✅ | 基本功能支持 |
| Safari for iOS | ✅ | ✅ | ✅ | 完全支持 |
| Chrome Desktop | ✅ | ✅ | ✅ | 完全支持 |

## 已知问题

### 图标裁切问题

如果在某些安卓设备上发现图标被裁切：
1. 这可能是因为图标不完全符合 maskable 规范
2. 重要内容应该在图标中心 80% 的区域内
3. 可以使用 [Maskable.app](https://maskable.app/) 工具测试图标

### Firefox 安装限制

Firefox for Android 目前不支持标准的 PWA 安装流程，但应用的所有功能仍可正常使用。

## 技术细节

### Manifest 配置

```json
{
  "name": "金融常用计算工具",
  "short_name": "金融工具箱",
  "description": "提供复利计算、IRR测算、资产体检等金融计算工具",
  "theme_color": "#1890ff",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait-primary",
  "start_url": "/?source=pwa",
  "scope": "/",
  "lang": "zh-CN",
  "dir": "ltr",
  "categories": ["finance", "utilities"]
}
```

### Service Worker 缓存策略

- **预缓存**: 所有核心资源（HTML、CSS、JS、图标）
- **运行时缓存**: Google Fonts
- **缓存大小限制**: 5MB
- **更新策略**: 自动更新

### Meta 标签

```html
<!-- PWA 基础配置 -->
<meta name="theme-color" content="#1890ff">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="金融工具箱">

<!-- Manifest 链接 -->
<link rel="manifest" href="/manifest.webmanifest">

<!-- 视口配置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

## 故障排除

### 应用无法安装

1. 确保使用 HTTPS 连接
2. 确保 manifest.json 文件可访问
3. 检查浏览器是否支持 PWA
4. 清除浏览器缓存后重试

### Service Worker 未注册

1. 检查浏览器控制台是否有错误
2. 确保浏览器支持 Service Worker
3. 确保在 HTTPS 环境下（或 localhost）
4. 检查 sw.js 文件是否存在

### 离线功能不工作

1. 确保首次访问时完全加载了应用
2. 检查 Service Worker 是否已激活
3. 查看 Cache Storage 是否有缓存内容
4. 尝试清除缓存后重新访问

## 更多资源

- [PWA 官方文档](https://web.dev/progressive-web-apps/)
- [Maskable Icons 编辑器](https://maskable.app/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse PWA 审计](https://developers.google.com/web/tools/lighthouse)

## 反馈

如果您在使用 PWA 功能时遇到任何问题，请通过以下方式反馈：
- 在项目仓库提交 Issue
- 联系开发团队

---

最后更新：2026-02-04
