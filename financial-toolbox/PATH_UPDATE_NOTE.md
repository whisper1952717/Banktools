# 部署路径更新说明

## ✅ 已更新

所有部署文档和脚本已更新为你的服务器实际路径：

### 新的部署路径
```
/www/program/金融工具箱/financial-calculation-tools
```

### 已更新的文件

#### 1. 部署脚本
- ✅ `deploy.sh` - Linux/Mac 部署脚本
- ✅ `deploy.bat` - Windows 部署脚本
- ✅ `server-setup.sh` - 服务器初始化脚本

#### 2. 配置文件
- ✅ `nginx.conf` - Nginx 配置模板

#### 3. 文档
- ✅ `DEPLOYMENT.md` - 完整部署指南
- ✅ `QUICK_DEPLOY.md` - 快速部署参考
- ✅ `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- ✅ `DEPLOYMENT_SUMMARY.md` - 部署方案总结
- ✅ `ARCHITECTURE.md` - 架构说明

## 📝 关键变更

### 部署脚本配置
```bash
# 旧路径
DEPLOY_PATH="/var/www/financial-toolbox"

# 新路径
DEPLOY_PATH="/www/program/金融工具箱/financial-calculation-tools"
```

### Nginx 配置
```nginx
# 旧配置
root /var/www/financial-toolbox;

# 新配置
root /www/program/金融工具箱/financial-calculation-tools;
```

### 备份脚本
```bash
# 旧路径
tar -czf $BACKUP_DIR/financial-toolbox-$DATE.tar.gz /var/www/financial-toolbox

# 新路径
tar -czf $BACKUP_DIR/financial-toolbox-$DATE.tar.gz /www/program/金融工具箱/financial-calculation-tools
```

## 🚀 使用说明

### 如果服务器已经存在该目录
如果你的服务器上已经有 `/www/program/金融工具箱/financial-calculation-tools` 目录：

1. **检查目录权限**
```bash
ls -la /www/program/金融工具箱/financial-calculation-tools
```

2. **如果目录不存在，创建它**
```bash
mkdir -p /www/program/金融工具箱/financial-calculation-tools
chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
chmod -R 755 /www/program/金融工具箱/financial-calculation-tools
```

3. **配置 Nginx**
```bash
# 编辑 Nginx 配置
vi /etc/nginx/conf.d/financial-toolbox.conf

# 确保 root 指向正确的路径
root /www/program/金融工具箱/financial-calculation-tools;
```

4. **测试并重启 Nginx**
```bash
nginx -t
systemctl reload nginx
```

### 如果需要从旧路径迁移
如果你之前使用的是 `/var/www/financial-toolbox`：

```bash
# 1. 复制文件到新路径
mkdir -p /www/program/金融工具箱
cp -r /var/www/financial-toolbox /www/program/金融工具箱/financial-calculation-tools

# 2. 设置权限
chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
chmod -R 755 /www/program/金融工具箱/financial-calculation-tools

# 3. 更新 Nginx 配置
vi /etc/nginx/conf.d/financial-toolbox.conf
# 修改 root 路径

# 4. 测试并重启 Nginx
nginx -t
systemctl reload nginx

# 5. 验证网站正常访问后，可以删除旧目录
# rm -rf /var/www/financial-toolbox
```

## ⚠️ 注意事项

### 1. 中文路径
路径中包含中文字符 `金融工具箱`，这在 Linux 系统中是支持的，但需要注意：
- 确保系统使用 UTF-8 编码
- SSH 客户端支持 UTF-8
- 在脚本中正确处理中文路径

### 2. 路径权限
确保整个路径链都有正确的权限：
```bash
# 检查路径权限
ls -la /www/
ls -la /www/program/
ls -la /www/program/金融工具箱/
ls -la /www/program/金融工具箱/financial-calculation-tools/
```

### 3. SELinux（如果启用）
如果服务器启用了 SELinux，可能需要设置上下文：
```bash
# 检查 SELinux 状态
getenforce

# 如果是 Enforcing，设置上下文
chcon -R -t httpd_sys_content_t /www/program/金融工具箱/financial-calculation-tools/
```

## ✅ 验证部署

部署完成后，验证以下内容：

1. **文件存在**
```bash
ls -la /www/program/金融工具箱/financial-calculation-tools/index.html
```

2. **权限正确**
```bash
# 应该显示 nginx:nginx 755
ls -la /www/program/金融工具箱/financial-calculation-tools/
```

3. **Nginx 配置正确**
```bash
nginx -t
grep "root" /etc/nginx/conf.d/financial-toolbox.conf
```

4. **网站可访问**
```bash
curl -I http://localhost
# 或访问浏览器测试
```

## 📞 遇到问题？

如果遇到路径相关的问题：

1. 检查路径是否正确创建
2. 检查权限设置
3. 检查 Nginx 配置
4. 查看 Nginx 错误日志：`tail -f /var/log/nginx/financial-toolbox-error.log`
5. 参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 的故障排查章节

---

**更新日期**: 2026年1月5日  
**路径**: `/www/program/金融工具箱/financial-calculation-tools`
