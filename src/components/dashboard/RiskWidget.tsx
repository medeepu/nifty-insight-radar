/**
 * Risk Management Widget Component
 * Displays risk metrics, position sizing, and risk-reward analysis
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Shield, AlertTriangle, DollarSign } from 'lucide-react';
import { useTradingStore } from '../../store/useTradingStore';
import { useSettingsStore } from '../../store/useSettingsStore';

export const RiskWidget: React.FC = () => {
  const { currentSignal, currentPrice } = useTradingStore();
  const { settings } = useSettingsStore();

  const calculatePositionSize = () => {
    const { maxBudget, maxLossPerTrade } = settings.budgetRisk;
    
    if (!currentSignal || !currentPrice) return 0;
    
    const riskAmount = (maxBudget * maxLossPerTrade) / 100;
    const stopLossDistance = Math.abs(currentSignal.entry - currentSignal.sl);
    
    if (stopLossDistance === 0) return 0;
    
    const quantity = Math.floor(riskAmount / stopLossDistance);
    return Math.min(quantity, Math.floor(maxBudget / currentSignal.entry));
  };

  const getRiskRewardMetrics = () => {
    if (!currentSignal) return { rr: 0, profit: 0, loss: 0 };
    
    const profit = currentSignal.tp - currentSignal.entry;
    const loss = currentSignal.entry - currentSignal.sl;
    const rr = loss > 0 ? profit / loss : 0;
    
    return { rr, profit, loss };
  };

  const getBudgetUtilization = () => {
    const positionSize = calculatePositionSize();
    const { maxBudget } = settings.budgetRisk;
    
    if (!currentSignal || positionSize === 0) return 0;
    
    const usedBudget = positionSize * currentSignal.entry;
    return (usedBudget / maxBudget) * 100;
  };

  const getRiskLevel = () => {
    const budgetUtil = getBudgetUtilization();
    const { rr } = getRiskRewardMetrics();
    
    if (budgetUtil > 80 || rr < 1.5) return { level: 'High', variant: 'destructive', color: 'text-bear' };
    if (budgetUtil > 60 || rr < 2) return { level: 'Medium', variant: 'secondary', color: 'text-neutral' };
    return { level: 'Low', variant: 'default', color: 'text-bull' };
  };

  const positionSize = calculatePositionSize();
  const metrics = getRiskRewardMetrics();
  const budgetUtil = getBudgetUtilization();
  const riskLevel = getRiskLevel();

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Risk Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Risk Level */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Risk Level</span>
          <div className="flex items-center gap-2">
            <Badge variant={riskLevel.variant as any} className="text-xs">
              {riskLevel.level}
            </Badge>
            {riskLevel.level === 'High' && (
              <AlertTriangle className="h-3 w-3 text-bear" />
            )}
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Budget Used</span>
            <span className="font-mono text-sm">
              {budgetUtil.toFixed(1)}%
            </span>
          </div>
          <Progress value={budgetUtil} className="h-2" />
        </div>

        {/* Max Budget */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Max Budget</span>
          <span className="font-mono font-medium">
            ₹{settings.budgetRisk.maxBudget.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Position Size */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Recommended Qty</span>
          <span className="font-mono font-medium">
            {positionSize > 0 ? positionSize.toLocaleString('en-IN') : '--'}
          </span>
        </div>

        {/* Risk-Reward Ratio */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Risk:Reward</span>
          <div className="flex items-center gap-1">
            <span className={`font-mono font-medium ${
              metrics.rr >= 2 ? 'text-bull' : 
              metrics.rr >= 1.5 ? 'text-neutral' : 
              'text-bear'
            }`}>
              1:{metrics.rr.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Potential P&L */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Max Profit</span>
            <span className="font-mono text-sm text-bull">
              +₹{positionSize > 0 ? (metrics.profit * positionSize).toFixed(0) : '--'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Max Loss</span>
            <span className="font-mono text-sm text-bear">
              -₹{positionSize > 0 ? (metrics.loss * positionSize).toFixed(0) : '--'}
            </span>
          </div>
        </div>

        {/* Max Loss Per Trade Setting */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Max Loss/Trade</span>
          <span className="font-mono text-sm">
            {settings.budgetRisk.maxLossPerTrade}%
          </span>
        </div>

        {/* Daily/Weekly Limits */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Daily Limit</span>
            <span className="font-mono text-xs">
              {settings.budgetRisk.dailyLossLimit}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Weekly Limit</span>
            <span className="font-mono text-xs">
              {settings.budgetRisk.weeklyLossLimit}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};