import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Copy, 
  Star, 
  Eye,
  Shield,
  Target,
  BarChart3,
  Activity,
  Crown,
  Award,
  Settings,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Filter,
  Search
} from "lucide-react";

interface TopTrader {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  totalReturn: number;
  monthlyReturn: number;
  winRate: number;
  followers: number;
  aum: string; // Assets under management
  maxDrawdown: number;
  tradingStyle: string;
  riskScore: number;
  avgTradeDuration: string;
  activePositions: number;
  copyFee: number;
  minCopyAmount: number;
  isFollowing: boolean;
  recentTrades: Array<{
    symbol: string;
    action: "buy" | "sell";
    amount: string;
    price: string;
    profit: number;
    timestamp: string;
  }>;
  portfolio: Array<{
    symbol: string;
    allocation: number;
    pnl: number;
  }>;
}

interface CopyPosition {
  id: string;
  traderId: string;
  traderName: string;
  symbol: string;
  action: "buy" | "sell";
  entryPrice: string;
  currentPrice: string;
  amount: string;
  pnl: number;
  pnlPercent: number;
  copyRatio: number;
  status: "active" | "closed" | "pending";
  timestamp: string;
}

export default function CopyTrading() {
  const [selectedTrader, setSelectedTrader] = useState<string>("");
  const [copyAmount, setCopyAmount] = useState([1000]);
  const [riskFilter, setRiskFilter] = useState([1, 10]);
  const [returnFilter, setReturnFilter] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");

  const [topTraders, setTopTraders] = useState<TopTrader[]>([
    {
      id: "trader1",
      name: "Alex Chen",
      username: "@cryptowhale",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "diamond",
      totalReturn: 342.5,
      monthlyReturn: 28.7,
      winRate: 78.2,
      followers: 12847,
      aum: "$2.4M",
      maxDrawdown: -12.3,
      tradingStyle: "Swing Trading",
      riskScore: 6,
      avgTradeDuration: "3.2 days",
      activePositions: 8,
      copyFee: 2.5,
      minCopyAmount: 100,
      isFollowing: true,
      recentTrades: [
        { symbol: "BTC", action: "buy", amount: "0.5", price: "$67,420", profit: 12.5, timestamp: "2h ago" },
        { symbol: "ETH", action: "sell", amount: "5.2", price: "$3,280", profit: 8.3, timestamp: "4h ago" },
        { symbol: "SOL", action: "buy", amount: "45", price: "$142", profit: -2.1, timestamp: "6h ago" }
      ],
      portfolio: [
        { symbol: "BTC", allocation: 35, pnl: 15.2 },
        { symbol: "ETH", allocation: 25, pnl: 12.8 },
        { symbol: "SOL", allocation: 20, pnl: 8.4 },
        { symbol: "MATIC", allocation: 10, pnl: -3.2 },
        { symbol: "AVAX", allocation: 10, pnl: 5.7 }
      ]
    },
    {
      id: "trader2",
      name: "Sarah Martinez",
      username: "@defigoddess",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "platinum",
      totalReturn: 198.3,
      monthlyReturn: 22.4,
      winRate: 72.8,
      followers: 8932,
      aum: "$1.8M",
      maxDrawdown: -8.7,
      tradingStyle: "DeFi Arbitrage",
      riskScore: 4,
      avgTradeDuration: "1.8 days",
      activePositions: 12,
      copyFee: 2.0,
      minCopyAmount: 200,
      isFollowing: false,
      recentTrades: [
        { symbol: "UNI", action: "buy", amount: "150", price: "$8.45", profit: 18.7, timestamp: "1h ago" },
        { symbol: "AAVE", action: "sell", amount: "25", price: "$105", profit: 14.2, timestamp: "3h ago" }
      ],
      portfolio: [
        { symbol: "UNI", allocation: 30, pnl: 22.1 },
        { symbol: "AAVE", allocation: 25, pnl: 18.9 },
        { symbol: "COMP", allocation: 20, pnl: 12.3 },
        { symbol: "SUSHI", allocation: 15, pnl: -5.4 },
        { symbol: "CRV", allocation: 10, pnl: 8.8 }
      ]
    },
    {
      id: "trader3",
      name: "Mike Thompson",
      username: "@altcoinmaster",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "gold",
      totalReturn: 156.7,
      monthlyReturn: 19.2,
      winRate: 68.4,
      followers: 5621,
      aum: "$980K",
      maxDrawdown: -15.2,
      tradingStyle: "Altcoin Focus",
      riskScore: 8,
      avgTradeDuration: "2.5 days",
      activePositions: 15,
      copyFee: 3.0,
      minCopyAmount: 50,
      isFollowing: true,
      recentTrades: [
        { symbol: "DOT", action: "buy", amount: "120", price: "$6.85", profit: 9.2, timestamp: "30m ago" },
        { symbol: "LINK", action: "sell", amount: "80", price: "$16.20", profit: 11.5, timestamp: "2h ago" }
      ],
      portfolio: [
        { symbol: "DOT", allocation: 25, pnl: 16.8 },
        { symbol: "LINK", allocation: 20, pnl: 14.3 },
        { symbol: "ADA", allocation: 20, pnl: 7.9 },
        { symbol: "ATOM", allocation: 20, pnl: -8.1 },
        { symbol: "FTM", allocation: 15, pnl: 12.4 }
      ]
    }
  ]);

  const [copyPositions, setCopyPositions] = useState<CopyPosition[]>([
    {
      id: "pos1",
      traderId: "trader1",
      traderName: "Alex Chen",
      symbol: "BTC",
      action: "buy",
      entryPrice: "$65,200",
      currentPrice: "$67,420",
      amount: "0.25",
      pnl: 555.0,
      pnlPercent: 3.4,
      copyRatio: 50,
      status: "active",
      timestamp: "2 days ago"
    },
    {
      id: "pos2",
      traderId: "trader3",
      traderName: "Mike Thompson",
      symbol: "DOT",
      action: "buy",
      entryPrice: "$6.20",
      currentPrice: "$6.85",
      amount: "60",
      pnl: 39.0,
      pnlPercent: 10.5,
      copyRatio: 25,
      status: "active",
      timestamp: "1 day ago"
    },
    {
      id: "pos3",
      traderId: "trader1",
      traderName: "Alex Chen",
      symbol: "ETH",
      action: "sell",
      entryPrice: "$3,350",
      currentPrice: "$3,280",
      amount: "2.1",
      pnl: -147.0,
      pnlPercent: -2.1,
      copyRatio: 30,
      status: "closed",
      timestamp: "3 days ago"
    }
  ]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze": return "text-amber-600";
      case "silver": return "text-gray-400";
      case "gold": return "text-yellow-500";
      case "platinum": return "text-purple-500";
      case "diamond": return "text-cyan-400";
      default: return "text-gray-500";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze": return "🥉";
      case "silver": return "🥈";
      case "gold": return "🥇";
      case "platinum": return "💎";
      case "diamond": return "💠";
      default: return "⭐";
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return "text-green-400";
    if (risk <= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const TraderCard = ({ trader }: { trader: TopTrader }) => (
    <Card className="glass-strong hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={trader.avatar} alt={trader.name} />
              <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{trader.name}</h3>
                {trader.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-sm text-muted-foreground">{trader.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs ${getTierColor(trader.tier)}`}>
                  {getTierIcon(trader.tier)} {trader.tier.toUpperCase()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {trader.tradingStyle}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant={trader.isFollowing ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTopTraders(prev => prev.map(t => 
                t.id === trader.id ? { ...t, isFollowing: !t.isFollowing } : t
              ));
            }}
          >
            {trader.isFollowing ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Return</span>
              <span className="font-semibold text-green-400">+{trader.totalReturn}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly</span>
              <span className="font-semibold text-green-400">+{trader.monthlyReturn}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-semibold">{trader.winRate}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-semibold">{trader.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">AUM</span>
              <span className="font-semibold">{trader.aum}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk Score</span>
              <span className={`font-semibold ${getRiskColor(trader.riskScore)}`}>
                {trader.riskScore}/10
              </span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Max Drawdown</span>
            <span className="text-red-400">{trader.maxDrawdown}%</span>
          </div>
          <Progress value={(10 + trader.maxDrawdown) * 5} className="h-2" />
        </div>

        {/* Portfolio Allocation */}
        <div>
          <p className="text-sm font-semibold mb-2">Top Holdings</p>
          <div className="space-y-1">
            {trader.portfolio.slice(0, 3).map((holding, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span>{holding.symbol}</span>
                <div className="flex items-center space-x-2">
                  <span>{holding.allocation}%</span>
                  <span className={holding.pnl > 0 ? "text-green-400" : "text-red-400"}>
                    {holding.pnl > 0 ? "+" : ""}{holding.pnl}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Settings */}
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Copy Fee</span>
            <span className="text-sm">{trader.copyFee}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Min. Amount</span>
            <span className="text-sm">${trader.minCopyAmount}</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <p className="text-sm font-semibold mb-2">Recent Trades</p>
          <div className="space-y-1">
            {trader.recentTrades.slice(0, 2).map((trade, index) => (
              <div key={index} className="flex justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={trade.action === "buy" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {trade.action.toUpperCase()}
                  </Badge>
                  <span>{trade.symbol}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={trade.profit > 0 ? "text-green-400" : "text-red-400"}>
                    {trade.profit > 0 ? "+" : ""}{trade.profit}%
                  </span>
                  <span className="text-muted-foreground">{trade.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CopyPositionCard = ({ position }: { position: CopyPosition }) => (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <Badge variant={position.action === "buy" ? "default" : "destructive"}>
              {position.action.toUpperCase()}
            </Badge>
            <div>
              <p className="font-semibold">{position.symbol}</p>
              <p className="text-xs text-muted-foreground">Copying {position.traderName}</p>
            </div>
          </div>
          <Badge 
            variant={position.status === "active" ? "default" : 
                   position.status === "closed" ? "secondary" : "outline"}
            className="text-xs"
          >
            {position.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Entry Price</p>
            <p className="font-semibold">{position.entryPrice}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Price</p>
            <p className="font-semibold">{position.currentPrice}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-semibold">{position.amount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Copy Ratio</p>
            <p className="font-semibold">{position.copyRatio}%</p>
          </div>
        </div>

        <div className="mt-3 p-2 rounded bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex justify-between items-center">
            <span className="text-sm">P&L</span>
            <div className="text-right">
              <p className={`font-bold ${position.pnl > 0 ? "text-green-400" : "text-red-400"}`}>
                {position.pnl > 0 ? "+" : ""}${position.pnl.toFixed(2)}
              </p>
              <p className={`text-xs ${position.pnlPercent > 0 ? "text-green-400" : "text-red-400"}`}>
                {position.pnlPercent > 0 ? "+" : ""}{position.pnlPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
          <span>{position.timestamp}</span>
          {position.status === "active" && (
            <Button size="sm" variant="outline" className="text-xs">
              Close Position
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const filteredTraders = topTraders.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trader.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = trader.riskScore >= riskFilter[0] && trader.riskScore <= riskFilter[1];
    const matchesReturn = trader.monthlyReturn >= returnFilter[0] && trader.monthlyReturn <= returnFilter[1];
    
    return matchesSearch && matchesRisk && matchesReturn;
  });

  return (
    <div className="min-h-screen page-content pt-24">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Copy Trading Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            Follow top traders and automatically mirror their strategies
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-muted-foreground">Active Traders</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">$45.2M</p>
                <p className="text-sm text-muted-foreground">Assets Copied</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">+18.7%</p>
                <p className="text-sm text-muted-foreground">Avg. Return</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Pro Traders</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="discover">Discover Traders</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Filters */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter Traders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search traders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Risk Level (1-10)</label>
                    <div className="mt-2">
                      <Slider
                        value={riskFilter}
                        onValueChange={setRiskFilter}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{riskFilter[0]}</span>
                        <span>{riskFilter[1]}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Monthly Return (%)</label>
                    <div className="mt-2">
                      <Slider
                        value={returnFilter}
                        onValueChange={setReturnFilter}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{returnFilter[0]}%</span>
                        <span>{returnFilter[1]}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTraders.map((trader) => (
                <TraderCard key={trader.id} trader={trader} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Following ({topTraders.filter(t => t.isFollowing).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {topTraders
                    .filter(trader => trader.isFollowing)
                    .map((trader) => (
                      <TraderCard key={trader.id} trader={trader} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            {/* Position Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold">
                    {copyPositions.filter(p => p.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Positions</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold text-green-400">
                    +${copyPositions.reduce((sum, pos) => sum + pos.pnl, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold">
                    {((copyPositions.filter(p => p.pnl > 0).length / copyPositions.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Positions List */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Copy Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {copyPositions.map((position) => (
                    <CopyPositionCard key={position.id} position={position} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Copy Trading Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Global Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Global Copy Settings</h3>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Auto Copy New Trades</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically copy new trades from followed traders
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Stop Loss Protection</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically close positions at -20% loss
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Risk Management</p>
                      <p className="text-sm text-muted-foreground">
                        Limit total copy allocation to 50% of portfolio
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                {/* Copy Limits */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Copy Limits</h3>
                  
                  <div>
                    <label className="text-sm font-medium">Maximum Copy Amount per Trade</label>
                    <div className="mt-2">
                      <Slider
                        value={copyAmount}
                        onValueChange={setCopyAmount}
                        max={10000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>$100</span>
                        <span>${copyAmount[0]}</span>
                        <span>$10,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Notifications</h3>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">New Trade Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when traders make new trades
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Performance Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Alert when copy positions hit profit/loss thresholds
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}