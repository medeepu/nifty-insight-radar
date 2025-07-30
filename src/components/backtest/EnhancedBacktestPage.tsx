/**
 * Enhanced Backtesting Page
 * Integrates with the new async signal generation and position sizing
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Calendar, TrendingUp, TrendingDown, PlayCircle, Download } from 'lucide-react';
import { useBacktest } from '../../hooks/useApi';
import { BacktestRequest, BacktestResult } from '../../types/api';
import { useTradingStore } from '../../store/useTradingStore';

export const EnhancedBacktestPage: React.FC = () => {
  const { selectedSymbol } = useTradingStore();
  const [backtestParams, setBacktestParams] = useState<BacktestRequest>({
    symbol: selectedSymbol,
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0], // Today
    timeframe: '5m',
    paramsOverride: {},
  });

  const [results, setResults] = useState<BacktestResult | null>(null);
  const backtestMutation = useBacktest();

  const handleRunBacktest = async () => {
    try {
      const result = await backtestMutation.mutateAsync(backtestParams);
      setResults(result);
    } catch (error) {
      console.error('Backtest failed:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportResults = () => {
    if (!results) return;
    
    const csvContent = [
      ['Date In', 'Date Out', 'Entry', 'Exit', 'P&L', 'Direction', 'Scenario'].join(','),
      ...results.trades.map(trade => [
        trade.dateIn,
        trade.dateOut,
        trade.entry,
        trade.exit,
        trade.pnl,
        trade.direction,
        trade.scenario
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest_${backtestParams.symbol}_${backtestParams.from}_${backtestParams.to}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Backtesting</h1>
          <p className="text-muted-foreground">
            Test your strategy with async signal generation and dynamic position sizing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Backtest Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select
                value={backtestParams.symbol}
                onValueChange={(value) => setBacktestParams(prev => ({ ...prev, symbol: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NIFTY">NIFTY</SelectItem>
                  <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
                  <SelectItem value="SENSEX">SENSEX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={backtestParams.timeframe}
                onValueChange={(value) => setBacktestParams(prev => ({ ...prev, timeframe: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From Date</Label>
                <Input
                  id="from"
                  type="date"
                  value={backtestParams.from}
                  onChange={(e) => setBacktestParams(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To Date</Label>
                <Input
                  id="to"
                  type="date"
                  value={backtestParams.to}
                  onChange={(e) => setBacktestParams(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>

            <Button
              onClick={handleRunBacktest}
              disabled={backtestMutation.isPending}
              className="w-full"
            >
              {backtestMutation.isPending ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Running Backtest...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Run Backtest
                </>
              )}
            </Button>

            {backtestMutation.isPending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>Please wait</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results && (
            <>
              {/* Performance Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Performance Summary</CardTitle>
                  <Button variant="outline" size="sm" onClick={exportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total P&L</p>
                      <p className={`text-lg font-semibold ${results.stats.totalPnL >= 0 ? 'text-bull' : 'text-bear'}`}>
                        {formatCurrency(results.stats.totalPnL)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-lg font-semibold">
                        {formatPercentage(results.stats.winRate)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Trades</p>
                      <p className="text-lg font-semibold">{results.stats.totalTrades}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Profit Factor</p>
                      <p className="text-lg font-semibold">{results.stats.profitFactor.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trades Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Trade History</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showing {results.trades.length} trades with dynamic position sizing
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="py-2 text-sm font-medium">Entry</th>
                          <th className="py-2 text-sm font-medium">Exit</th>
                          <th className="py-2 text-sm font-medium">Direction</th>
                          <th className="py-2 text-sm font-medium">Entry Price</th>
                          <th className="py-2 text-sm font-medium">Exit Price</th>
                          <th className="py-2 text-sm font-medium">P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.trades.slice(0, 20).map((trade, index) => (
                          <tr key={trade.id} className="border-b text-sm">
                            <td className="py-2">{new Date(trade.dateIn).toLocaleDateString()}</td>
                            <td className="py-2">{new Date(trade.dateOut).toLocaleDateString()}</td>
                            <td className="py-2">
                              <Badge variant={trade.direction === 'LONG' ? 'default' : 'secondary'}>
                                {trade.direction}
                              </Badge>
                            </td>
                            <td className="py-2 font-mono">₹{trade.entry.toFixed(2)}</td>
                            <td className="py-2 font-mono">₹{trade.exit.toFixed(2)}</td>
                            <td className={`py-2 font-mono ${trade.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                              {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {results.trades.length > 20 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Showing first 20 of {results.trades.length} trades. Export CSV for complete data.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!results && !backtestMutation.isPending && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                <p className="text-muted-foreground text-center">
                  Configure your backtest parameters and click "Run Backtest" to see results.
                  The enhanced engine uses async signal generation with multi-indicator analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};