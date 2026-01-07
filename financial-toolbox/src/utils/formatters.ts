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

  // 使用中国热门车型和高价值物品作为参考（基于2024-2025年中配价格）
  if (difference >= 10000000) {
    // 1000万以上
    return `相当于一套北京二环内的房产（约${Math.floor(difference / 10000)}万） 🏠`;
  }

  if (difference >= 5000000) {
    // 500万以上
    return `相当于一套上海内环的房产（约${Math.floor(difference / 10000)}万） 🏠`;
  }

  if (difference >= 3000000) {
    // 300万以上 - 保时捷Panamera中配约300-350万
    return `相当于一辆保时捷Panamera（约${Math.floor(difference / 10000)}万） 🏎️`;
  }

  if (difference >= 2000000) {
    // 200万以上 - 宝马X7中配约200-250万
    return `相当于一辆宝马X7（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 1500000) {
    // 150万以上 - 保时捷911中配约150-180万
    return `相当于一辆保时捷911（约${Math.floor(difference / 10000)}万） 🏎️`;
  }

  if (difference >= 1100000) {
    // 110万以上 - 奔驰S级中配约110-130万
    return `相当于一辆奔驰S级（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 900000) {
    // 90万以上 - 宝马7系中配约90-110万
    return `相当于一辆宝马7系（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 700000) {
    // 70万以上 - 奥迪A8L中配约70-85万
    return `相当于一辆奥迪A8L（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 600000) {
    // 60万以上 - 奔驰E级中配约60-70万
    return `相当于一辆奔驰E级（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 500000) {
    // 50万以上 - 宝马5系中配约45-55万
    return `相当于一辆宝马5系（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 450000) {
    // 45万以上 - 蔚来ET7中配约45-50万
    return `相当于一辆蔚来ET7（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 400000) {
    // 40万以上 - 奥迪A6L中配约40-50万
    return `相当于一辆奥迪A6L（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 350000) {
    // 35万以上 - 理想L7中配约35-40万
    return `相当于一辆理想L7（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 320000) {
    // 32万以上 - 奔驰C级中配约32-38万
    return `相当于一辆奔驰C级（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 260000) {
    // 26万以上 - 特斯拉Model 3中配约26-30万
    return `相当于一辆特斯拉Model 3（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 220000) {
    // 22万以上 - 小米SU7中配约22-26万
    return `相当于一辆小米SU7（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 200000) {
    // 20万以上 - 本田雅阁中配约20-23万
    return `相当于一辆本田雅阁（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 180000) {
    // 18万以上 - 比亚迪汉中配约18-22万
    return `相当于一辆比亚迪汉（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 150000) {
    // 15万以上 - 大众迈腾中配约15-18万
    return `相当于一辆大众迈腾（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 120000) {
    // 12万以上 - 丰田卡罗拉中配约12-15万
    return `相当于一辆丰田卡罗拉（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 100000) {
    // 10万以上 - 比亚迪秦PLUS中配约10-12万
    return `相当于一辆比亚迪秦PLUS（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 80000) {
    // 8万以上 - 吉利帝豪中配约8-10万
    return `相当于一辆吉利帝豪（约${Math.floor(difference / 10000)}万） 🚗`;
  }

  if (difference >= 50000) {
    // 5万以上 - 五菱宏光MINIEV约3-5万
    return `相当于一辆五菱宏光MINIEV（约${Math.floor(difference / 10000)}万） 🚗`;
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
