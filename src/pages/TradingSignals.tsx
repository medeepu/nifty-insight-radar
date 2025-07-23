/**
 * Trading Signals Page
 * 
 * Purpose:
 * - Displays current active trading signal with entry, stop loss, take profit levels
 * - Shows historical signal performance and statistics
 * - Provides signal confidence levels and market context
 * - Allows users to act on signals with manual or automated execution
 * 
 * Features:
 * - Real-time signal updates
 * - Signal history with performance metrics
 * - Risk-reward visualization
 * - Market context and reasoning
 * - Integration with broker APIs for execution
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { TrendingUp, TrendingDown, AlertCircle, Clock, Target, Shield } from 'lucide-react';

export const TradingSignals: React.FC = () => {
  // Mock current signal data
  const currentSignal = {
    signal: 'BUY',
    symbol: 'NIFTY24DEC21000CE',
    entry: 125.50,
    stopLoss: 95.00,
    takeProfit: 185.75,
    riskReward: 2.0,
    confidence: 78,
    timestamp: new Date(),
    scenario: 'Bullish breakout above resistance',
    proTip: 'Strong volume support at current levels with RSI showing positive divergence',
    expiry: '24-DEC-2024',
  };

  const signalHistory = [
    { id: 1, signal: 'BUY', symbol: 'NIFTY', entry: 22450, exit: 22580, pnl: 130, status: 'Completed', date: '2024-01-15' },
    { id: 2, signal: 'SELL', symbol: 'BANKNIFTY', entry: 47200, exit: 46850, pnl: 350, status: 'Completed', date: '2024-01-14' },
    { id: 3, signal: 'BUY', symbol: 'FINNIFTY', entry: 19650, exit: 19450, pnl: -200, status: 'Stopped', date: '2024-01-13' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Trading Signals
        </h1>
        <Badge variant="outline" className="text-xs">
          Real-time Updates
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Active Signal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Active Signal</span>
                <Badge variant={currentSignal.signal === 'BUY' ? 'default' : 'destructive'}>
                  {currentSignal.signal}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Symbol</div>
                  <div className="font-mono font-medium">{currentSignal.symbol}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Expiry</div>
                  <div className="font-mono font-medium">{currentSignal.expiry}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Entry</div>
                  <div className="font-mono font-bold text-lg">₹{currentSignal.entry}</div>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Stop Loss</div>
                  <div className="font-mono font-bold text-lg text-destructive">₹{currentSignal.stopLoss}</div>
                </div>
                <div className="text-center p-4 bg-bull/10 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Take Profit</div>
                  <div className="font-mono font-bold text-lg text-bull">₹{currentSignal.takeProfit}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Risk-Reward Ratio</span>
                  <Badge variant="outline">{currentSignal.riskReward}:1</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence Level</span>
                    <span className="font-medium">{currentSignal.confidence}%</span>
                  </div>
                  <Progress value={currentSignal.confidence} className="h-2" />
                </div>
              </div>

              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium mb-2">Market Scenario</div>
                <div className="text-sm text-muted-foreground">{currentSignal.scenario}</div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Pro Tip
                </div>
                <div className="text-sm">{currentSignal.proTip}</div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" disabled>
                  Execute Trade
                  <span className="ml-2 text-xs">(Requires Broker Integration)</span>
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Set Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signal Statistics */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Today's Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Signals Generated</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Successful</span>
                <span className="font-medium text-bull">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Failed</span>
                <span className="font-medium text-bear">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="font-medium">75%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Signal Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-xs">{currentSignal.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Update</span>
                <span className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  2 min
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Signal History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Signal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Signal</th>
                  <th className="text-left p-2">Symbol</th>
                  <th className="text-left p-2">Entry</th>
                  <th className="text-left p-2">Exit</th>
                  <th className="text-left p-2">P&L</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {signalHistory.map((trade) => (
                  <tr key={trade.id} className="border-b">
                    <td className="p-2 text-sm">{trade.date}</td>
                    <td className="p-2">
                      <Badge variant={trade.signal === 'BUY' ? 'default' : 'destructive'} className="text-xs">
                        {trade.signal}
                      </Badge>
                    </td>
                    <td className="p-2 font-mono text-sm">{trade.symbol}</td>
                    <td className="p-2 font-mono text-sm">₹{trade.entry}</td>
                    <td className="p-2 font-mono text-sm">₹{trade.exit}</td>
                    <td className="p-2 font-mono text-sm">
                      <span className={trade.pnl > 0 ? 'text-bull' : 'text-bear'}>
                        {trade.pnl > 0 ? '+' : ''}₹{trade.pnl}
                      </span>
                    </td>
                    <td className="p-2">
                      <Badge variant={trade.status === 'Completed' ? 'default' : 'secondary'} className="text-xs">
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingSignals;