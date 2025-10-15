import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Eye, 
  Filter,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  Zap,
  AlertCircle,
  BarChart3,
  Building2,
  FileText,
  Globe,
  Settings,
  Target,
  Layers,
  Database,
  Server,
  Bell,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardData {
  liquidity: {
    totalProviders: number;
    activeProviders: number;
    totalLiquidity: string;
    averageSpread: number;
    uptimeAverage: number;
    alerts: {
      lowLiquidity: number;
      highSpread: number;
      providerOffline: number;
    };
  };
  compliance: {
    pendingReviews: number;
    completedReviews: number;
    flaggedTransactions: number;
    averageReviewTime: number;
  };
  institutional: {
    totalClients: number;
    activeClients: number;
    totalVolume30d: string;
    averageTradeSize: string;
  };
  treasury: {
    totalBalance: {
      BTC: string;
      ETH: string;
      USDT: string;
    };
    hotWalletRatio: number;
    coldStorageRatio: number;
    alerts: {
      lowBalance: number;
      highOutflow: number;
      reconciliationFailed: number;
    };
  };
  risk: {
    overallRiskScore: number;
    activeEvents: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  operations: {
    systemUptime: number;
    activeIncidents: number;
    resolvedIncidents: number;
    averageResolutionTime: number;
  };
}

export function ExchangeOperationsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['/api/exchange-ops/dashboard', refreshKey],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: alertsData } = useQuery({
    queryKey: ['/api/exchange-ops/alerts', refreshKey],
    refetchInterval: 15000 // Refresh every 15 seconds
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <CardContent className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-300">Loading Exchange Operations Dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-500/30 p-8">
          <CardContent className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">Failed to load Exchange Operations Dashboard</p>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const data: DashboardData = dashboardData || {
    liquidity: {
      totalProviders: 12,
      activeProviders: 10,
      totalLiquidity: "145000000.00",
      averageSpread: 0.0007,
      uptimeAverage: 99.85,
      alerts: { lowLiquidity: 2, highSpread: 1, providerOffline: 0 }
    },
    compliance: {
      pendingReviews: 15,
      completedReviews: 142,
      flaggedTransactions: 8,
      averageReviewTime: 4.2
    },
    institutional: {
      totalClients: 45,
      activeClients: 38,
      totalVolume30d: "890000000.00",
      averageTradeSize: "1250000.00"
    },
    treasury: {
      totalBalance: { BTC: "2576.25", ETH: "15420.75", USDT: "12500000.00" },
      hotWalletRatio: 0.15,
      coldStorageRatio: 0.85,
      alerts: { lowBalance: 1, highOutflow: 0, reconciliationFailed: 0 }
    },
    risk: {
      overallRiskScore: 35,
      activeEvents: { critical: 1, high: 3, medium: 8, low: 12 }
    },
    operations: {
      systemUptime: 99.85,
      activeIncidents: 3,
      resolvedIncidents: 28,
      averageResolutionTime: 4.2
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "text-green-400";
    if (value >= thresholds.warning) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskColor = (score: number) => {
    if (score <= 25) return "text-green-400";
    if (score <= 50) return "text-yellow-400";
    if (score <= 75) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Exchange Operations CRM</h1>
              <p className="text-gray-400">Comprehensive operational oversight and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Operational
              </Badge>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 mb-6">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="liquidity" className="text-gray-300 data-[state=active]:text-white">
              <Layers className="w-4 h-4 mr-2" />
              Liquidity
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-gray-300 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="institutional" className="text-gray-300 data-[state=active]:text-white">
              <Building2 className="w-4 h-4 mr-2" />
              Institutional
            </TabsTrigger>
            <TabsTrigger value="treasury" className="text-gray-300 data-[state=active]:text-white">
              <Wallet className="w-4 h-4 mr-2" />
              Treasury
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-gray-300 data-[state=active]:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="operations" className="text-gray-300 data-[state=active]:text-white">
              <Server className="w-4 h-4 mr-2" />
              Operations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Liquidity</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(data.liquidity.totalLiquidity)}</p>
                    </div>
                    <Layers className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Providers</p>
                      <p className="text-2xl font-bold text-white">{data.liquidity.activeProviders}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Compliance Reviews</p>
                      <p className="text-2xl font-bold text-white">{data.compliance.pendingReviews}</p>
                    </div>
                    <Shield className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Institutional Clients</p>
                      <p className="text-2xl font-bold text-white">{data.institutional.activeClients}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">System Uptime</p>
                      <p className={`text-2xl font-bold ${getStatusColor(data.operations.systemUptime, { good: 99.5, warning: 99.0 })}`}>
                        {data.operations.systemUptime}%
                      </p>
                    </div>
                    <Server className="h-8 w-8 text-cyan-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(data.risk.overallRiskScore)}`}>
                        {data.risk.overallRiskScore}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Low Liquidity</span>
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                        {data.liquidity.alerts.lowLiquidity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Pending Compliance</span>
                      <Badge variant="outline" className="text-red-400 border-red-400">
                        {data.compliance.pendingReviews}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Active Incidents</span>
                      <Badge variant="outline" className="text-orange-400 border-orange-400">
                        {data.operations.activeIncidents}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Treasury Alerts</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {data.treasury.alerts.lowBalance}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Average Spread</span>
                        <span className="text-white">{(data.liquidity.averageSpread * 100).toFixed(4)}%</span>
                      </div>
                      <Progress value={data.liquidity.averageSpread * 10000} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Provider Uptime</span>
                        <span className="text-white">{data.liquidity.uptimeAverage}%</span>
                      </div>
                      <Progress value={data.liquidity.uptimeAverage} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Hot Wallet Ratio</span>
                        <span className="text-white">{(data.treasury.hotWalletRatio * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={data.treasury.hotWalletRatio * 100} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="liquidity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Providers</p>
                      <p className="text-2xl font-bold text-white">{data.liquidity.totalProviders}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Providers</p>
                      <p className="text-2xl font-bold text-green-400">{data.liquidity.activeProviders}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Average Spread</p>
                      <p className="text-2xl font-bold text-white">{(data.liquidity.averageSpread * 100).toFixed(4)}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Uptime Average</p>
                      <p className={`text-2xl font-bold ${getStatusColor(data.liquidity.uptimeAverage, { good: 99.5, warning: 99.0 })}`}>
                        {data.liquidity.uptimeAverage}%
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-cyan-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Liquidity Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Layers className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Detailed liquidity provider management interface</p>
                  <p className="text-gray-500 text-sm mt-2">Provider performance, pool monitoring, and alert management</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Reviews</p>
                      <p className="text-2xl font-bold text-yellow-400">{data.compliance.pendingReviews}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Completed Reviews</p>
                      <p className="text-2xl font-bold text-green-400">{data.compliance.completedReviews}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Flagged Transactions</p>
                      <p className="text-2xl font-bold text-red-400">{data.compliance.flaggedTransactions}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Review Time</p>
                      <p className="text-2xl font-bold text-white">{data.compliance.averageReviewTime}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">AML monitoring, transaction screening, and regulatory reporting</p>
                  <p className="text-gray-500 text-sm mt-2">Automated compliance workflows and regulatory submissions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="institutional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Clients</p>
                      <p className="text-2xl font-bold text-white">{data.institutional.totalClients}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Clients</p>
                      <p className="text-2xl font-bold text-green-400">{data.institutional.activeClients}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">30d Volume</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(data.institutional.totalVolume30d)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Trade Size</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(data.institutional.averageTradeSize)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Institutional Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">OTC desk management, large block trading, and institutional services</p>
                  <p className="text-gray-500 text-sm mt-2">Prime brokerage, custody services, and institutional client management</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">BTC Balance</p>
                      <p className="text-2xl font-bold text-white">{data.treasury.totalBalance.BTC}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">ETH Balance</p>
                      <p className="text-2xl font-bold text-white">{data.treasury.totalBalance.ETH}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">USDT Balance</p>
                      <p className="text-2xl font-bold text-white">{formatNumber(parseFloat(data.treasury.totalBalance.USDT))}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Treasury Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wallet className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Multi-currency balance management and treasury operations</p>
                  <p className="text-gray-500 text-sm mt-2">Hot/cold wallet management, reconciliation, and treasury reporting</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Overall Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(data.risk.overallRiskScore)}`}>
                        {data.risk.overallRiskScore}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Critical Events</p>
                      <p className="text-2xl font-bold text-red-400">{data.risk.activeEvents.critical}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High Risk Events</p>
                      <p className="text-2xl font-bold text-orange-400">{data.risk.activeEvents.high}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Medium Risk Events</p>
                      <p className="text-2xl font-bold text-yellow-400">{data.risk.activeEvents.medium}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Real-time risk monitoring and automated risk management</p>
                  <p className="text-gray-500 text-sm mt-2">Position limits, concentration risk, and risk event tracking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">System Uptime</p>
                      <p className={`text-2xl font-bold ${getStatusColor(data.operations.systemUptime, { good: 99.5, warning: 99.0 })}`}>
                        {data.operations.systemUptime}%
                      </p>
                    </div>
                    <Server className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Incidents</p>
                      <p className="text-2xl font-bold text-orange-400">{data.operations.activeIncidents}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Resolved Incidents</p>
                      <p className="text-2xl font-bold text-green-400">{data.operations.resolvedIncidents}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Resolution Time</p>
                      <p className="text-2xl font-bold text-white">{data.operations.averageResolutionTime}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Operational Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Server className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">System health monitoring and operational incident management</p>
                  <p className="text-gray-500 text-sm mt-2">Service monitoring, incident tracking, and operational metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}