/**
 * Chart Indicators Component
 * Displays and manages technical indicators for the chart
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Settings, TrendingUp, BarChart3, Activity } from 'lucide-react';

interface Indicator {
  id: string;
  name: string;
  type: 'overlay' | 'oscillator';
  enabled: boolean;
  value?: number;
  signal?: 'BUY' | 'SELL' | 'NEUTRAL';
  color: string;
}

const mockIndicators: Indicator[] = [
  {
    id: 'ema9',
    name: 'EMA 9',
    type: 'overlay',
    enabled: true,
    value: 22485,
    signal: 'BUY',
    color: '#22c55e',
  },
  {
    id: 'ema21',
    name: 'EMA 21',
    type: 'overlay',
    enabled: true,
    value: 22445,
    signal: 'BUY',
    color: '#3b82f6',
  },
  {
    id: 'ema50',
    name: 'EMA 50',
    type: 'overlay',
    enabled: true,
    value: 22365,
    signal: 'BUY',
    color: '#f59e0b',
  },
  {
    id: 'ema200',
    name: 'EMA 200',
    type: 'overlay',
    enabled: false,
    value: 21950,
    signal: 'BUY',
    color: '#ef4444',
  },
  {
    id: 'vwap',
    name: 'VWAP',
    type: 'overlay',
    enabled: true,
    value: 22520,
    signal: 'NEUTRAL',
    color: '#8b5cf6',
  },
  {
    id: 'rsi',
    name: 'RSI (14)',
    type: 'oscillator',
    enabled: true,
    value: 62.5,
    signal: 'NEUTRAL',
    color: '#06b6d4',
  },
  {
    id: 'stochastic',
    name: 'Stochastic',
    type: 'oscillator',
    enabled: false,
    value: 58.3,
    signal: 'BUY',
    color: '#ec4899',
  },
  {
    id: 'cpr',
    name: 'CPR',
    type: 'overlay',
    enabled: true,
    signal: 'BUY',
    color: '#f97316',
  },
  {
    id: 'pivots',
    name: 'Pivot Points',
    type: 'overlay',
    enabled: true,
    signal: 'NEUTRAL',
    color: '#84cc16',
  },
];

export const ChartIndicators: React.FC = () => {
  const [indicators, setIndicators] = React.useState(mockIndicators);

  const toggleIndicator = (id: string) => {
    setIndicators(prev => prev.map(indicator => 
      indicator.id === id 
        ? { ...indicator, enabled: !indicator.enabled }
        : indicator
    ));
  };

  const getSignalBadge = (signal?: string) => {
    switch (signal) {
      case 'BUY':
        return <Badge className="bg-bull-green/10 text-bull-green border-bull-green/20 text-xs">BUY</Badge>;
      case 'SELL':
        return <Badge className="bg-bear-red/10 text-bear-red border-bear-red/20 text-xs">SELL</Badge>;
      case 'NEUTRAL':
        return <Badge className="bg-neutral-yellow/10 text-neutral-yellow border-neutral-yellow/20 text-xs">NEUTRAL</Badge>;
      default:
        return null;
    }
  };

  const overlayIndicators = indicators.filter(i => i.type === 'overlay');
  const oscillatorIndicators = indicators.filter(i => i.type === 'oscillator');

  return (
    <div className="space-y-4">
      {/* Overlay Indicators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overlay Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {overlayIndicators.map((indicator) => (
            <div key={indicator.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={indicator.enabled}
                  onCheckedChange={() => toggleIndicator(indicator.id)}
                />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: indicator.color }}
                  />
                  <Label className="text-sm">{indicator.name}</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {indicator.value && (
                  <span className="font-mono text-sm">
                    ₹{indicator.value.toLocaleString()}
                  </span>
                )}
                {getSignalBadge(indicator.signal)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Oscillator Indicators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Oscillator Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {oscillatorIndicators.map((indicator) => (
            <div key={indicator.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={indicator.enabled}
                  onCheckedChange={() => toggleIndicator(indicator.id)}
                />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: indicator.color }}
                  />
                  <Label className="text-sm">{indicator.name}</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {indicator.value && (
                  <span className="font-mono text-sm">
                    {indicator.value.toFixed(1)}
                  </span>
                )}
                {getSignalBadge(indicator.signal)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Enable all overlay indicators
                setIndicators(prev => prev.map(indicator => 
                  indicator.type === 'overlay' 
                    ? { ...indicator, enabled: true }
                    : indicator
                ));
              }}
            >
              Enable All Overlays
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Reset to defaults
                setIndicators(mockIndicators);
              }}
            >
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};