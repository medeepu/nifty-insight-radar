/**
 * Top Navigation Bar - Converted from Sidebar
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
import { Button } from '@/components/ui/button';

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

export const TopNavigation: React.FC = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Nifty Options</h1>
          </div>

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
        </div>
      </div>
    </nav>
  );
};