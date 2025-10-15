import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { Coins, TrendingUp, Clock, Shield, Zap, Calendar, Award } from "lucide-react";
import { WalletConnect } from "@/components/WalletConnect";

export default function Staking() {
  const [selectedAsset, setSelectedAsset] = useState("ETH");
  const [stakingType, setStakingType] = useState("flexible");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");

  const { isAuthenticated } = useWalletAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stakingPositions, isLoading: positionsLoading } = useQuery({
    queryKey: ["/api/staking/positions"],
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
    enabled: isAuthenticated,
  });

  const stakeMutation = useMutation({
    mutationFn: async (stakeData: any) => {
      return apiRequest("POST", "/api/staking/stake", stakeData);
    },
    onSuccess: () => {
      toast({
        title: "Staking Position Created",
        description: "Your assets are now earning rewards!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staking/positions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Staking Failed",
        description: error.message || "Failed to create staking position",
        variant: "destructive",
      });
    },
  });

  const stakingPools = [
    {
      asset: "ETH",
      name: "Ethereum 2.0",
      apy: "4.2",
      minStake: "0.1",
      lockPeriod: "flexible",
      totalStaked: "2,456,789",
      icon: "🟦"
    },
    {
      asset: "SOL",
      name: "Solana",
      apy: "6.8",
      minStake: "1",
      lockPeriod: "flexible",
      totalStaked: "1,234,567",
      icon: "🟣"
    },
    {
      asset: "ADA",
      name: "Cardano",
      apy: "5.1",
      minStake: "10",
      lockPeriod: "flexible",
      totalStaked: "987,654",
      icon: "🔵"
    },
    {
      asset: "DOT",
      name: "Polkadot",
      apy: "8.5",
      minStake: "1",
      lockPeriod: "28 days",
      totalStaked: "456,789",
      icon: "🔴"
    }
  ];

  const getAvailableBalance = (asset: string) => {
    if (!portfolio || !Array.isArray(portfolio)) return 0;
    const assetBalance = portfolio.find((p: any) => p.symbol === asset);
    return assetBalance ? parseFloat(assetBalance.balance) : 0;
  };

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to start staking your assets",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount",
        variant: "destructive",
      });
      return;
    }

    const pool = stakingPools.find(p => p.asset === selectedAsset);
    if (!pool) {
      toast({
        title: "Pool Not Found",
        description: "Selected staking pool is not available",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) < parseFloat(pool.minStake)) {
      toast({
        title: "Minimum Stake Required",
        description: `Minimum stake amount is ${pool.minStake} ${pool.asset}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing Stake Transaction",
      description: `Staking ${amount} ${selectedAsset} at ${pool.apy}% APY`,
      duration: 3000,
    });

    stakeMutation.mutate({
      asset: selectedAsset,
      amount: parseFloat(amount),
      stakingType,
      duration: stakingType === "fixed" ? parseInt(duration) : null,
      apy: parseFloat(pool.apy),
      poolId: selectedAsset,
    });
  };

  const calculateRewards = (amount: number, apy: number, days: number) => {
    return (amount * (apy / 100) * days) / 365;
  };

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Staking Platform
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Earn passive rewards by staking your cryptocurrencies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Pools */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Available Staking Pools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stakingPools.map((pool) => (
                    <Card key={pool.asset} className="border border-muted hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{pool.icon}</span>
                            <div>
                              <h3 className="font-semibold">{pool.name}</h3>
                              <p className="text-sm text-muted-foreground">{pool.asset}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {pool.apy}% APY
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Min Stake:</span>
                            <span>{pool.minStake} {pool.asset}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lock Period:</span>
                            <span>{pool.lockPeriod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Staked:</span>
                            <span>{pool.totalStaked} {pool.asset}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-4" 
                          size="sm"
                          onClick={() => setSelectedAsset(pool.asset)}
                        >
                          Stake {pool.asset}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staking Form */}
          <div>
            <Card className="glass relative">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Stake Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleStake} className="space-y-4">
                  <div>
                    <Label>Asset</Label>
                    <CustomSelect
                      value={selectedAsset}
                      placeholder="Select asset"
                      options={stakingPools.map((pool) => ({
                        value: pool.asset,
                        label: `${pool.name} (${pool.asset})`
                      }))}
                      onChange={setSelectedAsset}
                    />
                  </div>

                  <div>
                    <Label>Staking Type</Label>
                    <CustomSelect
                      value={stakingType}
                      placeholder="Select staking type"
                      options={[
                        { value: "flexible", label: "Flexible (Withdraw anytime)" },
                        { value: "fixed", label: "Fixed Term (Higher APY)" }
                      ]}
                      onChange={setStakingType}
                    />
                  </div>

                  {stakingType === "fixed" && (
                    <div>
                      <Label>Duration (Days)</Label>
                      <CustomSelect
                        value={duration}
                        placeholder="Select duration"
                        options={[
                          { value: "30", label: "30 Days (+0.5% APY)" },
                          { value: "90", label: "90 Days (+1.0% APY)" },
                          { value: "180", label: "180 Days (+1.5% APY)" },
                          { value: "365", label: "365 Days (+2.0% APY)" }
                        ]}
                        onChange={setDuration}
                      />
                    </div>
                  )}

                  <div>
                    <Label>Amount ({selectedAsset})</Label>
                    <Input
                      type="number"
                      step="0.00000001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                    {isAuthenticated && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Available: {getAvailableBalance(selectedAsset)} {selectedAsset}
                      </p>
                    )}
                  </div>

                  {amount && (
                    <div className="bg-muted/50 p-3 rounded space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Estimated daily rewards:</span>
                        <span className="font-semibold">
                          {calculateRewards(
                            parseFloat(amount), 
                            parseFloat(stakingPools.find(p => p.asset === selectedAsset)?.apy || "0"),
                            1
                          ).toFixed(6)} {selectedAsset}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Estimated monthly rewards:</span>
                        <span className="font-semibold">
                          {calculateRewards(
                            parseFloat(amount), 
                            parseFloat(stakingPools.find(p => p.asset === selectedAsset)?.apy || "0"),
                            30
                          ).toFixed(6)} {selectedAsset}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={stakeMutation.isPending || !amount || parseFloat(amount) <= 0}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {stakeMutation.isPending ? "Processing Stake..." : "Stake Assets"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Staking Positions */}
        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              My Staking Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <div className="text-center py-4 text-muted-foreground">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Wallet Connection Required</h3>
                <p className="text-muted-foreground mb-4">Connect your wallet to start staking and earn rewards</p>
                <div className="mt-4">
                  <WalletConnect />
                </div>
              </div>
            ) : positionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : stakingPositions && Array.isArray(stakingPositions) && stakingPositions.length > 0 ? (
              <div className="space-y-4">
                {stakingPositions.map((position: any) => (
                  <Card key={position.id} className="border border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                              {stakingPools.find(p => p.asset === position.asset)?.icon}
                            </span>
                            <div>
                              <h3 className="font-semibold">
                                {position.amount} {position.asset}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {position.apy}% APY • {position.stakingType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Coins className="w-4 h-4 mr-1" />
                              Rewards: {position.rewards || "0"} {position.asset}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Started: {new Date(position.startDate).toLocaleDateString()}
                            </span>
                            {position.endDate && (
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Ends: {new Date(position.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline">
                            Claim Rewards
                          </Button>
                          {position.stakingType === "flexible" && (
                            <Button size="sm" variant="destructive">
                              Unstake
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Coins className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Staking Positions</h3>
                <p>Start staking to earn passive rewards</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
              <p className="text-muted-foreground text-sm">
                Generate passive income with competitive APY rates up to 8.5%
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Secure Staking</h3>
              <p className="text-muted-foreground text-sm">
                Your assets are secured by institutional-grade custody solutions
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">Flexible Terms</h3>
              <p className="text-muted-foreground text-sm">
                Choose between flexible staking or fixed terms for higher rewards
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}