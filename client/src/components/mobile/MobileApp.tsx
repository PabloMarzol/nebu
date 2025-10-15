import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Settings, 
  Wallet, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Star,
  Crown,
  Zap,
  Target,
  BarChart3,
  DollarSign
} from "lucide-react";

interface MobileAppProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

export default function MobileApp({ userTier = 'basic' }: MobileAppProps) {
  const [portfolio] = useState({
    balance: 45672.89,
    change24h: 2.34,
    changePercent: 5.12
  });

  const quickActions = [
    { id: 'buy', title: 'Buy Crypto', icon: <ArrowUp className="w-4 h-4" />, enabled: true },
    { id: 'sell', title: 'Sell Crypto', icon: <ArrowDown className="w-4 h-4" />, enabled: true },
    { id: 'p2p', title: 'P2P Trading', icon: <Target className="w-4 h-4" />, enabled: userTier !== 'basic' },
    { id: 'ai', title: 'AI Trading', icon: <Zap className="w-4 h-4" />, enabled: userTier === 'premium' || userTier === 'elite' }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'elite': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return <Star className="w-4 h-4" />;
      case 'premium': return <Crown className="w-4 h-4" />;
      case 'elite': return <Crown className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const mockMarkets = [
    { symbol: 'BTC/USDT', price: 43250.89, change: 2.34, volume: '2.4B' },
    { symbol: 'ETH/USDT', price: 2654.23, change: -1.23, volume: '1.8B' },
    { symbol: 'ADA/USDT', price: 0.523, change: 4.56, volume: '890M' },
    { symbol: 'SOL/USDT', price: 89.34, change: -2.11, volume: '1.2B' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      {/* Debug Banner */}
      <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50 text-sm">
        Mobile App Active - User Tier: {userTier} - Content Loading Successfully
      </div>
      
      <div className="pt-12"> {/* Add padding for debug banner */}
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">NebulaX Mobile</h1>
              <Badge variant="secondary" className={`${getTierColor(userTier)} text-white`}>
                {getTierIcon(userTier)}
                <span className="ml-1 capitalize">{userTier}</span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio</span>
              <Wallet className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              ${portfolio.balance.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="w-4 h-4 text-green-400" />
              <span className="text-green-400">+${portfolio.change24h.toFixed(2)}</span>
              <span className="text-green-400">({portfolio.changePercent.toFixed(2)}%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.enabled ? "default" : "secondary"}
                  disabled={!action.enabled}
                  className="flex items-center space-x-2 p-4 h-auto"
                >
                  {action.icon}
                  <span>{action.title}</span>
                  {!action.enabled && <Badge variant="outline" className="ml-2">Upgrade</Badge>}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Trading Interface */}
        <Tabs defaultValue="markets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Live Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMarkets.map((market, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-semibold">{market.symbol}</div>
                        <div className="text-sm text-gray-400">{market.volume}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${market.price.toLocaleString()}</div>
                        <div className={`text-sm flex items-center ${
                          market.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {market.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Quick Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-green-500 hover:bg-green-600">
                      Buy BTC
                    </Button>
                    <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                      Sell BTC
                    </Button>
                  </div>

                  {userTier === 'basic' && (
                    <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                      <p className="text-sm text-purple-300">
                        Upgrade to Pro for advanced order types
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Upgrade Now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            {userTier === 'premium' || userTier === 'elite' ? (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-300">
                        Market sentiment is bullish. Consider increasing BTC allocation.
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-300">
                        High volatility expected in the next 24h. Consider stop-loss orders.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardContent className="text-center p-6">
                  <Crown className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Premium Analytics</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Get AI-powered insights, risk analysis, and advanced metrics
                  </p>
                  <Button className="bg-purple-500 hover:bg-purple-600">
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Performance Stats */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">+12.34%</div>
                <div className="text-sm text-gray-400">7-Day Return</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">68.5%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}