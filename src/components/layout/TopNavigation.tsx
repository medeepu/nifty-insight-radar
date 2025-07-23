/**
 * Top Header with Logo and Connection Status
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

interface TopNavigationProps {
  isConnected: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ isConnected }) => {
  const { setSettingsOpen } = useSettingsStore();

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
      </div>
    </div>
  );
};