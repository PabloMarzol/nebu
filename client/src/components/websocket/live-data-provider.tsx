import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface LivePriceData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

interface LiveDataContextType {
  prices: Record<string, LivePriceData>;
  isConnected: boolean;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
}

const LiveDataContext = createContext<LiveDataContextType | null>(null);

export const useLiveData = () => {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
};

interface LiveDataProviderProps {
  children: ReactNode;
}

export const LiveDataProvider: React.FC<LiveDataProviderProps> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, LivePriceData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize WebSocket connection to Coinbase Advanced Trade
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('wss://advanced-trade-ws.coinbase.com');
        
        ws.onopen = () => {
          console.log('[LiveData] WebSocket connected');
          setIsConnected(true);
          
          // Subscribe to ticker for major pairs
          const subscribeMessage = {
            type: 'subscribe',
            channels: [
              {
                name: 'ticker',
                product_ids: [
                  'BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 
                  'DOT-USD', 'LINK-USD', 'UNI-USD', 'AAVE-USD',
                  'MATIC-USD', 'AVAX-USD'
                ]
              }
            ]
          };
          
          ws.send(JSON.stringify(subscribeMessage));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'ticker' && data.product_id) {
              const symbol = data.product_id.replace('-USD', '/USDT');
              const price = parseFloat(data.price || data.best_bid || '0');
              const change24h = parseFloat(data.price_24h_change || '0');
              const changePercent = parseFloat(data.price_24h_percent_change || '0');
              const volume = parseFloat(data.volume_24h || '0');

              setPrices(prev => ({
                ...prev,
                [symbol]: {
                  symbol,
                  price,
                  change24h,
                  changePercent,
                  volume,
                  timestamp: Date.now()
                }
              }));
            }
          } catch (error) {
            console.error('[LiveData] Message parsing error:', error);
          }
        };

        ws.onclose = () => {
          console.log('[LiveData] WebSocket disconnected');
          setIsConnected(false);
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (!socket || socket.readyState === WebSocket.CLOSED) {
              connectWebSocket();
            }
          }, 5000);
        };

        ws.onerror = (error) => {
          console.error('[LiveData] WebSocket error:', error);
          setIsConnected(false);
        };

        setSocket(ws);
      } catch (error) {
        console.error('[LiveData] WebSocket connection failed:', error);
        
        // Fallback to REST API polling
        startRestFallback();
      }
    };

    const startRestFallback = () => {
      console.log('[LiveData] Starting REST fallback');
      
      const updatePrices = async () => {
        try {
          const symbols = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 'DOT-USD'];
          
          for (const symbol of symbols) {
            try {
              const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${symbol.split('-')[0]}`);
              const data = await response.json();
              
              if (data.data && data.data.rates && data.data.rates.USD) {
                const price = parseFloat(data.data.rates.USD);
                const displaySymbol = symbol.replace('-USD', '/USDT');
                
                setPrices(prev => ({
                  ...prev,
                  [displaySymbol]: {
                    symbol: displaySymbol,
                    price,
                    change24h: prev[displaySymbol]?.change24h || 0,
                    changePercent: prev[displaySymbol]?.changePercent || 0,
                    volume: prev[displaySymbol]?.volume || 0,
                    timestamp: Date.now()
                  }
                }));
              }
            } catch (symbolError) {
              console.error(`[LiveData] Error fetching ${symbol}:`, symbolError);
            }
          }
        } catch (error) {
          console.error('[LiveData] REST fallback error:', error);
        }
      };

      // Update immediately and then every 30 seconds
      updatePrices();
      const interval = setInterval(updatePrices, 30000);
      
      return () => clearInterval(interval);
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const subscribe = (symbol: string) => {
    setSubscriptions(prev => new Set([...prev, symbol]));
  };

  const unsubscribe = (symbol: string) => {
    setSubscriptions(prev => {
      const newSubs = new Set(prev);
      newSubs.delete(symbol);
      return newSubs;
    });
  };

  const value: LiveDataContextType = {
    prices,
    isConnected,
    subscribe,
    unsubscribe
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
};