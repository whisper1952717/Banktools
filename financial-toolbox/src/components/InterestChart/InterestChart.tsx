import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatNumber } from '../../utils/formatters';
import './InterestChart.css';

interface InterestChartProps {
  simpleInterestData: Array<{ year: number; amount: number }>;
  compoundInterestData: Array<{ year: number; amount: number }>;
  years: number;
}

/**
 * 复利对比图表组件
 * 使用ECharts显示单利和复利的增长曲线
 */
const InterestChart: React.FC<InterestChartProps> = React.memo(({
  simpleInterestData,
  compoundInterestData,
  years,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    // 准备数据
    const xAxisData = simpleInterestData.map((item) => `第${item.year}年`);
    const simpleData = simpleInterestData.map((item) => item.amount);
    const compoundData = compoundInterestData.map((item) => item.amount);

    // 配置图表选项
    const option: echarts.EChartsOption = {
      title: {
        text: '收益增长对比',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#262626',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';
          
          let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          
          params.forEach((param: any) => {
            const value = formatNumber(param.value, 2);
            result += `
              <div style="display: flex; align-items: center; margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                <span style="flex: 1;">${param.seriesName}:</span>
                <span style="font-weight: 600; margin-left: 12px;">¥${value}</span>
              </div>
            `;
          });
          
          return result;
        },
      },
      legend: {
        data: ['单利收益', '复利收益'],
        top: 35,
        textStyle: {
          fontSize: 13,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          fontSize: 11,
          interval: Math.floor(years / 10) || 0, // 动态调整标签间隔
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 10000) {
              return `${(value / 10000).toFixed(0)}万`;
            }
            return value.toString();
          },
          fontSize: 11,
        },
      },
      series: [
        {
          name: '单利收益',
          type: 'line',
          data: simpleData,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#8c8c8c',
          },
          itemStyle: {
            color: '#8c8c8c',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(140, 140, 140, 0.3)' },
              { offset: 1, color: 'rgba(140, 140, 140, 0.05)' },
            ]),
          },
        },
        {
          name: '复利收益',
          type: 'line',
          data: compoundData,
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#52c41a',
          },
          itemStyle: {
            color: '#52c41a',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
    };

    // 设置图表选项
    chart.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [simpleInterestData, compoundInterestData, years]);

  // 组件卸载时销毁图表
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return <div ref={chartRef} className="interest-chart" />;
});

// 设置displayName以便调试
InterestChart.displayName = 'InterestChart';

export default InterestChart;
