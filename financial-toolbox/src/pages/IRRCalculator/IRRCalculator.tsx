import React, { useState, useMemo } from 'react';
import { Button, Card, Table, InputNumber, Space, Alert, Segmented, Select, Tooltip } from 'antd';
import {
  CalculatorOutlined,
  PlusOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { DisclaimerBanner } from '../../components/RiskDisclaimer';
import {
  calculateIRRWithPeriod,
  calculateMIRRWithPeriod,
  calculateNPV,
  getPeriodsPerYear,
} from '../../utils/calculations';
import { validateCashFlows } from '../../utils/validators';
import { interpretIRR } from '../../utils/formatters';
import type { CashFlowItem, CashFlowPeriod } from '../../types';
import './IRRCalculator.css';

/**
 * 周期选项配置
 */
const periodOptions = [
  { label: '按年', value: 'yearly' },
  { label: '按季度', value: 'quarterly' },
  { label: '按月', value: 'monthly' },
];

/**
 * 获取周期标签
 */
const getPeriodLabel = (period: CashFlowPeriod): string => {
  switch (period) {
    case 'monthly':
      return '月';
    case 'quarterly':
      return '季度';
    case 'yearly':
    default:
      return '年';
  }
};

/**
 * IRR计算器页面组件
 */
const IRRCalculator: React.FC = () => {
  // 版本切换：基础版 / 进阶版
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  // 现金流周期
  const [period, setPeriod] = useState<CashFlowPeriod>('yearly');

  // 现金流状态 - 不设置默认值
  const [cashFlows, setCashFlows] = useState<CashFlowItem[]>([
    { year: 0, amount: 0 },
    { year: 1, amount: 0 },
  ]);

  // 进阶版参数
  const [discountRate, setDiscountRate] = useState<number>(5); // 折现率（资本成本）%
  const [financeRate, setFinanceRate] = useState<number>(8); // 融资利率 %
  const [reinvestRate, setReinvestRate] = useState<number>(3); // 再投资利率 %

  // 结果状态
  const [result, setResult] = useState<{
    irr: number | null;
    irrPercentage: string;
    annualizedIRR?: number | null;
    annualizedIRRPercentage?: string;
    interpretation: string;
    npv: number;
    // 进阶版结果
    mirr?: number | null;
    mirrPercentage?: string;
    npvAtDiscount?: number | null;
  } | null>(null);
  const [error, setError] = useState<string>('');

  // 周期标签
  const periodLabel = useMemo(() => getPeriodLabel(period), [period]);

  /**
   * 添加新的现金流条目
   */
  const handleAddCashFlow = () => {
    const maxYear = cashFlows.length > 0 ? Math.max(...cashFlows.map((cf) => cf.year)) : -1;
    setCashFlows([...cashFlows, { year: maxYear + 1, amount: 0 }]);
  };

  /**
   * 删除现金流条目
   */
  const handleDeleteCashFlow = (index: number) => {
    if (cashFlows.length <= 2) {
      setError('至少需要保留2个现金流条目');
      return;
    }
    const newCashFlows = cashFlows.filter((_, i) => i !== index);
    setCashFlows(newCashFlows);
    setError('');
  };

  /**
   * 更新现金流期数
   */
  const handleYearChange = (index: number, value: number | null) => {
    if (value === null) return;
    const newCashFlows = [...cashFlows];
    newCashFlows[index].year = value;
    setCashFlows(newCashFlows);
  };

  /**
   * 更新现金流金额
   */
  const handleAmountChange = (index: number, value: number | null) => {
    if (value === null) return;
    const newCashFlows = [...cashFlows];
    newCashFlows[index].amount = value;
    setCashFlows(newCashFlows);
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    setCashFlows([
      { year: 0, amount: 0 },
      { year: 1, amount: 0 },
    ]);
    setResult(null);
    setError('');
    setDiscountRate(5);
    setFinanceRate(8);
    setReinvestRate(3);
  };

  /**
   * 计算IRR
   */
  const handleCalculate = () => {
    // 验证输入
    const validation = validateCashFlows(cashFlows);
    if (!validation.isValid) {
      setError(validation.errorMessage || '现金流数据有误');
      setResult(null);
      return;
    }

    // 清除错误
    setError('');

    // 计算IRR（带周期）
    const irrResult = calculateIRRWithPeriod(cashFlows, period);

    if (!irrResult.isValid || irrResult.irr === null) {
      setError(
        irrResult.errorMessage || '无法计算IRR，请检查现金流数据是否合理（需要有正负现金流）'
      );
      setResult(null);
      return;
    }

    // 计算NPV用于验证
    let npv = 0;
    for (const { year, amount } of cashFlows) {
      npv += amount / Math.pow(1 + irrResult.irr, year);
    }

    // 基础结果
    const baseResult = {
      irr: irrResult.irr,
      irrPercentage: irrResult.irrPercentage,
      annualizedIRR: irrResult.annualizedIRR,
      annualizedIRRPercentage: irrResult.annualizedIRRPercentage,
      interpretation: interpretIRR(irrResult.annualizedIRR ?? irrResult.irr),
      npv: npv,
    };

    // 进阶版：计算MIRR和NPV
    if (mode === 'advanced') {
      const mirrResult = calculateMIRRWithPeriod(
        cashFlows,
        financeRate / 100,
        reinvestRate / 100,
        period
      );

      const npvAtDiscount = calculateNPV(
        cashFlows,
        (discountRate / 100) / getPeriodsPerYear(period)
      );

      setResult({
        ...baseResult,
        mirr: mirrResult.mirr,
        mirrPercentage: mirrResult.mirrPercentage,
        npvAtDiscount,
      });
    } else {
      setResult(baseResult);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: `期数（${periodLabel}）`,
      dataIndex: 'year',
      key: 'year',
      width: '30%',
      render: (value: number, _: CashFlowItem, index: number) => (
        <InputNumber
          value={value}
          onChange={(val) => handleYearChange(index, val)}
          min={0}
          max={360}
          precision={0}
          style={{ width: '100%' }}
          size="large"
        />
      ),
    },
    {
      title: '现金流（元）',
      dataIndex: 'amount',
      key: 'amount',
      width: '50%',
      render: (value: number, _: CashFlowItem, index: number) => (
        <InputNumber
          value={value}
          onChange={(val) => handleAmountChange(index, val)}
          min={-100000000}
          max={100000000}
          precision={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value!.replace(/,/g, ''))}
          style={{ width: '100%' }}
          size="large"
          placeholder="正数为流入，负数为流出"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: unknown, __: CashFlowItem, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteCashFlow(index)}
          disabled={cashFlows.length <= 2}
          size="large"
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="irr-calculator-container">
      {/* 页面标题 */}
      <div className="page-header">
        <h1 className="page-title">
          <CalculatorOutlined className="title-icon" />
          IRR内部收益率计算器
        </h1>
        <p className="page-subtitle">一键测算真实收益率，清晰了解投资回报</p>
      </div>

      {/* 版本切换 */}
      <div className="mode-switcher">
        <Segmented
          options={[
            { label: '📊 基础版', value: 'basic' },
            { label: '🔬 进阶版', value: 'advanced' },
          ]}
          value={mode}
          onChange={(value) => {
            setMode(value as 'basic' | 'advanced');
            setResult(null);
          }}
          size="large"
        />
      </div>

      {/* 输入表单 */}
      <Card className="input-card" bordered={false}>
        <h2 className="card-title">📝 现金流输入</h2>

        {/* 周期选择 */}
        <div className="period-selector">
          <span className="period-label">现金流周期：</span>
          <Select
            value={period}
            onChange={(value) => {
              setPeriod(value);
              setResult(null);
            }}
            options={periodOptions}
            style={{ width: 120 }}
            size="large"
          />
        </div>

        <div className="cash-flow-hint">
          <p>💡 时间点说明：</p>
          <ul>
            <li>
              <strong>期数 = 距离初始时刻的{periodLabel}数</strong>
              （T0=初始时刻，T1=1{periodLabel}后，T2=2{periodLabel}后...）
            </li>
            <li>负数表示流出（投资、缴费），正数表示流入（收益、返还）</li>
            {period === 'yearly' && (
              <li>示例：「缴费5年，第6年领取」→ T0-T4各投入，T5领取</li>
            )}
            {period === 'monthly' && (
              <li>示例：「每月定投，12个月后领取」→ T0-T11各投入，T12领取</li>
            )}
            {period === 'quarterly' && (
              <li>示例：「每季度投入，4季度后领取」→ T0-T3各投入，T4领取</li>
            )}
          </ul>
        </div>

        {/* 进阶版参数 */}
        {mode === 'advanced' && (
          <div className="advanced-params">
            <h3 className="params-title">
              ⚙️ 进阶参数
              <Tooltip title="进阶版使用MIRR（修正内部收益率）计算，考虑融资成本和再投资收益的差异">
                <QuestionCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
              </Tooltip>
            </h3>
            <div className="params-grid">
              <div className="param-item">
                <label>
                  折现率（资本成本）
                  <Tooltip title="用于计算净现值NPV的折现率，通常为企业的加权平均资本成本WACC">
                    <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c' }} />
                  </Tooltip>
                </label>
                <InputNumber
                  value={discountRate}
                  onChange={(val) => setDiscountRate(val ?? 5)}
                  min={0}
                  max={100}
                  precision={2}
                  addonAfter="%"
                  style={{ width: '100%' }}
                  size="large"
                />
              </div>
              <div className="param-item">
                <label>
                  融资利率
                  <Tooltip title="负现金流（投资支出）的融资成本，如贷款利率">
                    <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c' }} />
                  </Tooltip>
                </label>
                <InputNumber
                  value={financeRate}
                  onChange={(val) => setFinanceRate(val ?? 8)}
                  min={0}
                  max={100}
                  precision={2}
                  addonAfter="%"
                  style={{ width: '100%' }}
                  size="large"
                />
              </div>
              <div className="param-item">
                <label>
                  再投资利率
                  <Tooltip title="正现金流（投资收益）的再投资收益率，如存款利率">
                    <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c' }} />
                  </Tooltip>
                </label>
                <InputNumber
                  value={reinvestRate}
                  onChange={(val) => setReinvestRate(val ?? 3)}
                  min={0}
                  max={100}
                  precision={2}
                  addonAfter="%"
                  style={{ width: '100%' }}
                  size="large"
                />
              </div>
            </div>
          </div>
        )}

        <Table
          dataSource={cashFlows}
          columns={columns}
          pagination={false}
          rowKey={(_, index) => index!}
          className="cash-flow-table"
        />

        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddCashFlow}
            block
            size="large"
          >
            添加现金流
          </Button>

          {error && (
            <Alert message={error} type="error" showIcon closable onClose={() => setError('')} />
          )}

          <Space style={{ width: '100%' }} size="middle">
            <Button
              type="primary"
              size="large"
              icon={<CalculatorOutlined />}
              onClick={handleCalculate}
              style={{ flex: 1 }}
            >
              计算{mode === 'advanced' ? 'IRR / MIRR' : 'IRR'}
            </Button>
            <Button size="large" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 计算结果 */}
      {result && (
        <Card className="result-card" bordered={false}>
          <h2 className="card-title">📊 计算结果</h2>

          {/* IRR结果展示 */}
          <div className="irr-result">
            <div className="irr-label">
              内部收益率（IRR）
              {period !== 'yearly' && ' - 年化'}
            </div>
            <div className="irr-value">
              {period !== 'yearly' ? result.annualizedIRRPercentage : result.irrPercentage}
            </div>
            {period !== 'yearly' && (
              <div className="irr-period-rate">
                {periodLabel}收益率：{result.irrPercentage}
              </div>
            )}
            <div className="irr-interpretation">{result.interpretation}</div>

            {/* NPV验证信息 */}
            <div className="npv-verification">
              <span className="npv-label">验证：</span>
              <span className="npv-value">
                NPV({result.irrPercentage}) = {result.npv.toFixed(6)}
              </span>
              <span className="npv-hint">
                {Math.abs(result.npv) < 0.01 ? '✅ 计算正确' : '⚠️ 可能存在误差'}
              </span>
            </div>
          </div>

          {/* 进阶版额外结果 */}
          {mode === 'advanced' && result.mirr !== undefined && (
            <div className="advanced-results">
              <div className="result-row">
                <div className="result-item mirr-result">
                  <div className="result-label">
                    修正内部收益率（MIRR）
                    <Tooltip title="MIRR考虑了融资成本和再投资收益率的差异，比IRR更贴近实际">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </div>
                  <div className="result-value">{result.mirrPercentage}</div>
                </div>
                <div className="result-item npv-result">
                  <div className="result-label">
                    净现值（NPV）
                    <Tooltip title={`使用${discountRate}%折现率计算的净现值`}>
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </div>
                  <div className="result-value">
                    ¥{result.npvAtDiscount?.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className="result-hint">
                    {(result.npvAtDiscount ?? 0) > 0 ? '✅ 项目可行' : '⚠️ 项目不可行'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 说明文字 */}
          <div className="irr-explanation">
            <h3>📖 什么是IRR？</h3>
            <p>
              内部收益率（Internal Rate of Return）是使投资项目净现值为零的折现率，
              反映了投资的真实年化收益率。
            </p>
            <p>IRR越高，说明投资回报越好。一般来说：</p>
            <ul>
              <li>IRR &gt; 5%：优于银行定存</li>
              <li>IRR 2-5%：与银行定存相当</li>
              <li>IRR &lt; 2%：低于银行定存</li>
              <li>IRR &lt; 0%：投资亏损</li>
            </ul>

            {mode === 'advanced' && (
              <>
                <h3 style={{ marginTop: '20px' }}>🔬 什么是MIRR？</h3>
                <p>
                  修正内部收益率（Modified Internal Rate of
                  Return）解决了传统IRR的两个问题：
                </p>
                <ul>
                  <li>
                    <strong>再投资假设</strong>
                    ：IRR假设所有正现金流都能以IRR的利率再投资，这通常不现实
                  </li>
                  <li>
                    <strong>融资成本</strong>
                    ：IRR没有考虑负现金流的融资成本
                  </li>
                </ul>
                <p>MIRR通过分别指定融资利率和再投资利率，提供更准确的收益率估计。</p>
              </>
            )}

            <h3 style={{ marginTop: '20px' }}>🔍 如何验证IRR的正确性？</h3>
            <p>
              IRR的定义是使净现值（NPV）等于0的折现率。上方显示的NPV值应该接近0
              （如0.000001），这证明了计算结果的准确性。
            </p>
          </div>

          {/* 风险提示 */}
          <DisclaimerBanner type="irr" />
        </Card>
      )}
    </div>
  );
};

export default IRRCalculator;
