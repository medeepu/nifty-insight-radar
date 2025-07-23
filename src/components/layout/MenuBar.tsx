import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  Activity, 
  Brain, 
  User,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { useTradingStore } from '../../store/useTradingStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Analysis', href: '/analysis', icon: TrendingUp },
  { name: 'Calculator', href: '/calculator', icon: Calculator },
  { name: 'Signals', href: '/signals', icon: Activity },
  { name: 'ML Insights', href: '/ml', icon: Brain },
  { name: 'Backtesting', href: '/backtest', icon: BarChart3 },
  { name: 'Logs', href: '/logs', icon: Activity },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const MenuBar: React.FC = () => {
  const { selectedTimeframe, setSelectedTimeframe } = useTradingStore();
  const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <nav className="bg-card border-b border-border">
      <div className="px-6">
        <div className="flex items-center justify-between h-12">
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
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
        </div>
      </div>
    </nav>
  );
};