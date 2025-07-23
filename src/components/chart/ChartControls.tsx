/**
 * Chart Controls - Simplified Indicator Toggle Panel
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const availableIndicators = [
  { id: 'ema9', name: 'EMA 9' },
  { id: 'ema21', name: 'EMA 21' },
  { id: 'ema50', name: 'EMA 50' },
  { id: 'ema200', name: 'EMA 200' },
  { id: 'vwap', name: 'VWAP' },
  { id: 'rsi', name: 'RSI' },
  { id: 'stochastic', name: 'Stochastic' },
  { id: 'cpr', name: 'CPR' },
  { id: 'pivots', name: 'Pivot Levels' },
];

interface ActiveIndicator {
  id: string;
  name: string;
  visible: boolean;
}

interface ChartControlsProps {
  activeIndicators: ActiveIndicator[];
  onToggleIndicator: (id: string) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  activeIndicators,
  onToggleIndicator
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {activeIndicators.map(indicator => (
        <Badge
          key={indicator.id}
          variant="outline"
          className="flex items-center space-x-2 py-1 px-2"
        >
          <Switch
            checked={indicator.visible}
            onCheckedChange={() => onToggleIndicator(indicator.id)}
            className="scale-75"
          />
          <span className="text-xs">{indicator.name}</span>
        </Badge>
      ))}
    </div>
  );
};