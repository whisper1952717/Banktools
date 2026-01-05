# 阿里云 ECS 部署文档索引

## 📚 文档列表

### 🎯 快速开始
1. **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** ⭐ 推荐首先阅读
   - 部署方案总结
   - 三步快速部署
   - 常见问题解答
   - 成本估算

### 📖 详细文档
2. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - 完整的部署指南
   - 详细的配置步骤
   - 故障排查方法
   - 性能优化建议

3. **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)**
   - 快速部署参考
   - 常用命令速查
   - 日常部署流程

4. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**
   - 部署检查清单
   - 确保不遗漏步骤
   - 验证部署成功

5. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - 系统架构说明
   - 数据流向图
   - 性能优化方案
   - 安全架构

### 📝 配置文件
6. **[nginx.conf](./nginx.conf)**
   - Nginx 配置模板
   - 需要复制到服务器 `/etc/nginx/conf.d/`

7. **[.env.production](./.env.production)**
   - 生产环境配置
   - 可根据需要修改

8. **[public/robots.txt](./public/robots.txt)**
   - SEO 优化文件

### 🔧 自动化脚本
9. **[../deploy.sh](../deploy.sh)** (Linux/Mac)
   - 自动部署脚本
   - 需要配置服务器 IP

10. **[../deploy.bat](../deploy.bat)** (Windows)
    - Windows 版本部署脚本
    - 需要配置服务器 IP

11. **[server-setup.sh](./server-setup.sh)**
    - 服务器初始化脚本
    - 首次部署时在服务器上运行

12. **[verify-path.sh](./verify-path.sh)** ⭐ 新增
    - 路径验证脚本
    - 检查服务器配置是否正确

### 📌 重要说明
13. **[PATH_UPDATE_NOTE.md](./PATH_UPDATE_NOTE.md)** ⭐ 必读
    - 部署路径更新说明
    - 路径已更新为：`/www/program/金融工具箱/financial-calculation-tools`
    - 包含迁移指南和注意事项

---

## 🚀 推荐阅读顺序

### 首次部署
1. 📖 阅读 [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - 了解整体方案
2. 📖 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) - 详细部署步骤
3. ✅ 使用 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 逐项检查
4. 🏗️ 参考 [ARCHITECTURE.md](./ARCHITECTURE.md) - 理解架构

### 日常部署
1. 📖 查看 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 快速参考
2. 🔧 运行 `deploy.sh` 或 `deploy.bat` - 自动部署

### 故障排查
1. 📖 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的故障排查章节
2. ✅ 使用 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) 的故障排查清单

---

## 📂 文件结构

```
.
├── financial-toolbox/
│   ├── DEPLOYMENT.md                 # 完整部署指南
│   ├── DEPLOYMENT_SUMMARY.md         # 部署方案总结 ⭐
│   ├── DEPLOYMENT_CHECKLIST.md       # 部署检查清单
│   ├── DEPLOYMENT_INDEX.md           # 本文件
│   ├── PATH_UPDATE_NOTE.md           # 路径更新说明 ⭐ 必读
│   ├── QUICK_DEPLOY.md               # 快速部署参考
│   ├── ARCHITECTURE.md               # 架构说明
│   ├── nginx.conf                    # Nginx 配置模板
│   ├── server-setup.sh               # 服务器初始化脚本
│   ├── verify-path.sh                # 路径验证脚本 ⭐ 新增
│   ├── .env.production               # 生产环境配置
│   └── public/
│       └── robots.txt                # SEO 优化
├── deploy.sh                         # Linux/Mac 部署脚本
└── deploy.bat                        # Windows 部署脚本
```

---

## 🎯 快速导航

### 我想...

#### ⚠️ 首先阅读路径更新说明
→ 阅读 [PATH_UPDATE_NOTE.md](./PATH_UPDATE_NOTE.md) ⭐ 必读  
→ 部署路径已更新为：`/www/program/金融工具箱/financial-calculation-tools`

#### 验证服务器配置
→ 运行 `verify-path.sh` 脚本检查配置  
→ 参考 [PATH_UPDATE_NOTE.md](./PATH_UPDATE_NOTE.md)

#### 第一次部署
→ 阅读 [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)  
→ 然后按照 [DEPLOYMENT.md](./DEPLOYMENT.md) 操作

#### 更新网站
→ 运行 `./deploy.sh` (Linux/Mac) 或 `deploy.bat` (Windows)  
→ 参考 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

#### 解决问题
→ 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的故障排查章节  
→ 使用 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) 检查

#### 了解架构
→ 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md)

#### 配置 Nginx
→ 参考 [nginx.conf](./nginx.conf)  
→ 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的 Nginx 配置章节

#### 配置 HTTPS
→ 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的 HTTPS 配置章节

#### 优化性能
→ 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 的性能优化章节  
→ 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的性能优化章节

---

## 💡 提示

### 文档标记说明
- ⭐ = 推荐优先阅读
- 📖 = 文档
- 🔧 = 脚本/工具
- ✅ = 检查清单
- 🏗️ = 架构/设计

### 获取帮助
1. 查看相关文档的"常见问题"章节
2. 查看"故障排查"章节
3. 检查服务器日志
4. 提交 GitHub Issue

---

## 📞 联系方式

如有问题，请：
1. 查看相关文档
2. 检查服务器日志
3. 提交 GitHub Issue
4. 联系技术支持

---

**最后更新**: 2026年1月5日  
**版本**: 1.0.0
