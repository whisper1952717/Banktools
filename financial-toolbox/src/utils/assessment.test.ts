/**
 * 资产评估函数属性测试
 * 使用fast-check进行属性测试
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateAssessment, generateSuggestions } from './assessment';
import { ASSESSMENT_QUESTIONS } from '../constants/assessment';

/**
 * 生成有效的答案对象
 */
const validAnswersArbitrary = fc.record(
  Object.fromEntries(
    ASSESSMENT_QUESTIONS.map((q) => [
      q.id,
      fc.constantFrom(...q.options.map((opt) => opt.value)),
    ])
  )
);

/**
 * 属性测试9: 资产评分范围约束
 * Feature: financial-toolbox, Property 9: 对于任何有效的答案组合，
 * 评分应该在0-100范围内
 * 
 * 验证需求: 4.3, 4.5
 */
describe('属性测试：评分计算', () => {
  describe('评分范围约束', () => {
    it('对于任何有效答案组合，总分应该在0-100范围内', () => {
      fc.assert(
        fc.property(validAnswersArbitrary, (answers) => {
          const result = calculateAssessment(answers);

          // 总分应该在0-100范围内
          expect(result.totalScore).toBeGreaterThanOrEqual(0);
          expect(result.totalScore).toBeLessThanOrEqual(100);

          // 总分应该是有限数字
          expect(Number.isFinite(result.totalScore)).toBe(true);
          expect(Number.isNaN(result.totalScore)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('对于任何有效答案组合，各类别得分应该在合理范围内', () => {
      fc.assert(
        fc.property(validAnswersArbitrary, (answers) => {
          const result = calculateAssessment(answers);

          // 各类别得分应该是有限数字
          Object.values(result.categoryScores).forEach((score) => {
            expect(Number.isFinite(score)).toBe(true);
            expect(Number.isNaN(score)).toBe(false);
            // 类别得分应该在0-100范围内（根据选项配置）
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性测试10: 风险等级映射一致性
   * Feature: financial-toolbox, Property 10: 对于任何有效的答案组合，
   * 风险等级应该与评分一致映射
   * 
   * 验证需求: 4.3, 4.5
   */
  describe('风险等级映射一致性', () => {
    it('对于任何有效答案组合，风险等级应该与评分一致', () => {
      fc.assert(
        fc.property(validAnswersArbitrary, (answers) => {
          const result = calculateAssessment(answers);

          // 风险等级应该是有效值
          expect(['low', 'medium', 'high']).toContain(result.riskLevel);

          // 验证风险等级与评分的映射关系
          // 注意：分数越低，风险越低
          if (result.totalScore <= 30) {
            expect(result.riskLevel).toBe('low');
          } else if (result.totalScore <= 60) {
            expect(result.riskLevel).toBe('medium');
          } else {
            expect(result.riskLevel).toBe('high');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('相同的答案应该产生相同的评分和风险等级（确定性）', () => {
      fc.assert(
        fc.property(validAnswersArbitrary, (answers) => {
          const result1 = calculateAssessment(answers);
          const result2 = calculateAssessment(answers);

          // 相同输入应该产生相同输出
          expect(result1.totalScore).toBe(result2.totalScore);
          expect(result1.riskLevel).toBe(result2.riskLevel);
          expect(result1.categoryScores).toEqual(result2.categoryScores);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 属性测试11: 评估建议非空性
   * Feature: financial-toolbox, Property 11: 对于任何有效的答案组合，
   * 应该至少生成一条建议
   * 
   * 验证需求: 4.6, 4.7
   */
  describe('建议生成', () => {
    it('对于任何有效答案组合，应该至少生成一条建议', () => {
      fc.assert(
        fc.property(validAnswersArbitrary, (answers) => {
          const result = calculateAssessment(answers);

          // 建议数组应该存在且非空
          expect(result.suggestions).toBeDefined();
          expect(Array.isArray(result.suggestions)).toBe(true);
          expect(result.suggestions.length).toBeGreaterThan(0);

          // 每条建议应该是非空字符串
          result.suggestions.forEach((suggestion) => {
            expect(typeof suggestion).toBe('string');
            expect(suggestion.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('建议内容应该与风险等级相关', () => {
      fc.assert(
        fc.property(validAnswersArbitrary, (answers) => {
          const result = calculateAssessment(answers);

          // 高风险应该包含"风险"相关建议
          if (result.riskLevel === 'high') {
            const hasRiskRelatedSuggestion = result.suggestions.some(
              (s) => s.includes('风险') || s.includes('优先') || s.includes('改善')
            );
            expect(hasRiskRelatedSuggestion).toBe(true);
          }

          // 低风险应该包含"良好"或"保持"相关建议
          if (result.riskLevel === 'low') {
            const hasPositiveSuggestion = result.suggestions.some(
              (s) => s.includes('良好') || s.includes('保持') || s.includes('适当')
            );
            expect(hasPositiveSuggestion).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('generateSuggestions函数应该总是返回非空数组', () => {
      fc.assert(
        fc.property(
          validAnswersArbitrary,
          fc.constantFrom('low', 'medium', 'high'),
          (answers, riskLevel) => {
            const categoryScores = {
              housing: 50,
              debt: 50,
              family: 50,
              insurance: 50,
              savings: 50,
              income: 50,
            };

            const suggestions = generateSuggestions(
              answers,
              riskLevel as 'low' | 'medium' | 'high',
              categoryScores
            );

            expect(suggestions).toBeDefined();
            expect(Array.isArray(suggestions)).toBe(true);
            expect(suggestions.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('边界情况测试', () => {
    it('空答案对象应该返回有效结果', () => {
      const result = calculateAssessment({});

      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      expect(['low', 'medium', 'high']).toContain(result.riskLevel);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('部分答案应该返回有效结果', () => {
      const partialAnswers = {
        housing: 'own_no_loan',
        loan: 'no_loan',
      };

      const result = calculateAssessment(partialAnswers);

      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      expect(['low', 'medium', 'high']).toContain(result.riskLevel);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});
