/**
 * 验证函数属性测试
 * 使用fast-check进行属性测试
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validatePrincipal,
  validateRate,
  validateYears,
  validateCashFlows,
} from './validators';

/**
 * 属性测试1: 复利计算器输入验证
 * Feature: financial-toolbox, Property 1: 对于任何有效的输入值，
 * 验证函数应该返回isValid=true；对于无效输入，应该返回isValid=false并包含错误消息
 * 
 * 验证需求: 2.1, 2.2, 2.3, 2.7
 */
describe('属性测试：输入验证', () => {
  describe('本金验证', () => {
    it('对于任何有效本金（1000到1亿），验证应该通过', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 1000, max: 100000000, noNaN: true }),
          (principal) => {
            const result = validatePrincipal(principal);
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('对于任何无效本金（小于1000或超出范围），验证应该失败', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.double({ min: -1000000, max: 999.99, noNaN: true }), // 小于1000
            fc.double({ min: 100000001, max: 1000000000, noNaN: true }), // 超出上限
            fc.constant(NaN), // NaN
            fc.constant(Infinity), // 无穷大
            fc.constant(-Infinity) // 负无穷大
          ),
          (principal) => {
            const result = validatePrincipal(principal);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
            expect(typeof result.errorMessage).toBe('string');
            expect(result.errorMessage!.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('利率验证', () => {
    it('对于任何有效利率（0.1%到20%，即0.001到0.20），验证应该通过', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 0.20, noNaN: true }),
          (rate) => {
            const result = validateRate(rate);
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('对于任何无效利率（负数或超过20%），验证应该失败', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.double({ min: -1, max: 0.0009, noNaN: true }), // 小于0.1%
            fc.double({ min: 0.201, max: 10, noNaN: true }), // 超出上限
            fc.constant(NaN),
            fc.constant(Infinity),
            fc.constant(-Infinity)
          ),
          (rate) => {
            const result = validateRate(rate);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('年数验证', () => {
    it('对于任何有效年数（1到50年），验证应该通过', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          (years) => {
            const result = validateYears(years);
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('对于任何无效年数（0、负数或超过50），验证应该失败', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer({ max: 0 }), // 0或负数
            fc.integer({ min: 51, max: 1000 }) // 超出上限
          ),
          (years) => {
            const result = validateYears(years);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('现金流验证', () => {
    it('对于任何包含正负现金流的有效数组，验证应该通过', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              year: fc.integer({ min: 0, max: 100 }),
              amount: fc.double({ min: -10000000, max: 10000000, noNaN: true })
                .filter(n => Math.abs(n) > 0.01), // 排除接近0的值
            }),
            { minLength: 2, maxLength: 50 }
          ).chain((cashFlows) => {
            // 确保年份唯一
            const uniqueYears = Array.from(new Set(cashFlows.map(cf => cf.year)));
            const uniqueCashFlows = uniqueYears.map(year => {
              const cf = cashFlows.find(c => c.year === year)!;
              return { year, amount: cf.amount };
            });
            
            // 确保有正负现金流
            const hasPositive = uniqueCashFlows.some((cf) => cf.amount > 0);
            const hasNegative = uniqueCashFlows.some((cf) => cf.amount < 0);
            
            if (hasPositive && hasNegative && uniqueCashFlows.length >= 2) {
              return fc.constant(uniqueCashFlows);
            }
            
            // 如果不满足条件，手动构造一个满足条件的数组
            return fc.constant([
              { year: 0, amount: -1000 },
              { year: 1, amount: 1500 },
            ]);
          }),
          (cashFlows) => {
            const result = validateCashFlows(cashFlows);
            expect(result.isValid).toBe(true);
            expect(result.errorMessage).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('对于只有正现金流或只有负现金流的数组，验证应该失败', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // 只有正现金流
            fc.array(
              fc.record({
                year: fc.integer({ min: 0, max: 100 }),
                amount: fc.double({ min: 0.01, max: 10000000, noNaN: true }),
              }),
              { minLength: 2, maxLength: 10 }
            ),
            // 只有负现金流
            fc.array(
              fc.record({
                year: fc.integer({ min: 0, max: 100 }),
                amount: fc.double({ min: -10000000, max: -0.01, noNaN: true }),
              }),
              { minLength: 2, maxLength: 10 }
            )
          ),
          (cashFlows) => {
            const result = validateCashFlows(cashFlows);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('对于少于2个条目的数组，验证应该失败', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              year: fc.integer({ min: 0, max: 100 }),
              amount: fc.double({ min: -10000000, max: 10000000, noNaN: true }),
            }),
            { maxLength: 1 }
          ),
          (cashFlows) => {
            const result = validateCashFlows(cashFlows);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
