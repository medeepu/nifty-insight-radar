/**
 * Main Trading Dashboard Component
 * Central hub for real-time trading interface
 */

import React, { useState, useEffect } from 'react';
import { TradingChart } from './TradingChart';
import { MarketInfoCard } from './dashboard/MarketInfoCard';
import { OptionParamsCard } from './dashboard/OptionParamsCard';
import { GreeksCard } from './dashboard/GreeksCard';
import { PriceAnalysisCard } from './dashboard/PriceAnalysisCard';
import { ProTipCard } from './dashboard/ProTipCard';
import { RiskWidget } from './dashboard/RiskWidget';
import { SettingsDrawer } from './settings/SettingsDrawer';
import { TopBar } from './layout/TopBar';
import { useTradingStore } from '../store/useTradingStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { useCurrentPrice, useCurrentSignal } from '../hooks/useApi';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const TradingDashboard: React.FC = () => {
  const [wsConnected, setWsConnected] = useState(false);
  
  const { 
    selectedSymbol, 
    selectedTimeframe,
    setCurrentPrice,
    setCurrentSignal,
    isConnected,
    setConnected 
  } = useTradingStore();
  
  const { settings, settingsOpen } = useSettingsStore();

  // WebSocket connection for real-time data
  const { isConnected: wsConnection, reconnect } = useWebSocket({
    url: `${WS_URL}/price`,
    onConnect: () => {
      setWsConnected(true);
      setConnected(true);
    },
    onDisconnect: () => {
      setWsConnected(false);
      setConnected(false);
    },
    onMessage: (message) => {
      switch (message.type) {
        case 'price':
          setCurrentPrice(message.data);
          break;
        case 'signal':
          setCurrentSignal(message.data);
          break;
      }
    },
  });

  // Fallback API polling when WebSocket is disconnected
  const { data: priceData } = useCurrentPrice(selectedSymbol);
  const { data: signalData } = useCurrentSignal(selectedSymbol);

  useEffect(() => {
    if (!wsConnected && priceData) {
      setCurrentPrice(priceData);
    }
  }, [priceData, wsConnected, setCurrentPrice]);

  useEffect(() => {
    if (!wsConnected && signalData) {
      setCurrentSignal(signalData);
    }
  }, [signalData, wsConnected, setCurrentSignal]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <TopBar 
        isConnected={isConnected}
        onReconnect={reconnect}
      />
      
      <div className="flex">
        {/* Settings Drawer */}
        <SettingsDrawer />
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chart Section - Takes up 3 columns */}
            <div className="xl:col-span-3">
              <TradingChart />
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
      </div>
    </div>
  );
};