/**
 * Modern Trading Dashboard - Compact TradingView Style
 */

import React from 'react';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { ModernTradingChart } from '@/components/chart/ModernTradingChart';
import { MarketInfoCard } from '@/components/dashboard/MarketInfoCard';
import { OptionParamsCard } from '@/components/dashboard/OptionParamsCard';
import { GreeksCard } from '@/components/dashboard/GreeksCard';
import { PriceAnalysisCard } from '@/components/dashboard/PriceAnalysisCard';
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
        <div className="space-y-4">
          {/* Market Info */}
          {settings.dashboard.blocks.marketInfo && (
            <MarketInfoCard />
          )}
          
          {/* Option Parameters */}
          {settings.dashboard.blocks.optionParams && (
            <OptionParamsCard />
          )}
          
          {/* Greeks */}
          {settings.dashboard.blocks.greeks && (
            <GreeksCard />
          )}
          
          {/* Price Analysis */}
          {settings.dashboard.blocks.priceAnalysis && (
            <PriceAnalysisCard />
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