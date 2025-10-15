import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Layers,
  Globe,
  DollarSign,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Zap,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MultiChainPortfolioProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface ChainBalance {
  chain: string;
  chainId: number;
  symbol: string;
  color: string;
  nativeToken: string;
  totalValue: number;
  assets: Array<{
    token: string;
    balance: number;
    value: number;
    price: number;
  }>;
}

export default function MultiChainPortfolio({ userTier = 'basic' }: MultiChainPortfolioProps) {
  const [balances, setBalances] = useState<ChainBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const supportedChains: ChainBalance[] = [
    {
      chain: 'Ethereum',
      chainId: 1,
      symbol: 'ETH',
      color: '#627EEA',
      nativeToken: 'ETH',
      totalValue: 12450.75,
      assets: [
        { token: 'ETH', balance: 3.2, value: 8576, price: 2680 },
        { token: 'USDC', balance: 2850, value: 2850, price: 1.00 },
        { token: 'UNI', balance: 145, value: 1232.5, price: 8.5 }
      ]
    },
    {
      chain: 'BSC',
      chainId: 56,
      symbol: 'BNB',
      color: '#F3BA2F',
      nativeToken: 'BNB',
      totalValue: 8925.50,
      assets: [
        { token: 'BNB', balance: 18.5, value: 5827.5, price: 315 },
        { token: 'USDT', balance: 3098, value: 3098, price: 1.00 }
      ]
    },
    {
      chain: 'Polygon',
      chainId: 137,
      symbol: 'MATIC',
      color: '#8247E5',
      nativeToken: 'MATIC',
      totalValue: 4567.25,
      assets: [
        { token: 'MATIC', balance: 3850, value: 3272.5, price: 0.85 },
        { token: 'USDC', balance: 1294.75, value: 1294.75, price: 1.00 }
      ]
    },
    {
      chain: 'Avalanche',
      chainId: 43114,
      symbol: 'AVAX',
      color: '#E84142',
      nativeToken: 'AVAX',
      totalValue: 2890.80,
      assets: [
        { token: 'AVAX', balance: 45.2, value: 2890.8, price: 63.9 }
      ]
    },
    {
      chain: 'Solana',
      chainId: 101,
      symbol: 'SOL',
      color: '#9945FF',
      nativeToken: 'SOL',
      totalValue: 1960.00,
      assets: [
        { token: 'SOL', balance: 20, value: 1960, price: 98 }
      ]
    }
  ];

  useEffect(() => {
    setBalances(supportedChains);
    const total = supportedChains.reduce((sum, chain) => sum + chain.totalValue, 0);
    setTotalValue(total);
  }, []);

  const syncBalances = async () => {
    setIsLoading(true);
    // Simulate API calls to refresh balances
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const pieChartData = balances.map((chain) => ({
    name: chain.chain,
    value: chain.totalValue,
    color: chain.color
  }));

  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: totalValue * (0.95 + Math.random() * 0.1)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Multi-Chain Portfolio
          </h1>
          <p className="text-gray-300">
            Unified view across all supported blockchains
          </p>
        </motion.div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Portfolio</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <Layers className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{balances.length}</div>
              <div className="text-sm text-gray-400">Active Chains</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">
                {balances.reduce((sum, chain) => sum + chain.assets.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Assets</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold">+5.2%</div>
              <div className="text-sm text-gray-400">24h Change</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Allocation */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Chain Allocation</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={syncBalances}
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: any) => [
                        `$${Number(value).toLocaleString()}`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {balances.map((chain) => (
                  <div key={chain.chainId} className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: chain.color }}
                      />
                      <span className="font-medium">{chain.chain}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${chain.totalValue.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">
                        {((chain.totalValue / totalValue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Chain Breakdown */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Chain Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {balances.map((chain) => (
                  <motion.div
                    key={chain.chainId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: chain.color }}
                        >
                          {chain.symbol}
                        </div>
                        <span className="font-semibold">{chain.chain}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {chain.assets.length} assets
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xl font-bold">${chain.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Total Value</div>
                    </div>
                    
                    <div className="space-y-2">
                      {chain.assets.map((asset) => (
                        <div key={asset.token} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <div>
                            <div className="font-medium">{asset.token}</div>
                            <div className="text-xs text-gray-400">
                              {asset.balance.toLocaleString()} tokens
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${asset.value.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">
                              ${asset.price.toFixed(asset.price < 1 ? 4 : 2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Chain Allocation</span>
                        <span className="font-medium">
                          {((chain.totalValue / totalValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(chain.totalValue / totalValue) * 100} 
                        className="h-1 mt-1" 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}