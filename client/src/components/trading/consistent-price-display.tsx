import { useQuery } from "@tanstack/react-query";

interface ConsistentPriceDisplayProps {
  symbol: string;
  className?: string;
  showChange?: boolean;
  format?: "full" | "compact";
}

export default function ConsistentPriceDisplay({ 
  symbol, 
  className = "",
  showChange = false,
  format = "full"
}: ConsistentPriceDisplayProps) {
  // Single source of truth for live market data
  const { data: markets } = useQuery({
    queryKey: ['/api/markets'],
    refetchInterval: 5000,
    staleTime: 2000, // Prevent rapid refetching
  });

  const symbolData = Array.isArray(markets) ? markets.find((market: any) => market.symbol === symbol) : null;
  
  if (!symbolData) {
    return (
      <span className={`text-muted-foreground ${className}`}>
        Loading...
      </span>
    );
  }

  const price = parseFloat(symbolData.price);
  const change = parseFloat(symbolData.change24h);
  const isPositive = change >= 0;

  if (format === "compact") {
    return (
      <span className={className}>
        ${price.toLocaleString(undefined, { 
          minimumFractionDigits: price > 1 ? 2 : 6,
          maximumFractionDigits: price > 1 ? 2 : 6
        })}
      </span>
    );
  }

  return (
    <div className={className}>
      <span className="font-mono text-lg font-bold">
        ${price.toLocaleString(undefined, { 
          minimumFractionDigits: price > 1 ? 2 : 6,
          maximumFractionDigits: price > 1 ? 2 : 6
        })}
      </span>
      {showChange && (
        <span className={`ml-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      )}
    </div>
  );
}