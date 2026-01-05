/**
 * 资产体检问卷配置
 */

export interface QuestionOption {
  value: string;
  label: string;
  score: number; // 该选项对应的风险分数
}

export interface Question {
  id: string;
  category: string; // 分类：房产、负债、家庭、保障、储蓄、收入
  text: string; // 问题文本
  options: QuestionOption[]; // 选项
  weight: number; // 权重（影响评分）
}

/**
 * 资产体检问卷题目
 * 包含7个问题：房产、贷款、老人、子女、保险、应急资金、收入
 */
export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'housing',
    category: '房产',
    text: '您的房产状况？',
    options: [
      { value: 'own_no_loan', label: '有房无贷', score: 10 },
      { value: 'own_with_loan', label: '有房有贷', score: 30 },
      { value: 'renting', label: '租房', score: 50 },
    ],
    weight: 1.5,
  },
  {
    id: 'loan',
    category: '负债',
    text: '除房贷外，是否有其他贷款？',
    options: [
      { value: 'no_loan', label: '无贷款', score: 0 },
      { value: 'small_loan', label: '少量贷款（<年收入30%）', score: 20 },
      { value: 'heavy_loan', label: '较多贷款（≥年收入30%）', score: 40 },
    ],
    weight: 1.2,
  },
  {
    id: 'elderly',
    category: '家庭',
    text: '是否需要赡养老人？',
    options: [
      { value: 'no', label: '否', score: 0 },
      { value: 'one_side', label: '是，一方父母', score: 15 },
      { value: 'both_sides', label: '是，双方父母', score: 30 },
    ],
    weight: 1.0,
  },
  {
    id: 'children',
    category: '家庭',
    text: '子女抚养情况？',
    options: [
      { value: 'no_children', label: '无子女', score: 0 },
      { value: 'one_child', label: '1个子女', score: 15 },
      { value: 'multiple_children', label: '2个及以上子女', score: 30 },
    ],
    weight: 1.0,
  },
  {
    id: 'insurance',
    category: '保障',
    text: '家庭保险配置情况？',
    options: [
      { value: 'comprehensive', label: '配置齐全（重疾+医疗+意外+寿险）', score: 0 },
      { value: 'partial', label: '部分配置', score: 25 },
      { value: 'minimal', label: '仅社保或无保险', score: 50 },
    ],
    weight: 1.8,
  },
  {
    id: 'emergency_fund',
    category: '储蓄',
    text: '应急资金储备情况？',
    options: [
      { value: 'sufficient', label: '充足（≥6个月支出）', score: 0 },
      { value: 'moderate', label: '一般（3-6个月支出）', score: 20 },
      { value: 'insufficient', label: '不足（<3个月支出）', score: 40 },
    ],
    weight: 1.3,
  },
  {
    id: 'income_stability',
    category: '收入',
    text: '家庭收入稳定性？',
    options: [
      { value: 'stable', label: '稳定（双职工或稳定事业）', score: 0 },
      { value: 'moderate', label: '一般（单职工或收入波动）', score: 25 },
      { value: 'unstable', label: '不稳定（自由职业或创业）', score: 40 },
    ],
    weight: 1.4,
  },
];

/**
 * 风险等级定义
 */
export const RISK_LEVELS = {
  LOW: { min: 0, max: 30, label: '低风险', color: '#52c41a', description: '家庭财务状况良好' },
  MEDIUM: {
    min: 31,
    max: 60,
    label: '中风险',
    color: '#faad14',
    description: '家庭财务有一定压力',
  },
  HIGH: { min: 61, max: 100, label: '高风险', color: '#f5222d', description: '家庭财务压力较大' },
};

/**
 * 根据分数获取风险等级
 */
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= RISK_LEVELS.LOW.max) return 'low';
  if (score <= RISK_LEVELS.MEDIUM.max) return 'medium';
  return 'high';
}

/**
 * 获取风险等级信息
 */
export function getRiskLevelInfo(level: 'low' | 'medium' | 'high') {
  switch (level) {
    case 'low':
      return RISK_LEVELS.LOW;
    case 'medium':
      return RISK_LEVELS.MEDIUM;
    case 'high':
      return RISK_LEVELS.HIGH;
  }
}
