import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Droplets, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface LiquidityPool {
  id: string;
  pair: string;
  totalLiquidity: number;
  volume24h: number;
  fees24h: number;
  apy: number;
  utilization: number;
  myStake: number;
  status: 'active' | 'paused' | 'deprecated';
}

interface MarketMaker {
  id: string;
  name: string;
  pairs: string[];
  spread: number;
  volume24h: number;
  uptime: number;
  status: 'active' | 'inactive';
  tier: 'premium' | 'standard' | 'basic';
}

export default function LiquidityManagement() {
  const [selectedPool, setSelectedPool] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  const liquidityPools: LiquidityPool[] = [
    {
      id: '1',
      pair: 'BTC/USDT',
      totalLiquidity: 12500000,
      volume24h: 8750000,
      fees24h: 17500,
      apy: 15.6,
      utilization: 87,
      myStake: 125000,
      status: 'active'
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      totalLiquidity: 8900000,
      volume24h: 6200000,
      fees24h: 12400,
      apy: 12.8,
      utilization: 73,
      myStake: 89000,
      status: 'active'
    },
    {
      id: '3',
      pair: 'SOL/USDT',
      totalLiquidity: 3400000,
      volume24h: 2100000,
      fees24h: 4200,
      apy: 18.9,
      utilization: 92,
      myStake: 0,
      status: 'active'
    }
  ];

  const marketMakers: MarketMaker[] = [
    {
      id: '1',
      name: 'Quantum Market Making',
      pairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
      spread: 0.02,
      volume24h: 15600000,
      uptime: 99.8,
      status: 'active',
      tier: 'premium'
    },
    {
      id: '2',
      name: 'Alpha Liquidity',
      pairs: ['SOL/USDT', 'ADA/USDT', 'DOT/USDT'],
      spread: 0.05,
      volume24h: 8900000,
      uptime: 98.5,
      status: 'active',
      tier: 'standard'
    }
  ];

  const totalLiquidity = liquidityPools.reduce((sum, pool) => sum + pool.totalLiquidity, 0);
  const totalVolume24h = liquidityPools.reduce((sum, pool) => sum + pool.volume24h, 0);
  const totalFees24h = liquidityPools.reduce((sum, pool) => sum + pool.fees24h, 0);
  const myTotalStake = liquidityPools.reduce((sum, pool) => sum + pool.myStake, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'paused': return 'bg-yellow-500/20 text-yellow-600';
      case 'deprecated': return 'bg-red-500/20 text-red-600';
      case 'inactive': return 'bg-gray-500/20 text-gray-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-500/20 text-purple-600';
      case 'standard': return 'bg-blue-500/20 text-blue-600';
      case 'basic': return 'bg-gray-500/20 text-gray-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Liquidity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-enhanced border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Liquidity</p>
                <h3 className="text-2xl font-bold">${(totalLiquidity / 1000000).toFixed(1)}M</h3>
              </div>
              <Droplets className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <h3 className="text-2xl font-bold">${(totalVolume24h / 1000000).toFixed(1)}M</h3>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Fees</p>
                <h3 className="text-2xl font-bold">${totalFees24h.toLocaleString()}</h3>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Stake</p>
                <h3 className="text-2xl font-bold">${myTotalStake.toLocaleString()}</h3>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
          <TabsTrigger value="makers">Market Makers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pool List */}
            <div className="lg:col-span-2">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5" />
                    <span>Active Liquidity Pools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liquidityPools.map((pool) => (
                      <div
                        key={pool.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedPool(pool.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{pool.pair}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(pool.status)}>
                                {pool.status}
                              </Badge>
                              <Badge className="bg-blue-500/20 text-blue-600">
                                {pool.apy}% APY
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(pool.totalLiquidity / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-muted-foreground">Total Liquidity</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">24h Volume</p>
                            <p className="font-medium">${(pool.volume24h / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">24h Fees</p>
                            <p className="font-medium">${pool.fees24h.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">My Stake</p>
                            <p className="font-medium">${pool.myStake.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Utilization</span>
                            <span>{pool.utilization}%</span>
                          </div>
                          <Progress value={pool.utilization} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Staking Panel */}
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Add Liquidity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Pool</label>
                  <Select value={selectedPool} onValueChange={setSelectedPool}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {liquidityPools.map((pool) => (
                        <SelectItem key={pool.id} value={pool.id}>
                          {pool.pair} - {pool.apy}% APY
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (USDT)</label>
                  <Input
                    type="number"
                    placeholder="10,000"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button size="sm" variant="outline" onClick={() => setStakeAmount('1000')}>
                    $1K
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStakeAmount('5000')}>
                    $5K
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStakeAmount('10000')}>
                    $10K
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStakeAmount('50000')}>
                    $50K
                  </Button>
                </div>

                {selectedPool && stakeAmount && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Estimated APY:</span>
                      <span className="font-medium text-green-500">
                        {liquidityPools.find(p => p.id === selectedPool)?.apy}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Daily Earnings:</span>
                      <span className="font-medium">
                        ${((parseFloat(stakeAmount) * (liquidityPools.find(p => p.id === selectedPool)?.apy || 0) / 100) / 365).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={!selectedPool || !stakeAmount}
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Add Liquidity
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="makers" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Registered Market Makers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketMakers.map((maker) => (
                  <div key={maker.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{maker.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(maker.status)}>
                            {maker.status}
                          </Badge>
                          <Badge className={getTierColor(maker.tier)}>
                            {maker.tier}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{maker.uptime}%</p>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">24h Volume</p>
                        <p className="font-medium">${(maker.volume24h / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Spread</p>
                        <p className="font-medium">{maker.spread}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Pairs</p>
                        <p className="font-medium">{maker.pairs.length}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {maker.pairs.map((pair) => (
                        <Badge key={pair} variant="outline" className="text-xs">
                          {pair}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Liquidity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liquidityPools.map((pool) => (
                    <div key={pool.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{pool.pair}</span>
                        <span>{((pool.totalLiquidity / totalLiquidity) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(pool.totalLiquidity / totalLiquidity) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Volume/Liquidity Ratio</span>
                    <Badge className="bg-green-500/20 text-green-600">
                      {((totalVolume24h / totalLiquidity) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Pool Utilization</span>
                    <Badge className="bg-blue-500/20 text-blue-600">
                      {(liquidityPools.reduce((sum, pool) => sum + pool.utilization, 0) / liquidityPools.length).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fee Collection Rate</span>
                    <Badge className="bg-purple-500/20 text-purple-600">
                      {((totalFees24h / totalVolume24h) * 100).toFixed(3)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Maker Coverage</span>
                    <Badge className="bg-orange-500/20 text-orange-600">
                      85%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-enhanced border-green-500/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <h3 className="font-semibold">Conservative Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on major pairs with stable returns and lower risk
                  </p>
                  <div className="text-2xl font-bold text-green-500">8-12% APY</div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced border-blue-500/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Target className="w-12 h-12 text-blue-500 mx-auto" />
                  <h3 className="font-semibold">Balanced Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    Mix of major and altcoin pairs for balanced risk-return
                  </p>
                  <div className="text-2xl font-bold text-blue-500">12-18% APY</div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced border-orange-500/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Zap className="w-12 h-12 text-orange-500 mx-auto" />
                  <h3 className="font-semibold">Aggressive Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    High-yield pools with higher volatility and risk
                  </p>
                  <div className="text-2xl font-bold text-orange-500">18-25% APY</div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}