import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ToggleItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
  onColorChange?: (color: string) => void;
  lineStyle?: string;
  onLineStyleChange?: (style: string) => void;
  thickness?: number;
  onThicknessChange?: (thickness: number) => void;
}

interface CompactToggleWidgetProps {
  title: string;
  icon?: React.ReactNode;
  items: ToggleItem[];
  columns?: number;
}

export const CompactToggleWidget: React.FC<CompactToggleWidgetProps> = ({
  title,
  icon,
  items,
  columns = 2
}) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <div className={`grid grid-cols-${columns} gap-3`}>
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <Label htmlFor={item.id} className="text-xs font-medium cursor-pointer">
                    {item.label}
                  </Label>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
                <Switch
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={item.onChange}
                />
              </div>
              
              {/* Color, Style and Thickness controls */}
              {item.checked && (item.onColorChange || item.onLineStyleChange || item.onThicknessChange) && (
                <div className="space-y-3 mt-3 pt-3 border-t border-border/40">
                  {/* Color Picker */}
                  {item.onColorChange && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Color</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={item.color || '#3b82f6'}
                          onChange={(e) => item.onColorChange!(e.target.value)}
                          className="w-8 h-6 border border-border rounded cursor-pointer"
                        />
                        <span className="text-xs font-mono w-16">{item.color || '#3b82f6'}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Line Style */}
                  {item.onLineStyleChange && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Style</span>
                      <Select value={item.lineStyle || 'solid'} onValueChange={item.onLineStyleChange}>
                        <SelectTrigger className="w-24 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                          <SelectItem value="dash-dot">Dash-Dot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* Line Thickness */}
                  {item.onThicknessChange && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Thickness</span>
                      <div className="flex items-center gap-2 w-24">
                        <Slider
                          value={[item.thickness || 1]}
                          onValueChange={([value]) => item.onThicknessChange!(value)}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs w-4">{item.thickness || 1}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};