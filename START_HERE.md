# 🚀 从这里开始部署

## 📋 服务器信息

- **服务器 IP**: 47.96.251.147
- **域名**: www.lovetest.asia (lovetest.asia)
- **部署路径**: /www/program/金融工具箱/financial-calculation-tools
- **操作系统**: Alibaba Cloud Linux 3

---

## ⚡ 最快部署方式（推荐）

### 方式一：通过 Git 在服务器上部署 ⭐ 最推荐

这是最简单、最可靠的方式！

**优势：**
- ✅ 无需本地构建
- ✅ 无需上传文件
- ✅ 版本控制
- ✅ 更快速可靠

**步骤：**
1. 将代码推送到 Git 仓库
2. 在服务器上克隆代码
3. 运行服务器端部署脚本

👉 **详细指南：[SERVER_DEPLOY_GUIDE.md](./SERVER_DEPLOY_GUIDE.md)** ⭐ 强烈推荐

### 方式二：一键部署脚本（本地构建）

```bash
# Linux/Mac 用户
chmod +x quick-deploy.sh
./quick-deploy.sh
```

```cmd
# Windows 用户
quick-deploy.bat
```

**这个脚本会自动完成所有步骤！**

---

## 📖 详细部署步骤

如果你想了解每一步的详细过程，请查看：

### 🎯 针对你服务器的快速指南
👉 **[DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md)** ⭐ 推荐阅读

这个文档包含：
- ✅ 三步部署流程
- ✅ HTTPS 配置
- ✅ DNS 配置检查
- ✅ 常见问题解答
- ✅ 快速命令参考

### 📚 完整文档
- [DEPLOYMENT_SUMMARY.md](./financial-toolbox/DEPLOYMENT_SUMMARY.md) - 部署方案总结
- [DEPLOYMENT.md](./financial-toolbox/DEPLOYMENT.md) - 完整部署指南
- [DEPLOYMENT_INDEX.md](./financial-toolbox/DEPLOYMENT_INDEX.md) - 文档索引

---

## ✅ 部署前检查清单

- [ ] 确保可以 SSH 连接到服务器：`ssh root@47.96.251.147`
- [ ] 确保本地已安装 Node.js (>= 18.0.0)
- [ ] 确保本地已安装 npm (>= 9.0.0)
- [ ] 确保域名 DNS 已配置指向服务器 IP
- [ ] 确保阿里云安全组已开放 80 和 443 端口

---

## 🎯 快速部署流程

### 第一步：测试 SSH 连接
```bash
ssh root@47.96.251.147
# 如果能连接成功，输入 exit 退出
```

### 第二步：运行一键部署
```bash
# Linux/Mac
./quick-deploy.sh

# Windows
quick-deploy.bat
```

### 第三步：配置 HTTPS（可选但推荐）
```bash
ssh root@47.96.251.147
certbot --nginx -d www.lovetest.asia -d lovetest.asia
```

### 第四步：访问网站
- HTTP: http://www.lovetest.asia
- HTTPS: https://www.lovetest.asia (配置后)

---

## 🔄 日常更新

代码更新后，只需运行：

```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

---

## 📊 验证部署

### 1. 检查服务器配置
```bash
scp financial-toolbox/verify-path.sh root@47.96.251.147:/root/
ssh root@47.96.251.147
chmod +x /root/verify-path.sh
/root/verify-path.sh
```

### 2. 访问网站测试
- ✅ 首页加载
- ✅ 复利计算器功能
- ✅ IRR 计算器功能
- ✅ 资产体检功能
- ✅ 前端路由（刷新页面不 404）

### 3. 检查日志
```bash
ssh root@47.96.251.147
tail -f /var/log/nginx/financial-toolbox-access.log
```

---

## 🆘 遇到问题？

### 常见问题快速解决

#### 1. 无法连接服务器
```bash
# 检查 SSH 连接
ssh root@47.96.251.147

# 如果无法连接：
# - 检查服务器是否运行
# - 检查安全组是否开放 22 端口
# - 检查 SSH 密钥是否正确
```

#### 2. 网站无法访问
```bash
# 检查 Nginx 状态
ssh root@47.96.251.147 "systemctl status nginx"

# 检查文件是否存在
ssh root@47.96.251.147 "ls -la /www/program/金融工具箱/financial-calculation-tools/"
```

#### 3. 域名无法访问
```bash
# 检查 DNS 解析
nslookup www.lovetest.asia
# 应该返回 47.96.251.147
```

### 详细故障排查
查看 [DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md) 的"常见问题"章节

---

## 📁 项目文件说明

### 🚀 部署脚本
- `quick-deploy.sh` / `quick-deploy.bat` - 一键部署脚本 ⭐ 推荐使用
- `deploy.sh` / `deploy.bat` - 标准部署脚本
- `financial-toolbox/server-setup.sh` - 服务器初始化脚本
- `financial-toolbox/verify-path.sh` - 配置验证脚本

### 📖 文档
- `START_HERE.md` - 本文件
- `financial-toolbox/DEPLOY_TO_YOUR_SERVER.md` - 针对你服务器的部署指南 ⭐
- `financial-toolbox/DEPLOYMENT_SUMMARY.md` - 部署方案总结
- `financial-toolbox/DEPLOYMENT.md` - 完整部署指南
- `financial-toolbox/DEPLOYMENT_INDEX.md` - 文档索引
- `financial-toolbox/PATH_UPDATE_NOTE.md` - 路径更新说明

### ⚙️ 配置文件
- `financial-toolbox/nginx.conf` - Nginx 配置（已配置域名）
- `financial-toolbox/.env.production` - 生产环境配置

---

## 💡 提示

### 首次部署
1. 使用 `quick-deploy.sh` 或 `quick-deploy.bat` 一键部署
2. 等待脚本完成（约 10-15 分钟）
3. 配置 HTTPS
4. 访问网站验证

### 日常更新
1. 修改代码
2. 运行 `./deploy.sh` 或 `deploy.bat`
3. 等待部署完成（约 3-5 分钟）
4. 访问网站验证

### 监控维护
- 定期查看日志
- 定期检查备份
- 定期更新系统

---

## 📞 获取帮助

1. 查看 [DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md)
2. 查看 [DEPLOYMENT.md](./financial-toolbox/DEPLOYMENT.md) 的故障排查章节
3. 运行 `verify-path.sh` 检查配置
4. 查看服务器日志

---

## 🎉 准备好了吗？

### 开始部署：

```bash
# Linux/Mac
chmod +x quick-deploy.sh
./quick-deploy.sh

# Windows
quick-deploy.bat
```

---

**祝部署顺利！** 🚀

如有问题，请参考 [DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md)
