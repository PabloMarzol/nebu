import { Button } from "@/components/ui/button";
import { useMarketData } from "@/hooks/use-market-data";
import { Link } from "wouter";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana, SiCardano, SiBinance, SiRipple, SiDogecoin, SiPolygon, SiChainlink, SiLitecoin } from "react-icons/si";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";

interface MarketTableProps {
  searchTerm: string;
  category: string;
}

const getCoinIcon = (symbol: string) => {
  switch (symbol.split("/")[0]) {
    case "BTC": return FaBitcoin;
    case "ETH": return FaEthereum;
    case "SOL": return SiSolana;
    case "ADA": return SiCardano;
    case "BNB": return SiBinance;
    case "XRP": return SiRipple;
    case "DOGE": return SiDogecoin;
    case "MATIC": return SiPolygon;
    case "LINK": return SiChainlink;
    case "UNI": return Coins;
    case "LTC": return SiLitecoin;
    default: return Coins;
  }
};

const getCoinColor = (symbol: string) => {
  switch (symbol.split("/")[0]) {
    case "BTC": return "text-orange-500";
    case "ETH": return "text-blue-500";
    case "SOL": return "text-purple-500";
    case "ADA": return "text-blue-400";
    case "BNB": return "text-yellow-500";
    case "XRP": return "text-blue-600";
    case "DOGE": return "text-yellow-400";
    case "MATIC": return "text-purple-400";
    case "AVAX": return "text-red-500";
    case "DOT": return "text-pink-500";
    case "LINK": return "text-blue-600";
    case "UNI": return "text-pink-400";
    case "LTC": return "text-gray-400";
    case "ATOM": return "text-purple-600";
    case "ICP": return "text-orange-400";
    case "NEAR": return "text-green-400";
    case "FTM": return "text-blue-400";
    case "ALGO": return "text-black";
    case "VET": return "text-blue-500";
    case "HBAR": return "text-purple-500";
    case "SAND": return "text-yellow-600";
    case "MANA": return "text-red-400";
    case "APE": return "text-blue-500";
    case "AXS": return "text-blue-600";
    case "GALA": return "text-green-500";
    case "ENJ": return "text-purple-400";
    default: return "text-gray-500";
  }
};

export default function MarketTable({ searchTerm, category }: MarketTableProps) {
  const { data: markets, isLoading } = useMarketData();

  // Static fallback data for when API fails
  const staticMarkets = [
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

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise use static fallback
  const displayMarkets = markets && markets.length > 0 ? markets : staticMarkets;

  const filteredMarkets = displayMarkets?.filter((market) => {
    const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-muted-foreground text-sm">Market</th>
            <th className="text-right py-3 px-4 text-muted-foreground text-sm">Last Price</th>
            <th className="text-right py-3 px-4 text-muted-foreground text-sm">24h Change</th>
            <th className="text-right py-3 px-4 text-muted-foreground text-sm">24h Volume</th>
            <th className="text-right py-3 px-4 text-muted-foreground text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMarkets?.map((market) => {
            const IconComponent = getCoinIcon(market.symbol);
            const iconColor = getCoinColor(market.symbol);
            const isPositiveChange = parseFloat(market.change24h) > 0;
            
            return (
              <tr key={market.symbol} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                      <IconComponent className="text-lg" />
                    </div>
                    <div>
                      <div className="font-semibold">{market.symbol}</div>
                      <div className="text-xs text-muted-foreground">{market.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-mono font-semibold">
                  ${market.price}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`font-medium flex items-center justify-end ${
                    isPositiveChange ? "text-green-400" : "text-red-400"
                  }`}>
                    {isPositiveChange ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {isPositiveChange ? "+" : ""}{market.change24h}%
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-mono">
                  ${parseInt(market.volume24h).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <Link href="/trading">
                    <Button className="bg-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-pink))] text-sm font-medium transition-colors">
                      Trade
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
