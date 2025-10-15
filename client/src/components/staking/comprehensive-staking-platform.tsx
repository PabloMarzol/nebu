import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  Shield, 
  Zap,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  Wallet,
  Star,
  Award,
  Percent,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Plus
} from "lucide-react";

export default function ComprehensiveStakingPlatform() {
  const [activeTab, setActiveTab] = useState("eth-staking");
  const [stakingAmount, setStakingAmount] = useState("");
  const [stakingPeriod, setStakingPeriod] = useState("flexible");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const stakeMutation = useMutation({
    mutationFn: async (stakeData: any) => {
      return apiRequest("POST", "/api/staking/stake", stakeData);
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Staking Position Created Successfully!",
        description: `Your ${variables.asset} is now earning ${variables.apy} APY rewards`,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/positions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setStakingAmount("");
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

  const handleStakeClick = (asset: any) => {
    console.log(`Stake button clicked for: ${asset.name} (${asset.symbol})`);
    
    const minStakeAmount = parseFloat(asset.minStake.split(' ')[0]);
    
    if (!stakingAmount || parseFloat(stakingAmount) < minStakeAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum stake amount is ${asset.minStake}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing Stake Transaction",
      description: `Staking ${stakingAmount} ${asset.symbol} at ${asset.apy} APY`,
      duration: 3000,
    });

    // Execute the staking
    stakeMutation.mutate({
      poolId: asset.symbol,
      asset: asset.symbol,
      amount: parseFloat(stakingAmount),
      apy: asset.apy,
      lockPeriod: asset.lockPeriod,
      stakingType: asset.lockPeriod === "Flexible" || asset.lockPeriod === "No lock" ? "flexible" : "fixed"
    });
  };

  const stakingAssets = [
    {
      symbol: "ETH",
      name: "Ethereum 2.0",
      apy: "4.2%",
      minStake: "0.1 ETH",
      type: "On-chain",
      lockPeriod: "Flexible",
      totalStaked: "15,234.67 ETH",
      userStaked: "5.2 ETH",
      rewards: "0.234 ETH",
      validator: "NebulaX Validator",
      risk: "Low"
    },
    {
      symbol: "ADA",
      name: "Cardano",
      apy: "4.8%", 
      minStake: "10 ADA",
      type: "On-chain",
      lockPeriod: "No lock",
      totalStaked: "125,845 ADA",
      userStaked: "500 ADA",
      rewards: "24.5 ADA",
      validator: "NEBULA Pool",
      risk: "Low"
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      apy: "12.5%",
      minStake: "1 DOT",
      type: "On-chain", 
      lockPeriod: "28 days",
      totalStaked: "8,934 DOT",
      userStaked: "100 DOT",
      rewards: "12.5 DOT",
      validator: "NebulaX Nominator",
      risk: "Medium"
    },
    {
      symbol: "SOL",
      name: "Solana",
      apy: "6.8%",
      minStake: "0.01 SOL",
      type: "On-chain",
      lockPeriod: "2-3 days",
      totalStaked: "45,623 SOL", 
      userStaked: "250 SOL",
      rewards: "17.2 SOL",
      validator: "Nebula Validator",
      risk: "Medium"
    }
  ];

  const flexibleSavings = [
    {
      asset: "USDT",
      apy: "8.2%",
      balance: "10,000 USDT",
      earned: "82.5 USDT",
      description: "High-yield flexible savings",
      minDeposit: "100 USDT",
      maxDeposit: "No limit"
    },
    {
      asset: "USDC", 
      apy: "7.8%",
      balance: "5,000 USDC",
      earned: "39.2 USDC",
      description: "USD Coin flexible savings",
      minDeposit: "50 USDC",
      maxDeposit: "No limit"
    },
    {
      asset: "BTC",
      apy: "3.5%",
      balance: "0.5 BTC",
      earned: "0.0175 BTC",
      description: "Bitcoin flexible savings",
      minDeposit: "0.001 BTC",
      maxDeposit: "No limit"
    }
  ];

  const fixedTerms = [
    {
      asset: "ETH",
      duration: "30 days",
      apy: "5.5%",
      minAmount: "1 ETH",
      totalCap: "1,000 ETH",
      filled: "67%",
      startDate: "2024-02-01",
      endDate: "2024-03-02"
    },
    {
      asset: "BNB",
      duration: "60 days", 
      apy: "8.5%",
      minAmount: "10 BNB",
      totalCap: "5,000 BNB",
      filled: "34%",
      startDate: "2024-02-05",
      endDate: "2024-04-05"
    },
    {
      asset: "AVAX",
      duration: "90 days",
      apy: "12.8%",
      minAmount: "5 AVAX",
      totalCap: "10,000 AVAX",
      filled: "89%",
      startDate: "2024-01-15",
      endDate: "2024-04-15"
    }
  ];

  const liquidityPools = [
    {
      pair: "ETH/USDC",
      apy: "15.4%",
      tvl: "$2,450,000",
      userLiquidity: "$5,000",
      rewards: "45.2 UNI",
      protocol: "Uniswap V3",
      risk: "Medium",
      fees: "0.3%"
    },
    {
      pair: "BTC/ETH",
      apy: "12.7%", 
      tvl: "$1,890,000",
      userLiquidity: "$2,500",
      rewards: "12.8 SUSHI",
      protocol: "SushiSwap",
      risk: "Medium",
      fees: "0.25%"
    },
    {
      pair: "USDT/USDC",
      apy: "8.9%",
      tvl: "$5,670,000",
      userLiquidity: "$10,000",
      rewards: "89.2 CRV",
      protocol: "Curve Finance",
      risk: "Low",
      fees: "0.04%"
    }
  ];

  const defiIntegrations = [
    {
      protocol: "Compound",
      category: "Lending",
      apy: "4.2%",
      tvl: "$1.2B",
      supported: ["USDC", "ETH", "WBTC"],
      risk: "Low"
    },
    {
      protocol: "Aave",
      category: "Lending", 
      apy: "3.8%",
      tvl: "$5.1B",
      supported: ["USDT", "DAI", "LINK"],
      risk: "Low"
    },
    {
      protocol: "Yearn Finance",
      category: "Yield Farming",
      apy: "12.5%",
      tvl: "$890M",
      supported: ["YFI", "ETH", "USDC"],
      risk: "High"
    },
    {
      protocol: "Lido",
      category: "Liquid Staking",
      apy: "4.1%",
      tvl: "$23.4B", 
      supported: ["stETH", "stMATIC"],
      risk: "Medium"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Staking Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Staked Value</p>
                <p className="text-2xl font-bold text-white">$45,230</p>
                <p className="text-xs text-green-400">+12.4% this month</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Monthly Rewards</p>
                <p className="text-2xl font-bold text-white">$1,847</p>
                <p className="text-xs text-green-400">5.2% avg APY</p>
              </div>
              <Coins className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-blue-400">Across 6 protocols</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compound Interest</p>
                <p className="text-2xl font-bold text-white">$2,450</p>
                <p className="text-xs text-purple-400">Auto-compounded</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="eth-staking">ETH 2.0 Staking</TabsTrigger>
          <TabsTrigger value="pos-staking">PoS Assets</TabsTrigger>
          <TabsTrigger value="flexible">Flexible Savings</TabsTrigger>
          <TabsTrigger value="fixed-term">Fixed Term</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Mining</TabsTrigger>
          <TabsTrigger value="defi">DeFi Access</TabsTrigger>
        </TabsList>

        {/* ETH 2.0 Staking */}
        <TabsContent value="eth-staking">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Ethereum 2.0 Staking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 font-medium">Validator Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Validator</p>
                      <p className="text-white">NebulaX Validator</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Effectiveness</p>
                      <p className="text-green-400">99.2%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Commission</p>
                      <p className="text-white">5%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Uptime</p>
                      <p className="text-green-400">99.8%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount to Stake (ETH)</Label>
                  <Input 
                    placeholder="0.00"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    className="bg-black/30"
                  />
                  <p className="text-sm text-gray-400">
                    Minimum: 0.1 ETH | Available: 12.45 ETH
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Expected Annual Reward</Label>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <p className="text-2xl font-bold text-green-400">4.2% APY</p>
                    <p className="text-sm text-gray-400">
                      {stakingAmount && !isNaN(Number(stakingAmount)) 
                        ? `≈ ${(Number(stakingAmount) * 0.042).toFixed(3)} ETH/year`
                        : "Enter amount to calculate rewards"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">Withdrawal Notice</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Staked ETH will be locked until Ethereum 2.0 withdrawals are enabled. 
                  Rewards are auto-compounded.
                </p>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStakeClick({ symbol: "ETH", name: "Ethereum 2.0", apy: "4.2%", minStake: "0.1 ETH", lockPeriod: "Flexible" })}
                  disabled={stakeMutation.isPending}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {stakeMutation.isPending ? "Staking..." : "Stake ETH"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Your ETH Staking Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Staked Amount</p>
                    <p className="text-2xl font-bold text-white">5.2 ETH</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Rewards Earned</p>
                    <p className="text-2xl font-bold text-green-400">0.234 ETH</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Staking Progress</span>
                    <span className="text-white">Day 127/365</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Value</span>
                    <span className="text-white">$14,280</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rewards Value</span>
                    <span className="text-green-400">$641</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Reward</span>
                    <span className="text-white">0.012 ETH in 2 days</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add More
                  </Button>
                  <Button variant="outline" className="flex-1" disabled>
                    <Unlock className="h-4 w-4 mr-2" />
                    Unstake (Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Proof of Stake Assets */}
        <TabsContent value="pos-staking">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingAssets.map((asset) => (
              <Card key={asset.symbol} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      {asset.name} ({asset.symbol})
                    </div>
                    <Badge className={getRiskBgColor(asset.risk)}>
                      {asset.risk} Risk
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">APY</p>
                      <p className="text-2xl font-bold text-green-400">{asset.apy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Lock Period</p>
                      <p className="text-white">{asset.lockPeriod}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Stake</span>
                      <span className="text-white">{asset.userStaked}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rewards Earned</span>
                      <span className="text-green-400">{asset.rewards}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Validator</span>
                      <span className="text-white">{asset.validator}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      Stake More
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Claim Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Flexible Savings */}
        <TabsContent value="flexible">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flexibleSavings.map((saving) => (
              <Card key={saving.asset} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {saving.asset} Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{saving.apy}</p>
                    <p className="text-sm text-gray-400">Annual Percentage Yield</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Balance</span>
                      <span className="text-white">{saving.balance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earned</span>
                      <span className="text-green-400">{saving.earned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Deposit</span>
                      <span className="text-white">{saving.minDeposit}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">{saving.description}</p>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Deposit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Fixed Term Products */}
        <TabsContent value="fixed-term">
          <div className="space-y-6">
            {fixedTerms.map((term, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">{term.asset}</h3>
                      <p className="text-gray-400">{term.duration} Fixed Term</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-400">{term.apy}</p>
                      <p className="text-sm text-gray-400">Guaranteed APY</p>
                    </div>
                    <div>
                      <p className="text-white">{term.minAmount}</p>
                      <p className="text-sm text-gray-400">Minimum Amount</p>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Capacity</span>
                          <span className="text-white">{term.filled}</span>
                        </div>
                        <Progress value={parseInt(term.filled)} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Liquidity Mining */}
        <TabsContent value="liquidity">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {liquidityPools.map((pool) => (
              <Card key={pool.pair} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{pool.pair}</span>
                    <Badge className={getRiskBgColor(pool.risk)}>
                      {pool.risk}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">{pool.apy}</p>
                    <p className="text-sm text-gray-400">Total APY</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">TVL</span>
                      <span className="text-white">{pool.tvl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Liquidity</span>
                      <span className="text-white">{pool.userLiquidity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earned Rewards</span>
                      <span className="text-green-400">{pool.rewards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Protocol</span>
                      <span className="text-white">{pool.protocol}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      Add Liquidity
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Harvest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* DeFi Access */}
        <TabsContent value="defi">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defiIntegrations.map((protocol) => (
              <Card key={protocol.protocol} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{protocol.protocol}</span>
                    <Badge variant="outline">{protocol.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">APY</p>
                      <p className="text-2xl font-bold text-green-400">{protocol.apy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">TVL</p>
                      <p className="text-white">{protocol.tvl}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Supported Assets</p>
                    <div className="flex flex-wrap gap-2">
                      {protocol.supported.map((asset) => (
                        <Badge key={asset} variant="outline">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Risk Level:</span>
                      <span className={`text-sm ${getRiskColor(protocol.risk)}`}>
                        {protocol.risk}
                      </span>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}