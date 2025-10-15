import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Lock, Calendar, Star, Zap } from "lucide-react";

interface VotingTier {
  name: string;
  minTokens: number;
  multiplier: number;
  color: string;
  perks: string[];
}

interface StakingBonus {
  duration: number; // in days
  multiplier: number;
  label: string;
}

export default function VotingPowerCalculator() {
  const [tokenBalance, setTokenBalance] = useState("");
  const [stakedTokens, setStakedTokens] = useState("");
  const [stakingDuration, setStakingDuration] = useState(0);
  const [tradingVolume, setTradingVolume] = useState("");
  const [accountAge, setAccountAge] = useState("");

  const votingTiers: VotingTier[] = [
    {
      name: "Bronze",
      minTokens: 1000,
      multiplier: 1.0,
      color: "text-orange-400",
      perks: ["Basic voting rights", "Community access"]
    },
    {
      name: "Silver", 
      minTokens: 10000,
      multiplier: 1.5,
      color: "text-gray-300",
      perks: ["1.5x voting power", "Priority support", "Early proposal access"]
    },
    {
      name: "Gold",
      minTokens: 50000,
      multiplier: 2.0,
      color: "text-yellow-400",
      perks: ["2x voting power", "VIP support", "Beta features", "Proposal fee discount"]
    },
    {
      name: "Platinum",
      minTokens: 100000,
      multiplier: 3.0,
      color: "text-purple-400",
      perks: ["3x voting power", "Personal manager", "Governance committee", "Free proposals"]
    },
    {
      name: "Diamond",
      minTokens: 500000,
      multiplier: 5.0,
      color: "text-cyan-400",
      perks: ["5x voting power", "Exclusive events", "Direct team access", "Revenue sharing"]
    }
  ];

  const stakingBonuses: StakingBonus[] = [
    { duration: 0, multiplier: 1.0, label: "No staking" },
    { duration: 30, multiplier: 1.1, label: "30 days" },
    { duration: 90, multiplier: 1.25, label: "90 days" },
    { duration: 180, multiplier: 1.5, label: "180 days" },
    { duration: 365, multiplier: 2.0, label: "1 year" }
  ];

  const getCurrentTier = (balance: number): VotingTier => {
    for (let i = votingTiers.length - 1; i >= 0; i--) {
      if (balance >= votingTiers[i].minTokens) {
        return votingTiers[i];
      }
    }
    return votingTiers[0];
  };

  const getStakingBonus = (duration: number): number => {
    for (let i = stakingBonuses.length - 1; i >= 0; i--) {
      if (duration >= stakingBonuses[i].duration) {
        return stakingBonuses[i].multiplier;
      }
    }
    return 1.0;
  };

  const calculateVotingPower = () => {
    const balance = parseFloat(tokenBalance) || 0;
    const staked = parseFloat(stakedTokens) || 0;
    const volume = parseFloat(tradingVolume) || 0;
    const age = parseFloat(accountAge) || 0;

    const totalTokens = balance + staked;
    const currentTier = getCurrentTier(totalTokens);
    const stakingBonus = getStakingBonus(stakingDuration);
    
    // Base voting power
    let votingPower = totalTokens * currentTier.multiplier;
    
    // Staking bonus
    votingPower *= stakingBonus;
    
    // Trading volume bonus (up to 20% extra)
    const volumeBonus = Math.min(volume / 1000000, 0.2); // 1M volume = 20% bonus
    votingPower *= (1 + volumeBonus);
    
    // Account age bonus (up to 10% extra)
    const ageBonus = Math.min(age / 365, 0.1); // 1 year = 10% bonus
    votingPower *= (1 + ageBonus);

    return {
      votingPower: Math.floor(votingPower),
      tier: currentTier,
      stakingBonus,
      volumeBonus,
      ageBonus,
      totalTokens
    };
  };

  const result = calculateVotingPower();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Voting Power Calculator
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Calculate your voting power based on token holdings, staking, and platform activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Your Holdings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tokenBalance">Token Balance (NEBX)</Label>
              <Input
                id="tokenBalance"
                type="number"
                value={tokenBalance}
                onChange={(e) => setTokenBalance(e.target.value)}
                placeholder="Enter your token balance"
                className="text-right font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakedTokens">Staked Tokens (NEBX)</Label>
              <Input
                id="stakedTokens"
                type="number"
                value={stakedTokens}
                onChange={(e) => setStakedTokens(e.target.value)}
                placeholder="Enter staked amount"
                className="text-right font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Staking Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                {stakingBonuses.map((bonus) => (
                  <Button
                    key={bonus.duration}
                    size="sm"
                    variant={stakingDuration === bonus.duration ? "default" : "outline"}
                    onClick={() => setStakingDuration(bonus.duration)}
                    className="text-xs"
                  >
                    {bonus.label}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {((bonus.multiplier - 1) * 100).toFixed(0)}%
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradingVolume">30-Day Trading Volume (USDT)</Label>
              <Input
                id="tradingVolume"
                type="number"
                value={tradingVolume}
                onChange={(e) => setTradingVolume(e.target.value)}
                placeholder="Your monthly trading volume"
                className="text-right font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountAge">Account Age (Days)</Label>
              <Input
                id="accountAge"
                type="number"
                value={accountAge}
                onChange={(e) => setAccountAge(e.target.value)}
                placeholder="Days since account creation"
                className="text-right font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Voting Power Result */}
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Your Voting Power</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {result.votingPower.toLocaleString()}
                </div>
                <div className="text-lg text-muted-foreground">Voting Points</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Tier:</span>
                  <Badge className={`${result.tier.color} bg-opacity-20`}>
                    {result.tier.name}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Base Multiplier:</span>
                  <span className="font-semibold">{result.tier.multiplier}x</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Staking Bonus:</span>
                  <span className="font-semibold text-green-400">
                    +{((result.stakingBonus - 1) * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Volume Bonus:</span>
                  <span className="font-semibold text-blue-400">
                    +{(result.volumeBonus * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Loyalty Bonus:</span>
                  <span className="font-semibold text-cyan-400">
                    +{(result.ageBonus * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Benefits */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Tier Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.tier.perks.map((perk, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-sm">{perk}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tier Progression */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Tier Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {votingTiers.map((tier, index) => {
              const isCurrentTier = tier.name === result.tier.name;
              const isAchieved = result.totalTokens >= tier.minTokens;
              const progressToNext = index < votingTiers.length - 1 ? 
                Math.min((result.totalTokens / tier.minTokens) * 100, 100) : 100;

              return (
                <div key={tier.name} className={`p-4 rounded-lg border ${
                  isCurrentTier ? 'border-purple-500 bg-purple-500/10' : 'border-border'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${tier.color} bg-opacity-20`}>
                        {tier.name}
                      </Badge>
                      <span className="font-semibold">{tier.multiplier}x Multiplier</span>
                      {isCurrentTier && (
                        <Badge variant="default" className="text-xs">CURRENT</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {tier.minTokens.toLocaleString()} NEBX
                    </span>
                  </div>

                  {!isAchieved && index === votingTiers.findIndex(t => t.name === result.tier.name) + 1 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to {tier.name}</span>
                        <span>{result.totalTokens.toLocaleString()} / {tier.minTokens.toLocaleString()}</span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {(tier.minTokens - result.totalTokens).toLocaleString()} NEBX needed
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {tier.perks.map((perk, perkIndex) => (
                      <Badge key={perkIndex} variant="outline" className="text-xs">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips for Increasing Voting Power */}
      <Card className="glass border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Boost Your Voting Power</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Stake Tokens</h4>
              <p className="text-sm text-muted-foreground">
                Lock tokens for up to 2x staking bonus
              </p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Trade More</h4>
              <p className="text-sm text-muted-foreground">
                Higher volume gives up to 20% bonus
              </p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Stay Loyal</h4>
              <p className="text-sm text-muted-foreground">
                Longer membership adds 10% bonus
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}