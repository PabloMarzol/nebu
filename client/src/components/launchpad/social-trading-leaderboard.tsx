import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Target,
  Star,
  Medal,
  Crown,
  Zap,
  Shield,
  Flame,
  Award,
  Calendar,
  BarChart3,
  Activity,
  Coins,
  Brain,
  Globe,
  Lock,
  CheckCircle
} from "lucide-react";

interface TraderProfile {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  score: number;
  totalReturn: number;
  winRate: number;
  followers: number;
  following: number;
  tradesCount: number;
  level: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  badges: Achievement[];
  streakDays: number;
  country: string;
  joinedDate: string;
  isFollowing?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  tier: "Bronze" | "Silver" | "Gold" | "Legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  category: "Trading" | "Social" | "Education" | "Participation" | "Special";
}

interface LeaderboardPeriod {
  period: "daily" | "weekly" | "monthly" | "all-time";
  label: string;
}

export default function SocialTradingLeaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod["period"]>("weekly");
  const [selectedTab, setSelectedTab] = useState("leaderboard");
  const [userProfile] = useState<TraderProfile>({
    id: "user-1",
    username: "CryptoTrader2024",
    avatar: "",
    rank: 47,
    score: 2847,
    totalReturn: 34.7,
    winRate: 73.2,
    followers: 156,
    following: 89,
    tradesCount: 234,
    level: 12,
    tier: "Gold",
    badges: [],
    streakDays: 14,
    country: "US",
    joinedDate: "2024-01-15"
  });

  const periods: LeaderboardPeriod[] = [
    { period: "daily", label: "Today" },
    { period: "weekly", label: "This Week" },
    { period: "monthly", label: "This Month" },
    { period: "all-time", label: "All Time" }
  ];

  const topTraders: TraderProfile[] = [
    {
      id: "1",
      username: "CryptoKing",
      avatar: "",
      rank: 1,
      score: 12847,
      totalReturn: 156.8,
      winRate: 89.3,
      followers: 2847,
      following: 234,
      tradesCount: 1247,
      level: 45,
      tier: "Diamond",
      badges: [],
      streakDays: 67,
      country: "SG",
      joinedDate: "2023-03-10"
    },
    {
      id: "2",
      username: "DeFiMaster",
      avatar: "",
      rank: 2,
      score: 11234,
      totalReturn: 142.3,
      winRate: 85.7,
      followers: 1934,
      following: 189,
      tradesCount: 987,
      level: 42,
      tier: "Diamond",
      badges: [],
      streakDays: 45,
      country: "GB",
      joinedDate: "2023-05-22"
    },
    {
      id: "3",
      username: "BlockchainPro",
      avatar: "",
      rank: 3,
      score: 9876,
      totalReturn: 128.9,
      winRate: 82.1,
      followers: 1567,
      following: 156,
      tradesCount: 834,
      level: 38,
      tier: "Platinum",
      badges: [],
      streakDays: 38,
      country: "DE",
      joinedDate: "2023-07-08"
    },
    {
      id: "4",
      username: "AltcoinExpert",
      avatar: "",
      rank: 4,
      score: 8945,
      totalReturn: 115.6,
      winRate: 79.4,
      followers: 1234,
      following: 134,
      tradesCount: 723,
      level: 35,
      tier: "Platinum",
      badges: [],
      streakDays: 29,
      country: "JP",
      joinedDate: "2023-08-15"
    },
    {
      id: "5",
      username: "TradingGuru",
      avatar: "",
      rank: 5,
      score: 8234,
      totalReturn: 108.2,
      winRate: 76.8,
      followers: 998,
      following: 112,
      tradesCount: 645,
      level: 32,
      tier: "Gold",
      badges: [],
      streakDays: 23,
      country: "CA",
      joinedDate: "2023-09-03"
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "first-trade",
      name: "First Steps",
      description: "Complete your first trade",
      icon: Target,
      color: "text-blue-400",
      tier: "Bronze",
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedDate: "2024-01-15",
      category: "Trading"
    },
    {
      id: "win-streak-5",
      name: "Hot Streak",
      description: "Win 5 trades in a row",
      icon: Flame,
      color: "text-orange-400",
      tier: "Silver",
      progress: 5,
      maxProgress: 5,
      unlocked: true,
      unlockedDate: "2024-02-08",
      category: "Trading"
    },
    {
      id: "education-master",
      name: "Knowledge Seeker",
      description: "Complete all education modules",
      icon: Brain,
      color: "text-purple-400",
      tier: "Gold",
      progress: 4,
      maxProgress: 6,
      unlocked: false,
      category: "Education"
    },
    {
      id: "social-butterfly",
      name: "Social Butterfly",
      description: "Get 100 followers",
      icon: Users,
      color: "text-green-400",
      tier: "Silver",
      progress: 156,
      maxProgress: 100,
      unlocked: true,
      unlockedDate: "2024-03-12",
      category: "Social"
    },
    {
      id: "diamond-hands",
      name: "Diamond Hands",
      description: "Hold a position for 30 days",
      icon: Shield,
      color: "text-cyan-400",
      tier: "Gold",
      progress: 14,
      maxProgress: 30,
      unlocked: false,
      category: "Trading"
    },
    {
      id: "voting-champion",
      name: "Democracy Defender",
      description: "Participate in 25 governance votes",
      icon: CheckCircle,
      color: "text-indigo-400",
      tier: "Silver",
      progress: 18,
      maxProgress: 25,
      unlocked: false,
      category: "Participation"
    },
    {
      id: "launchpad-legend",
      name: "Launchpad Legend",
      description: "Participate in 10 token launches",
      icon: Zap,
      color: "text-yellow-400",
      tier: "Gold",
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      category: "Participation"
    },
    {
      id: "global-trader",
      name: "Global Trader",
      description: "Trade on 5 different chains",
      icon: Globe,
      color: "text-pink-400",
      tier: "Legendary",
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      category: "Trading"
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze": return "text-amber-600 border-amber-600 bg-amber-600/10";
      case "Silver": return "text-gray-400 border-gray-400 bg-gray-400/10";
      case "Gold": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "Platinum": return "text-purple-400 border-purple-400 bg-purple-400/10";
      case "Diamond": return "text-cyan-400 border-cyan-400 bg-cyan-400/10";
      case "Legendary": return "text-pink-400 border-pink-400 bg-pink-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      "US": "🇺🇸", "SG": "🇸🇬", "GB": "🇬🇧", "DE": "🇩🇪", "JP": "🇯🇵", "CA": "🇨🇦"
    };
    return flags[countryCode] || "🌍";
  };

  return (
    <div>
      {/* User Rank Card */}
      <Card className="glass border-blue-500/30 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>Your Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                    {userProfile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <Badge className={`${getTierColor(userProfile.tier)} text-xs px-1`}>
                    {userProfile.tier}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{userProfile.username}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Rank #{userProfile.rank}</span>
                  <span>Level {userProfile.level}</span>
                  <span>{getCountryFlag(userProfile.country)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">+{userProfile.totalReturn}%</div>
                <div className="text-xs text-muted-foreground">Total Return</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{userProfile.winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{userProfile.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{userProfile.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="social">Social Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* Period Selector */}
          <div className="flex justify-center space-x-2">
            {periods.map((period) => (
              <Button
                key={period.period}
                size="sm"
                variant={selectedPeriod === period.period ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period.period)}
              >
                {period.label}
              </Button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <Card className="glass border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-center">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-end space-x-8">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xl">
                        {topTraders[1].username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      <Medal className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="font-bold">{topTraders[1].username}</h3>
                  <div className="text-green-400 font-semibold">+{topTraders[1].totalReturn}%</div>
                  <Badge className={getTierColor(topTraders[1].tier)} variant="outline">
                    {topTraders[1].tier}
                  </Badge>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl">
                        {topTraders[0].username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-3 -right-3">
                      <Crown className="w-10 h-10 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{topTraders[0].username}</h3>
                  <div className="text-green-400 font-semibold text-lg">+{topTraders[0].totalReturn}%</div>
                  <Badge className={getTierColor(topTraders[0].tier)} variant="outline">
                    {topTraders[0].tier}
                  </Badge>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarFallback className="bg-gradient-to-br from-amber-600 to-orange-700 text-white text-xl">
                        {topTraders[2].username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      <Medal className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="font-bold">{topTraders[2].username}</h3>
                  <div className="text-green-400 font-semibold">+{topTraders[2].totalReturn}%</div>
                  <Badge className={getTierColor(topTraders[2].tier)} variant="outline">
                    {topTraders[2].tier}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Rankings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Full Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTraders.map((trader) => (
                  <div key={trader.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 flex justify-center">
                        {getRankIcon(trader.rank)}
                      </div>
                      
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {trader.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{trader.username}</h4>
                          <span className="text-sm">{getCountryFlag(trader.country)}</span>
                          <Badge variant="outline" className={`${getTierColor(trader.tier)} text-xs`}>
                            {trader.tier}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Level {trader.level} • {trader.followers} followers
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">+{trader.totalReturn}%</div>
                        <div className="text-sm text-muted-foreground">Return</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold">{trader.winRate}%</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-400">{trader.score}</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                      </div>

                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Progress */}
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-purple-400" />
                <span>Achievement Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {achievements.filter(a => a.unlocked).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Unlocked</div>
                </div>
                
                <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {achievements.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`glass transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-border opacity-80'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-green-500/20' 
                          : 'bg-muted/20'
                      }`}>
                        {achievement.unlocked ? (
                          <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <Badge className={getTierColor(achievement.tier)} variant="outline">
                          {achievement.tier}
                        </Badge>
                      </div>
                    </div>
                    
                    {achievement.unlocked && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Progress</span>
                      <span className="text-sm">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>

                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="text-xs text-green-400">
                      Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-green-400" />
                <span>Social Trading Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Social Feed Items */}
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        CK
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">CryptoKing</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">
                    Just completed a successful swing trade on ETH. +12.5% in 3 days! 
                    The key was waiting for the RSI oversold signal.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>24 likes</span>
                    <span>8 comments</span>
                    <span>5 shares</span>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                        DM
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">DeFiMaster</div>
                      <div className="text-xs text-muted-foreground">4 hours ago</div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">
                    New yield farming opportunity discovered! NEBX-USDC pool offering 45% APY. 
                    DYOR but looks promising!
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>18 likes</span>
                    <span>12 comments</span>
                    <span>7 shares</span>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        BP
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">BlockchainPro</div>
                      <div className="text-xs text-muted-foreground">6 hours ago</div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">
                    Achievement unlocked: Diamond Hands! 
                    Held my BTC position for 30 days despite the volatility. Patience pays off!
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>31 likes</span>
                    <span>15 comments</span>
                    <span>9 shares</span>
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