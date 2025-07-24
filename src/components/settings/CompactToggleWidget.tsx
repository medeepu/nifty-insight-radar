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
              
              {/* Compact Style Controls */}
              {item.checked && (item.onColorChange || item.onLineStyleChange || item.onThicknessChange) && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    {/* Color */}
                    {item.onColorChange && (
                      <input
                        type="color"
                        value={item.color || '#3b82f6'}
                        onChange={(e) => item.onColorChange!(e.target.value)}
                        className="w-5 h-5 border border-border rounded cursor-pointer"
                      />
                    )}
                    
                    {/* Style */}
                    {item.onLineStyleChange && (
                      <Select value={item.lineStyle || 'solid'} onValueChange={item.onLineStyleChange}>
                        <SelectTrigger className="w-16 h-5 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">━━━</SelectItem>
                          <SelectItem value="dashed">╌╌╌</SelectItem>
                          <SelectItem value="dotted">┈┈┈</SelectItem>
                          <SelectItem value="dash-dot">╌•╌</SelectItem>
                          <SelectItem value="circles">●●●</SelectItem>
                          <SelectItem value="triangles">▲▲▲</SelectItem>
                          <SelectItem value="squares">■■■</SelectItem>
                          <SelectItem value="diamonds">♦♦♦</SelectItem>
                          <SelectItem value="stars">★★★</SelectItem>
                          <SelectItem value="crosses">✕✕✕</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {/* Thickness */}
                    {item.onThicknessChange && (
                      <div className="flex items-center gap-1 w-12">
                        <Slider
                          value={[item.thickness || 1]}
                          onValueChange={([value]) => item.onThicknessChange!(value)}
                          min={1}
                          max={5}
                          step={1}
                          className="w-8"
                        />
                        <span className="text-xs w-2">{item.thickness || 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};