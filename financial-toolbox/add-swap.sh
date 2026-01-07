#!/bin/bash

# ========================================
# 增加 Swap 空间脚本
# 用于解决构建时内存不足的问题
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
echo "增加 Swap 空间"
echo "=========================================="
echo ""

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
    print_error "请使用 root 权限运行此脚本"
    echo "使用: sudo ./add-swap.sh"
    exit 1
fi

# 检查当前内存和 swap
print_step "检查当前内存状态..."
free -h
echo ""

# 检查是否已有 swap 文件
if [ -f /swapfile ]; then
    print_info "检测到已存在 /swapfile"
    read -p "是否要删除并重新创建？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "删除旧的 swap 文件..."
        swapoff /swapfile 2>/dev/null
        rm -f /swapfile
        print_success "旧 swap 文件已删除"
    else
        print_info "保留现有 swap 配置"
        exit 0
    fi
fi

# 设置 swap 大小（默认 2GB）
SWAP_SIZE=${1:-2048}
print_info "将创建 ${SWAP_SIZE}MB 的 swap 空间"
echo ""

# 创建 swap 文件
print_step "创建 swap 文件（这可能需要几分钟）..."
dd if=/dev/zero of=/swapfile bs=1M count=$SWAP_SIZE status=progress
if [ $? -ne 0 ]; then
    print_error "创建 swap 文件失败"
    exit 1
fi
print_success "Swap 文件创建完成"
echo ""

# 设置权限
print_step "设置文件权限..."
chmod 600 /swapfile
print_success "权限设置完成"
echo ""

# 创建 swap
print_step "格式化为 swap..."
mkswap /swapfile
if [ $? -ne 0 ]; then
    print_error "格式化 swap 失败"
    exit 1
fi
print_success "Swap 格式化完成"
echo ""

# 启用 swap
print_step "启用 swap..."
swapon /swapfile
if [ $? -ne 0 ]; then
    print_error "启用 swap 失败"
    exit 1
fi
print_success "Swap 已启用"
echo ""

# 验证
print_step "验证 swap 状态..."
free -h
echo ""
swapon --show
echo ""

# 永久启用
print_step "配置开机自动启用..."
if grep -q '/swapfile' /etc/fstab; then
    print_info "/etc/fstab 中已存在 swap 配置"
else
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    print_success "已添加到 /etc/fstab"
fi
echo ""

# 优化 swap 使用策略
print_step "优化 swap 使用策略..."
# swappiness=10 表示尽量少用 swap，只在内存不足时使用
sysctl vm.swappiness=10
if grep -q 'vm.swappiness' /etc/sysctl.conf; then
    sed -i 's/vm.swappiness=.*/vm.swappiness=10/' /etc/sysctl.conf
else
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi
print_success "Swap 策略已优化"
echo ""

echo "=========================================="
print_success "Swap 配置完成！"
echo "=========================================="
echo ""

print_info "当前内存状态："
free -h
echo ""

print_info "现在可以运行构建命令了："
echo "  cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox"
echo "  ./deploy-simple.sh"
echo ""

print_info "如需删除 swap："
echo "  sudo swapoff /swapfile"
echo "  sudo rm /swapfile"
echo "  # 并从 /etc/fstab 中删除相关行"
echo ""
