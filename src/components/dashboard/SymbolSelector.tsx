/**
 * Symbol Selector Component
 * For selecting trading symbol and timeframe
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useTradingStore } from '../../store/useTradingStore';
import { TrendingUp } from 'lucide-react';

export const SymbolSelector: React.FC = () => {
  const { selectedSymbol, selectedTimeframe, setSelectedSymbol, setSelectedTimeframe } = useTradingStore();

  const symbols = [
    { value: 'NIFTY', label: 'NIFTY 50' },
    { value: 'BANKNIFTY', label: 'BANKNIFTY' },
    { value: 'FINNIFTY', label: 'FINNIFTY' },
  ];

  const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trading Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symbol-select">Symbol</Label>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {symbols.map((symbol) => (
                <SelectItem key={symbol.value} value={symbol.value}>
                  {symbol.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeframe-select">Timeframe</Label>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};