/**
 * Top Header with Logo and Connection Status
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { useTradingStore } from '../../store/useTradingStore';
import { useNavigate } from 'react-router-dom';
import { ProfileMenu } from './ProfileMenu';

interface TopNavigationProps {
  isConnected: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ isConnected }) => {
  const navigate = useNavigate();
  const { selectedSymbol, setSelectedSymbol } = useTradingStore();
  const symbols = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'SENSEX'];

  return (
    <div className="bg-card border-b border-border">
      <div className="px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">DeepLab Trading</h1>
          </div>

          {/* Connection Status and Settings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-bull-green" />
              ) : (
                <WifiOff className="h-4 w-4 text-bear-red" />
              )}
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <ProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
};