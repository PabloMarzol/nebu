import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Volume2, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: Date;
}

export default function TradingTerminal() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  // Mock data for demo
  const mockOrderBook = {
    bids: [
      { price: 43250.50, amount: 0.5432, total: 23478.51 },
      { price: 43249.75, amount: 1.2341, total: 53389.02 },
      { price: 43248.00, amount: 0.8765, total: 37914.45 },
      { price: 43247.25, amount: 2.1234, total: 91834.76 },
      { price: 43246.50, amount: 0.3456, total: 14938.21 }
    ],
    asks: [
      { price: 43251.25, amount: 0.7654, total: 33109.87 },
      { price: 43252.00, amount: 1.4321, total: 61918.34 },
      { price: 43253.75, amount: 0.9876, total: 42721.89 },
      { price: 43254.50, amount: 1.8765, total: 81192.33 },
      { price: 43255.25, amount: 0.6543, total: 28298.45 }
    ]
  };

  const mockTrades: Trade[] = [
    { id: '1', price: 43251.25, amount: 0.1234, side: 'buy', timestamp: new Date() },
    { id: '2', price: 43250.50, amount: 0.5678, side: 'sell', timestamp: new Date() },
    { id: '3', price: 43252.00, amount: 0.2345, side: 'buy', timestamp: new Date() }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-[900px]">
      {/* Chart and Trading Pairs */}
      <div className="lg:col-span-2 space-y-4">
        {/* Trading Pair Selection */}
        <Card className="glass-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                    <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                    <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-2xl font-bold text-green-500">$43,251.25</div>
                <Badge className="bg-green-500/20 text-green-600">+2.34%</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div>24h High: $44,125.50</div>
                <div>24h Low: $42,850.25</div>
                <div>Volume: 15,432 BTC</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="glass-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Price Chart</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">1m</Button>
                <Button size="sm" variant="outline">5m</Button>
                <Button size="sm" variant="default">1h</Button>
                <Button size="sm" variant="outline">1d</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Advanced TradingView Chart</p>
                <p className="text-sm text-muted-foreground">Real-time candlestick data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card className="glass-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Recent Trades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <div>Price</div>
                <div>Amount</div>
                <div>Side</div>
                <div>Time</div>
              </div>
              {mockTrades.map((trade) => (
                <div key={trade.id} className="grid grid-cols-4 gap-4 text-sm">
                  <div className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    ${trade.price.toLocaleString()}
                  </div>
                  <div>{trade.amount.toFixed(4)}</div>
                  <div className="flex items-center space-x-1">
                    {trade.side === 'buy' ? (
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                    <span className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {trade.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {trade.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Book and Trading Panel */}
      <div className="space-y-4">
        {/* Order Book */}
        <Card className="glass-enhanced">
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {/* Asks */}
              <div className="px-4 py-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <div>Price</div>
                  <div>Amount</div>
                  <div>Total</div>
                </div>
                {mockOrderBook.asks.reverse().map((ask, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-red-500/10 cursor-pointer">
                    <div className="text-red-500 font-mono">{ask.price.toFixed(2)}</div>
                    <div className="font-mono">{ask.amount.toFixed(4)}</div>
                    <div className="text-muted-foreground font-mono">{ask.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Spread */}
              <div className="px-4 py-2 bg-muted/50 border-y">
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Spread: </span>
                  <span className="font-mono">$0.75 (0.002%)</span>
                </div>
              </div>

              {/* Bids */}
              <div className="px-4 py-2">
                {mockOrderBook.bids.map((bid, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-green-500/10 cursor-pointer">
                    <div className="text-green-500 font-mono">{bid.price.toFixed(2)}</div>
                    <div className="font-mono">{bid.amount.toFixed(4)}</div>
                    <div className="text-muted-foreground font-mono">{bid.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <Card className="glass-enhanced">
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Type and Side */}
            <div className="grid grid-cols-2 gap-2">
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant={side === 'buy' ? 'default' : 'outline'}
                  onClick={() => setSide('buy')}
                  className={side === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Buy
                </Button>
                <Button
                  variant={side === 'sell' ? 'default' : 'outline'}
                  onClick={() => setSide('sell')}
                  className={side === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Sell
                </Button>
              </div>
            </div>

            {/* Price Input */}
            {orderType !== 'market' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (USDT)</label>
                <Input
                  type="number"
                  placeholder="43,251.25"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (BTC)</label>
              <Input
                type="number"
                placeholder="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button size="sm" variant="outline" onClick={() => setAmount('0.25')}>25%</Button>
              <Button size="sm" variant="outline" onClick={() => setAmount('0.5')}>50%</Button>
              <Button size="sm" variant="outline" onClick={() => setAmount('0.75')}>75%</Button>
              <Button size="sm" variant="outline" onClick={() => setAmount('1.0')}>100%</Button>
            </div>

            {/* Total and Submit */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-mono">
                  {price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : '0.00'} USDT
                </span>
              </div>
              <Button
                className={`w-full ${
                  side === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {side === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}