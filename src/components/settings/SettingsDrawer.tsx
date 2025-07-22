import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useSettingsStore } from '../../store/useSettingsStore';

export const SettingsDrawer: React.FC = () => {
  const { settingsOpen, setSettingsOpen } = useSettingsStore();

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetContent side="left" className="w-80 settings-panel">
        <SheetHeader>
          <SheetTitle>Trading Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            Settings panel will be implemented here with all trading configuration options.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};