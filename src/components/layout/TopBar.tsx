import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTradingStore } from '../../store/useTradingStore';

interface TopBarProps {
  isConnected: boolean;
  onReconnect: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isConnected, onReconnect }) => {
  const { setSettingsOpen } = useSettingsStore();
  const { selectedSymbol, selectedTimeframe, currentSignal } = useTradingStore();

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Nifty Options</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedSymbol}</Badge>
          <Badge variant="secondary">{selectedTimeframe}</Badge>
        </div>
        {currentSignal && (
          <div className={`signal-badge-${currentSignal.signal.toLowerCase()}`}>
            {currentSignal.signal}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-bull" />
          ) : (
            <WifiOff className="h-4 w-4 text-bear" />
          )}
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};