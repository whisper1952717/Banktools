#!/bin/bash

# ========================================
# 服务器端部署脚本
# 在云服务器上运行此脚本
# 系统：Alibaba Cloud Linux 3.2104 U11
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

# 部署路径
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"
CURRENT_DIR=$(pwd)

echo "=========================================="
echo "金融工具箱 - 服务器端部署"
echo "=========================================="
echo ""
print_info "当前目录: $CURRENT_DIR"
print_info "部署路径: $DEPLOY_PATH"
echo ""

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    print_error "请在项目根目录（financial-toolbox）下运行此脚本"
    exit 1
fi

# 检查 Node.js
print_step "检查 Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装"
    print_info "安装 Node.js："
    echo "  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -"
    echo "  sudo dnf install nodejs -y"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js 已安装: $NODE_VERSION"
echo ""

# 检查 npm
print_step "检查 npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm 未安装"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm 已安装: $NPM_VERSION"
echo ""

# 安装依赖
print_step "安装依赖..."
if [ ! -d "node_modules" ]; then
    print_info "首次安装，可能需要几分钟..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "依赖安装失败"
        exit 1
    fi
else
    print_info "更新依赖..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "依赖更新失败"
        exit 1
    fi
fi
print_success "依赖安装完成"
echo ""

# 运行测试（可选）
print_step "运行测试..."
print_info "跳过测试（如需运行测试，请手动执行 npm run test:run）"
echo ""

# 构建项目
print_step "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    print_error "构建失败"
    print_info "请检查构建错误信息"
    exit 1
fi
print_success "构建完成"
echo ""

# 检查 dist 目录
print_step "检查构建产物..."
if [ ! -d "dist" ]; then
    print_error "dist 目录不存在，构建可能失败"
    print_info "当前目录: $(pwd)"
    print_info "目录内容:"
    ls -la
    exit 1
fi

# 检查 dist 目录是否为空
if [ ! "$(ls -A dist)" ]; then
    print_error "dist 目录为空"
    exit 1
fi

print_success "dist 目录存在且包含文件"
print_info "dist 目录内容:"
ls -la dist/ | head -10
echo ""

# 备份旧版本
print_step "备份旧版本..."
if [ -d "$DEPLOY_PATH" ] && [ "$(ls -A $DEPLOY_PATH)" ]; then
    BACKUP_NAME="$DEPLOY_PATH.backup.$(date +%Y%m%d_%H%M%S)"
    cp -r "$DEPLOY_PATH" "$BACKUP_NAME"
    if [ $? -eq 0 ]; then
        print_success "备份已保存到: $BACKUP_NAME"
    else
        print_error "备份失败，但继续部署..."
    fi
else
    print_info "没有旧版本需要备份"
fi
echo ""

# 创建部署目录
print_step "准备部署目录..."
mkdir -p "$DEPLOY_PATH"
if [ $? -ne 0 ]; then
    print_error "无法创建部署目录"
    exit 1
fi
print_success "部署目录已准备"
echo ""

# 复制文件
print_step "复制文件到部署目录..."
print_info "源目录: $(pwd)/dist/"
print_info "目标目录: $DEPLOY_PATH"

# 确保目标目录存在且为空
rm -rf "$DEPLOY_PATH"/*

# 使用 rsync 或 cp -r 复制整个目录
if command -v rsync &> /dev/null; then
    # 优先使用 rsync
    rsync -av dist/ "$DEPLOY_PATH"/
    if [ $? -ne 0 ]; then
        print_error "rsync 复制失败，尝试使用 cp"
        cp -r dist/. "$DEPLOY_PATH"/
    else
        print_success "文件复制完成（使用 rsync）"
    fi
else
    # 使用 cp -r 复制目录内容
    cp -r dist/. "$DEPLOY_PATH"/
    if [ $? -ne 0 ]; then
        print_error "文件复制失败"
        print_info "尝试查看 dist 目录:"
        ls -la dist/
        exit 1
    fi
    print_success "文件复制完成（使用 cp）"
fi

# 验证复制结果
if [ ! -f "$DEPLOY_PATH/index.html" ]; then
    print_error "复制后 index.html 不存在，复制可能失败"
    print_info "部署目录内容:"
    ls -la "$DEPLOY_PATH"
    exit 1
fi

print_success "文件复制验证通过"
echo ""

# 设置权限
print_step "设置文件权限..."
chown -R nginx:nginx "$DEPLOY_PATH"
chmod -R 755 "$DEPLOY_PATH"
if [ $? -eq 0 ]; then
    print_success "权限设置完成"
else
    print_error "权限设置失败"
    print_info "请手动执行："
    echo "  sudo chown -R nginx:nginx $DEPLOY_PATH"
    echo "  sudo chmod -R 755 $DEPLOY_PATH"
fi
echo ""

# 检查 Nginx
print_step "检查 Nginx..."
if ! command -v nginx &> /dev/null; then
    print_error "Nginx 未安装"
    print_info "请先运行服务器初始化脚本"
    exit 1
fi

# 测试 Nginx 配置
print_info "测试 Nginx 配置..."
nginx -t > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Nginx 配置正常"
    
    # 重新加载 Nginx
    print_info "重新加载 Nginx..."
    systemctl reload nginx
    if [ $? -eq 0 ]; then
        print_success "Nginx 重新加载完成"
    else
        print_error "Nginx 重新加载失败"
        print_info "请手动执行: sudo systemctl reload nginx"
    fi
else
    print_error "Nginx 配置有误"
    print_info "请检查配置文件: /etc/nginx/conf.d/financial-toolbox.conf"
fi
echo ""

# 清理旧备份（保留最近5个）
print_step "清理旧备份..."
BACKUP_DIR=$(dirname "$DEPLOY_PATH")
cd "$BACKUP_DIR"
ls -dt financial-calculation-tools.backup.* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null
print_success "旧备份已清理"
echo ""

# 部署完成
echo "=========================================="
print_success "部署完成！"
echo "=========================================="
echo ""
print_info "部署信息："
echo "  部署路径: $DEPLOY_PATH"
echo "  部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
print_info "访问地址："
echo "  HTTP:  http://47.96.251.147"
echo "  HTTP:  http://www.lovetest.asia"
echo ""
print_info "查看日志："
echo "  tail -f /var/log/nginx/financial-toolbox-access.log"
echo "  tail -f /var/log/nginx/financial-toolbox-error.log"
echo ""
print_info "如需配置 HTTPS："
echo "  certbot --nginx -d www.lovetest.asia -d lovetest.asia"
echo ""
