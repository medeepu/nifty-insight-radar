/**
 * Modern Trading Chart - TradingView Style with Overlays
 */

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings, Plus, X, TrendingUp, Activity } from 'lucide-react';

interface Indicator {
  id: string;
  name: string;
  type: 'overlay' | 'oscillator';
  enabled: boolean;
}

const availableIndicators: Indicator[] = [
  { id: 'ema-9', name: 'EMA 9', type: 'overlay', enabled: false },
  { id: 'ema-21', name: 'EMA 21', type: 'overlay', enabled: false },
  { id: 'ema-50', name: 'EMA 50', type: 'overlay', enabled: false },
  { id: 'ema-200', name: 'EMA 200', type: 'overlay', enabled: false },
  { id: 'vwap', name: 'VWAP', type: 'overlay', enabled: false },
  { id: 'cpr', name: 'CPR', type: 'overlay', enabled: false },
  { id: 'pivot-levels', name: 'Pivot Levels', type: 'overlay', enabled: false },
  { id: 'rsi', name: 'RSI', type: 'oscillator', enabled: false },
  { id: 'stochastic', name: 'Stochastic', type: 'oscillator', enabled: false },
];

export const ModernTradingChart: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>(availableIndicators);
  const [showAddIndicator, setShowAddIndicator] = useState(false);

  const toggleIndicator = (id: string) => {
    setIndicators(prev => 
      prev.map(ind => 
        ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
      )
    );
  };

  const addIndicator = (indicatorId: string) => {
    toggleIndicator(indicatorId);
    setShowAddIndicator(false);
  };

  const enabledIndicators = indicators.filter(ind => ind.enabled);
  const availableToAdd = indicators.filter(ind => !ind.enabled);

  return (
    <Card className="h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">NIFTY Chart</h3>
            <Badge variant="outline">5m</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Active Indicators */}
            {enabledIndicators.map((indicator) => (
              <Badge 
                key={indicator.id} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {indicator.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleIndicator(indicator.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            
            {/* Add Indicator */}
            {availableToAdd.length > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddIndicator(!showAddIndicator)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Indicator
                </Button>
                
                {showAddIndicator && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Overlays</div>
                      {availableToAdd.filter(ind => ind.type === 'overlay').map((indicator) => (
                        <Button
                          key={indicator.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8"
                          onClick={() => addIndicator(indicator.id)}
                        >
                          <TrendingUp className="h-3 w-3 mr-2" />
                          {indicator.name}
                        </Button>
                      ))}
                      
                      <div className="text-xs font-medium text-muted-foreground mb-2 mt-3">Oscillators</div>
                      {availableToAdd.filter(ind => ind.type === 'oscillator').map((indicator) => (
                        <Button
                          key={indicator.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8"
                          onClick={() => addIndicator(indicator.id)}
                        >
                          <Activity className="h-3 w-3 mr-2" />
                          {indicator.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 h-96 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-2xl mb-2">📈</div>
          <p>TradingView-style Chart</p>
          <p className="text-sm">Real-time candlestick chart with {enabledIndicators.length} indicators active</p>
          {enabledIndicators.length > 0 && (
            <div className="mt-2 text-xs">
              Active: {enabledIndicators.map(ind => ind.name).join(', ')}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};