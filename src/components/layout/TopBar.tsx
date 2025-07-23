import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTradingStore } from '../../store/useTradingStore';
import { ProfileMenu } from './ProfileMenu';

interface TopBarProps {
  isConnected: boolean;
  onReconnect: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isConnected, onReconnect }) => {
  const { setSettingsOpen } = useSettingsStore();
  const { currentSignal } = useTradingStore();

  return (
    <div className="h-14 bg-card/80 backdrop-blur-sm border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Nifty Options Trading
        </h1>
        
        {currentSignal && (
          <Badge variant={currentSignal.signal === 'BUY' ? 'default' : currentSignal.signal === 'SELL' ? 'destructive' : 'secondary'}>
            {currentSignal.signal} Signal
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4">
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
          className="hover:bg-primary/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <ProfileMenu />
      </div>
    </div>
  );
};