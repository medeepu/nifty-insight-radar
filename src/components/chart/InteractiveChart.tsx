/**
 * Interactive Trading Chart with TradingView Lightweight Charts
 * Enhanced performance and better control over chart rendering
 */

import React from 'react';
import { LightweightChart } from './LightweightChart';
import { Chart } from '../../store/useChartStore';

interface InteractiveChartProps {
  chart: Chart;
  onRemove?: () => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  chart,
  onRemove,
}) => {

  return <LightweightChart chart={chart} onRemove={onRemove} />;
};