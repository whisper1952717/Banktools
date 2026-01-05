#!/bin/bash

# ========================================
# 简化部署脚本（跳过备份，直接上传）
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

SERVER_IP="47.96.251.147"
SERVER_USER="root"
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"
PROJECT_DIR="financial-toolbox"

echo "=========================================="
echo "简化部署脚本"
echo "=========================================="
echo ""

# 进入项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "项目目录 $PROJECT_DIR 不存在"
    exit 1
fi

cd $PROJECT_DIR
print_success "进入项目目录: $PROJECT_DIR"
echo ""

# 构建项目
print_info "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    print_error "构建失败"
    exit 1
fi
print_success "构建完成"
echo ""

# 检查 dist 目录
if [ ! -d "dist" ]; then
    print_error "dist 目录不存在"
    exit 1
fi
print_success "dist 目录存在"
echo ""

# 测试服务器连接
print_info "测试服务器连接..."
ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo '连接成功'" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_error "无法连接到服务器 $SERVER_IP"
    print_info "请检查："
    echo "  1. 服务器是否运行"
    echo "  2. SSH 密钥是否正确"
    echo "  3. 网络连接是否正常"
    exit 1
fi
print_success "服务器连接正常"
echo ""

# 确保服务器目录存在
print_info "确保服务器目录存在..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $DEPLOY_PATH"
if [ $? -ne 0 ]; then
    print_error "无法创建服务器目录"
    exit 1
fi
print_success "服务器目录已准备"
echo ""

# 上传文件（使用 rsync，忽略临时文件警告）
print_info "上传文件到服务器..."
echo "  源: dist/"
echo "  目标: $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/"
echo ""

rsync -avz --delete --progress dist/ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/ 2>&1 | grep -v "some files vanished"
RSYNC_EXIT=${PIPESTATUS[0]}

# rsync 退出码：0=成功, 24=部分文件消失（通常是临时文件）
if [ $RSYNC_EXIT -eq 0 ] || [ $RSYNC_EXIT -eq 24 ]; then
    if [ $RSYNC_EXIT -eq 24 ]; then
        print_info "注意：某些临时文件在传输时消失（这是正常的）"
    fi
    print_success "文件上传完成"
else
    print_error "上传失败（退出码: $RSYNC_EXIT）"
    echo ""
    print_info "尝试使用备用方法..."
    
    # 备用方法：使用 tar + scp
    print_info "创建压缩包..."
    tar -czf ../dist.tar.gz dist/
    if [ $? -ne 0 ]; then
        print_error "创建压缩包失败"
        exit 1
    fi
    
    print_info "上传压缩包..."
    scp ../dist.tar.gz $SERVER_USER@$SERVER_IP:/tmp/
    if [ $? -ne 0 ]; then
        print_error "上传压缩包失败"
        rm -f ../dist.tar.gz
        exit 1
    fi
    
    print_info "在服务器上解压..."
    ssh $SERVER_USER@$SERVER_IP "
        cd /tmp
        tar -xzf dist.tar.gz
        rm -rf $DEPLOY_PATH/*
        cp -r dist/* $DEPLOY_PATH/
        rm -f dist.tar.gz
        rm -rf dist
    "
    if [ $? -ne 0 ]; then
        print_error "服务器端操作失败"
        rm -f ../dist.tar.gz
        exit 1
    fi
    
    rm -f ../dist.tar.gz
    print_success "备用方法上传完成"
fi
echo ""

# 设置文件权限
print_info "设置文件权限..."
ssh $SERVER_USER@$SERVER_IP "
    chown -R nginx:nginx $DEPLOY_PATH
    chmod -R 755 $DEPLOY_PATH
"
if [ $? -ne 0 ]; then
    print_error "权限设置失败"
    print_info "这可能不影响网站运行，继续..."
fi
print_success "权限设置完成"
echo ""

# 测试 Nginx 配置
print_info "测试 Nginx 配置..."
ssh $SERVER_USER@$SERVER_IP "nginx -t" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Nginx 配置正常"
    
    # 重新加载 Nginx
    print_info "重新加载 Nginx..."
    ssh $SERVER_USER@$SERVER_IP "systemctl reload nginx"
    if [ $? -eq 0 ]; then
        print_success "Nginx 重新加载完成"
    else
        print_error "Nginx 重新加载失败"
        print_info "请手动执行: ssh root@$SERVER_IP 'systemctl reload nginx'"
    fi
else
    print_error "Nginx 配置有误"
    print_info "请检查 Nginx 配置文件"
fi
echo ""

# 部署完成
echo "=========================================="
print_success "部署完成！"
echo "=========================================="
echo ""
print_info "访问地址："
echo "  HTTP:  http://$SERVER_IP"
echo "  HTTP:  http://www.lovetest.asia"
echo ""
print_info "查看日志："
echo "  ssh root@$SERVER_IP 'tail -f /var/log/nginx/financial-toolbox-access.log'"
echo ""
