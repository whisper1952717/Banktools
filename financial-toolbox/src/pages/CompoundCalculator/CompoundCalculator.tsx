import React, { useState } from 'react';
import { Button, Card, Space, Alert } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import NumberInput from '../../components/NumberInput';
import { DisclaimerBanner } from '../../components/RiskDisclaimer';
import InterestChart from '../../components/InterestChart';
import { generateInterestData } from '../../utils/calculations';
import { validateCompoundCalculatorInputs } from '../../utils/validators';
import { formatNumber, formatLargeNumber, generateComparisonText } from '../../utils/formatters';
import './CompoundCalculator.css';

/**
 * 复利计算器页面组件
 */
const CompoundCalculator: React.FC = () => {
  // 输入状态
  const [principal, setPrincipal] = useState<number>(1000000); // 默认100万
  const [simpleRate, setSimpleRate] = useState<number>(0.025); // 默认2.5%
  const [compoundRate, setCompoundRate] = useState<number>(0.035); // 默认3.5%
  const [years, setYears] = useState<number>(10); // 默认10年

  // 结果状态
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  /**
   * 处理计算
   */
  const handleCalculate = () => {
    // 验证输入
    const validation = validateCompoundCalculatorInputs(
      principal,
      simpleRate,
      compoundRate,
      years
    );

    if (!validation.isValid) {
      setError(validation.errorMessage || '输入数据有误');
      setResult(null);
      return;
    }

    // 清除错误
    setError('');

    // 执行计算
    const calculationResult = generateInterestData(
      principal,
      simpleRate,
      compoundRate,
      years
    );

    setResult(calculationResult);
  };

  return (
    <div className="compound-calculator-container">
      {/* 页面标题 */}
      <div className="page-header">
        <h1 className="page-title">
          <CalculatorOutlined className="title-icon" />
          资产复利可视化计算器
        </h1>
        <p className="page-subtitle">直观对比单利和复利收益差距，看清10年后的差距</p>
      </div>

      {/* 输入表单 */}
      <Card className="input-card" bordered={false}>
        <h2 className="card-title">📝 输入参数</h2>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <NumberInput
            label="本金"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={100000000}
            unit="元"
            showSlider={true}
            step={10000}
            precision={0}
          />

          <NumberInput
            label="单利利率（定存/国债）"
            value={simpleRate * 100}
            onChange={(val) => setSimpleRate(val / 100)}
            min={0.1}
            max={20}
            unit="%"
            showSlider={true}
            step={0.1}
            precision={1}
          />

          <NumberInput
            label="复利利率（增额寿）"
            value={compoundRate * 100}
            onChange={(val) => setCompoundRate(val / 100)}
            min={0.1}
            max={20}
            unit="%"
            showSlider={true}
            step={0.1}
            precision={1}
          />

          <NumberInput
            label="投资年限"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            unit="年"
            showSlider={true}
            step={1}
            precision={0}
          />

          {error && (
            <Alert message={error} type="error" showIcon closable onClose={() => setError('')} />
          )}

          <Button
            type="primary"
            size="large"
            icon={<CalculatorOutlined />}
            onClick={handleCalculate}
            block
            className="calculate-button"
          >
            开始计算
          </Button>
        </Space>
      </Card>

      {/* 计算结果 */}
      {result && (
        <Card className="result-card" bordered={false}>
          <h2 className="card-title">📊 计算结果</h2>

          {/* 最终金额对比 */}
          <div className="result-summary">
            <div className="result-item simple">
              <div className="result-label">单利最终金额</div>
              <div className="result-value">¥{formatNumber(result.finalSimpleAmount, 2)}</div>
              <div className="result-desc">{formatLargeNumber(result.finalSimpleAmount)}</div>
            </div>

            <div className="result-divider">VS</div>

            <div className="result-item compound">
              <div className="result-label">复利最终金额</div>
              <div className="result-value">¥{formatNumber(result.finalCompoundAmount, 2)}</div>
              <div className="result-desc">{formatLargeNumber(result.finalCompoundAmount)}</div>
            </div>
          </div>

          {/* 差额展示 */}
          <div className="difference-card">
            <div className="difference-label">收益差额</div>
            <div className="difference-value">
              ¥{formatNumber(result.difference, 2)}
            </div>
            <div className="difference-comparison">
              {generateComparisonText(result.difference)}
            </div>
          </div>

          {/* 收益增长图表 */}
          <InterestChart
            simpleInterestData={result.simpleInterestData}
            compoundInterestData={result.compoundInterestData}
            years={years}
          />

          {/* 风险提示 */}
          <DisclaimerBanner type="compound" />
        </Card>
      )}
    </div>
  );
};

export default CompoundCalculator;
