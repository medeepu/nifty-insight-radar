import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ToggleItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
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
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};