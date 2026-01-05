# 服务器端部署指南

## 📋 服务器信息

- **服务器 IP**: 47.96.251.147
- **系统版本**: Alibaba Cloud Linux 3.2104 U11
- **部署路径**: /www/program/金融工具箱/financial-calculation-tools
- **域名**: www.lovetest.asia

---

## 🚀 通过 Git 部署（推荐）

### 第一步：在服务器上安装必要软件

```bash
# 连接到服务器
ssh root@47.96.251.147

# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y

# 验证安装
node -v
npm -v

# 安装 Git（如果还没安装）
sudo dnf install git -y
```

### 第二步：克隆代码到服务器

```bash
# 在服务器上创建项目目录
mkdir -p /www/program/金融工具箱
cd /www/program/金融工具箱

# 克隆代码（替换为你的 Git 仓库地址）
git clone <your-git-repo-url> financial-calculation-tools

# 或者如果已经克隆，更新代码
cd financial-calculation-tools
git pull
```

### 第三步：首次部署 - 初始化服务器

```bash
# 进入项目目录
cd /www/program/金融工具箱/financial-calculation-tools

# 如果是首次部署，先运行服务器初始化脚本
chmod +x financial-toolbox/server-setup.sh
./financial-toolbox/server-setup.sh

# 配置 Nginx
cp financial-toolbox/nginx.conf /etc/nginx/conf.d/financial-toolbox.conf

# 测试并重启 Nginx
nginx -t
systemctl reload nginx
```

### 第四步：部署网站

```bash
# 进入项目的 financial-toolbox 目录
cd financial-toolbox

# 添加执行权限
chmod +x deploy-on-server.sh

# 运行部署脚本
./deploy-on-server.sh
```

---

## 🔄 日常更新流程

每次代码更新后：

```bash
# 1. 连接到服务器
ssh root@47.96.251.147

# 2. 进入项目目录
cd /www/program/金融工具箱/financial-calculation-tools

# 3. 拉取最新代码
git pull

# 4. 运行部署脚本
cd financial-toolbox
./deploy-on-server.sh
```

---

## 📝 deploy-on-server.sh 脚本功能

这个脚本会自动完成：

1. ✅ 检查 Node.js 和 npm
2. ✅ 安装/更新依赖
3. ✅ 构建项目
4. ✅ 备份旧版本
5. ✅ 复制文件到部署目录
6. ✅ 设置文件权限
7. ✅ 重新加载 Nginx
8. ✅ 清理旧备份

---

## 🔒 配置 HTTPS

部署完成后，配置 HTTPS：

```bash
# 在服务器上运行
certbot --nginx -d www.lovetest.asia -d lovetest.asia

# 按照提示操作：
# 1. 输入邮箱地址
# 2. 同意服务条款 (Y)
# 3. 选择是否重定向 HTTP 到 HTTPS (推荐选择 2)
```

---

## 📊 监控和维护

### 查看日志
```bash
# 访问日志
tail -f /var/log/nginx/financial-toolbox-access.log

# 错误日志
tail -f /var/log/nginx/financial-toolbox-error.log
```

### 查看服务状态
```bash
# Nginx 状态
systemctl status nginx

# 查看部署的文件
ls -la /www/program/金融工具箱/financial-calculation-tools/
```

### 手动备份
```bash
# 备份当前版本
cp -r /www/program/金融工具箱/financial-calculation-tools \
     /www/program/金融工具箱/financial-calculation-tools.backup.$(date +%Y%m%d_%H%M%S)
```

### 恢复备份
```bash
# 查看可用备份
ls -la /www/program/金融工具箱/ | grep backup

# 恢复备份（替换日期时间）
rm -rf /www/program/金融工具箱/financial-calculation-tools/*
cp -r /www/program/金融工具箱/financial-calculation-tools.backup.YYYYMMDD_HHMMSS/* \
     /www/program/金融工具箱/financial-calculation-tools/

# 重新加载 Nginx
systemctl reload nginx
```

---

## 🆘 故障排查

### 问题 1：Node.js 未安装
```bash
# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y
```

### 问题 2：npm install 失败
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3：构建失败
```bash
# 检查 Node.js 版本（需要 >= 18.0.0）
node -v

# 查看详细错误
npm run build
```

### 问题 4：权限问题
```bash
# 手动设置权限
sudo chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
sudo chmod -R 755 /www/program/金融工具箱/financial-calculation-tools
```

### 问题 5：Nginx 配置错误
```bash
# 测试配置
nginx -t

# 查看配置文件
cat /etc/nginx/conf.d/financial-toolbox.conf

# 重新复制配置
cp financial-toolbox/nginx.conf /etc/nginx/conf.d/financial-toolbox.conf
nginx -t
systemctl reload nginx
```

---

## 📁 目录结构

```
/www/program/金融工具箱/
├── financial-calculation-tools/          # Git 仓库（代码目录）
│   ├── financial-toolbox/                # 项目源码
│   │   ├── src/                          # 源代码
│   │   ├── dist/                         # 构建产物
│   │   ├── deploy-on-server.sh           # 服务器端部署脚本
│   │   ├── server-setup.sh               # 服务器初始化脚本
│   │   └── nginx.conf                    # Nginx 配置
│   └── ...
├── financial-calculation-tools.backup.*  # 自动备份
└── ...
```

**注意**：部署路径和 Git 仓库路径是同一个！

---

## ✅ 完整部署流程示例

```bash
# 1. 连接服务器
ssh root@47.96.251.147

# 2. 首次部署 - 克隆代码
cd /www/program/金融工具箱
git clone <your-git-repo-url> financial-calculation-tools
cd financial-calculation-tools

# 3. 首次部署 - 初始化服务器
chmod +x financial-toolbox/server-setup.sh
./financial-toolbox/server-setup.sh

# 4. 首次部署 - 配置 Nginx
cp financial-toolbox/nginx.conf /etc/nginx/conf.d/financial-toolbox.conf
nginx -t
systemctl reload nginx

# 5. 部署网站
cd financial-toolbox
chmod +x deploy-on-server.sh
./deploy-on-server.sh

# 6. 配置 HTTPS
certbot --nginx -d www.lovetest.asia -d lovetest.asia

# 7. 访问网站
# http://www.lovetest.asia
# https://www.lovetest.asia
```

---

## 🎉 优势

使用 Git + 服务器端构建的优势：

1. ✅ **无需本地构建** - 直接在服务器上构建
2. ✅ **无需上传文件** - Git 自动同步代码
3. ✅ **版本控制** - 可以随时回滚到任何版本
4. ✅ **更快速** - 避免网络传输大文件
5. ✅ **更可靠** - 不受本地网络影响
6. ✅ **自动备份** - 每次部署自动备份旧版本

---

## 📞 需要帮助？

如有问题，请查看：
- 错误日志：`/var/log/nginx/financial-toolbox-error.log`
- 系统日志：`journalctl -xe`
- Nginx 状态：`systemctl status nginx`

---

**祝部署顺利！** 🚀
