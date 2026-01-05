#!/bin/bash

# ========================================
# 简化部署脚本（无备份版本）
# 直接在当前目录构建并部署
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
echo "金融工具箱 - 简化部署（无备份）"
echo "=========================================="
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
    print_error "请在 financial-toolbox 目录下运行此脚本"
    exit 1
fi

CURRENT_DIR=$(pwd)
print_info "当前目录: $CURRENT_DIR"
echo ""

# 检查 Node.js
print_step "检查环境..."
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装"
    exit 1
fi
print_success "Node.js: $(node -v)"
print_success "npm: $(npm -v)"
echo ""

# 安装依赖
print_step "检查依赖..."
if [ ! -d "node_modules" ]; then
    print_info "安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "依赖安装失败"
        exit 1
    fi
fi
print_success "依赖已就绪"
echo ""

# 构建项目
print_step "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    print_error "构建失败"
    exit 1
fi
print_success "构建完成"
echo ""

# 检查 dist 目录
print_step "检查构建产物..."
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    print_error "构建产物不完整"
    exit 1
fi
print_success "构建产物验证通过"
echo ""

# 注意：由于我们在 /www/program/金融工具箱/financial-calculation-tools/financial-toolbox 目录
# 部署路径是 /www/program/金融工具箱/financial-calculation-tools
# 所以我们需要将 dist 内容复制到上一级目录

PARENT_DIR=$(dirname "$CURRENT_DIR")
print_step "部署文件..."
print_info "部署到: $PARENT_DIR"

# 保存 dist 目录的绝对路径
DIST_DIR="$CURRENT_DIR/dist"

# 进入父目录
cd "$PARENT_DIR"

# 删除旧的部署文件（保留 .git, .kiro, .vscode, financial-toolbox 等目录）
print_info "清理旧文件..."
find . -maxdepth 1 -type f -delete
rm -rf assets 2>/dev/null

# 复制新文件
print_info "复制新文件..."
cp -r "$DIST_DIR"/* .
if [ $? -ne 0 ]; then
    print_error "文件复制失败"
    exit 1
fi

# 验证
if [ ! -f "index.html" ]; then
    print_error "部署验证失败：index.html 不存在"
    exit 1
fi

print_success "文件部署完成"
echo ""

# 设置权限
print_step "设置文件权限..."
chown -R nginx:nginx "$PARENT_DIR"
chmod -R 755 "$PARENT_DIR"
print_success "权限设置完成"
echo ""

# 重新加载 Nginx
print_step "重新加载 Nginx..."
if command -v nginx &> /dev/null; then
    nginx -t > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        systemctl reload nginx
        print_success "Nginx 重新加载完成"
    else
        print_error "Nginx 配置有误"
    fi
else
    print_info "Nginx 未安装，跳过"
fi
echo ""

# 显示部署结果
print_step "验证部署..."
cd "$PARENT_DIR"
if [ -f "index.html" ] && [ -d "assets" ]; then
    print_success "部署验证通过"
    print_info "部署目录: $PARENT_DIR"
    print_info "文件列表:"
    ls -lh | grep -v "^d" | head -10
else
    print_error "部署验证失败"
fi
echo ""

echo "=========================================="
print_success "部署完成！"
echo "=========================================="
echo ""
print_info "访问地址："
echo "  http://47.96.251.147"
echo "  http://www.lovetest.asia"
echo ""
print_info "查看日志："
echo "  tail -f /var/log/nginx/financial-toolbox-access.log"
echo ""
