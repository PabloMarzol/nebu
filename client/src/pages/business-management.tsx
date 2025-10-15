import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  Wallet, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  FileText, 
  BarChart3,
  Settings,
  UserCheck,
  CreditCard,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Calendar,
  Download
} from "lucide-react";

interface ExecutiveAPIResponse {
  success: boolean;
  data: {
    totalUsers: number;
    totalVolume: number;
    activeOrders: number;
    systemHealth: number;
  };
}

interface SupportTicketAPIResponse {
  success: boolean;
  data: SupportTicket[];
}

interface SecurityAlertAPIResponse {
  success: boolean;
  data: SecurityAlert[];
}

interface KycWorkflowAPIResponse {
  success: boolean;
  data: KycWorkflow[];
}

interface WalletOperationAPIResponse {
  success: boolean;
  data: WalletOperation[];
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  subject: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
}

interface SecurityAlert {
  id: string;
  alertType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  status: string;
  createdAt: string;
}

interface KycWorkflow {
  id: string;
  userId: string;
  currentStage: string;
  kycLevel: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedReviewer?: string;
  createdAt: string;
}

interface WalletOperation {
  id: string;
  walletType: string;
  operationType: string;
  asset: string;
  amount: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

export default function BusinessManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch executive dashboard data
  const { data: executiveResponse, isLoading: executiveLoading } = useQuery<ExecutiveAPIResponse>({
    queryKey: ["/api/bms/executive/kpis"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch support tickets
  const { data: supportResponse, isLoading: ticketsLoading } = useQuery<SupportTicketAPIResponse>({
    queryKey: ["/api/bms/support/tickets"],
  });

  // Fetch security alerts
  const { data: alertsResponse, isLoading: alertsLoading } = useQuery<SecurityAlertAPIResponse>({
    queryKey: ["/api/bms/security/alerts"],
  });

  // Fetch KYC workflows
  const { data: kycResponse, isLoading: kycLoading } = useQuery<KycWorkflowAPIResponse>({
    queryKey: ["/api/bms/kyc/workflows"],
  });

  // Fetch wallet operations
  const { data: walletResponse, isLoading: walletLoading } = useQuery<WalletOperationAPIResponse>({
    queryKey: ["/api/bms/wallet/operations"],
  });

  // Extract data from API responses
  const executiveData = executiveResponse?.data;
  const supportTickets = supportResponse?.data || [];
  const securityAlerts = alertsResponse?.data || [];
  const kycWorkflows = kycResponse?.data || [];
  const walletOps = walletResponse?.data || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (executiveLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-600 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="h-8 w-8 text-purple-400" />
              Business Management System
            </h1>
            <p className="text-gray-300 mt-1">
              Comprehensive operational control and analytics for NebulaX Exchange
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
              <Activity className="h-3 w-3 mr-1" />
              System Operational
            </Badge>
            <Button variant="outline" className="text-purple-400 border-purple-500 hover:bg-purple-500/20">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Executive KPI Dashboard */}
        {executiveData && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{executiveData?.totalUsers?.toLocaleString() || '0'}</div>
                <p className="text-xs text-gray-400">Active registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Trading Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${executiveData?.totalVolume?.toLocaleString() || '0'}</div>
                <p className="text-xs text-gray-400">Total trading volume</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Orders</CardTitle>
                <FileText className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{executiveData?.activeOrders || 0}</div>
                <p className="text-xs text-gray-400">Orders currently processing</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">System Health</CardTitle>
                <Shield className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{executiveData?.systemHealth?.toFixed(1) || '0'}%</div>
                <p className="text-xs text-gray-400">Platform uptime status</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="kyc" className="data-[state=active]:bg-purple-600">
              <UserCheck className="h-4 w-4 mr-2" />
              KYC Management
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-600">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet Operations
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              Support Center
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* System Health */}
              {executiveData && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-400" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Trading Pairs Active</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        {executiveData.systemHealth.activeTradingPairs}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pending Wallet Operations</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {executiveData.systemHealth.pendingWalletOps}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Risk Alerts</span>
                      <Badge className="bg-red-500/20 text-red-400">
                        {executiveData.systemHealth.riskAlerts}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Compliance Summary */}
              {executiveData && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-400" />
                      Compliance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pending KYC Reviews</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {kycWorkflows.filter(w => w.status === 'pending').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pending Reports</span>
                      <Badge className="bg-orange-500/20 text-orange-400">
                        {securityAlerts.filter(a => a.status === 'pending').length}
                      </Badge>
                    </div>
                    <div className="pt-2">
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">85% compliance rating</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Treasury report generated successfully</span>
                    <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-gray-300">New KYC submission requires review</span>
                    <span className="text-xs text-gray-500 ml-auto">5 minutes ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
                    <Wallet className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Hot wallet sweep completed</span>
                    <span className="text-xs text-gray-500 ml-auto">12 minutes ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Management Tab */}
          <TabsContent value="kyc" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">KYC Workflow Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-purple-400 border-purple-500">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-purple-400 border-purple-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/30">
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-4 text-gray-300 font-medium">User ID</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Stage</th>
                        <th className="text-left p-4 text-gray-300 font-medium">KYC Level</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Risk Level</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Reviewer</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kycWorkflows.map((kyc) => (
                        <tr key={kyc.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4 text-gray-300 font-mono text-sm">
                            {kyc.userId.substring(0, 8)}...
                          </td>
                          <td className="p-4 text-gray-300">{kyc.currentStage}</td>
                          <td className="p-4">
                            <Badge className="bg-blue-500/20 text-blue-400">
                              Level {kyc.kycLevel}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getPriorityColor(kyc.riskLevel)}>
                              {kyc.riskLevel}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(kyc.status)}>
                              {kyc.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-300">
                            {kyc.assignedReviewer || "Unassigned"}
                          </td>
                          <td className="p-4 text-gray-400 text-sm">
                            {new Date(kyc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Operations Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Wallet Operations</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                New Operation
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Hot Wallets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400 mb-2">98.2%</div>
                  <p className="text-gray-400 text-sm">Operational status</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Cold Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400 mb-2">100%</div>
                  <p className="text-gray-400 text-sm">Security rating</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Pending Ops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{walletOps.filter(op => op.status === 'pending').length}</div>
                  <p className="text-gray-400 text-sm">Require approval</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Operations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/30">
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Asset</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Amount</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Wallet</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletOps.slice(0, 10).map((op) => (
                        <tr key={op.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4 text-gray-300">{op.operationType}</td>
                          <td className="p-4 text-gray-300 font-semibold">{op.asset}</td>
                          <td className="p-4 text-gray-300">{parseFloat(op.amount).toLocaleString()}</td>
                          <td className="p-4">
                            <Badge className="bg-gray-600 text-gray-300">
                              {op.walletType}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(op.status)}>
                              {op.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-400 text-sm">
                            {new Date(op.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Center Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Support Ticket Management</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                New Ticket
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {supportTickets.filter(t => t.status === 'open').length}
                  </div>
                  <p className="text-gray-400 text-sm">Open Tickets</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {supportTickets.filter(t => t.priority === 'high' || t.priority === 'critical').length}
                  </div>
                  <p className="text-gray-400 text-sm">High Priority</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {supportTickets.filter(t => t.status === 'resolved').length}
                  </div>
                  <p className="text-gray-400 text-sm">Resolved Today</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {supportTickets.filter(t => !t.assignedTo).length}
                  </div>
                  <p className="text-gray-400 text-sm">Unassigned</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/30">
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-4 text-gray-300 font-medium">Ticket #</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Subject</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Priority</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Assigned</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTickets.slice(0, 10).map((ticket) => (
                        <tr key={ticket.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4 text-purple-400 font-mono">
                            {ticket.ticketNumber}
                          </td>
                          <td className="p-4 text-gray-300 max-w-xs truncate">
                            {ticket.subject}
                          </td>
                          <td className="p-4">
                            <Badge className="bg-gray-600 text-gray-300">
                              {ticket.category}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-300">
                            {ticket.assignedTo || "Unassigned"}
                          </td>
                          <td className="p-4 text-gray-400 text-sm">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Security & Incident Management</h2>
              <Button variant="destructive">
                Report Incident
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {securityAlerts.filter(a => a.severity === 'critical').length}
                  </div>
                  <p className="text-gray-400 text-sm">Critical Alerts</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {securityAlerts.filter(a => a.severity === 'high').length}
                  </div>
                  <p className="text-gray-400 text-sm">High Priority</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {securityAlerts.filter(a => a.status === 'open').length}
                  </div>
                  <p className="text-gray-400 text-sm">Active Alerts</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-400 mb-1">99.8%</div>
                  <p className="text-gray-400 text-sm">Security Score</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Security Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/30">
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-4 text-gray-300 font-medium">Alert Type</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Description</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Severity</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityAlerts.slice(0, 10).map((alert) => (
                        <tr key={alert.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="p-4 text-gray-300">{alert.alertType}</td>
                          <td className="p-4 text-gray-300 max-w-xs truncate">
                            {alert.description}
                          </td>
                          <td className="p-4">
                            <Badge className={getPriorityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-400 text-sm">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}