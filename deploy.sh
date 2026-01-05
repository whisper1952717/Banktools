#!/bin/bash

# ========================================
# 金融工具箱 - 阿里云 ECS 自动部署脚本
# ========================================

# 配置变量（请根据实际情况修改）
SERVER_IP="47.96.251.147"                # 服务器 IP 地址
SERVER_USER="root"                       # SSH 用户名
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools" # 部署路径
PROJECT_DIR="financial-toolbox"          # 项目目录

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装"
        exit 1
    fi
}

# 开始部署
echo "=========================================="
echo "开始部署金融工具箱到阿里云 ECS"
echo "=========================================="
echo ""

# 检查必要的命令
print_info "检查必要的工具..."
check_command "npm"
check_command "ssh"
check_command "rsync"
print_success "工具检查完成"
echo ""

# 检查配置
if [ "$SERVER_IP" = "your-server-ip" ]; then
    print_error "请先在脚本中配置 SERVER_IP"
    exit 1
fi

# 进入项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "项目目录 $PROJECT_DIR 不存在"
    exit 1
fi

cd $PROJECT_DIR
print_success "进入项目目录: $PROJECT_DIR"
echo ""

# 检查是否有未提交的更改（可选）
if command -v git &> /dev/null; then
    if [ -n "$(git status --porcelain)" ]; then
        print_info "检测到未提交的更改"
        read -p "是否继续部署？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "部署已取消"
            exit 1
        fi
    fi
fi

# 运行测试
print_info "运行测试..."
npm run test:run
if [ $? -ne 0 ]; then
    print_error "测试失败，部署终止"
    exit 1
fi
print_success "测试通过"
echo ""

# 构建项目
print_info "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    print_error "构建失败，部署终止"
    exit 1
fi
print_success "构建完成"
echo ""

# 检查 dist 目录
if [ ! -d "dist" ]; then
    print_error "dist 目录不存在，构建可能失败"
    exit 1
fi

# 测试服务器连接
print_info "测试服务器连接..."
ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo '连接成功'" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_error "无法连接到服务器 $SERVER_IP"
    exit 1
fi
print_success "服务器连接正常"
echo ""

# 备份服务器上的旧版本
print_info "备份服务器上的旧版本..."
ssh $SERVER_USER@$SERVER_IP "
    if [ -d $DEPLOY_PATH ] && [ \"\$(ls -A $DEPLOY_PATH)\" ]; then
        BACKUP_NAME=$DEPLOY_PATH.backup.\$(date +%Y%m%d_%H%M%S)
        cp -r $DEPLOY_PATH \$BACKUP_NAME
        echo '备份已保存到: '\$BACKUP_NAME
    else
        echo '没有旧版本需要备份'
    fi
"
print_success "备份完成"
echo ""

# 上传文件到服务器
print_info "上传文件到服务器..."
rsync -avz --delete --progress dist/ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
if [ $? -ne 0 ]; then
    print_error "上传失败"
    exit 1
fi
print_success "上传完成"
echo ""

# 设置文件权限
print_info "设置文件权限..."
ssh $SERVER_USER@$SERVER_IP "
    chown -R nginx:nginx $DEPLOY_PATH
    chmod -R 755 $DEPLOY_PATH
"
if [ $? -ne 0 ]; then
    print_error "权限设置失败"
    exit 1
fi
print_success "权限设置完成"
echo ""

# 测试 Nginx 配置
print_info "测试 Nginx 配置..."
ssh $SERVER_USER@$SERVER_IP "nginx -t"
if [ $? -ne 0 ]; then
    print_error "Nginx 配置测试失败"
    exit 1
fi
print_success "Nginx 配置正常"
echo ""

# 重启 Nginx
print_info "重新加载 Nginx..."
ssh $SERVER_USER@$SERVER_IP "systemctl reload nginx"
if [ $? -ne 0 ]; then
    print_error "Nginx 重启失败"
    exit 1
fi
print_success "Nginx 重新加载完成"
echo ""

# 清理旧备份（保留最近 5 个）
print_info "清理旧备份..."
ssh $SERVER_USER@$SERVER_IP "
    cd \$(dirname $DEPLOY_PATH)
    ls -dt $DEPLOY_PATH.backup.* 2>/dev/null | tail -n +6 | xargs rm -rf
    echo '旧备份已清理'
"
echo ""

# 部署完成
echo "=========================================="
print_success "部署成功！"
echo "=========================================="
echo ""
print_info "部署信息："
echo "  服务器: $SERVER_IP"
echo "  部署路径: $DEPLOY_PATH"
echo "  部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
print_info "后续步骤："
echo "  1. 访问网站验证部署是否成功"
echo "  2. 检查 Nginx 日志: tail -f /var/log/nginx/financial-toolbox-access.log"
echo "  3. 如有问题，可以恢复备份"
echo ""
