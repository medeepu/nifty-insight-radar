/**
 * User-Friendly Chart Indicator Panel
 * Easy toggle controls for chart indicators
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { useSettingsStore } from '../../store/useSettingsStore';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  Settings2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export const ChartIndicatorPanel: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState({
    cpr: false,
    ema: false,
    oscillators: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveIndicatorsCount = () => {
    let count = 0;
    if (settings.indicators.cpr.enabled) count++;
    if (settings.indicators.ema.ema9.enabled) count++;
    if (settings.indicators.ema.ema21.enabled) count++;
    if (settings.indicators.ema.ema50.enabled) count++;
    if (settings.indicators.ema.ema200.enabled) count++;
    if (settings.indicators.vwap.enabled) count++;
    if (settings.indicators.rsi.enabled) count++;
    if (settings.indicators.stochastic.enabled) count++;
    return count;
  };

  return (
    <Card className="w-80 bg-card/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Chart Indicators
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getActiveIndicatorsCount()} Active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4">
          {/* Quick Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg border bg-background/50">
              <Label htmlFor="vwap-quick" className="text-sm font-medium">VWAP</Label>
              <Switch
                id="vwap-quick"
                checked={settings.indicators.vwap.enabled}
                onCheckedChange={(checked) => updateSettings('indicators.vwap.enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg border bg-background/50">
              <Label htmlFor="rsi-quick" className="text-sm font-medium">RSI</Label>
              <Switch
                id="rsi-quick"
                checked={settings.indicators.rsi.enabled}
                onCheckedChange={(checked) => updateSettings('indicators.rsi.enabled', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* CPR Controls */}
          <Collapsible open={expandedSections.cpr} onOpenChange={() => toggleSection('cpr')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">CPR & Pivots</span>
                  <Badge variant={settings.indicators.cpr.enabled ? "default" : "secondary"} className="text-xs">
                    {settings.indicators.cpr.enabled ? "ON" : "OFF"}
                  </Badge>
                </div>
                {expandedSections.cpr ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="ml-6 space-y-2 border-l-2 border-primary/20 pl-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable CPR</Label>
                  <Switch
                    checked={settings.indicators.cpr.enabled}
                    onCheckedChange={(checked) => updateSettings('indicators.cpr.enabled', checked)}
                  />
                </div>
                
                {settings.indicators.cpr.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Pivot (P)</span>
                        <Switch
                          checked={settings.indicators.cpr.pivot}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.pivot', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>BC</span>
                        <Switch
                          checked={settings.indicators.cpr.bc}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.bc', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>TC</span>
                        <Switch
                          checked={settings.indicators.cpr.tc}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.tc', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>R1</span>
                        <Switch
                          checked={settings.indicators.cpr.r1}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.r1', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>R2</span>
                        <Switch
                          checked={settings.indicators.cpr.r2}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.r2', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>R3</span>
                        <Switch
                          checked={settings.indicators.cpr.r3}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.r3', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>S1</span>
                        <Switch
                          checked={settings.indicators.cpr.s1}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.s1', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>S2</span>
                        <Switch
                          checked={settings.indicators.cpr.s2}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.s2', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>S3</span>
                        <Switch
                          checked={settings.indicators.cpr.s3}
                          onCheckedChange={(checked) => updateSettings('indicators.cpr.s3', checked)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* EMA Controls */}
          <Collapsible open={expandedSections.ema} onOpenChange={() => toggleSection('ema')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Moving Averages</span>
                  <Badge variant="secondary" className="text-xs">
                    {[settings.indicators.ema.ema9.enabled, settings.indicators.ema.ema21.enabled, 
                      settings.indicators.ema.ema50.enabled, settings.indicators.ema.ema200.enabled]
                      .filter(Boolean).length} Active
                  </Badge>
                </div>
                {expandedSections.ema ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="ml-6 space-y-2 border-l-2 border-secondary/20 pl-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EMA 9</span>
                    <Switch
                      checked={settings.indicators.ema.ema9.enabled}
                      onCheckedChange={(checked) => updateSettings('indicators.ema.ema9.enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EMA 21</span>
                    <Switch
                      checked={settings.indicators.ema.ema21.enabled}
                      onCheckedChange={(checked) => updateSettings('indicators.ema.ema21.enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EMA 50</span>
                    <Switch
                      checked={settings.indicators.ema.ema50.enabled}
                      onCheckedChange={(checked) => updateSettings('indicators.ema.ema50.enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EMA 200</span>
                    <Switch
                      checked={settings.indicators.ema.ema200.enabled}
                      onCheckedChange={(checked) => updateSettings('indicators.ema.ema200.enabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Oscillators */}
          <Collapsible open={expandedSections.oscillators} onOpenChange={() => toggleSection('oscillators')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Oscillators</span>
                  <Badge variant="secondary" className="text-xs">
                    {[settings.indicators.rsi.enabled, settings.indicators.stochastic.enabled]
                      .filter(Boolean).length} Active
                  </Badge>
                </div>
                {expandedSections.oscillators ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="ml-6 space-y-2 border-l-2 border-accent/20 pl-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">RSI (14)</span>
                  <Switch
                    checked={settings.indicators.rsi.enabled}
                    onCheckedChange={(checked) => updateSettings('indicators.rsi.enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stochastic</span>
                  <Switch
                    checked={settings.indicators.stochastic.enabled}
                    onCheckedChange={(checked) => updateSettings('indicators.stochastic.enabled', checked)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  );
};