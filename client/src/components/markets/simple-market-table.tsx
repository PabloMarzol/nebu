import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  volume24h: string;
}

// Real-time market data from Hyperliquid API with persistent state
const useMarketData = () => {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulData, setLastSuccessfulData] = useState<MarketItem[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/markets');
        
        if (!response.ok) {
          // Check if it's a rate limiting error (429)
          if (response.status === 429) {
            console.warn('Market data temporarily unavailable due to rate limiting');
            setError('Market data updating... please wait');
            // Keep existing data during rate limiting
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // Transform Hyperliquid data to our format
          const transformedData: MarketItem[] = data.data.map((item: any) => ({
            symbol: item.symbol,
            name: item.symbol.split('/')[0], // Extract base currency name
            price: item.price.toString(),
            change24h: item.change24h.toString(),
            volume24h: item.volume.toString()
          }));
          
          setMarkets(transformedData);
          setLastSuccessfulData(transformedData); // Store successful data
          setError(null); // Clear any previous errors
        } else if (data.success && data.data && data.data.length === 0) {
          // Empty data but successful response - keep existing data
          console.warn('Market data empty but successful response');
          setError('Market data temporarily unavailable');
        } else {
          throw new Error('Invalid market data format');
        }
      } catch (err) {
        console.error('Error fetching market data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
        
        // Only set error message, keep existing data
        setError(errorMessage);
        
        // If we have no data at all, show a message but don't clear markets
        if (lastSuccessfulData.length === 0) {
          setError('Connecting to Hyperliquid markets...');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh data every 30 seconds for live updates
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, [lastSuccessfulData.length]);

  return { markets: markets.length > 0 ? markets : lastSuccessfulData, loading, error };
};

const formatVolume = (volume: string) => {
  const num = parseFloat(volume);
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const getPriceChangeColor = (change: string) => {
  const changeNum = parseFloat(change);
  if (changeNum > 0) return "text-green-500";
  if (changeNum < 0) return "text-red-500";
  return "text-gray-500";
};

const getPriceChangeIcon = (change: string) => {
  const changeNum = parseFloat(change);
  if (changeNum > 0) return <TrendingUp className="w-4 h-4" />;
  if (changeNum < 0) return <TrendingDown className="w-4 h-4" />;
  return null;
};

interface SimpleMarketTableProps {
  searchTerm: string;
}

export default function SimpleMarketTable({ searchTerm }: SimpleMarketTableProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { markets, loading, error } = useMarketData();

  const handleTrade = (symbol: string) => {
    toast({
      title: "Trade Initiated",
      description: `Opening trading interface for ${symbol}`,
    });
    
    // Navigate to trading page with the selected pair
    setTimeout(() => {
      setLocation('/trading');
    }, 1000);
  };

  // Filter markets based on search term
  const filteredMarkets = markets.filter((market: MarketItem) => {
    const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg border">
              <div className="col-span-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-2 h-4 bg-muted rounded animate-pulse"></div>
              <div className="col-span-2 h-4 bg-muted rounded animate-pulse"></div>
              <div className="col-span-3 h-4 bg-muted rounded animate-pulse"></div>
              <div className="col-span-2 h-8 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-4">Loading live market data from Hyperliquid...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <p className="font-medium">Failed to load market data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <p className="text-muted-foreground">Using live data from Hyperliquid API</p>
      </div>
    );
  }

  // Show no data state
  if (markets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No market data available</p>
        <p className="text-sm text-muted-foreground mt-2">Connecting to Hyperliquid markets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
        <div className="col-span-3">Asset</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">24h Change</div>
        <div className="col-span-3 text-right">Volume</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      {filteredMarkets.map((market: MarketItem) => (
        <div key={market.symbol} className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg border hover:bg-accent/50 transition-colors">
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {market.symbol.split('/')[0].charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium">{market.symbol}</div>
                <div className="text-sm text-muted-foreground">{market.name}</div>
              </div>
            </div>
          </div>

          <div className="col-span-2 text-right">
            <div className="font-medium">${market.price}</div>
          </div>

          <div className="col-span-2 text-right">
            <div className={`flex items-center justify-end space-x-1 ${getPriceChangeColor(market.change24h)}`}>
              {getPriceChangeIcon(market.change24h)}
              <span className="font-medium">{market.change24h}%</span>
            </div>
          </div>

          <div className="col-span-3 text-right">
            <div className="text-muted-foreground">{formatVolume(market.volume24h)}</div>
          </div>

          <div className="col-span-2 text-center">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleTrade(market.symbol)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Trade
            </Button>
          </div>
        </div>
      ))}

      {filteredMarkets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No markets found matching your search.
        </div>
      )}
    </div>
  );
}
