# 阿里云 ECS 部署检查清单

## 📋 部署前准备

### 服务器准备
- [ ] 已购买阿里云 ECS 实例
- [ ] 操作系统：Alibaba Cloud Linux 3
- [ ] 配置：至少 1核2G 内存
- [ ] 已获取服务器公网 IP 地址
- [ ] 可以通过 SSH 连接到服务器
- [ ] 已在阿里云安全组开放 80 和 443 端口

### 域名准备（可选）
- [ ] 已购买域名
- [ ] 域名已完成 ICP 备案（国内服务器必需）
- [ ] 已配置 DNS 解析指向服务器 IP

### 本地环境
- [ ] 已安装 Node.js (>= 18.0.0)
- [ ] 已安装 npm (>= 9.0.0)
- [ ] 已安装 SSH 客户端
- [ ] 已安装 rsync（用于文件同步）

---

## 🚀 首次部署流程

### 第一步：服务器初始化
- [ ] 连接到服务器：`ssh root@your-server-ip`
- [ ] 上传服务器配置脚本：`scp financial-toolbox/server-setup.sh root@your-server-ip:/root/`
- [ ] 运行配置脚本：`chmod +x /root/server-setup.sh && /root/server-setup.sh`
- [ ] 确认 Nginx 已启动：`systemctl status nginx`
- [ ] 确认防火墙已配置：`firewall-cmd --list-all`

### 第二步：配置域名（如果有）
- [ ] 编辑 Nginx 配置：`vi /etc/nginx/conf.d/financial-toolbox.conf`
- [ ] 修改 `server_name` 为你的域名
- [ ] 测试配置：`nginx -t`
- [ ] 重新加载 Nginx：`systemctl reload nginx`
- [ ] 验证域名解析：`nslookup your-domain.com`

### 第三步：配置 HTTPS（如果有域名）
- [ ] 运行 Certbot：`certbot --nginx -d your-domain.com -d www.your-domain.com`
- [ ] 输入邮箱地址
- [ ] 同意服务条款
- [ ] 选择重定向 HTTP 到 HTTPS（推荐选择 2）
- [ ] 测试自动续期：`certbot renew --dry-run`

### 第四步：配置本地部署脚本
- [ ] 编辑 `deploy.sh` 文件
- [ ] 修改 `SERVER_IP` 为你的服务器 IP
- [ ] 修改 `SERVER_USER`（如果不是 root）
- [ ] 添加执行权限：`chmod +x deploy.sh`

### 第五步：首次部署
- [ ] 运行测试：`cd financial-toolbox && npm run test:run`
- [ ] 构建项目：`npm run build`
- [ ] 执行部署：`cd .. && ./deploy.sh`
- [ ] 等待部署完成

### 第六步：验证部署
- [ ] 访问网站：`http://your-server-ip` 或 `https://your-domain.com`
- [ ] 测试首页加载
- [ ] 测试复利计算器功能
- [ ] 测试 IRR 计算器功能
- [ ] 测试资产体检功能
- [ ] 测试前端路由（刷新页面不应该 404）
- [ ] 测试移动端响应式布局
- [ ] 检查浏览器控制台无错误

---

## 🔄 日常部署流程

### 代码更新后
- [ ] 本地测试：`npm run test:run`
- [ ] 本地构建测试：`npm run build && npm run preview`
- [ ] 提交代码到 Git（可选）
- [ ] 运行部署脚本：`./deploy.sh`
- [ ] 验证部署成功

---

## 🔍 部署后检查

### 功能检查
- [ ] 所有页面可以正常访问
- [ ] 计算功能正常工作
- [ ] 图表正常显示
- [ ] 表单验证正常
- [ ] 移动端布局正常
- [ ] 前端路由正常（刷新不 404）

### 性能检查
- [ ] 首屏加载时间 < 3秒
- [ ] 静态资源正确缓存
- [ ] Gzip 压缩已启用
- [ ] 图片资源正常加载

### 安全检查
- [ ] HTTPS 正常工作（如果配置）
- [ ] 安全头部已设置
- [ ] 隐藏文件无法访问
- [ ] 防火墙规则正确

### 日志检查
- [ ] 访问日志正常：`tail -f /var/log/nginx/financial-toolbox-access.log`
- [ ] 无错误日志：`tail -f /var/log/nginx/financial-toolbox-error.log`
- [ ] Nginx 状态正常：`systemctl status nginx`

---

## 🛠️ 故障排查清单

### 网站无法访问
- [ ] 检查 Nginx 状态：`systemctl status nginx`
- [ ] 检查端口监听：`netstat -tunlp | grep :80`
- [ ] 检查防火墙：`firewall-cmd --list-all`
- [ ] 检查阿里云安全组规则
- [ ] 检查域名解析：`nslookup your-domain.com`

### 页面显示异常
- [ ] 检查文件是否上传：`ls -la /www/program/金融工具箱/financial-calculation-tools`
- [ ] 检查文件权限：应该是 `nginx:nginx 755`
- [ ] 检查 Nginx 错误日志
- [ ] 检查浏览器控制台错误

### 前端路由 404
- [ ] 确认 Nginx 配置有 `try_files $uri $uri/ /index.html;`
- [ ] 重新加载 Nginx：`systemctl reload nginx`

### HTTPS 问题
- [ ] 检查证书是否过期：`certbot certificates`
- [ ] 手动续期：`certbot renew`
- [ ] 检查 Nginx HTTPS 配置

---

## 📊 监控和维护

### 每日检查
- [ ] 查看访问日志，确认无异常访问
- [ ] 检查错误日志，确认无错误
- [ ] 检查服务器资源使用（CPU、内存、磁盘）

### 每周检查
- [ ] 检查备份是否正常执行
- [ ] 清理旧备份文件
- [ ] 检查 SSL 证书有效期

### 每月检查
- [ ] 更新系统软件包：`dnf update -y`
- [ ] 检查 Nginx 版本，考虑升级
- [ ] 审查访问日志，分析流量趋势
- [ ] 检查磁盘空间使用

---

## 🔐 安全加固清单

### 基础安全
- [ ] 修改 SSH 默认端口（可选）
- [ ] 禁用 root 密码登录，使用密钥认证
- [ ] 安装 fail2ban 防止暴力破解
- [ ] 定期更新系统和软件包
- [ ] 配置防火墙规则

### Nginx 安全
- [ ] 隐藏 Nginx 版本号
- [ ] 配置安全头部（X-Frame-Options 等）
- [ ] 限制请求大小
- [ ] 配置访问频率限制（可选）

### 备份策略
- [ ] 配置自动备份（已在 server-setup.sh 中配置）
- [ ] 定期测试备份恢复
- [ ] 考虑异地备份

---

## 📞 紧急联系信息

### 服务器信息
- 服务器 IP: _______________
- SSH 端口: _______________
- 域名: _______________

### 重要路径
- 网站目录: `/www/program/金融工具箱/financial-calculation-tools`
- Nginx 配置: `/etc/nginx/conf.d/financial-toolbox.conf`
- 访问日志: `/var/log/nginx/financial-toolbox-access.log`
- 错误日志: `/var/log/nginx/financial-toolbox-error.log`
- 备份目录: `/root/backups`

### 常用命令
```bash
# 重启 Nginx
systemctl restart nginx

# 查看日志
tail -f /var/log/nginx/financial-toolbox-error.log

# 恢复备份
tar -xzf /root/backups/financial-toolbox-YYYYMMDD_HHMMSS.tar.gz -C /

# 手动备份
/root/backup-website.sh
```

---

## ✅ 部署完成确认

- [ ] 所有检查项已完成
- [ ] 网站可以正常访问
- [ ] 功能测试通过
- [ ] 性能符合预期
- [ ] 安全配置完成
- [ ] 监控和备份已配置
- [ ] 文档已更新

**部署日期**: _______________  
**部署人员**: _______________  
**备注**: _______________
