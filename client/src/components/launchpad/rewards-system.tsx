import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Gift, 
  Zap, 
  Target, 
  Award, 
  Crown, 
  Flame,
  TrendingUp,
  Calendar,
  Users,
  Coins
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface RewardTier {
  level: number;
  name: string;
  pointsRequired: number;
  multiplier: number;
  color: string;
  benefits: string[];
  unlocked: boolean;
}

interface LaunchReward {
  id: string;
  projectName: string;
  rewardType: "allocation_bonus" | "fee_discount" | "early_access" | "airdrop" | "nft";
  amount: string;
  description: string;
  claimed: boolean;
  expiresAt: string;
}

interface GameStats {
  totalPoints: number;
  currentLevel: number;
  launchesParticipated: number;
  totalInvested: number;
  successfulLaunches: number;
  streak: number;
  rank: number;
  totalUsers: number;
}

export default function RewardsSystem() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showClaimEffect, setShowClaimEffect] = useState(false);

  const gameStats: GameStats = {
    totalPoints: 2450,
    currentLevel: 5,
    launchesParticipated: 12,
    totalInvested: 45000,
    successfulLaunches: 8,
    streak: 3,
    rank: 127,
    totalUsers: 15420
  };

  const rewardTiers: RewardTier[] = [
    {
      level: 1,
      name: "Explorer",
      pointsRequired: 0,
      multiplier: 1.0,
      color: "text-gray-400",
      benefits: ["Basic rewards", "Standard allocation"],
      unlocked: true
    },
    {
      level: 2,
      name: "Trader",
      pointsRequired: 500,
      multiplier: 1.1,
      color: "text-green-400",
      benefits: ["10% bonus allocation", "Priority queue"],
      unlocked: true
    },
    {
      level: 3,
      name: "Investor",
      pointsRequired: 1000,
      multiplier: 1.25,
      color: "text-blue-400",
      benefits: ["25% bonus allocation", "Reduced fees", "Early access"],
      unlocked: true
    },
    {
      level: 4,
      name: "Whale",
      pointsRequired: 2000,
      multiplier: 1.5,
      color: "text-purple-400",
      benefits: ["50% bonus allocation", "VIP support", "Exclusive launches"],
      unlocked: true
    },
    {
      level: 5,
      name: "Legend",
      pointsRequired: 5000,
      multiplier: 2.0,
      color: "text-yellow-400",
      benefits: ["100% bonus allocation", "Zero fees", "Governance rights"],
      unlocked: false
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "first_launch",
      name: "First Launch",
      description: "Participate in your first token launch",
      icon: Zap,
      rarity: "common",
      points: 100,
      unlocked: true,
      unlockedAt: "2024-11-15"
    },
    {
      id: "early_bird",
      name: "Early Bird",
      description: "Be among the first 100 participants in a launch",
      icon: Crown,
      rarity: "rare",
      points: 250,
      unlocked: true,
      unlockedAt: "2024-11-18"
    },
    {
      id: "whale_hunter",
      name: "Whale Hunter",
      description: "Invest over $10,000 in a single launch",
      icon: Trophy,
      rarity: "epic",
      points: 500,
      unlocked: true,
      unlockedAt: "2024-11-22"
    },
    {
      id: "streak_master",
      name: "Streak Master",
      description: "Participate in 5 consecutive successful launches",
      icon: Flame,
      rarity: "legendary",
      points: 1000,
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: "community_leader",
      name: "Community Leader",
      description: "Refer 10 users who participate in launches",
      icon: Users,
      rarity: "epic",
      points: 750,
      unlocked: false,
      progress: 6,
      maxProgress: 10
    },
    {
      id: "diamond_hands",
      name: "Diamond Hands",
      description: "Hold tokens for 6 months after launch",
      icon: Award,
      rarity: "legendary",
      points: 1200,
      unlocked: false,
      progress: 2,
      maxProgress: 6
    }
  ];

  const availableRewards: LaunchReward[] = [
    {
      id: "solarcoin_bonus",
      projectName: "SolarCoin",
      rewardType: "allocation_bonus",
      amount: "25%",
      description: "Extra allocation bonus for SolarCoin ICO",
      claimed: false,
      expiresAt: "2024-12-20"
    },
    {
      id: "gamefi_airdrop",
      projectName: "GameFi Protocol",
      rewardType: "airdrop",
      amount: "500 GFP",
      description: "Exclusive airdrop for early supporters",
      claimed: false,
      expiresAt: "2024-12-25"
    },
    {
      id: "healthchain_nft",
      projectName: "HealthChain",
      rewardType: "nft",
      amount: "1 NFT",
      description: "Limited edition HealthChain founder NFT",
      claimed: true,
      expiresAt: "2024-12-15"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400 border-gray-400";
      case "rare": return "text-blue-400 border-blue-400";
      case "epic": return "text-purple-400 border-purple-400";
      case "legendary": return "text-yellow-400 border-yellow-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-400/10";
      case "rare": return "bg-blue-400/10";
      case "epic": return "bg-purple-400/10";
      case "legendary": return "bg-yellow-400/10";
      default: return "bg-gray-400/10";
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "allocation_bonus": return <TrendingUp className="w-4 h-4" />;
      case "fee_discount": return <Coins className="w-4 h-4" />;
      case "early_access": return <Calendar className="w-4 h-4" />;
      case "airdrop": return <Gift className="w-4 h-4" />;
      case "nft": return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const claimReward = (rewardId: string) => {
    setShowClaimEffect(true);
    setTimeout(() => setShowClaimEffect(false), 2000);
    // Simulate claiming reward
  };

  const currentTier = rewardTiers.find(tier => tier.level === gameStats.currentLevel) || rewardTiers[0];
  const nextTier = rewardTiers.find(tier => tier.level === gameStats.currentLevel + 1);
  const progressToNext = nextTier ? 
    ((gameStats.totalPoints - currentTier.pointsRequired) / (nextTier.pointsRequired - currentTier.pointsRequired)) * 100 
    : 100;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Launch Rewards
          </span>
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Earn points, unlock achievements, and claim exclusive rewards through token launch participation
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{gameStats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">#{gameStats.rank}</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{gameStats.streak}</div>
              <div className="text-sm text-muted-foreground">Win Streak</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{gameStats.successfulLaunches}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Level & Progress */}
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className={`w-5 h-5 ${currentTier.color}`} />
                <span>Level {currentTier.level}: {currentTier.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {gameStats.totalPoints.toLocaleString()} / {nextTier?.pointsRequired.toLocaleString() || "MAX"} points
                  </span>
                  <span className="text-sm font-semibold">{currentTier.multiplier}x Multiplier</span>
                </div>
                
                {nextTier && (
                  <div className="space-y-2">
                    <Progress value={progressToNext} className="h-3" />
                    <div className="text-center text-sm text-muted-foreground">
                      {(nextTier.pointsRequired - gameStats.totalPoints).toLocaleString()} points to {nextTier.name}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Benefits</h4>
                    <div className="space-y-1">
                      {currentTier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {nextTier && (
                    <div>
                      <h4 className="font-semibold mb-2">Next Level Benefits</h4>
                      <div className="space-y-1">
                        {nextTier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-muted rounded-full" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="font-semibold">Whale Hunter Unlocked!</div>
                      <div className="text-sm text-muted-foreground">+500 points</div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-400/20 text-yellow-400">+500</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold">SolarCoin Participation</div>
                      <div className="text-sm text-muted-foreground">+150 points</div>
                    </div>
                  </div>
                  <Badge className="bg-green-400/20 text-green-400">+150</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-semibold">Early Bird Bonus</div>
                      <div className="text-sm text-muted-foreground">+100 points</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-400/20 text-blue-400">+100</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`glass relative overflow-hidden transition-all ${
                  achievement.unlocked ? getRarityBg(achievement.rarity) : 'opacity-60'
                } ${getRarityColor(achievement.rarity)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <achievement.icon className={`w-8 h-8 ${achievement.unlocked ? '' : 'text-muted-foreground'}`} />
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold">{achievement.points}</span>
                    </div>
                    
                    {achievement.unlocked ? (
                      <Badge className="bg-green-600 text-white text-xs">
                        Unlocked
                      </Badge>
                    ) : achievement.progress !== undefined ? (
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Locked
                      </Badge>
                    )}
                  </div>
                  
                  {achievement.progress !== undefined && !achievement.unlocked && (
                    <div className="mt-2">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress!) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className={`glass ${reward.claimed ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getRewardIcon(reward.rewardType)}
                    <span>{reward.projectName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">{reward.amount}</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                      </div>
                      <Badge 
                        variant={reward.rewardType === 'allocation_bonus' ? 'default' : 
                               reward.rewardType === 'airdrop' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {reward.rewardType.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={reward.claimed}
                      onClick={() => claimReward(reward.id)}
                    >
                      {reward.claimed ? 'Claimed' : 'Claim Reward'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, username: "CryptoWhale", points: 15420, level: 8, badge: "👑" },
                  { rank: 2, username: "TokenHunter", points: 12350, level: 7, badge: "🥈" },
                  { rank: 3, username: "LaunchMaster", points: 9870, level: 6, badge: "🥉" },
                  { rank: 4, username: "DiamondHands", points: 8500, level: 6, badge: "💎" },
                  { rank: 5, username: "EarlyBird", points: 7200, level: 5, badge: "🚀" },
                  { rank: gameStats.rank, username: "You", points: gameStats.totalPoints, level: gameStats.currentLevel, badge: "⭐" }
                ].map((user, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.username === "You" ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{user.badge}</span>
                        <span className="font-bold">#{user.rank}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-muted-foreground">Level {user.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{user.points.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Claim Effect */}
      {showClaimEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce">
            <div className="text-6xl">🎉</div>
          </div>
        </div>
      )}
    </div>
  );
}