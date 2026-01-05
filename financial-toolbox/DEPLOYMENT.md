# 阿里云 ECS 部署指南

## 系统环境
- 操作系统：Alibaba Cloud Linux 3
- Web 服务器：Nginx
- Node.js：v18+ (仅用于构建)

## 部署步骤

### 一、服务器准备

#### 1.1 连接到 ECS 实例
```bash
ssh root@your-server-ip
```

#### 1.2 更新系统
```bash
dnf update -y
```

#### 1.3 安装 Nginx
```bash
# 安装 Nginx
dnf install nginx -y

# 启动 Nginx 并设置开机自启
systemctl start nginx
systemctl enable nginx

# 检查 Nginx 状态
systemctl status nginx
```

#### 1.4 配置防火墙
```bash
# 开放 HTTP 和 HTTPS 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 或者如果使用阿里云安全组，在控制台添加规则：
# - 入方向：TCP 80 端口
# - 入方向：TCP 443 端口
```

#### 1.5 创建部署目录
```bash
# 创建网站根目录
mkdir -p /www/program/金融工具箱/financial-calculation-tools

# 设置权限
chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
chmod -R 755 /www/program/金融工具箱/financial-calculation-tools
```

---

### 二、本地构建项目

在你的本地开发机器上执行：

```bash
# 进入项目目录
cd financial-toolbox

# 安装依赖（如果还没安装）
npm install

# 运行测试（可选）
npm run test:run

# 构建生产版本
npm run build
```

构建完成后，`dist` 目录包含所有需要部署的文件。

---

### 三、上传文件到服务器

#### 方法 1：使用 SCP（推荐）
```bash
# 在本地项目目录执行
scp -r dist/* root@your-server-ip:/www/program/金融工具箱/financial-calculation-tools/
```

#### 方法 2：使用 SFTP
```bash
sftp root@your-server-ip
put -r dist/* /www/program/金融工具箱/financial-calculation-tools/
```

#### 方法 3：使用 rsync（增量同步）
```bash
rsync -avz --delete dist/ root@your-server-ip:/www/program/金融工具箱/financial-calculation-tools/
```

---

### 四、配置 Nginx

#### 4.1 创建 Nginx 配置文件
```bash
# 在服务器上执行
vi /etc/nginx/conf.d/financial-toolbox.conf
```

复制以下内容（配置文件内容见下方）：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # 网站根目录
    root /www/program/金融工具箱/financial-calculation-tools;
    index index.html;
    
    # 访问日志
    access_log /var/log/nginx/financial-toolbox-access.log;
    error_log /var/log/nginx/financial-toolbox-error.log;
    
    # 支持前端路由（React Router）
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存优化
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml
        application/xml+rss
        image/svg+xml;
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

#### 4.2 测试并重启 Nginx
```bash
# 测试配置文件语法
nginx -t

# 如果测试通过，重启 Nginx
systemctl restart nginx

# 检查 Nginx 状态
systemctl status nginx
```

---

### 五、配置 HTTPS（使用 Let's Encrypt）

#### 5.1 安装 Certbot
```bash
# 安装 EPEL 仓库
dnf install epel-release -y

# 安装 Certbot
dnf install certbot python3-certbot-nginx -y
```

#### 5.2 获取 SSL 证书
```bash
# 自动配置 HTTPS
certbot --nginx -d your-domain.com -d www.your-domain.com

# 按照提示输入邮箱地址
# 选择是否重定向 HTTP 到 HTTPS（推荐选择 2）
```

#### 5.3 设置自动续期
```bash
# 测试自动续期
certbot renew --dry-run

# Certbot 会自动添加 cron 任务，无需手动配置
```

---

### 六、自动化部署脚本

#### 6.1 在本地创建部署脚本

创建 `deploy.sh` 文件：

```bash
#!/bin/bash

# 配置变量
SERVER_IP="your-server-ip"
SERVER_USER="root"
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"
PROJECT_DIR="financial-toolbox"

echo "=========================================="
echo "开始部署金融工具箱到阿里云 ECS"
echo "=========================================="

# 进入项目目录
cd $PROJECT_DIR

# 运行测试
echo "运行测试..."
npm run test:run
if [ $? -ne 0 ]; then
    echo "❌ 测试失败，部署终止"
    exit 1
fi
echo "✅ 测试通过"

# 构建项目
echo "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，部署终止"
    exit 1
fi
echo "✅ 构建完成"

# 备份服务器上的旧版本
echo "备份服务器上的旧版本..."
ssh $SERVER_USER@$SERVER_IP "
    if [ -d $DEPLOY_PATH ]; then
        cp -r $DEPLOY_PATH $DEPLOY_PATH.backup.\$(date +%Y%m%d_%H%M%S)
        echo '✅ 备份完成'
    fi
"

# 上传文件到服务器
echo "上传文件到服务器..."
rsync -avz --delete dist/ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
if [ $? -ne 0 ]; then
    echo "❌ 上传失败"
    exit 1
fi
echo "✅ 上传完成"

# 设置文件权限
echo "设置文件权限..."
ssh $SERVER_USER@$SERVER_IP "
    chown -R nginx:nginx $DEPLOY_PATH
    chmod -R 755 $DEPLOY_PATH
    echo '✅ 权限设置完成'
"

# 重启 Nginx
echo "重启 Nginx..."
ssh $SERVER_USER@$SERVER_IP "
    nginx -t && systemctl reload nginx
    echo '✅ Nginx 重启完成'
"

echo "=========================================="
echo "✅ 部署成功！"
echo "=========================================="
```

#### 6.2 使用部署脚本
```bash
# 添加执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

---

### 七、域名配置

#### 7.1 在域名服务商处添加 DNS 解析
```
类型: A
主机记录: @
记录值: your-server-ip
TTL: 600

类型: A
主机记录: www
记录值: your-server-ip
TTL: 600
```

#### 7.2 等待 DNS 生效
通常需要 10 分钟到 24 小时，可以使用以下命令检查：
```bash
nslookup your-domain.com
```

---

### 八、性能优化（可选）

#### 8.1 启用 HTTP/2
编辑 Nginx 配置文件，将 `listen 443 ssl;` 改为：
```nginx
listen 443 ssl http2;
listen [::]:443 ssl http2;
```

#### 8.2 配置 Nginx 缓存
```nginx
# 在 http 块中添加
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

#### 8.3 优化系统参数
```bash
# 编辑 /etc/sysctl.conf
vi /etc/sysctl.conf

# 添加以下内容
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_tw_reuse = 1
net.core.somaxconn = 4096

# 应用配置
sysctl -p
```

---

### 九、监控和维护

#### 9.1 查看 Nginx 日志
```bash
# 访问日志
tail -f /var/log/nginx/financial-toolbox-access.log

# 错误日志
tail -f /var/log/nginx/financial-toolbox-error.log
```

#### 9.2 监控服务器资源
```bash
# 查看 CPU 和内存使用
top

# 查看磁盘使用
df -h

# 查看网络连接
netstat -tunlp
```

#### 9.3 定期备份
```bash
# 创建备份脚本
vi /root/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/financial-toolbox-$DATE.tar.gz /www/program/金融工具箱/financial-calculation-tools

# 只保留最近 7 天的备份
find $BACKUP_DIR -name "financial-toolbox-*.tar.gz" -mtime +7 -delete
```

```bash
# 添加到 crontab（每天凌晨 2 点备份）
chmod +x /root/backup.sh
crontab -e
# 添加：0 2 * * * /root/backup.sh
```

---

### 十、故障排查

#### 10.1 网站无法访问
```bash
# 检查 Nginx 状态
systemctl status nginx

# 检查端口是否监听
netstat -tunlp | grep :80

# 检查防火墙
firewall-cmd --list-all

# 检查 SELinux（如果启用）
getenforce
# 如果是 Enforcing，临时关闭测试
setenforce 0
```

#### 10.2 前端路由 404 错误
确保 Nginx 配置中有：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 10.3 静态资源加载失败
检查文件权限：
```bash
ls -la /www/program/金融工具箱/financial-calculation-tools
# 应该是 nginx:nginx 755
```

---

### 十一、安全建议

1. **定期更新系统**
```bash
dnf update -y
```

2. **配置 SSH 密钥登录**
```bash
# 禁用密码登录
vi /etc/ssh/sshd_config
# 设置：PasswordAuthentication no
systemctl restart sshd
```

3. **安装 fail2ban 防止暴力破解**
```bash
dnf install fail2ban -y
systemctl start fail2ban
systemctl enable fail2ban
```

4. **定期检查日志**
```bash
# 检查异常访问
grep "404" /var/log/nginx/financial-toolbox-access.log | tail -20
```

---

## 快速命令参考

```bash
# 重启 Nginx
systemctl restart nginx

# 重新加载 Nginx 配置（不中断服务）
systemctl reload nginx

# 测试 Nginx 配置
nginx -t

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 查看网站访问日志
tail -f /var/log/nginx/financial-toolbox-access.log

# 清理旧备份
find /var/www/financial-toolbox.backup.* -mtime +7 -delete
```

---

## 联系支持

如果遇到问题，请检查：
1. Nginx 错误日志：`/var/log/nginx/financial-toolbox-error.log`
2. 系统日志：`journalctl -xe`
3. 防火墙状态：`firewall-cmd --list-all`
