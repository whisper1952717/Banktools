#!/bin/bash

# ========================================
# 部署路径验证脚本
# 用于检查服务器上的路径配置是否正确
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

# 部署路径
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"

echo "=========================================="
echo "验证部署路径配置"
echo "=========================================="
echo ""

# 1. 检查目录是否存在
print_info "检查部署目录..."
if [ -d "$DEPLOY_PATH" ]; then
    print_success "部署目录存在: $DEPLOY_PATH"
else
    print_error "部署目录不存在: $DEPLOY_PATH"
    echo ""
    print_info "创建目录？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        mkdir -p "$DEPLOY_PATH"
        if [ $? -eq 0 ]; then
            print_success "目录创建成功"
        else
            print_error "目录创建失败"
            exit 1
        fi
    else
        exit 1
    fi
fi
echo ""

# 2. 检查目录权限
print_info "检查目录权限..."
OWNER=$(stat -c '%U:%G' "$DEPLOY_PATH" 2>/dev/null)
PERMS=$(stat -c '%a' "$DEPLOY_PATH" 2>/dev/null)

if [ "$OWNER" = "nginx:nginx" ] && [ "$PERMS" = "755" ]; then
    print_success "权限正确: $OWNER $PERMS"
else
    print_error "权限不正确: $OWNER $PERMS (应该是 nginx:nginx 755)"
    echo ""
    print_info "修复权限？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        chown -R nginx:nginx "$DEPLOY_PATH"
        chmod -R 755 "$DEPLOY_PATH"
        if [ $? -eq 0 ]; then
            print_success "权限修复成功"
        else
            print_error "权限修复失败"
        fi
    fi
fi
echo ""

# 3. 检查 Nginx 配置
print_info "检查 Nginx 配置..."
NGINX_CONF="/etc/nginx/conf.d/financial-toolbox.conf"

if [ -f "$NGINX_CONF" ]; then
    print_success "Nginx 配置文件存在"
    
    # 检查 root 路径
    if grep -q "root $DEPLOY_PATH" "$NGINX_CONF"; then
        print_success "Nginx root 路径配置正确"
    else
        print_error "Nginx root 路径配置不正确"
        echo ""
        print_info "当前配置:"
        grep "root" "$NGINX_CONF" | head -1
        echo ""
        print_info "应该是: root $DEPLOY_PATH;"
    fi
else
    print_error "Nginx 配置文件不存在: $NGINX_CONF"
fi
echo ""

# 4. 测试 Nginx 配置
print_info "测试 Nginx 配置..."
nginx -t > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Nginx 配置语法正确"
else
    print_error "Nginx 配置语法错误"
    nginx -t
fi
echo ""

# 5. 检查 Nginx 状态
print_info "检查 Nginx 状态..."
systemctl is-active nginx > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Nginx 正在运行"
else
    print_error "Nginx 未运行"
    echo ""
    print_info "启动 Nginx？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        systemctl start nginx
        if [ $? -eq 0 ]; then
            print_success "Nginx 启动成功"
        else
            print_error "Nginx 启动失败"
        fi
    fi
fi
echo ""

# 6. 检查文件是否存在
print_info "检查网站文件..."
if [ -f "$DEPLOY_PATH/index.html" ]; then
    print_success "index.html 存在"
    
    # 检查文件大小
    SIZE=$(stat -c%s "$DEPLOY_PATH/index.html")
    if [ $SIZE -gt 0 ]; then
        print_success "index.html 不为空 ($SIZE bytes)"
    else
        print_error "index.html 为空"
    fi
else
    print_error "index.html 不存在"
    echo ""
    print_info "请先部署网站文件"
fi
echo ""

# 7. 检查备份脚本
print_info "检查备份脚本..."
BACKUP_SCRIPT="/root/backup-website.sh"

if [ -f "$BACKUP_SCRIPT" ]; then
    print_success "备份脚本存在"
    
    # 检查备份脚本中的路径
    if grep -q "$DEPLOY_PATH" "$BACKUP_SCRIPT"; then
        print_success "备份脚本路径配置正确"
    else
        print_error "备份脚本路径配置不正确"
    fi
else
    print_error "备份脚本不存在: $BACKUP_SCRIPT"
fi
echo ""

# 8. 检查防火墙
print_info "检查防火墙..."
if command -v firewall-cmd &> /dev/null; then
    HTTP_OPEN=$(firewall-cmd --list-services | grep -c "http")
    HTTPS_OPEN=$(firewall-cmd --list-services | grep -c "https")
    
    if [ $HTTP_OPEN -gt 0 ]; then
        print_success "HTTP 端口已开放"
    else
        print_error "HTTP 端口未开放"
    fi
    
    if [ $HTTPS_OPEN -gt 0 ]; then
        print_success "HTTPS 端口已开放"
    else
        print_error "HTTPS 端口未开放"
    fi
else
    print_info "firewalld 未安装或未运行"
fi
echo ""

# 总结
echo "=========================================="
echo "验证完成"
echo "=========================================="
echo ""
print_info "部署路径: $DEPLOY_PATH"
print_info "Nginx 配置: $NGINX_CONF"
print_info "备份脚本: $BACKUP_SCRIPT"
echo ""
print_info "如果所有检查都通过，你可以开始部署了！"
echo ""
