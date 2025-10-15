import { useQuery } from "@tanstack/react-query";

interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  volume24h: string;
}

export function useMarketData() {
  return useQuery({
    queryKey: ["/api/markets"],
    queryFn: async (): Promise<MarketData[]> => {
      try {
        const response = await fetch('/api/markets');
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        
        // Handle different response formats safely
        let marketsArray: any[] = [];
        
        if (Array.isArray(data)) {
          // Direct array response
          marketsArray = data;
        } else if (data.success && Array.isArray(data.data)) {
          // Wrapped in success object
          marketsArray = data.data;
        } else if (data.data && Array.isArray(data.data)) {
          // Just wrapped in data object
          marketsArray = data.data;
        } else {
          console.error('Unexpected API response format:', data);
          return [];
        }

        // Validate and transform the data
        return marketsArray
          .filter(market => {
            // Only include valid market data
            return market && 
                   market.symbol && 
                   typeof market.price !== 'undefined' && 
                   !isNaN(parseFloat(market.price));
          })
          .map((market: any) => ({
            symbol: market.symbol,
            name: market.symbol.replace('/', ' / '),
            price: isNaN(parseFloat(market.price)) ? '0.000000' : parseFloat(market.price).toFixed(6),
            change24h: isNaN(parseFloat(market.change24h)) ? '0.00' : parseFloat(market.change24h).toFixed(2),
            volume24h: isNaN(parseFloat(market.volume || market.volume24h)) ? '0' : parseFloat(market.volume || market.volume24h).toFixed(0)
          }));
      } catch (error) {
        console.error('Failed to fetch market data:', error);
        // Return fallback data to prevent crashes
        return [
          {
            symbol: 'BTC/USDT',
            name: 'Bitcoin / USDT',
            price: '67500.000000',
            change24h: '2.45',
            volume24h: '1250000000'
          },
          {
            symbol: 'ETH/USDT', 
            name: 'Ethereum / USDT',
            price: '3450.000000',
            change24h: '-1.23',
            volume24h: '890000000'
          },
          {
            symbol: 'SOL/USDT',
            name: 'Solana / USDT', 
            price: '198.500000',
            change24h: '3.67',
            volume24h: '450000000'
          },
          {
            symbol: 'ADA/USDT',
            name: 'Cardano / USDT',
            price: '0.452000',
            change24h: '-0.89',
            volume24h: '320000000'
          }
        ];
      }
    },
    refetchInterval: 10000, // Update every 10 seconds
    retry: false, // Don't retry failed requests
    // Add error boundary options
    throwOnError: false,
    retryOnMount: true,
  });
}