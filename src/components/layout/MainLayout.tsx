/**
 * Main Layout - Top Navigation Style
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { MenuBar } from './MenuBar';
import { SettingsDrawer } from '../settings/SettingsDrawer';

export const MainLayout: React.FC = () => {
  const isConnected = true; // Mock connection status

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation with Logo */}
      <TopNavigation isConnected={isConnected} />
      
      {/* Menu Bar with Pages and Timeframe */}
      <MenuBar />
      
      {/* Page Content */}
      <main className="p-6 overflow-auto">
        <Outlet />
      </main>
      
      {/* Settings Drawer */}
      <SettingsDrawer />
    </div>
  );
};