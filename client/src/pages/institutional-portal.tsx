import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  Download,
  MessageSquare,
  Settings,
  Zap,
  Wallet,
  CreditCard,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface InstitutionalDashboardData {
  creditProfile: {
    limit: number;
    used: number;
    available: number;
    riskScore: number;
    tier: string;
  };
  riskMetrics: {
    leverage: number;
    concentration: number;
    marginUtilization: number;
    unrealizedPnL: number;
  };
  recentSettlements: Array<{
    id: string;
    symbol: string;
    amount: number;
    status: string;
    date: string;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    timestamp: string;
  }>;
  apiMetrics: {
    requestsToday: number;
    uptime: number;
    avgLatency: number;
    errorRate: number;
  };
}

export default function InstitutionalPortal() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/institutional/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: liquidityData } = useQuery({
    queryKey: ["/api/institutional/liquidity"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Institutional Portal</h1>
              <p className="text-slate-300">Advanced OTC trading and risk management dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {(dashboardData as any)?.alerts?.filter((alert: any) => alert.severity === 'critical').length > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Risk Alerts</AlertTitle>
            <AlertDescription>
              {(dashboardData as any).alerts.filter((alert: any) => alert.severity === 'critical').length} critical alerts require immediate attention
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary">Overview</TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-primary">Trading</TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-primary">Risk</TabsTrigger>
            <TabsTrigger value="settlement" className="data-[state=active]:bg-primary">Settlement</TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-primary">Compliance</TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-primary">API</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Credit Profile */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">Credit Profile</CardTitle>
                    <CreditCard className="w-4 h-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Credit Used</span>
                        <span className="text-white">
                          ${(((dashboardData as any)?.creditProfile?.used || 0) / 1000000).toFixed(1)}M / ${(((dashboardData as any)?.creditProfile?.limit || 0) / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <Progress 
                        value={((dashboardData?.creditProfile?.used || 0) / (dashboardData?.creditProfile?.limit || 1)) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Risk Score</span>
                      <Badge variant={
                        (dashboardData?.creditProfile?.riskScore || 0) > 70 ? "destructive" :
                        (dashboardData?.creditProfile?.riskScore || 0) > 40 ? "secondary" : "default"
                      }>
                        {dashboardData?.creditProfile?.riskScore || 0}/100
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Value */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">Portfolio Value</CardTitle>
                    <Wallet className="w-4 h-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">
                      ${((dashboardData?.riskMetrics?.unrealizedPnL || 0) + 10000000).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">
                        +{((dashboardData?.riskMetrics?.unrealizedPnL || 0) / 1000).toFixed(1)}K (24h)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Positions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">Active Positions</CardTitle>
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-slate-400">
                      Leverage: {((dashboardData?.riskMetrics?.leverage || 0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">System Status</CardTitle>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-white text-sm">Operational</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      API Uptime: {((dashboardData?.apiMetrics?.uptime || 0) * 100).toFixed(2)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Settlements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData?.recentSettlements?.slice(0, 5).map((settlement: any) => (
                    <div key={settlement.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div>
                        <div className="text-white font-medium">{settlement.symbol}</div>
                        <div className="text-xs text-slate-400">{settlement.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">${settlement.amount.toLocaleString()}</div>
                        <Badge variant={settlement.status === 'settled' ? 'default' : 'secondary'} className="text-xs">
                          {settlement.status}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-slate-400 py-8">
                      No recent settlements
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData?.alerts?.slice(0, 5).map((alert: any) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-400' :
                        alert.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                      }`} />
                      <div className="flex-1">
                        <div className="text-white text-sm">{alert.message}</div>
                        <div className="text-xs text-slate-400">{alert.timestamp}</div>
                      </div>
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'high' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center text-slate-400 py-8">
                      No active alerts
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liquidity Venues */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Liquidity Venues</CardTitle>
                  <CardDescription>Real-time venue pricing and availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liquidityData?.venues?.map((venue: any) => (
                      <div key={venue.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                        <div>
                          <div className="text-white font-medium">{venue.name}</div>
                          <div className="text-xs text-slate-400">Latency: {venue.latency}ms</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">{venue.reliability}% uptime</div>
                          <Badge variant={venue.status === 'active' ? 'default' : 'secondary'}>
                            {venue.status}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-slate-400 py-8">
                        Loading venue data...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Smart Order Routing */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Smart Order Routing</CardTitle>
                  <CardDescription>Optimal execution across venues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded border border-blue-500/20">
                      <div className="text-white font-medium mb-2">Best Execution Algorithm</div>
                      <div className="text-sm text-slate-300 mb-3">
                        Automatically routes orders across multiple venues for optimal pricing
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400">Avg Slippage:</span>
                          <span className="text-white ml-1">0.12%</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Fill Rate:</span>
                          <span className="text-white ml-1">99.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Tab */}
          <TabsContent value="risk" className="space-y-6">
            <RiskManagementDashboard riskMetrics={dashboardData?.riskMetrics} />
          </TabsContent>

          {/* Settlement Tab */}
          <TabsContent value="settlement" className="space-y-6">
            <SettlementDashboard settlements={dashboardData?.recentSettlements} />
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <ComplianceDashboard />
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <APIManagementDashboard apiMetrics={dashboardData?.apiMetrics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Sub-components for each tab
function RiskManagementDashboard({ riskMetrics }: { riskMetrics: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Real-Time Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Leverage Ratio</span>
                <span className="text-white">{((riskMetrics?.leverage || 0) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(riskMetrics?.leverage || 0) * 10} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Concentration Risk</span>
                <span className="text-white">{((riskMetrics?.concentration || 0) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(riskMetrics?.concentration || 0) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Margin Utilization</span>
                <span className="text-white">{((riskMetrics?.marginUtilization || 0) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(riskMetrics?.marginUtilization || 0) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert className="border-yellow-500 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Consider reducing BTC concentration below 25% limit
              </AlertDescription>
            </Alert>
            <Alert className="border-green-500 bg-green-500/10">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Current leverage within acceptable risk parameters
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettlementDashboard({ settlements }: { settlements: any[] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Settlement Status</CardTitle>
        <CardDescription>Real-time settlement tracking and reconciliation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settlements?.map((settlement: any) => (
            <div key={settlement.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded">
              <div>
                <div className="text-white font-medium">{settlement.symbol}</div>
                <div className="text-sm text-slate-400">{settlement.date}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">${settlement.amount.toLocaleString()}</div>
                <Badge variant={settlement.status === 'settled' ? 'default' : 'secondary'}>
                  {settlement.status}
                </Badge>
              </div>
            </div>
          )) || (
            <div className="text-center text-slate-400 py-8">
              No settlements to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ComplianceDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Compliance Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-white">AML Screening</span>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-white">KYC Verification</span>
            </div>
            <Badge variant="default">Compliant</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white">Regulatory Reporting</span>
            </div>
            <Badge variant="secondary">Pending</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Generate Compliance Report
          </Button>
          <div className="text-xs text-slate-400 mt-2 text-center">
            Last exported: 2 hours ago
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function APIManagementDashboard({ apiMetrics }: { apiMetrics: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">API Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{(apiMetrics?.requestsToday || 0).toLocaleString()}</div>
              <div className="text-xs text-slate-400">Requests Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{apiMetrics?.avgLatency || 0}ms</div>
              <div className="text-xs text-slate-400">Avg Latency</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Uptime</span>
              <span className="text-white">{((apiMetrics?.uptime || 0) * 100).toFixed(2)}%</span>
            </div>
            <Progress value={(apiMetrics?.uptime || 0) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Error Rate</span>
              <span className="text-white">{((apiMetrics?.errorRate || 0) * 100).toFixed(2)}%</span>
            </div>
            <Progress value={(apiMetrics?.errorRate || 0) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">API Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Generate API Key
          </Button>
          <Button variant="outline" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
          <Button variant="outline" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Webhook Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}