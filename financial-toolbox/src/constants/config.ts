/**
 * 应用配置常量
 */

// 验证规则
export const VALIDATION_RULES = {
  principal: {
    min: 1000,
    max: 100000000,
    errorMessage: '本金必须在1,000到100,000,000元之间'
  },
  rate: {
    min: 0.001,
    max: 0.20,
    errorMessage: '利率必须在0.1%到20%之间'
  },
  years: {
    min: 1,
    max: 50,
    errorMessage: '投资年限必须在1到50年之间'
  },
  cashFlowAmount: {
    min: -100000000,
    max: 100000000,
    errorMessage: '现金流金额必须在-100,000,000到100,000,000之间'
  }
};

// 风险提示文本
export const RISK_WARNINGS = {
  general: '投资有风险，决策需谨慎',
  disclaimer: '本工具仅供参考，不构成投资建议',
  compound: '实际收益可能因市场波动而有所不同',
  irr: '历史收益不代表未来表现',
  assessment: '本评估仅供参考，请根据自身情况谨慎决策'
};

// 本地存储键名
export const STORAGE_KEYS = {
  hasSeenRiskWarning: 'financial_toolbox_risk_warning_seen',
  userPreferences: 'financial_toolbox_preferences'
};
