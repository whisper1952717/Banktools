import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { STORAGE_KEYS, RISK_WARNINGS } from '../../constants/config';
import './RiskDisclaimer.css';

/**
 * 风险提示弹窗组件
 * 首次访问时显示，用户确认后记录到localStorage
 */
export const RiskWarningModal: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查是否已经显示过风险提示
    const hasSeenWarning = localStorage.getItem(STORAGE_KEYS.hasSeenRiskWarning);
    if (!hasSeenWarning) {
      setVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    // 记录用户已阅读风险提示
    localStorage.setItem(STORAGE_KEYS.hasSeenRiskWarning, 'true');
    setVisible(false);
  };

  return (
    <Modal
      open={visible}
      title={
        <div className="risk-modal-title">
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 24 }} />
          <span>风险提示</span>
        </div>
      }
      footer={
        <Button type="primary" size="large" onClick={handleConfirm} block>
          我已阅读并理解
        </Button>
      }
      closable={false}
      maskClosable={false}
      centered
      className="risk-warning-modal"
    >
      <div className="risk-modal-content">
        <div className="risk-warning-item">
          <h3>⚠️ {RISK_WARNINGS.general}</h3>
          <p>投资理财产品存在市场风险，收益不确定，请根据自身风险承受能力谨慎决策。</p>
        </div>

        <div className="risk-warning-item">
          <h3>📋 {RISK_WARNINGS.disclaimer}</h3>
          <p>
            本工具提供的所有计算结果、评估报告和建议仅供参考，不构成任何投资建议或承诺。
            实际投资决策应咨询专业理财顾问。
          </p>
        </div>

        <div className="risk-warning-item">
          <h3>🔒 隐私保护</h3>
          <p>
            本工具所有计算均在您的设备本地完成，不会向服务器发送任何个人财务数据，
            充分保护您的隐私安全。
          </p>
        </div>

        <div className="risk-warning-note">
          <p>
            使用本工具即表示您已充分理解并接受上述风险提示。
            如有疑问，请咨询专业人士。
          </p>
        </div>
      </div>
    </Modal>
  );
};

interface DisclaimerBannerProps {
  type?: 'compound' | 'irr' | 'assessment' | 'general';
}

/**
 * 页面底部免责声明横幅组件
 */
export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ type = 'general' }) => {
  const getSpecificWarning = () => {
    switch (type) {
      case 'compound':
        return RISK_WARNINGS.compound;
      case 'irr':
        return RISK_WARNINGS.irr;
      case 'assessment':
        return RISK_WARNINGS.assessment;
      default:
        return null;
    }
  };

  const specificWarning = getSpecificWarning();

  return (
    <div className="disclaimer-banner">
      <div className="disclaimer-banner-content">
        <div className="disclaimer-icon">
          <ExclamationCircleOutlined />
        </div>
        <div className="disclaimer-text">
          <p className="disclaimer-main">
            <strong>{RISK_WARNINGS.general}</strong>
          </p>
          <p className="disclaimer-sub">{RISK_WARNINGS.disclaimer}</p>
          {specificWarning && (
            <p className="disclaimer-specific">{specificWarning}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default { RiskWarningModal, DisclaimerBanner };
