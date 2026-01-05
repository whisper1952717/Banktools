# 快速部署指南

## 一、服务器端配置（首次部署）

### 1. 连接到服务器
```bash
ssh root@your-server-ip
```

### 2. 上传并运行服务器配置脚本
```bash
# 在本地执行（上传脚本到服务器）
scp financial-toolbox/server-setup.sh root@your-server-ip:/root/

# 在服务器上执行
ssh root@your-server-ip
chmod +x /root/server-setup.sh
/root/server-setup.sh
```

### 3. 配置域名（如果有）
```bash
# 编辑 Nginx 配置
vi /etc/nginx/conf.d/financial-toolbox.conf

# 将 server_name _; 改为
# server_name your-domain.com www.your-domain.com;

# 重新加载 Nginx
nginx -t
systemctl reload nginx
```

### 4. 配置 HTTPS（如果有域名）
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 二、本地部署配置（首次部署）

### 1. 修改部署脚本配置
编辑 `deploy.sh` 文件，修改以下变量：
```bash
SERVER_IP="your-server-ip"              # 改为你的服务器 IP
SERVER_USER="root"                       # SSH 用户名
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools" # 部署路径
PROJECT_DIR="financial-toolbox"          # 项目目录（通常不需要改）
```

### 2. 添加执行权限
```bash
chmod +x deploy.sh
```

---

## 三、日常部署流程

### 方式 1：使用自动部署脚本（推荐）
```bash
./deploy.sh
```

### 方式 2：手动部署
```bash
# 1. 构建项目
cd financial-toolbox
npm run build

# 2. 上传到服务器
scp -r dist/* root@your-server-ip:/www/program/金融工具箱/financial-calculation-tools/

# 3. 设置权限
ssh root@your-server-ip "chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools && chmod -R 755 /www/program/金融工具箱/financial-calculation-tools"

# 4. 重新加载 Nginx
ssh root@your-server-ip "systemctl reload nginx"
```

---

## 四、常用命令

### 服务器端命令
```bash
# 查看 Nginx 状态
systemctl status nginx

# 重启 Nginx
systemctl restart nginx

# 重新加载 Nginx 配置（不中断服务）
systemctl reload nginx

# 测试 Nginx 配置
nginx -t

# 查看访问日志
tail -f /var/log/nginx/financial-toolbox-access.log

# 查看错误日志
tail -f /var/log/nginx/financial-toolbox-error.log

# 查看实时访问情况
tail -f /var/log/nginx/financial-toolbox-access.log | grep -v "assets"

# 手动备份
/root/backup-website.sh

# 恢复备份
tar -xzf /root/backups/financial-toolbox-YYYYMMDD_HHMMSS.tar.gz -C /
```

### 本地命令
```bash
# 开发模式
npm run dev

# 运行测试
npm run test

# 构建项目
npm run build

# 预览构建结果
npm run preview

# 部署到服务器
./deploy.sh
```

---

## 五、故障排查

### 问题 1：网站无法访问
```bash
# 检查 Nginx 状态
systemctl status nginx

# 检查端口是否监听
netstat -tunlp | grep :80

# 检查防火墙
firewall-cmd --list-all

# 检查文件是否存在
ls -la /var/www/financial-toolbox
```

### 问题 2：前端路由 404
确保 Nginx 配置中有：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 问题 3：静态资源加载失败
```bash
# 检查文件权限
ls -la /www/program/金融工具箱/financial-calculation-tools

# 应该显示 nginx:nginx 755
# 如果不对，执行：
chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
chmod -R 755 /www/program/金融工具箱/financial-calculation-tools
```

### 问题 4：HTTPS 证书过期
```bash
# 手动续期
certbot renew

# 测试自动续期
certbot renew --dry-run
```

---

## 六、性能监控

### 查看服务器资源使用
```bash
# CPU 和内存
top

# 磁盘使用
df -h

# 网络连接
netstat -tunlp

# Nginx 连接数
netstat -an | grep :80 | wc -l
```

### 查看访问统计
```bash
# 今天的访问量
grep $(date +%d/%b/%Y) /var/log/nginx/financial-toolbox-access.log | wc -l

# 最常访问的页面
awk '{print $7}' /var/log/nginx/financial-toolbox-access.log | sort | uniq -c | sort -rn | head -10

# 访问来源 IP 统计
awk '{print $1}' /var/log/nginx/financial-toolbox-access.log | sort | uniq -c | sort -rn | head -10
```

---

## 七、安全检查清单

- [ ] 已配置 HTTPS
- [ ] 已设置防火墙规则
- [ ] 已安装 fail2ban
- [ ] 已配置自动备份
- [ ] 已禁用不必要的服务
- [ ] 已更新系统软件包
- [ ] 已配置 SSH 密钥登录（可选）
- [ ] 已设置强密码策略

---

## 八、联系信息

如遇到问题，请检查：
1. 服务器错误日志：`/var/log/nginx/financial-toolbox-error.log`
2. 系统日志：`journalctl -xe`
3. Nginx 配置：`/etc/nginx/conf.d/financial-toolbox.conf`

更多详细信息请参考 `DEPLOYMENT.md` 文档。
