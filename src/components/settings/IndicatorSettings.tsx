/**
 * Advanced Indicator Settings Component
 * Granular control over all chart indicators
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { useSettingsStore } from '../../store/useSettingsStore';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

export const IndicatorSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* CPR Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            CPR (Central Pivot Range)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="cpr-enabled">Enable CPR</Label>
            <Switch
              checked={settings.indicators.cpr.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.cpr.enabled', checked)}
            />
          </div>
          
          {settings.indicators.cpr.enabled && (
            <div className="ml-4 space-y-2 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-pivot" className="text-sm">Central Pivot (P)</Label>
                <Switch
                  checked={settings.indicators.cpr.pivot}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.pivot', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-bc" className="text-sm">Bottom Central (BC)</Label>
                <Switch
                  checked={settings.indicators.cpr.bc}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.bc', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-tc" className="text-sm">Top Central (TC)</Label>
                <Switch
                  checked={settings.indicators.cpr.tc}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.tc', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-r1" className="text-sm">Resistance 1 (R1)</Label>
                <Switch
                  checked={settings.indicators.cpr.r1}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.r1', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-r2" className="text-sm">Resistance 2 (R2)</Label>
                <Switch
                  checked={settings.indicators.cpr.r2}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.r2', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-r3" className="text-sm">Resistance 3 (R3)</Label>
                <Switch
                  checked={settings.indicators.cpr.r3}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.r3', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-s1" className="text-sm">Support 1 (S1)</Label>
                <Switch
                  checked={settings.indicators.cpr.s1}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.s1', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-s2" className="text-sm">Support 2 (S2)</Label>
                <Switch
                  checked={settings.indicators.cpr.s2}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.s2', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cpr-s3" className="text-sm">Support 3 (S3)</Label>
                <Switch
                  checked={settings.indicators.cpr.s3}
                  onCheckedChange={(checked) => updateSettings('indicators.cpr.s3', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EMA Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exponential Moving Averages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="ema-9">EMA 9</Label>
            <Switch
              checked={settings.indicators.ema.ema9.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.ema.ema9.enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ema-21">EMA 21</Label>
            <Switch
              checked={settings.indicators.ema.ema21.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.ema.ema21.enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ema-50">EMA 50</Label>
            <Switch
              checked={settings.indicators.ema.ema50.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.ema.ema50.enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ema-200">EMA 200</Label>
            <Switch
              checked={settings.indicators.ema.ema200.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.ema.ema200.enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Oscillators */}
      <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Oscillators & Technical Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="rsi-enabled">RSI</Label>
            <Switch
              checked={settings.indicators.rsi.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.rsi.enabled', checked)}
            />
          </div>
          
          {settings.indicators.rsi.enabled && (
            <div className="ml-4 space-y-2 border-l-2 border-muted pl-4">
              <div className="space-y-2">
                <Label htmlFor="rsi-period" className="text-sm">Period</Label>
                <Input
                  type="number"
                  value={settings.indicators.rsi.period}
                  onChange={(e) => updateSettings('indicators.rsi.period', parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="rsi-overbought" className="text-sm">Overbought</Label>
                  <Input
                    type="number"
                    value={settings.indicators.rsi.overbought}
                    onChange={(e) => updateSettings('indicators.rsi.overbought', parseInt(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rsi-oversold" className="text-sm">Oversold</Label>
                  <Input
                    type="number"
                    value={settings.indicators.rsi.oversold}
                    onChange={(e) => updateSettings('indicators.rsi.oversold', parseInt(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="stochastic-enabled">Stochastic</Label>
            <Switch
              checked={settings.indicators.stochastic.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.stochastic.enabled', checked)}
            />
          </div>
          
          {settings.indicators.stochastic.enabled && (
            <div className="ml-4 space-y-2 border-l-2 border-muted pl-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="stoch-k" className="text-sm">%K Period</Label>
                  <Input
                    type="number"
                    value={settings.indicators.stochastic.kPeriod}
                    onChange={(e) => updateSettings('indicators.stochastic.kPeriod', parseInt(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stoch-d" className="text-sm">%D Period</Label>
                  <Input
                    type="number"
                    value={settings.indicators.stochastic.dPeriod}
                    onChange={(e) => updateSettings('indicators.stochastic.dPeriod', parseInt(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stoch-smooth" className="text-sm">Smooth</Label>
                  <Input
                    type="number"
                    value={settings.indicators.stochastic.smooth}
                    onChange={(e) => updateSettings('indicators.stochastic.smooth', parseInt(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* VWAP & Other Indicators */}
      <Card className="bg-card/50 backdrop-blur-sm border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="text-lg font-semibold">VWAP & Additional Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="vwap-enabled" className="text-sm font-medium">Enable VWAP</Label>
            <Switch
              checked={settings.indicators.vwap.enabled}
              onCheckedChange={(checked) => updateSettings('indicators.vwap.enabled', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Previous Day Levels</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pdh-pdl" className="text-sm">Previous Day High/Low</Label>
              <Switch
                checked={settings.cprPivots.showPDH_PDL}
                onCheckedChange={(checked) => updateSettings('cprPivots.showPDH_PDL', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};