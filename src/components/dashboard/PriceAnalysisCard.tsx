/**
 * Price Analysis Card Component
 * Displays intrinsic value, time value, and premium analysis
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart3, TrendingUp, Settings } from 'lucide-react';
import { useGreeks } from '../../hooks/useApi';
import { useTradingStore } from '../../store/useTradingStore';

export const PriceAnalysisCard: React.FC = () => {
  const { selectedSymbol } = useTradingStore();
  const [refreshInterval, setRefreshInterval] = useState<number>(5000); // 5 seconds default
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Mock option symbol - would be constructed from current selection
  const optionSymbol = `${selectedSymbol}24DEC21000CE`;
  const { data: greeks, isLoading, refetch } = useGreeks(optionSymbol);

  // Auto-refresh with configurable interval
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refetch]);

  const getValueBreakdown = () => {
    if (!greeks) return { intrinsic: 0, time: 0, total: 0 };
    
    return {
      intrinsic: greeks.intrinsicValue,
      time: greeks.timeValue,
      total: greeks.theoreticalPrice,
    };
  };

  const getPremiumRatio = () => {
    const values = getValueBreakdown();
    if (values.total === 0) return { intrinsic: 0, time: 0 };
    
    return {
      intrinsic: (values.intrinsic / values.total) * 100,
      time: (values.time / values.total) * 100,
    };
  };

  const getIVPremiumStatus = () => {
    // Mock calculation - would compare current IV to historical IV
    const currentIV = greeks?.iv || 0;
    const historicalAvg = 0.18; // Mock 18% historical average
    
    const premium = ((currentIV - historicalAvg) / historicalAvg) * 100;
    
    if (premium > 20) return { status: 'High', variant: 'destructive', value: premium };
    if (premium > 10) return { status: 'Elevated', variant: 'secondary', value: premium };
    if (premium < -20) return { status: 'Low', variant: 'default', value: premium };
    return { status: 'Normal', variant: 'outline', value: premium };
  };

  if (isLoading) {
    return (
      <Card className="trading-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Price Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const values = getValueBreakdown();
  const ratios = getPremiumRatio();
  const ivPremium = getIVPremiumStatus();

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Price Analysis
          </div>
          <div className="flex items-center gap-2">
            <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
              <SelectTrigger className="w-20 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">1s</SelectItem>
                <SelectItem value="5000">5s</SelectItem>
                <SelectItem value="10000">10s</SelectItem>
                <SelectItem value="30000">30s</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => {
                refetch();
                setLastRefresh(new Date());
              }}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Theoretical Price */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Theoretical</span>
          <span className="font-mono font-medium">
            ₹{values.total.toFixed(2)}
          </span>
        </div>

        {/* Intrinsic Value */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Intrinsic</span>
            <span className="font-mono font-medium text-bull">
              ₹{values.intrinsic.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={ratios.intrinsic} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">
              {ratios.intrinsic.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Time Value */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Time Value</span>
            <span className="font-mono font-medium text-primary">
              ₹{values.time.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={ratios.time} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">
              {ratios.time.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* IV Premium Status */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">IV Premium</span>
          <div className="flex items-center gap-2">
            <Badge variant={ivPremium.variant as any} className="text-xs">
              {ivPremium.status}
            </Badge>
            <span className={`font-mono text-xs ${
              ivPremium.value > 0 ? 'text-bear' : 'text-bull'
            }`}>
              {ivPremium.value > 0 ? '+' : ''}{ivPremium.value.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Historical IV Comparison */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Hist. IV Avg</span>
          <span className="font-mono text-sm">
            18.0% {/* Mock historical average */}
          </span>
        </div>

        {/* Time Decay */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Daily Theta</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-bear rotate-180" />
            <span className="font-mono text-sm text-bear">
              ₹{Math.abs(greeks?.theta || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Break Even */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Break Even</span>
            <span className="font-mono font-medium">
              21,{(values.total + 21000).toFixed(0)} {/* Mock calculation */}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};