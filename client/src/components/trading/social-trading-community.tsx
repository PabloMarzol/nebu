import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Users, Trophy, Star, TrendingUp, MessageCircle, Copy, Crown, Zap, Target } from "lucide-react";

interface Trader {
  id: string;
  username: string;
  rank: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  monthlyReturn: number;
  badges: string[];
  tier: "bronze" | "silver" | "gold" | "diamond";
  isFollowing: boolean;
  recentTrades: Array<{
    symbol: string;
    type: "buy" | "sell";
    profit: number;
    timestamp: string;
  }>;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export default function SocialTradingCommunity() {
  const [selectedTab, setSelectedTab] = useState("leaderboard");
  const [followedTraders, setFollowedTraders] = useState<Set<string>>(new Set());

  const topTraders: Trader[] = [
    {
      id: "1",
      username: "CryptoKing92",
      rank: 1,
      winRate: 87.5,
      totalTrades: 342,
      followers: 1250,
      monthlyReturn: 45.8,
      badges: ["🏆", "💎", "🔥"],
      tier: "diamond",
      isFollowing: false,
      recentTrades: [
        { symbol: "BTC", type: "buy", profit: 12.5, timestamp: "2 hours ago" },
        { symbol: "ETH", type: "sell", profit: 8.2, timestamp: "4 hours ago" }
      ]
    },
    {
      id: "2",
      username: "DiamondHands",
      rank: 2,
      winRate: 82.3,
      totalTrades: 278,
      followers: 890,
      monthlyReturn: 38.2,
      badges: ["💎", "⚡", "🎯"],
      tier: "gold",
      isFollowing: true,
      recentTrades: [
        { symbol: "SOL", type: "buy", profit: 15.7, timestamp: "1 hour ago" },
        { symbol: "ADA", type: "buy", profit: 6.4, timestamp: "3 hours ago" }
      ]
    },
    {
      id: "3",
      username: "MoonTrader",
      rank: 3,
      winRate: 79.1,
      totalTrades: 195,
      followers: 634,
      monthlyReturn: 32.9,
      badges: ["🌙", "🚀", "⭐"],
      tier: "gold",
      isFollowing: false,
      recentTrades: [
        { symbol: "AVAX", type: "sell", profit: 9.8, timestamp: "30 min ago" }
      ]
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Trade",
      description: "Execute your first trade",
      icon: "🎯",
      rarity: "common",
      progress: 1,
      maxProgress: 1,
      unlocked: true
    },
    {
      id: "2",
      name: "Profitable Week",
      description: "Achieve positive returns for 7 consecutive days",
      icon: "📈",
      rarity: "rare",
      progress: 5,
      maxProgress: 7,
      unlocked: false
    },
    {
      id: "3",
      name: "Diamond Hands",
      description: "Hold a position through 20% volatility",
      icon: "💎",
      rarity: "epic",
      progress: 1,
      maxProgress: 1,
      unlocked: true
    },
    {
      id: "4",
      name: "Community Leader",
      description: "Gain 100 followers",
      icon: "👑",
      rarity: "legendary",
      progress: 23,
      maxProgress: 100,
      unlocked: false
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "diamond": return "text-cyan-400 border-cyan-400";
      case "gold": return "text-yellow-400 border-yellow-400";
      case "silver": return "text-gray-300 border-gray-300";
      default: return "text-orange-400 border-orange-400";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-yellow-400 bg-yellow-500/10";
      case "epic": return "border-purple-400 bg-purple-500/10";
      case "rare": return "border-blue-400 bg-blue-500/10";
      default: return "border-gray-400 bg-gray-500/10";
    }
  };

  const toggleFollow = (traderId: string) => {
    const newFollowed = new Set(followedTraders);
    if (newFollowed.has(traderId)) {
      newFollowed.delete(traderId);
    } else {
      newFollowed.add(traderId);
    }
    setFollowedTraders(newFollowed);
  };

  const copyTrade = (trader: Trader) => {
    console.log(`Copying trades from ${trader.username}`);
    // Implementation for copy trading
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={selectedTab === "leaderboard" ? "default" : "outline"}
          onClick={() => setSelectedTab("leaderboard")}
          className="glass"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboard
        </Button>
        <Button
          variant={selectedTab === "achievements" ? "default" : "outline"}
          onClick={() => setSelectedTab("achievements")}
          className="glass"
        >
          <Star className="w-4 h-4 mr-2" />
          Achievements
        </Button>
        <Button
          variant={selectedTab === "following" ? "default" : "outline"}
          onClick={() => setSelectedTab("following")}
          className="glass"
        >
          <Users className="w-4 h-4 mr-2" />
          Following
        </Button>
      </div>

      {selectedTab === "leaderboard" && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Trading Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTraders.map((trader) => (
                <Card key={trader.id} className="glass-strong border-purple-500/20 hover:border-purple-400/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                              {trader.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {trader.rank === 1 && <Crown className="absolute -top-2 -right-1 w-4 h-4 text-yellow-400" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">#{trader.rank}</span>
                            <span className="font-bold">{trader.username}</span>
                            <Badge variant="outline" className={getTierColor(trader.tier)}>
                              {trader.tier}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {trader.badges.map((badge, index) => (
                              <span key={index} className="text-sm">{badge}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={followedTraders.has(trader.id) ? "default" : "outline"}
                          onClick={() => toggleFollow(trader.id)}
                          className="glass"
                        >
                          {followedTraders.has(trader.id) ? "Following" : "Follow"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyTrade(trader)}
                          className="glass"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{trader.winRate}%</div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{trader.totalTrades}</div>
                        <div className="text-xs text-muted-foreground">Total Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">{trader.followers}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">+{trader.monthlyReturn}%</div>
                        <div className="text-xs text-muted-foreground">Monthly Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{trader.recentTrades.length}</div>
                        <div className="text-xs text-muted-foreground">Recent Trades</div>
                      </div>
                    </div>

                    <div className="border-t border-purple-500/20 pt-3">
                      <div className="text-sm font-semibold mb-2">Recent Activity</div>
                      <div className="space-y-1">
                        {trader.recentTrades.slice(0, 2).map((trade, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span>{trade.type.toUpperCase()} {trade.symbol}</span>
                            <span className="text-green-400">+{trade.profit}%</span>
                            <span className="text-muted-foreground">{trade.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === "achievements" && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Achievement Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`p-4 text-center ${getRarityColor(achievement.rarity)} ${achievement.unlocked ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <Badge className="bg-green-500 text-white">Unlocked!</Badge>
                  ) : (
                    <div className="space-y-2">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2" 
                      />
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity).split(' ')[0]}`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === "following" && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Following ({followedTraders.size})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {followedTraders.size === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You're not following any traders yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Start following top traders to copy their strategies!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topTraders
                  .filter(trader => followedTraders.has(trader.id))
                  .map((trader) => (
                    <Card key={trader.id} className="glass-strong p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                              {trader.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{trader.username}</div>
                            <div className="text-sm text-green-400">+{trader.monthlyReturn}% this month</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFollow(trader.id)}
                          className="glass"
                        >
                          Unfollow
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Community Stats */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Community Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">2,847</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">15,293</div>
              <div className="text-sm text-muted-foreground">Total Trades Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">+8.7%</div>
              <div className="text-sm text-muted-foreground">Avg Community Return</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">1,234</div>
              <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}