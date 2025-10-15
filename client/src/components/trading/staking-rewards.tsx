import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Coins, Clock, Percent, Gift, Lock } from "lucide-react";

interface StakingPool {
  symbol: string;
  name: string;
  apy: number;
  minimumStake: number;
  lockPeriod: number;
  totalStaked: string;
  myStaked: string;
  pendingRewards: string;
  status: "active" | "ended" | "upcoming";
}

export default function StakingRewards() {
  const [selectedPool, setSelectedPool] = useState<string>("BTC");
  const [stakeAmount, setStakeAmount] = useState("");
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
    console.log(`Stake button clicked for: ${pool.name} (${pool.symbol})`);
    
    if (!stakeAmount || parseFloat(stakeAmount) < pool.minimumStake) {
      toast({
        title: "Invalid Amount",
        description: `Minimum stake amount is ${pool.minimumStake} ${pool.symbol}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing Stake Transaction",
      description: `Staking ${stakeAmount} ${pool.symbol} at ${pool.apy}% APY`,
      duration: 3000,
    });

    // Execute the staking
    stakeMutation.mutate({
      poolId: pool.symbol,
      asset: pool.symbol,
      amount: parseFloat(stakeAmount),
      apy: pool.apy,
      lockPeriod: pool.lockPeriod,
      stakingType: pool.lockPeriod > 0 ? "fixed" : "flexible"
    });
  };

  const stakingPools: StakingPool[] = [
    {
      symbol: "BTC",
      name: "Bitcoin Staking",
      apy: 4.2,
      minimumStake: 0.01,
      lockPeriod: 30,
      totalStaked: "1,245.67",
      myStaked: "0.18342",
      pendingRewards: "0.00023",
      status: "active"
    },
    {
      symbol: "ETH",
      name: "Ethereum 2.0 Staking",
      apy: 5.8,
      minimumStake: 0.1,
      lockPeriod: 0,
      totalStaked: "15,432.89",
      myStaked: "3.5",
      pendingRewards: "0.0456",
      status: "active"
    },
    {
      symbol: "NEBX",
      name: "NebulaX Token Staking",
      apy: 12.5,
      minimumStake: 1000,
      lockPeriod: 90,
      totalStaked: "2,567,890",
      myStaked: "50000",
      pendingRewards: "127.45",
      status: "active"
    },
    {
      symbol: "DOT",
      name: "Polkadot Staking",
      apy: 7.3,
      minimumStake: 1,
      lockPeriod: 28,
      totalStaked: "8,945.23",
      myStaked: "0",
      pendingRewards: "0",
      status: "upcoming"
    }
  ];

  const selectedPoolData = stakingPools.find(pool => pool.symbol === selectedPool);

  const calculateRewards = (amount: number, apy: number, days: number) => {
    return (amount * apy / 100 * days / 365);
  };

  return (
    <div className="space-y-6">
      {/* Staking Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>Staking Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">$89,432.50</div>
              <div className="text-sm text-muted-foreground">Total Staked Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">$234.67</div>
              <div className="text-sm text-muted-foreground">Pending Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">$1,892.34</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">6.8%</div>
              <div className="text-sm text-muted-foreground">Avg APY</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staking Pools */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Available Staking Pools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stakingPools.map((pool) => (
              <div
                key={pool.symbol}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPool === pool.symbol 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-border hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedPool(pool.symbol)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {pool.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{pool.name}</div>
                      <div className="text-sm text-muted-foreground">{pool.symbol}</div>
                    </div>
                  </div>
                  <Badge variant={pool.status === 'active' ? 'default' : pool.status === 'upcoming' ? 'secondary' : 'outline'}>
                    {pool.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">APY</div>
                    <div className="font-semibold text-green-400">{pool.apy}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Lock Period</div>
                    <div className="font-semibold">{pool.lockPeriod === 0 ? 'Flexible' : `${pool.lockPeriod} days`}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Min Stake</div>
                    <div className="font-semibold">{pool.minimumStake} {pool.symbol}</div>
                  </div>
                </div>
                
                {parseFloat(pool.myStaked) > 0 && (
                  <div className="mt-3 p-2 bg-muted/20 rounded">
                    <div className="flex justify-between text-sm">
                      <span>My Stake:</span>
                      <span className="font-mono">{pool.myStaked} {pool.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending Rewards:</span>
                      <span className="font-mono text-green-400">{pool.pendingRewards} {pool.symbol}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Staking Actions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Stake {selectedPoolData?.symbol}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPoolData && (
              <Tabs defaultValue="stake" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stake">Stake</TabsTrigger>
                  <TabsTrigger value="unstake">Unstake</TabsTrigger>
                </TabsList>

                <TabsContent value="stake" className="space-y-4">
                  <div className="space-y-4">
                    {/* Pool Details */}
                    <div className="p-4 bg-muted/20 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pool:</span>
                        <span className="font-semibold">{selectedPoolData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">APY:</span>
                        <span className="font-semibold text-green-400">{selectedPoolData.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lock Period:</span>
                        <span className="font-semibold">
                          {selectedPoolData.lockPeriod === 0 ? (
                            <Badge variant="outline" className="text-xs">Flexible</Badge>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>{selectedPoolData.lockPeriod} days</span>
                            </div>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Staked:</span>
                        <span className="font-mono">{selectedPoolData.totalStaked} {selectedPoolData.symbol}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Amount to Stake</Label>
                      <Input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder={`Min: ${selectedPoolData.minimumStake} ${selectedPoolData.symbol}`}
                        className="text-right font-mono"
                      />
                      <div className="text-xs text-muted-foreground">
                        Available: 10.5 {selectedPoolData.symbol}
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {["25%", "50%", "75%", "100%"].map((percent) => (
                        <Button
                          key={percent}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const available = 10.5; // Mock available balance
                            const amount = available * parseFloat(percent.replace('%', '')) / 100;
                            setStakeAmount(amount.toFixed(6));
                          }}
                        >
                          {percent}
                        </Button>
                      ))}
                    </div>

                    {/* Reward Calculation */}
                    {stakeAmount && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-sm font-semibold mb-2">Estimated Rewards</div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <div className="text-muted-foreground">Daily</div>
                            <div className="font-semibold text-green-400">
                              {calculateRewards(parseFloat(stakeAmount), selectedPoolData.apy, 1).toFixed(6)} {selectedPoolData.symbol}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Monthly</div>
                            <div className="font-semibold text-green-400">
                              {calculateRewards(parseFloat(stakeAmount), selectedPoolData.apy, 30).toFixed(4)} {selectedPoolData.symbol}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Yearly</div>
                            <div className="font-semibold text-green-400">
                              {calculateRewards(parseFloat(stakeAmount), selectedPoolData.apy, 365).toFixed(2)} {selectedPoolData.symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={!stakeAmount || parseFloat(stakeAmount) < selectedPoolData.minimumStake || stakeMutation.isPending}
                      onClick={() => handleStakeClick(selectedPoolData)}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {stakeMutation.isPending ? "Staking..." : `Stake ${selectedPoolData.symbol}`}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="unstake" className="space-y-4">
                  <div className="space-y-4">
                    {parseFloat(selectedPoolData.myStaked) > 0 ? (
                      <>
                        <div className="p-4 bg-muted/20 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Current Stake:</span>
                            <span className="font-mono">{selectedPoolData.myStaked} {selectedPoolData.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pending Rewards:</span>
                            <span className="font-mono text-green-400">{selectedPoolData.pendingRewards} {selectedPoolData.symbol}</span>
                          </div>
                          {selectedPoolData.lockPeriod > 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lock Status:</span>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                15 days remaining
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Amount to Unstake</Label>
                          <Input
                            type="number"
                            placeholder={`Max: ${selectedPoolData.myStaked} ${selectedPoolData.symbol}`}
                            className="text-right font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Rewards Claimed!",
                                description: `Successfully claimed ${selectedPoolData.pendingRewards} ${selectedPoolData.symbol} rewards`,
                                duration: 3000,
                              });
                            }}
                          >
                            <Gift className="w-4 h-4 mr-2" />
                            Claim Rewards
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              toast({
                                title: "Unstaking Position",
                                description: `Processing unstake of ${selectedPoolData.myStaked} ${selectedPoolData.symbol}`,
                                duration: 3000,
                              });
                            }}
                          >
                            Unstake {selectedPoolData.symbol}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No active stake in this pool
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staking History */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Staking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "stake", amount: "3.5 ETH", pool: "Ethereum 2.0", date: "2024-12-01", status: "Active" },
              { type: "reward", amount: "0.0456 ETH", pool: "Ethereum 2.0", date: "2024-12-10", status: "Claimed" },
              { type: "stake", amount: "50000 NEBX", pool: "NebulaX Token", date: "2024-11-15", status: "Active" },
              { type: "unstake", amount: "0.05 BTC", pool: "Bitcoin", date: "2024-11-10", status: "Completed" },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'stake' ? 'bg-green-400' : 
                    transaction.type === 'reward' ? 'bg-purple-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <div className="font-semibold capitalize">{transaction.type}</div>
                    <div className="text-sm text-muted-foreground">{transaction.pool}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">{transaction.amount}</div>
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                </div>
                <Badge variant={transaction.status === 'Active' ? 'default' : 'outline'}>
                  {transaction.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}