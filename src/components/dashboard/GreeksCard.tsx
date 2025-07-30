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
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Activity, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { useGreeks } from '../../hooks/useApi';
import { useTradingStore } from '../../store/useTradingStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { LoadingCard } from '../ui/loading-spinner';

export const GreeksCard: React.FC = () => {
  const { selectedSymbol } = useTradingStore();
  const { settings } = useSettingsStore();
  const [refreshInterval, setRefreshInterval] = useState<number>(5000); // 5 seconds default
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Greeks calculation parameters - with defaults from settings
  const [greeksParams, setGreeksParams] = useState({
    riskFreeRate: settings.greeks?.riskFreeRate || 6.01,
    dividendYield: settings.greeks?.dividendYield || 0.0,
    ivGuess: settings.greeks?.ivCalculation?.initialGuess || 0.25,
    daysToExpiry: undefined as number | undefined,
  });
  
  // Construct option symbol from current selection - using ATM strike for now
  const currentDate = new Date();
  const nextThursday = new Date(currentDate);
  nextThursday.setDate(currentDate.getDate() + (4 - currentDate.getDay() + 7) % 7);
  const expiry = nextThursday.toISOString().slice(2, 10).replace(/-/g, '');
  
  // Mock ATM strike - in real implementation, this would come from current price
  const atmStrike = 24000; // This should be calculated from current price
  const optionSymbol = `${selectedSymbol}${expiry}C${atmStrike}`;
  
  const { data: greeks, isLoading, refetch } = useGreeks(optionSymbol, greeksParams);

  // Auto-refresh with configurable interval - prevent excessive blinking
  useEffect(() => {
    if (refreshInterval < 30000) return; // Minimum 30 seconds to prevent blinking
    
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
    
    const status = greeks.status || 'ATM';
    const variants = {
      'ITM': { variant: 'default', text: 'ITM', color: 'text-bull' },
      'ATM': { variant: 'secondary', text: 'ATM', color: 'text-neutral' },
      'OTM': { variant: 'outline', text: 'OTM', color: 'text-bear' },
    };
    
    return variants[status] || { variant: 'secondary', text: '--', color: 'text-muted-foreground' };
  };

  const getIVRankColor = () => {
    if (!greeks?.iv_rank) return 'text-muted-foreground';
    
    if (greeks.iv_rank > 80) return 'text-bear';
    if (greeks.iv_rank > 50) return 'text-neutral';
    return 'text-bull';
  };

  const getIVRankValue = () => {
    return greeks?.iv_rank ? `${greeks.iv_rank.toFixed(0)}%` : '--';
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
          <LoadingCard>Loading Greeks data...</LoadingCard>
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
                <SelectItem value="10000">10s</SelectItem>
                <SelectItem value="30000">30s</SelectItem>
                <SelectItem value="60000">1m</SelectItem>
                <SelectItem value="300000">5m</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Greeks Parameters</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="riskFreeRate" className="text-xs">Risk-Free Rate (%)</Label>
                      <Input
                        id="riskFreeRate"
                        type="number"
                        step="0.01"
                        value={greeksParams.riskFreeRate}
                        onChange={(e) => setGreeksParams(prev => ({ 
                          ...prev, 
                          riskFreeRate: parseFloat(e.target.value) || 0 
                        }))}
                        className="h-8 text-xs"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="dividendYield" className="text-xs">Dividend Yield (%)</Label>
                      <Input
                        id="dividendYield"
                        type="number"
                        step="0.01"
                        value={greeksParams.dividendYield}
                        onChange={(e) => setGreeksParams(prev => ({ 
                          ...prev, 
                          dividendYield: parseFloat(e.target.value) || 0 
                        }))}
                        className="h-8 text-xs"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="ivGuess" className="text-xs">IV Initial Guess</Label>
                      <Input
                        id="ivGuess"
                        type="number"
                        step="0.01"
                        min="0"
                        max="2"
                        value={greeksParams.ivGuess}
                        onChange={(e) => setGreeksParams(prev => ({ 
                          ...prev, 
                          ivGuess: parseFloat(e.target.value) || 0.25 
                        }))}
                        className="h-8 text-xs"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="daysToExpiry" className="text-xs">Days to Expiry (optional)</Label>
                      <Input
                        id="daysToExpiry"
                        type="number"
                        min="1"
                        placeholder="Auto-calculated"
                        value={greeksParams.daysToExpiry || ''}
                        onChange={(e) => setGreeksParams(prev => ({ 
                          ...prev, 
                          daysToExpiry: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => {
                        setGreeksParams({
                          riskFreeRate: 6.01,
                          dividendYield: 0.0,
                          ivGuess: 0.25,
                          daysToExpiry: undefined,
                        });
                      }}
                    >
                      Reset
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => {
                        refetch();
                        setLastRefresh(new Date());
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
            {greeks?.implied_volatility ? `${(greeks.implied_volatility * 100).toFixed(1)}%` : '--'}
          </span>
        </div>

        {/* IV Rank */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">IV Rank</span>
          <span className={`font-mono font-medium ${getIVRankColor()}`}>
            {getIVRankValue()}
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
            {greeks?.moneyness_percent ? `${greeks.moneyness_percent.toFixed(1)}%` : '--'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};