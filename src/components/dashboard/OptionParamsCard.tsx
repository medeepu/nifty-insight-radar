/**
 * Option Parameters Card Component
 * Displays current option details and parameters
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calculator } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const OptionParamsCard: React.FC = () => {
  const { settings } = useSettingsStore();
  const { manual } = settings;

  const getOptionTypeVariant = () => {
    return manual.optionType === 'call' ? 'default' : 'destructive';
  };

  const formatExpiry = () => {
    const { day, month, year } = manual.expiry;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const getDaysToExpiry = () => {
    const { day, month, year } = manual.expiry;
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Option Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Option Type */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Type</span>
          <Badge variant={getOptionTypeVariant()} className="text-xs">
            {manual.optionType}
          </Badge>
        </div>

        {/* Strike Price */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Strike</span>
          <span className="font-mono font-medium">
            {manual.strike > 0 ? manual.strike.toFixed(0) : '--'}
          </span>
        </div>

        {/* Option LTP */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">LTP</span>
          <span className="font-mono font-medium">
            ₹{manual.optionLTP > 0 ? manual.optionLTP.toFixed(2) : '--'}
          </span>
        </div>

        {/* Expiry Date */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Expiry</span>
          <span className="font-mono text-sm">
            {formatExpiry()}
          </span>
        </div>

        {/* Days to Expiry */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">DTE</span>
          <Badge variant="outline" className="text-xs">
            {getDaysToExpiry()} days
          </Badge>
        </div>

        {/* Lot Size */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Lot Size</span>
          <span className="font-mono font-medium">
            50 {/* This would come from symbol config */}
          </span>
        </div>

        {/* Contract Value */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Contract Value</span>
          <span className="font-mono font-medium">
            ₹{manual.optionLTP > 0 ? (manual.optionLTP * 50).toFixed(0) : '--'}
          </span>
        </div>

        {/* Strike Selection Mode */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Selection Mode</span>
            <Badge variant="secondary" className="text-xs">
              {settings.core.strikeSelectionMode.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};