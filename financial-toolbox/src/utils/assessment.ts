/**
 * 资产体检评分算法
 */

import { ASSESSMENT_QUESTIONS, getRiskLevel } from '../constants/assessment';

export interface AssessmentInput {
  answers: Record<string, string>; // questionId -> selectedValue
}

export interface CategoryScores {
  housing: number;
  debt: number;
  family: number;
  insurance: number;
  savings: number;
  income: number;
}

export interface AssessmentOutput {
  totalScore: number; // 总分 (0-100)
  riskLevel: 'low' | 'medium' | 'high'; // 风险等级
  categoryScores: CategoryScores; // 各类别得分
  suggestions: string[]; // 配置建议列表
}

/**
 * 计算资产体检评分
 * @param answers - 用户答案
 * @returns 评估结果
 */
export function calculateAssessment(answers: Record<string, string>): AssessmentOutput {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  const categoryScores: CategoryScores = {
    housing: 0,
    debt: 0,
    family: 0,
    insurance: 0,
    savings: 0,
    income: 0,
  };

  // 计算每个问题的加权分数
  for (const question of ASSESSMENT_QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) continue;

    const selectedOption = question.options.find((opt) => opt.value === answer);
    if (!selectedOption) continue;

    const weightedScore = selectedOption.score * question.weight;
    totalWeightedScore += weightedScore;
    totalWeight += question.weight;

    // 记录各类别得分
    const categoryKey = getCategoryKey(question.category);
    if (categoryKey) {
      categoryScores[categoryKey] = selectedOption.score;
    }
  }

  // 归一化到0-100
  const maxPossibleScore = calculateMaxPossibleScore();
  const totalScore = totalWeight > 0 ? (totalWeightedScore / maxPossibleScore) * 100 : 0;

  // 确定风险等级
  const riskLevel = getRiskLevel(totalScore);

  // 生成建议
  const suggestions = generateSuggestions(answers, riskLevel, categoryScores);

  return {
    totalScore: Math.round(totalScore * 10) / 10, // 保留1位小数
    riskLevel,
    categoryScores,
    suggestions,
  };
}

/**
 * 计算最大可能分数（用于归一化）
 */
function calculateMaxPossibleScore(): number {
  let maxScore = 0;
  for (const question of ASSESSMENT_QUESTIONS) {
    const maxOptionScore = Math.max(...question.options.map((opt) => opt.score));
    maxScore += maxOptionScore * question.weight;
  }
  return maxScore;
}

/**
 * 获取类别键名
 */
function getCategoryKey(category: string): keyof CategoryScores | null {
  const mapping: Record<string, keyof CategoryScores> = {
    房产: 'housing',
    负债: 'debt',
    家庭: 'family',
    保障: 'insurance',
    储蓄: 'savings',
    收入: 'income',
  };
  return mapping[category] || null;
}

/**
 * 生成个性化建议
 * @param answers - 用户答案
 * @param riskLevel - 风险等级
 * @param categoryScores - 各类别得分
 * @returns 建议列表
 */
export function generateSuggestions(
  answers: Record<string, string>,
  riskLevel: 'low' | 'medium' | 'high',
  _categoryScores: CategoryScores
): string[] {
  const suggestions: string[] = [];

  // 根据房产状况给建议
  if (answers.housing === 'renting') {
    suggestions.push('建议优先考虑购房或增加储蓄，提高资产稳定性');
  } else if (answers.housing === 'own_with_loan') {
    suggestions.push('建议关注房贷利率变化，合理规划还款计划');
  }

  // 根据负债状况给建议
  if (answers.loan === 'heavy_loan') {
    suggestions.push('负债压力较大，建议优先偿还高息贷款，降低财务风险');
  } else if (answers.loan === 'small_loan') {
    suggestions.push('建议控制负债规模，避免过度借贷');
  }

  // 根据家庭状况给建议
  const hasElderly = answers.elderly !== 'no';
  const hasChildren = answers.children !== 'no_children';
  if (hasElderly && hasChildren) {
    suggestions.push('上有老下有小，建议配置充足的家庭保障和教育金储备');
  } else if (hasElderly) {
    suggestions.push('建议为父母配置医疗保险和意外险，减轻医疗负担');
  } else if (hasChildren) {
    suggestions.push('建议为子女配置教育金和重疾险，保障成长无忧');
  }

  // 根据保险状况给建议
  if (answers.insurance === 'minimal') {
    suggestions.push('保险配置严重不足，建议优先配置重疾险、医疗险和意外险');
  } else if (answers.insurance === 'partial') {
    suggestions.push('保险配置不够全面，建议补充缺失的保障类型');
  }

  // 根据应急资金给建议
  if (answers.emergency_fund === 'insufficient') {
    suggestions.push('应急资金不足，建议储备至少3-6个月的生活开支');
  } else if (answers.emergency_fund === 'moderate') {
    suggestions.push('建议继续增加应急资金储备，提高抗风险能力');
  }

  // 根据收入稳定性给建议
  if (answers.income_stability === 'unstable') {
    suggestions.push('收入不稳定，建议增加被动收入来源，配置稳健型理财产品');
  } else if (answers.income_stability === 'moderate') {
    suggestions.push('建议提升职业技能，增强收入稳定性');
  }

  // 根据风险等级给总体建议
  if (riskLevel === 'high') {
    suggestions.push('整体财务风险较高，建议优先改善高风险项，制定全面的财务规划');
  } else if (riskLevel === 'medium') {
    suggestions.push('财务状况有改善空间，建议逐步优化资产配置');
  } else {
    suggestions.push('财务状况良好，建议保持现有配置，适当增加投资比例');
  }

  // 如果没有生成任何建议，添加默认建议
  if (suggestions.length === 0) {
    suggestions.push('建议定期进行资产体检，及时调整财务规划');
  }

  return suggestions;
}
