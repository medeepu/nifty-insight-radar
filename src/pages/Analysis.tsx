import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, AlertTriangle } from 'lucide-react';

interface MarketData {
  symbol: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  support: number[];
  resistance: number[];
  momentum: number;
  volatility: number;
}

const mockMarketData: MarketData[] = [
  {
    symbol: 'NIFTY',
    trend: 'bullish',
    strength: 78,
    support: [22400, 22250, 22100],
    resistance: [22650, 22800, 23000],
    momentum: 65,
    volatility: 18.5,
  },
  {
    symbol: 'BANKNIFTY',
    trend: 'bearish',
    strength: 62,
    support: [48500, 48200, 47800],
    resistance: [49200, 49500, 49800],
    momentum: -45,
    volatility: 22.3,
  },
  {
    symbol: 'FINNIFTY',
    trend: 'neutral',
    strength: 45,
    support: [23600, 23400, 23200],
    resistance: [24000, 24200, 24400],
    momentum: 12,
    volatility: 16.8,
  },
];

const Analysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const currentData = mockMarketData.find(d => d.symbol === selectedSymbol) || mockMarketData[0];

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <Badge className="bg-bull-green/10 text-bull-green border-bull-green/20">Bullish</Badge>;
      case 'bearish':
        return <Badge className="bg-bear-red/10 text-bear-red border-bear-red/20">Bearish</Badge>;
      default:
        return <Badge className="bg-neutral-yellow/10 text-neutral-yellow border-neutral-yellow/20">Neutral</Badge>;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'text-bull-green';
    if (strength >= 40) return 'text-neutral-yellow';
    return 'text-bear-red';
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum > 20) return 'text-bull-green';
    if (momentum > -20) return 'text-neutral-yellow';
    return 'text-bear-red';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Market Analysis
        </h1>
        <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NIFTY">NIFTY 50</SelectItem>
            <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
            <SelectItem value="FINNIFTY">FINNIFTY</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
          <TabsTrigger value="volatility">Volatility Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Market Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Trend Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getTrendBadge(currentData.trend)}
                  {currentData.trend === 'bullish' ? (
                    <TrendingUp className="w-6 h-6 text-bull-green" />
                  ) : currentData.trend === 'bearish' ? (
                    <TrendingDown className="w-6 h-6 text-bear-red" />
                  ) : (
                    <Activity className="w-6 h-6 text-neutral-yellow" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Trend Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={getStrengthColor(currentData.strength)}>{currentData.strength}%</span>
                  </div>
                  <Progress value={currentData.strength} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Momentum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-lg ${getMomentumColor(currentData.momentum)}`}>
                    {currentData.momentum > 0 ? '+' : ''}{currentData.momentum}
                  </span>
                  {currentData.momentum > 0 ? (
                    <TrendingUp className="w-5 h-5 text-bull-green" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-bear-red" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg">{currentData.volatility}%</span>
                  <AlertTriangle className="w-5 h-5 text-neutral-yellow" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support & Resistance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentData.support.map((level, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">S{index + 1}</span>
                      <span className="font-mono text-bull-green">₹{level.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resistance Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentData.resistance.map((level, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">R{index + 1}</span>
                      <span className="font-mono text-bear-red">₹{level.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Health Score */}
          <Card>
            <CardHeader>
              <CardTitle>Market Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Trend Quality</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Volume Confirmation</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Volatility Risk</span>
                    <span className="text-sm font-medium">38%</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Advanced technical analysis charts and indicators coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Market sentiment analysis and put-call ratio data coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volatility">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Volatility surface analysis and VIX tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;