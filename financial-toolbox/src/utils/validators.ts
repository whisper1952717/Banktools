/**
 * 验证函数库
 * 用于输入数据的验证
 */

import { VALIDATION_RULES } from '../constants/config';
import type { CashFlowItem, ValidationResult } from '../types';

/**
 * 验证本金
 * @param value - 本金金额
 * @returns 验证结果
 */
export function validatePrincipal(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: '请输入有效的本金金额',
    };
  }

  if (value < VALIDATION_RULES.principal.min) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.principal.errorMessage,
    };
  }

  if (value > VALIDATION_RULES.principal.max) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.principal.errorMessage,
    };
  }

  return { isValid: true };
}

/**
 * 验证利率
 * @param value - 利率（小数形式，如0.03表示3%）
 * @returns 验证结果
 */
export function validateRate(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: '请输入有效的利率',
    };
  }

  if (value < VALIDATION_RULES.rate.min) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.rate.errorMessage,
    };
  }

  if (value > VALIDATION_RULES.rate.max) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.rate.errorMessage,
    };
  }

  return { isValid: true };
}

/**
 * 验证年限
 * @param value - 投资年限
 * @returns 验证结果
 */
export function validateYears(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: '请输入有效的年限',
    };
  }

  if (!Number.isInteger(value)) {
    return {
      isValid: false,
      errorMessage: '年限必须是整数',
    };
  }

  if (value < VALIDATION_RULES.years.min) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.years.errorMessage,
    };
  }

  if (value > VALIDATION_RULES.years.max) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.years.errorMessage,
    };
  }

  return { isValid: true };
}

/**
 * 验证现金流金额
 * @param value - 现金流金额
 * @returns 验证结果
 */
export function validateCashFlowAmount(value: number): ValidationResult {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: '请输入有效的金额',
    };
  }

  if (value < VALIDATION_RULES.cashFlowAmount.min) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.cashFlowAmount.errorMessage,
    };
  }

  if (value > VALIDATION_RULES.cashFlowAmount.max) {
    return {
      isValid: false,
      errorMessage: VALIDATION_RULES.cashFlowAmount.errorMessage,
    };
  }

  return { isValid: true };
}

/**
 * 验证现金流数组
 * @param cashFlows - 现金流数组
 * @returns 验证结果
 */
export function validateCashFlows(cashFlows: CashFlowItem[]): ValidationResult {
  if (!cashFlows || cashFlows.length === 0) {
    return {
      isValid: false,
      errorMessage: '请至少添加一个现金流条目',
    };
  }

  if (cashFlows.length < 2) {
    return {
      isValid: false,
      errorMessage: '至少需要2个现金流条目才能计算IRR',
    };
  }

  // 验证每个现金流条目
  for (let i = 0; i < cashFlows.length; i++) {
    const cf = cashFlows[i];

    // 验证年份
    if (cf.year === null || cf.year === undefined || isNaN(cf.year)) {
      return {
        isValid: false,
        errorMessage: `第${i + 1}个现金流的年份无效`,
      };
    }

    if (cf.year < 0) {
      return {
        isValid: false,
        errorMessage: `第${i + 1}个现金流的年份不能为负数`,
      };
    }

    // 验证金额
    const amountValidation = validateCashFlowAmount(cf.amount);
    if (!amountValidation.isValid) {
      return {
        isValid: false,
        errorMessage: `第${i + 1}个现金流：${amountValidation.errorMessage}`,
      };
    }
  }

  // 检查是否有正负现金流
  const hasPositive = cashFlows.some((cf) => cf.amount > 0);
  const hasNegative = cashFlows.some((cf) => cf.amount < 0);

  if (!hasPositive) {
    return {
      isValid: false,
      errorMessage: '现金流必须包含至少一个正值（回报）',
    };
  }

  if (!hasNegative) {
    return {
      isValid: false,
      errorMessage: '现金流必须包含至少一个负值（投入）',
    };
  }

  // 检查年份是否有重复
  const years = cashFlows.map((cf) => cf.year);
  const uniqueYears = new Set(years);
  if (years.length !== uniqueYears.size) {
    return {
      isValid: false,
      errorMessage: '现金流的年份不能重复',
    };
  }

  return { isValid: true };
}

/**
 * 验证复利计算器的所有输入
 * @param principal - 本金
 * @param simpleRate - 单利利率
 * @param compoundRate - 复利利率
 * @param years - 年限
 * @returns 验证结果
 */
export function validateCompoundCalculatorInputs(
  principal: number,
  simpleRate: number,
  compoundRate: number,
  years: number
): ValidationResult {
  // 验证本金
  const principalValidation = validatePrincipal(principal);
  if (!principalValidation.isValid) {
    return principalValidation;
  }

  // 验证单利利率
  const simpleRateValidation = validateRate(simpleRate);
  if (!simpleRateValidation.isValid) {
    return {
      isValid: false,
      errorMessage: `单利利率：${simpleRateValidation.errorMessage}`,
    };
  }

  // 验证复利利率
  const compoundRateValidation = validateRate(compoundRate);
  if (!compoundRateValidation.isValid) {
    return {
      isValid: false,
      errorMessage: `复利利率：${compoundRateValidation.errorMessage}`,
    };
  }

  // 验证年限
  const yearsValidation = validateYears(years);
  if (!yearsValidation.isValid) {
    return yearsValidation;
  }

  return { isValid: true };
}
