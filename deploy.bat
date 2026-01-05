@echo off
REM ========================================
REM 金融工具箱 - 阿里云 ECS 自动部署脚本 (Windows)
REM ========================================

REM 配置变量（请根据实际情况修改）
set SERVER_IP=47.96.251.147
set SERVER_USER=root
set DEPLOY_PATH=/www/program/金融工具箱/financial-calculation-tools
set PROJECT_DIR=financial-toolbox

echo ==========================================
echo 开始部署金融工具箱到阿里云 ECS
echo ==========================================
echo.

REM 检查配置
if "%SERVER_IP%"=="your-server-ip" (
    echo [错误] 请先在脚本中配置 SERVER_IP
    pause
    exit /b 1
)

REM 检查项目目录
if not exist "%PROJECT_DIR%" (
    echo [错误] 项目目录 %PROJECT_DIR% 不存在
    pause
    exit /b 1
)

cd %PROJECT_DIR%
echo [成功] 进入项目目录: %PROJECT_DIR%
echo.

REM 运行测试
echo [信息] 运行测试...
call npm run test:run
if errorlevel 1 (
    echo [错误] 测试失败，部署终止
    pause
    exit /b 1
)
echo [成功] 测试通过
echo.

REM 构建项目
echo [信息] 构建项目...
call npm run build
if errorlevel 1 (
    echo [错误] 构建失败，部署终止
    pause
    exit /b 1
)
echo [成功] 构建完成
echo.

REM 检查 dist 目录
if not exist "dist" (
    echo [错误] dist 目录不存在，构建可能失败
    pause
    exit /b 1
)

REM 备份服务器上的旧版本
echo [信息] 备份服务器上的旧版本...
ssh %SERVER_USER%@%SERVER_IP% "if [ -d %DEPLOY_PATH% ] && [ \"$(ls -A %DEPLOY_PATH%)\" ]; then BACKUP_NAME=%DEPLOY_PATH%.backup.$(date +%%Y%%m%%d_%%H%%M%%S); cp -r %DEPLOY_PATH% $BACKUP_NAME; echo '备份已保存到: '$BACKUP_NAME; else echo '没有旧版本需要备份'; fi"
echo [成功] 备份完成
echo.

REM 上传文件到服务器
echo [信息] 上传文件到服务器...
scp -r dist\* %SERVER_USER%@%SERVER_IP%:%DEPLOY_PATH%/
if errorlevel 1 (
    echo [错误] 上传失败
    pause
    exit /b 1
)
echo [成功] 上传完成
echo.

REM 设置文件权限
echo [信息] 设置文件权限...
ssh %SERVER_USER%@%SERVER_IP% "chown -R nginx:nginx %DEPLOY_PATH% && chmod -R 755 %DEPLOY_PATH%"
if errorlevel 1 (
    echo [错误] 权限设置失败
    pause
    exit /b 1
)
echo [成功] 权限设置完成
echo.

REM 测试 Nginx 配置
echo [信息] 测试 Nginx 配置...
ssh %SERVER_USER%@%SERVER_IP% "nginx -t"
if errorlevel 1 (
    echo [错误] Nginx 配置测试失败
    pause
    exit /b 1
)
echo [成功] Nginx 配置正常
echo.

REM 重启 Nginx
echo [信息] 重新加载 Nginx...
ssh %SERVER_USER%@%SERVER_IP% "systemctl reload nginx"
if errorlevel 1 (
    echo [错误] Nginx 重启失败
    pause
    exit /b 1
)
echo [成功] Nginx 重新加载完成
echo.

REM 清理旧备份
echo [信息] 清理旧备份...
ssh %SERVER_USER%@%SERVER_IP% "cd $(dirname %DEPLOY_PATH%) && ls -dt %DEPLOY_PATH%.backup.* 2>/dev/null | tail -n +6 | xargs rm -rf && echo '旧备份已清理'"
echo.

REM 部署完成
echo ==========================================
echo [成功] 部署成功！
echo ==========================================
echo.
echo [信息] 部署信息：
echo   服务器: %SERVER_IP%
echo   部署路径: %DEPLOY_PATH%
echo   部署时间: %date% %time%
echo.
echo [信息] 后续步骤：
echo   1. 访问网站验证部署是否成功
echo   2. 检查 Nginx 日志
echo   3. 如有问题，可以恢复备份
echo.
pause
