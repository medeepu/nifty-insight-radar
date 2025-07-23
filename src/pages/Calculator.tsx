import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalcIcon, TrendingUp, Target, Shield } from 'lucide-react';

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

        <TabsContent value="strategy">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Strategy analysis tools coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payoff">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Payoff diagram calculator coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculator;