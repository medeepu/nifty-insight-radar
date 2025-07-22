/**
 * ML Insights Page
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MLInsights: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <Brain className="w-6 h-6 mr-2 text-primary" />
          ML Insights
        </h1>
        <p className="text-muted-foreground">
          AI-powered market analysis and trading insights
        </p>
      </div>

      {/* ML Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">ML Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Enable machine learning insights for enhanced trading signals
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>

      {/* Current Market Regime */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Market Regime Analysis</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Current Regime</div>
              <div className="text-xl font-bold text-foreground">Trending Bullish</div>
            </div>
            <Badge className="bg-bull-green/10 text-bull-green border-bull-green/20">
              High Confidence
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence Score</span>
              <span>87%</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 bg-bull-green/5 border-bull-green/20">
              <div className="text-sm font-medium text-bull-green">Bullish Signals</div>
              <div className="text-2xl font-bold text-bull-green">74%</div>
            </Card>
            <Card className="p-4 bg-bear-red/5 border-bear-red/20">
              <div className="text-sm font-medium text-bear-red">Bearish Signals</div>
              <div className="text-2xl font-bold text-bear-red">18%</div>
            </Card>
            <Card className="p-4 bg-neutral-yellow/5 border-neutral-yellow/20">
              <div className="text-sm font-medium text-neutral-yellow">Neutral</div>
              <div className="text-2xl font-bold text-neutral-yellow">8%</div>
            </Card>
          </div>
        </div>
      </Card>

      {/* ML Insights */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-bull-green mt-0.5" />
            <div>
              <div className="font-medium">Strong Momentum Detected</div>
              <div className="text-sm text-muted-foreground">
                Volume-weighted momentum indicators suggest continued upward movement
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-neutral-yellow mt-0.5" />
            <div>
              <div className="font-medium">Volatility Alert</div>
              <div className="text-sm text-muted-foreground">
                Expected volatility increase in the next 2-4 hours based on options flow
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Pattern Recognition</div>
              <div className="text-sm text-muted-foreground">
                Current price action matches historical patterns with 76% accuracy
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Model Performance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Model Performance</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-xl font-bold text-foreground">82.3%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-xl font-bold text-bull-green">68.5%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Precision</div>
            <div className="text-xl font-bold text-foreground">79.1%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Recall</div>
            <div className="text-xl font-bold text-foreground">71.8%</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MLInsights;