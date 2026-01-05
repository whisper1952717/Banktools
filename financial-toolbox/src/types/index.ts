/**
 * 全局类型定义
 */

/**
 * 现金流项目接口
 */
export interface CashFlowItem {
  year: number; // 年份/期数（0-based）
  amount: number; // 金额（负数=投入，正数=回报）
}

/**
 * 现金流周期类型
 */
export type CashFlowPeriod = 'yearly' | 'quarterly' | 'monthly';

/**
 * IRR计算结果接口
 */
export interface IRRResult {
  irr: number | null; // IRR值（小数形式，按周期）
  irrPercentage: string; // IRR百分比字符串
  annualizedIRR?: number | null; // 年化IRR值
  annualizedIRRPercentage?: string; // 年化IRR百分比字符串
  isValid: boolean; // 是否有有效解
  errorMessage?: string; // 错误消息
}

/**
 * MIRR计算结果接口（修正内部收益率）
 */
export interface MIRRResult {
  mirr: number | null; // MIRR值（小数形式）
  mirrPercentage: string; // MIRR百分比字符串
  npv: number | null; // 净现值
  isValid: boolean; // 是否有有效解
  errorMessage?: string; // 错误消息
}

/**
 * 进阶版IRR参数接口
 */
export interface AdvancedIRRParams {
  discountRate: number; // 折现率（资本成本）
  financeRate: number; // 融资利率（负现金流的成本）
  reinvestRate: number; // 再投资利率（正现金流的收益）
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
