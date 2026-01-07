#!/bin/bash

# ========================================
# 修复域名访问脚本
# 查找并修改宝塔 Nginx 配置
# ========================================

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

echo "=========================================="
echo "修复域名访问 - 查找 Nginx 配置"
echo "=========================================="
echo ""

DOMAIN="lovetest.asia"
NEW_ROOT="/www/program/金融工具箱/financial-calculation-tools"

# 查找包含域名的配置文件
print_step "查找 $DOMAIN 的 Nginx 配置文件..."
echo ""

CONFIG_FILES=$(find /www/server -name "*.conf" -exec grep -l "$DOMAIN" {} \; 2>/dev/null)

if [ -z "$CONFIG_FILES" ]; then
    print_error "未找到包含 $DOMAIN 的配置文件"
    echo ""
    print_info "可能的原因："
    echo "  1. 配置文件在其他位置"
    echo "  2. 域名配置在主配置文件中"
    echo ""
    print_info "请尝试："
    echo "  1. 登录宝塔面板修改网站根目录"
    echo "  2. 手动查找配置文件："
    echo "     find /www -name '*.conf' | xargs grep -l '$DOMAIN'"
    exit 1
fi

print_success "找到以下配置文件："
echo "$CONFIG_FILES"
echo ""

# 遍历每个配置文件
for CONFIG_FILE in $CONFIG_FILES; do
    print_step "检查配置文件: $CONFIG_FILE"
    echo ""
    
    # 显示当前的 root 配置
    print_info "当前配置："
    grep -n "root" "$CONFIG_FILE" | head -5
    echo ""
    
    # 检查是否已经是正确的路径
    if grep -q "$NEW_ROOT" "$CONFIG_FILE"; then
        print_success "此配置文件已经指向正确的路径"
        echo ""
        continue
    fi
    
    # 询问是否修改
    print_info "是否要修改此配置文件？(y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        # 备份原文件
        BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$CONFIG_FILE" "$BACKUP_FILE"
        print_success "已备份到: $BACKUP_FILE"
        
        # 显示修改预览
        print_info "将要进行的修改："
        echo "  查找包含 'root' 的行"
        echo "  替换为: root $NEW_ROOT;"
        echo ""
        
        # 修改配置文件
        # 这里使用 sed 替换第一个 root 指令
        sed -i "0,/root .*/{s|root .*|root $NEW_ROOT;|}" "$CONFIG_FILE"
        
        print_success "配置文件已修改"
        echo ""
        
        # 显示修改后的配置
        print_info "修改后的配置："
        grep -n "root" "$CONFIG_FILE" | head -5
        echo ""
    else
        print_info "跳过此文件"
        echo ""
    fi
done

# 测试 Nginx 配置
print_step "测试 Nginx 配置..."
nginx -t
if [ $? -eq 0 ]; then
    print_success "Nginx 配置测试通过"
    echo ""
    
    # 询问是否重启
    print_info "是否要重新加载 Nginx？(y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        systemctl reload nginx
        if [ $? -eq 0 ]; then
            print_success "Nginx 已重新加载"
        else
            print_error "Nginx 重新加载失败"
        fi
    fi
else
    print_error "Nginx 配置测试失败"
    print_info "请检查配置文件并手动修复"
    echo ""
    print_info "恢复备份："
    for CONFIG_FILE in $CONFIG_FILES; do
        BACKUP_FILE="${CONFIG_FILE}.backup.*"
        if ls $BACKUP_FILE 1> /dev/null 2>&1; then
            echo "  cp $BACKUP_FILE $CONFIG_FILE"
        fi
    done
    exit 1
fi

echo ""
echo "=========================================="
print_success "配置修改完成！"
echo "=========================================="
echo ""

print_info "请测试访问："
echo "  http://www.lovetest.asia"
echo "  https://www.lovetest.asia"
echo ""

print_info "如果还有问题，请检查："
echo "  1. DNS 解析是否正确"
echo "  2. 防火墙是否开放 80/443 端口"
echo "  3. Nginx 错误日志："
echo "     tail -f /www/wwwlogs/lovetest.asia.error.log"
echo ""
