import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Users,
  Building,
  Globe,
  Activity,
  BarChart3,
  TrendingUp,
  Calendar,
  Archive,
  Flag,
  Lock
} from "lucide-react";

interface ComplianceMetrics {
  kycCompletionRate: number;
  amlScreeningRate: number;
  suspiciousActivityReports: number;
  regulatoryReports: number;
  activeMonitoring: number;
  riskAlerts: number;
}

interface RegulatoryReport {
  id: string;
  type: "CTR" | "SAR" | "FBAR" | "8300" | "OFAC" | "PEP";
  title: string;
  status: "draft" | "pending" | "submitted" | "approved" | "rejected";
  dueDate: string;
  submittedDate?: string;
  jurisdiction: string;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  relatedUsers: number;
  amount?: number;
}

interface ComplianceAlert {
  id: string;
  type: "kyc_expired" | "aml_match" | "suspicious_activity" | "large_transaction" | "pep_match" | "sanctions_check";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  assignedTo?: string;
  amount?: number;
  riskScore: number;
}

interface UserComplianceStatus {
  userId: string;
  userName: string;
  email: string;
  kycStatus: "pending" | "verified" | "rejected" | "expired";
  amlStatus: "clear" | "flagged" | "investigating" | "blocked";
  riskLevel: "low" | "medium" | "high" | "critical";
  verificationLevel: 1 | 2 | 3;
  lastActivity: string;
  totalVolume: number;
  flags: string[];
  documents: number;
}

export default function ComplianceDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const complianceMetrics: ComplianceMetrics = {
    kycCompletionRate: 94.2,
    amlScreeningRate: 99.8,
    suspiciousActivityReports: 12,
    regulatoryReports: 8,
    activeMonitoring: 1247,
    riskAlerts: 23
  };

  const regulatoryReports: RegulatoryReport[] = [
    {
      id: "1",
      type: "SAR",
      title: "Suspicious Activity Report - Large Cash Transactions",
      status: "pending",
      dueDate: "2024-01-20",
      jurisdiction: "Czech Republic",
      priority: "high",
      description: "Multiple large cash transactions exceeding reporting threshold",
      relatedUsers: 3,
      amount: 125000
    },
    {
      id: "2",
      type: "CTR",
      title: "Currency Transaction Report - Q4 2024",
      status: "submitted",
      dueDate: "2024-01-15",
      submittedDate: "2024-01-14",
      jurisdiction: "EU",
      priority: "medium",
      description: "Quarterly currency transaction reporting",
      relatedUsers: 847,
      amount: 2450000
    },
    {
      id: "3",
      type: "OFAC",
      title: "OFAC Sanctions Screening Report",
      status: "approved",
      dueDate: "2024-01-10",
      submittedDate: "2024-01-08",
      jurisdiction: "Global",
      priority: "critical",
      description: "Monthly sanctions list screening results",
      relatedUsers: 12456
    },
    {
      id: "4",
      type: "PEP",
      title: "Politically Exposed Persons Review",
      status: "draft",
      dueDate: "2024-01-25",
      jurisdiction: "EU",
      priority: "medium",
      description: "Quarterly PEP status review and monitoring",
      relatedUsers: 47
    }
  ];

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: "1",
      type: "aml_match",
      severity: "critical",
      title: "AML Watchlist Match",
      description: "User matched against sanctions watchlist",
      userId: "usr_7834",
      userName: "John Mitchell",
      timestamp: "2024-01-15 09:30:00",
      status: "investigating",
      assignedTo: "compliance_team",
      riskScore: 95
    },
    {
      id: "2",
      type: "large_transaction",
      severity: "high",
      title: "Large Transaction Alert",
      description: "Transaction exceeds daily limit threshold",
      userId: "usr_5621",
      userName: "Sarah Chen",
      timestamp: "2024-01-15 08:45:00",
      status: "open",
      amount: 75000,
      riskScore: 72
    },
    {
      id: "3",
      type: "suspicious_activity",
      severity: "medium",
      title: "Unusual Trading Pattern",
      description: "Abnormal trading velocity detected",
      userId: "usr_9123",
      userName: "Alex Rodriguez",
      timestamp: "2024-01-15 07:20:00",
      status: "investigating",
      riskScore: 68
    },
    {
      id: "4",
      type: "kyc_expired",
      severity: "medium",
      title: "KYC Documentation Expired",
      description: "User verification documents require renewal",
      userId: "usr_4567",
      userName: "Maria Kovar",
      timestamp: "2024-01-14 16:30:00",
      status: "open",
      riskScore: 45
    }
  ];

  const userComplianceStatuses: UserComplianceStatus[] = [
    {
      userId: "usr_7834",
      userName: "John Mitchell",
      email: "john.mitchell@email.com",
      kycStatus: "verified",
      amlStatus: "flagged",
      riskLevel: "critical",
      verificationLevel: 2,
      lastActivity: "2024-01-15 09:30:00",
      totalVolume: 450000,
      flags: ["AML Match", "High Volume"],
      documents: 5
    },
    {
      userId: "usr_5621",
      userName: "Sarah Chen",
      email: "sarah.chen@email.com",
      kycStatus: "verified",
      amlStatus: "clear",
      riskLevel: "high",
      verificationLevel: 3,
      lastActivity: "2024-01-15 08:45:00",
      totalVolume: 1200000,
      flags: ["Large Transaction"],
      documents: 7
    },
    {
      userId: "usr_9123",
      userName: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      kycStatus: "verified",
      amlStatus: "investigating",
      riskLevel: "medium",
      verificationLevel: 2,
      lastActivity: "2024-01-15 07:20:00",
      totalVolume: 125000,
      flags: ["Suspicious Pattern"],
      documents: 4
    },
    {
      userId: "usr_4567",
      userName: "Maria Kovar",
      email: "maria.kovar@email.com",
      kycStatus: "expired",
      amlStatus: "clear",
      riskLevel: "medium",
      verificationLevel: 1,
      lastActivity: "2024-01-14 16:30:00",
      totalVolume: 89000,
      flags: ["KYC Expired"],
      documents: 3
    }
  ];

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "verified":
      case "clear":
      case "resolved": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "pending":
      case "investigating":
      case "flagged": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "rejected":
      case "blocked":
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "submitted": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "high": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "high": return <Flag className="w-4 h-4 text-orange-400" />;
      case "medium": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "low": return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="glass border-green-500/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400 mb-1">
              {complianceMetrics.kycCompletionRate}%
            </div>
            <div className="text-sm text-muted-foreground">KYC Completion</div>
          </CardContent>
        </Card>

        <Card className="glass border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {complianceMetrics.amlScreeningRate}%
            </div>
            <div className="text-sm text-muted-foreground">AML Screening</div>
          </CardContent>
        </Card>

        <Card className="glass border-orange-500/30">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {complianceMetrics.suspiciousActivityReports}
            </div>
            <div className="text-sm text-muted-foreground">SARs Filed</div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/30">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {complianceMetrics.regulatoryReports}
            </div>
            <div className="text-sm text-muted-foreground">Reports Pending</div>
          </CardContent>
        </Card>

        <Card className="glass border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {complianceMetrics.activeMonitoring.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Active Monitoring</div>
          </CardContent>
        </Card>

        <Card className="glass border-red-500/30">
          <CardContent className="p-6 text-center">
            <Flag className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400 mb-1">
              {complianceMetrics.riskAlerts}
            </div>
            <div className="text-sm text-muted-foreground">Risk Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="glass border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">Compliance Management</h3>
              <div className="flex items-center space-x-2">
                <select 
                  className="px-3 py-1 bg-background border border-border rounded text-sm"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <select 
                  className="px-3 py-1 bg-background border border-border rounded text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="reports">Regulatory Reports</TabsTrigger>
          <TabsTrigger value="users">User Compliance</TabsTrigger>
          <TabsTrigger value="monitoring">Transaction Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <Card key={alert.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)} variant="outline">
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)} variant="outline">
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>User: {alert.userName}</span>
                          <span>Risk Score: {alert.riskScore}%</span>
                          <span>{alert.timestamp}</span>
                          {alert.amount && <span>Amount: ${alert.amount.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Investigate
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="space-y-4">
            {regulatoryReports.map((report) => (
              <Card key={report.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <FileText className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge className={getStatusColor(report.status)} variant="outline">
                            {report.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getPriorityIcon(report.priority)}
                            <span className="text-xs text-muted-foreground">{report.priority}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Jurisdiction: {report.jurisdiction}</span>
                          <span>Due: {report.dueDate}</span>
                          <span>Users: {report.relatedUsers}</span>
                          {report.amount && <span>Amount: ${report.amount.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="space-y-4">
            {userComplianceStatuses.map((user) => (
              <Card key={user.userId} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{user.userName}</h4>
                          <Badge variant="outline">Level {user.verificationLevel}</Badge>
                          <Badge className={getStatusColor(user.kycStatus)} variant="outline">
                            KYC: {user.kycStatus}
                          </Badge>
                          <Badge className={getStatusColor(user.amlStatus)} variant="outline">
                            AML: {user.amlStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Risk: {user.riskLevel}</span>
                          <span>Volume: ${user.totalVolume.toLocaleString()}</span>
                          <span>Documents: {user.documents}</span>
                          <span>Last: {user.lastActivity}</span>
                        </div>
                        {user.flags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            {user.flags.map((flag, index) => (
                              <Badge key={index} className="text-xs" variant="outline">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="w-4 h-4 mr-1" />
                        History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-blue-400" />
                  <span>Real-time Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Transactions:</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Flagged Transactions:</span>
                    <span className="font-semibold text-yellow-400">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Large Transactions:</span>
                    <span className="font-semibold text-orange-400">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blocked Transactions:</span>
                    <span className="font-semibold text-red-400">2</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View Live Monitor
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  <span>AML Screening</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Users Screened Today:</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Watchlist Matches:</span>
                    <span className="font-semibold text-red-400">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">PEP Matches:</span>
                    <span className="font-semibold text-yellow-400">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">False Positives:</span>
                    <span className="font-semibold text-green-400">12</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Run Screening
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Transaction Risk Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Large Transaction Threshold</label>
                  <Input placeholder="€10,000" />
                  <p className="text-xs text-muted-foreground mt-1">Auto-flag transactions above this amount</p>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Velocity Threshold</label>
                  <Input placeholder="€50,000/day" />
                  <p className="text-xs text-muted-foreground mt-1">Daily transaction volume limit</p>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Risk Score Threshold</label>
                  <Input placeholder="75" />
                  <p className="text-xs text-muted-foreground mt-1">Auto-block above this risk score</p>
                </div>
              </div>
              <Button className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Update Risk Parameters
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <span>Compliance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">KYC Completion Rate:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={94.2} className="w-20 h-2" />
                      <span className="text-sm font-semibold">94.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AML Pass Rate:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={99.8} className="w-20 h-2" />
                      <span className="text-sm font-semibold">99.8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Alert Resolution:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={87.5} className="w-20 h-2" />
                      <span className="text-sm font-semibold">87.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  <span>Risk Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Low Risk Users:</span>
                    <span className="font-semibold text-green-400">8,234 (82.3%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Risk Users:</span>
                    <span className="font-semibold text-yellow-400">1,456 (14.6%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High Risk Users:</span>
                    <span className="font-semibold text-orange-400">287 (2.9%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Critical Risk Users:</span>
                    <span className="font-semibold text-red-400">23 (0.2%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Regulatory Compliance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">EU GDPR Compliance</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400 mb-1">98.7%</div>
                  <div className="text-sm text-muted-foreground">VASP Requirements</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400 mb-1">24</div>
                  <div className="text-sm text-muted-foreground">Reports Filed</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-400 mb-1">0</div>
                  <div className="text-sm text-muted-foreground">Missed Deadlines</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}