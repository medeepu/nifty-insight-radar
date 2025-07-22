/**
 * Modern Sidebar Navigation - TradingView Style
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  Calculator, 
  Activity, 
  Brain, 
  User,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed?: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Market Analysis', href: '/analysis', icon: TrendingUp },
  { name: 'Options Calculator', href: '/calculator', icon: Calculator },
  { name: 'Trading Signals', href: '/signals', icon: Activity },
  { name: 'ML Insights', href: '/ml', icon: Brain },
  { name: 'Backtesting', href: '/backtest', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground">Trading Tools</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
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
            <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
            {!collapsed && item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};