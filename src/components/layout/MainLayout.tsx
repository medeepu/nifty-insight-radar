/**
 * Main Layout - Top Navigation Style
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { TopBar } from './TopBar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Trading Controls Bar */}
      <div className="border-b border-border bg-card">
        <TopBar 
          isConnected={true}
          onReconnect={() => {}}
        />
      </div>
      
      {/* Page Content */}
      <main className="p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};