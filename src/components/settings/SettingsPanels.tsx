/**
 * Complete Settings Panels Implementation
 * Fixed Save Button Layout for UI Consistency
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Badge } from '@/components/ui/badge';
import { IndicatorSettings } from './IndicatorSettings';
import { BrokerIntegrationPanel } from './BrokerIntegrationPanel';

export const SettingsPanels: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  const handleSave = (tabName: string) => {
    // Logic to save the settings to your backend/state management
    console.log(`Saving settings for ${tabName}...`, settings);
  };

  // A reusable save button component for consistency
  const SaveButton = ({ tabName }: { tabName: string }) => (
    <div className="flex justify-end pt-6 mt-6 border-t border-border/20">
      <Button
        onClick={() => handleSave(tabName)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-8"
      >
        Save Changes
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="core" className="w-full">
        {/* Navigation Header */}
        <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            
            {/* Horizontal Navigation */}
            <TabsList className="grid w-full grid-cols-6 bg-muted/50 h-auto p-1">
              {/* TabsTriggers remain the same */}
              <TabsTrigger value="core" className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">Core Trading</TabsTrigger>
              <TabsTrigger value="parameters" className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">Technical</TabsTrigger>
              <TabsTrigger value="greeks" className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">Greeks</TabsTrigger>
              <TabsTrigger value="indicators" className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">Indicators & Display</TabsTrigger>
              <TabsTrigger value="risk" className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">Risk</TabsTrigger>
              <TabsTrigger value="broker" className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">Broker</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-6 py-6 pb-20">

          {/* Core Trading Settings */}
          <TabsContent value="core" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
                <CardTitle className="text-xl font-semibold">Core Trading Parameters</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* ... all your form fields ... */}
                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="strike-selection">Strike Selection Mode</Label>
                      <Select 
                        value={settings.core.strikeSelectionMode} 
                        onValueChange={(value) => updateSettings('core.strikeSelectionMode', value)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="closest_atm">Closest ATM</SelectItem>
                          <SelectItem value="itm_100">ITM +100</SelectItem>
                          <SelectItem value="otm_100">OTM -100</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="ticker">Ticker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="trade-direction">Trade Direction</Label>
                      <Select 
                        value={settings.core.tradeDirection} 
                        onValueChange={(value) => updateSettings('core.tradeDirection', value)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="buy">Buy Only</SelectItem>
                          <SelectItem value="sell">Sell Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="risk-reward">Risk-Reward Ratio</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[settings.core.riskRewardRatio]}
                        onValueChange={([value]) => updateSettings('core.riskRewardRatio', value)}
                        min={1} max={5} step={0.1} className="flex-1"
                      />
                      <Badge variant="outline">{settings.core.riskRewardRatio}:1</Badge>
                    </div>
                  </div>
                </div>
                <SaveButton tabName="core" />
              </CardContent>
            </Card>

            {/* Conditional Manual/Ticker Settings */}
            {(settings.core.strikeSelectionMode === 'manual' || settings.core.strikeSelectionMode === 'ticker') && (
              <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
                <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
                   <CardTitle className="text-xl font-semibold">
                     {settings.core.strikeSelectionMode === 'manual' ? 'Manual Option Configuration' : 'Ticker Configuration'}
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   {/* ... content for manual/ticker settings ... */}
                   <SaveButton tabName="core-manual" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Technical Parameters */}
          <TabsContent value="parameters" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
                <CardTitle className="text-xl font-semibold">User-Configurable Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* ... all your form fields ... */}
                <SaveButton tabName="parameters" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Greeks Settings */}
          <TabsContent value="greeks" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
                <CardTitle className="text-xl font-semibold">Greeks Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* ... all your form fields ... */}
                </div>
                <SaveButton tabName="greeks" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Indicators Settings */}
          <TabsContent value="indicators" className="space-y-6">
            {/* You will need to add the <SaveButton/> inside your IndicatorSettings component */}
            <IndicatorSettings />
          </TabsContent>

          {/* Risk Management */}
          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget & Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* ... all your form fields ... */}
                </div>
                <SaveButton tabName="risk" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Broker Integration */}
          <TabsContent value="broker" className="space-y-6">
            <BrokerIntegrationPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
