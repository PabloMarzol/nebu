import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Target,
  Globe,
  Eye,
  Brain,
  Zap,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Settings,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdvancedAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("business-intelligence");
  const [timeRange, setTimeRange] = useState("7d");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const businessMetrics = {
    revenue: {
      current: "$2.45M",
      change: "+18.5%",
      trend: "up",
      previous: "$2.07M"
    },
    users: {
      current: "47,892",
      change: "+12.3%", 
      trend: "up",
      previous: "42,634"
    },
    volume: {
      current: "$156.8M",
      change: "+24.7%",
      trend: "up",
      previous: "$125.7M"
    },
    conversion: {
      current: "8.4%",
      change: "-0.3%",
      trend: "down",
      previous: "8.7%"
    }
  };

  const tradingAnalytics = [
    {
      pair: "BTC/USDT",
      volume24h: "$45.2M",
      change: "+5.7%",
      trades: "12,450",
      avgSize: "$3,634",
      dominance: "28.8%",
      liquidity: "High"
    },
    {
      pair: "ETH/USDT", 
      volume24h: "$32.1M",
      change: "+3.2%",
      trades: "8,967",
      avgSize: "$3,579",
      dominance: "20.5%",
      liquidity: "High"
    },
    {
      pair: "SOL/USDT",
      volume24h: "$18.9M",
      change: "+12.8%",
      trades: "5,234",
      avgSize: "$3,611",
      dominance: "12.1%",
      liquidity: "Medium"
    },
    {
      pair: "AVAX/USDT",
      volume24h: "$11.3M",
      change: "-2.1%",
      trades: "3,456",
      avgSize: "$3,269",
      dominance: "7.2%",
      liquidity: "Medium"
    }
  ];

  const userBehaviorInsights = [
    {
      segment: "Institutional Traders",
      count: "1,247",
      avgVolume: "$847K",
      retention: "94.2%",
      ltv: "$125K",
      growth: "+15.2%"
    },
    {
      segment: "High Net Worth", 
      count: "5,893",
      avgVolume: "$89K",
      retention: "87.5%",
      ltv: "$23K",
      growth: "+22.7%"
    },
    {
      segment: "Active Retail",
      count: "18,234",
      avgVolume: "$5.2K",
      retention: "76.3%",
      ltv: "$2.8K",
      growth: "+8.9%"
    },
    {
      segment: "Casual Traders",
      count: "22,518",
      avgVolume: "$847",
      retention: "45.8%",
      ltv: "$425",
      growth: "+5.3%"
    }
  ];

  const riskMetrics = [
    {
      category: "Market Risk",
      status: "Low",
      score: 23,
      indicators: ["VaR: $2.3M", "Correlation Risk: 0.34", "Concentration: 12%"],
      trend: "stable"
    },
    {
      category: "Credit Risk",
      status: "Medium", 
      score: 45,
      indicators: ["Default Rate: 0.8%", "Exposure: $45M", "Recovery: 87%"],
      trend: "improving"
    },
    {
      category: "Operational Risk",
      status: "Low",
      score: 18,
      indicators: ["Uptime: 99.9%", "Error Rate: 0.02%", "SLA: 98.5%"],
      trend: "stable"
    },
    {
      category: "Compliance Risk",
      status: "Very Low",
      score: 8,
      indicators: ["AML Score: 98%", "KYC Rate: 99.2%", "Violations: 0"],
      trend: "improving"
    }
  ];

  const predictiveInsights = [
    {
      type: "Revenue Forecast",
      prediction: "$2.89M next month",
      confidence: "87%",
      factors: ["Seasonal trends", "User growth", "Market conditions"],
      recommendation: "Increase marketing spend by 15%"
    },
    {
      type: "User Churn Risk",
      prediction: "234 users at risk",
      confidence: "92%", 
      factors: ["Reduced activity", "Support tickets", "Competitive pressure"],
      recommendation: "Launch retention campaign targeting at-risk segments"
    },
    {
      type: "Market Opportunity",
      prediction: "DeFi volume surge expected",
      confidence: "78%",
      factors: ["Protocol upgrades", "Yield increases", "Market sentiment"],
      recommendation: "Expand DeFi product offerings"
    }
  ];

  const realTimeAlerts = [
    {
      type: "Performance",
      message: "API response time increased by 15%",
      severity: "Warning",
      time: "2 minutes ago",
      action: "Investigate load balancer"
    },
    {
      type: "Trading",
      message: "Unusual volume spike in ETH/USDT",
      severity: "Info",
      time: "5 minutes ago", 
      action: "Monitor for opportunities"
    },
    {
      type: "Risk",
      message: "Portfolio concentration limit approaching",
      severity: "Critical",
      time: "8 minutes ago",
      action: "Diversification required"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'very low': case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Label className="text-white text-sm">Auto Refresh</Label>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(businessMetrics).map(([key, metric]) => (
          <Card key={key} className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold text-white">{metric.current}</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Previous</p>
                  <p className="text-sm text-white">{metric.previous}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="business-intelligence">Business Intelligence</TabsTrigger>
          <TabsTrigger value="trading-analytics">Trading Analytics</TabsTrigger>
          <TabsTrigger value="user-behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="risk-management">Risk Management</TabsTrigger>
          <TabsTrigger value="predictive-insights">Predictive Insights</TabsTrigger>
        </TabsList>

        {/* Business Intelligence */}
        <TabsContent value="business-intelligence">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-400">Interactive Revenue Chart</p>
                    <p className="text-sm text-gray-500">Real-time revenue tracking with trend analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Trading Fees</p>
                    <p className="text-white font-bold">$1.85M</p>
                    <p className="text-green-400">+21.3%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Withdrawal Fees</p>
                    <p className="text-white font-bold">$420K</p>
                    <p className="text-blue-400">+8.7%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Premium Services</p>
                    <p className="text-white font-bold">$180K</p>
                    <p className="text-purple-400">+45.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">New Registrations</span>
                    <span className="text-white">2,847 this month</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">KYC Completion Rate</span>
                    <span className="text-white">84.7%</span>
                  </div>
                  <Progress value={84.7} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">First Trade Conversion</span>
                    <span className="text-white">67.2%</span>
                  </div>
                  <Progress value={67.2} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">30-Day Retention</span>
                    <span className="text-white">72.8%</span>
                  </div>
                  <Progress value={72.8} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Top Markets by Volume</h4>
                    {[
                      { country: "United States", volume: "$45.2M", percentage: 28.8 },
                      { country: "United Kingdom", volume: "$32.1M", percentage: 20.5 },
                      { country: "Germany", volume: "$18.9M", percentage: 12.1 },
                      { country: "Japan", volume: "$15.3M", percentage: 9.8 },
                      { country: "Singapore", volume: "$12.7M", percentage: 8.1 }
                    ].map((market, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="text-white">{market.country}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400">{market.volume}</p>
                          <p className="text-xs text-gray-400">{market.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Regulatory Compliance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">FATF Compliance</span>
                        <Badge className="bg-green-500">100%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MiFID II Reporting</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">GDPR Compliance</span>
                        <Badge className="bg-green-500">Certified</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SOX Compliance</span>
                        <Badge className="bg-blue-500">In Progress</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trading Analytics */}
        <TabsContent value="trading-analytics">
          <div className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Trading Pair Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tradingAnalytics.map((pair) => (
                    <div key={pair.pair} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">{pair.pair}</span>
                          <Badge className={pair.change.includes('+') ? 'bg-green-500' : 'bg-red-500'}>
                            {pair.change}
                          </Badge>
                          <Badge variant="outline">{pair.liquidity}</Badge>
                        </div>
                        <span className="text-purple-400 font-medium">{pair.dominance}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">24h Volume</p>
                          <p className="text-white font-semibold">{pair.volume24h}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Trades</p>
                          <p className="text-blue-400">{pair.trades}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Avg Size</p>
                          <p className="text-green-400">{pair.avgSize}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Market Share</p>
                          <p className="text-purple-400">{pair.dominance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Behavior */}
        <TabsContent value="user-behavior">
          <div className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Segment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBehaviorInsights.map((segment) => (
                    <div key={segment.segment} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">{segment.segment}</span>
                        <Badge className="bg-purple-500">{segment.growth}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Users</p>
                          <p className="text-white font-semibold">{segment.count}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Avg Volume</p>
                          <p className="text-green-400">{segment.avgVolume}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Retention</p>
                          <p className="text-blue-400">{segment.retention}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">LTV</p>
                          <p className="text-purple-400">{segment.ltv}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Growth</p>
                          <p className="text-green-400">{segment.growth}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Management */}
        <TabsContent value="risk-management">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Assessment Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((risk) => (
                    <div key={risk.category} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">{risk.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(risk.status)}>
                            {risk.status}
                          </Badge>
                          <span className="text-sm text-gray-400">Score: {risk.score}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {risk.indicators.map((indicator, index) => (
                          <p key={index} className="text-sm text-gray-300">{indicator}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Real-time Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {realTimeAlerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={
                          alert.severity === 'Critical' ? 'bg-red-500' :
                          alert.severity === 'Warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-gray-400">{alert.time}</span>
                      </div>
                      <p className="text-white text-sm mb-2">{alert.message}</p>
                      <p className="text-blue-400 text-xs">{alert.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictive Insights */}
        <TabsContent value="predictive-insights">
          <div className="space-y-6">
            {predictiveInsights.map((insight, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {insight.type}
                    </div>
                    <Badge className="bg-purple-500">
                      {insight.confidence} confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                    <p className="text-purple-400 font-medium">Prediction:</p>
                    <p className="text-white text-lg">{insight.prediction}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Key Factors:</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.factors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-400 font-medium">Recommendation:</p>
                    <p className="text-white">{insight.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}