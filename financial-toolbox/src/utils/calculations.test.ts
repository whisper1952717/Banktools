/**
 * 计算函数属性测试
 * 使用fast-check进行属性测试
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateIRR,
} from './calculations';

/**
 * 属性测试2: 复利大于单利（相同利率）
 * Feature: financial-toolbox, Property 2: 对于任何正本金、正利率和正年数，
 * 当年数>0时，复利结果应该大于或等于单利结果
 * 
 * 验证需求: 2.4, 2.5
 */
describe('属性测试：复利大于单利', () => {
  it('对于任何正本金、正利率和正年数（年数>0），复利应大于等于单利', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 10000000, noNaN: true }), // 本金：1到1000万
        fc.double({ min: 0.001, max: 0.5, noNaN: true }), // 利率：0.1%到50%
        fc.integer({ min: 1, max: 50 }), // 年数：1到50年
        (principal, rate, years) => {
          const simpleResult = calculateSimpleInterest(principal, rate, years);
          const compoundResult = calculateCompoundInterest(principal, rate, years);

          // 复利应该大于等于单利（当年数>0时）
          // 允许微小的浮点误差
          expect(compoundResult).toBeGreaterThanOrEqual(simpleResult - 0.01);

          // 当年数=1时，复利和单利应该相等
          if (years === 1) {
            expect(Math.abs(compoundResult - simpleResult)).toBeLessThan(0.01);
          }
          // 当年数>1时，复利应该严格大于单利
          else {
            expect(compoundResult).toBeGreaterThan(simpleResult);
          }
        }
      ),
      { numRuns: 100 } // 运行100次迭代
    );
  });

  it('当年数为0时，复利和单利都应该等于本金', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 10000000, noNaN: true }),
        fc.double({ min: 0.001, max: 0.5, noNaN: true }),
        (principal, rate) => {
          const simpleResult = calculateSimpleInterest(principal, rate, 0);
          const compoundResult = calculateCompoundInterest(principal, rate, 0);

          expect(Math.abs(simpleResult - principal)).toBeLessThan(0.01);
          expect(Math.abs(compoundResult - principal)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});
