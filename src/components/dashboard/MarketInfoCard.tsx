/**
 * Market Info Card Component
 * Displays current market status, trend, and key metrics
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTradingStore } from '../../store/useTradingStore';
import { useDailyLevels } from '../../hooks/useApi';

export const MarketInfoCard: React.FC = () => {
  const { currentPrice, selectedSymbol } = useTradingStore();
  const { data: dailyLevels } = useDailyLevels(selectedSymbol);

  const getTrendIcon = () => {
    if (!currentPrice?.change) return <Minus className="h-4 w-4" />;
    return currentPrice.change > 0 ? 
      <TrendingUp className="h-4 w-4 text-bull" /> : 
      <TrendingDown className="h-4 w-4 text-bear" />;
  };

  const getTrendBadgeVariant = () => {
    if (!currentPrice?.change) return 'secondary';
    return currentPrice.change > 0 ? 'default' : 'destructive';
  };

  const getCPRType = () => {
    if (!dailyLevels) return 'Unknown';
    const range = dailyLevels.tc - dailyLevels.bc;
    const pivot = dailyLevels.pivot;
    const percentage = (range / pivot) * 100;
    
    if (percentage < 0.5) return 'Narrow';
    if (percentage > 1.5) return 'Wide';
    return 'Normal';
  };

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getTrendIcon()}
          Market Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Price */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Current Price</span>
          <span className="font-mono font-medium">
            {currentPrice?.close?.toFixed(2) || '--'}
          </span>
        </div>

        {/* Price Change */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Change</span>
          <div className="flex items-center gap-1">
            <span className={`font-mono text-sm ${
              currentPrice?.change && currentPrice.change > 0 ? 'text-bull' : 
              currentPrice?.change && currentPrice.change < 0 ? 'text-bear' : 
              'text-muted-foreground'
            }`}>
              {currentPrice?.change ? 
                `${currentPrice.change > 0 ? '+' : ''}${currentPrice.change.toFixed(2)}` : 
                '--'
              }
            </span>
            {currentPrice?.changePercent && (
              <Badge variant={getTrendBadgeVariant()} className="text-xs">
                {currentPrice.changePercent > 0 ? '+' : ''}{currentPrice.changePercent.toFixed(2)}%
              </Badge>
            )}
          </div>
        </div>

        {/* CPR Type */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">CPR Type</span>
          <Badge variant="outline" className="text-xs">
            {getCPRType()}
          </Badge>
        </div>

        {/* ORB Status */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">ORB Status</span>
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        </div>

        {/* NR7 Flag */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">NR7</span>
          <Badge variant="outline" className="text-xs">
            No
          </Badge>
        </div>

        {/* Last Update */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Last Update</span>
            <span className="text-xs font-mono text-muted-foreground">
              {currentPrice?.time ? 
                new Date(currentPrice.time).toLocaleTimeString() : 
                '--:--:--'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};