@echo off
REM ========================================
REM 一键快速部署脚本 (Windows)
REM 服务器: 47.96.251.147
REM 域名: www.lovetest.asia
REM ========================================

set SERVER_IP=47.96.251.147
set DOMAIN=www.lovetest.asia

echo ==========================================
echo 金融工具箱 - 一键部署
echo ==========================================
echo.
echo [信息] 服务器: %SERVER_IP%
echo [信息] 域名: %DOMAIN%
echo.

REM 检查是否首次部署
echo [步骤] 检查部署状态...
ssh -o ConnectTimeout=5 root@%SERVER_IP% "test -d /www/program/金融工具箱/financial-calculation-tools" 2>nul
if errorlevel 1 (
    echo [信息] 检测到首次部署，需要初始化服务器
    echo.
    
    echo [步骤] 第一步：初始化服务器
    echo [信息] 上传服务器配置脚本...
    scp financial-toolbox/server-setup.sh root@%SERVER_IP%:/root/
    if errorlevel 1 (
        echo [错误] 上传失败，请检查 SSH 连接
        pause
        exit /b 1
    )
    
    echo [信息] 运行服务器配置脚本（需要几分钟）...
    ssh root@%SERVER_IP% "chmod +x /root/server-setup.sh && /root/server-setup.sh"
    if errorlevel 1 (
        echo [错误] 服务器配置失败
        pause
        exit /b 1
    )
    echo [成功] 服务器初始化完成
    echo.
    
    echo [步骤] 第二步：配置 Nginx
    echo [信息] 上传 Nginx 配置...
    scp financial-toolbox/nginx.conf root@%SERVER_IP%:/etc/nginx/conf.d/financial-toolbox.conf
    if errorlevel 1 (
        echo [错误] Nginx 配置上传失败
        pause
        exit /b 1
    )
    
    echo [信息] 测试 Nginx 配置...
    ssh root@%SERVER_IP% "nginx -t"
    if errorlevel 1 (
        echo [错误] Nginx 配置有误
        pause
        exit /b 1
    )
    
    echo [信息] 重新加载 Nginx...
    ssh root@%SERVER_IP% "systemctl reload nginx"
    echo [成功] Nginx 配置完成
    echo.
)

REM 部署网站
echo [步骤] 第三步：部署网站
echo [信息] 运行部署脚本...
call deploy.bat
if errorlevel 1 (
    echo [错误] 部署失败
    pause
    exit /b 1
)

echo.
echo ==========================================
echo [成功] 部署完成！
echo ==========================================
echo.
echo [信息] 访问地址：
echo   HTTP:  http://%SERVER_IP%
echo   HTTP:  http://%DOMAIN%
echo.
echo [信息] 配置 HTTPS（推荐）：
echo   ssh root@%SERVER_IP%
echo   certbot --nginx -d www.lovetest.asia -d lovetest.asia
echo.
echo [信息] 查看日志：
echo   ssh root@%SERVER_IP% "tail -f /var/log/nginx/financial-toolbox-access.log"
echo.
pause
