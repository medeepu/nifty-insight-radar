/**
 * Greeks Card Component
 * Displays option Greeks with visual indicators
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Activity, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { useGreeks } from '../../hooks/useApi';
import { useTradingStore } from '../../store/useTradingStore';

export const GreeksCard: React.FC = () => {
  const { selectedSymbol } = useTradingStore();
  const [refreshInterval, setRefreshInterval] = useState<number>(5000); // 5 seconds default
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // This would need to be constructed from current option selection
  const optionSymbol = `${selectedSymbol}24DEC21000CE`; // Mock symbol
  const { data: greeks, isLoading, refetch } = useGreeks(optionSymbol);

  // Auto-refresh with configurable interval - prevent excessive blinking
  useEffect(() => {
    if (refreshInterval < 3000) return; // Minimum 3 seconds to prevent blinking
    
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refetch]);

  const getGreekColor = (value: number, type: 'delta' | 'gamma' | 'theta' | 'vega') => {
    switch (type) {
      case 'delta':
        return Math.abs(value) > 0.5 ? 'text-bull' : 'text-muted-foreground';
      case 'gamma':
        return value > 0.1 ? 'text-primary' : 'text-muted-foreground';
      case 'theta':
        return value < -0.05 ? 'text-bear' : 'text-muted-foreground';
      case 'vega':
        return value > 0.1 ? 'text-accent' : 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getMoneynessBadge = () => {
    if (!greeks) return { variant: 'secondary', text: '--' };
    
    switch (greeks.status) {
      case 'ITM':
        return { variant: 'default', text: 'ITM' };
      case 'ATM':
        return { variant: 'secondary', text: 'ATM' };
      case 'OTM':
        return { variant: 'outline', text: 'OTM' };
      default:
        return { variant: 'secondary', text: '--' };
    }
  };

  const getIVRankColor = () => {
    if (!greeks) return 'text-muted-foreground';
    // Mock IV Rank calculation
    const ivRank = 65; // This would come from the API
    if (ivRank > 80) return 'text-bear';
    if (ivRank > 50) return 'text-neutral';
    return 'text-bull';
  };

  if (isLoading) {
    return (
      <Card className="trading-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Greeks
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

  const moneynessBadge = getMoneynessBadge();

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Greeks
          </div>
          <div className="flex items-center gap-2">
            <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
              <SelectTrigger className="w-20 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3000">3s</SelectItem>
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
        {/* Delta */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Delta</span>
            <span className={`font-mono font-medium ${getGreekColor(greeks?.delta || 0, 'delta')}`}>
              {greeks?.delta?.toFixed(3) || '--'}
            </span>
          </div>
          <Progress 
            value={Math.abs((greeks?.delta || 0) * 100)} 
            className="h-1"
          />
        </div>

        {/* Gamma */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Gamma</span>
            <span className={`font-mono font-medium ${getGreekColor(greeks?.gamma || 0, 'gamma')}`}>
              {greeks?.gamma?.toFixed(4) || '--'}
            </span>
          </div>
          <Progress 
            value={(greeks?.gamma || 0) * 1000} 
            className="h-1"
          />
        </div>

        {/* Theta */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Theta</span>
            <span className={`font-mono font-medium ${getGreekColor(greeks?.theta || 0, 'theta')}`}>
              {greeks?.theta?.toFixed(3) || '--'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {greeks && greeks.theta < -0.05 && (
              <TrendingDown className="h-3 w-3 text-bear" />
            )}
            <Progress 
              value={Math.abs((greeks?.theta || 0) * 100)} 
              className="h-1 flex-1"
            />
          </div>
        </div>

        {/* Vega */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Vega</span>
            <span className={`font-mono font-medium ${getGreekColor(greeks?.vega || 0, 'vega')}`}>
              {greeks?.vega?.toFixed(3) || '--'}
            </span>
          </div>
          <Progress 
            value={(greeks?.vega || 0) * 100} 
            className="h-1"
          />
        </div>

        {/* Implied Volatility */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">IV</span>
          <span className="font-mono font-medium">
            {greeks?.iv ? `${(greeks.iv * 100).toFixed(1)}%` : '--'}
          </span>
        </div>

        {/* IV Rank */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">IV Rank</span>
          <span className={`font-mono font-medium ${getIVRankColor()}`}>
            65% {/* Mock value */}
          </span>
        </div>

        {/* Moneyness */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Status</span>
          <Badge variant={moneynessBadge.variant as any} className="text-xs">
            {moneynessBadge.text}
          </Badge>
        </div>

        {/* Moneyness Percentage */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Moneyness</span>
          <span className="font-mono text-sm">
            {greeks?.moneynessPercent ? `${greeks.moneynessPercent.toFixed(1)}%` : '--'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};