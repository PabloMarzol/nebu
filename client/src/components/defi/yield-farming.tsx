import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Coins,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  DollarSign,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface YieldFarmingProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface Pool {
  id: string;
  name: string;
  protocol: string;
  tokens: string[];
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  autoCompound: boolean;
  minDeposit: number;
  lockPeriod?: string;
  rewards: string[];
}

interface Position {
  id: string;
  pool: Pool;
  amount: number;
  value: number;
  earned: number;
  entryDate: Date;
  status: 'active' | 'pending' | 'withdrawn';
}

export default function YieldFarming({ userTier = 'basic' }: YieldFarmingProps) {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [isDepositing, setIsDepositing] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const { toast } = useToast();

  const pools: Pool[] = [
    {
      id: '1',
      name: 'USDC/ETH LP',
      protocol: 'Uniswap V3',
      tokens: ['USDC', 'ETH'],
      apy: 18.7,
      tvl: 45200000,
      risk: 'medium',
      autoCompound: true,
      minDeposit: 100,
      rewards: ['UNI', 'Fees']
    },
    {
      id: '2',
      name: 'AAVE Lending',
      protocol: 'Aave',
      tokens: ['USDT'],
      apy: 8.9,
      tvl: 125000000,
      risk: 'low',
      autoCompound: true,
      minDeposit: 50,
      rewards: ['AAVE']
    },
    {
      id: '3',
      name: 'CRV/ETH LP',
      protocol: 'Curve',
      tokens: ['CRV', 'ETH'],
      apy: 24.3,
      tvl: 28500000,
      risk: 'high',
      autoCompound: true,
      minDeposit: 200,
      lockPeriod: '30 days',
      rewards: ['CRV', 'CVX']
    },
    {
      id: '4',
      name: 'Stablecoin Pool',
      protocol: 'Yearn Finance',
      tokens: ['USDC', 'USDT', 'DAI'],
      apy: 12.1,
      tvl: 67800000,
      risk: 'low',
      autoCompound: true,
      minDeposit: 25,
      rewards: ['YFI']
    },
    {
      id: '5',
      name: 'WBTC/ETH LP',
      protocol: 'SushiSwap',
      tokens: ['WBTC', 'ETH'],
      apy: 21.5,
      tvl: 15600000,
      risk: 'medium',
      autoCompound: false,
      minDeposit: 500,
      rewards: ['SUSHI']
    }
  ];

  useEffect(() => {
    // Simulate earning updates
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => ({
        ...pos,
        earned: pos.earned + (pos.amount * pos.pool.apy / 100 / 365 / 24), // Hourly compound
        value: pos.amount + pos.earned + (pos.amount * pos.pool.apy / 100 / 365 / 24)
      })));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const total = positions.reduce((sum, pos) => sum + pos.earned, 0);
    setTotalEarnings(total);
  }, [positions]);

  const deposit = async () => {
    if (!selectedPool || !depositAmount || parseFloat(depositAmount) < selectedPool.minDeposit) {
      toast({
        title: "Invalid Deposit",
        description: `Minimum deposit is $${selectedPool?.minDeposit || 0}`,
        variant: "destructive"
      });
      return;
    }

    setIsDepositing(true);

    const newPosition: Position = {
      id: Date.now().toString(),
      pool: selectedPool,
      amount: parseFloat(depositAmount),
      value: parseFloat(depositAmount),
      earned: 0,
      entryDate: new Date(),
      status: 'pending'
    };

    setPositions(prev => [newPosition, ...prev]);

    // Simulate deposit confirmation
    setTimeout(() => {
      setPositions(prev => prev.map(pos => 
        pos.id === newPosition.id ? { ...pos, status: 'active' } : pos
      ));
      
      toast({
        title: "Deposit Successful",
        description: `Successfully deposited $${depositAmount} to ${selectedPool.name}`,
        variant: "default"
      });
    }, 3000);

    setIsDepositing(false);
    setDepositAmount('');
    setSelectedPool(null);
  };

  const withdraw = async (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    setPositions(prev => prev.map(pos => 
      pos.id === positionId ? { ...pos, status: 'withdrawn' } : pos
    ));

    toast({
      title: "Withdrawal Initiated",
      description: `Withdrawing ${position.value.toFixed(2)} USDT from ${position.pool.name}`,
      variant: "default"
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'withdrawn':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            DeFi Yield Farming
          </h1>
          <p className="text-gray-300">
            Automated yield optimization and liquidity farming
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Total Earnings</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{positions.filter(p => p.status === 'active').length}</div>
              <div className="text-sm text-gray-400">Active Positions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">16.8%</div>
              <div className="text-sm text-gray-400">Avg APY</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold">
                ${positions.reduce((sum, pos) => sum + pos.value, 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-400">Total Value</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Pools */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Yield Pools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pools.map((pool) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPool?.id === pool.id 
                        ? 'border-green-500/50 bg-green-500/20' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedPool(pool)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{pool.name}</h4>
                        <p className="text-sm text-gray-400">{pool.protocol}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">
                          {pool.apy.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">APY</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      {pool.tokens.map((token, index) => (
                        <Badge key={token} variant="outline" className="text-xs">
                          {token}
                        </Badge>
                      ))}
                      <Badge variant="outline" className={`text-xs ${getRiskColor(pool.risk)}`}>
                        {pool.risk} risk
                      </Badge>
                      {pool.autoCompound && (
                        <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                          Auto-compound
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>TVL: ${(pool.tvl / 1000000).toFixed(1)}M</div>
                      <div>Min: ${pool.minDeposit}</div>
                      {pool.lockPeriod && (
                        <div className="col-span-2">Lock: {pool.lockPeriod}</div>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs">
                      <span className="text-gray-400">Rewards: </span>
                      {pool.rewards.join(', ')}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Deposit Interface */}
              {selectedPool && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-white/5 rounded-lg border border-green-500/30"
                >
                  <h4 className="font-semibold mb-3">Deposit to {selectedPool.name}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Amount (USD)</label>
                      <Input
                        type="number"
                        placeholder={`Min: $${selectedPool.minDeposit}`}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    
                    {depositAmount && parseFloat(depositAmount) > 0 && (
                      <div className="p-3 bg-white/5 rounded text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Estimated Daily Earnings:</span>
                          <span className="text-green-400">
                            ${(parseFloat(depositAmount) * selectedPool.apy / 100 / 365).toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Monthly Earnings:</span>
                          <span className="text-green-400">
                            ${(parseFloat(depositAmount) * selectedPool.apy / 100 / 12).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={deposit}
                        disabled={isDepositing || !depositAmount || parseFloat(depositAmount) < selectedPool.minDeposit}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isDepositing ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Coins className="w-4 h-4 mr-2" />
                        )}
                        {isDepositing ? 'Depositing...' : 'Deposit'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPool(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Active Positions */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Your Positions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No positions yet</p>
                  <p className="text-sm">Select a pool to start earning yield</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {positions.map((position) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(position.status)}
                          <div>
                            <h4 className="font-semibold">{position.pool.name}</h4>
                            <p className="text-sm text-gray-400">{position.pool.protocol}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getRiskColor(position.pool.risk)}>
                          {position.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-400">Deposited</div>
                          <div className="font-semibold">${position.amount.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Current Value</div>
                          <div className="font-semibold text-green-400">${position.value.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Earned</div>
                          <div className="font-semibold text-green-400">+${position.earned.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">APY</div>
                          <div className="font-semibold">{position.pool.apy.toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                        <span>Entry: {position.entryDate.toLocaleDateString()}</span>
                        <span>Auto-compound: {position.pool.autoCompound ? 'Yes' : 'No'}</span>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-3">
                        Earnings Progress:
                      </div>
                      <Progress 
                        value={(position.earned / position.amount) * 100} 
                        className="h-2 mb-3" 
                      />
                      
                      {position.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => withdraw(position.id)}
                          className="w-full"
                        >
                          Withdraw
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}