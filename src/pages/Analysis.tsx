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

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">RSI (14)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Current</span>
                        <span className="font-mono text-lg">62.5</span>
                      </div>
                      <Progress value={62.5} className="h-2" />
                      <p className="text-xs text-muted-foreground">Neutral zone</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">MACD</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>MACD</span>
                        <span className="font-mono text-bull-green">+15.2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Signal</span>
                        <span className="font-mono">12.8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Histogram</span>
                        <span className="font-mono text-bull-green">+2.4</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Stochastic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>%K</span>
                        <span className="font-mono">58.3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>%D</span>
                        <span className="font-mono">54.7</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Bullish crossover</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Bollinger Bands</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Upper</span>
                        <span className="font-mono text-bear-red">22,850</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Middle</span>
                        <span className="font-mono">22,550</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lower</span>
                        <span className="font-mono text-bull-green">22,250</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moving Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Simple Moving Averages</h4>
                  <div className="space-y-2">
                    {[
                      { period: 'SMA 20', value: 22485, signal: 'Above' },
                      { period: 'SMA 50', value: 22320, signal: 'Above' },
                      { period: 'SMA 100', value: 22150, signal: 'Above' },
                      { period: 'SMA 200', value: 21890, signal: 'Above' },
                    ].map((sma, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{sma.period}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">₹{sma.value.toLocaleString()}</span>
                          <Badge className="text-xs bg-bull-green/10 text-bull-green">{sma.signal}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Exponential Moving Averages</h4>
                  <div className="space-y-2">
                    {[
                      { period: 'EMA 9', value: 22515, signal: 'Above' },
                      { period: 'EMA 21', value: 22445, signal: 'Above' },
                      { period: 'EMA 50', value: 22365, signal: 'Above' },
                      { period: 'EMA 200', value: 21950, signal: 'Above' },
                    ].map((ema, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{ema.period}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">₹{ema.value.toLocaleString()}</span>
                          <Badge className="text-xs bg-bull-green/10 text-bull-green">{ema.signal}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Put-Call Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-neutral-yellow">0.85</span>
                    <p className="text-sm text-muted-foreground">Current PCR</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Put Volume</span>
                      <span className="font-mono">2.1M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Call Volume</span>
                      <span className="font-mono">2.5M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sentiment</span>
                      <Badge className="bg-neutral-yellow/10 text-neutral-yellow">Neutral</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-bull-green">65%</span>
                    <p className="text-sm text-muted-foreground">Bullish</p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Bullish</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Bearish</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">VIX Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold">18.5</span>
                    <p className="text-sm text-muted-foreground">Current VIX</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Change</span>
                      <span className="font-mono text-bear-red">-0.8 (-4.1%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>52W High</span>
                      <span className="font-mono">35.2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>52W Low</span>
                      <span className="font-mono">12.8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status</span>
                      <Badge className="bg-neutral-yellow/10 text-neutral-yellow">Normal</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Breadth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Advance/Decline</p>
                  <p className="text-2xl font-bold text-bull-green">1.45</p>
                  <p className="text-xs">28 Adv / 19 Dec</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">New Highs</p>
                  <p className="text-2xl font-bold text-bull-green">12</p>
                  <p className="text-xs">52-week highs</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">New Lows</p>
                  <p className="text-2xl font-bold text-bear-red">3</p>
                  <p className="text-xs">52-week lows</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Volume Ratio</p>
                  <p className="text-2xl font-bold">1.2</p>
                  <p className="text-xs">vs 20-day avg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Top Call Strikes</h4>
                    <div className="space-y-2">
                      {[
                        { strike: '22600', oi: '1.2M', change: '+25%' },
                        { strike: '22700', oi: '985K', change: '+18%' },
                        { strike: '22500', oi: '875K', change: '+12%' },
                      ].map((strike, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-mono">{strike.strike}</span>
                          <span>{strike.oi}</span>
                          <span className="text-bull-green">{strike.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Top Put Strikes</h4>
                    <div className="space-y-2">
                      {[
                        { strike: '22400', oi: '1.1M', change: '+20%' },
                        { strike: '22300', oi: '950K', change: '+15%' },
                        { strike: '22500', oi: '825K', change: '+10%' },
                      ].map((strike, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-mono">{strike.strike}</span>
                          <span>{strike.oi}</span>
                          <span className="text-bull-green">{strike.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volatility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volatility Surface</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Historical Volatility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>1 Day</span>
                          <span className="font-mono">22.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>1 Week</span>
                          <span className="font-mono">19.8%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>1 Month</span>
                          <span className="font-mono">18.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>3 Months</span>
                          <span className="font-mono">16.5%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Implied Volatility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>ATM</span>
                          <span className="font-mono">18.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>OTM Calls</span>
                          <span className="font-mono">19.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>OTM Puts</span>
                          <span className="font-mono">20.1%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Skew</span>
                          <span className="font-mono text-bear-red">+1.6%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">IV Rank</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-center">
                          <span className="text-2xl font-bold">45%</span>
                          <p className="text-xs text-muted-foreground">52-week rank</p>
                        </div>
                        <Progress value={45} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span>Low: 12%</span>
                          <span>High: 38%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Volatility Smile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Strike vs Implied Volatility</div>
                      <div className="grid grid-cols-5 gap-2 text-sm">
                        <div className="text-center font-medium">Strike</div>
                        <div className="text-center font-medium">Call IV</div>
                        <div className="text-center font-medium">Put IV</div>
                        <div className="text-center font-medium">Moneyness</div>
                        <div className="text-center font-medium">Delta</div>
                        
                        {[
                          { strike: '22300', callIV: '21.2%', putIV: '22.1%', moneyness: 'OTM', delta: '0.25' },
                          { strike: '22400', callIV: '19.8%', putIV: '20.5%', moneyness: 'OTM', delta: '0.35' },
                          { strike: '22500', callIV: '18.5%', putIV: '18.9%', moneyness: 'ATM', delta: '0.50' },
                          { strike: '22600', callIV: '19.1%', putIV: '18.2%', moneyness: 'ITM', delta: '0.65' },
                          { strike: '22700', callIV: '20.8%', putIV: '19.8%', moneyness: 'ITM', delta: '0.75' },
                        ].map((row, index) => (
                          <React.Fragment key={index}>
                            <div className="text-center font-mono">{row.strike}</div>
                            <div className="text-center font-mono">{row.callIV}</div>
                            <div className="text-center font-mono">{row.putIV}</div>
                            <div className="text-center">{row.moneyness}</div>
                            <div className="text-center font-mono">{row.delta}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>VIX Term Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Front Month</p>
                    <p className="text-xl font-bold">18.5</p>
                    <p className="text-xs text-bear-red">-0.8 (-4.1%)</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">2nd Month</p>
                    <p className="text-xl font-bold">19.2</p>
                    <p className="text-xs text-bear-red">-0.5 (-2.6%)</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">3rd Month</p>
                    <p className="text-xl font-bold">20.1</p>
                    <p className="text-xs text-bear-red">-0.3 (-1.5%)</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Back Month</p>
                    <p className="text-xl font-bold">21.0</p>
                    <p className="text-xs text-neutral-yellow">0.0 (0.0%)</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contango</span>
                    <Badge className="bg-neutral-yellow/10 text-neutral-yellow">Normal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Term Structure Slope</span>
                    <span className="font-mono text-sm">+2.5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;