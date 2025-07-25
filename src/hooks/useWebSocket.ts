/**
 * WebSocket Hook for Real-time Data
 * Handles connection, reconnection, and message handling
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { WSMessage } from '../types/api';
import { useTradingStore } from '../store/useTradingStore';

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WSMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = ({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) => {
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<string[]>([]);
  
  const { setConnected, setCurrentPrice, setCurrentSignal } = useTradingStore();

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setReadyState(WebSocket.OPEN);
        setConnected(true);
        setReconnectAttempts(0);
        onConnect?.();
        
        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift();
          if (message && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
          }
        }
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Handle different message types
          switch (message.type) {
            case 'price':
              setCurrentPrice(message.data);
              break;
            case 'signal':
              setCurrentSignal(message.data);
              break;
            case 'log':
              // TODO: Add to log store when implemented
              console.log('WebSocket Log:', message.data);
              break;
            default:
              console.log('Unknown message type:', message);
          }
          
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setReadyState(WebSocket.CLOSED);
        setConnected(false);
        onDisconnect?.();
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setReadyState(WebSocket.CLOSED);
        setConnected(false);
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setReadyState(WebSocket.CLOSED);
      setConnected(false);
    }
  }, [url, onConnect, onDisconnect, onMessage, reconnectAttempts, maxReconnectAttempts, reconnectInterval, setConnected, setCurrentPrice, setCurrentSignal]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(messageStr);
    } else {
      // Queue message for later
      messageQueueRef.current.push(messageStr);
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  // Initialize connection
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (readyState === WebSocket.OPEN) {
      const heartbeat = setInterval(() => {
        sendMessage({ type: 'ping', timestamp: Date.now() });
      }, 30000);
      
      return () => clearInterval(heartbeat);
    }
  }, [readyState, sendMessage]);

  return {
    readyState,
    lastMessage,
    sendMessage,
    reconnect,
    disconnect,
    isConnected: readyState === WebSocket.OPEN,
    isConnecting: readyState === WebSocket.CONNECTING,
    reconnectAttempts,
  };
};
