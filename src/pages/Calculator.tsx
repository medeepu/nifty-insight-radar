import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalcIcon, TrendingUp, Target, Shield, PieChart } from 'lucide-react';

interface OptionCalculation {
  theoreticalPrice: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  iv: number;
  intrinsicValue: number;
  timeValue: number;
  breakEven: number;
  maxProfit: number;
  maxLoss: number;
}

const Calculator: React.FC = () => {
  const [spotPrice, setSpotPrice] = useState<number>(22547.95);
  const [strikePrice, setStrikePrice] = useState<number>(22500);
  const [optionPrice, setOptionPrice] = useState<number>(125.50);
  const [daysToExpiry, setDaysToExpiry] = useState<number>(7);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(6.5);
  const [volatility, setVoiatility] = useState<number>(18.5);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [quantity, setQuantity] = useState<number>(50);
  
  const [results, setResults] = useState<OptionCalculation | null>(null);

  // Mock calculation function - in real app, this would call backend API
  const calculateOption = () => {
    // Mock calculation for demo purposes
    const timeToExpiry = daysToExpiry / 365;
    const intrinsic = optionType === 'call' 
      ? Math.max(0, spotPrice - strikePrice)
      : Math.max(0, strikePrice - spotPrice);
    
    const mockResults: OptionCalculation = {
      theoreticalPrice: optionPrice * 0.98 + Math.random() * 5,
      delta: optionType === 'call' ? 0.65 : -0.35,
      gamma: 0.008,
      theta: -2.45,
      vega: 8.92,
      rho: optionType === 'call' ? 4.32 : -3.87,
      iv: volatility / 100,
      intrinsicValue: intrinsic,
      timeValue: optionPrice - intrinsic,
      breakEven: optionType === 'call' ? strikePrice + optionPrice : strikePrice - optionPrice,
      maxProfit: optionType === 'call' ? Infinity : strikePrice - optionPrice,
      maxLoss: optionPrice,
    };
    
    setResults(mockResults);
  };

  useEffect(() => {
    calculateOption();
  }, [spotPrice, strikePrice, optionPrice, daysToExpiry, riskFreeRate, volatility, optionType]);

  const getMoneyness = () => {
    if (optionType === 'call') {
      if (spotPrice > strikePrice) return { status: 'ITM', color: 'text-bull-green' };
      if (spotPrice < strikePrice) return { status: 'OTM', color: 'text-bear-red' };
      return { status: 'ATM', color: 'text-neutral-yellow' };
    } else {
      if (spotPrice < strikePrice) return { status: 'ITM', color: 'text-bull-green' };
      if (spotPrice > strikePrice) return { status: 'OTM', color: 'text-bear-red' };
      return { status: 'ATM', color: 'text-neutral-yellow' };
    }
  };

  const moneyness = getMoneyness();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalcIcon className="w-6 h-6" />
          Options Calculator
        </h1>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pricing">Option Pricing</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Analysis</TabsTrigger>
          <TabsTrigger value="payoff">Payoff Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Option Type</Label>
                    <Select value={optionType} onValueChange={(value: 'call' | 'put') => setOptionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call Option</SelectItem>
                        <SelectItem value="put">Put Option</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value))} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Spot Price</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={spotPrice} 
                    onChange={(e) => setSpotPrice(parseFloat(e.target.value))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Strike Price</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={strikePrice} 
                    onChange={(e) => setStrikePrice(parseFloat(e.target.value))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Option Price</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={optionPrice} 
                    onChange={(e) => setOptionPrice(parseFloat(e.target.value))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Days to Expiry</Label>
                  <Input 
                    type="number" 
                    value={daysToExpiry} 
                    onChange={(e) => setDaysToExpiry(parseInt(e.target.value))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Implied Volatility (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={volatility} 
                    onChange={(e) => setVoiatility(parseFloat(e.target.value))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Risk-Free Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={riskFreeRate} 
                    onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))} 
                  />
                </div>

                <Button onClick={calculateOption} className="w-full">
                  Recalculate
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              {/* Option Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Option Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Moneyness</span>
                      <Badge className={moneyness.color}>{moneyness.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Intrinsic Value</span>
                      <span className="font-mono">₹{results?.intrinsicValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Time Value</span>
                      <span className="font-mono">₹{results?.timeValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Break Even</span>
                      <span className="font-mono">₹{results?.breakEven.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Greeks */}
              <Card>
                <CardHeader>
                  <CardTitle>Greeks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Delta</span>
                      <span className="font-mono">{results?.delta.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Gamma</span>
                      <span className="font-mono">{results?.gamma.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Theta</span>
                      <span className="font-mono text-bear-red">{results?.theta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vega</span>
                      <span className="font-mono">{results?.vega.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rho</span>
                      <span className="font-mono">{results?.rho.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Max Profit
                      </span>
                      <span className="font-mono text-bull-green">
                        {results?.maxProfit === Infinity ? 'Unlimited' : `₹${(results?.maxProfit || 0).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Max Loss
                      </span>
                      <span className="font-mono text-bear-red">₹{(results?.maxLoss || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Premium</span>
                      <span className="font-mono">₹{(optionPrice * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Daily Theta Decay</span>
                      <span className="font-mono text-bear-red">₹{((results?.theta || 0) * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Popular Strategies</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Long Call', description: 'Bullish strategy with unlimited upside' },
                      { name: 'Long Put', description: 'Bearish strategy with high profit potential' },
                      { name: 'Covered Call', description: 'Generate income from existing positions' },
                      { name: 'Cash Secured Put', description: 'Acquire stock at lower price' },
                      { name: 'Bull Call Spread', description: 'Limited risk bullish strategy' },
                      { name: 'Bear Put Spread', description: 'Limited risk bearish strategy' },
                      { name: 'Iron Condor', description: 'Profit from low volatility' },
                      { name: 'Straddle', description: 'Profit from high volatility' },
                    ].map((strategy, index) => (
                      <Card key={index} className="p-3 cursor-pointer hover:bg-muted/50">
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{strategy.name}</div>
                          <div className="text-xs text-muted-foreground">{strategy.description}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Strategy Analysis</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Selected Strategy</span>
                        <Badge>Long Call</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Max Profit</span>
                        <span className="font-mono text-bull-green">Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Max Loss</span>
                        <span className="font-mono text-bear-red">₹6,275</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Break Even</span>
                        <span className="font-mono">₹22,625</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Probability of Profit</span>
                        <span className="font-mono">42%</span>
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Risk Profile</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="text-xs text-muted-foreground">Risk Level</div>
                        <div className="font-medium text-neutral-yellow">Medium</div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="text-xs text-muted-foreground">Time Decay</div>
                        <div className="font-medium text-bear-red">Negative</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payoff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payoff Diagram</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Position Details</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Long Call Option</span>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Strike: ₹22,500</div>
                        <div>Premium: ₹125</div>
                        <div>Quantity: 50</div>
                        <div>Total Cost: ₹6,250</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Add Another Leg</Button>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Levels</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Break Even Point</span>
                        <span className="font-mono">₹22,625</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Profit Point</span>
                        <span className="font-mono text-bull-green">Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Loss Point</span>
                        <span className="font-mono text-bear-red">₹6,250</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Payoff Chart</h3>
                  <div className="h-64 bg-muted rounded flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <PieChart className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Interactive payoff diagram</p>
                      <p className="text-xs text-muted-foreground">Visual P&L across price levels</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">P&L at Expiry</h4>
                    <div className="space-y-1">
                      {[
                        { price: 22000, pnl: -6250, color: 'text-bear-red' },
                        { price: 22300, pnl: -6250, color: 'text-bear-red' },
                        { price: 22500, pnl: -6250, color: 'text-bear-red' },
                        { price: 22625, pnl: 0, color: 'text-muted-foreground' },
                        { price: 22800, pnl: 8750, color: 'text-bull-green' },
                        { price: 23000, pnl: 18750, color: 'text-bull-green' },
                      ].map((scenario, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>At ₹{scenario.price.toLocaleString()}</span>
                          <span className={`font-mono ${scenario.color}`}>
                            {scenario.pnl > 0 ? '+' : ''}₹{scenario.pnl.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-bull-green">Best Case</h4>
                    <div className="text-sm space-y-1">
                      <div>Price moves to ₹23,500</div>
                      <div>Profit: <span className="font-mono text-bull-green">₹43,750</span></div>
                      <div>Return: <span className="font-mono text-bull-green">+700%</span></div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-neutral-yellow">Expected</h4>
                    <div className="text-sm space-y-1">
                      <div>Price stays near ₹22,550</div>
                      <div>Profit: <span className="font-mono text-neutral-yellow">₹2,500</span></div>
                      <div>Return: <span className="font-mono text-neutral-yellow">+40%</span></div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-bear-red">Worst Case</h4>
                    <div className="text-sm space-y-1">
                      <div>Price below ₹22,500</div>
                      <div>Loss: <span className="font-mono text-bear-red">₹6,250</span></div>
                      <div>Return: <span className="font-mono text-bear-red">-100%</span></div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculator;