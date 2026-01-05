# 阿里云 ECS 部署方案

## 📦 完整的阿里云部署解决方案

本项目已为阿里云 ECS (Alibaba Cloud Linux 3) 部署准备了完整的文档和自动化脚本。

## 🎯 你的服务器信息

- **服务器 IP**: 47.96.251.147
- **域名**: www.lovetest.asia (lovetest.asia)
- **部署路径**: /www/program/金融工具箱/financial-calculation-tools

## 🚀 最快开始方式

### ⚡ 一键部署（推荐）

```bash
# Linux/Mac 用户
chmod +x quick-deploy.sh
./quick-deploy.sh

# Windows 用户
quick-deploy.bat
```

**这个脚本会自动完成所有步骤！**

### 📖 详细指南

👉 **[START_HERE.md](./START_HERE.md)** - 从这里开始 ⭐  
👉 **[DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md)** - 针对你服务器的部署指南 ⭐

## 🚀 三步部署（手动方式）

### 1. 查看部署文档
所有部署相关文档位于 `financial-toolbox/` 目录：

- **[START_HERE.md](./START_HERE.md)** ⭐ 从这里开始
- **[DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md)** ⭐ 针对你服务器的指南
- **[DEPLOYMENT_SUMMARY.md](./financial-toolbox/DEPLOYMENT_SUMMARY.md)** - 部署方案总结
- **[DEPLOYMENT_INDEX.md](./financial-toolbox/DEPLOYMENT_INDEX.md)** - 文档索引

### 2. 三步部署

#### 第一步：服务器配置（首次）
```bash
# 上传并运行服务器配置脚本
scp financial-toolbox/server-setup.sh root@47.96.251.147:/root/
ssh root@47.96.251.147 "chmod +x /root/server-setup.sh && /root/server-setup.sh"
```

#### 第二步：配置部署脚本（首次）
```bash
# 部署脚本已配置好服务器 IP，直接添加执行权限
chmod +x deploy.sh
```

#### 第三步：执行部署
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

## 📚 文档结构

```
.
├── START_HERE.md                     ⭐ 从这里开始
├── DEPLOYMENT_README.md              📖 本文件
├── quick-deploy.sh                   🚀 一键部署脚本 (Linux/Mac)
├── quick-deploy.bat                  🚀 一键部署脚本 (Windows)
├── deploy.sh                         🚀 标准部署脚本 (Linux/Mac)
├── deploy.bat                        🚀 标准部署脚本 (Windows)
└── financial-toolbox/
    ├── DEPLOY_TO_YOUR_SERVER.md      ⭐ 针对你服务器的部署指南
    ├── DEPLOYMENT_SUMMARY.md         📖 部署方案总结
    ├── DEPLOYMENT_INDEX.md           📑 文档索引
    ├── DEPLOYMENT.md                 📖 完整部署指南
    ├── QUICK_DEPLOY.md               ⚡ 快速部署参考
    ├── DEPLOYMENT_CHECKLIST.md       ✅ 部署检查清单
    ├── ARCHITECTURE.md               🏗️ 架构说明
    ├── PATH_UPDATE_NOTE.md           📝 路径更新说明
    ├── nginx.conf                    ⚙️ Nginx 配置模板（已配置域名）
    ├── server-setup.sh               🔧 服务器初始化脚本
    ├── verify-path.sh                🔍 配置验证脚本
    └── .env.production               🔐 生产环境配置
```

## 🎯 方案特点

✅ **完整文档** - 从零开始的详细指南  
✅ **自动化脚本** - 一键部署，省时省力  
✅ **安全配置** - HTTPS、防火墙、fail2ban  
✅ **性能优化** - Gzip、缓存、代码分割  
✅ **自动备份** - 定时备份，安全可靠  
✅ **故障排查** - 详细的问题解决方案  

## 💰 成本估算

- **服务器**: 60-100 元/月（1核2G ECS）
- **域名**: 50-100 元/年
- **SSL 证书**: 免费（Let's Encrypt）
- **总计**: 约 60-100 元/月

## 📖 推荐阅读顺序

### 快速开始（推荐）
1. 📖 [START_HERE.md](./START_HERE.md) - 快速开始指南
2. 🚀 运行 `quick-deploy.sh` 或 `quick-deploy.bat` - 一键部署
3. ✅ 访问 http://www.lovetest.asia 验证

### 详细了解
1. 📖 [DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md) - 针对你服务器的指南
2. 📖 [DEPLOYMENT_SUMMARY.md](./financial-toolbox/DEPLOYMENT_SUMMARY.md) - 了解整体方案
3. 📖 [DEPLOYMENT.md](./financial-toolbox/DEPLOYMENT.md) - 详细部署步骤
4. ✅ [DEPLOYMENT_CHECKLIST.md](./financial-toolbox/DEPLOYMENT_CHECKLIST.md) - 逐项检查
5. 🏗️ [ARCHITECTURE.md](./financial-toolbox/ARCHITECTURE.md) - 理解架构

## 🆘 需要帮助？

1. 查看 [START_HERE.md](./START_HERE.md) 快速开始
2. 查看 [DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md) 针对你服务器的指南
3. 查看 [DEPLOYMENT_INDEX.md](./financial-toolbox/DEPLOYMENT_INDEX.md) 找到相关文档
4. 查看 [DEPLOYMENT.md](./financial-toolbox/DEPLOYMENT.md) 的故障排查章节
5. 运行 `verify-path.sh` 检查配置
6. 提交 GitHub Issue

## 📞 快速命令

```bash
# 一键部署
./quick-deploy.sh

# 标准部署
./deploy.sh

# 连接服务器
ssh root@47.96.251.147

# 查看日志
ssh root@47.96.251.147 "tail -f /var/log/nginx/financial-toolbox-error.log"

# 验证配置
ssh root@47.96.251.147 "/root/verify-path.sh"
```

---

**开始部署**: 阅读 [START_HERE.md](./START_HERE.md) 或运行 `./quick-deploy.sh` 📖
