# 快速部署指南

## 📝 本次更新内容

### 1. 复利计算器优化
- ✅ 扩展了物品对比范围，支持更高价值的对比
- 新增对比项：
  - 1000万以上：北京二环内房产
  - 500万以上：上海内环房产
  - 300万以上：保时捷911
  - 200万以上：奔驰S级
  - 150万以上：宝马7系
  - 100万以上：奥迪A6L
  - 80万以上：宝马5系（原有）

### 2. IRR计算器优化
- ✅ 移除了现金流输入框的默认值
- 现在默认只有2个空白现金流条目（期数0和1，金额为0）
- 用户需要自己输入数据，更加灵活

### 3. 本金默认值
- ✅ 已确认本金默认值为100万（无需修改）

---

## 🚀 部署步骤

### 方式一：在服务器上部署（推荐）

```bash
# 1. 连接到服务器
ssh root@47.96.251.147

# 2. 进入项目目录
cd /www/program/金融工具箱/financial-calculation-tools

# 3. 拉取最新代码
git pull

# 4. 进入 financial-toolbox 目录
cd financial-toolbox

# 5. 运行部署脚本
./deploy-simple.sh
```

**注意**：如果服务器内存不足导致构建失败，请先增加 swap 空间：

```bash
# 增加 swap（只需执行一次）
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox
chmod +x add-swap.sh
sudo ./add-swap.sh

# 然后再运行部署
./deploy-simple.sh
```

---

### 方式二：本地构建后上传

如果服务器构建太慢或内存不足，可以在本地构建：

```bash
# 1. 在本地项目目录
cd financial-toolbox

# 2. 安装依赖（如果还没安装）
npm install

# 3. 构建项目
npm run build

# 4. 上传 dist 目录到服务器
scp -r dist root@47.96.251.147:/tmp/financial-toolbox-dist

# 5. 在服务器上部署
ssh root@47.96.251.147
cd /www/program/金融工具箱/financial-calculation-tools
rm -rf assets index.html robots.txt vite.svg _redirects
cp -r /tmp/financial-toolbox-dist/* .
chown -R nginx:nginx .
chmod -R 755 .
systemctl reload nginx
```

---

## ✅ 验证部署

部署完成后，访问以下地址验证：

1. **通过 IP 访问**：http://47.96.251.147
2. **通过域名访问**：http://www.lovetest.asia 或 https://www.lovetest.asia

### 测试复利计算器
1. 进入"复利计算"页面
2. 输入本金：1亿元（100000000）
3. 单利利率：2.5%
4. 复利利率：3.5%
5. 投资年限：10年
6. 点击"开始计算"
7. 查看"收益差额"下方的对比文本，应该显示高价值物品（如房产、豪车等）

### 测试 IRR 计算器
1. 进入"IRR计算"页面
2. 确认现金流输入框默认只有2行，且金额都为0
3. 输入自己的现金流数据进行测试

---

## 📊 修改的文件

- `financial-toolbox/src/utils/formatters.ts` - 扩展物品对比范围
- `financial-toolbox/src/pages/IRRCalculator/IRRCalculator.tsx` - 移除默认现金流数据

---

## 🆘 遇到问题？

### 问题1：git pull 失败
```bash
# 如果有本地修改冲突
git stash
git pull
git stash pop
```

### 问题2：构建内存不足
```bash
# 增加 swap 空间
cd /www/program/金融工具箱/financial-calculation-tools/financial-toolbox
chmod +x add-swap.sh
sudo ./add-swap.sh
```

### 问题3：权限问题
```bash
# 设置正确的权限
sudo chown -R nginx:nginx /www/program/金融工具箱/financial-calculation-tools
sudo chmod -R 755 /www/program/金融工具箱/financial-calculation-tools
```

### 问题4：Nginx 未生效
```bash
# 重启 Nginx
sudo systemctl reload nginx

# 或者强制重启
sudo systemctl restart nginx
```

---

## 📞 需要帮助？

查看日志：
```bash
# Nginx 错误日志
tail -f /var/log/nginx/error.log

# 或者宝塔面板的日志
tail -f /www/wwwlogs/lovetest.asia.error.log
```

---

**祝部署顺利！** 🎉
