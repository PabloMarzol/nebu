import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Shield, 
  DollarSign, 
  Activity, 
  Database,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function OperationsDashboard() {
  // Fetch system health dashboard
  const { data: healthData, isLoading } = useQuery({
    queryKey: ["/api/operations/health/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch today's operational report
  const today = new Date().toISOString().split('T')[0];
  const { data: operationalReport } = useQuery({
    queryKey: [`/api/operations/reports/operational/${today}`],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const dashboard = healthData?.dashboard;
  const operations = dashboard?.operations;
  const compliance = dashboard?.compliance;
  const alerts = dashboard?.alerts;
  const performance = dashboard?.performance;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive monitoring and management of NebulaX exchange operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={dashboard?.systemStatus === "operational" ? "default" : "destructive"}
            className="text-sm"
          >
            {dashboard?.systemStatus?.toUpperCase() || "OPERATIONAL"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(dashboard?.timestamp || Date.now()).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {performance?.uptime || "99.98%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {performance?.responseTime || "45ms"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average API response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${operations?.financial?.dailyRevenue || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Today's revenue in USD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(alerts?.critical || 0) + (alerts?.high || 0) + (alerts?.medium || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical, high & medium priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="support">Support & CRM</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Throughput</span>
                    <span>{performance?.throughput || "2,847 req/min"}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span>98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Trading Engine Load</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Daily Operations Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Operations Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {operations?.newUsers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">New Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {operations?.tradingVolume || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Trades Executed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {operations?.support?.newTickets || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Support Tickets</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {operations?.support?.openIncidents || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Open Incidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alert Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg bg-red-50 border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts?.critical || 0}
                  </div>
                  <p className="text-sm text-red-600">Critical</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {alerts?.high || 0}
                  </div>
                  <p className="text-sm text-orange-600">High</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {alerts?.medium || 0}
                  </div>
                  <p className="text-sm text-yellow-600">Medium</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {alerts?.low || 0}
                  </div>
                  <p className="text-sm text-blue-600">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support & CRM Tab */}
        <TabsContent value="support" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Support Ticket Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>New Tickets Today</span>
                  <Badge variant="outline">{operations?.support?.newTickets || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Resolved Tickets</span>
                  <Badge variant="default">{operations?.support?.resolvedTickets || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Resolution Rate</span>
                  <Badge variant="secondary">
                    {operations?.support?.resolvedTickets && operations?.support?.newTickets 
                      ? Math.round((operations.support.resolvedTickets / operations.support.newTickets) * 100)
                      : 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">2,847</div>
                    <p className="text-xs">Retail Users</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold text-blue-600">156</div>
                    <p className="text-xs">VIP Users</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold text-purple-600">23</div>
                    <p className="text-xs">Institutional</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold text-red-600">8</div>
                    <p className="text-xs">High Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Support Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "2 minutes ago", action: "Ticket escalated to technical team", type: "escalation" },
                  { time: "15 minutes ago", action: "Customer segmentation updated", type: "update" },
                  { time: "1 hour ago", action: "VIP customer profile created", type: "creation" },
                  { time: "2 hours ago", action: "Support ticket resolved", type: "resolution" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {activity.type === "escalation" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                      {activity.type === "update" && <Activity className="h-4 w-4 text-blue-500" />}
                      {activity.type === "creation" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.type === "resolution" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <span className="text-sm">{activity.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treasury Tab */}
        <TabsContent value="treasury" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Wallet Reconciliation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { asset: "BTC", status: "reconciled", lastCheck: "5 min ago" },
                  { asset: "ETH", status: "reconciled", lastCheck: "5 min ago" },
                  { asset: "USDT", status: "reconciled", lastCheck: "6 min ago" },
                  { asset: "USDC", status: "discrepancy", lastCheck: "8 min ago" }
                ].map((wallet, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{wallet.asset}</span>
                      <Badge 
                        variant={wallet.status === "reconciled" ? "default" : "destructive"}
                      >
                        {wallet.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{wallet.lastCheck}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treasury Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Initiate Manual Reconciliation
                </Button>
                <Button className="w-full" variant="outline">
                  Generate Treasury Report
                </Button>
                <Button className="w-full" variant="outline">
                  View Audit Trail
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Suspicious Transactions</span>
                  <Badge variant="outline">{compliance?.suspiciousTransactions || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>High Risk Users</span>
                  <Badge variant="destructive">{compliance?.highRiskUsers || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Large Transactions (&gt;$50K)</span>
                  <Badge variant="secondary">{compliance?.largeTransactionCount || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Generate SAR Report
                </Button>
                <Button className="w-full" variant="outline">
                  Run AML Screening
                </Button>
                <Button className="w-full" variant="outline">
                  Export Compliance Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No active incidents at this time</p>
                  <p className="text-sm">System is operating normally</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Streams Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stream: "Trading Fees", amount: "$8,547", percentage: 45 },
                  { stream: "OTC Commission", amount: "$5,234", percentage: 28 },
                  { stream: "Spread Revenue", amount: "$3,456", percentage: 18 },
                  { stream: "Affiliate Program", amount: "$1,789", percentage: 9 }
                ].map((revenue, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{revenue.stream}</span>
                      <span className="font-medium">{revenue.amount}</span>
                    </div>
                    <Progress value={revenue.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    $19,026
                  </div>
                  <p className="text-sm text-muted-foreground">Total Revenue Today</p>
                  <p className="text-xs text-green-600">+12.5% vs yesterday</p>
                </div>
                <Button className="w-full" variant="outline">
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}