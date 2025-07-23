import React from 'react';
import { InteractiveChart } from './chart/InteractiveChart';
import { ChartIndicatorPanel } from './chart/ChartIndicatorPanel';

export const TradingChart: React.FC = () => {
  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1">
        <InteractiveChart />
      </div>
      <ChartIndicatorPanel />
    </div>
  );
};