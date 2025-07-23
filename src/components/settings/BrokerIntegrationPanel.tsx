/**
 * Broker Integration Settings Panel
 * Manages Dhan and Zerodha broker configurations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useState } from 'react';

export const BrokerIntegrationPanel: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Broker Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Broker Selection */}
          <div className="space-y-3">
            <Label>Select Broker</Label>
            <Select 
              value={settings.broker.selectedBroker || ''} 
              onValueChange={(value) => updateSettings('broker.selectedBroker', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your broker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zerodha">Zerodha (Kite Connect)</SelectItem>
                <SelectItem value="dhan">Dhan HQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Zerodha Configuration */}
          {settings.broker.selectedBroker === 'zerodha' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zerodha Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={settings.broker.credentials.zerodha?.apiKey || ''}
                      onChange={(e) => updateSettings('broker.credentials.zerodha.apiKey', e.target.value)}
                      placeholder="Enter Zerodha API Key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Secret</Label>
                  <div className="relative">
                    <Input
                      type={showSecret ? "text" : "password"}
                      value={settings.broker.credentials.zerodha?.apiSecret || ''}
                      onChange={(e) => updateSettings('broker.credentials.zerodha.apiSecret', e.target.value)}
                      placeholder="Enter Zerodha API Secret"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Token (Auto-generated)</Label>
                  <Input
                    type="text"
                    value={settings.broker.credentials.zerodha?.accessToken || ''}
                    placeholder="Will be generated after authentication"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dhan Configuration */}
          {settings.broker.selectedBroker === 'dhan' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dhan Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <Input
                    type="text"
                    value={settings.broker.credentials.dhan?.clientId || ''}
                    onChange={(e) => updateSettings('broker.credentials.dhan.clientId', e.target.value)}
                    placeholder="Enter Dhan Client ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Access Token</Label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={settings.broker.credentials.dhan?.accessToken || ''}
                      onChange={(e) => updateSettings('broker.credentials.dhan.accessToken', e.target.value)}
                      placeholder="Enter Dhan Access Token"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trading Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Trading</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically execute trades based on signals
                </p>
              </div>
              <Switch
                checked={settings.broker.autoTrade}
                onCheckedChange={(checked) => updateSettings('broker.autoTrade', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Paper Trading</Label>
                <p className="text-sm text-muted-foreground">
                  Simulate trades without real money
                </p>
              </div>
              <Switch
                checked={settings.broker.paperTrade}
                onCheckedChange={(checked) => updateSettings('broker.paperTrade', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Order Confirmation</Label>
                <p className="text-sm text-muted-foreground">
                  Require confirmation before placing orders
                </p>
              </div>
              <Switch
                checked={settings.broker.orderConfirmation}
                onCheckedChange={(checked) => updateSettings('broker.orderConfirmation', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Test connection functionality
                console.log('Testing broker connection...');
              }}
            >
              Test Connection
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                // Save credentials functionality
                console.log('Saving broker credentials...');
              }}
            >
              Save Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};