import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  DollarSign,
  Clock,
  Users,
  Shield,
  ArrowRightLeft,
  Calculator,
  Globe,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  LineChart,
  PieChart,
  Layers
} from "lucide-react";
import FuturisticBackground from "./futuristic-background";

export default function OTCTradingInterface() {
  const [orderData, setOrderData] = useState({
    asset: "BTC",
    amount: "",
    side: "buy",
    orderType: "market",
    price: ""
  });

  interface MarketDataItem {
    price: number;
    change: number;
    volume: string;
    liquidity: string;
  }

  interface MarketDataState {
    [key: string]: MarketDataItem;
  }

  const [marketData, setMarketData] = useState<MarketDataState>({
    BTC: { price: 67420.35, change: 2.34, volume: "2.4B", liquidity: "High" },
    ETH: { price: 3824.17, change: -1.12, volume: "1.8B", liquidity: "High" },
    SOL: { price: 198.45, change: 5.67, volume: "450M", liquidity: "Medium" },
    ADA: { price: 0.58, change: 3.21, volume: "280M", liquidity: "Medium" },
    DOT: { price: 7.89, change: -0.45, volume: "180M", liquidity: "Medium" }
  });

  const [orderBook, setOrderBook] = useState({
    bids: [
      { price: 67415.20, amount: 2.5, total: 168537.5 },
      { price: 67410.80, amount: 1.8, total: 121339.44 },
      { price: 67405.15, amount: 3.2, total: 215696.48 },
      { price: 67400.00, amount: 4.1, total: 276340.00 },
      { price: 67395.30, amount: 2.7, total: 182067.31 }
    ],
    asks: [
      { price: 67425.50, amount: 1.9, total: 128208.45 },
      { price: 67430.20, amount: 2.3, total: 155089.46 },
      { price: 67435.80, amount: 1.6, total: 107897.28 },
      { price: 67440.15, amount: 3.4, total: 229296.51 },
      { price: 67445.90, amount: 2.8, total: 188848.52 }
    ]
  });

  const [activeDeals, setActiveDeals] = useState([
    { id: "OTC-001", asset: "BTC", amount: "50.00", value: "$3,371,017.50", status: "negotiating", counterparty: "Goldman Sachs Digital", time: "15 min" },
    { id: "OTC-002", asset: "ETH", amount: "2,500.00", value: "$9,560,425.00", status: "pending", counterparty: "Coinbase Institutional", time: "32 min" },
    { id: "OTC-003", asset: "SOL", amount: "15,000.00", value: "$2,976,750.00", status: "executing", counterparty: "Binance OTC", time: "8 min" },
    { id: "OTC-004", asset: "USDT", amount: "25,000,000.00", value: "$25,000,000.00", status: "completed", counterparty: "Circle Financial", time: "2 hours" }
  ]);

  const [priceAlert, setPriceAlert] = useState({
    show: false,
    message: "",
    type: "info"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time market data updates
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const change = (Math.random() - 0.5) * 2;
          updated[symbol].price += change;
          updated[symbol].change += (Math.random() - 0.5) * 0.1;
        });
        return updated;
      });

      // Simulate order book updates
      setOrderBook(prev => ({
        bids: prev.bids.map(bid => ({
          ...bid,
          price: bid.price + (Math.random() - 0.5) * 5,
          amount: bid.amount + (Math.random() - 0.5) * 0.5
        })),
        asks: prev.asks.map(ask => ({
          ...ask,
          price: ask.price + (Math.random() - 0.5) * 5,
          amount: ask.amount + (Math.random() - 0.5) * 0.5
        }))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number, decimals = 2) => 
    new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-500/20";
      case "executing": return "text-blue-400 bg-blue-500/20";
      case "pending": return "text-yellow-400 bg-yellow-500/20";
      case "negotiating": return "text-purple-400 bg-purple-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "executing": return <Activity className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "negotiating": return <Users className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const handleOrderSubmit = () => {
    if (!orderData.amount) {
      setPriceAlert({
        show: true,
        message: "Please enter an amount",
        type: "warning"
      });
      setTimeout(() => setPriceAlert({ show: false, message: "", type: "info" }), 3000);
      return;
    }

    const estimatedValue = parseFloat(orderData.amount) * (marketData[orderData.asset]?.price || 0);
    setPriceAlert({
      show: true,
      message: `Order submitted: ${orderData.side.toUpperCase()} ${orderData.amount} ${orderData.asset} ≈ ${formatCurrency(estimatedValue)}`,
      type: "success"
    });
    setTimeout(() => setPriceAlert({ show: false, message: "", type: "info" }), 5000);
  };

  return (
    <div className="relative min-h-screen">
      <FuturisticBackground />
      
      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Professional Trading Interface
            </h1>
            <p className="text-muted-foreground">Execute large-scale cryptocurrency transactions with institutional precision</p>
          </div>
          
          {priceAlert.show && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              priceAlert.type === "success" ? "bg-green-500/20 border-green-500/30 text-green-400" :
              priceAlert.type === "warning" ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" :
              "bg-blue-500/20 border-blue-500/30 text-blue-400"
            }`}>
              {priceAlert.type === "success" && <CheckCircle2 className="w-4 h-4" />}
              {priceAlert.type === "warning" && <AlertTriangle className="w-4 h-4" />}
              {priceAlert.type === "info" && <Info className="w-4 h-4" />}
              <span className="text-sm">{priceAlert.message}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Market Overview */}
          <div className="xl:col-span-8">
            <Card className="glass border-0 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <LineChart className="w-5 h-5 text-blue-400" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(marketData).map(([symbol, data]) => (
                    <div key={symbol} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-purple-400">{symbol}</span>
                        {data.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-white">{formatCurrency(data.price)}</div>
                        <div className="flex items-center justify-between text-sm">
                          <Badge className={`${data.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0 text-xs`}>
                            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                          </Badge>
                          <span className="text-gray-400">Vol: {data.volume}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${data.liquidity === 'High' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <span className="text-xs text-gray-400">{data.liquidity} Liquidity</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Interface */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  OTC Order Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="spot" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
                    <TabsTrigger value="spot" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Spot Trading</TabsTrigger>
                    <TabsTrigger value="block" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">Block Trading</TabsTrigger>
                    <TabsTrigger value="rfq" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">RFQ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="spot" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300 mb-2 block">Asset</Label>
                            <Select value={orderData.asset} onValueChange={(value) => setOrderData({...orderData, asset: value})}>
                              <SelectTrigger className="bg-gray-900/50 border-gray-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                <SelectItem value="SOL">Solana (SOL)</SelectItem>
                                <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                                <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-gray-300 mb-2 block">Side</Label>
                            <Select value={orderData.side} onValueChange={(value) => setOrderData({...orderData, side: value})}>
                              <SelectTrigger className="bg-gray-900/50 border-gray-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                <SelectItem value="buy">Buy</SelectItem>
                                <SelectItem value="sell">Sell</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-gray-300 mb-2 block">Amount</Label>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={orderData.amount}
                            onChange={(e) => setOrderData({...orderData, amount: e.target.value})}
                            className="bg-gray-900/50 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300 mb-2 block">Order Type</Label>
                          <Select value={orderData.orderType} onValueChange={(value) => setOrderData({...orderData, orderType: value})}>
                            <SelectTrigger className="bg-gray-900/50 border-gray-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              <SelectItem value="market">Market Order</SelectItem>
                              <SelectItem value="limit">Limit Order</SelectItem>
                              <SelectItem value="block">Block Trade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {orderData.orderType === "limit" && (
                          <div>
                            <Label className="text-gray-300 mb-2 block">Price</Label>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              value={orderData.price}
                              onChange={(e) => setOrderData({...orderData, price: e.target.value})}
                              className="bg-gray-900/50 border-gray-700 text-white"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                          <h4 className="font-semibold text-white mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Asset:</span>
                              <span className="text-white">{orderData.asset}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Side:</span>
                              <span className={orderData.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                {orderData.side.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount:</span>
                              <span className="text-white">{orderData.amount || '0'} {orderData.asset}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Market Price:</span>
                              <span className="text-white">{formatCurrency(marketData[orderData.asset]?.price || 0)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-700 pt-2">
                              <span className="text-gray-400">Est. Value:</span>
                              <span className="text-purple-400 font-semibold">
                                {formatCurrency((parseFloat(orderData.amount) || 0) * (marketData[orderData.asset]?.price || 0))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={handleOrderSubmit}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Submit OTC Order
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="block" className="space-y-4">
                    <div className="text-center py-8">
                      <Layers className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Block Trading</h3>
                      <p className="text-gray-400 mb-6">Execute large-volume trades with minimal market impact</p>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <Calculator className="w-4 h-4 mr-2" />
                        Request Block Quote
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="rfq" className="space-y-4">
                    <div className="text-center py-8">
                      <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Request for Quote</h3>
                      <p className="text-gray-400 mb-6">Get custom pricing for specific trading requirements</p>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Submit RFQ
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Book & Active Deals */}
          <div className="xl:col-span-4 space-y-6">
            {/* Order Book */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Order Book - {orderData.asset}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Asks */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Asks</h4>
                    <div className="space-y-1">
                      {orderBook.asks.slice().reverse().map((ask, index) => (
                        <div key={index} className="flex justify-between text-xs bg-red-500/5 p-2 rounded">
                          <span className="text-red-400">{formatNumber(ask.price)}</span>
                          <span className="text-gray-400">{formatNumber(ask.amount, 3)}</span>
                          <span className="text-gray-300">{formatNumber(ask.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spread */}
                  <div className="text-center py-2 border-y border-gray-700">
                    <span className="text-purple-400 font-semibold">
                      Spread: {formatCurrency(orderBook.asks[0].price - orderBook.bids[0].price)}
                    </span>
                  </div>

                  {/* Bids */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Bids</h4>
                    <div className="space-y-1">
                      {orderBook.bids.map((bid, index) => (
                        <div key={index} className="flex justify-between text-xs bg-green-500/5 p-2 rounded">
                          <span className="text-green-400">{formatNumber(bid.price)}</span>
                          <span className="text-gray-400">{formatNumber(bid.amount, 3)}</span>
                          <span className="text-gray-300">{formatNumber(bid.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Deals */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Active OTC Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeDeals.map((deal) => (
                    <div key={deal.id} className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-purple-400">{deal.id}</span>
                        <Badge className={getStatusColor(deal.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(deal.status)}
                            <span className="text-xs">{deal.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Asset:</span>
                          <span className="text-white">{deal.amount} {deal.asset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Value:</span>
                          <span className="text-green-400">{deal.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Counterparty:</span>
                          <span className="text-white text-right">{deal.counterparty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time:</span>
                          <span className="text-gray-300">{deal.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}