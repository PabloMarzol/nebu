import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Users,
  Building2,
  Award,
  Activity,
  Zap,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Globe,
  CreditCard,
  Wallet
} from "lucide-react";

interface RevenueStream {
  id: string;
  name: string;
  type: "trading_fees" | "withdrawal_fees" | "staking_rewards" | "otc_commission" | "api_fees" | "premium_services";
  monthlyRevenue: number;
  growth: number;
  margin: number;
  clients: number;
  volume: number;
  forecast: number;
  status: "growing" | "stable" | "declining";
  lastUpdated: string;
}

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  avgMargin: number;
  forecastAccuracy: number;
  churnRate: number;
  ltv: number;
  cac: number;
  paybackPeriod: number;
}

interface RevenueOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedRevenue: number;
  probability: number;
  timeline: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  category: "new_product" | "market_expansion" | "pricing_optimization" | "client_upsell";
  assignedTo: string;
  status: "identified" | "analysis" | "development" | "testing" | "launched";
}

export default function RevenueOperationsCRM() {
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("monthly");
  const [selectedStream, setSelectedStream] = useState<string>("all");

  // Sample revenue data
  useEffect(() => {
    const sampleStreams: RevenueStream[] = [
      {
        id: "trading_fees",
        name: "Trading Fees",
        type: "trading_fees",
        monthlyRevenue: 485000,
        growth: 18.5,
        margin: 85,
        clients: 1247,
        volume: 125000000,
        forecast: 510000,
        status: "growing",
        lastUpdated: "2025-01-30"
      },
      {
        id: "withdrawal_fees",
        name: "Withdrawal Fees",
        type: "withdrawal_fees",
        monthlyRevenue: 125000,
        growth: 8.2,
        margin: 92,
        clients: 2850,
        volume: 8500000,
        forecast: 130000,
        status: "stable",
        lastUpdated: "2025-01-30"
      },
      {
        id: "staking_rewards",
        name: "Staking Commission",
        type: "staking_rewards",
        monthlyRevenue: 285000,
        growth: 32.1,
        margin: 78,
        clients: 856,
        volume: 45000000,
        forecast: 350000,
        status: "growing",
        lastUpdated: "2025-01-30"
      },
      {
        id: "otc_commission",
        name: "OTC Desk Commission",
        type: "otc_commission",
        monthlyRevenue: 320000,
        growth: 25.4,
        margin: 68,
        clients: 45,
        volume: 280000000,
        forecast: 380000,
        status: "growing",
        lastUpdated: "2025-01-30"
      },
      {
        id: "api_fees",
        name: "API Access Fees",
        type: "api_fees",
        monthlyRevenue: 95000,
        growth: 15.7,
        margin: 95,
        clients: 125,
        volume: 0,
        forecast: 105000,
        status: "growing",
        lastUpdated: "2025-01-30"
      },
      {
        id: "premium_services",
        name: "Premium Services",
        type: "premium_services",
        monthlyRevenue: 185000,
        growth: -5.2,
        margin: 72,
        clients: 234,
        volume: 0,
        forecast: 175000,
        status: "declining",
        lastUpdated: "2025-01-30"
      }
    ];

    const sampleOpportunities: RevenueOpportunity[] = [
      {
        id: "opp-001",
        title: "Institutional Custody Services",
        description: "Launch enterprise-grade custody solution for institutional clients with insurance coverage",
        estimatedRevenue: 2500000,
        probability: 75,
        timeline: "Q2 2025",
        effort: "high",
        impact: "high",
        category: "new_product",
        assignedTo: "Product Team",
        status: "development"
      },
      {
        id: "opp-002",
        title: "European Market Expansion",
        description: "Expand trading services to European markets with local banking partnerships",
        estimatedRevenue: 1800000,
        probability: 65,
        timeline: "Q3 2025",
        effort: "high",
        impact: "high",
        category: "market_expansion",
        assignedTo: "Business Development",
        status: "analysis"
      },
      {
        id: "opp-003",
        title: "Dynamic Fee Structure",
        description: "Implement volume-based dynamic pricing to increase large trader retention",
        estimatedRevenue: 450000,
        probability: 85,
        timeline: "Q1 2025",
        effort: "medium",
        impact: "medium",
        category: "pricing_optimization",
        assignedTo: "Revenue Team",
        status: "testing"
      },
      {
        id: "opp-004",
        title: "Premium Analytics Suite",
        description: "Upsell existing clients to premium analytics and research subscription",
        estimatedRevenue: 320000,
        probability: 80,
        timeline: "Q1 2025",
        effort: "low",
        impact: "medium",
        category: "client_upsell",
        assignedTo: "Sales Team",
        status: "launched"
      }
    ];

    setRevenueStreams(sampleStreams);
    setOpportunities(sampleOpportunities);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      growing: "text-green-500",
      stable: "text-blue-500",
      declining: "text-red-500"
    };
    return colors[status as keyof typeof colors] || "text-gray-500";
  };

  const getStatusIcon = (status: string) => {
    if (status === "growing") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (status === "declining") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 bg-blue-500 rounded-full" />;
  };

  const getEffortColor = (effort: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return colors[effort as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-purple-100 text-purple-800"
    };
    return colors[impact as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const calculateMetrics = (): RevenueMetrics => {
    const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);
    const totalGrowth = revenueStreams.reduce((sum, stream) => sum + (stream.growth * stream.monthlyRevenue), 0) / totalRevenue;
    const avgMargin = revenueStreams.reduce((sum, stream) => sum + (stream.margin * stream.monthlyRevenue), 0) / totalRevenue;
    
    return {
      totalRevenue,
      monthlyGrowth: totalGrowth,
      avgMargin,
      forecastAccuracy: 92.5,
      churnRate: 3.2,
      ltv: 85000,
      cac: 2500,
      paybackPeriod: 3.2
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Revenue Operations CRM</h1>
          <p className="text-muted-foreground">Comprehensive revenue tracking, forecasting, and optimization platform</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${(metrics.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+{metrics.monthlyGrowth.toFixed(1)}%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Margin</p>
                <p className="text-2xl font-bold">{metrics.avgMargin.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+2.3%</span>
              <span className="text-muted-foreground ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
                <p className="text-2xl font-bold">{metrics.forecastAccuracy}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+1.5%</span>
              <span className="text-muted-foreground ml-1">this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customer LTV</p>
                <p className="text-2xl font-bold">${(metrics.ltv / 1000).toFixed(0)}K</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Revenue Dashboard</TabsTrigger>
          <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams
                    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                    .map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(stream.status)}
                          <span className="font-medium">{stream.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(stream.monthlyRevenue / 1000).toFixed(0)}K</p>
                          <p className={`text-sm ${getStatusColor(stream.status)}`}>
                            {stream.growth > 0 ? '+' : ''}{stream.growth.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["January", "February", "March", "April", "May", "June"].map((month, index) => {
                    const growth = [12.5, 18.2, 15.8, 22.1, 19.7, 16.3][index];
                    const revenue = [950, 1125, 1302, 1589, 1902, 2195][index];
                    return (
                      <div key={month} className="flex items-center justify-between">
                        <span className="font-medium">{month}</span>
                        <div className="text-right">
                          <p className="font-semibold">${revenue}K</p>
                          <div className="flex items-center text-sm">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500">+{growth}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Customer Acquisition Cost</span>
                      <span>${metrics.cac.toLocaleString()}</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: $3,000</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Payback Period</span>
                      <span>{metrics.paybackPeriod} months</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: 4 months</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Churn Rate</span>
                      <span>{metrics.churnRate}%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: &lt;5%</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Revenue Growth</span>
                      <span>+{metrics.monthlyGrowth.toFixed(1)}%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Target: 20% monthly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.slice(0, 4).map((stream) => (
                    <div key={stream.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{stream.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Accuracy: {((stream.monthlyRevenue / stream.forecast) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Actual</div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(stream.monthlyRevenue / stream.forecast) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs mt-1">${(stream.monthlyRevenue / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Forecast</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-400 h-2 rounded-full" style={{ width: "100%" }} />
                          </div>
                          <div className="text-xs mt-1">${(stream.forecast / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedStream} onValueChange={setSelectedStream}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="trading_fees">Trading Fees</SelectItem>
                    <SelectItem value="withdrawal_fees">Withdrawal Fees</SelectItem>
                    <SelectItem value="staking_rewards">Staking Commission</SelectItem>
                    <SelectItem value="otc_commission">OTC Commission</SelectItem>
                    <SelectItem value="api_fees">API Fees</SelectItem>
                    <SelectItem value="premium_services">Premium Services</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Streams List */}
          <div className="grid gap-4">
            {revenueStreams.map((stream) => (
              <Card key={stream.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div>
                          <h3 className="font-semibold text-xl">{stream.name}</h3>
                          <p className="text-muted-foreground capitalize">{stream.type.replace("_", " ")}</p>
                        </div>
                        <Badge className={`${getStatusColor(stream.status)} bg-opacity-10`}>
                          {stream.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                          <p className="text-xl font-bold text-green-500">
                            ${stream.monthlyRevenue.toLocaleString()}
                          </p>
                          <p className={`text-sm ${getStatusColor(stream.status)}`}>
                            {stream.growth > 0 ? '+' : ''}{stream.growth.toFixed(1)}% growth
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Margin</p>
                          <p className="text-lg font-semibold">{stream.margin}%</p>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{ width: `${stream.margin}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Clients</p>
                          <p className="text-lg font-semibold">{stream.clients.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">paying users</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Volume (if applicable)</p>
                          <p className="text-lg font-semibold">
                            {stream.volume > 0 ? `$${(stream.volume / 1000000).toFixed(1)}M` : "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">monthly volume</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Forecast Next Month</p>
                          <p className="text-lg font-semibold text-blue-500">
                            ${stream.forecast.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(((stream.forecast - stream.monthlyRevenue) / stream.monthlyRevenue) * 100).toFixed(1)}% projected
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{opp.title}</h3>
                          <p className="text-muted-foreground">{opp.description}</p>
                        </div>
                        <Badge className={getEffortColor(opp.effort)}>
                          {opp.effort} effort
                        </Badge>
                        <Badge className={getImpactColor(opp.impact)}>
                          {opp.impact} impact
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Revenue</p>
                          <p className="text-xl font-bold text-green-500">
                            ${(opp.estimatedRevenue / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-sm text-muted-foreground">annually</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Success Probability</p>
                          <p className="text-lg font-semibold">{opp.probability}%</p>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-purple-500 h-1 rounded-full"
                              style={{ width: `${opp.probability}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Timeline</p>
                          <p className="font-medium">{opp.timeline}</p>
                          <p className="text-sm text-muted-foreground">expected launch</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Assigned To</p>
                          <p className="font-medium">{opp.assignedTo}</p>
                          <Badge variant="outline" className="mt-1">
                            {opp.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Expected Value</span>
                          <span className="text-sm text-green-600">
                            ${((opp.estimatedRevenue * opp.probability) / 100 / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${opp.probability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Target className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Last 30 days", "Last 60 days", "Last 90 days", "Last 6 months"].map((period, index) => {
                    const accuracy = [95.2, 92.8, 89.5, 87.1][index];
                    return (
                      <div key={period} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{period}</span>
                          <span>{accuracy}%</span>
                        </div>
                        <Progress value={accuracy} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { driver: "Market Conditions", impact: 35, trend: "positive" },
                    { driver: "Client Acquisition", impact: 28, trend: "positive" },
                    { driver: "Product Development", impact: 22, trend: "stable" },
                    { driver: "Competitive Pressure", impact: 15, trend: "negative" }
                  ].map((item) => (
                    <div key={item.driver} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.driver}</p>
                        <p className="text-sm text-muted-foreground">{item.impact}% impact weight</p>
                      </div>
                      <div className="text-right">
                        {item.trend === "positive" && <TrendingUp className="w-5 h-5 text-green-500" />}
                        {item.trend === "negative" && <TrendingDown className="w-5 h-5 text-red-500" />}
                        {item.trend === "stable" && <div className="w-5 h-5 bg-blue-500 rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}