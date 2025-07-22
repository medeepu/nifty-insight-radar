/**
 * Logs/Activity Feed Page
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, AlertCircle, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  category?: string;
}

// Mock log data
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-20 10:30:15',
    level: 'INFO',
    message: 'Signal generated: BUY NIFTY50 CE at 22500',
    category: 'SIGNAL'
  },
  {
    id: '2',
    timestamp: '2024-01-20 10:29:45',
    level: 'WARN',
    message: 'High volatility detected in BANKNIFTY',
    category: 'MARKET'
  },
  {
    id: '3',
    timestamp: '2024-01-20 10:28:30',
    level: 'ERROR',
    message: 'Connection timeout to broker API',
    category: 'BROKER'
  },
  {
    id: '4',
    timestamp: '2024-01-20 10:27:12',
    level: 'INFO',
    message: 'WebSocket connection established',
    category: 'SYSTEM'
  }
];

const getLevelIcon = (level: LogEntry['level']) => {
  switch (level) {
    case 'INFO':
      return <Info className="w-4 h-4 text-primary" />;
    case 'WARN':
      return <AlertTriangle className="w-4 h-4 text-neutral-yellow" />;
    case 'ERROR':
      return <AlertCircle className="w-4 h-4 text-bear-red" />;
  }
};

const getLevelBadge = (level: LogEntry['level']) => {
  const variants = {
    INFO: 'bg-primary/10 text-primary border-primary/20',
    WARN: 'bg-neutral-yellow/10 text-neutral-yellow border-neutral-yellow/20',
    ERROR: 'bg-bear-red/10 text-bear-red border-bear-red/20'
  };
  
  return <Badge className={variants[level]}>{level}</Badge>;
};

const Logs: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const [logs] = useState<LogEntry[]>(mockLogs);

  const filteredLogs = logs.filter(log => 
    filter === 'ALL' || log.level === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <Activity className="w-6 h-6 mr-2 text-primary" />
          Activity Logs
        </h1>
        <p className="text-muted-foreground">
          Real-time system activity and trading signals
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="INFO">Info Only</SelectItem>
                <SelectItem value="WARN">Warnings</SelectItem>
                <SelectItem value="ERROR">Errors</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline">
              {filteredLogs.length} entries
            </Badge>
          </div>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Logs List */}
      <Card className="p-0">
        <div className="divide-y divide-border">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getLevelIcon(log.level)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {getLevelBadge(log.level)}
                      {log.category && (
                        <Badge variant="outline" className="text-xs">
                          {log.category}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {log.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground">
                    {log.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-4 opacity-50" />
            <p>No logs found for the selected filter</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Logs;