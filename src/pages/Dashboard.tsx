/**
 * Modern Trading Dashboard - Compact TradingView Style
 */

import React from 'react';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { ModernTradingChart } from '@/components/chart/ModernTradingChart';
import { 
  CompactMarketInfo, 
  CompactOptionParams, 
  CompactGreeks, 
  CompactPriceAnalysis 
} from '@/components/dashboard/CompactWidget';
import { ProTipCard } from '@/components/dashboard/ProTipCard';
import { RiskWidget } from '@/components/dashboard/RiskWidget';
import { useTradingStore } from '@/store/useTradingStore';
import { useSettingsStore } from '@/store/useSettingsStore';

const Dashboard: React.FC = () => {
  const { selectedSymbol, selectedTimeframe } = useTradingStore();
  const { settings } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <MarketOverview />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Chart Section - Takes up 3 columns */}
        <div className="xl:col-span-3">
          <ModernTradingChart
            symbol={selectedSymbol}
            timeframe={selectedTimeframe}
            height={600}
          />
        </div>
        
        {/* Side Panel Cards - Takes up 1 column */}
        <div className="space-y-3">
          {/* Market Info */}
          {settings.dashboard.blocks.marketInfo && (
            <CompactMarketInfo />
          )}
          
          {/* Option Parameters */}
          {settings.dashboard.blocks.optionParams && (
            <CompactOptionParams />
          )}
          
          {/* Greeks */}
          {settings.dashboard.blocks.greeks && (
            <CompactGreeks />
          )}
          
          {/* Price Analysis */}
          {settings.dashboard.blocks.priceAnalysis && (
            <CompactPriceAnalysis />
          )}
          
          {/* Pro Tip */}
          {settings.dashboard.blocks.proTip && (
            <ProTipCard />
          )}
          
          {/* Risk Management Widget */}
          <RiskWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;