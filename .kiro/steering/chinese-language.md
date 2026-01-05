---
inclusion: always
---

# 中文语言要求

## 语言规范

在本项目中，所有文档、代码注释、用户界面文本和交流都必须使用中文。

### 适用范围

- 需求文档（requirements.md）
- 设计文档（design.md）
- 任务列表（tasks.md）
- 代码注释
- 用户界面文本
- 变量和函数命名可使用英文，但必须添加中文注释说明

### 示例

```javascript
// 正确示例
/**
 * 计算复利收益
 * @param {number} principal - 本金
 * @param {number} rate - 年利率
 * @param {number} years - 投资年限
 * @returns {number} 最终金额
 */
function calculateCompoundInterest(principal, rate, years) {
  // 使用复利公式: A = P(1 + r)^t
  return principal * Math.pow(1 + rate, years);
}
```

### 文档格式

- 所有规格说明文档使用中文撰写
- 技术术语可保留英文，但需在首次出现时提供中文解释
- 用户故事和验收标准必须使用中文
