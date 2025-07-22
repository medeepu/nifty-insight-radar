/**
 * Chart Controls - TradingView Style Indicator Panel
 */

import React, { useState } from 'react';
import { Plus, Settings, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '@/store/useSettingsStore';

const availableIndicators = [
  { id: 'ema9', name: 'EMA 9', category: 'Trend', icon: TrendingUp },
  { id: 'ema21', name: 'EMA 21', category: 'Trend', icon: TrendingUp },
  { id: 'ema50', name: 'EMA 50', category: 'Trend', icon: TrendingUp },
  { id: 'ema200', name: 'EMA 200', category: 'Trend', icon: TrendingUp },
  { id: 'vwap', name: 'VWAP', category: 'Volume', icon: BarChart2 },
  { id: 'rsi', name: 'RSI', category: 'Momentum', icon: Activity },
  { id: 'stochastic', name: 'Stochastic', category: 'Momentum', icon: Activity },
  { id: 'cpr', name: 'CPR', category: 'Pivot', icon: BarChart2 },
  { id: 'pivots', name: 'Pivot Levels', category: 'Pivot', icon: BarChart2 },
];

interface ActiveIndicator {
  id: string;
  name: string;
  visible: boolean;
}

export const ChartControls: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [activeIndicators, setActiveIndicators] = useState<ActiveIndicator[]>([
    { id: 'ema21', name: 'EMA 21', visible: true },
    { id: 'vwap', name: 'VWAP', visible: true },
  ]);

  const addIndicator = (indicator: typeof availableIndicators[0]) => {
    if (!activeIndicators.find(i => i.id === indicator.id)) {
      setActiveIndicators(prev => [...prev, {
        id: indicator.id,
        name: indicator.name,
        visible: true
      }]);
    }
  };

  const toggleIndicator = (id: string) => {
    setActiveIndicators(prev => 
      prev.map(ind => 
        ind.id === id ? { ...ind, visible: !ind.visible } : ind
      )
    );
  };

  const removeIndicator = (id: string) => {
    setActiveIndicators(prev => prev.filter(ind => ind.id !== id));
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Chart Indicators</h3>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Indicator
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Available Indicators</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['Trend', 'Volume', 'Momentum', 'Pivot'].map(category => (
                <div key={category}>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {category}
                  </DropdownMenuLabel>
                  {availableIndicators
                    .filter(ind => ind.category === category)
                    .map(indicator => (
                      <DropdownMenuItem 
                        key={indicator.id}
                        onClick={() => addIndicator(indicator)}
                        className="flex items-center"
                      >
                        <indicator.icon className="w-4 h-4 mr-2" />
                        {indicator.name}
                      </DropdownMenuItem>
                    ))
                  }
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active Indicators */}
      <div className="flex flex-wrap gap-2">
        {activeIndicators.map(indicator => (
          <Badge
            key={indicator.id}
            variant="outline"
            className="flex items-center space-x-2 py-1 px-3"
          >
            <Switch
              checked={indicator.visible}
              onCheckedChange={() => toggleIndicator(indicator.id)}
            />
            <span className="text-xs">{indicator.name}</span>
            <button
              onClick={() => removeIndicator(indicator.id)}
              className="ml-1 text-muted-foreground hover:text-destructive"
            >
              ×
            </button>
          </Badge>
        ))}
        
        {activeIndicators.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No indicators selected. Click "Add Indicator" to get started.
          </p>
        )}
      </div>
    </Card>
  );
};