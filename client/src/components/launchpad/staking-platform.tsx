import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Coins, 
  TrendingUp, 
  Lock, 
  Clock,
  DollarSign,
  Users,
  Shield,
  Zap,
  Award,
  Calculator,
  Calendar,
  Target
} from "lucide-react";

interface StakingPool {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  logo: string;
  apy: number;
  tvl: string;
  minimumStake: number;
  lockPeriod: number;
  rewardsToken: string;
  stakingPeriodDays: number;
  totalStakers: number;
  userStaked: number;
  pendingRewards: number;
  status: "active" | "paused" | "ended";
  riskLevel: "low" | "medium" | "high";
  compoundingFrequency: "daily" | "weekly" | "monthly";
  earlyWithdrawalPenalty: number;
}

export default function StakingPlatform() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedTab, setSelectedTab] = useState("pools");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const stakeMutation = useMutation({
    mutationFn: async (stakeData: any) => {
      return apiRequest("POST", "/api/staking/stake", stakeData);
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Staking Position Created Successfully!",
        description: `Your ${variables.asset} is now earning ${variables.apy}% APY rewards`,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/positions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setStakeAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Staking Failed",
        description: error.message || "Failed to create staking position",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const handleStakeClick = (pool: StakingPool) => {
    console.log(`Stake button clicked for: ${pool.tokenName} (${pool.tokenSymbol})`);
    
    if (!stakeAmount || parseFloat(stakeAmount) < pool.minimumStake) {
      toast({
        title: "Invalid Amount",
        description: `Minimum stake amount is ${pool.minimumStake} ${pool.tokenSymbol}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing Stake Transaction",
      description: `Staking ${stakeAmount} ${pool.tokenSymbol} at ${pool.apy}% APY`,
      duration: 3000,
    });

    // Execute the staking
    stakeMutation.mutate({
      poolId: pool.id,
      asset: pool.tokenSymbol,
      amount: parseFloat(stakeAmount),
      apy: pool.apy,
      lockPeriod: pool.lockPeriod,
      stakingType: pool.lockPeriod > 0 ? "fixed" : "flexible"
    });
  };

  const stakingPools: StakingPool[] = [
    {
      id: "nebx-staking",
      tokenName: "NebulaX Token",
      tokenSymbol: "NEBX",
      logo: "⭐",
      apy: 18.5,
      tvl: "$12.4M",
      minimumStake: 100,
      lockPeriod: 30,
      rewardsToken: "NEBX",
      stakingPeriodDays: 365,
      totalStakers: 2847,
      userStaked: 5000,
      pendingRewards: 127.35,
      status: "active",
      riskLevel: "low",
      compoundingFrequency: "daily",
      earlyWithdrawalPenalty: 5
    },
    {
      id: "defi-pool",
      tokenName: "DeFi Basket",
      tokenSymbol: "DFIB",
      logo: "🔗",
      apy: 24.7,
      tvl: "$8.9M",
      minimumStake: 50,
      lockPeriod: 90,
      rewardsToken: "Multiple",
      stakingPeriodDays: 180,
      totalStakers: 1562,
      userStaked: 2500,
      pendingRewards: 89.42,
      status: "active",
      riskLevel: "medium",
      compoundingFrequency: "weekly",
      earlyWithdrawalPenalty: 8
    },
    {
      id: "ai-pool",
      tokenName: "AI Computing Pool",
      tokenSymbol: "AIC",
      logo: "🤖",
      apy: 32.1,
      tvl: "$5.7M",
      minimumStake: 25,
      lockPeriod: 180,
      rewardsToken: "AIC",
      stakingPeriodDays: 365,
      totalStakers: 934,
      userStaked: 0,
      pendingRewards: 0,
      status: "active",
      riskLevel: "high",
      compoundingFrequency: "daily",
      earlyWithdrawalPenalty: 12
    },
    {
      id: "stable-pool",
      tokenName: "Stable Yield",
      tokenSymbol: "USDC",
      logo: "💵",
      apy: 8.2,
      tvl: "$45.2M",
      minimumStake: 10,
      lockPeriod: 0,
      rewardsToken: "USDC",
      stakingPeriodDays: 0,
      totalStakers: 7821,
      userStaked: 10000,
      pendingRewards: 22.15,
      status: "active",
      riskLevel: "low",
      compoundingFrequency: "daily",
      earlyWithdrawalPenalty: 0
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 border-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "high": return "text-red-400 border-red-400 bg-red-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  const getAPYColor = (apy: number) => {
    if (apy >= 25) return "text-green-400";
    if (apy >= 15) return "text-yellow-400";
    return "text-blue-400";
  };

  const calculateRewards = (amount: number, apy: number, days: number) => {
    const dailyRate = apy / 100 / 365;
    return amount * dailyRate * days;
  };

  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0);
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.pendingRewards, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Staking Platform
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Earn passive income by staking your tokens in our secure, high-yield pools
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">${totalStaked.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Staked</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{totalRewards.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Pending Rewards</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stakingPools.length}</div>
            <div className="text-sm text-muted-foreground">Active Pools</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.max(...stakingPools.map(p => p.apy)).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Max APY</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pools">Staking Pools</TabsTrigger>
          <TabsTrigger value="my-stakes">My Stakes</TabsTrigger>
          <TabsTrigger value="calculator">Rewards Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPools.map((pool) => (
              <Card key={pool.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{pool.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{pool.tokenName}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{pool.tokenSymbol}</Badge>
                          <Badge className={`${getRiskColor(pool.riskLevel)} text-xs capitalize`}>
                            {pool.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getAPYColor(pool.apy)}`}>
                        {pool.apy}%
                      </div>
                      <div className="text-xs text-muted-foreground">APY</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pool Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">TVL</div>
                      <div className="font-semibold">{pool.tvl}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Stakers</div>
                      <div className="font-semibold">{pool.totalStakers.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Min Stake</div>
                      <div className="font-semibold">{pool.minimumStake} {pool.tokenSymbol}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Lock Period</div>
                      <div className="font-semibold">
                        {pool.lockPeriod === 0 ? "Flexible" : `${pool.lockPeriod} days`}
                      </div>
                    </div>
                  </div>

                  {/* Pool Features */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rewards Token:</span>
                      <span className="font-semibold">{pool.rewardsToken}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Compounding:</span>
                      <span className="font-semibold capitalize">{pool.compoundingFrequency}</span>
                    </div>
                    {pool.earlyWithdrawalPenalty > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Early Withdrawal Fee:</span>
                        <span className="font-semibold text-orange-400">{pool.earlyWithdrawalPenalty}%</span>
                      </div>
                    )}
                  </div>

                  {/* Staking Input */}
                  {selectedPool === pool.id ? (
                    <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Stake Amount</label>
                        <Input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder={`Min ${pool.minimumStake} ${pool.tokenSymbol}`}
                          className="text-right font-mono"
                        />
                      </div>
                      
                      {stakeAmount && parseFloat(stakeAmount) >= pool.minimumStake && (
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Daily Rewards:</span>
                            <span className="font-semibold text-green-400">
                              {calculateRewards(parseFloat(stakeAmount), pool.apy, 1).toFixed(4)} {pool.rewardsToken}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Rewards:</span>
                            <span className="font-semibold text-green-400">
                              {calculateRewards(parseFloat(stakeAmount), pool.apy, 30).toFixed(2)} {pool.rewardsToken}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleStakeClick(pool)}
                          disabled={stakeMutation.isPending}
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          {stakeMutation.isPending ? "Staking..." : "Stake Now"}
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedPool(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedPool(pool.id)}
                      disabled={pool.status !== "active"}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {pool.status === "active" ? "Stake Tokens" : "Pool Inactive"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-stakes" className="space-y-6">
          <div className="space-y-4">
            {stakingPools.filter(pool => pool.userStaked > 0).map((pool) => (
              <Card key={pool.id} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{pool.logo}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{pool.tokenName}</h3>
                        <Badge variant="outline" className="text-xs">{pool.tokenSymbol}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{pool.apy}% APY</div>
                      <div className="text-sm text-muted-foreground">Current Rate</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-xl font-bold">{pool.userStaked.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Staked</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-xl font-bold text-green-400">{pool.pendingRewards.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Pending Rewards</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">
                        {calculateRewards(pool.userStaked, pool.apy, 1).toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">Daily Earnings</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-xl font-bold text-purple-400">
                        {pool.lockPeriod === 0 ? "Flexible" : `${pool.lockPeriod} days`}
                      </div>
                      <div className="text-sm text-muted-foreground">Lock Period</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        toast({
                          title: "Rewards Claimed!",
                          description: `Successfully claimed ${pool.pendingRewards.toFixed(2)} ${pool.rewardsToken} rewards`,
                          duration: 3000,
                        });
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Claim Rewards
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedPool(pool.id)}
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Add More
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        toast({
                          title: "Unstaking Position",
                          description: `Processing unstake of ${pool.userStaked.toLocaleString()} ${pool.tokenSymbol}`,
                          duration: 3000,
                        });
                      }}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Unstake
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Staking Rewards Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Stake Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter amount to stake"
                      className="text-right font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold mb-2 block">APY (%)</label>
                    <Input
                      type="number"
                      placeholder="Annual percentage yield"
                      className="text-right font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Staking Period (Days)</label>
                    <Input
                      type="number"
                      placeholder="Number of days"
                      className="text-right font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Daily Rewards</div>
                    <div className="text-2xl font-bold text-green-400">0.00</div>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Monthly Rewards</div>
                    <div className="text-2xl font-bold text-blue-400">0.00</div>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total Rewards</div>
                    <div className="text-2xl font-bold text-purple-400">0.00</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}