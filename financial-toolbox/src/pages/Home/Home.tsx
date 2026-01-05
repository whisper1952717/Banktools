import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import {
  LineChartOutlined,
  CalculatorOutlined,
  SafetyOutlined,
  RightOutlined,
} from '@ant-design/icons';
import './Home.css';

/**
 * 首页组件
 * 显示三个工具的入口卡片
 */
const Home: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'compound',
      title: '资产复利可视化计算器',
      subtitle: '2026版',
      description: '直观对比单利和复利收益差距',
      highlight: '看清10年后的差距',
      icon: <LineChartOutlined />,
      color: '#1890ff',
      path: '/compound',
      features: ['📊 可视化图表', '💰 收益对比', '🚗 形象化展示'],
    },
    {
      id: 'irr',
      title: 'IRR内部收益率测算表',
      subtitle: '专业版',
      description: '精确计算投资真实收益率',
      highlight: '一目了然的收益分析',
      icon: <CalculatorOutlined />,
      color: '#52c41a',
      path: '/irr',
      features: ['📈 精准计算', '💡 智能解读', '⚡ 一键测算'],
    },
    {
      id: 'assessment',
      title: '家庭资产体检自动评分表',
      subtitle: '智能版',
      description: '全面的风险评估和配置建议',
      highlight: '科学评估，清晰了解家庭财务状况',
      icon: <SafetyOutlined />,
      color: '#faad14',
      path: '/assessment',
      features: ['🏥 风险评估', '📋 个性化建议', '🎯 科学分析'],
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      {/* 标题区域 */}
      <div className="home-header">
        <h1 className="home-title">
          <span className="title-icon">💰</span>
          金融常用计算工具
          <span className="title-version">2026版</span>
        </h1>
        <p className="home-subtitle">
          实用计算平台 · 让数据说话，帮您看清收益差距
        </p>
      </div>

      {/* 工具卡片 */}
      <Row gutter={[16, 16]} className="tools-grid">
        {tools.map((tool) => (
          <Col xs={24} sm={24} md={8} key={tool.id}>
            <Card
              className="tool-card"
              hoverable
              onClick={() => handleCardClick(tool.path)}
              bordered={false}
            >
              <div className="tool-card-content">
                {/* 图标 */}
                <div
                  className="tool-icon"
                  style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                >
                  {tool.icon}
                </div>

                {/* 标题 */}
                <div className="tool-header">
                  <h2 className="tool-title">{tool.title}</h2>
                  <span className="tool-subtitle" style={{ color: tool.color }}>
                    {tool.subtitle}
                  </span>
                </div>

                {/* 描述 */}
                <p className="tool-description">{tool.description}</p>

                {/* 亮点 */}
                <div className="tool-highlight" style={{ borderLeftColor: tool.color }}>
                  {tool.highlight}
                </div>

                {/* 特性列表 */}
                <div className="tool-features">
                  {tool.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="tool-action">
                  <span className="action-text">立即使用</span>
                  <RightOutlined className="action-icon" />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 底部说明 */}
      <div className="home-footer-info">
        <div className="info-card">
          <h3>🔒 隐私保护</h3>
          <p>所有计算在本地完成，不上传任何数据</p>
        </div>
        <div className="info-card">
          <h3>📱 多端适配</h3>
          <p>支持手机、平板、电脑等各种设备</p>
        </div>
        <div className="info-card">
          <h3>⚡ 即时计算</h3>
          <p>无需等待，实时显示计算结果</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
