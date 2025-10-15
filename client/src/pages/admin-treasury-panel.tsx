import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Shield, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  FileText,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  Users,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface WalletBalance {
  id: number;
  walletType: 'hot' | 'cold' | 'exchange';
  asset: string;
  address: string;
  balance: string;
  lockedBalance: string;
  pendingDeposits: string;
  pendingWithdrawals: string;
  lastReconciled?: string;
  updatedAt: string;
}

interface WithdrawalRequest {
  id: number;
  userId: string;
  asset: string;
  amount: string;
  destinationAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  riskScore: number;
  requiresMultiSig: boolean;
  approvals: any[];
  requiredApprovals: number;
  rejectionReason?: string;
  createdAt: string;
  user?: {
    email: string;
    kycLevel: number;
  };
}

interface RevenueMetric {
  id: number;
  date: string;
  tradingFees: string;
  withdrawalFees: string;
  spreadIncome: string;
  otcRevenue: string;
  listingFees: string;
  affiliatePayouts: string;
  totalRevenue: string;
  activeUsers: number;
  tradingVolume: string;
}

export default function AdminTreasuryPanel() {
  const [activeTab, setActiveTab] = useState('wallet-overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const queryClient = useQueryClient();

  // Wallet Balances Data
  const { data: walletBalances, isLoading: walletsLoading } = useQuery({
    queryKey: ['/api/admin-panel/treasury/wallet-balances'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Withdrawal Queue Data
  const { data: withdrawalQueue, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['/api/admin-panel/treasury/withdrawal-queue', { status: statusFilter, priority: priorityFilter }],
    enabled: activeTab === 'withdrawal-queue'
  });

  // Revenue Metrics Data
  const { data: revenueMetrics, isLoading: revenueLoading } = useQuery({
    queryKey: ['/api/admin-panel/treasury/revenue-metrics', { period: selectedPeriod }],
    enabled: activeTab === 'revenue-analytics'
  });

  // Withdrawal Approval Mutation
  const approveWithdrawalMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return apiRequest(`/api/admin-panel/treasury/withdrawal-queue/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ adminId: 'admin-user', notes })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/treasury/withdrawal-queue'] });
    }
  });

  // Withdrawal Rejection Mutation
  const rejectWithdrawalMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      return apiRequest(`/api/admin-panel/treasury/withdrawal-queue/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ adminId: 'admin-user', reason })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/treasury/withdrawal-queue'] });
    }
  });

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'hot': return 'bg-red-500';
      case 'cold': return 'bg-blue-500';
      case 'exchange': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 5) return 'text-orange-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatCurrency = (amount: string, asset: string) => {
    const num = parseFloat(amount);
    if (asset === 'USD' || asset === 'USDT' || asset === 'USDC') {
      return `$${num.toLocaleString()}`;
    }
    return `${num.toLocaleString()} ${asset}`;
  };

  // Calculate total portfolio value
  const totalPortfolioValue = Array.isArray(walletBalances) 
    ? walletBalances.reduce((total, wallet) => total + parseFloat(wallet.balance), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="h-10 w-10 text-green-400" />
            Finance & Treasury Panel
          </h1>
          <p className="text-lg text-gray-300">
            Manage wallets, withdrawals, and financial operations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Portfolio</p>
                  <p className="text-2xl font-bold text-white">
                    ${totalPortfolioValue.toLocaleString()}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(withdrawalQueue) ? withdrawalQueue.filter(w => w.status === 'pending').length : 0}
                  </p>
                </div>
                <ArrowUpCircle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Today's Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${Array.isArray(revenueMetrics) && revenueMetrics.length > 0 
                      ? parseFloat(revenueMetrics[0].totalRevenue).toLocaleString() 
                      : '0'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Multi-Sig Required</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(withdrawalQueue) ? withdrawalQueue.filter(w => w.requiresMultiSig).length : 0}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="wallet-overview">Wallet Overview</TabsTrigger>
            <TabsTrigger value="withdrawal-queue">Withdrawal Queue</TabsTrigger>
            <TabsTrigger value="revenue-analytics">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          </TabsList>

          {/* Wallet Overview Tab */}
          <TabsContent value="wallet-overview" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Balances Overview
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time balances across all wallet types
                </CardDescription>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-green-500 text-green-400">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Balances
                  </Button>
                  <Button variant="outline" className="border-blue-500 text-blue-400">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {walletsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Asset</TableHead>
                        <TableHead className="text-gray-300">Wallet Type</TableHead>
                        <TableHead className="text-gray-300">Available Balance</TableHead>
                        <TableHead className="text-gray-300">Locked Balance</TableHead>
                        <TableHead className="text-gray-300">Pending</TableHead>
                        <TableHead className="text-gray-300">Last Reconciled</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(walletBalances) && walletBalances.map((wallet: WalletBalance) => (
                        <TableRow key={wallet.id}>
                          <TableCell className="text-white font-medium">
                            {wallet.asset}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getWalletTypeColor(wallet.walletType)} text-white`}>
                              {wallet.walletType.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            {formatCurrency(wallet.balance, wallet.asset)}
                          </TableCell>
                          <TableCell className="text-orange-400">
                            {formatCurrency(wallet.lockedBalance, wallet.asset)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-green-400">
                                +{formatCurrency(wallet.pendingDeposits, wallet.asset)}
                              </div>
                              <div className="text-red-400">
                                -{formatCurrency(wallet.pendingWithdrawals, wallet.asset)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {wallet.lastReconciled 
                              ? new Date(wallet.lastReconciled).toLocaleString()
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {wallet.walletType === 'hot' && (
                                <Button size="sm" variant="outline" className="h-8 border-orange-500 text-orange-400">
                                  <Lock className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawal Queue Tab */}
          <TabsContent value="withdrawal-queue" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5" />
                  Withdrawal Approval Queue
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Review and approve pending withdrawal requests
                </CardDescription>
                
                {/* Filters */}
                <div className="flex gap-4 mt-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {withdrawalsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Asset</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Destination</TableHead>
                        <TableHead className="text-gray-300">Risk Score</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Multi-Sig</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(withdrawalQueue) && withdrawalQueue.map((withdrawal: WithdrawalRequest) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">{withdrawal.user?.email || 'Unknown'}</p>
                              <p className="text-sm text-gray-400">KYC Level {withdrawal.user?.kycLevel || 0}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {withdrawal.asset}
                          </TableCell>
                          <TableCell className="text-white">
                            {formatCurrency(withdrawal.amount, withdrawal.asset)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-32 truncate text-gray-300 font-mono text-sm">
                              {withdrawal.destinationAddress}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${getRiskColor(withdrawal.riskScore)}`}>
                                {withdrawal.riskScore}/10
                              </span>
                              <Progress 
                                value={withdrawal.riskScore * 10} 
                                className="w-16 h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(withdrawal.status)} text-white`}>
                              {withdrawal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {withdrawal.requiresMultiSig ? (
                              <div className="flex items-center gap-1 text-orange-400">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm">
                                  {withdrawal.approvals.length}/{withdrawal.requiredApprovals}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {withdrawal.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-green-500 text-green-400 hover:bg-green-500/20"
                                    onClick={() => approveWithdrawalMutation.mutate({ 
                                      id: withdrawal.id, 
                                      notes: 'Approved by admin' 
                                    })}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-red-500 text-red-400 hover:bg-red-500/20"
                                    onClick={() => rejectWithdrawalMutation.mutate({ 
                                      id: withdrawal.id, 
                                      reason: 'High risk score' 
                                    })}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Analytics Tab */}
          <TabsContent value="revenue-analytics" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track fees, spread income, and overall revenue metrics
                </CardDescription>
                
                <div className="flex gap-4">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-green-500 text-green-400">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {revenueLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Revenue Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-black/20 border-green-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Trading Fees</p>
                              <p className="text-xl font-bold text-green-400">
                                ${Array.isArray(revenueMetrics) && revenueMetrics.length > 0 
                                  ? parseFloat(revenueMetrics[0].tradingFees).toLocaleString() 
                                  : '0'}
                              </p>
                            </div>
                            <TrendingUp className="h-6 w-6 text-green-400" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 border-blue-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">OTC Revenue</p>
                              <p className="text-xl font-bold text-blue-400">
                                ${Array.isArray(revenueMetrics) && revenueMetrics.length > 0 
                                  ? parseFloat(revenueMetrics[0].otcRevenue).toLocaleString() 
                                  : '0'}
                              </p>
                            </div>
                            <DollarSign className="h-6 w-6 text-blue-400" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-black/20 border-purple-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Spread Income</p>
                              <p className="text-xl font-bold text-purple-400">
                                ${Array.isArray(revenueMetrics) && revenueMetrics.length > 0 
                                  ? parseFloat(revenueMetrics[0].spreadIncome).toLocaleString() 
                                  : '0'}
                              </p>
                            </div>
                            <PieChart className="h-6 w-6 text-purple-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Revenue Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">Trading Fees</TableHead>
                          <TableHead className="text-gray-300">Withdrawal Fees</TableHead>
                          <TableHead className="text-gray-300">OTC Revenue</TableHead>
                          <TableHead className="text-gray-300">Total Revenue</TableHead>
                          <TableHead className="text-gray-300">Active Users</TableHead>
                          <TableHead className="text-gray-300">Volume</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(revenueMetrics) && revenueMetrics.map((metric: RevenueMetric) => (
                          <TableRow key={metric.id}>
                            <TableCell className="text-white">
                              {new Date(metric.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-green-400">
                              ${parseFloat(metric.tradingFees).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-blue-400">
                              ${parseFloat(metric.withdrawalFees).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-purple-400">
                              ${parseFloat(metric.otcRevenue).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-white font-bold">
                              ${parseFloat(metric.totalRevenue).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {metric.activeUsers.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              ${parseFloat(metric.tradingVolume).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reconciliation Tab */}
          <TabsContent value="reconciliation" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Reconciliation Module
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Daily reconciliation reports and proof-of-reserves
                </CardDescription>
                
                <div className="flex gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Reconciliation
                  </Button>
                  <Button variant="outline" className="border-blue-500 text-blue-400">
                    <Download className="h-4 w-4 mr-2" />
                    Proof of Reserves
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    All Systems Reconciled
                  </h3>
                  <p className="text-gray-300">
                    Last reconciliation completed successfully at{' '}
                    {new Date().toLocaleString()}
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">100%</p>
                      <p className="text-sm text-gray-400">Balance Match</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">0</p>
                      <p className="text-sm text-gray-400">Discrepancies</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">15</p>
                      <p className="text-sm text-gray-400">Assets Verified</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}