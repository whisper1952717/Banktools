import React, { useState, useEffect } from 'react';
import { Input, Slider } from 'antd';
import { formatNumber } from '../../utils/formatters';
import './NumberInput.css';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  error?: string;
  showSlider?: boolean;
  precision?: number;
  size?: 'small' | 'middle' | 'large';
}

/**
 * 数字输入组件
 * 支持千位分隔符显示、范围验证、滑块输入
 */
const NumberInput: React.FC<NumberInputProps> = React.memo(({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  placeholder,
  error,
  showSlider = false,
  precision = 0,
  size = 'large',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && value !== null && value !== undefined) {
      // 失焦时显示格式化的数字（带千位分隔符）
      setDisplayValue(formatNumber(value, precision));
    }
  }, [value, isFocused, precision]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // 移除千位分隔符和空格，只保留数字和小数点
    const numericValue = inputValue.replace(/[,\s]/g, '');
    const parsedValue = parseFloat(numericValue);

    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    } else if (numericValue === '' || numericValue === '-') {
      onChange(0);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // 聚焦时显示原始数字（不带千位分隔符）
    setDisplayValue(value?.toString() || '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 验证范围
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  const handleSliderChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div className={`number-input-container ${error ? 'has-error' : ''}`}>
      <label className="number-input-label">
        {label}
        {unit && <span className="number-input-unit-label">（{unit}）</span>}
      </label>

      <div className="number-input-wrapper">
        <Input
          size={size}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || `请输入${label}`}
          className="number-input-field"
          suffix={unit && <span className="input-suffix">{unit}</span>}
          inputMode="decimal"
        />
      </div>

      {showSlider && (
        <div className="number-input-slider">
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            tooltip={{
              formatter: (val) => `${formatNumber(val || 0, precision)}${unit}`,
            }}
          />
          <div className="slider-range">
            <span>{formatNumber(min, precision)}</span>
            <span>{formatNumber(max, precision)}</span>
          </div>
        </div>
      )}

      {error && <div className="number-input-error">{error}</div>}

      <div className="number-input-hint">
        有效范围：{formatNumber(min, precision)} - {formatNumber(max, precision)} {unit}
      </div>
    </div>
  );
});

// 设置displayName以便调试
NumberInput.displayName = 'NumberInput';

export default NumberInput;
