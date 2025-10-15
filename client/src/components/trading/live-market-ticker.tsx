import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LivePriceWithChangeProps {
  symbol: string;
  className?: string;
}

export function LivePriceWithChange({ symbol, className }: LivePriceWithChangeProps) {
  // Fetch live market data
  const { data: markets, isLoading } = useQuery({
    queryKey: ['/api/markets'],
    refetchInterval: 1000, // Update every 5 seconds
  });

  // Find symbol data with proper error handling
  const symbolData = (() => {
    if (!markets?.data || !Array.isArray(markets.data)) return null;
    
    return markets.data.find((market: any) => {
      // Try exact match first
      if (market.symbol === symbol) return true;
      
      // Try normalized match (remove slashes)
      const normalizedSymbol = symbol.replace('/', '');
      const normalizedMarketSymbol = market.symbol.replace('/', '');
      
      return normalizedMarketSymbol === normalizedSymbol;
    });
  })();

  if (isLoading) {
    return (
      <div className={className}>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">{symbol}</div>
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!symbolData) {
    return (
      <div className={className}>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">{symbol}</div>
          <div className="text-lg font-semibold">No Data</div>
        </div>
      </div>
    );
  }

  const price = parseFloat(symbolData.price) || 0;
  const change = parseFloat(symbolData.change24h) || 0;
  const isPositive = change >= 0;

  return (
    <div className={className}>
      <div className="text-center space-y-1">
        <div className="text-sm text-muted-foreground font-medium">
          {symbol}
        </div>
        <div className="text-lg font-bold text-white">
          ${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
          })}
        </div>
        <div className={`flex items-center justify-center text-sm ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}