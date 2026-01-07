#!/bin/bash

# ========================================
# 扩大 Swap 空间脚本
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

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    print_error "请使用 root 用户运行此脚本"
    echo "使用: sudo ./add-swap.sh"
    exit 1
fi

echo "=========================================="
echo "扩大 Swap 空间"
echo "=========================================="
echo ""

# 显示当前内存和 swap 状态
print_step "当前内存状态："
free -h
echo ""

# 询问 swap 大小
print_info "推荐 swap 大小："
echo "  - 4GB: 适合 1-2GB 内存的服务器"
echo "  - 6GB: 适合内存较小且构建较大项目"
echo "  - 8GB: 适合大型项目构建"
echo ""

read -p "请输入 swap 大小 (GB) [默认: 4]: " SWAP_SIZE
SWAP_SIZE=${SWAP_SIZE:-4}

# 验证输入
if ! [[ "$SWAP_SIZE" =~ ^[0-9]+$ ]]; then
    print_error "无效的输入，请输入数字"
    exit 1
fi

if [ "$SWAP_SIZE" -lt 1 ] || [ "$SWAP_SIZE" -gt 16 ]; then
    print_error "Swap 大小必须在 1-16 GB 之间"
    exit 1
fi

print_info "将创建 ${SWAP_SIZE}GB swap 空间"
echo ""

# 计算 MB
SWAP_SIZE_MB=$((SWAP_SIZE * 1024))

# 关闭现有 swap
print_step "关闭现有 swap..."
if swapon --show | grep -q "/swapfile"; then
    swapoff /swapfile
    print_success "已关闭现有 swap"
else
    print_info "没有找到现有 swap"
fi
echo ""

# 删除旧的 swapfile
if [ -f /swapfile ]; then
    print_step "删除旧的 swapfile..."
    rm /swapfile
    print_success "已删除旧文件"
    echo ""
fi

# 创建新的 swapfile
print_step "创建 ${SWAP_SIZE}GB swapfile..."
print_info "这可能需要几分钟，请耐心等待..."
dd if=/dev/zero of=/swapfile bs=1M count=$SWAP_SIZE_MB status=progress
if [ $? -ne 0 ]; then
    print_error "创建 swapfile 失败"
    exit 1
fi
print_success "Swapfile 创建完成"
echo ""

# 设置权限
print_step "设置文件权限..."
chmod 600 /swapfile
print_success "权限设置完成"
echo ""

# 格式化为 swap
print_step "格式化为 swap..."
mkswap /swapfile
if [ $? -ne 0 ]; then
    print_error "格式化失败"
    exit 1
fi
print_success "格式化完成"
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
print_step "验证 swap 状态："
free -h
echo ""
swapon --show
echo ""

# 添加到 fstab（如果还没有）
if ! grep -q "/swapfile" /etc/fstab; then
    print_step "添加到 /etc/fstab 以便开机自动挂载..."
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
    print_success "已添加到 fstab"
else
    print_info "fstab 中已存在 swap 配置"
fi
echo ""

# 优化 swap 使用策略
print_step "优化 swap 使用策略..."
print_info "设置 swappiness=10 (降低 swap 使用频率，优先使用物理内存)"
sysctl vm.swappiness=10
if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    print_success "已永久保存 swappiness 设置"
else
    print_info "swappiness 已配置"
fi
echo ""

echo "=========================================="
print_success "Swap 扩容完成！"
echo "=========================================="
echo ""
print_info "当前配置："
echo "  Swap 大小: ${SWAP_SIZE}GB"
echo "  Swappiness: 10"
echo ""
print_info "现在可以重新运行构建："
echo "  cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox"
echo "  ./deploy-simple.sh"
echo ""
