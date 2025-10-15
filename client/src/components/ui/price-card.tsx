import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana, SiCardano } from "react-icons/si";

interface Market {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  volume24h: string;
  icon: string;
}

interface PriceCardProps {
  market: Market;
}

const getCoinIcon = (iconName: string) => {
  switch (iconName) {
    case "bitcoin": return FaBitcoin;
    case "ethereum": return FaEthereum;
    case "solana": return SiSolana;
    case "cardano": return SiCardano;
    default: return FaBitcoin;
  }
};

const getCoinColor = (iconName: string) => {
  switch (iconName) {
    case "bitcoin": return "text-orange-500";
    case "ethereum": return "text-blue-500";
    case "solana": return "text-purple-500";
    case "cardano": return "text-blue-400";
    default: return "text-gray-500";
  }
};

export default function PriceCard({ market }: PriceCardProps) {
  const IconComponent = getCoinIcon(market.icon);
  const iconColor = getCoinColor(market.icon);
  const isPositiveChange = parseFloat(market.change24h) > 0;

  return (
    <Card className="bg-muted hover:bg-muted/70 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconColor}`}>
              <IconComponent className="text-sm" />
            </div>
            <span className="font-mono font-semibold text-sm">{market.symbol}</span>
          </div>
          <span className={`text-sm font-medium flex items-center ${
            isPositiveChange ? "text-green-400" : "text-red-400"
          }`}>
            {isPositiveChange ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {isPositiveChange ? "+" : ""}{market.change24h}%
          </span>
        </div>
        <div className="font-mono text-lg font-bold mb-1">${market.price}</div>
        <div className="text-muted-foreground text-sm font-mono">
          Vol: ${(parseInt(market.volume24h) / 1000000).toFixed(0)}M
        </div>
      </CardContent>
    </Card>
  );
}
