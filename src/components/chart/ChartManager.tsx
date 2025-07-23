/**
 * Chart Manager - Handles Multiple Charts
 * Main component for managing multiple trading charts
 */

import React from 'react';
import { useChartStore } from '../../store/useChartStore';
import { InteractiveChart } from './InteractiveChart';

export const ChartManager: React.FC = () => {
  const { charts, removeChart } = useChartStore();

  const handleRemoveChart = (chartId: string) => {
    if (charts.length > 1) {
      removeChart(chartId);
    }
  };

  return (
    <div className="space-y-6">
      {charts.map((chart) => (
        <InteractiveChart
          key={chart.id}
          chart={chart}
          onRemove={charts.length > 1 ? () => handleRemoveChart(chart.id) : undefined}
        />
      ))}
    </div>
  );
};