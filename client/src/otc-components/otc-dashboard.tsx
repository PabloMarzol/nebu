import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Globe,
  Zap,
  Shield,
  ArrowRight,
  Activity,
  PieChart,
  Target,
  Coins,
  Building2,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star
} from "lucide-react";
import FuturisticBackground from "./futuristic-background";

export default function OTCDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketData, setMarketData] = useState({
    btc: { price: 67420.35, change: 2.34 },
    eth: { price: 3824.17, change: -1.12 },
    sol: { price: 198.45, change: 5.67 },
    usdt: { price: 1.0003, change: 0.01 }
  });

  const [volumeData, setVolumeData] = useState({
    daily: 2847362140,
    weekly: 18947365780,
    monthly: 84735261890
  });

  const [activityData, setActivityData] = useState([
    { id: 1, type: "Block Trade", amount: "$5.2M", asset: "BTC", status: "completed", time: "2 min ago" },
    { id: 2, type: "OTC Deal", amount: "$12.8M", asset: "ETH", status: "pending", time: "5 min ago" },
    { id: 3, type: "Quote Request", amount: "$850K", asset: "SOL", status: "active", time: "8 min ago" },
    { id: 4, type: "Settlement", amount: "$3.1M", asset: "USDT", status: "completed", time: "12 min ago" },
    { id: 5, type: "Credit Line", amount: "$25M", asset: "USD", status: "approved", time: "15 min ago" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate market data updates
      setMarketData(prev => ({
        btc: { ...prev.btc, price: prev.btc.price + (Math.random() - 0.5) * 100, change: prev.btc.change + (Math.random() - 0.5) * 0.5 },
        eth: { ...prev.eth, price: prev.eth.price + (Math.random() - 0.5) * 20, change: prev.eth.change + (Math.random() - 0.5) * 0.3 },
        sol: { ...prev.sol, price: prev.sol.price + (Math.random() - 0.5) * 5, change: prev.sol.change + (Math.random() - 0.5) * 0.8 },
        usdt: { ...prev.usdt, price: prev.usdt.price + (Math.random() - 0.5) * 0.001, change: prev.usdt.change + (Math.random() - 0.5) * 0.02 }
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatLargeNumber = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "active": return <Activity className="w-4 h-4 text-blue-400" />;
      case "approved": return <Star className="w-4 h-4 text-purple-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/20 text-green-400 border-green-400/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
      active: "bg-blue-500/20 text-blue-400 border-blue-400/30",
      approved: "bg-purple-500/20 text-purple-400 border-purple-400/30"
    };
    return variants[status as keyof typeof variants] || "bg-gray-500/20 text-gray-400 border-gray-400/30";
  };

  return (
    <div className="relative min-h-screen">
      <FuturisticBackground />
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              OTC Trading Desk
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional cryptocurrency over-the-counter trading platform
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Global Market • {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow">
              <Zap className="w-4 h-4 mr-2" />
              Request Quote
            </Button>
            <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(marketData).map(([symbol, data]) => (
            <Card key={symbol} className="glass border-0 hover:border-purple-500/30 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold uppercase tracking-wider text-purple-400">
                    {symbol}
                  </CardTitle>
                  {data.change >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(data.price)}
                  </div>
                  <Badge className={`${data.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                    {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass border-0 hover:border-blue-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <DollarSign className="w-5 h-5" />
                Trading Volume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">24H Volume</span>
                  <span className="text-xl font-bold text-blue-400">{formatLargeNumber(volumeData.daily)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">7D Volume</span>
                  <span className="text-lg font-semibold text-white">{formatLargeNumber(volumeData.weekly)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">30D Volume</span>
                  <span className="text-lg font-semibold text-white">{formatLargeNumber(volumeData.monthly)}</span>
                </div>
              </div>
              <Progress value={75} className="h-2 bg-gray-800" />
            </CardContent>
          </Card>

          <Card className="glass border-0 hover:border-green-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Users className="w-5 h-5" />
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Institutional</span>
                  <span className="text-xl font-bold text-green-400">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High Net Worth</span>
                  <span className="text-lg font-semibold text-white">1,342</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total AUM</span>
                  <span className="text-lg font-semibold text-white">$24.7B</span>
                </div>
              </div>
              <Progress value={89} className="h-2 bg-gray-800" />
            </CardContent>
          </Card>

          <Card className="glass border-0 hover:border-cyan-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Shield className="w-5 h-5" />
                Risk & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="text-xl font-bold text-cyan-400">A+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Compliance</span>
                  <span className="text-lg font-semibold text-green-400">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Settlements</span>
                  <span className="text-lg font-semibold text-white">99.9%</span>
                </div>
              </div>
              <Progress value={98} className="h-2 bg-gray-800" />
            </CardContent>
          </Card>
        </div>

        {/* Services Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-0 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Block Trading</h3>
              <p className="text-gray-400 text-sm mb-4">Execute large-volume trades with minimal market impact</p>
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300 p-0">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-0 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quote Requests</h3>
              <p className="text-gray-400 text-sm mb-4">Real-time pricing for custom trading requirements</p>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-0 hover:border-green-500/30 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Settlement</h3>
              <p className="text-gray-400 text-sm mb-4">Multi-currency settlement with institutional security</p>
              <Button variant="ghost" className="text-green-400 hover:text-green-300 p-0">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-0 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Credit Lines</h3>
              <p className="text-gray-400 text-sm mb-4">Flexible financing solutions for institutional clients</p>
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 p-0">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-purple-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityData.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{activity.type}</span>
                        <Badge className={getStatusBadge(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{activity.amount}</span>
                        <span>•</span>
                        <span>{activity.asset}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}