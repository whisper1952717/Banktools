#!/bin/bash

# ========================================
# 阿里云 ECS 服务器初始化脚本
# 适用于 Alibaba Cloud Linux 3
# ========================================

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    print_error "请使用 root 用户运行此脚本"
    exit 1
fi

echo "=========================================="
echo "开始配置服务器环境"
echo "=========================================="
echo ""

# 1. 更新系统
print_info "更新系统软件包..."
dnf update -y
print_success "系统更新完成"
echo ""

# 2. 安装 Nginx
print_info "安装 Nginx..."
dnf install nginx -y
if [ $? -ne 0 ]; then
    print_error "Nginx 安装失败"
    exit 1
fi
print_success "Nginx 安装完成"
echo ""

# 3. 启动并设置 Nginx 开机自启
print_info "配置 Nginx 服务..."
systemctl start nginx
systemctl enable nginx
print_success "Nginx 服务已启动并设置为开机自启"
echo ""

# 4. 配置防火墙
print_info "配置防火墙规则..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
print_success "防火墙规则配置完成（已开放 HTTP 和 HTTPS 端口）"
echo ""

# 5. 创建部署目录
print_info "创建网站部署目录..."
mkdir -p /www/program/金融工具箱/financial-calculation-tools
chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
chmod -R 755 /www/program/金融工具箱/financial-calculation-tools
print_success "部署目录创建完成: /www/program/金融工具箱/financial-calculation-tools"
echo ""

# 6. 创建日志目录
print_info "创建日志目录..."
mkdir -p /var/log/nginx
chown -R nginx:nginx /var/log/nginx
print_success "日志目录配置完成"
echo ""

# 7. 安装 Certbot（用于 HTTPS）
print_info "安装 Certbot（用于配置 HTTPS）..."
dnf install epel-release -y
dnf install certbot python3-certbot-nginx -y
if [ $? -eq 0 ]; then
    print_success "Certbot 安装完成"
else
    print_error "Certbot 安装失败，可以稍后手动安装"
fi
echo ""

# 8. 优化系统参数
print_info "优化系统参数..."
cat >> /etc/sysctl.conf << EOF

# 网络优化参数
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_tw_reuse = 1
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 8192
EOF
sysctl -p > /dev/null 2>&1
print_success "系统参数优化完成"
echo ""

# 9. 配置 Nginx
print_info "配置 Nginx..."
cat > /etc/nginx/conf.d/financial-toolbox.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    root /www/program/金融工具箱/financial-calculation-tools;
    index index.html;
    
    charset utf-8;
    
    access_log /var/log/nginx/financial-toolbox-access.log;
    error_log /var/log/nginx/financial-toolbox-error.log warn;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    location = /favicon.ico {
        expires 1y;
        access_log off;
        log_not_found off;
    }
    
    location = /robots.txt {
        access_log off;
        log_not_found off;
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
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
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

# 测试 Nginx 配置
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    print_success "Nginx 配置完成"
else
    print_error "Nginx 配置有误，请检查"
fi
echo ""

# 10. 安装 fail2ban（可选，防止暴力破解）
print_info "安装 fail2ban（防止暴力破解）..."
dnf install fail2ban -y
if [ $? -eq 0 ]; then
    systemctl start fail2ban
    systemctl enable fail2ban
    print_success "fail2ban 安装并启动完成"
else
    print_error "fail2ban 安装失败，可以稍后手动安装"
fi
echo ""

# 11. 创建备份脚本
print_info "创建自动备份脚本..."
cat > /root/backup-website.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/financial-toolbox-$DATE.tar.gz /www/program/金融工具箱/financial-calculation-tools

# 只保留最近 7 天的备份
find $BACKUP_DIR -name "financial-toolbox-*.tar.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/financial-toolbox-$DATE.tar.gz"
EOF

chmod +x /root/backup-website.sh
print_success "备份脚本创建完成: /root/backup-website.sh"
echo ""

# 12. 设置定时备份（每天凌晨 2 点）
print_info "配置定时备份任务..."
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-website.sh >> /var/log/backup.log 2>&1") | crontab -
print_success "定时备份任务配置完成（每天凌晨 2 点执行）"
echo ""

# 13. 显示服务器信息
echo "=========================================="
print_success "服务器配置完成！"
echo "=========================================="
echo ""
print_info "服务器信息："
echo "  操作系统: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "  Nginx 版本: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "  部署目录: /www/program/金融工具箱/financial-calculation-tools"
echo "  Nginx 配置: /etc/nginx/conf.d/financial-toolbox.conf"
echo "  访问日志: /var/log/nginx/financial-toolbox-access.log"
echo "  错误日志: /var/log/nginx/financial-toolbox-error.log"
echo ""
print_info "后续步骤："
echo "  1. 如果有域名，修改 Nginx 配置中的 server_name"
echo "     vi /etc/nginx/conf.d/financial-toolbox.conf"
echo "     将 'server_name _;' 改为 'server_name your-domain.com;'"
echo ""
echo "  2. 从本地上传网站文件到服务器"
echo "     scp -r dist/* root@$(hostname -I | awk '{print $1}'):/www/program/金融工具箱/financial-calculation-tools/"
echo ""
echo "  3. 配置 HTTPS（如果有域名）"
echo "     certbot --nginx -d your-domain.com"
echo ""
echo "  4. 重新加载 Nginx"
echo "     systemctl reload nginx"
echo ""
print_info "常用命令："
echo "  查看 Nginx 状态: systemctl status nginx"
echo "  重启 Nginx: systemctl restart nginx"
echo "  查看访问日志: tail -f /var/log/nginx/financial-toolbox-access.log"
echo "  查看错误日志: tail -f /var/log/nginx/financial-toolbox-error.log"
echo "  手动备份: /root/backup-website.sh"
echo ""
