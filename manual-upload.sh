#!/bin/bash

# ========================================
# 手动上传脚本（用于排查问题）
# ========================================

SERVER_IP="47.96.251.147"
SERVER_USER="root"
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"

echo "=========================================="
echo "手动上传文件到服务器"
echo "=========================================="
echo ""

# 检查 dist 目录
if [ ! -d "financial-toolbox/dist" ]; then
    echo "❌ dist 目录不存在，请先构建项目"
    echo "   cd financial-toolbox && npm run build"
    exit 1
fi

echo "✅ dist 目录存在"
echo ""

# 方式1：使用 rsync（忽略退出码 24）
echo "方式1：使用 rsync 上传..."
rsync -avz --delete financial-toolbox/dist/ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/
RSYNC_EXIT=$?

if [ $RSYNC_EXIT -eq 0 ] || [ $RSYNC_EXIT -eq 24 ]; then
    echo "✅ rsync 上传完成（退出码: $RSYNC_EXIT）"
    
    # 设置权限
    echo ""
    echo "设置文件权限..."
    ssh $SERVER_USER@$SERVER_IP "chown -R nginx:nginx $DEPLOY_PATH && chmod -R 755 $DEPLOY_PATH"
    
    if [ $? -eq 0 ]; then
        echo "✅ 权限设置完成"
        echo ""
        echo "=========================================="
        echo "✅ 上传成功！"
        echo "=========================================="
        echo ""
        echo "访问地址："
        echo "  http://47.96.251.147"
        echo "  http://www.lovetest.asia"
        exit 0
    else
        echo "❌ 权限设置失败"
        exit 1
    fi
else
    echo "❌ rsync 上传失败（退出码: $RSYNC_EXIT）"
    echo ""
    echo "尝试方式2：使用 scp 上传..."
    
    # 方式2：使用 scp
    echo "创建临时压缩包..."
    cd financial-toolbox
    tar -czf ../dist.tar.gz dist/
    cd ..
    
    echo "上传压缩包..."
    scp dist.tar.gz $SERVER_USER@$SERVER_IP:/tmp/
    
    if [ $? -eq 0 ]; then
        echo "✅ 压缩包上传成功"
        
        echo "在服务器上解压..."
        ssh $SERVER_USER@$SERVER_IP "
            cd /tmp
            tar -xzf dist.tar.gz
            rm -rf $DEPLOY_PATH/*
            cp -r dist/* $DEPLOY_PATH/
            chown -R nginx:nginx $DEPLOY_PATH
            chmod -R 755 $DEPLOY_PATH
            rm -f dist.tar.gz
            rm -rf dist
        "
        
        if [ $? -eq 0 ]; then
            echo "✅ 解压和部署完成"
            rm -f dist.tar.gz
            echo ""
            echo "=========================================="
            echo "✅ 上传成功！"
            echo "=========================================="
            echo ""
            echo "访问地址："
            echo "  http://47.96.251.147"
            echo "  http://www.lovetest.asia"
            exit 0
        else
            echo "❌ 服务器端操作失败"
            rm -f dist.tar.gz
            exit 1
        fi
    else
        echo "❌ scp 上传失败"
        rm -f dist.tar.gz
        exit 1
    fi
fi
