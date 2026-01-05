# 部署到你的服务器

## 🎯 服务器信息

- **服务器 IP**: 47.96.251.147
- **域名**: www.lovetest.asia (lovetest.asia)
- **部署路径**: /www/program/金融工具箱/financial-calculation-tools
- **操作系统**: Alibaba Cloud Linux 3

---

## 🚀 快速部署（三步完成）

### 第一步：初始化服务器（首次部署）

```bash
# 1. 上传服务器配置脚本
scp financial-toolbox/server-setup.sh root@47.96.251.147:/root/

# 2. 连接到服务器并运行配置脚本
ssh root@47.96.251.147
chmod +x /root/server-setup.sh
/root/server-setup.sh

# 等待脚本执行完成（约5-10分钟）
```

**脚本会自动完成：**
- ✅ 安装 Nginx
- ✅ 配置防火墙
- ✅ 创建部署目录
- ✅ 安装 SSL 证书工具
- ✅ 配置自动备份

---

### 第二步：配置域名和 Nginx

```bash
# 1. 上传 Nginx 配置文件
scp financial-toolbox/nginx.conf root@47.96.251.147:/etc/nginx/conf.d/financial-toolbox.conf

# 2. 测试 Nginx 配置
ssh root@47.96.251.147 "nginx -t"

# 3. 重新加载 Nginx
ssh root@47.96.251.147 "systemctl reload nginx"
```

---

### 第三步：部署网站

```bash
# 在本地项目根目录执行
./deploy.sh
```

**部署脚本会自动：**
- ✅ 运行测试
- ✅ 构建项目
- ✅ 备份旧版本
- ✅ 上传文件到服务器
- ✅ 设置权限
- ✅ 重启 Nginx

---

## 🔒 配置 HTTPS（推荐）

部署完成后，配置 HTTPS：

```bash
# 连接到服务器
ssh root@47.96.251.147

# 运行 Certbot 配置 HTTPS
certbot --nginx -d www.lovetest.asia -d lovetest.asia

# 按照提示操作：
# 1. 输入邮箱地址
# 2. 同意服务条款 (Y)
# 3. 选择是否重定向 HTTP 到 HTTPS (推荐选择 2)
```

**HTTPS 配置完成后：**
- ✅ 自动获取免费 SSL 证书
- ✅ 自动配置 Nginx HTTPS
- ✅ 自动设置证书续期

---

## ✅ 验证部署

### 1. 检查服务器配置
```bash
# 上传验证脚本
scp financial-toolbox/verify-path.sh root@47.96.251.147:/root/

# 运行验证
ssh root@47.96.251.147
chmod +x /root/verify-path.sh
/root/verify-path.sh
```

### 2. 访问网站
- HTTP: http://47.96.251.147 或 http://www.lovetest.asia
- HTTPS (配置后): https://www.lovetest.asia

### 3. 测试功能
- ✅ 首页加载
- ✅ 复利计算器
- ✅ IRR 计算器
- ✅ 资产体检
- ✅ 前端路由（刷新页面不 404）

---

## 📋 DNS 配置检查

确保你的域名 DNS 已正确配置：

```
类型: A
主机记录: @
记录值: 47.96.251.147
TTL: 600

类型: A
主机记录: www
记录值: 47.96.251.147
TTL: 600
```

**检查 DNS 是否生效：**
```bash
# 在本地执行
nslookup www.lovetest.asia
nslookup lovetest.asia

# 应该返回 47.96.251.147
```

---

## 🔄 日常更新流程

代码更新后，只需运行：

```bash
./deploy.sh
```

或者 Windows 用户：
```cmd
deploy.bat
```

---

## 📊 监控和维护

### 查看访问日志
```bash
ssh root@47.96.251.147
tail -f /var/log/nginx/financial-toolbox-access.log
```

### 查看错误日志
```bash
ssh root@47.96.251.147
tail -f /var/log/nginx/financial-toolbox-error.log
```

### 查看 Nginx 状态
```bash
ssh root@47.96.251.147
systemctl status nginx
```

### 手动备份
```bash
ssh root@47.96.251.147
/root/backup-website.sh
```

---

## 🆘 常见问题

### Q1: 无法连接到服务器
```bash
# 检查 SSH 连接
ssh root@47.96.251.147

# 如果无法连接，检查：
# 1. 服务器是否运行
# 2. 安全组是否开放 22 端口
# 3. SSH 密钥是否正确
```

### Q2: 网站无法访问
```bash
# 检查 Nginx 状态
ssh root@47.96.251.147 "systemctl status nginx"

# 检查防火墙
ssh root@47.96.251.147 "firewall-cmd --list-all"

# 检查文件是否存在
ssh root@47.96.251.147 "ls -la /www/program/金融工具箱/financial-calculation-tools/"
```

### Q3: 域名无法访问
```bash
# 检查 DNS 解析
nslookup www.lovetest.asia

# 检查 Nginx 配置
ssh root@47.96.251.147 "grep server_name /etc/nginx/conf.d/financial-toolbox.conf"
```

### Q4: HTTPS 证书问题
```bash
# 检查证书状态
ssh root@47.96.251.147 "certbot certificates"

# 手动续期
ssh root@47.96.251.147 "certbot renew"
```

---

## 📞 快速命令参考

```bash
# 连接服务器
ssh root@47.96.251.147

# 部署网站
./deploy.sh

# 重启 Nginx
ssh root@47.96.251.147 "systemctl restart nginx"

# 查看日志
ssh root@47.96.251.147 "tail -f /var/log/nginx/financial-toolbox-error.log"

# 验证配置
ssh root@47.96.251.147 "/root/verify-path.sh"
```

---

## 🎉 部署完成后

访问你的网站：
- 🌐 http://www.lovetest.asia
- 🔒 https://www.lovetest.asia (配置 HTTPS 后)

---

**祝部署顺利！** 🚀

如有问题，请参考：
- [完整部署指南](./DEPLOYMENT.md)
- [故障排查清单](./DEPLOYMENT_CHECKLIST.md)
- [路径更新说明](./PATH_UPDATE_NOTE.md)
