/**
 * Market Overview Cards - Compact TradingView Style
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  status: 'bullish' | 'bearish' | 'neutral';
}

// Mock data - replace with real API data
const marketData: MarketData[] = [
  {
    symbol: 'NIFTY 50',
    price: 22547.95,
    change: 125.40,
    changePercent: 0.56,
    volume: '1.3M',
    status: 'bullish'
  },
  {
    symbol: 'BANKNIFTY',
    price: 48925.3,
    change: -89.75,
    changePercent: -0.18,
    volume: '985K',
    status: 'bearish'
  },
  {
    symbol: 'FINNIFTY',
    price: 23840.15,
    change: 12.85,
    changePercent: 0.05,
    volume: '456K',
    status: 'neutral'
  }
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Market Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketData.map((market) => (
          <Card key={market.symbol} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm font-medium text-foreground">
                {market.symbol}
              </div>
              {getStatusBadge(market.status)}
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">
                ₹{market.price.toLocaleString()}
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className={cn(
                  "flex items-center space-x-1",
                  market.change >= 0 ? "text-bull-green" : "text-bear-red"
                )}>
                  {market.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {market.change >= 0 ? '+' : ''}
                    {market.change.toFixed(2)} ({market.changePercent >= 0 ? '+' : ''}
                    {market.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Volume: {market.volume}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};