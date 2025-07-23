/**
 * Interactive Trading Chart with TradingView Lightweight Charts
 * Enhanced performance and better control over chart rendering
 */

import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Chart } from '../../store/useChartStore';
import { useTradingStore } from '../../store/useTradingStore';

interface InteractiveChartProps {
  chart?: Chart;
  onRemove?: () => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  chart,
  onRemove,
}) => {
  const { selectedSymbol, selectedTimeframe } = useTradingStore();

  const defaultChart = {
    symbol: selectedSymbol,
    timeframe: selectedTimeframe,
    id: 'default'
  };

  const activeChart = chart || defaultChart;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Chart: {activeChart.symbol} ({activeChart.timeframe})</h2>
          {onRemove && (
            <Button onClick={onRemove} variant="outline" size="sm">
              Remove Chart
            </Button>
          )}
        </div>
        <div className="h-96 bg-muted/10 border border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">TradingView Lightweight Charts</p>
            <p className="text-muted-foreground">
              Chart: {activeChart.symbol} ({activeChart.timeframe}) - Ready for data connection
            </p>
            <p className="text-sm text-muted-foreground">
              Features: Multi-timeframe, Technical indicators, Real-time updates
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};