import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Download,
  Eye,
  UserCheck,
  UserX,
  Flag,
  Gavel,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface KYCQueueItem {
  id: number;
  userId: string;
  kycLevel: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  riskFlags: string[];
  adminNotes?: string;
  createdAt: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

interface AMLAlert {
  id: number;
  userId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  amount?: string;
  currency?: string;
  flagReason: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  createdAt: string;
}

interface SARReport {
  id: number;
  userId: string;
  reportType: 'SAR' | 'STR' | 'CTR';
  reportNumber: string;
  status: 'draft' | 'submitted' | 'acknowledged';
  suspiciousActivity: string;
  filingDate?: string;
  regulatoryBody?: string;
  submittedBy?: string;
  createdAt: string;
}

export default function AdminComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('kyc-queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const queryClient = useQueryClient();

  // KYC Queue Data
  const { data: kycQueue, isLoading: kycLoading } = useQuery({
    queryKey: ['/api/admin-panel/kyc/queue', { status: statusFilter, priority: priorityFilter }],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // AML Alerts Data
  const { data: amlAlerts, isLoading: amlLoading } = useQuery({
    queryKey: ['/api/admin-panel/aml/alerts', { status: statusFilter }],
    enabled: activeTab === 'aml-monitoring'
  });

  // SAR Reports Data
  const { data: sarReports, isLoading: sarLoading } = useQuery({
    queryKey: ['/api/admin-panel/compliance/sar-reports'],
    enabled: activeTab === 'sar-reports'
  });

  // Audit Trails Data
  const { data: auditTrails, isLoading: auditLoading } = useQuery({
    queryKey: ['/api/admin-panel/audit/trails', { limit: 50 }],
    enabled: activeTab === 'audit-trails'
  });

  // KYC Approval Mutation
  const approveKYCMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return apiRequest(`/api/admin-panel/kyc/queue/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ adminId: 'admin-user', notes })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/kyc/queue'] });
    }
  });

  // KYC Rejection Mutation
  const rejectKYCMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      return apiRequest(`/api/admin-panel/kyc/queue/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ adminId: 'admin-user', reason })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/kyc/queue'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'under_review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="h-10 w-10 text-blue-400" />
            Compliance & Admin Dashboard
          </h1>
          <p className="text-lg text-gray-300">
            Manage KYC verifications, AML monitoring, and regulatory compliance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending KYC</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(kycQueue) ? kycQueue.filter(item => item.status === 'pending').length : 0}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active AML Alerts</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(amlAlerts) ? amlAlerts.filter(alert => alert.status === 'open').length : 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">SAR Reports</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(sarReports) ? sarReports.length : 0}
                  </p>
                </div>
                <FileCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Health</p>
                  <p className="text-2xl font-bold text-green-400">98.7%</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="kyc-queue">KYC Queue</TabsTrigger>
            <TabsTrigger value="aml-monitoring">AML Monitoring</TabsTrigger>
            <TabsTrigger value="sar-reports">SAR Reports</TabsTrigger>
            <TabsTrigger value="audit-trails">Audit Trails</TabsTrigger>
          </TabsList>

          {/* KYC Queue Tab */}
          <TabsContent value="kyc-queue" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  KYC Verification Queue
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Review and manage pending KYC verifications
                </CardDescription>
                
                {/* Filters */}
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/30 border-purple-500/30 text-white w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
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
                {kycLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">KYC Level</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Priority</TableHead>
                        <TableHead className="text-gray-300">Risk Flags</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(kycQueue) && kycQueue.map((item: KYCQueueItem) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">
                                {item.user?.firstName} {item.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-400">{item.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              Level {item.kycLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(item.status)} text-white`}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${item.priority === 'urgent' ? 'border-red-400 text-red-400' : 
                                         item.priority === 'high' ? 'border-orange-400 text-orange-400' : 
                                         'border-gray-400 text-gray-400'}`}
                            >
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.riskFlags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {item.riskFlags.slice(0, 2).map((flag, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {flag}
                                  </Badge>
                                ))}
                                {item.riskFlags.length > 2 && (
                                  <Badge variant="destructive" className="text-xs">
                                    +{item.riskFlags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {item.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-green-500 text-green-400 hover:bg-green-500/20"
                                    onClick={() => approveKYCMutation.mutate({ id: item.id, notes: 'Approved by admin' })}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-red-500 text-red-400 hover:bg-red-500/20"
                                    onClick={() => rejectKYCMutation.mutate({ id: item.id, reason: 'Documents incomplete' })}
                                  >
                                    <UserX className="h-4 w-4" />
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

          {/* AML Monitoring Tab */}
          <TabsContent value="aml-monitoring" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  AML & Sanctions Monitoring
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor suspicious activities and sanctions screening
                </CardDescription>
              </CardHeader>
              <CardContent>
                {amlLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Alert Type</TableHead>
                        <TableHead className="text-gray-300">Severity</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Reason</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(amlAlerts) && amlAlerts.map((alert: AMLAlert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="text-white font-medium">
                            {alert.alertType.replace('_', ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            {alert.amount ? `${alert.amount} ${alert.currency}` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {alert.flagReason}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(alert.status)} text-white`}>
                              {alert.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {alert.status === 'open' && (
                                <Button size="sm" variant="outline" className="h-8 border-blue-500 text-blue-400">
                                  Investigate
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

          {/* SAR Reports Tab */}
          <TabsContent value="sar-reports" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  SAR/STR Reports
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage Suspicious Activity Reports and regulatory submissions
                </CardDescription>
                <Button className="w-fit bg-purple-600 hover:bg-purple-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </CardHeader>
              <CardContent>
                {sarLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Report #</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Activity</TableHead>
                        <TableHead className="text-gray-300">Filing Date</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(sarReports) && sarReports.map((report: SARReport) => (
                        <TableRow key={report.id}>
                          <TableCell className="text-white font-medium">
                            {report.reportNumber}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {report.reportType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(report.status)} text-white`}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-xs truncate">
                            {report.suspiciousActivity}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {report.filingDate ? new Date(report.filingDate).toLocaleDateString() : 'Not filed'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8">
                                <Download className="h-4 w-4" />
                              </Button>
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

          {/* Audit Trails Tab */}
          <TabsContent value="audit-trails" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Trails
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Complete history of administrative actions and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Entity</TableHead>
                        <TableHead className="text-gray-300">Action</TableHead>
                        <TableHead className="text-gray-300">Performed By</TableHead>
                        <TableHead className="text-gray-300">Changes</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(auditTrails) && auditTrails.map((trail: any) => (
                        <TableRow key={trail.id}>
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">{trail.entityType}</p>
                              <p className="text-sm text-gray-400">{trail.entityId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-purple-400 border-purple-400">
                              {trail.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {trail.performedBy}
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-xs">
                            <pre className="text-xs overflow-hidden">
                              {JSON.stringify(trail.changes, null, 1).slice(0, 100)}...
                            </pre>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(trail.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}