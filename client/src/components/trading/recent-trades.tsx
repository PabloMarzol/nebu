import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";

interface RecentTradesProps {
  symbol: string;
}

interface Trade {
  time: string;
  price: string;
  amount: string;
  side: "buy" | "sell";
}

export default function RecentTrades({ symbol }: RecentTradesProps) {
  const { data: trades } = useQuery({
    queryKey: [`/api/trades/${symbol.replace("/", "")}`],
    refetchInterval: 2000,
  });

  // Mock trade data for display
  const mockTrades: Trade[] = [
    { time: "14:32:45", price: "67,834.50", amount: "0.0234", side: "buy" },
    { time: "14:32:41", price: "67,830.25", amount: "0.1567", side: "sell" },
    { time: "14:32:38", price: "67,835.00", amount: "0.0892", side: "buy" },
    { time: "14:32:35", price: "67,828.75", amount: "0.0445", side: "sell" },
    { time: "14:32:32", price: "67,832.00", amount: "0.2134", side: "buy" },
    { time: "14:32:29", price: "67,829.50", amount: "0.0789", side: "sell" },
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <History className="mr-2 h-5 w-5 text-[hsl(var(--accent-purple))]" />
          Recent Trades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground border-b border-border pb-2">
            <span>Time</span>
            <span>Price</span>
            <span>Amount</span>
            <span>Side</span>
          </div>
          
          {mockTrades.map((trade, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 text-xs font-mono">
              <span className="text-muted-foreground">{trade.time}</span>
              <span className="text-foreground">{trade.price}</span>
              <span className="text-muted-foreground">{trade.amount}</span>
              <span className={trade.side === "buy" ? "text-green-400" : "text-red-400"}>
                {trade.side.charAt(0).toUpperCase() + trade.side.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
