/**
 * Complete Settings Panels Implementation
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
  const [activeTab, setActiveTab] = React.useState("core");

  // Tabs that need save buttons (form inputs) - broker excluded as it has its own save button
  const tabsWithSave = ["core", "parameters", "greeks", "risk"];
  const showSaveButton = tabsWithSave.includes(activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="core" className="w-full" onValueChange={setActiveTab}>
        {/* Navigation Header */}
        <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            
            {/* Horizontal Navigation */}
            <TabsList className="grid w-full grid-cols-6 bg-muted/50 h-auto p-1">
              <TabsTrigger 
                value="core" 
                className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Core Trading
              </TabsTrigger>
              <TabsTrigger 
                value="parameters" 
                className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Technical
              </TabsTrigger>
              <TabsTrigger 
                value="greeks" 
                className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Greeks
              </TabsTrigger>
              <TabsTrigger 
                value="indicators" 
                className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Indicators & Display
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Risk
              </TabsTrigger>
              <TabsTrigger 
                value="broker" 
                className="text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Broker
              </TabsTrigger>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strike-selection">Strike Selection Mode</Label>
                <Select 
                  value={settings.core.strikeSelectionMode} 
                  onValueChange={(value) => updateSettings('core.strikeSelectionMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  min={1}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <Badge variant="outline">{settings.core.riskRewardRatio}:1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditional Manual Settings */}
        {(settings.core.strikeSelectionMode === 'manual' || settings.core.strikeSelectionMode === 'ticker') && (
          <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
              <CardTitle className="text-xl font-semibold">
                {settings.core.strikeSelectionMode === 'manual' ? 'Manual Option Configuration' : 'Ticker Configuration'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.core.strikeSelectionMode === 'manual' ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="option-type">Option Type</Label>
                      <Select 
                        value={settings.manual.optionType} 
                        onValueChange={(value) => updateSettings('manual.optionType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="put">Put</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="strike">Strike Price</Label>
                      <Input
                        type="number"
                        value={settings.manual.strike}
                        onChange={(e) => updateSettings('manual.strike', parseFloat(e.target.value))}
                        placeholder="Strike"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="option-ltp">Option LTP</Label>
                      <Input
                        type="number"
                        value={settings.manual.optionLTP}
                        onChange={(e) => updateSettings('manual.optionLTP', parseFloat(e.target.value))}
                        placeholder="LTP"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input
                      type="date"
                      value={`${settings.manual.expiry.year}-${String(settings.manual.expiry.month).padStart(2, '0')}-${String(settings.manual.expiry.day).padStart(2, '0')}`}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        updateSettings('manual.expiry', {
                          day: date.getDate(),
                          month: date.getMonth() + 1,
                          year: date.getFullYear()
                        });
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticker-symbol">Option Ticker Symbol</Label>
                    <Input
                      type="text"
                      value={settings.core.tickerSymbol || ''}
                      onChange={(e) => updateSettings('core.tickerSymbol', e.target.value)}
                      placeholder="NIFTY25JAN24000CE (TradingView) or NIFTY2502524000CE (NSE)"
                    />
                    <p className="text-xs text-muted-foreground">
                      TradingView format: NIFTYYYMMDDC24000 | NSE format: NIFTY25JAN24000CE
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ticker-format">Ticker Format</Label>
                    <Select 
                      value={settings.core.tickerFormat || 'tradingview'} 
                      onValueChange={(value) => updateSettings('core.tickerFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tradingview">TradingView Format</SelectItem>
                        <SelectItem value="nse">NSE Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
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
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="atr-period" className="text-sm font-medium">ATR Period</Label>
                <Input
                  type="number"
                  value={settings.technical.atrPeriod}
                  onChange={(e) => updateSettings('technical.atrPeriod', parseInt(e.target.value))}
                  placeholder="14"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Average True Range calculation period</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="orb-window" className="text-sm font-medium">ORB Window (minutes)</Label>
                <Input
                  type="number"
                  value={settings.technical.orbSettings.openingRangeMinutes}
                  onChange={(e) => updateSettings('technical.orbSettings.openingRangeMinutes', parseInt(e.target.value))}
                  placeholder="15"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Opening Range Breakout time window</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume-threshold" className="text-sm font-medium">Volume Threshold</Label>
                <Input
                  type="number"
                  value={settings.technical.volumeThreshold}
                  onChange={(e) => updateSettings('technical.volumeThreshold', parseInt(e.target.value))}
                  placeholder="100000"
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consolidation-percent" className="text-sm font-medium">Consolidation %</Label>
                <Input
                  type="number"
                  value={settings.technical.consolidationPercent}
                  onChange={(e) => updateSettings('technical.consolidationPercent', parseFloat(e.target.value))}
                  placeholder="1.0"
                  step="0.1"
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nr7-lookback" className="text-sm font-medium">NR7 Lookback</Label>
                <Input
                  type="number"
                  value={settings.technical.nr7Lookback}
                  onChange={(e) => updateSettings('technical.nr7Lookback', parseInt(e.target.value))}
                  placeholder="7"
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Greeks Settings */}
      <TabsContent value="greeks" className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Greeks Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.greeks.riskFreeRate}
                  onChange={(e) => updateSettings('greeks.riskFreeRate', parseFloat(e.target.value))}
                  placeholder="5.0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dividend-yield">Dividend Yield (%)</Label>
                <Input
                  type="number"
                  value={settings.greeks.dividendYield}
                  onChange={(e) => updateSettings('greeks.dividendYield', parseFloat(e.target.value))}
                  placeholder="1.5"
                  step="0.1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">IV Calculation</h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iv-iterations">Max Iterations</Label>
                  <Input
                    type="number"
                    value={settings.greeks.ivCalculation.iterations}
                    onChange={(e) => updateSettings('greeks.ivCalculation.iterations', parseInt(e.target.value))}
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iv-tolerance">Tolerance</Label>
                  <Input
                    type="number"
                    value={settings.greeks.ivCalculation.tolerance}
                    onChange={(e) => updateSettings('greeks.ivCalculation.tolerance', parseFloat(e.target.value))}
                    placeholder="0.0001"
                    step="0.0001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iv-initial">Initial Guess</Label>
                  <Input
                    type="number"
                    value={settings.greeks.ivCalculation.initialGuess}
                    onChange={(e) => updateSettings('greeks.ivCalculation.initialGuess', parseFloat(e.target.value))}
                    placeholder="0.25"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theta-exit">Theta Exit</Label>
                  <Switch
                    checked={settings.greeks.thetaExit}
                    onCheckedChange={(checked) => updateSettings('greeks.thetaExit', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="gamma-adjust">Gamma Adjust</Label>
                  <Switch
                    checked={settings.greeks.gammaAdjust}
                    onCheckedChange={(checked) => updateSettings('greeks.gammaAdjust', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="iv-alerts">IV Alerts</Label>
                  <Switch
                    checked={settings.greeks.ivAlerts}
                    onCheckedChange={(checked) => updateSettings('greeks.ivAlerts', checked)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volatility-band">Show Volatility Band</Label>
                  <Switch
                    checked={settings.greeks.showVolatilityBand}
                    onCheckedChange={(checked) => updateSettings('greeks.showVolatilityBand', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iv-rank-period">IV Rank Period (days)</Label>
                  <Input
                    type="number"
                    value={settings.greeks.ivRankPeriod}
                    onChange={(e) => updateSettings('greeks.ivRankPeriod', parseInt(e.target.value))}
                    placeholder="252"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Indicators Settings */}
      <TabsContent value="indicators" className="space-y-6">
        <IndicatorSettings />
      </TabsContent>


      {/* Risk Management */}
      <TabsContent value="risk" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget & Risk Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-budget">Max Budget (₹)</Label>
                <Input
                  type="number"
                  value={settings.budgetRisk.maxBudget}
                  onChange={(e) => updateSettings('budgetRisk.maxBudget', parseFloat(e.target.value))}
                  placeholder="100000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-loss">Max Loss Per Trade (%)</Label>
                <Input
                  type="number"
                  value={settings.budgetRisk.maxLossPerTrade}
                  onChange={(e) => updateSettings('budgetRisk.maxLossPerTrade', parseFloat(e.target.value))}
                  placeholder="2"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-sizing">Position Sizing Method</Label>
              <Select 
                value={settings.budgetRisk.positionSizing} 
                onValueChange={(value) => updateSettings('budgetRisk.positionSizing', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage of Capital</SelectItem>
                  <SelectItem value="kelly">Kelly Criterion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-loss-type">Stop Loss Type</Label>
              <Select 
                value={settings.budgetRisk.stopLossType} 
                onValueChange={(value) => updateSettings('budgetRisk.stopLossType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="atr">ATR Multiple</SelectItem>
                  <SelectItem value="support_resistance">Support/Resistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Broker Integration */}
      <TabsContent value="broker" className="space-y-6">
        <BrokerIntegrationPanel />
      </TabsContent>
        </div>
      </Tabs>

      {/* Bottom Save Button - Positioned at bottom of content */}
      {showSaveButton && (
  <div className="container mx-auto px-6 pb-6">
    <div className="mt-8 flex justify-end">
      <Button 
        onClick={handleSave}
        size="lg"
        className="shadow-lg hover:shadow-xl transition-shadow"
      >
        Save Changes
      </Button>
    </div>
  </div>
)}
