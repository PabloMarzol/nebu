import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookProps {
  symbol: string;
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const [orderBookData, setOrderBookData] = useState({
    bids: [] as OrderBookEntry[],
    asks: [] as OrderBookEntry[],
    spread: 0
  });

  // Fetch market data to get current price for generating realistic order book
  const { data: marketsResponse } = useQuery({
    queryKey: ['/api/markets'],
    refetchInterval: 1000,
  });

  const markets = marketsResponse?.data || marketsResponse || [];
  
  // Find current symbol data
  const symbolData = markets.find((market: any) => {
    if (!market || !market.symbol) return false;
    const marketSymbol = market.symbol.toLowerCase();
    const targetSymbol = symbol.toLowerCase();
    return marketSymbol === targetSymbol || 
           marketSymbol.replace('/', '') === targetSymbol.replace('/', '');
  });

  const currentPrice = symbolData ? parseFloat(symbolData.price) : 50000;

  // Generate realistic order book data
  useEffect(() => {
    if (currentPrice <= 0) return;

    const generateOrderBook = () => {
      const bids: OrderBookEntry[] = [];
      const asks: OrderBookEntry[] = [];
      
      // Generate bids (buy orders) - below current price
      for (let i = 1; i <= 10; i++) {
        const priceOffset = (i * 0.001 + Math.random() * 0.002) * currentPrice; // 0.1-0.3% below
        const price = currentPrice - priceOffset;
        const amount = 0.1 + Math.random() * 2; // Random amount between 0.1 and 2.1
        const total = price * amount;
        
        bids.push({
          price: parseFloat(price.toFixed(2)),
          amount: parseFloat(amount.toFixed(4)),
          total: parseFloat(total.toFixed(2))
        });
      }

      // Generate asks (sell orders) - above current price  
      for (let i = 1; i <= 10; i++) {
        const priceOffset = (i * 0.001 + Math.random() * 0.002) * currentPrice; // 0.1-0.3% above
        const price = currentPrice + priceOffset;
        const amount = 0.1 + Math.random() * 2; // Random amount between 0.1 and 2.1
        const total = price * amount;
        
        asks.push({
          price: parseFloat(price.toFixed(2)),
          amount: parseFloat(amount.toFixed(4)),
          total: parseFloat(total.toFixed(2))
        });
      }

      // Sort bids (highest price first) and asks (lowest price first)
      bids.sort((a, b) => b.price - a.price);
      asks.sort((a, b) => a.price - b.price);

      const spread = asks[0]?.price - bids[0]?.price || 0;

      setOrderBookData({
        bids,
        asks, 
        spread: parseFloat(spread.toFixed(2))
      });
    };

    generateOrderBook();
    
    // Update order book every 3 seconds
    const interval = setInterval(generateOrderBook, 3000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatAmount = (amount: number) => amount.toFixed(4);
  const formatTotal = (total: number) => total.toFixed(2);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Order Book</span>
          <span className="text-sm font-normal text-muted-foreground">
            {symbol}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 p-4">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
          <span>Price (USDT)</span>
          <span className="text-right">Amount (BTC)</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          {orderBookData.asks.slice(0, 5).reverse().map((ask, index) => (
            <div 
              key={`ask-${index}`} 
              className="grid grid-cols-3 gap-4 text-xs py-1 hover:bg-red-500/5 rounded transition-colors"
            >
              <span className="text-red-500 font-mono">{formatPrice(ask.price)}</span>
              <span className="text-right font-mono text-muted-foreground">{formatAmount(ask.amount)}</span>
              <span className="text-right font-mono text-muted-foreground">{formatTotal(ask.total)}</span>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="flex justify-center py-2 border-y border-border">
          <span className="text-sm font-medium">
            Spread: ${orderBookData.spread.toFixed(2)}
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          {orderBookData.bids.slice(0, 5).map((bid, index) => (
            <div 
              key={`bid-${index}`} 
              className="grid grid-cols-3 gap-4 text-xs py-1 hover:bg-green-500/5 rounded transition-colors"
            >
              <span className="text-green-500 font-mono">{formatPrice(bid.price)}</span>
              <span className="text-right font-mono text-muted-foreground">{formatAmount(bid.amount)}</span>
              <span className="text-right font-mono text-muted-foreground">{formatTotal(bid.total)}</span>
            </div>
          ))}
        </div>

        {/* Loading state when no data */}
        {orderBookData.bids.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-pulse">Loading...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}