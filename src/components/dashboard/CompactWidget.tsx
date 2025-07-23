/**
 * Compact Widget Component - Similar to Market Overview but for side panel
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CompactWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const CompactWidget: React.FC<CompactWidgetProps> = ({ 
  title, 
  children, 
  className 
}) => {
  return (
    <Card className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <div className="space-y-2 text-sm">
        {children}
      </div>
    </Card>
  );
};

// Specific compact widgets
export const CompactMarketInfo: React.FC = () => (
  <CompactWidget title="Market Info">
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <span className="text-muted-foreground">Trend:</span>
        <Badge className="ml-1 bg-bull-green/10 text-bull-green">Bullish</Badge>
      </div>
      <div>
        <span className="text-muted-foreground">CPR:</span>
        <span className="ml-1 text-foreground">Normal</span>
      </div>
      <div>
        <span className="text-muted-foreground">ORB:</span>
        <span className="ml-1 text-foreground">Active</span>
      </div>
      <div>
        <span className="text-muted-foreground">NR7:</span>
        <span className="ml-1 text-foreground">No</span>
      </div>
    </div>
  </CompactWidget>
);

export const CompactOptionParams: React.FC = () => (
  <CompactWidget title="Option Params">
    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Strike:</span>
        <span className="text-foreground">22550 CE</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Expiry:</span>
        <span className="text-foreground">28 Nov 2024</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">LTP:</span>
        <span className="text-foreground">₹125.50</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Type:</span>
        <Badge variant="outline" className="text-xs">Call</Badge>
      </div>
    </div>
  </CompactWidget>
);

export const CompactGreeks: React.FC = () => (
  <CompactWidget title="Greeks">
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delta:</span>
        <span className="text-foreground">0.45</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Gamma:</span>
        <span className="text-foreground">0.012</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Theta:</span>
        <span className="text-bear-red">-0.15</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Vega:</span>
        <span className="text-foreground">0.23</span>
      </div>
      <div className="flex justify-between col-span-2">
        <span className="text-muted-foreground">IV:</span>
        <span className="text-foreground">18.5% (Rank: 65)</span>
      </div>
    </div>
  </CompactWidget>
);

export const CompactPriceAnalysis: React.FC = () => (
  <CompactWidget title="Price Analysis">
    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Intrinsic:</span>
        <span className="text-foreground">₹85.20</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Time Value:</span>
        <span className="text-foreground">₹40.30</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Moneyness:</span>
        <Badge variant="outline" className="text-xs">ITM</Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Premium:</span>
        <span className="text-bull-green">+12.5%</span>
      </div>
    </div>
  </CompactWidget>
);