/**
 * Strategy Analysis Page
 * 
 * Purpose:
 * - Provides comprehensive analysis of trading strategies and their performance
 * - Shows strategy comparison, optimization results, and market regime analysis
 * - Displays risk metrics, drawdown analysis, and portfolio allocation
 * - Helps users understand which strategies work best in different market conditions
 * 
 * Features:
 * - Strategy performance comparison
 * - Risk-adjusted returns analysis
 * - Market regime detection and strategy adaptation
 * - Monte Carlo simulations for risk assessment
 * - Optimization recommendations
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  AlertTriangle,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';

export const StrategyAnalysis: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');
  const [timeframe, setTimeframe] = useState('1M');

  const strategies = [
    {
      id: 'momentum',
      name: 'Momentum Breakout',
      description: 'Trades breakouts with high volume confirmation',
      winRate: 68,
      avgReturn: 12.5,
      maxDrawdown: -8.2,
      sharpeRatio: 1.85,
      trades: 156,
      status: 'Active'
    },
    {
      id: 'mean_reversion',
      name: 'Mean Reversion',
      description: 'Capitalizes on price reversals at support/resistance',
      winRate: 72,
      avgReturn: 8.3,
      maxDrawdown: -5.1,
      sharpeRatio: 1.92,
      trades: 203,
      status: 'Active'
    },
    {
      id: 'volatility',
      name: 'Volatility Trading',
      description: 'Exploits IV expansion and contraction cycles',
      winRate: 65,
      avgReturn: 15.2,
      maxDrawdown: -12.8,
      sharpeRatio: 1.67,
      trades: 89,
      status: 'Paused'
    },
    {
      id: 'scalping',
      name: 'Scalping Strategy',
      description: 'High-frequency trades on small price movements',
      winRate: 58,
      avgReturn: 6.7,
      maxDrawdown: -3.2,
      sharpeRatio: 1.43,
      trades: 567,
      status: 'Active'
    }
  ];

  const marketRegimes = [
    { regime: 'Trending Bull', probability: 35, strategies: ['momentum', 'volatility'] },
    { regime: 'Trending Bear', probability: 20, strategies: ['mean_reversion'] },
    { regime: 'Sideways', probability: 25, strategies: ['mean_reversion', 'scalping'] },
    { regime: 'High Volatility', probability: 20, strategies: ['volatility', 'momentum'] }
  ];

  const riskMetrics = {
    portfolioVaR: 2.8,
    expectedShortfall: 4.2,
    volatility: 15.6,
    beta: 1.12,
    alpha: 3.2,
    informationRatio: 0.89
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Strategy Analysis
        </h1>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1W">1W</SelectItem>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="6M">6M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Strategy Comparison</TabsTrigger>
          <TabsTrigger value="regime">Market Regime</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-2xl font-bold text-bull">+24.8%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-bull" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">1.72</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    <p className="text-2xl font-bold text-bear">-7.2%</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-bear" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">66%</p>
                  </div>
                  <Percent className="h-8 w-8 text-neutral" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Strategies Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{strategy.name}</h3>
                        <Badge variant={strategy.status === 'Active' ? 'default' : 'secondary'}>
                          {strategy.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-mono text-sm">
                        <span className="text-bull">+{strategy.avgReturn}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {strategy.trades} trades
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategy Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Strategy</th>
                      <th className="text-left p-2">Win Rate</th>
                      <th className="text-left p-2">Avg Return</th>
                      <th className="text-left p-2">Max DD</th>
                      <th className="text-left p-2">Sharpe</th>
                      <th className="text-left p-2">Trades</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strategies.map((strategy) => (
                      <tr key={strategy.id} className="border-b hover:bg-muted/20">
                        <td className="p-2 font-medium">{strategy.name}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Progress value={strategy.winRate} className="h-2 w-16" />
                            <span className="text-sm">{strategy.winRate}%</span>
                          </div>
                        </td>
                        <td className="p-2 font-mono text-bull">+{strategy.avgReturn}%</td>
                        <td className="p-2 font-mono text-bear">{strategy.maxDrawdown}%</td>
                        <td className="p-2 font-mono">{strategy.sharpeRatio}</td>
                        <td className="p-2">{strategy.trades}</td>
                        <td className="p-2">
                          <Badge variant={strategy.status === 'Active' ? 'default' : 'secondary'}>
                            {strategy.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Regime Analysis */}
        <TabsContent value="regime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Market Regime</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketRegimes.map((regime, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{regime.regime}</span>
                      <span className="text-sm">{regime.probability}%</span>
                    </div>
                    <Progress value={regime.probability} className="h-2" />
                    <div className="flex gap-1">
                      {regime.strategies.map((strategyId) => {
                        const strategy = strategies.find(s => s.id === strategyId);
                        return strategy ? (
                          <Badge key={strategyId} variant="outline" className="text-xs">
                            {strategy.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regime-Based Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-bull/10 rounded-lg">
                  <h4 className="font-medium text-bull mb-1">Recommended Strategy</h4>
                  <p className="text-sm">Momentum Breakout - High probability trending market detected</p>
                </div>
                
                <div className="p-3 bg-neutral/10 rounded-lg">
                  <h4 className="font-medium text-neutral mb-1">Risk Warning</h4>
                  <p className="text-sm">Volatility increasing - Consider position sizing adjustments</p>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-primary mb-1">Market Context</h4>
                  <p className="text-sm">Options premium elevated - Favorable for volatility strategies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio VaR (95%)</p>
                    <p className="text-xl font-bold text-bear">-{riskMetrics.portfolioVaR}%</p>
                  </div>
                  <Shield className="h-6 w-6 text-bear" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Shortfall</p>
                    <p className="text-xl font-bold text-bear">-{riskMetrics.expectedShortfall}%</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-bear" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Beta</p>
                    <p className="text-xl font-bold">{riskMetrics.beta}</p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Decomposition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Strategy Risk</span>
                    <span className="text-sm">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Market Risk</span>
                    <span className="text-sm">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Execution Risk</span>
                    <span className="text-sm">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-primary/20 rounded-lg">
                <h3 className="font-medium text-primary mb-2">Position Sizing Optimization</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Current Kelly Criterion suggests reducing position size by 15% to optimize risk-adjusted returns.
                </p>
                <Button variant="outline" size="sm">Apply Recommendation</Button>
              </div>

              <div className="p-4 border border-neutral/20 rounded-lg">
                <h3 className="font-medium text-neutral mb-2">Strategy Allocation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Consider increasing allocation to Mean Reversion strategy during current market regime.
                </p>
                <Button variant="outline" size="sm">View Details</Button>
              </div>

              <div className="p-4 border border-bull/20 rounded-lg">
                <h3 className="font-medium text-bull mb-2">Entry Timing Optimization</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Analysis shows 12% improvement in returns with delayed entry on volatility strategies.
                </p>
                <Button variant="outline" size="sm">Implement Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyAnalysis;