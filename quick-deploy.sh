#!/bin/bash

# ========================================
# 一键快速部署脚本
# 服务器: 47.96.251.147
# 域名: www.lovetest.asia
# ========================================

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

SERVER_IP="47.96.251.147"
DOMAIN="www.lovetest.asia"

echo "=========================================="
echo "金融工具箱 - 一键部署"
echo "=========================================="
echo ""
print_info "服务器: $SERVER_IP"
print_info "域名: $DOMAIN"
echo ""

# 检查是否首次部署
print_step "检查部署状态..."
ssh -o ConnectTimeout=5 root@$SERVER_IP "test -d /www/program/金融工具箱/financial-calculation-tools" 2>/dev/null
if [ $? -ne 0 ]; then
    print_info "检测到首次部署，需要初始化服务器"
    echo ""
    
    print_step "第一步：初始化服务器"
    print_info "上传服务器配置脚本..."
    scp financial-toolbox/server-setup.sh root@$SERVER_IP:/root/
    if [ $? -ne 0 ]; then
        print_error "上传失败，请检查 SSH 连接"
        exit 1
    fi
    
    print_info "运行服务器配置脚本（需要几分钟）..."
    ssh root@$SERVER_IP "chmod +x /root/server-setup.sh && /root/server-setup.sh"
    if [ $? -ne 0 ]; then
        print_error "服务器配置失败"
        exit 1
    fi
    print_success "服务器初始化完成"
    echo ""
    
    print_step "第二步：配置 Nginx"
    print_info "上传 Nginx 配置..."
    scp financial-toolbox/nginx.conf root@$SERVER_IP:/etc/nginx/conf.d/financial-toolbox.conf
    if [ $? -ne 0 ]; then
        print_error "Nginx 配置上传失败"
        exit 1
    fi
    
    print_info "测试 Nginx 配置..."
    ssh root@$SERVER_IP "nginx -t"
    if [ $? -ne 0 ]; then
        print_error "Nginx 配置有误"
        exit 1
    fi
    
    print_info "重新加载 Nginx..."
    ssh root@$SERVER_IP "systemctl reload nginx"
    print_success "Nginx 配置完成"
    echo ""
fi

# 部署网站
print_step "第三步：部署网站"
print_info "运行部署脚本..."
./deploy.sh
if [ $? -ne 0 ]; then
    print_error "部署失败"
    exit 1
fi

echo ""
echo "=========================================="
print_success "部署完成！"
echo "=========================================="
echo ""
print_info "访问地址："
echo "  HTTP:  http://$SERVER_IP"
echo "  HTTP:  http://$DOMAIN"
echo ""
print_info "配置 HTTPS（推荐）："
echo "  ssh root@$SERVER_IP"
echo "  certbot --nginx -d www.lovetest.asia -d lovetest.asia"
echo ""
print_info "查看日志："
echo "  ssh root@$SERVER_IP 'tail -f /var/log/nginx/financial-toolbox-access.log'"
echo ""
