# 解决构建时内存不足问题

## 🔴 问题症状

构建时出现以下错误：
```bash
./deploy-simple.sh: line 70: 34039 Killed    npm run build
```

这表示构建进程被系统杀死，原因是**内存不足**。

---

## ✅ 解决方案：扩大 Swap 空间

### 方法 1：使用自动脚本（推荐）

```bash
# 1. 连接到服务器
ssh root@47.96.251.147

# 2. 进入项目目录
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox

# 3. 运行 swap 扩容脚本
chmod +x add-swap.sh
sudo ./add-swap.sh

# 4. 按提示输入 swap 大小
# 推荐输入: 4 或 6 (GB)

# 5. 等待完成后，重新运行部署
./deploy-simple.sh
```

### 方法 2：手动扩大 Swap

```bash
# 1. 关闭现有 swap
sudo swapoff /swapfile

# 2. 删除旧文件
sudo rm /swapfile

# 3. 创建 4GB swap（可以改为 6 或 8）
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096 status=progress

# 4. 设置权限
sudo chmod 600 /swapfile

# 5. 格式化为 swap
sudo mkswap /swapfile

# 6. 启用 swap
sudo swapon /swapfile

# 7. 验证
free -h
swapon --show

# 8. 添加到 fstab（开机自动挂载）
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab

# 9. 优化 swap 使用策略
sudo sysctl vm.swappiness=10
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
```

---

## 📊 推荐 Swap 大小

根据服务器内存选择：

| 物理内存 | 推荐 Swap | 说明 |
|---------|----------|------|
| 512MB - 1GB | 4GB | 最小配置 |
| 1GB - 2GB | 4-6GB | 标准配置 |
| 2GB - 4GB | 2-4GB | 较好配置 |
| 4GB+ | 2GB | 充足配置 |

**对于当前项目**：推荐使用 **4GB** 或 **6GB** swap。

---

## 🔍 验证 Swap 是否生效

```bash
# 查看内存和 swap 状态
free -h

# 应该看到类似输出：
#               total        used        free      shared  buff/cache   available
# Mem:           1.7Gi       800Mi       200Mi        10Mi       700Mi       800Mi
# Swap:          4.0Gi         0Bi       4.0Gi
#                ^^^^ 这里应该显示你设置的大小

# 查看 swap 详情
swapon --show

# 应该看到：
# NAME      TYPE SIZE USED PRIO
# /swapfile file 4G   0B   -2
```

---

## 🚀 重新部署

Swap 扩容完成后：

```bash
# 进入项目目录
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox

# 运行部署脚本
./deploy-simple.sh
```

构建过程可能需要 2-5 分钟，请耐心等待。

---

## 💡 其他优化建议

### 1. 监控构建过程

在另一个终端窗口监控内存使用：
```bash
# 实时查看内存使用
watch -n 1 free -h

# 或者查看进程
top
```

### 2. 如果还是失败

如果扩大到 6GB swap 还是失败，可以考虑：

**选项 A：在本地构建后上传**
```bash
# 在本地电脑上
cd financial-toolbox
npm install
npm run build

# 将 dist 目录打包
tar -czf dist.tar.gz dist/

# 上传到服务器
scp dist.tar.gz root@47.96.251.147:/tmp/

# 在服务器上解压
ssh root@47.96.251.147
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox
tar -xzf /tmp/dist.tar.gz
# 然后手动复制文件到部署目录
```

**选项 B：升级服务器配置**
- 增加服务器内存（推荐至少 2GB）

---

## 📝 常见问题

### Q: Swap 会影响性能吗？
A: 会有轻微影响，但我们设置了 `swappiness=10`，优先使用物理内存。Swap 主要用于构建时的临时需求。

### Q: 需要多大的磁盘空间？
A: 创建 4GB swap 需要 4GB 磁盘空间。确保服务器有足够的可用空间：
```bash
df -h
```

### Q: Swap 是永久的吗？
A: 是的，我们已经添加到 `/etc/fstab`，重启后会自动挂载。

---

## ✅ 成功标志

部署成功后，你会看到：
```
✅ 构建完成
✅ 构建产物验证通过
✅ 文件部署完成
✅ 权限设置完成
✅ Nginx 重新加载完成
✅ 部署验证通过
==========================================
✅ 部署完成！
==========================================
```

然后可以访问：
- http://47.96.251.147
- http://www.lovetest.asia

---

**祝部署顺利！** 🚀
