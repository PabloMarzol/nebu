import { useState, useEffect } from 'react';
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
  Building,
  Monitor,
  Database,
  Globe,
  Lock,
  Zap,
  Target,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  PieChart,
  TrendingDown,
  Home,
  Briefcase,
  Award,
  Bell
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function ComprehensiveAdmin() {
  const [activeTab, setActiveTab] = useState('executive');
  const [searchTerm, setSearchTerm] = useState('');

  // Executive dashboard stats
  const stats = {
    // Real-time KPIs
    signups24h: 156,
    activeUsers: 15847,
    volume24h: 2456789.45,
    revenue24h: 45672.89,
    complianceStatus: 98.5,
    supportBacklog: 23,
    
    // At a Glance system health
    systemHealth: 99.8,
    liquidity: 89.2,
    pnl: 125476.34,
    legalExposure: 2,
    downtime: 0.02,
    
    // Additional metrics
    pendingApprovals: 8,
    criticalAlerts: 2,
    highRiskUsers: 5,
    recentTransactions: 1245,
    activeTickets: 23,
    
    // KYC/AML metrics
    kycPending: 45,
    amlReviews: 12,
    sanctionsMatches: 3,
    sarsFiled: 2,
    
    // Wallet/Treasury
    hotWalletBalance: 1250000,
    coldWalletBalance: 15750000,
    pendingWithdrawals: 125,
    multisigApprovals: 8,
    
    // Trading Operations
    tradingPairs: 25,
    orderBookHealth: 94.5,
    marketMakers: 12,
    liquidityHealth: 87.3,
    
    // Support & CRM
    supportSLA: 96.8,
    vipClients: 234,
    avgResponseTime: 4.2,
    csat: 4.7
  };

  const roleBasedWidgets = {
    CEO: ['revenue', 'users', 'compliance', 'legal'],
    COO: ['operations', 'support', 'kyc', 'trading'],
    CTO: ['system', 'security', 'performance', 'incidents'],
    CCO: ['compliance', 'aml', 'kyc', 'reporting'],
    CFO: ['revenue', 'pnl', 'treasury', 'accounting']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 NebulaX Executive Command Center
          </h1>
          <p className="text-gray-300">
            Complete Business Management System - Institutional Grade Operations
          </p>
        </div>

        {/* Executive Dashboard KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
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
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+8.3% growth</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Volume</p>
                  <p className="text-2xl font-bold text-white">${(stats.volume24h / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-green-400">+15.2% vs yesterday</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Revenue</p>
                  <p className="text-2xl font-bold text-white">${(stats.revenue24h / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-400">Above target</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Compliance</p>
                  <p className="text-2xl font-bold text-white">{stats.complianceStatus}%</p>
                  <p className="text-xs text-green-400">Regulatory ready</p>
                </div>
                <Shield className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Health</p>
                  <p className="text-2xl font-bold text-white">{stats.systemHealth}%</p>
                  <p className="text-xs text-green-400">All operational</p>
                </div>
                <Monitor className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* At a Glance System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Liquidity Health</p>
                  <p className="text-2xl font-bold text-white">{stats.liquidity}%</p>
                  <p className="text-xs text-green-400">Optimal levels</p>
                </div>
                <Wallet className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">P&L</p>
                  <p className="text-2xl font-bold text-white">${(stats.pnl / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-400">+23.4% monthly</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Legal Exposure</p>
                  <p className="text-2xl font-bold text-white">{stats.legalExposure}</p>
                  <p className="text-xs text-green-400">Low risk</p>
                </div>
                <Flag className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="text-2xl font-bold text-white">{(100 - stats.downtime).toFixed(2)}%</p>
                  <p className="text-xs text-green-400">SLA exceeded</p>
                </div>
                <Clock className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 bg-black/20 border-purple-500/20">
            <TabsTrigger value="executive" className="text-white">Executive</TabsTrigger>
            <TabsTrigger value="users" className="text-white">Users</TabsTrigger>
            <TabsTrigger value="kyc" className="text-white">KYC/AML</TabsTrigger>
            <TabsTrigger value="wallet" className="text-white">Treasury</TabsTrigger>
            <TabsTrigger value="trading" className="text-white">Trading</TabsTrigger>
            <TabsTrigger value="compliance" className="text-white">Compliance</TabsTrigger>
            <TabsTrigger value="support" className="text-white">Support</TabsTrigger>
            <TabsTrigger value="affiliate" className="text-white">Partners</TabsTrigger>
            <TabsTrigger value="finance" className="text-white">Finance</TabsTrigger>
            <TabsTrigger value="security" className="text-white">Security</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="staff" className="text-white">Staff</TabsTrigger>
          </TabsList>

          {/* Executive Management & Dashboard */}
          <TabsContent value="executive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Board/Investor Portal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Financial Reports</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Compliance Summary</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Assessment</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Roadmap Updates</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Cap Table Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Equity Distribution</span>
                      <span className="text-white">View Details</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grant Tracking</span>
                      <span className="text-white">Manage Grants</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vesting Schedules</span>
                      <span className="text-white">Monitor Progress</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Customizable Executive Widgets
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Role-based dashboard customization for C-level executives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(roleBasedWidgets).map(([role, widgets]) => (
                    <div key={role} className="space-y-2">
                      <h4 className="text-white font-semibold">{role}</h4>
                      {widgets.map((widget) => (
                        <Badge key={widget} variant="outline" className="block text-center">
                          {widget}
                        </Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Lifecycle & KYC/Onboarding */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Multi-Stage Onboarding Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Signup → Email/Phone</span>
                      <Badge className="bg-green-500">87%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Email/Phone → KYC Tiers</span>
                      <Badge className="bg-yellow-500">64%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">KYC → First Deposit</span>
                      <Badge className="bg-blue-500">45%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Deposit → First Trade</span>
                      <Badge className="bg-purple-500">78%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    User Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">VIP Users</span>
                      <span className="text-white">{stats.vipClients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Retail Users</span>
                      <span className="text-white">{(stats.activeUsers - stats.vipClients - 156).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Business Accounts</span>
                      <span className="text-white">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">High-Risk Users</span>
                      <span className="text-white text-red-400">{stats.highRiskUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PEP Flagged</span>
                      <span className="text-white text-orange-400">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Continue with other tabs as needed */}

        </Tabs>
      </div>
    </div>
  );
}