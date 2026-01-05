/**
 * 计算函数库
 * 包含复利、单利、IRR等金融计算
 */

import Decimal from 'decimal.js';
import type { CashFlowItem, IRRResult, MIRRResult, CashFlowPeriod } from '../types';

/**
 * 计算单利
 * 公式：A = P(1 + rt)
 * @param principal - 本金
 * @param rate - 年利率（小数形式，如0.03表示3%）
 * @param years - 年数
 * @returns 最终金额
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  years: number
): number {
  // 使用Decimal.js确保精度
  const p = new Decimal(principal);
  const r = new Decimal(rate);
  const t = new Decimal(years);

  // A = P(1 + rt)
  const result = p.times(r.times(t).plus(1));

  return result.toNumber();
}

/**
 * 计算复利
 * 公式：A = P(1 + r)^t
 * @param principal - 本金
 * @param rate - 年利率（小数形式）
 * @param years - 年数
 * @returns 最终金额
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number
): number {
  // 使用Decimal.js确保精度
  const p = new Decimal(principal);
  const r = new Decimal(rate);
  const t = new Decimal(years);

  // A = P(1 + r)^t
  const result = p.times(r.plus(1).pow(t));

  return result.toNumber();
}

/**
 * 生成复利和单利的逐年数据
 * @param principal - 本金
 * @param simpleRate - 单利利率
 * @param compoundRate - 复利利率
 * @param years - 年数
 * @returns 包含两种利息计算结果的数组
 */
export function generateInterestData(
  principal: number,
  simpleRate: number,
  compoundRate: number,
  years: number
): {
  simpleInterestData: Array<{ year: number; amount: number }>;
  compoundInterestData: Array<{ year: number; amount: number }>;
  finalSimpleAmount: number;
  finalCompoundAmount: number;
  difference: number;
} {
  const simpleInterestData: Array<{ year: number; amount: number }> = [];
  const compoundInterestData: Array<{ year: number; amount: number }> = [];

  // 生成每年的数据点
  for (let year = 0; year <= years; year++) {
    const simpleAmount = calculateSimpleInterest(principal, simpleRate, year);
    const compoundAmount = calculateCompoundInterest(principal, compoundRate, year);

    simpleInterestData.push({
      year,
      amount: Math.round(simpleAmount * 100) / 100, // 保留2位小数
    });

    compoundInterestData.push({
      year,
      amount: Math.round(compoundAmount * 100) / 100,
    });
  }

  const finalSimpleAmount = simpleInterestData[years].amount;
  const finalCompoundAmount = compoundInterestData[years].amount;
  const difference = finalCompoundAmount - finalSimpleAmount;

  return {
    simpleInterestData,
    compoundInterestData,
    finalSimpleAmount,
    finalCompoundAmount,
    difference,
  };
}

/**
 * 计算净现值（NPV）
 * @param cashFlows - 现金流数组
 * @param rate - 折现率
 * @returns 净现值
 */
export function calculateNPV(cashFlows: CashFlowItem[], rate: number): number {
  let npv = new Decimal(0);

  for (const { year, amount } of cashFlows) {
    const discountFactor = new Decimal(1 + rate).pow(year);
    const presentValue = new Decimal(amount).div(discountFactor);
    npv = npv.plus(presentValue);
  }

  return npv.toNumber();
}

/**
 * 使用牛顿-拉弗森法计算IRR（内部收益率）
 * @param cashFlows - 现金流数组
 * @param guess - 初始猜测值，默认0.1（10%）
 * @param maxIterations - 最大迭代次数，默认100
 * @param tolerance - 容差，默认0.00001
 * @returns IRR计算结果
 */
export function calculateIRR(
  cashFlows: CashFlowItem[],
  guess: number = 0.1,
  maxIterations: number = 100,
  tolerance: number = 0.00001
): IRRResult {
  // 验证输入
  if (!cashFlows || cashFlows.length < 2) {
    return {
      irr: null,
      irrPercentage: '0.00%',
      isValid: false,
      errorMessage: '至少需要2个现金流条目',
    };
  }

  // 检查是否有正负现金流
  const hasPositive = cashFlows.some((cf) => cf.amount > 0);
  const hasNegative = cashFlows.some((cf) => cf.amount < 0);

  if (!hasPositive || !hasNegative) {
    return {
      irr: null,
      irrPercentage: '0.00%',
      isValid: false,
      errorMessage: '现金流必须包含投入（负值）和回报（正值）',
    };
  }

  let rate = guess;

  // 牛顿-拉弗森迭代
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0; // NPV的导数

    // 计算NPV和其导数
    for (const { year, amount } of cashFlows) {
      const factor = Math.pow(1 + rate, year);
      npv += amount / factor;
      dnpv -= (year * amount) / Math.pow(1 + rate, year + 1);
    }

    // 检查收敛
    if (Math.abs(npv) < tolerance) {
      const irrPercentage = (rate * 100).toFixed(2) + '%';
      return {
        irr: rate,
        irrPercentage,
        isValid: true,
      };
    }

    // 检查导数是否为零（避免除零错误）
    if (Math.abs(dnpv) < 1e-10) {
      return {
        irr: null,
        irrPercentage: '0.00%',
        isValid: false,
        errorMessage: '无法计算IRR，请检查现金流数据',
      };
    }

    // 牛顿迭代：rate_new = rate_old - f(rate) / f'(rate)
    rate = rate - npv / dnpv;

    // 防止rate变成极端值
    if (rate < -0.99 || rate > 10) {
      return {
        irr: null,
        irrPercentage: '0.00%',
        isValid: false,
        errorMessage: 'IRR计算发散，请检查现金流数据',
      };
    }
  }

  // 未收敛
  return {
    irr: null,
    irrPercentage: '0.00%',
    isValid: false,
    errorMessage: 'IRR计算未收敛，请尝试调整现金流数据',
  };
}


/**
 * 将周期IRR转换为年化IRR
 * @param periodIRR - 周期IRR（小数形式）
 * @param period - 周期类型
 * @returns 年化IRR
 */
export function annualizeIRR(periodIRR: number, period: CashFlowPeriod): number {
  switch (period) {
    case 'monthly':
      // 月度IRR转年化：(1 + r)^12 - 1
      return Math.pow(1 + periodIRR, 12) - 1;
    case 'quarterly':
      // 季度IRR转年化：(1 + r)^4 - 1
      return Math.pow(1 + periodIRR, 4) - 1;
    case 'yearly':
    default:
      return periodIRR;
  }
}

/**
 * 获取周期对应的每年期数
 * @param period - 周期类型
 * @returns 每年期数
 */
export function getPeriodsPerYear(period: CashFlowPeriod): number {
  switch (period) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'yearly':
    default:
      return 1;
  }
}

/**
 * 计算带周期的IRR
 * @param cashFlows - 现金流数组
 * @param period - 周期类型
 * @param guess - 初始猜测值
 * @returns IRR计算结果（包含年化IRR）
 */
export function calculateIRRWithPeriod(
  cashFlows: CashFlowItem[],
  period: CashFlowPeriod = 'yearly',
  guess: number = 0.1
): IRRResult {
  // 先计算周期IRR
  const result = calculateIRR(cashFlows, guess);

  if (!result.isValid || result.irr === null) {
    return result;
  }

  // 计算年化IRR
  const annualizedIRR = annualizeIRR(result.irr, period);
  const annualizedIRRPercentage = (annualizedIRR * 100).toFixed(2) + '%';

  return {
    ...result,
    annualizedIRR,
    annualizedIRRPercentage,
  };
}

/**
 * 计算MIRR（修正内部收益率）
 * MIRR考虑了融资成本和再投资收益率的差异
 * 
 * 公式：MIRR = (FV正现金流 / PV负现金流)^(1/n) - 1
 * 其中：
 * - FV正现金流 = 所有正现金流按再投资利率复利到最后一期的终值
 * - PV负现金流 = 所有负现金流按融资利率折现到第0期的现值（取绝对值）
 * - n = 期数
 * 
 * @param cashFlows - 现金流数组
 * @param financeRate - 融资利率（负现金流的成本）
 * @param reinvestRate - 再投资利率（正现金流的收益）
 * @returns MIRR计算结果
 */
export function calculateMIRR(
  cashFlows: CashFlowItem[],
  financeRate: number,
  reinvestRate: number
): MIRRResult {
  // 验证输入
  if (!cashFlows || cashFlows.length < 2) {
    return {
      mirr: null,
      mirrPercentage: '0.00%',
      npv: null,
      isValid: false,
      errorMessage: '至少需要2个现金流条目',
    };
  }

  // 检查是否有正负现金流
  const hasPositive = cashFlows.some((cf) => cf.amount > 0);
  const hasNegative = cashFlows.some((cf) => cf.amount < 0);

  if (!hasPositive || !hasNegative) {
    return {
      mirr: null,
      mirrPercentage: '0.00%',
      npv: null,
      isValid: false,
      errorMessage: '现金流必须包含投入（负值）和回报（正值）',
    };
  }

  // 找到最大期数
  const maxPeriod = Math.max(...cashFlows.map((cf) => cf.year));

  // 计算负现金流的现值（按融资利率折现到第0期）
  let pvNegative = new Decimal(0);
  for (const { year, amount } of cashFlows) {
    if (amount < 0) {
      const discountFactor = new Decimal(1 + financeRate).pow(year);
      const presentValue = new Decimal(Math.abs(amount)).div(discountFactor);
      pvNegative = pvNegative.plus(presentValue);
    }
  }

  // 计算正现金流的终值（按再投资利率复利到最后一期）
  let fvPositive = new Decimal(0);
  for (const { year, amount } of cashFlows) {
    if (amount > 0) {
      const compoundFactor = new Decimal(1 + reinvestRate).pow(maxPeriod - year);
      const futureValue = new Decimal(amount).times(compoundFactor);
      fvPositive = fvPositive.plus(futureValue);
    }
  }

  // 检查是否可以计算
  if (pvNegative.isZero()) {
    return {
      mirr: null,
      mirrPercentage: '0.00%',
      npv: null,
      isValid: false,
      errorMessage: '负现金流现值为零，无法计算MIRR',
    };
  }

  // 计算MIRR
  // MIRR = (FV / PV)^(1/n) - 1
  const ratio = fvPositive.div(pvNegative);
  const mirr = Math.pow(ratio.toNumber(), 1 / maxPeriod) - 1;

  // 计算NPV（使用折现率）
  const npv = calculateNPV(cashFlows, financeRate);

  const mirrPercentage = (mirr * 100).toFixed(2) + '%';

  return {
    mirr,
    mirrPercentage,
    npv,
    isValid: true,
  };
}

/**
 * 计算带周期的MIRR
 * @param cashFlows - 现金流数组
 * @param financeRate - 融资利率（年化）
 * @param reinvestRate - 再投资利率（年化）
 * @param period - 周期类型
 * @returns MIRR计算结果
 */
export function calculateMIRRWithPeriod(
  cashFlows: CashFlowItem[],
  financeRate: number,
  reinvestRate: number,
  period: CashFlowPeriod = 'yearly'
): MIRRResult {
  // 将年化利率转换为周期利率
  const periodsPerYear = getPeriodsPerYear(period);
  const periodFinanceRate = Math.pow(1 + financeRate, 1 / periodsPerYear) - 1;
  const periodReinvestRate = Math.pow(1 + reinvestRate, 1 / periodsPerYear) - 1;

  // 计算周期MIRR
  const result = calculateMIRR(cashFlows, periodFinanceRate, periodReinvestRate);

  if (!result.isValid || result.mirr === null) {
    return result;
  }

  // 将周期MIRR转换为年化MIRR
  const annualizedMIRR = annualizeIRR(result.mirr, period);
  const annualizedMIRRPercentage = (annualizedMIRR * 100).toFixed(2) + '%';

  return {
    mirr: annualizedMIRR,
    mirrPercentage: annualizedMIRRPercentage,
    npv: result.npv,
    isValid: true,
  };
}
