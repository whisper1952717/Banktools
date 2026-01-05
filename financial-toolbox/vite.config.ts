import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动配置chunk分割
        manualChunks: {
          // 将React相关库打包到一起
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 将Ant Design打包到一起
          'antd-vendor': ['antd'],
          // 将ECharts打包到一起
          'echarts-vendor': ['echarts'],
          // 将工具库打包到一起
          'utils-vendor': ['decimal.js'],
        },
        // 配置chunk文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置chunk大小警告限制（500kb）
    chunkSizeWarningLimit: 500,
    // 启用压缩（使用esbuild）
    minify: 'esbuild',
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', 'echarts', 'decimal.js'],
  },
})
