import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getHyperliquidAllMids, getHyperliquidOrderBook } from '@/lib/hyperliquidService';

interface HyperliquidPriceData {
  symbol: string;
  price: number;
  timestamp: number;
}

interface HyperliquidOrderBookData {
  symbol: string;
  bids: Array<{ price: number; amount: number }>;
  asks: Array<{ price: number; amount: number }>;
  spread: number;
  timestamp: number;
}

interface HyperliquidDataContextType {
  prices: Record<string, HyperliquidPriceData>;
  orderBooks: Record<string, HyperliquidOrderBookData>;
  isConnected: boolean;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
}

const HyperliquidDataContext = createContext<HyperliquidDataContextType | null>(null);

export const useHyperliquidData = () => {
  const context = useContext(HyperliquidDataContext);
  if (!context) {
    throw new Error('useHyperliquidData must be used within a HyperliquidDataProvider');
  }
  return context;
};

interface HyperliquidDataProviderProps {
  children: ReactNode;
}

export const HyperliquidDataProvider: React.FC<HyperliquidDataProviderProps> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, HyperliquidPriceData>>({});
  const [orderBooks, setOrderBooks] = useState<Record<string, HyperliquidOrderBookData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const [priceInterval, setPriceInterval] = useState<NodeJS.Timeout | null>(null);
  const [orderBookInterval, setOrderBookInterval] = useState<NodeJS.Timeout | null>(null);

  // Popular Hyperliquid symbols to track
  const POPULAR_SYMBOLS = ['BTC', 'ETH', 'SOL', 'DOGE', 'PEPE', 'WIF', 'POPCAT', 'ARB', 'AVAX', 'LINK'];

  useEffect(() => {
    console.log('[HyperliquidData] Initializing Hyperliquid data provider');
    startDataStreaming();

    return () => {
      stopDataStreaming();
    };
  }, []);

  const startDataStreaming = () => {
    setIsConnected(true);
    
    // Start price updates every 2 seconds
    const priceUpdateInterval = setInterval(async () => {
      try {
        console.log('[HyperliquidData] Fetching price updates');
        const mids = await getHyperliquidAllMids();
        
        if (mids && typeof mids === 'object') {
          const timestamp = Date.now();
          const newPrices: Record<string, HyperliquidPriceData> = {};
          
          // Process all available symbols
          Object.entries(mids).forEach(([symbol, priceStr]) => {
            if (typeof priceStr === 'string' && !isNaN(parseFloat(priceStr))) {
              newPrices[symbol] = {
                symbol,
                price: parseFloat(priceStr),
                timestamp
              };
            }
          });
          
          console.log(`[HyperliquidData] Updated prices for ${Object.keys(newPrices).length} symbols`);
          setPrices(newPrices);
        }
      } catch (error) {
        console.error('[HyperliquidData] Error fetching price data:', error);
        // Don't disconnect on single failures, keep trying
      }
    }, 2000);

    // Start order book updates every 3 seconds for subscribed symbols
    const orderBookUpdateInterval = setInterval(async () => {
      if (subscriptions.size === 0) return;
      
      try {
        console.log(`[HyperliquidData] Fetching order books for ${subscriptions.size} symbols`);
        
        for (const symbol of subscriptions) {
          try {
            const orderBook = await getHyperliquidOrderBook(symbol);
            
            if (orderBook?.levels) {
              const timestamp = Date.now();
              const levels = orderBook.levels;
              
              // Sort levels to identify bids vs asks
              const sortedLevels = [...levels].sort((a, b) => parseFloat(a.px) - parseFloat(b.px));
              const midIndex = Math.floor(sortedLevels.length / 2);
              const midPrice = parseFloat(sortedLevels[midIndex]?.px || '0');
              
              const bids: Array<{ price: number; amount: number }> = [];
              const asks: Array<{ price: number; amount: number }> = [];
              
              for (const level of levels) {
                const price = parseFloat(level.px);
                const amount = parseFloat(level.sz);
                
                if (price <= midPrice) {
                  bids.push({ price, amount });
                } else {
                  asks.push({ price, amount });
                }
              }
              
              // Sort and limit
              bids.sort((a, b) => b.price - a.price);
              asks.sort((a, b) => a.price - b.price);
              
              const topBids = bids.slice(0, 10);
              const topAsks = asks.slice(0, 10);
              const spread = topAsks.length > 0 && topBids.length > 0 ? topAsks[0].price - topBids[0].price : 0;
              
              setOrderBooks(prev => ({
                ...prev,
                [symbol]: {
                  symbol,
                  bids: topBids,
                  asks: topAsks,
                  spread,
                  timestamp
                }
              }));
              
              console.log(`[HyperliquidData] Updated order book for ${symbol}`);
            }
          } catch (symbolError) {
            console.error(`[HyperliquidData] Error fetching order book for ${symbol}:`, symbolError);
          }
        }
      } catch (error) {
        console.error('[HyperliquidData] Error in order book update cycle:', error);
      }
    }, 3000);

    setPriceInterval(priceUpdateInterval);
    setOrderBookInterval(orderBookUpdateInterval);
    
    console.log('[HyperliquidData] Data streaming started');
  };

  const stopDataStreaming = () => {
    if (priceInterval) {
      clearInterval(priceInterval);
      setPriceInterval(null);
    }
    
    if (orderBookInterval) {
      clearInterval(orderBookInterval);
      setOrderBookInterval(null);
    }
    
    setIsConnected(false);
    console.log('[HyperliquidData] Data streaming stopped');
  };

  const subscribe = (symbol: string) => {
    console.log(`[HyperliquidData] Subscribing to ${symbol}`);
    setSubscriptions(prev => new Set([...prev, symbol]));
  };

  const unsubscribe = (symbol: string) => {
    console.log(`[HyperliquidData] Unsubscribing from ${symbol}`);
    setSubscriptions(prev => {
      const newSubs = new Set(prev);
      newSubs.delete(symbol);
      return newSubs;
    });
    
    // Remove order book data for unsubscribed symbol
    setOrderBooks(prev => {
      const newOrderBooks = { ...prev };
      delete newOrderBooks[symbol];
      return newOrderBooks;
    });
  };

  const value: HyperliquidDataContextType = {
    prices,
    orderBooks,
    isConnected,
    subscribe,
    unsubscribe
  };

  return (
    <HyperliquidDataContext.Provider value={value}>
      {children}
    </HyperliquidDataContext.Provider>
  );
};

// Note: These hooks are no longer exported to prevent import errors
// Components should use direct API calls instead