import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap, 
  Target,
  Gift,
  Lock,
  Unlock,
  Calendar,
  Award,
  DollarSign,
  BarChart3
} from "lucide-react";

interface StakingPool {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  totalStaked: string;
  userStaked: string;
  minStake: number;
  lockPeriod: string;
  rewards: string;
  status: "active" | "paused" | "ended";
  tier: "bronze" | "silver" | "gold" | "platinum";
  multiplier: number;
  icon: string;
}

interface UserStaking {
  totalValue: string;
  totalRewards: string;
  activeStakes: number;
  nextReward: string;
  claimableRewards: string;
}

export default function StakingPlatform() {
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [activeTab, setActiveTab] = useState("pools");
  
  const [userStaking, setUserStaking] = useState<UserStaking>({
    totalValue: "$125,640",
    totalRewards: "$8,420",
    activeStakes: 5,
    nextReward: "2.5 hours",
    claimableRewards: "$342.80"
  });

  const [stakingPools, setStakingPools] = useState<StakingPool[]>([
    {
      id: "btc-pool",
      name: "Bitcoin Vault",
      symbol: "BTC",
      apy: 12.5,
      totalStaked: "$2.4B",
      userStaked: "$25,000",
      minStake: 0.001,
      lockPeriod: "30 days",
      rewards: "$312.50",
      status: "active",
      tier: "gold",
      multiplier: 1.5,
      icon: "₿"
    },
    {
      id: "eth-pool",
      name: "Ethereum Forge",
      symbol: "ETH",
      apy: 15.8,
      totalStaked: "$1.8B",
      userStaked: "$18,500",
      minStake: 0.1,
      lockPeriod: "60 days",
      rewards: "$292.30",
      status: "active",
      tier: "platinum",
      multiplier: 2.0,
      icon: "Ξ"
    },
    {
      id: "sol-pool",
      name: "Solana Sanctuary",
      symbol: "SOL",
      apy: 18.2,
      totalStaked: "$950M",
      userStaked: "$12,000",
      minStake: 1,
      lockPeriod: "45 days",
      rewards: "$218.40",
      status: "active",
      tier: "silver",
      multiplier: 1.3,
      icon: "◎"
    },
    {
      id: "nbl-pool",
      name: "NebulaX Nexus",
      symbol: "NBX",
      apy: 25.0,
      totalStaked: "$450M",
      userStaked: "$8,200",
      minStake: 100,
      lockPeriod: "90 days",
      rewards: "$205.00",
      status: "active",
      tier: "platinum",
      multiplier: 2.5,
      icon: "🌟"
    },
    {
      id: "defi-pool",
      name: "DeFi Basket",
      symbol: "DFI",
      apy: 22.3,
      totalStaked: "$320M",
      userStaked: "$5,500",
      minStake: 50,
      lockPeriod: "120 days",
      rewards: "$122.65",
      status: "active",
      tier: "gold",
      multiplier: 1.8,
      icon: "🏦"
    },
    {
      id: "nft-pool",
      name: "NFT Index",
      symbol: "NFT",
      apy: 20.5,
      totalStaked: "$180M",
      userStaked: "$3,200",
      minStake: 10,
      lockPeriod: "75 days",
      rewards: "$65.60",
      status: "active",
      tier: "bronze",
      multiplier: 1.2,
      icon: "🎨"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStakingPools(prev => prev.map(pool => ({
        ...pool,
        apy: pool.apy + (Math.random() - 0.5) * 0.5,
        rewards: `$${(parseFloat(pool.rewards.replace('$', '')) * (1 + Math.random() * 0.001)).toFixed(2)}`
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze": return "bg-amber-600";
      case "silver": return "bg-gray-400";
      case "gold": return "bg-yellow-500";
      case "platinum": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze": return "🥉";
      case "silver": return "🥈";
      case "gold": return "🥇";
      case "platinum": return "💎";
      default: return "⭐";
    }
  };

  const StakingPoolCard = ({ pool }: { pool: StakingPool }) => (
    <Card className="glass-strong hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-pulse">{pool.icon}</div>
            <div>
              <CardTitle className="text-lg">{pool.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{pool.symbol}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getTierColor(pool.tier)}>
              {getTierIcon(pool.tier)} {pool.tier.toUpperCase()}
            </Badge>
            {pool.multiplier > 1 && (
              <Badge variant="outline" className="text-green-400 border-green-400">
                {pool.multiplier}x
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* APY Display */}
        <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm">Annual Yield</span>
          </div>
          <div className="text-xl font-bold text-green-400">
            {pool.apy.toFixed(1)}%
          </div>
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Staked</p>
            <p className="font-semibold">{pool.totalStaked}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your Stake</p>
            <p className="font-semibold text-purple-400">{pool.userStaked}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Lock Period</p>
            <p className="font-semibold flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              {pool.lockPeriod}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending Rewards</p>
            <p className="font-semibold text-green-400">{pool.rewards}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => setSelectedPool(pool.id)}
          >
            <Coins className="w-4 h-4 mr-2" />
            Stake
          </Button>
          <Button variant="outline" className="flex-1">
            <Gift className="w-4 h-4 mr-2" />
            Claim
          </Button>
        </div>

        {/* Progress indicator for rewards */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Next Reward</span>
            <span>{Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m</span>
          </div>
          <Progress value={Math.random() * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  const YieldFarmingCard = () => (
    <Card className="glass-strong">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <span>Yield Farming</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LP Token Pools */}
        <div className="space-y-3">
          {[
            { pair: "BTC/ETH", apy: "35.2%", rewards: "$145.30", tvl: "$89M" },
            { pair: "ETH/USDC", apy: "28.7%", rewards: "$98.75", tvl: "$156M" },
            { pair: "SOL/NBX", apy: "42.1%", rewards: "$67.20", tvl: "$45M" }
          ].map((pool, index) => (
            <div key={index} className="p-3 border rounded-lg glass">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{pool.pair} LP</h4>
                  <p className="text-sm text-muted-foreground">TVL: {pool.tvl}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">{pool.apy}</div>
                  <div className="text-xs text-muted-foreground">{pool.rewards}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500">
          <Target className="w-4 h-4 mr-2" />
          Add Liquidity
        </Button>
      </CardContent>
    </Card>
  );

  const StakingStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Staked Value</p>
              <p className="text-xl font-bold">{userStaking.totalValue}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Rewards</p>
              <p className="text-xl font-bold text-green-400">{userStaking.totalRewards}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Active Stakes</p>
              <p className="text-xl font-bold">{userStaking.activeStakes}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm text-muted-foreground">Claimable</p>
              <p className="text-xl font-bold text-green-400">{userStaking.claimableRewards}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          NebulaX Staking Platform
        </h1>
        <p className="text-muted-foreground">Earn passive income through secure staking and yield farming</p>
      </div>

      {/* Statistics Overview */}
      <StakingStats />

      {/* Main Staking Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass">
          <TabsTrigger value="pools">Staking Pools</TabsTrigger>
          <TabsTrigger value="farming">Yield Farming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-6">
          {/* Quick Actions */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    <Gift className="w-4 h-4 mr-2" />
                    Claim All Rewards ({userStaking.claimableRewards})
                  </Button>
                  <Button size="sm" variant="outline">
                    <Unlock className="w-4 h-4 mr-2" />
                    Auto-Compound
                  </Button>
                </div>
                <Badge className="bg-blue-500">
                  Next reward in {userStaking.nextReward}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Staking Pools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakingPools.map((pool) => (
              <StakingPoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="farming" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <YieldFarmingCard />
            
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Impermanent Loss Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Token A Price Change</label>
                    <Input placeholder="%" type="number" />
                  </div>
                  <div>
                    <label className="text-sm">Token B Price Change</label>
                    <Input placeholder="%" type="number" />
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <p className="text-sm text-yellow-400">Estimated IL: -2.3%</p>
                  <p className="text-xs text-muted-foreground">Net yield after IL: +26.4%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Staking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Staked", amount: "2.5 ETH", pool: "Ethereum Forge", date: "2024-01-15", rewards: "+$45.30" },
                  { action: "Claimed", amount: "$312.80", pool: "Bitcoin Vault", date: "2024-01-14", rewards: "" },
                  { action: "Staked", amount: "1000 NBX", pool: "NebulaX Nexus", date: "2024-01-12", rewards: "+$125.00" }
                ].map((tx, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{tx.action} {tx.amount}</p>
                      <p className="text-sm text-muted-foreground">{tx.pool}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{tx.date}</p>
                      {tx.rewards && <p className="text-green-400 text-sm">{tx.rewards}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Governance Staking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-500/10 rounded-lg">
                <h3 className="font-semibold mb-2">NBX Governance Pool</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Your Voting Power</p>
                    <p className="font-bold">8,420 NBX</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Governance Rewards</p>
                    <p className="font-bold text-green-400">12.5% APY</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Active Proposals</h4>
                {[
                  { title: "Increase staking rewards by 2%", votes: "89.2% Yes", ends: "2 days" },
                  { title: "Add new DeFi integration", votes: "76.8% Yes", ends: "5 days" }
                ].map((proposal, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <p className="text-sm">{proposal.title}</p>
                      <Badge variant="outline">{proposal.ends}</Badge>
                    </div>
                    <p className="text-xs text-green-400 mt-1">{proposal.votes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}