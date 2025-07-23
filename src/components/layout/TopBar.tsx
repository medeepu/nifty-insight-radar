import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Settings, Wifi, WifiOff, Menu } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTradingStore } from '../../store/useTradingStore';

interface TopBarProps {
  isConnected: boolean;
  onReconnect: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isConnected, onReconnect }) => {
  const { setSettingsOpen } = useSettingsStore();
  const { selectedSymbol, selectedTimeframe, currentSignal, setSelectedTimeframe, setSelectedSymbol } = useTradingStore();

  const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <div className="h-14 bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NIFTY">NIFTY 50</SelectItem>
              <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
              <SelectItem value="FINNIFTY">FINNIFTY</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf}>{tf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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