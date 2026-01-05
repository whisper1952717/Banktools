import React, { useState } from 'react';
import { Button, Card, Radio, Space, Alert, Progress } from 'antd';
import { CheckCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { DisclaimerBanner } from '../../components/RiskDisclaimer';
import { ASSESSMENT_QUESTIONS, getRiskLevelInfo } from '../../constants/assessment';
import { calculateAssessment } from '../../utils/assessment';
import type { AssessmentOutput } from '../../utils/assessment';
import './AssetAssessment.css';

/**
 * 资产体检页面组件
 */
const AssetAssessment: React.FC = () => {
  // 答案状态
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // 结果状态
  const [result, setResult] = useState<AssessmentOutput | null>(null);
  const [error, setError] = useState<string>('');

  /**
   * 处理答案变更
   */
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
    setError(''); // 清除错误
  };

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    const unansweredQuestions = ASSESSMENT_QUESTIONS.filter(
      (q) => !answers[q.id]
    );

    if (unansweredQuestions.length > 0) {
      setError(`请回答所有问题（还有${unansweredQuestions.length}个问题未回答）`);
      return false;
    }

    return true;
  };

  /**
   * 提交评估
   */
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // 计算评估结果
    const assessmentResult = calculateAssessment(answers);
    setResult(assessmentResult);
    setError('');

    // 滚动到结果区域
    setTimeout(() => {
      document.getElementById('assessment-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  /**
   * 重新评估
   */
  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 计算进度
  const progress = (Object.keys(answers).length / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div className="asset-assessment-container">
      {/* 页面标题 */}
      <div className="page-header">
        <h1 className="page-title">
          <SafetyOutlined className="title-icon" />
          家庭资产体检
        </h1>
        <p className="page-subtitle">科学评估家庭财务状况，获取专业配置建议</p>
      </div>

      {/* 问卷表单 */}
      <Card className="questionnaire-card" bordered={false}>
        <div className="questionnaire-header">
          <h2 className="card-title">📋 问卷调查</h2>
          <div className="progress-info">
            <span>完成进度：{Object.keys(answers).length}/{ASSESSMENT_QUESTIONS.length}</span>
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor="#1890ff"
              style={{ marginTop: '8px' }}
            />
          </div>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {ASSESSMENT_QUESTIONS.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-header">
                <span className="question-number">{index + 1}</span>
                <span className="question-category">{question.category}</span>
              </div>
              <div className="question-text">{question.text}</div>
              <Radio.Group
                value={answers[question.id]}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="question-options"
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {question.options.map((option) => (
                    <Radio key={option.value} value={option.value} className="option-radio">
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          ))}

          {error && (
            <Alert message={error} type="warning" showIcon closable onClose={() => setError('')} />
          )}

          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleSubmit}
            block
            className="submit-button"
          >
            提交评估
          </Button>
        </Space>
      </Card>

      {/* 评估结果 */}
      {result && (
        <div id="assessment-result">
          <Card className="result-card" bordered={false}>
            <h2 className="card-title">📊 评估结果</h2>

            {/* 风险评分 */}
            <div className="risk-score-section">
              <div className="score-gauge">
                <div className="score-circle" style={{ borderColor: getRiskLevelInfo(result.riskLevel).color }}>
                  <div className="score-value">{result.totalScore.toFixed(1)}</div>
                  <div className="score-label">风险评分</div>
                </div>
              </div>
              <div className="risk-level-info">
                <div
                  className="risk-level-badge"
                  style={{ background: getRiskLevelInfo(result.riskLevel).color }}
                >
                  {getRiskLevelInfo(result.riskLevel).label}
                </div>
                <div className="risk-level-desc">
                  {getRiskLevelInfo(result.riskLevel).description}
                </div>
              </div>
            </div>

            {/* 评分说明 */}
            <div className="score-explanation">
              <h3>📖 评分说明</h3>
              <ul>
                <li>0-30分：低风险 - 家庭财务状况良好，资产配置合理</li>
                <li>31-60分：中风险 - 家庭财务有一定压力，需要优化配置</li>
                <li>61-100分：高风险 - 家庭财务压力较大，建议尽快调整</li>
              </ul>
            </div>

            {/* 个性化建议 */}
            <div className="suggestions-section">
              <h3>💡 配置建议</h3>
              <div className="suggestions-list">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <span className="suggestion-number">{index + 1}</span>
                    <span className="suggestion-text">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 重要提示 */}
            <div className="important-notice">
              <p>
                <strong>⚠️ 重要提示：</strong>
                本评估结果仅供参考，不构成具体的投资建议。建议根据实际情况谨慎决策。
              </p>
            </div>

            {/* 操作按钮 */}
            <Button size="large" onClick={handleReset} block>
              重新评估
            </Button>

            {/* 风险提示 */}
            <DisclaimerBanner type="assessment" />
          </Card>
        </div>
      )}
    </div>
  );
};

export default AssetAssessment;
