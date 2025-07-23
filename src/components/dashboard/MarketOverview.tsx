/**
 * Market Overview Cards - Compact TradingView Style
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useChartStore } from '../../store/useChartStore';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  status: 'bullish' | 'bearish' | 'neutral';
}

// Available widgets to choose from
const availableWidgets = [
  { symbol: 'NIFTY 50', price: 22547.95, change: 125.40, changePercent: 0.56, volume: '1.3M', status: 'bullish' as const },
  { symbol: 'BANKNIFTY', price: 48925.3, change: -89.75, changePercent: -0.18, volume: '985K', status: 'bearish' as const },
  { symbol: 'FINNIFTY', price: 23840.15, change: 12.85, changePercent: 0.05, volume: '456K', status: 'neutral' as const },
  { symbol: 'SENSEX', price: 74611.11, change: 45.32, changePercent: 0.06, volume: '823K', status: 'neutral' as const },
  { symbol: 'MIDCPNIFTY', price: 58934.20, change: -23.15, changePercent: -0.04, volume: '234K', status: 'bearish' as const },
  { symbol: 'SMALLCPNIFTY', price: 18456.75, change: 87.90, changePercent: 0.48, volume: '456K', status: 'bullish' as const },
  { symbol: 'CRUDEOIL', price: 6789.45, change: -12.30, changePercent: -0.18, volume: '567K', status: 'bearish' as const },
  { symbol: 'GOLD', price: 72345.60, change: 234.50, changePercent: 0.33, volume: '789K', status: 'bullish' as const }
];

const getStatusBadge = (status: MarketData['status']) => {
  switch (status) {
    case 'bullish':
      return <Badge className="bg-bull-green/10 text-bull-green border-bull-green/20">Bullish</Badge>;
    case 'bearish':
      return <Badge className="bg-bear-red/10 text-bear-red border-bear-red/20">Bearish</Badge>;
    case 'neutral':
      return <Badge className="bg-neutral-yellow/10 text-neutral-yellow border-neutral-yellow/20">Neutral</Badge>;
  }
};

export const MarketOverview: React.FC = () => {
  const [selectedWidgets, setSelectedWidgets] = useState<MarketData[]>(
    availableWidgets.slice(0, 3) // Default first 3 widgets
  );

  const addWidget = (widget: MarketData) => {
    if (selectedWidgets.length < 5 && !selectedWidgets.find(w => w.symbol === widget.symbol)) {
      setSelectedWidgets([...selectedWidgets, widget]);
    }
  };

  const { addChart } = useChartStore();

  const addAsChart = (symbol: string) => {
    addChart(symbol);
  };

  const replaceWidget = (index: number, newWidget: MarketData) => {
    const newWidgets = [...selectedWidgets];
    newWidgets[index] = newWidget;
    setSelectedWidgets(newWidgets);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Market Overview
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {selectedWidgets.map((market, index) => (
          <Card key={`${market.symbol}-${index}`} className="p-3 min-w-48 hover:shadow-lg transition-shadow group">
            <div className="flex items-start justify-between mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-sm font-medium text-foreground hover:text-primary">
                    {market.symbol}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableWidgets.map((widget) => (
                    <DropdownMenuItem 
                      key={widget.symbol}
                      onClick={() => replaceWidget(index, widget)}
                      disabled={selectedWidgets.find(w => w.symbol === widget.symbol) !== undefined}
                    >
                      {widget.symbol}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2">
                {getStatusBadge(market.status)}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => addAsChart(market.symbol)}
                  title="Add as chart"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-bold text-foreground">
                ₹{market.price.toLocaleString()}
              </div>

              <div className="flex items-center text-xs">
                <div className={cn(
                  "flex items-center space-x-1",
                  market.change >= 0 ? "text-bull-green" : "text-bear-red"
                )}>
                  {market.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {market.change >= 0 ? '+' : ''}
                    {market.change.toFixed(2)} ({market.changePercent >= 0 ? '+' : ''}
                    {market.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Vol: {market.volume}
              </div>
            </div>
          </Card>
        ))}
        
        {selectedWidgets.length < 5 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Card className="p-3 min-w-48 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center text-muted-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Widget
                </div>
              </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableWidgets
                .filter(widget => !selectedWidgets.find(w => w.symbol === widget.symbol))
                .map((widget) => (
                  <DropdownMenuItem 
                    key={widget.symbol}
                    onClick={() => addWidget(widget)}
                  >
                    {widget.symbol}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};