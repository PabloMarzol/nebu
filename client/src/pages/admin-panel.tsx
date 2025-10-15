import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  AlertTriangle, 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Settings,
  Search,
  Filter,
  Download,
  UserCheck,
  Wallet,
  MessageSquare,
  BarChart3,
  Eye,
  Flag,
  DollarSign,
  Globe,
  Zap,
  Lock,
  Bell,
  Archive,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Dashboard stats with live API integration
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // User forensics data
  const { data: userForensics } = useQuery({
    queryKey: ['/api/admin/user-forensics'],
    enabled: activeTab === 'users'
  });

  // AML risk profiles
  const { data: highRiskUsers } = useQuery({
    queryKey: ['/api/admin/high-risk-users'],
    enabled: activeTab === 'risk'
  });

  // Transaction monitoring
  const { data: flaggedTransactions } = useQuery({
    queryKey: ['/api/admin/flagged-transactions'],
    enabled: activeTab === 'transactions'
  });

  // Support tickets
  const { data: supportTickets } = useQuery({
    queryKey: ['/api/admin/support-tickets'],
    enabled: activeTab === 'support'
  });

  // Wallet operations
  const { data: walletOperations } = useQuery({
    queryKey: ['/api/admin/wallet-operations'],
    enabled: activeTab === 'wallet'
  });

  // Compliance reports
  const { data: complianceReports } = useQuery({
    queryKey: ['/api/admin/compliance-reports'],
    enabled: activeTab === 'compliance'
  });

  const stats = dashboardStats || {
    totalUsers: 15847,
    activeTickets: 23,
    pendingApprovals: 8,
    criticalAlerts: 2,
    highRiskUsers: 5,
    recentTransactions: 1245,
    signups24h: 156,
    volume24h: 2456789.45,
    revenue24h: 45672.89,
    complianceStatus: 98.5,
    supportBacklog: 23,
    systemHealth: 99.8,
    liquidity: 89.2,
    pnl: 125476.34,
    legalExposure: 2,
    downtime: 0.02,
    fraudDetection: 99.1,
    kycApprovalRate: 94.7,
    withdrawalQueue: 12,
    depositSuccess: 99.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 NebulaX Business Management System
          </h1>
          <p className="text-gray-300">
            Comprehensive platform management and institutional-grade monitoring
          </p>
        </div>

        {/* Executive Dashboard KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {/* Real-time KPIs Row 1 */}
          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Signups</p>
                  <p className="text-2xl font-bold text-white">{stats.signups24h}</p>
                  <p className="text-xs text-green-400">+12.5% vs yesterday</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-white">${(stats.volume24h / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-green-400">+8.3% vs yesterday</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Revenue</p>
                  <p className="text-2xl font-bold text-white">${(stats.revenue24h / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-400">+15.2% vs yesterday</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Tickets</p>
                  <p className="text-2xl font-bold text-white">{stats.activeTickets}</p>
                  <p className="text-xs text-orange-400">+3 new today</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">High Risk Users</p>
                  <p className="text-2xl font-bold text-white">{stats.highRiskUsers}</p>
                  <p className="text-xs text-red-400">Requires attention</p>
                </div>
                <Flag className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Health</p>
                  <p className="text-2xl font-bold text-white">{stats.systemHealth}%</p>
                  <p className="text-xs text-green-400">All systems operational</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-8 bg-black/20 border-purple-500/20 w-full">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Users
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-purple-600">
              Risk
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-purple-600">
              Support
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-600">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-purple-600">
              Compliance
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600">
              System
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Executive Dashboard Overview
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time monitoring and KPI tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Critical Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-red-900/20 border-red-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{stats.criticalAlerts}</p>
                        <p className="text-sm text-gray-300">Critical Alerts</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-900/20 border-yellow-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">{stats.pendingApprovals}</p>
                        <p className="text-sm text-gray-300">Pending Approvals</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.complianceStatus}%</p>
                        <p className="text-sm text-gray-300">Compliance Status</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-black/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">User KYC Approved</p>
                          <p className="text-gray-400 text-sm">user@example.com - Level 2 verification</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">2 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="text-white font-medium">High Risk Transaction</p>
                          <p className="text-gray-400 text-sm">$45,000 withdrawal flagged for review</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">15 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Security Alert</p>
                          <p className="text-gray-400 text-sm">Multiple failed login attempts detected</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab Content */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management & Forensics
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor user activities and account management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users by email, ID, or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/20 border-purple-500/20 text-white"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" className="border-purple-500/20">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-300">Total Users</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">12,456</p>
                        <p className="text-sm text-gray-300">Verified</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-900/20 border-yellow-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">2,891</p>
                        <p className="text-sm text-gray-300">Pending</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-900/20 border-red-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">500</p>
                        <p className="text-sm text-gray-300">Suspended</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Management Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Management & AML Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-red-900/20 border-red-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{stats.highRiskUsers}</p>
                        <p className="text-sm text-gray-300">High Risk Users</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-900/20 border-orange-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">23</p>
                        <p className="text-sm text-gray-300">Flagged Transactions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-900/20 border-yellow-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">45</p>
                        <p className="text-sm text-gray-300">Under Review</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.fraudDetection}%</p>
                        <p className="text-sm text-gray-300">Fraud Detection</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transaction Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.recentTransactions}</p>
                        <p className="text-sm text-gray-300">Recent Transactions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.depositSuccess}%</p>
                        <p className="text-sm text-gray-300">Deposit Success</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-900/20 border-orange-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">{stats.withdrawalQueue}</p>
                        <p className="text-sm text-gray-300">Withdrawal Queue</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">${(stats.volume24h / 1000000).toFixed(2)}M</p>
                        <p className="text-sm text-gray-300">24h Volume</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support & Ticketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-orange-900/20 border-orange-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">{stats.activeTickets}</p>
                        <p className="text-sm text-gray-300">Active Tickets</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-900/20 border-red-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{stats.supportBacklog}</p>
                        <p className="text-sm text-gray-300">Support Backlog</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">189</p>
                        <p className="text-sm text-gray-300">Resolved Today</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">4.8</p>
                        <p className="text-sm text-gray-300">Avg Rating</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet & Treasury Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.liquidity}%</p>
                        <p className="text-sm text-gray-300">Liquidity Health</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">${(stats.pnl / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-gray-300">24h P&L</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">8</p>
                        <p className="text-sm text-gray-300">Hot Wallets</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-cyan-900/20 border-cyan-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">24</p>
                        <p className="text-sm text-gray-300">Cold Storage</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.complianceStatus}%</p>
                        <p className="text-sm text-gray-300">Compliance Score</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.kycApprovalRate}%</p>
                        <p className="text-sm text-gray-300">KYC Approval Rate</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-900/20 border-orange-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">{stats.legalExposure}</p>
                        <p className="text-sm text-gray-300">Legal Exposure</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">15</p>
                        <p className="text-sm text-gray-300">Regulatory Reports</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Health & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.systemHealth}%</p>
                        <p className="text-sm text-gray-300">System Health</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.downtime}%</p>
                        <p className="text-sm text-gray-300">Downtime</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-900/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">2.3ms</p>
                        <p className="text-sm text-gray-300">API Latency</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-cyan-900/20 border-cyan-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">99.9%</p>
                        <p className="text-sm text-gray-300">Uptime</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}