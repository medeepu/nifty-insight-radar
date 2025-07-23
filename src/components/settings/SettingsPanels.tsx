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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
      {/* Beautiful Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Trading Configuration
            </h1>
            <p className="text-muted-foreground mt-2">Customize your trading parameters and preferences</p>
          </div>
          <Button 
            onClick={() => {
              // Save settings to server
              console.log('Saving settings...', settings);
            }}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            size="lg"
          >
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="core" className="w-full" orientation="vertical">
        <div className="flex gap-8">
          <div className="w-64">
            <TabsList className="flex flex-col h-fit w-full bg-card/50 backdrop-blur-sm border">
              <TabsTrigger value="core" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Core Trading
              </TabsTrigger>
              <TabsTrigger value="parameters" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Technical Parameters
              </TabsTrigger>
              <TabsTrigger value="greeks" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Greeks Configuration
              </TabsTrigger>
              <TabsTrigger value="indicators" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Chart Indicators
              </TabsTrigger>
              <TabsTrigger value="display" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Display Settings
              </TabsTrigger>
              <TabsTrigger value="risk" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Risk Management
              </TabsTrigger>
              <TabsTrigger value="broker" className="w-full justify-start text-left font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Broker Integration
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 max-w-4xl">

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

        <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Manual Option Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
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

      {/* Display Settings */}
      <TabsContent value="display" className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Dashboard Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Visible Blocks</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="market-info-block">Market Info</Label>
                  <Switch
                    checked={settings.dashboard.blocks.marketInfo}
                    onCheckedChange={(checked) => updateSettings('dashboard.blocks.marketInfo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="option-params-block">Option Parameters</Label>
                  <Switch
                    checked={settings.dashboard.blocks.optionParams}
                    onCheckedChange={(checked) => updateSettings('dashboard.blocks.optionParams', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="greeks-block">Greeks</Label>
                  <Switch
                    checked={settings.dashboard.blocks.greeks}
                    onCheckedChange={(checked) => updateSettings('dashboard.blocks.greeks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="price-analysis-block">Price Analysis</Label>
                  <Switch
                    checked={settings.dashboard.blocks.priceAnalysis}
                    onCheckedChange={(checked) => updateSettings('dashboard.blocks.priceAnalysis', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pro-tip-block">Pro Tip</Label>
                  <Switch
                    checked={settings.dashboard.blocks.proTip}
                    onCheckedChange={(checked) => updateSettings('dashboard.blocks.proTip', checked)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Potential Entry</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="potential-entry-toggle">Show Potential Entry</Label>
                  <Switch
                    checked={settings.dashboard.potentialEntryToggle}
                    onCheckedChange={(checked) => updateSettings('dashboard.potentialEntryToggle', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Chart Indicators (Legacy)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">EMA Settings</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ema-9">EMA 9</Label>
                  <Switch
                    checked={settings.ema.periods.ema9.enabled}
                    onCheckedChange={(checked) => updateSettings('ema.periods.ema9.enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ema-21">EMA 21</Label>
                  <Switch
                    checked={settings.ema.periods.ema21.enabled}
                    onCheckedChange={(checked) => updateSettings('ema.periods.ema21.enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ema-50">EMA 50</Label>
                  <Switch
                    checked={settings.ema.periods.ema50.enabled}
                    onCheckedChange={(checked) => updateSettings('ema.periods.ema50.enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ema-200">EMA 200</Label>
                  <Switch
                    checked={settings.ema.periods.ema200.enabled}
                    onCheckedChange={(checked) => updateSettings('ema.periods.ema200.enabled', checked)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">CPR & Pivots</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="cpr-enabled">Show CPR</Label>
                  <Switch
                    checked={settings.cprPivots.showCPR}
                    onCheckedChange={(checked) => updateSettings('cprPivots.showCPR', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="daily-pivots">Daily Pivots</Label>
                  <Switch
                    checked={settings.cprPivots.showDailyPivots}
                    onCheckedChange={(checked) => updateSettings('cprPivots.showDailyPivots', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-pivots">Weekly Pivots</Label>
                  <Switch
                    checked={settings.cprPivots.showWeeklyPivots}
                    onCheckedChange={(checked) => updateSettings('cprPivots.showWeeklyPivots', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="monthly-pivots">Monthly Pivots</Label>
                  <Switch
                    checked={settings.cprPivots.showMonthlyPivots}
                    onCheckedChange={(checked) => updateSettings('cprPivots.showMonthlyPivots', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Broker Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="selected-broker">Selected Broker</Label>
              <Select 
                value={settings.broker.selectedBroker} 
                onValueChange={(value) => updateSettings('broker.selectedBroker', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zerodha">Zerodha</SelectItem>
                  <SelectItem value="dhan">Dhan</SelectItem>
                  <SelectItem value="angel">Angel One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  type="password"
                  value={settings.broker.credentials.zerodha?.apiKey || ''}
                  onChange={(e) => updateSettings('broker.credentials.zerodha.apiKey', e.target.value)}
                  placeholder="Enter API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  type="password"
                  value={settings.broker.credentials.zerodha?.apiSecret || ''}
                  onChange={(e) => updateSettings('broker.credentials.zerodha.apiSecret', e.target.value)}
                  placeholder="Enter API Secret"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-trade">Enable Auto Trading</Label>
              <Switch
                checked={settings.broker.autoTrade}
                onCheckedChange={(checked) => updateSettings('broker.autoTrade', checked)}
              />
            </div>

            <Button className="w-full" variant="outline">
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Broker Integration Tab */}
      <TabsContent value="broker" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Broker Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <p>Broker integration settings will be available here.</p>
              <p className="text-sm mt-2">Configure Zerodha and Dhan API credentials for auto-trading.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Broker Integration */}
      <TabsContent value="broker" className="space-y-6">
        <BrokerIntegrationPanel />
      </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};