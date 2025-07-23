import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useSettingsStore } from '../../store/useSettingsStore';
import { SettingsPanels } from './SettingsPanels';

export const SettingsDrawer: React.FC = () => {
  const { settingsOpen, setSettingsOpen } = useSettingsStore();

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetContent side="right" className="w-[600px] max-w-[90vw] settings-panel overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Trading Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SettingsPanels />
        </div>
      </SheetContent>
    </Sheet>
  );
};