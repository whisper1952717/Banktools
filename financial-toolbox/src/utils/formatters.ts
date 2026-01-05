/**
 * 格式化工具函数
 * 用于数字、百分比、货币等的格式化显示
 */

/**
 * 格式化数字，添加千位分隔符
 * @param value - 要格式化的数字
 * @param precision - 小数位数，默认0
 * @returns 格式化后的字符串
 */
export function formatNumber(value: number, precision: number = 0): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/**
 * 格式化百分比
 * @param value - 小数形式的值（如0.08表示8%）
 * @param precision - 小数位数，默认2
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, precision: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }

  const percentage = (value * 100).toFixed(precision);
  return `${percentage}%`;
}

/**
 * 生成差额对比文本
 * @param difference - 差额金额
 * @returns 可读的对比文本
 */
export function generateComparisonText(difference: number): string {
  if (difference < 0) {
    return '收益为负';
  }

  // 使用中国热门车型作为参考
  if (difference >= 800000) {
    return `相当于一辆宝马5系（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 600000) {
    return `相当于一辆奔驰C级（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 400000) {
    return `相当于一辆理想L7（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 300000) {
    return `相当于一辆特斯拉Model 3（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 200000) {
    return `相当于一辆小米SU7（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 150000) {
    return `相当于一辆比亚迪汉（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 100000) {
    return `相当于一辆本田雅阁（约${Math.floor(difference / 10000)}万） 💰`;
  }

  if (difference >= 10000) {
    const value = (difference / 10000).toFixed(1);
    return `相当于${value}万元`;
  }

  if (difference >= 1000) {
    const value = (difference / 1000).toFixed(1);
    return `相当于${value}千元`;
  }

  return `相当于${difference.toFixed(0)}元`;
}

/**
 * 生成IRR解读文本
 * @param irr - IRR值（小数形式）
 * @returns 解读文本
 */
export function interpretIRR(irr: number): string {
  const percentage = (irr * 100).toFixed(2);

  if (irr > 0.05) {
    return `年化收益率为${percentage}%，优于银行定存（约2-3%） 📈`;
  } else if (irr > 0.02) {
    return `年化收益率为${percentage}%，与银行定存相当 📊`;
  } else if (irr > 0) {
    return `年化收益率为${percentage}%，低于银行定存 📉`;
  } else {
    return `年化收益率为${percentage}%，投资亏损 ⚠️`;
  }
}

/**
 * 格式化货币金额（人民币）
 * @param value - 金额
 * @param showUnit - 是否显示单位，默认true
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(value: number, showUnit: boolean = true): string {
  const formatted = formatNumber(value, 2);
  return showUnit ? `¥${formatted}` : formatted;
}

/**
 * 格式化大额数字（万、亿）
 * @param value - 数字
 * @returns 格式化后的字符串
 */
export function formatLargeNumber(value: number): string {
  if (value >= 100000000) {
    // 亿
    return `${(value / 100000000).toFixed(2)}亿`;
  } else if (value >= 10000) {
    // 万
    return `${(value / 10000).toFixed(2)}万`;
  } else {
    return formatNumber(value, 2);
  }
}
