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

export const SettingsPanels: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <Tabs defaultValue="core" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="core">Core</TabsTrigger>
        <TabsTrigger value="greeks">Greeks</TabsTrigger>
        <TabsTrigger value="display">Display</TabsTrigger>
        <TabsTrigger value="risk">Risk</TabsTrigger>
      </TabsList>

      {/* Core Trading Settings */}
      <TabsContent value="core" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Core Trading Inputs</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Manual Option Settings</CardTitle>
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

      {/* Greeks Settings */}
      <TabsContent value="greeks" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Greeks Configuration</CardTitle>
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

      {/* Display Settings */}
      <TabsContent value="display" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Display</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Chart Indicators</CardTitle>
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
    </Tabs>
  );
};