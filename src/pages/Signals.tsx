import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Clock, Target, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Signal {
  id: string;
  timestamp: string;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  entry: number;
  sl: number;
  tp: number;
  rr: number;
  scenario: string;
  status: 'ACTIVE' | 'COMPLETED' | 'STOPPED' | 'EXPIRED';
  confidence: number;
  pnl?: number;
}

const mockSignals: Signal[] = [
  {
    id: '1',
    timestamp: '2024-01-15 09:30:00',
    symbol: 'NIFTY 21000 CE',
    signal: 'BUY',
    entry: 125.50,
    sl: 100.00,
    tp: 175.00,
    rr: 1.94,
    scenario: 'Bullish Breakout',
    status: 'ACTIVE',
    confidence: 85,
  },
  {
    id: '2',
    timestamp: '2024-01-15 09:15:00',
    symbol: 'BANKNIFTY 48500 PE',
    signal: 'SELL',
    entry: 89.75,
    sl: 110.00,
    tp: 65.00,
    rr: 1.22,
    scenario: 'Bear Divergence',
    status: 'COMPLETED',
    confidence: 78,
    pnl: 1240,
  },
  {
    id: '3',
    timestamp: '2024-01-15 08:45:00',
    symbol: 'FINNIFTY 23800 CE',
    signal: 'BUY',
    entry: 45.25,
    sl: 30.00,
    tp: 65.00,
    rr: 1.30,
    scenario: 'Range Breakout',
    status: 'STOPPED',
    confidence: 72,
    pnl: -760,
  },
];

const Signals: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSymbol, setFilterSymbol] = useState<string>('all');

  const getSignalBadge = (signal: Signal['signal']) => {
    switch (signal) {
      case 'BUY':
        return <Badge className="bg-bull-green/10 text-bull-green border-bull-green/20">BUY</Badge>;
      case 'SELL':
        return <Badge className="bg-bear-red/10 text-bear-red border-bear-red/20">SELL</Badge>;
      case 'NEUTRAL':
        return <Badge className="bg-neutral-yellow/10 text-neutral-yellow border-neutral-yellow/20">NEUTRAL</Badge>;
    }
  };

  const getStatusBadge = (status: Signal['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default">Active</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-bull-green/10 text-bull-green border-bull-green/20">Completed</Badge>;
      case 'STOPPED':
        return <Badge className="bg-bear-red/10 text-bear-red border-bear-red/20">Stopped</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline">Expired</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-bull-green';
    if (confidence >= 60) return 'text-neutral-yellow';
    return 'text-bear-red';
  };

  const filteredSignals = mockSignals.filter(signal => {
    if (filterStatus !== 'all' && signal.status !== filterStatus) return false;
    if (filterSymbol !== 'all' && !signal.symbol.includes(filterSymbol)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trading Signals</h1>
        <Button>Configure Alerts</Button>
      </div>

      {/* Current Active Signal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Current Signal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockSignals.find(s => s.status === 'ACTIVE') ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getSignalBadge(mockSignals[0].signal)}
                  <span className="font-semibold">{mockSignals[0].symbol}</span>
                </div>
                <p className="text-sm text-muted-foreground">{mockSignals[0].scenario}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Entry: ₹{mockSignals[0].entry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">SL: ₹{mockSignals[0].sl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">TP: ₹{mockSignals[0].tp}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm">R:R Ratio: <span className="font-mono">{mockSignals[0].rr}</span></div>
                <div className={`text-sm ${getConfidenceColor(mockSignals[0].confidence)}`}>
                  Confidence: {mockSignals[0].confidence}%
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button size="sm">Execute Trade</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No active signals at the moment</p>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="STOPPED">Stopped</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSymbol} onValueChange={setFilterSymbol}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Symbols</SelectItem>
                <SelectItem value="NIFTY">NIFTY</SelectItem>
                <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
                <SelectItem value="FINNIFTY">FINNIFTY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Signals History */}
      <Card>
        <CardHeader>
          <CardTitle>Signals History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>SL/TP</TableHead>
                <TableHead>R:R</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignals.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <div>
                      <div className="font-mono text-sm">{signal.timestamp.split(' ')[1]}</div>
                      <div className="text-xs text-muted-foreground">{signal.timestamp.split(' ')[0]}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{signal.symbol}</div>
                      <div className="text-xs text-muted-foreground">{signal.scenario}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getSignalBadge(signal.signal)}</TableCell>
                  <TableCell className="font-mono">₹{signal.entry}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-bear-red">SL: ₹{signal.sl}</div>
                      <div className="text-xs text-bull-green">TP: ₹{signal.tp}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{signal.rr}</TableCell>
                  <TableCell>{getStatusBadge(signal.status)}</TableCell>
                  <TableCell>
                    <span className={getConfidenceColor(signal.confidence)}>
                      {signal.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {signal.pnl !== undefined && (
                      <span className={cn(
                        "font-mono",
                        signal.pnl >= 0 ? "text-bull-green" : "text-bear-red"
                      )}>
                        {signal.pnl >= 0 ? '+' : ''}₹{signal.pnl}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signals;