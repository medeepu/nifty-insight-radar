/**
 * Parameter Controls Component
 * User controls for ATR period, ORB window, and other technical parameters
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const ParameterControls: React.FC = () => {
  const { settings, updateSetting } = useSettingsStore();

  const resetToDefaults = () => {
    updateSetting('technical.atrPeriod', 14);
    updateSetting('technical.orbWindow', 15);
    updateSetting('technical.rsiPeriod', 14);
    updateSetting('technical.stochKPeriod', 14);
    updateSetting('technical.stochDPeriod', 3);
    updateSetting('technical.emaPeriods', [9, 21, 50, 200]);
  };

  return (
    <div className="space-y-6">
      {/* ATR Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ATR (Average True Range)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="atr-period">Period</Label>
              <Input
                id="atr-period"
                type="number"
                min="1"
                max="50"
                value={settings.technical?.atrPeriod || 14}
                onChange={(e) => updateSetting('technical.atrPeriod', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Multiplier</Label>
              <Slider
                value={[settings.technical?.atrMultiplier || 2]}
                onValueChange={([value]) => updateSetting('technical.atrMultiplier', value)}
                min={0.5}
                max={5}
                step={0.1}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {settings.technical?.atrMultiplier || 2}x
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ORB Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ORB (Opening Range Breakout)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orb-window">Time Window (minutes)</Label>
              <Select
                value={String(settings.technical?.orbWindow || 15)}
                onValueChange={(value) => updateSetting('technical.orbWindow', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="orb-enabled"
                checked={settings.technical?.orbEnabled || false}
                onCheckedChange={(checked) => updateSetting('technical.orbEnabled', checked)}
              />
              <Label htmlFor="orb-enabled">Enable ORB</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EMA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">EMA (Exponential Moving Average)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[9, 21, 50, 200].map((period) => (
              <div key={period}>
                <Label htmlFor={`ema-${period}`}>EMA {period}</Label>
                <Input
                  id={`ema-${period}`}
                  type="number"
                  min="1"
                  max="500"
                  value={period}
                  onChange={(e) => {
                    const newPeriods = [...(settings.technical?.emaPeriods || [9, 21, 50, 200])];
                    const index = newPeriods.indexOf(period);
                    if (index !== -1) {
                      newPeriods[index] = parseInt(e.target.value);
                      updateSetting('technical.emaPeriods', newPeriods);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RSI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">RSI (Relative Strength Index)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rsi-period">Period</Label>
              <Input
                id="rsi-period"
                type="number"
                min="2"
                max="50"
                value={settings.technical?.rsiPeriod || 14}
                onChange={(e) => updateSetting('technical.rsiPeriod', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rsi-overbought">Overbought</Label>
              <Input
                id="rsi-overbought"
                type="number"
                min="50"
                max="100"
                value={settings.technical?.rsiOverbought || 70}
                onChange={(e) => updateSetting('technical.rsiOverbought', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rsi-oversold">Oversold</Label>
              <Input
                id="rsi-oversold"
                type="number"
                min="0"
                max="50"
                value={settings.technical?.rsiOversold || 30}
                onChange={(e) => updateSetting('technical.rsiOversold', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stochastic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stochastic Oscillator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stoch-k">%K Period</Label>
              <Input
                id="stoch-k"
                type="number"
                min="1"
                max="50"
                value={settings.technical?.stochKPeriod || 14}
                onChange={(e) => updateSetting('technical.stochKPeriod', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="stoch-d">%D Period</Label>
              <Input
                id="stoch-d"
                type="number"
                min="1"
                max="20"
                value={settings.technical?.stochDPeriod || 3}
                onChange={(e) => updateSetting('technical.stochDPeriod', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volume Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="volume-threshold">Volume Threshold (%)</Label>
              <Slider
                value={[settings.technical?.volumeThreshold || 150]}
                onValueChange={([value]) => updateSetting('technical.volumeThreshold', value)}
                min={100}
                max={500}
                step={10}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {settings.technical?.volumeThreshold || 150}% of average
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="volume-alerts"
                checked={settings.technical?.volumeAlerts || false}
                onCheckedChange={(checked) => updateSetting('technical.volumeAlerts', checked)}
              />
              <Label htmlFor="volume-alerts">Volume Alerts</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};