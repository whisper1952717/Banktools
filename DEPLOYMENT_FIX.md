# 部署问题解决方案

## 🔴 当前问题

### 问题 1：域名显示旧网站
- **现象**：`www.lovetest.asia` 显示的是旧网站，不是金融工具箱
- **原因**：宝塔面板的 Nginx 配置指向了旧网站目录
- **IP 访问正常**：`47.96.251.147` 可以正常访问金融工具箱

### 问题 2：构建内存不足
- **现象**：`npm run build` 被 Killed
- **原因**：服务器内存不足，构建过程需要较多内存

---

## ✅ 解决方案

### 方案 A：修复域名访问（推荐先做）

#### 步骤 1：查找宝塔 Nginx 配置文件

```bash
# 在服务器上运行
find /www/server -name "*.conf" -exec grep -l "lovetest.asia" {} \;
```

这会找到包含 `lovetest.asia` 的配置文件，通常在：
- `/www/server/panel/vhost/nginx/lovetest.asia.conf`
- `/www/server/nginx/conf/vhost/lovetest.asia.conf`

#### 步骤 2：修改配置文件

找到配置文件后，修改 `root` 路径：

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name www.lovetest.asia lovetest.asia;
    
    # 修改这一行，指向金融工具箱
    root /www/program/金融工具箱/financial-calculation-tools;
    
    index index.html;
    
    # SSL 配置（如果有）
    # ssl_certificate ...
    # ssl_certificate_key ...
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 步骤 3：测试并重启 Nginx

```bash
# 测试配置
nginx -t

# 重启 Nginx
systemctl reload nginx
```

#### 步骤 4：或者使用宝塔面板修改

1. 登录宝塔面板：`http://47.96.251.147:8888`
2. 进入"网站"管理
3. 找到 `lovetest.asia` 网站
4. 点击"设置" → "网站目录"
5. 修改为：`/www/program/金融工具箱/financial-calculation-tools`
6. 保存并重启 Nginx

---

### 方案 B：解决构建内存问题

#### 选项 1：增加 Swap 空间（推荐）

在服务器上运行以下命令：

```bash
# 创建 2GB swap 文件
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048

# 设置权限
sudo chmod 600 /swapfile

# 创建 swap
sudo mkswap /swapfile

# 启用 swap
sudo swapon /swapfile

# 验证
free -h

# 永久启用（添加到 /etc/fstab）
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

然后重新运行部署：
```bash
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox
./deploy-simple.sh
```

#### 选项 2：在本地构建，上传构建产物

如果服务器内存实在不够，可以在本地构建：

```bash
# 在本地运行
cd financial-toolbox
npm install
npm run build

# 将 dist 目录上传到服务器
scp -r dist root@47.96.251.147:/tmp/financial-toolbox-dist

# 在服务器上运行
ssh root@47.96.251.147
cd /www/program/金融工具箱/financial-calculation-tools
rm -rf assets index.html robots.txt vite.svg _redirects
cp -r /tmp/financial-toolbox-dist/* .
chown -R nginx:nginx .
chmod -R 755 .
systemctl reload nginx
```

#### 选项 3：限制 Node.js 内存使用

修改 `deploy-simple.sh`，在构建命令前添加内存限制：

```bash
# 限制为 512MB
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

---

## 🎯 推荐操作顺序

### 第一步：修复域名访问

```bash
# 1. 查找配置文件
find /www/server -name "*.conf" -exec grep -l "lovetest.asia" {} \;

# 2. 编辑配置文件（替换为实际路径）
vi /www/server/panel/vhost/nginx/lovetest.asia.conf

# 3. 修改 root 路径为：
#    root /www/program/金融工具箱/financial-calculation-tools;

# 4. 测试并重启
nginx -t
systemctl reload nginx

# 5. 测试访问
curl -I http://www.lovetest.asia
```

### 第二步：解决内存问题

```bash
# 增加 swap（推荐）
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 验证
free -h
```

### 第三步：重新部署

```bash
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox
./deploy-simple.sh
```

---

## 📋 验证清单

部署完成后，检查：

- [ ] `http://47.96.251.147` 可以访问金融工具箱
- [ ] `http://www.lovetest.asia` 可以访问金融工具箱
- [ ] `https://www.lovetest.asia` 可以访问（如果配置了 SSL）
- [ ] 页面显示正确，没有 404 错误
- [ ] 所有功能正常工作

---

## 🆘 如果还有问题

### 查看 Nginx 配置

```bash
# 查看所有虚拟主机配置
ls -la /www/server/panel/vhost/nginx/

# 查看主配置
cat /www/server/nginx/conf/nginx.conf | grep include
```

### 查看 Nginx 日志

```bash
# 错误日志
tail -f /www/wwwlogs/lovetest.asia.error.log

# 访问日志
tail -f /www/wwwlogs/lovetest.asia.log
```

### 检查文件权限

```bash
ls -la /www/program/金融工具箱/financial-calculation-tools/
```

---

## 💡 提示

1. **宝塔面板**：如果不熟悉命令行，建议使用宝塔面板的图形界面修改
2. **备份配置**：修改 Nginx 配置前，先备份原文件
3. **测试配置**：每次修改后都要运行 `nginx -t` 测试
4. **查看日志**：遇到问题先查看 Nginx 错误日志

---

**需要我帮你执行哪个步骤？**
