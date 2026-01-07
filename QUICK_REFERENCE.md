# 快速参考卡片

## 🎯 服务器信息

```
IP: 47.96.251.147
域名: www.lovetest.asia
系统: Alibaba Cloud Linux 3.2104 U11
路径: /www/program/金融工具箱/financial-calculation-tools
```

---

## 🚀 Git 部署（推荐）

### 首次部署
```bash
ssh root@47.96.251.147
cd /www/program/金融工具箱
git clone <your-repo> financial-calculation-tools
cd financial-calculation-tools/financial-toolbox
chmod +x deploy-on-server.sh
./deploy-on-server.sh
```

### 日常更新
```bash
ssh root@47.96.251.147
cd /www/program/金融工具箱/financial-calculation-tools
git pull
cd financial-toolbox
./deploy-on-server.sh
```

---

## 📖 详细文档

- **[SERVER_DEPLOY_GUIDE.md](./SERVER_DEPLOY_GUIDE.md)** - Git 部署指南 ⭐
- **[MEMORY_FIX.md](./MEMORY_FIX.md)** - 解决内存不足问题 🔥
- **[START_HERE.md](./START_HERE.md)** - 快速开始
- **[DEPLOY_TO_YOUR_SERVER.md](./financial-toolbox/DEPLOY_TO_YOUR_SERVER.md)** - 详细指南

---

## 🔧 常用命令

```bash
# 连接服务器
ssh root@47.96.251.147

# 查看日志
tail -f /var/log/nginx/financial-toolbox-access.log
tail -f /var/log/nginx/financial-toolbox-error.log

# 重启 Nginx
systemctl reload nginx

# 查看 Nginx 状态
systemctl status nginx

# 测试 Nginx 配置
nginx -t

# 配置 HTTPS
certbot --nginx -d www.lovetest.asia -d lovetest.asia
```

---

## 🆘 快速故障排查

### 构建失败（内存不足）
```bash
# 如果看到 "Killed" 错误，运行：
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox
chmod +x add-swap.sh
sudo ./add-swap.sh
# 输入 4 或 6 (GB)，然后重新部署
./deploy-simple.sh
```

### 其他问题
```bash
# 检查文件是否存在
ls -la /www/program/金融工具箱/financial-calculation-tools/

# 检查权限
ls -la /www/program/金融工具箱/financial-calculation-tools/index.html

# 手动设置权限
chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
chmod -R 755 /www/program/金融工具箱/financial-calculation-tools

# 查看 Nginx 错误
tail -20 /var/log/nginx/financial-toolbox-error.log

# 查看内存状态
free -h
```

---

## 📞 访问地址

- HTTP: http://47.96.251.147
- HTTP: http://www.lovetest.asia
- HTTPS: https://www.lovetest.asia (配置后)
