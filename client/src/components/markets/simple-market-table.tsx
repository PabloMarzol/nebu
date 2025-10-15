import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  volume24h: string;
}

// Always-available market data
const STATIC_MARKET_DATA: MarketItem[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: "64,889.45",
    change24h: "2.34",
    volume24h: "2847362891"
  },
  {
    symbol: "ETH/USDT", 
    name: "Ethereum",
    price: "3,201.78",
    change24h: "1.89",
    volume24h: "1456782345"
  },
  {
    symbol: "SOL/USDT",
    name: "Solana", 
    price: "198.32",
    change24h: "-2.45",
    volume24h: "892456123"
  },
  {
    symbol: "ADA/USDT",
    name: "Cardano",
    price: "0.89",
    change24h: "3.12",
    volume24h: "456789234"
  },
  {
    symbol: "DOT/USDT", 
    name: "Polkadot",
    price: "8.94",
    change24h: "1.67",
    volume24h: "234567891"
  },
  {
    symbol: "LINK/USDT",
    name: "Chainlink", 
    price: "24.58",
    change24h: "-1.23",
    volume24h: "345678912"
  },
  {
    symbol: "MATIC/USDT",
    name: "Polygon",
    price: "1.23",
    change24h: "4.56",
    volume24h: "567891234"
  },
  {
    symbol: "UNI/USDT",
    name: "Uniswap",
    price: "12.45",
    change24h: "2.78",
    volume24h: "123456789"
  },
  {
    symbol: "AAVE/USDT",
    name: "Aave", 
    price: "287.34",
    change24h: "-0.89",
    volume24h: "98765432"
  }
];

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
  const filteredMarkets = STATIC_MARKET_DATA.filter((market) => {
    const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
        <div className="col-span-3">Asset</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">24h Change</div>
        <div className="col-span-3 text-right">Volume</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      {filteredMarkets.map((market) => (
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