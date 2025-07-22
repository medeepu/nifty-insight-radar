/**
 * Pro Tip Card Component
 * Displays AI-generated trading insights and tips
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Lightbulb, Copy, RefreshCw } from 'lucide-react';
import { useTradingStore } from '../../store/useTradingStore';
import { toast } from '../../hooks/use-toast';

export const ProTipCard: React.FC = () => {
  const { currentSignal } = useTradingStore();

  const handleCopy = async () => {
    if (!currentSignal?.proTip) return;
    
    try {
      await navigator.clipboard.writeText(currentSignal.proTip);
      toast({
        title: "Copied!",
        description: "Pro tip copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    // Would trigger a refresh of the current signal/tip
    toast({
      title: "Refreshing...",
      description: "Fetching latest market insights",
    });
  };

  const getProTip = () => {
    if (currentSignal?.proTip) {
      return currentSignal.proTip;
    }
    
    // Fallback tips based on market conditions
    return "Monitor the 21 EMA for potential support/resistance. Current market structure suggests consolidation phase with breakout potential above recent highs.";
  };

  const getConfidenceLevel = () => {
    return currentSignal?.confidence || 75; // Mock confidence
  };

  const getConfidenceColor = () => {
    const confidence = getConfidenceLevel();
    if (confidence >= 80) return 'text-bull';
    if (confidence >= 60) return 'text-neutral';
    return 'text-bear';
  };

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-neutral" />
            Pro Tip
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Confidence Level */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <span className={`font-medium text-sm ${getConfidenceColor()}`}>
            {getConfidenceLevel()}%
          </span>
        </div>
        
        {/* Pro Tip Content */}
        <div className="text-sm leading-relaxed text-foreground bg-muted/30 p-3 rounded-lg border">
          {getProTip()}
        </div>
        
        {/* Signal Context */}
        {currentSignal && (
          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Scenario</span>
              <span className="text-xs font-medium">
                {currentSignal.scenario}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Signal Time</span>
              <span className="text-xs font-mono text-muted-foreground">
                {new Date(currentSignal.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            Set Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};