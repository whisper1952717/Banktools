#!/bin/bash

# ========================================
# 诊断脚本 - 检查部署环境
# ========================================

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

echo "=========================================="
echo "环境诊断"
echo "=========================================="
echo ""

# 1. 检查当前目录
print_info "当前目录:"
pwd
echo ""

# 2. 检查目录内容
print_info "当前目录内容:"
ls -la
echo ""

# 3. 检查 package.json
print_info "检查 package.json:"
if [ -f "package.json" ]; then
    print_success "package.json 存在"
    echo "项目名称: $(grep '"name"' package.json | head -1)"
else
    print_error "package.json 不存在"
    print_info "请确保在 financial-toolbox 目录下运行"
fi
echo ""

# 4. 检查 Node.js
print_info "检查 Node.js:"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js 已安装: $NODE_VERSION"
else
    print_error "Node.js 未安装"
fi
echo ""

# 5. 检查 npm
print_info "检查 npm:"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm 已安装: $NPM_VERSION"
else
    print_error "npm 未安装"
fi
echo ""

# 6. 检查 node_modules
print_info "检查 node_modules:"
if [ -d "node_modules" ]; then
    print_success "node_modules 存在"
    MODULE_COUNT=$(ls node_modules | wc -l)
    echo "  已安装模块数: $MODULE_COUNT"
else
    print_error "node_modules 不存在"
    print_info "需要运行: npm install"
fi
echo ""

# 7. 检查 dist 目录
print_info "检查 dist 目录:"
if [ -d "dist" ]; then
    print_success "dist 目录存在"
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "  文件数量: $FILE_COUNT"
    echo "  目录内容:"
    ls -lh dist/ | head -10
else
    print_error "dist 目录不存在"
    print_info "需要运行: npm run build"
fi
echo ""

# 8. 检查构建脚本
print_info "检查构建脚本:"
if grep -q '"build"' package.json; then
    print_success "构建脚本已配置"
    grep '"build"' package.json
else
    print_error "构建脚本未配置"
fi
echo ""

# 9. 尝试构建（如果需要）
if [ ! -d "dist" ] || [ ! "$(ls -A dist 2>/dev/null)" ]; then
    print_info "dist 目录不存在或为空，是否尝试构建？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "开始构建..."
        npm run build
        if [ $? -eq 0 ]; then
            print_success "构建成功"
            if [ -d "dist" ]; then
                FILE_COUNT=$(find dist -type f | wc -l)
                print_success "生成了 $FILE_COUNT 个文件"
            fi
        else
            print_error "构建失败"
        fi
    fi
fi
echo ""

# 10. 检查部署目录
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"
print_info "检查部署目录:"
if [ -d "$DEPLOY_PATH" ]; then
    print_success "部署目录存在: $DEPLOY_PATH"
    if [ "$(ls -A $DEPLOY_PATH 2>/dev/null)" ]; then
        FILE_COUNT=$(find $DEPLOY_PATH -type f 2>/dev/null | wc -l)
        echo "  已部署文件数: $FILE_COUNT"
    else
        print_info "部署目录为空"
    fi
else
    print_error "部署目录不存在: $DEPLOY_PATH"
fi
echo ""

# 11. 检查 Nginx
print_info "检查 Nginx:"
if command -v nginx &> /dev/null; then
    print_success "Nginx 已安装"
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    echo "  版本: $NGINX_VERSION"
    
    # 检查 Nginx 状态
    if systemctl is-active nginx &> /dev/null; then
        print_success "Nginx 正在运行"
    else
        print_error "Nginx 未运行"
    fi
    
    # 检查配置
    if [ -f "/etc/nginx/conf.d/financial-toolbox.conf" ]; then
        print_success "Nginx 配置文件存在"
    else
        print_error "Nginx 配置文件不存在"
    fi
else
    print_error "Nginx 未安装"
fi
echo ""

echo "=========================================="
echo "诊断完成"
echo "=========================================="
echo ""

print_info "建议的操作顺序:"
echo "1. 确保在 financial-toolbox 目录下"
echo "2. 运行 npm install（如果 node_modules 不存在）"
echo "3. 运行 npm run build（生成 dist 目录）"
echo "4. 运行 ./deploy-on-server.sh（部署到生产环境）"
echo ""
