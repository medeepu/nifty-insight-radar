/**
 * Chart Settings Panel
 * Granular control over indicators and chart options
 */

import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { TrendingUp, Activity, X } from 'lucide-react';
import { useChartStore, Chart } from '../../store/useChartStore';

interface ChartSettingsProps {
  chart: Chart;
  onClose: () => void;
}

export const ChartSettings: React.FC<ChartSettingsProps> = ({ chart, onClose }) => {
  const { 
    updateChart, 
    toggleIndicator, 
    toggleIndicatorSubSetting,
    availableSymbols,
    availableTimeframes 
  } = useChartStore();

  const overlayIndicators = chart.indicators.filter(ind => ind.type === 'overlay');
  const oscillatorIndicators = chart.indicators.filter(ind => ind.type === 'oscillator');

  const handleSymbolChange = (newSymbol: string) => {
    updateChart(chart.id, { symbol: newSymbol });
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    updateChart(chart.id, { timeframe: newTimeframe });
  };

  return (
    <Card className="border-t-0 border-l-0 border-r-0 rounded-t-none">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Chart Settings</h4>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium">Basic Settings</h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Symbol</label>
                <Select value={chart.symbol} onValueChange={handleSymbolChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Timeframe</label>
                <Select value={chart.timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeframes.map(tf => (
                      <SelectItem key={tf} value={tf}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Overlay Indicators */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <h5 className="text-sm font-medium">Overlay Indicators</h5>
            </div>
            
            <div className="space-y-3">
              {overlayIndicators.map(indicator => (
                <div key={indicator.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={indicator.enabled}
                        onCheckedChange={() => toggleIndicator(chart.id, indicator.id)}
                      />
                      <span className="text-sm">{indicator.name}</span>
                    </div>
                    {indicator.enabled && (
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>

                  {/* Sub-settings for CPR */}
                  {indicator.id === 'cpr' && indicator.enabled && indicator.subSettings && (
                    <div className="ml-6 space-y-2">
                      <div className="text-xs text-muted-foreground mb-2">CPR Components:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(indicator.subSettings).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1">
                            <Switch
                              checked={value}
                              onCheckedChange={() => toggleIndicatorSubSetting(chart.id, indicator.id, key)}
                              className="scale-75"
                            />
                            <span className="text-xs capitalize">
                              {key === 'centralTop' ? 'TC' : 
                               key === 'centralBottom' ? 'BC' : 
                               key.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-settings for Pivot Levels */}
                  {indicator.id === 'pivot-levels' && indicator.enabled && indicator.subSettings && (
                    <div className="ml-6 space-y-2">
                      <div className="text-xs text-muted-foreground mb-2">Pivot Timeframes:</div>
                      <div className="flex gap-3">
                        {Object.entries(indicator.subSettings).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1">
                            <Switch
                              checked={value}
                              onCheckedChange={() => toggleIndicatorSubSetting(chart.id, indicator.id, key)}
                              className="scale-75"
                            />
                            <span className="text-xs capitalize">{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Oscillator Indicators */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <h5 className="text-sm font-medium">Oscillator Indicators</h5>
            </div>
            
            <div className="space-y-3">
              {oscillatorIndicators.map(indicator => (
                <div key={indicator.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={indicator.enabled}
                      onCheckedChange={() => toggleIndicator(chart.id, indicator.id)}
                    />
                    <span className="text-sm">{indicator.name}</span>
                  </div>
                  {indicator.enabled && (
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};