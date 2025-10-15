import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  Globe,
  Target,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Wallet,
  CreditCard,
  Building2
} from "lucide-react";

interface LiquidityProvider {
  id: string;
  name: string;
  type: "institutional" | "retail" | "algorithmic" | "internal";
  status: "active" | "inactive" | "pending" | "suspended";
  tier: "platinum" | "gold" | "silver" | "bronze";
  monthlyVolume: number;
  totalVolume: number;
  spreadContribution: number;
  uptime: number;
  avgSpread: number;
  pairs: string[];
  fees: {
    rebate: number;
    commission: number;
  };
  performance: {
    fillRate: number;
    latency: number;
    reliability: number;
  };
  contract: {
    startDate: string;
    endDate: string;
    minimumVolume: number;
    rebateStructure: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  geography: {
    country: string;
    timezone: string;
  };
}

interface MarketPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  currentSpread: number;
  targetSpread: number;
  volume24h: number;
  liquidity: {
    bid: number;
    ask: number;
    depth: number;
  };
  providers: number;
  status: "healthy" | "thin" | "illiquid";
  lastUpdated: string;
}

interface MarketMakingMetrics {
  totalProviders: number;
  activeProviders: number;
  totalLiquidity: number;
  avgSpread: number;
  volume24h: number;
  fillRate: number;
  systemUptime: number;
  revenueShare: number;
}

export default function MarketMakingCRM() {
  const [liquidityProviders, setLiquidityProviders] = useState<LiquidityProvider[]>([]);
  const [marketPairs, setMarketPairs] = useState<MarketPair[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<LiquidityProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<LiquidityProvider | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  // Sample data
  useEffect(() => {
    const sampleProviders: LiquidityProvider[] = [
      {
        id: "lp-001",
        name: "Automated Market Solutions",
        type: "algorithmic",
        status: "active",
        tier: "platinum",
        monthlyVolume: 125000000,
        totalVolume: 850000000,
        spreadContribution: 35,
        uptime: 99.8,
        avgSpread: 0.05,
        pairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LINK/USDT"],
        fees: {
          rebate: 0.02,
          commission: 0.01
        },
        performance: {
          fillRate: 98.5,
          latency: 12,
          reliability: 99.2
        },
        contract: {
          startDate: "2024-06-01",
          endDate: "2025-06-01",
          minimumVolume: 50000000,
          rebateStructure: "Tiered volume-based"
        },
        contact: {
          name: "David Chen",
          email: "d.chen@ams-trading.com",
          phone: "+1-212-555-0123"
        },
        geography: {
          country: "United States",
          timezone: "EST"
        }
      },
      {
        id: "lp-002",
        name: "Nordic Liquidity Partners",
        type: "institutional",
        status: "active",
        tier: "gold",
        monthlyVolume: 85000000,
        totalVolume: 425000000,
        spreadContribution: 22,
        uptime: 99.5,
        avgSpread: 0.08,
        pairs: ["BTC/USDT", "ETH/USDT", "BTC/EUR"],
        fees: {
          rebate: 0.015,
          commission: 0.015
        },
        performance: {
          fillRate: 96.8,
          latency: 18,
          reliability: 98.1
        },
        contract: {
          startDate: "2024-09-15",
          endDate: "2025-09-15",
          minimumVolume: 30000000,
          rebateStructure: "Fixed monthly rebate"
        },
        contact: {
          name: "Erik Andersson",
          email: "erik@nordiclp.no",
          phone: "+47-22-555-0456"
        },
        geography: {
          country: "Norway",
          timezone: "CET"
        }
      },
      {
        id: "lp-003",
        name: "Asia Pacific Trading Corp",
        type: "institutional",
        status: "active",
        tier: "silver",
        monthlyVolume: 45000000,
        totalVolume: 180000000,
        spreadContribution: 18,
        uptime: 98.9,
        avgSpread: 0.12,
        pairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
        fees: {
          rebate: 0.01,
          commission: 0.02
        },
        performance: {
          fillRate: 94.2,
          latency: 25,
          reliability: 96.5
        },
        contract: {
          startDate: "2024-11-01",
          endDate: "2025-11-01",
          minimumVolume: 20000000,
          rebateStructure: "Performance-based"
        },
        contact: {
          name: "Yuki Tanaka",
          email: "y.tanaka@aptcorp.jp",
          phone: "+81-3-555-0789"
        },
        geography: {
          country: "Japan",
          timezone: "JST"
        }
      },
      {
        id: "lp-004",
        name: "Retail Liquidity Network",
        type: "retail",
        status: "active",
        tier: "bronze",
        monthlyVolume: 15000000,
        totalVolume: 75000000,
        spreadContribution: 12,
        uptime: 97.2,
        avgSpread: 0.18,
        pairs: ["BTC/USDT", "ETH/USDT"],
        fees: {
          rebate: 0.005,
          commission: 0.025
        },
        performance: {
          fillRate: 89.5,
          latency: 45,
          reliability: 92.8
        },
        contract: {
          startDate: "2024-12-01",
          endDate: "2025-12-01",
          minimumVolume: 5000000,
          rebateStructure: "Flat rate"
        },
        contact: {
          name: "Sarah Johnson",
          email: "sarah@rln.com",
          phone: "+1-555-0321"
        },
        geography: {
          country: "Canada",
          timezone: "PST"
        }
      }
    ];

    const samplePairs: MarketPair[] = [
      {
        id: "btc-usdt",
        symbol: "BTC/USDT",
        baseAsset: "BTC",
        quoteAsset: "USDT",
        currentSpread: 0.08,
        targetSpread: 0.05,
        volume24h: 45000000,
        liquidity: {
          bid: 25000000,
          ask: 22000000,
          depth: 95
        },
        providers: 4,
        status: "healthy",
        lastUpdated: "2025-01-30T12:45:00Z"
      },
      {
        id: "eth-usdt",
        symbol: "ETH/USDT",
        baseAsset: "ETH",
        quoteAsset: "USDT",
        currentSpread: 0.12,
        targetSpread: 0.08,
        volume24h: 28000000,
        liquidity: {
          bid: 15000000,
          ask: 14000000,
          depth: 88
        },
        providers: 4,
        status: "healthy",
        lastUpdated: "2025-01-30T12:45:00Z"
      },
      {
        id: "sol-usdt",
        symbol: "SOL/USDT",
        baseAsset: "SOL",
        quoteAsset: "USDT",
        currentSpread: 0.25,
        targetSpread: 0.15,
        volume24h: 12000000,
        liquidity: {
          bid: 8000000,
          ask: 7500000,
          depth: 72
        },
        providers: 3,
        status: "thin",
        lastUpdated: "2025-01-30T12:45:00Z"
      }
    ];

    setLiquidityProviders(sampleProviders);
    setMarketPairs(samplePairs);
    setFilteredProviders(sampleProviders);
  }, []);

  // Filter providers
  useEffect(() => {
    let filtered = liquidityProviders;

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(provider => provider.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(provider => provider.status === statusFilter);
    }

    if (tierFilter !== "all") {
      filtered = filtered.filter(provider => provider.tier === tierFilter);
    }

    setFilteredProviders(filtered);
  }, [liquidityProviders, searchTerm, typeFilter, statusFilter, tierFilter]);

  const getTierColor = (tier: string) => {
    const colors = {
      platinum: "bg-purple-500 text-white",
      gold: "bg-yellow-500 text-white",
      silver: "bg-gray-400 text-white",
      bronze: "bg-orange-600 text-white"
    };
    return colors[tier as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500 text-white",
      inactive: "bg-gray-500 text-white",
      pending: "bg-yellow-500 text-white",
      suspended: "bg-red-500 text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      institutional: "🏦",
      retail: "👤",
      algorithmic: "🤖",
      internal: "🏢"
    };
    return icons[type as keyof typeof icons] || "📊";
  };

  const getPairStatusColor = (status: string) => {
    const colors = {
      healthy: "text-green-500",
      thin: "text-yellow-500",
      illiquid: "text-red-500"
    };
    return colors[status as keyof typeof colors] || "text-gray-500";
  };

  const calculateMetrics = (): MarketMakingMetrics => {
    const activeProviders = liquidityProviders.filter(p => p.status === "active");
    const totalVolume = activeProviders.reduce((sum, p) => sum + p.monthlyVolume, 0);
    const avgSpread = activeProviders.reduce((sum, p) => sum + p.avgSpread, 0) / activeProviders.length;
    const avgUptime = activeProviders.reduce((sum, p) => sum + p.uptime, 0) / activeProviders.length;
    const avgFillRate = activeProviders.reduce((sum, p) => sum + p.performance.fillRate, 0) / activeProviders.length;

    return {
      totalProviders: liquidityProviders.length,
      activeProviders: activeProviders.length,
      totalLiquidity: 125000000, // Calculated from pair liquidity
      avgSpread,
      volume24h: totalVolume,
      fillRate: avgFillRate,
      systemUptime: avgUptime,
      revenueShare: 285000
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Market Making & Liquidity CRM</h1>
          <p className="text-muted-foreground">Comprehensive liquidity provider management and market making operations</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
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
                <p className="text-sm text-muted-foreground">Active Providers</p>
                <p className="text-2xl font-bold">{metrics.activeProviders}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+3</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Liquidity</p>
                <p className="text-2xl font-bold">${(metrics.totalLiquidity / 1000000).toFixed(0)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Spread</p>
                <p className="text-2xl font-bold">{metrics.avgSpread.toFixed(3)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">-0.02%</span>
              <span className="text-muted-foreground ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{metrics.systemUptime.toFixed(1)}%</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+0.3%</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Liquidity Providers</TabsTrigger>
          <TabsTrigger value="pairs">Market Pairs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Liquidity Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liquidityProviders
                    .filter(p => p.status === "active")
                    .sort((a, b) => b.monthlyVolume - a.monthlyVolume)
                    .slice(0, 5)
                    .map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{getTypeIcon(provider.type)}</span>
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <Badge className={getTierColor(provider.tier)} variant="outline">
                              {provider.tier}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(provider.monthlyVolume / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-muted-foreground">{provider.spreadContribution}% contribution</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Pair Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketPairs.map((pair) => (
                    <div key={pair.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{pair.symbol}</p>
                        <p className="text-sm text-muted-foreground">{pair.providers} providers</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getPairStatusColor(pair.status)}`}>
                          {pair.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pair.currentSpread.toFixed(3)}% spread
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liquidity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["BTC/USDT", "ETH/USDT", "SOL/USDT", "Other Pairs"].map((pair, index) => {
                    const distribution = [45, 28, 15, 12][index];
                    return (
                      <div key={pair} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{pair}</span>
                          <span>{distribution}%</span>
                        </div>
                        <Progress value={distribution} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Fill Rate</span>
                      <span>{metrics.fillRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.fillRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Latency</span>
                      <span>18ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Reliability Score</span>
                      <span>96.6%</span>
                    </div>
                    <Progress value={96.6} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Revenue Share</span>
                      <span>${(metrics.revenueShare / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="institutional">Institutional</SelectItem>
                    <SelectItem value="algorithmic">Algorithmic</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Providers List */}
          <div className="grid gap-4">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div>
                          <h3 className="font-semibold text-xl">{provider.name}</h3>
                          <p className="text-muted-foreground flex items-center">
                            {getTypeIcon(provider.type)} {provider.type} • {provider.geography.country}
                          </p>
                        </div>
                        <Badge className={getTierColor(provider.tier)}>
                          {provider.tier}
                        </Badge>
                        <Badge className={getStatusColor(provider.status)}>
                          {provider.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Volume</p>
                          <p className="text-lg font-semibold">${(provider.monthlyVolume / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-muted-foreground">
                            {provider.spreadContribution}% of total liquidity
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Performance</p>
                          <p className="font-medium">Fill Rate: {provider.performance.fillRate}%</p>
                          <p className="text-sm text-muted-foreground">
                            Latency: {provider.performance.latency}ms
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Uptime & Reliability</p>
                          <p className="font-medium">{provider.uptime}%</p>
                          <p className="text-sm text-muted-foreground">
                            Reliability: {provider.performance.reliability}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fee Structure</p>
                          <p className="font-medium">Rebate: {provider.fees.rebate}%</p>
                          <p className="text-sm text-muted-foreground">
                            Commission: {provider.fees.commission}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {provider.pairs.map((pair, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {pair}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedProvider(provider)}>
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

        <TabsContent value="pairs" className="space-y-4">
          <div className="grid gap-4">
            {marketPairs.map((pair) => (
              <Card key={pair.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div>
                          <h3 className="font-semibold text-xl">{pair.symbol}</h3>
                          <p className="text-muted-foreground">{pair.baseAsset} / {pair.quoteAsset}</p>
                        </div>
                        <Badge className={`${getPairStatusColor(pair.status)} bg-opacity-10`}>
                          {pair.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Spread</p>
                          <p className="text-lg font-semibold">{pair.currentSpread.toFixed(3)}%</p>
                          <p className="text-sm text-muted-foreground">
                            Target: {pair.targetSpread.toFixed(3)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">24h Volume</p>
                          <p className="text-lg font-semibold">
                            ${(pair.volume24h / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Liquidity Depth</p>
                          <p className="font-medium">{pair.liquidity.depth}%</p>
                          <p className="text-sm text-muted-foreground">
                            Bid: ${(pair.liquidity.bid / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Providers</p>
                          <p className="text-lg font-semibold">{pair.providers}</p>
                          <p className="text-sm text-muted-foreground">
                            Ask: ${(pair.liquidity.ask / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Spread vs Target</span>
                          <span className={`text-sm ${pair.currentSpread <= pair.targetSpread ? 'text-green-500' : 'text-red-500'}`}>
                            {pair.currentSpread <= pair.targetSpread ? '✓ On Target' : '⚠ Above Target'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${pair.currentSpread <= pair.targetSpread ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((pair.currentSpread / pair.targetSpread) * 100, 100)}%` }}
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
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Provider Performance Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liquidityProviders
                    .filter(p => p.status === "active")
                    .sort((a, b) => b.performance.reliability - a.performance.reliability)
                    .map((provider, index) => (
                      <div key={provider.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">{provider.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{provider.performance.reliability}%</p>
                          <p className="text-sm text-muted-foreground">reliability</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Last 7 days", "Last 30 days", "Last 90 days", "Last 6 months"].map((period, index) => {
                    const uptime = [99.8, 99.5, 99.2, 98.9][index];
                    const fillRate = [98.5, 97.8, 97.2, 96.8][index];
                    return (
                      <div key={period} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{period}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Uptime</span>
                              <span>{uptime}%</span>
                            </div>
                            <Progress value={uptime} className="h-1 mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Fill Rate</span>
                              <span>{fillRate}%</span>
                            </div>
                            <Progress value={fillRate} className="h-1 mt-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedProvider(null)} />
          <div className="relative bg-background border border-border rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Provider Details: {selectedProvider.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedProvider(null)}>
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Period</p>
                      <p className="font-medium">{selectedProvider.contract.startDate} - {selectedProvider.contract.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Minimum Volume</p>
                      <p className="font-medium">${(selectedProvider.contract.minimumVolume / 1000000).toFixed(1)}M monthly</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rebate Structure</p>
                      <p className="font-medium">{selectedProvider.contract.rebateStructure}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Contact</p>
                      <p className="font-medium">{selectedProvider.contact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedProvider.contact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedProvider.contact.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Fill Rate</span>
                        <span className="text-sm">{selectedProvider.performance.fillRate}%</span>
                      </div>
                      <Progress value={selectedProvider.performance.fillRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm">{selectedProvider.uptime}%</span>
                      </div>
                      <Progress value={selectedProvider.uptime} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Reliability</span>
                        <span className="text-sm">{selectedProvider.performance.reliability}%</span>
                      </div>
                      <Progress value={selectedProvider.performance.reliability} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trading Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Volume</p>
                      <p className="text-lg font-bold">${(selectedProvider.monthlyVolume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                      <p className="font-medium">${(selectedProvider.totalVolume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Liquidity Contribution</p>
                      <p className="font-medium">{selectedProvider.spreadContribution}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fee Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Rebate Rate</p>
                      <p className="font-medium">{selectedProvider.fees.rebate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Commission Rate</p>
                      <p className="font-medium">{selectedProvider.fees.commission}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Spread</p>
                      <p className="font-medium">{selectedProvider.avgSpread.toFixed(3)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Supported Trading Pairs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.pairs.map((pair, index) => (
                      <Badge key={index} variant="secondary">{pair}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}