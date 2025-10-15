import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shuffle,
  ArrowDown,
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DEXAggregatorProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface DEXRoute {
  dex: string;
  logo: string;
  price: number;
  slippage: number;
  gasEstimate: number;
  impact: number;
  route: string[];
}

interface Trade {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  dex: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  txHash?: string;
}

export default function DEXAggregator({ userTier = 'basic' }: DEXAggregatorProps) {
  const [fromToken, setFromToken] = useState<string>('USDT');
  const [toToken, setToToken] = useState<string>('ETH');
  const [amount, setAmount] = useState<string>('');
  const [routes, setRoutes] = useState<DEXRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<DEXRoute | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [slippageTolerance, setSlippageTolerance] = useState<string>('0.5');

  const { toast } = useToast();

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 2680 },
    { symbol: 'USDT', name: 'Tether', price: 1.00 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
    { symbol: 'BTC', name: 'Bitcoin', price: 43250 },
    { symbol: 'UNI', name: 'Uniswap', price: 8.5 },
    { symbol: 'LINK', name: 'Chainlink', price: 15.2 },
    { symbol: 'AAVE', name: 'Aave', price: 95 },
    { symbol: 'SUSHI', name: 'SushiSwap', price: 1.2 }
  ];

  const dexes = [
    { name: 'Uniswap V3', logo: '🦄', fee: 0.05, volume: '$45.2B' },
    { name: 'Uniswap V2', logo: '🦄', fee: 0.30, volume: '$12.8B' },
    { name: '1inch', logo: '🏹', fee: 0.00, volume: '$8.9B' },
    { name: 'SushiSwap', logo: '🍣', fee: 0.25, volume: '$6.7B' },
    { name: 'Curve', logo: '🌊', fee: 0.04, volume: '$5.4B' },
    { name: 'Balancer', logo: '⚖️', fee: 0.10, volume: '$2.1B' }
  ];

  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && fromToken !== toToken) {
      fetchRoutes();
    } else {
      setRoutes([]);
      setSelectedRoute(null);
    }
  }, [amount, fromToken, toToken]);

  const fetchRoutes = async () => {
    setIsLoadingRoutes(true);
    
    // Simulate API call to fetch routes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRoutes: DEXRoute[] = dexes.map((dex, index) => {
      const basePrice = getTokenPrice(toToken) / getTokenPrice(fromToken);
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const price = basePrice * (1 + variation);
      
      return {
        dex: dex.name,
        logo: dex.logo,
        price: price,
        slippage: 0.1 + Math.random() * 0.4, // 0.1% to 0.5%
        gasEstimate: 50000 + Math.random() * 100000,
        impact: Math.random() * 0.3, // 0% to 0.3%
        route: Math.random() > 0.7 ? [fromToken, 'USDC', toToken] : [fromToken, toToken]
      };
    }).sort((a, b) => b.price - a.price);

    setRoutes(mockRoutes);
    setSelectedRoute(mockRoutes[0]);
    setIsLoadingRoutes(false);
  };

  const getTokenPrice = (symbol: string): number => {
    return tokens.find(t => t.symbol === symbol)?.price || 1;
  };

  const executeSwap = async () => {
    if (!selectedRoute || !amount) return;

    const newTrade: Trade = {
      id: Date.now().toString(),
      fromToken,
      toToken,
      fromAmount: parseFloat(amount),
      toAmount: parseFloat(amount) * selectedRoute.price,
      dex: selectedRoute.dex,
      status: 'pending',
      timestamp: new Date(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    setTrades(prev => [newTrade, ...prev]);

    toast({
      title: "Swap Initiated",
      description: `Swapping ${amount} ${fromToken} for ${toToken} on ${selectedRoute.dex}`,
      variant: "default"
    });

    // Simulate transaction completion
    setTimeout(() => {
      setTrades(prev => prev.map(trade => 
        trade.id === newTrade.id ? { ...trade, status: 'completed' } : trade
      ));
      
      toast({
        title: "Swap Completed",
        description: `Successfully swapped ${amount} ${fromToken} for ${(parseFloat(amount) * selectedRoute.price).toFixed(4)} ${toToken}`,
        variant: "default"
      });
    }, 3000);

    setAmount('');
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DEX Aggregator
          </h1>
          <p className="text-gray-300">
            Find the best prices across all decentralized exchanges
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Swap Interface */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shuffle className="w-5 h-5 text-purple-400" />
                <span>Token Swap</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Token */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
                <div className="flex space-x-2">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== toToken).map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-white/5 border-white/10"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  ≈ ${amount ? (parseFloat(amount) * getTokenPrice(fromToken)).toFixed(2) : '0.00'}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapTokens}
                  className="rounded-full p-2 bg-white/10 hover:bg-white/20"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">To</label>
                <div className="flex space-x-2">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.filter(t => t.symbol !== fromToken).map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-md">
                    {selectedRoute && amount ? 
                      (parseFloat(amount) * selectedRoute.price).toFixed(4) : '0.00'
                    }
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  ≈ ${selectedRoute && amount ? 
                    (parseFloat(amount) * selectedRoute.price * getTokenPrice(toToken)).toFixed(2) : '0.00'
                  }
                </div>
              </div>

              {/* Slippage Tolerance */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Slippage Tolerance</label>
                <div className="flex space-x-2">
                  {['0.1', '0.5', '1.0'].map((tolerance) => (
                    <Button
                      key={tolerance}
                      variant={slippageTolerance === tolerance ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSlippageTolerance(tolerance)}
                      className="flex-1"
                    >
                      {tolerance}%
                    </Button>
                  ))}
                  <Input
                    type="number"
                    step="0.1"
                    value={slippageTolerance}
                    onChange={(e) => setSlippageTolerance(e.target.value)}
                    className="w-20 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              {/* Route Information */}
              {selectedRoute && (
                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Best Route</span>
                    <span>{selectedRoute.dex} {selectedRoute.logo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price Impact</span>
                    <span className={selectedRoute.impact > 0.1 ? 'text-yellow-400' : 'text-green-400'}>
                      {selectedRoute.impact.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Gas</span>
                    <span>${(selectedRoute.gasEstimate * 0.00001 * getTokenPrice('ETH')).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Route: {selectedRoute.route.join(' → ')}
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <Button
                onClick={executeSwap}
                disabled={!selectedRoute || !amount || parseFloat(amount) <= 0 || isLoadingRoutes}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoadingRoutes ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Finding Best Route...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-4 h-4 mr-2" />
                    Swap Tokens
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Routes Comparison */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Best Routes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRoutes ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-400" />
                  <p>Finding best routes...</p>
                </div>
              ) : routes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter amount to see routes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {routes.map((route, index) => (
                    <motion.div
                      key={route.dex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedRoute?.dex === route.dex 
                          ? 'border-purple-500/50 bg-purple-500/20' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{route.logo}</span>
                          <span className="font-medium">{route.dex}</span>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-500 text-white">
                              Best
                            </Badge>
                          )}
                        </div>
                        <span className="font-bold text-green-400">
                          {amount ? (parseFloat(amount) * route.price).toFixed(4) : '0'} {toToken}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                        <div>
                          <div>Impact: {route.impact.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div>Slippage: {route.slippage.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div>Gas: ${(route.gasEstimate * 0.00001 * getTokenPrice('ETH')).toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        {route.route.join(' → ')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Recent Swaps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Shuffle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No swaps yet</p>
                  <p className="text-sm">Your swap history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trades.map((trade) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(trade.status)}
                          <span className="font-medium">
                            {trade.fromAmount} {trade.fromToken} → {trade.toAmount.toFixed(4)} {trade.toToken}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {trade.dex}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{trade.timestamp.toLocaleString()}</span>
                        {trade.txHash && (
                          <span className="font-mono">
                            {trade.txHash.slice(0, 10)}...{trade.txHash.slice(-8)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}