import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users,
  UserPlus,
  TrendingUp,
  Trophy,
  Gift,
  Copy,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Award,
  Target,
  DollarSign,
  Percent,
  Calendar,
  Crown,
  Zap,
  ChevronUp,
  ChevronDown,
  Filter,
  Search,
  Bell,
  Settings
} from "lucide-react";

interface Trader {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  rank: number;
  level: string;
  followers: number;
  following: number;
  totalReturn: number;
  winRate: number;
  activeStreak: number;
  copiers: number;
  aum: number; // Assets under management
  riskScore: number;
  joinDate: string;
  badges: string[];
  recentTrades: number;
  isFollowing: boolean;
}

interface SocialTrade {
  id: string;
  trader: Trader;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
  timestamp: string;
  pnl?: number;
  confidence: number;
  analysis: string;
  likes: number;
  comments: number;
  copies: number;
  isLiked: boolean;
  tags: string[];
}

interface ReferralReward {
  id: string;
  type: "signup" | "first_trade" | "volume_milestone" | "friend_achievement";
  description: string;
  amount: number;
  currency: "USDT" | "BTC" | "points";
  status: "pending" | "claimed" | "completed";
  friendName?: string;
  claimedDate?: string;
  requirements?: string;
}

export default function SocialTradingNetwork() {
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showCopyTradeModal, setShowCopyTradeModal] = useState(false);

  const currentUser = {
    username: "crypto_enthusiast",
    followers: 145,
    following: 89,
    referrals: 7,
    totalRewards: 2450,
    pendingRewards: 350
  };

  const topTraders: Trader[] = [
    {
      id: "1",
      username: "crypto_master_2024",
      displayName: "Alex Chen",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rank: 1,
      level: "Diamond",
      followers: 12450,
      following: 245,
      totalReturn: 234.5,
      winRate: 78.3,
      activeStreak: 12,
      copiers: 1240,
      aum: 2340000,
      riskScore: 6.2,
      joinDate: "2023-01-15",
      badges: ["Top Performer", "Consistent Trader", "Risk Manager"],
      recentTrades: 156,
      isFollowing: false
    },
    {
      id: "2", 
      username: "defi_strategist",
      displayName: "Sarah Rodriguez",
      avatar: "/api/placeholder/40/40",
      verified: true,
      rank: 2,
      level: "Platinum",
      followers: 8920,
      following: 167,
      totalReturn: 189.3,
      winRate: 82.1,
      activeStreak: 8,
      copiers: 890,
      aum: 1890000,
      riskScore: 4.8,
      joinDate: "2023-03-22",
      badges: ["DeFi Expert", "Low Risk", "Mentor"],
      recentTrades: 134,
      isFollowing: true
    },
    {
      id: "3",
      username: "swing_trader_pro",
      displayName: "Mike Johnson",
      avatar: "/api/placeholder/40/40",
      verified: false,
      rank: 3,
      level: "Gold",
      followers: 5670,
      following: 234,
      totalReturn: 167.8,
      winRate: 74.5,
      activeStreak: 15,
      copiers: 567,
      aum: 890000,
      riskScore: 7.1,
      joinDate: "2023-05-10",
      badges: ["Swing Master", "High Volume"],
      recentTrades: 89,
      isFollowing: false
    }
  ];

  const socialFeed: SocialTrade[] = [
    {
      id: "1",
      trader: topTraders[0],
      type: "buy",
      asset: "BTC",
      amount: 0.5,
      price: 43250,
      timestamp: "2024-01-15 14:30:00",
      pnl: 1250.50,
      confidence: 85,
      analysis: "Strong support at $42,800. RSI oversold on 4H. Target $45,500.",
      likes: 247,
      comments: 18,
      copies: 89,
      isLiked: false,
      tags: ["Technical Analysis", "Swing Trade", "BTC"]
    },
    {
      id: "2",
      trader: topTraders[1],
      type: "sell",
      asset: "ETH",
      amount: 8.2,
      price: 2680,
      timestamp: "2024-01-15 13:15:00",
      pnl: -180.25,
      confidence: 70,
      analysis: "Taking profits at resistance. Expecting pullback to $2,550 area.",
      likes: 134,
      comments: 22,
      copies: 45,
      isLiked: true,
      tags: ["Profit Taking", "ETH", "Resistance"]
    },
    {
      id: "3",
      trader: topTraders[2],
      type: "buy",
      asset: "SOL",
      amount: 150,
      price: 98.50,
      timestamp: "2024-01-15 11:45:00",
      confidence: 92,
      analysis: "Ecosystem growth + upcoming airdrops. Strong fundamentals.",
      likes: 89,
      comments: 12,
      copies: 67,
      isLiked: false,
      tags: ["Fundamental", "SOL", "Long Term"]
    }
  ];

  const referralRewards: ReferralReward[] = [
    {
      id: "1",
      type: "signup",
      description: "Friend signup bonus",
      amount: 50,
      currency: "USDT",
      status: "completed",
      friendName: "Emma Wilson",
      claimedDate: "2024-01-14",
      requirements: "Friend completes KYC verification"
    },
    {
      id: "2",
      type: "first_trade",
      description: "First trade bonus",
      amount: 25,
      currency: "USDT",
      status: "completed",
      friendName: "David Kim",
      claimedDate: "2024-01-13",
      requirements: "Friend executes first trade of $100+"
    },
    {
      id: "3",
      type: "volume_milestone",
      description: "Trading volume milestone",
      amount: 100,
      currency: "USDT",
      status: "pending",
      friendName: "Lisa Zhang",
      requirements: "Friend reaches $10,000 trading volume"
    },
    {
      id: "4",
      type: "friend_achievement",
      description: "Achievement unlock bonus",
      amount: 500,
      currency: "points",
      status: "claimed",
      friendName: "Alex Thompson",
      claimedDate: "2024-01-12",
      requirements: "Friend unlocks 'Trading Master' achievement"
    }
  ];

  const copyTrade = (tradeId: string, trader: Trader) => {
    console.log(`Copying trade ${tradeId} from ${trader.username}`);
    // Implementation for copy trading
  };

  const followTrader = (traderId: string) => {
    console.log(`Following trader ${traderId}`);
    // Implementation for following
  };

  const likeTrade = (tradeId: string) => {
    console.log(`Liking trade ${tradeId}`);
    // Implementation for liking
  };

  const shareReferralCode = () => {
    const referralCode = "NEBULA_" + currentUser.username.toUpperCase();
    navigator.clipboard.writeText(`Join NebulaX with my referral code: ${referralCode} and get $50 bonus!`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Diamond": return "text-blue-400 bg-blue-400/10";
      case "Platinum": return "text-purple-400 bg-purple-400/10";
      case "Gold": return "text-yellow-400 bg-yellow-400/10";
      case "Silver": return "text-gray-400 bg-gray-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getRewardStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "claimed": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Trading Overview */}
      <Card className="glass border-blue-500/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-400 mb-1">{currentUser.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>

            <div className="text-center">
              <UserPlus className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400 mb-1">{currentUser.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>

            <div className="text-center">
              <Gift className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-400 mb-1">{currentUser.referrals}</div>
              <div className="text-sm text-muted-foreground">Referrals</div>
            </div>

            <div className="text-center">
              <DollarSign className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                ${currentUser.totalRewards}
              </div>
              <div className="text-sm text-muted-foreground">Total Rewards</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Social Feed</TabsTrigger>
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="referrals">Referral Program</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Feed Filters */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search trades, traders, or assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <select 
                  className="px-3 py-2 bg-background border border-border rounded text-sm"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Trades</option>
                  <option value="following">Following Only</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Social Feed */}
          <div className="space-y-4">
            {socialFeed.map((trade) => (
              <Card key={trade.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={trade.trader.avatar} />
                      <AvatarFallback>{trade.trader.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{trade.trader.displayName}</span>
                        <span className="text-sm text-muted-foreground">@{trade.trader.username}</span>
                        {trade.trader.verified && (
                          <Badge className="bg-blue-500/20 text-blue-400" variant="outline">
                            <Crown className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge className={getLevelColor(trade.trader.level)} variant="outline">
                          {trade.trader.level}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center space-x-4 mb-2">
                          <Badge 
                            className={trade.type === "buy" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} 
                            variant="outline"
                          >
                            {trade.type.toUpperCase()} {trade.asset}
                          </Badge>
                          <span className="font-mono text-sm">
                            {trade.amount} × ${trade.price.toLocaleString()}
                          </span>
                          <Badge className="bg-purple-500/20 text-purple-400" variant="outline">
                            {trade.confidence}% confidence
                          </Badge>
                        </div>
                        
                        {trade.pnl && (
                          <div className={`text-sm font-semibold ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            PnL: {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{trade.analysis}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {trade.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => likeTrade(trade.id)}
                            className={`flex items-center space-x-1 text-sm hover:text-red-400 transition-colors ${
                              trade.isLiked ? 'text-red-400' : 'text-muted-foreground'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${trade.isLiked ? 'fill-current' : ''}`} />
                            <span>{trade.likes}</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>{trade.comments}</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                            <Copy className="w-4 h-4" />
                            <span>{trade.copies} copies</span>
                          </button>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyTrade(trade.id, trade.trader)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Trade
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-4">
                    {trade.timestamp}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traders" className="space-y-6">
          <div className="space-y-4">
            {topTraders.map((trader) => (
              <Card key={trader.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={trader.avatar} />
                          <AvatarFallback>{trader.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {trader.rank}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-lg">{trader.displayName}</h4>
                          {trader.verified && (
                            <Badge className="bg-blue-500/20 text-blue-400" variant="outline">
                              <Crown className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge className={getLevelColor(trader.level)} variant="outline">
                            {trader.level}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3">
                          @{trader.username} • Joined {trader.joinDate}
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Total Return</div>
                            <div className="font-semibold text-green-400">+{trader.totalReturn}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Win Rate</div>
                            <div className="font-semibold">{trader.winRate}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Copiers</div>
                            <div className="font-semibold">{trader.copiers.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                            <div className={`font-semibold ${trader.riskScore <= 5 ? 'text-green-400' : trader.riskScore <= 7 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {trader.riskScore}/10
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {trader.badges.map((badge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{trader.followers.toLocaleString()} followers</span>
                          <span>{trader.following} following</span>
                          <span>AUM: ${(trader.aum / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => followTrader(trader.id)}
                        variant={trader.isFollowing ? "outline" : "default"}
                        size="sm"
                      >
                        {trader.isFollowing ? "Following" : "Follow"}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Trades
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          {/* Referral Overview */}
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-6 h-6 text-purple-400" />
                <span>Referral Program</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <UserPlus className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {currentUser.referrals}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Referrals</div>
                </div>

                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    ${currentUser.totalRewards}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Earned</div>
                </div>

                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    ${currentUser.pendingRewards}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Rewards</div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold text-lg mb-4">Your Referral Code</h4>
                <div className="flex items-center space-x-3">
                  <code className="flex-1 p-3 bg-black/30 rounded font-mono text-lg">
                    NEBULA_{currentUser.username.toUpperCase()}
                  </code>
                  <Button onClick={shareReferralCode}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy & Share
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Share this code with friends to earn rewards when they join and trade!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reward Structure */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Reward Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <UserPlus className="w-8 h-8 text-blue-400" />
                    <div>
                      <h5 className="font-semibold">Friend Sign-up</h5>
                      <p className="text-sm text-muted-foreground">When friend completes KYC</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">$50 USDT</div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <div>
                      <h5 className="font-semibold">First Trade</h5>
                      <p className="text-sm text-muted-foreground">Friend's first trade $100+</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">$25 USDT</div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-8 h-8 text-purple-400" />
                    <div>
                      <h5 className="font-semibold">Volume Milestones</h5>
                      <p className="text-sm text-muted-foreground">$10K, $50K, $100K volume</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">$100-500</div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h5 className="font-semibold">Achievement Bonus</h5>
                      <p className="text-sm text-muted-foreground">Friend unlocks achievements</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">500-2000 XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral History */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Referral Rewards History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {referralRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-slate-800/50">
                      {reward.type === "signup" && <UserPlus className="w-5 h-5 text-blue-400" />}
                      {reward.type === "first_trade" && <TrendingUp className="w-5 h-5 text-green-400" />}
                      {reward.type === "volume_milestone" && <Target className="w-5 h-5 text-purple-400" />}
                      {reward.type === "friend_achievement" && <Award className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <div>
                      <h5 className="font-semibold">{reward.description}</h5>
                      {reward.friendName && (
                        <p className="text-sm text-muted-foreground">
                          Friend: {reward.friendName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {reward.requirements}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">
                      {reward.amount} {reward.currency}
                    </div>
                    <Badge className={getRewardStatusColor(reward.status)} variant="outline">
                      {reward.status}
                    </Badge>
                    {reward.claimedDate && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {reward.claimedDate}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span>Social Trading Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topTraders.map((trader, index) => (
                <div key={trader.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' :
                      'bg-slate-600'
                    }`}>
                      {index < 3 ? (
                        index === 0 ? <Crown className="w-4 h-4" /> :
                        index === 1 ? <Award className="w-4 h-4" /> :
                        <Trophy className="w-4 h-4" />
                      ) : (
                        trader.rank
                      )}
                    </div>
                    
                    <Avatar>
                      <AvatarImage src={trader.avatar} />
                      <AvatarFallback>{trader.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{trader.displayName}</span>
                        {trader.verified && (
                          <Crown className="w-4 h-4 text-blue-400" />
                        )}
                        <Badge className={getLevelColor(trader.level)} variant="outline">
                          {trader.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trader.copiers.toLocaleString()} copiers • {trader.winRate}% win rate
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-400">
                      +{trader.totalReturn}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trader.activeStreak} day streak
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}