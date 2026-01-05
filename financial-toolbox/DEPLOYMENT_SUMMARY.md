# 阿里云 ECS 部署方案总结

## 📦 已创建的文件

### 1. 部署文档
- **DEPLOYMENT.md** - 完整的部署指南，包含详细步骤和配置说明
- **QUICK_DEPLOY.md** - 快速部署参考，适合日常使用
- **DEPLOYMENT_CHECKLIST.md** - 部署检查清单，确保不遗漏任何步骤

### 2. 配置文件
- **nginx.conf** - Nginx 配置文件模板
- **.env.production** - 生产环境配置文件

### 3. 自动化脚本
- **deploy.sh** - Linux/Mac 自动部署脚本
- **deploy.bat** - Windows 自动部署脚本
- **server-setup.sh** - 服务器初始化脚本

### 4. 其他文件
- **public/robots.txt** - SEO 优化文件
- **README.md** - 已更新，添加阿里云部署说明

---

## 🚀 快速开始

### 方案概述
- **服务器**: 阿里云 ECS
- **操作系统**: Alibaba Cloud Linux 3
- **Web 服务器**: Nginx
- **部署方式**: 静态文件部署
- **HTTPS**: Let's Encrypt（免费）

### 三步部署

#### 第一步：服务器配置（首次）
```bash
# 上传并运行服务器配置脚本
scp financial-toolbox/server-setup.sh root@your-server-ip:/root/
ssh root@your-server-ip "chmod +x /root/server-setup.sh && /root/server-setup.sh"
```

#### 第二步：配置部署脚本（首次）
```bash
# 编辑 deploy.sh，修改服务器 IP
vi deploy.sh
# 将 SERVER_IP="your-server-ip" 改为实际 IP

# 添加执行权限
chmod +x deploy.sh
```

#### 第三步：执行部署
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

---

## 📋 部署流程详解

### 服务器端（首次配置）

**server-setup.sh 脚本会自动完成：**
1. ✅ 更新系统软件包
2. ✅ 安装 Nginx
3. ✅ 配置防火墙（开放 80 和 443 端口）
4. ✅ 创建部署目录 `/www/program/金融工具箱/financial-calculation-tools`
5. ✅ 安装 Certbot（用于 HTTPS）
6. ✅ 优化系统参数
7. ✅ 配置 Nginx（支持前端路由）
8. ✅ 安装 fail2ban（防止暴力破解）
9. ✅ 创建自动备份脚本
10. ✅ 配置定时备份任务

### 本地端（每次部署）

**deploy.sh 脚本会自动完成：**
1. ✅ 运行测试
2. ✅ 构建项目
3. ✅ 备份服务器旧版本
4. ✅ 上传文件到服务器
5. ✅ 设置文件权限
6. ✅ 测试 Nginx 配置
7. ✅ 重新加载 Nginx
8. ✅ 清理旧备份

---

## 🔧 配置说明

### Nginx 配置特性
- ✅ 支持前端路由（React Router）
- ✅ 静态资源缓存（1年）
- ✅ Gzip 压缩
- ✅ 安全头部配置
- ✅ 访问日志和错误日志
- ✅ 禁止访问隐藏文件

### 性能优化
- ✅ 代码分割（React、Ant Design、ECharts 分别打包）
- ✅ 静态资源长期缓存
- ✅ Gzip 压缩
- ✅ HTTP/2 支持（HTTPS 配置后）
- ✅ 系统参数优化

### 安全措施
- ✅ HTTPS 支持（Let's Encrypt）
- ✅ 安全头部（X-Frame-Options、X-XSS-Protection 等）
- ✅ 防火墙配置
- ✅ fail2ban 防暴力破解
- ✅ 自动备份

---

## 📊 成本估算

### 服务器成本
- **1核2G ECS**: 约 60-100 元/月
- **2核4G ECS**: 约 120-200 元/月
- **带宽**: 按实际使用计费或固定带宽

### 其他成本
- **域名**: 约 50-100 元/年
- **ICP 备案**: 免费（但需要时间）
- **SSL 证书**: 免费（Let's Encrypt）

### 总成本
- **最低配置**: 约 60-100 元/月 + 域名费用
- **推荐配置**: 约 120-200 元/月 + 域名费用

---

## 🎯 优势对比

### vs Vercel/Netlify
| 特性 | 阿里云 ECS | Vercel/Netlify |
|------|-----------|----------------|
| 国内访问速度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 成本 | 固定成本 | 免费/按量 |
| 控制权 | 完全控制 | 受限 |
| 配置灵活性 | 高 | 低 |
| 维护成本 | 需要维护 | 无需维护 |
| ICP 备案 | 需要 | 不需要 |

### 适用场景
- ✅ 主要面向国内用户
- ✅ 需要完全控制服务器
- ✅ 未来可能添加后端服务
- ✅ 需要自定义配置
- ✅ 有一定的运维能力

---

## 📝 常见问题

### Q1: 首次部署需要多长时间？
**A**: 约 30-60 分钟，包括服务器配置、域名配置和 HTTPS 配置。

### Q2: 日常部署需要多长时间？
**A**: 约 3-5 分钟，使用自动部署脚本。

### Q3: 需要什么技术背景？
**A**: 基本的 Linux 命令行操作和 SSH 使用经验。

### Q4: 如果部署失败怎么办？
**A**: 
1. 查看错误日志：`/var/log/nginx/financial-toolbox-error.log`
2. 检查 Nginx 配置：`nginx -t`
3. 恢复备份：脚本会自动备份旧版本
4. 参考 DEPLOYMENT.md 中的故障排查章节

### Q5: 如何更新网站？
**A**: 修改代码后，直接运行 `./deploy.sh` 即可。

### Q6: 如何配置 HTTPS？
**A**: 运行 `certbot --nginx -d your-domain.com`，证书会自动续期。

### Q7: 如何备份网站？
**A**: 
- 自动备份：每天凌晨 2 点自动执行
- 手动备份：运行 `/root/backup-website.sh`
- 部署时备份：每次部署前自动备份

### Q8: 如何恢复备份？
**A**: 
```bash
# 查看备份列表
ls -lh /root/backups/

# 恢复备份
tar -xzf /root/backups/financial-toolbox-YYYYMMDD_HHMMSS.tar.gz -C /
systemctl reload nginx
```

---

## 🔗 相关文档

- [完整部署指南](./DEPLOYMENT.md)
- [快速部署参考](./QUICK_DEPLOY.md)
- [部署检查清单](./DEPLOYMENT_CHECKLIST.md)
- [项目 README](./README.md)

---

## 📞 技术支持

如遇到问题，请按以下顺序排查：

1. **查看错误日志**
   ```bash
   tail -f /var/log/nginx/financial-toolbox-error.log
   ```

2. **检查 Nginx 状态**
   ```bash
   systemctl status nginx
   nginx -t
   ```

3. **查看系统日志**
   ```bash
   journalctl -xe
   ```

4. **参考文档**
   - DEPLOYMENT.md 的故障排查章节
   - DEPLOYMENT_CHECKLIST.md 的故障排查清单

5. **寻求帮助**
   - 提交 GitHub Issue
   - 查看阿里云文档
   - 联系技术支持

---

## ✅ 下一步

1. **阅读完整文档**: [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **准备服务器**: 购买 ECS 实例，配置安全组
3. **执行部署**: 按照快速开始步骤操作
4. **验证部署**: 使用检查清单验证
5. **配置监控**: 设置日志监控和告警

---

**祝部署顺利！** 🎉
