import React from 'react';
import { MarketOverview } from '../components/dashboard/MarketOverview';
import { ModernTradingChart } from '../components/chart/ModernTradingChart';
import { MarketInfoCard } from '../components/dashboard/MarketInfoCard';
import { OptionParamsCard } from '../components/dashboard/OptionParamsCard';
import { GreeksCard } from '../components/dashboard/GreeksCard';
import { PriceAnalysisCard } from '../components/dashboard/PriceAnalysisCard';
import { ProTipCard } from '../components/dashboard/ProTipCard';
import { RiskWidget } from '../components/dashboard/RiskWidget';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Market Overview */}
      <MarketOverview />
      
      {/* Second Row - Additional Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MarketInfoCard />
        <OptionParamsCard />
        <GreeksCard />
        <PriceAnalysisCard />
      </div>
      
      {/* Main Chart - Full Width */}
      <div className="w-full">
        <ModernTradingChart />
      </div>
      
      {/* Bottom Row - Pro Tip and Risk Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProTipCard />
        <RiskWidget />
      </div>
    </div>
  );
};

export default Dashboard;