import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  Flag,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  RefreshCw,
  Bell,
  Warning,
  Info,
  UserX,
  Lock,
  Unlock,
  Globe,
  Calendar,
  Target,
  Zap,
  Star,
  Award
} from "lucide-react";

interface RiskEvent {
  id: string;
  type: "aml_alert" | "kyc_issue" | "sanctions_hit" | "unusual_activity" | "compliance_breach" | "system_alert";
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved" | "false_positive";
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  assignedTo: string;
  dueDate: string;
  tags: string[];
  riskScore: number;
  impact: number;
  evidence: string[];
  actions: string[];
}

interface ComplianceReport {
  id: string;
  type: "sar" | "ctr" | "kyc_review" | "aml_audit" | "sanctions_screening" | "monthly_review";
  status: "draft" | "pending_review" | "approved" | "submitted" | "rejected";
  title: string;
  period: string;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  findings: number;
  recommendations: number;
  priority: "urgent" | "high" | "normal" | "low";
}

interface RiskMetrics {
  totalAlerts: number;
  openInvestigations: number;
  monthlyReports: number;
  complianceScore: number;
  amlScore: number;
  kycCompletionRate: number;
  sanctionsScreeningRate: number;
  avgResolutionTime: number;
  falsePositiveRate: number;
  escalationRate: number;
}

export default function RiskComplianceCRM() {
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<RiskEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample risk events data
  useEffect(() => {
    const sampleEvents: RiskEvent[] = [
      {
        id: "risk-001",
        type: "aml_alert",
        severity: "critical",
        status: "investigating",
        title: "Suspicious Transaction Pattern Detected",
        description: "Client has performed 15 transactions over $10K in the past 24 hours with unusual timing patterns",
        clientId: "client-001",
        clientName: "Apex Capital Management",
        createdAt: "2025-01-29",
        assignedTo: "Maria Rodriguez",
        dueDate: "2025-01-31",
        tags: ["high_frequency", "large_amounts", "timing_pattern"],
        riskScore: 85,
        impact: 9,
        evidence: ["Transaction logs", "Timing analysis", "Volume spike report"],
        actions: ["Contact client", "Review documentation", "Escalate to senior analyst"]
      },
      {
        id: "risk-002",
        type: "sanctions_hit",
        severity: "high",
        status: "open",
        title: "Potential Sanctions Match",
        description: "Name similarity match found during routine screening - requires manual verification",
        clientId: "client-002",
        clientName: "Global Trade Finance Ltd",
        createdAt: "2025-01-29",
        assignedTo: "David Kim",
        dueDate: "2025-01-30",
        tags: ["sanctions", "name_match", "manual_review"],
        riskScore: 72,
        impact: 8,
        evidence: ["OFAC screening report", "Name matching analysis", "Corporate structure"],
        actions: ["Verify identity", "Check beneficial ownership", "Document findings"]
      },
      {
        id: "risk-003",
        type: "kyc_issue",
        severity: "medium",
        status: "open",
        title: "KYC Documentation Expired",
        description: "Client's identity verification documents have expired and require renewal",
        clientId: "client-003",
        clientName: "Nordic Pension Fund",
        createdAt: "2025-01-28",
        assignedTo: "Sarah Johnson",
        dueDate: "2025-02-05",
        tags: ["kyc_renewal", "document_expiry", "compliance"],
        riskScore: 45,
        impact: 5,
        evidence: ["Expired passport", "Previous KYC file", "Account history"],
        actions: ["Request new documents", "Schedule verification call", "Update records"]
      },
      {
        id: "risk-004",
        type: "unusual_activity",
        severity: "medium",
        status: "investigating",
        title: "Unusual Trading Hours Activity",
        description: "Client trading outside normal business hours with increased frequency",
        clientId: "client-004",
        clientName: "University Endowment",
        createdAt: "2025-01-27",
        assignedTo: "Alex Chen",
        dueDate: "2025-02-01",
        tags: ["after_hours", "frequency_change", "pattern_deviation"],
        riskScore: 55,
        impact: 4,
        evidence: ["Trading timestamp analysis", "Volume patterns", "Geographic data"],
        actions: ["Analyze trading patterns", "Contact portfolio manager", "Review authorization"]
      },
      {
        id: "risk-005",
        type: "compliance_breach",
        severity: "low",
        status: "resolved",
        title: "Minor Reporting Delay",
        description: "Daily trading report submitted 2 hours after deadline due to system maintenance",
        clientId: "client-005",
        clientName: "Regional Bank Corp",
        createdAt: "2025-01-26",
        assignedTo: "Lisa Wong",
        dueDate: "2025-01-27",
        tags: ["reporting_delay", "system_issue", "minor"],
        riskScore: 25,
        impact: 2,
        evidence: ["System maintenance logs", "Delayed report", "IT incident report"],
        actions: ["Document incident", "Update procedures", "Notify stakeholders"]
      }
    ];

    const sampleReports: ComplianceReport[] = [
      {
        id: "report-001",
        type: "sar",
        status: "pending_review",
        title: "Suspicious Activity Report - Q1 2025",
        period: "2025-Q1",
        submittedBy: "Maria Rodriguez",
        submittedAt: "2025-01-28",
        findings: 12,
        recommendations: 8,
        priority: "high"
      },
      {
        id: "report-002",
        type: "monthly_review",
        status: "approved",
        title: "Monthly Compliance Review - January 2025",
        period: "2025-01",
        submittedBy: "David Kim",
        submittedAt: "2025-01-25",
        reviewedBy: "Senior Compliance Officer",
        reviewedAt: "2025-01-27",
        findings: 5,
        recommendations: 3,
        priority: "normal"
      },
      {
        id: "report-003",
        type: "aml_audit",
        status: "draft",
        title: "AML Program Effectiveness Review",
        period: "2025-Q1",
        submittedBy: "Sarah Johnson",
        submittedAt: "2025-01-20",
        findings: 18,
        recommendations: 12,
        priority: "urgent"
      }
    ];

    setRiskEvents(sampleEvents);
    setComplianceReports(sampleReports);
    setFilteredEvents(sampleEvents);
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = riskEvents;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [riskEvents, searchTerm, typeFilter, severityFilter, statusFilter]);

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-blue-500 text-white"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-500 text-white",
      investigating: "bg-yellow-500 text-white",
      resolved: "bg-green-500 text-white",
      false_positive: "bg-gray-500 text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      aml_alert: AlertTriangle,
      kyc_issue: Users,
      sanctions_hit: Flag,
      unusual_activity: Activity,
      compliance_breach: Shield,
      system_alert: Bell
    };
    return icons[type as keyof typeof icons] || AlertTriangle;
  };

  const getRiskMetrics = (): RiskMetrics => {
    return {
      totalAlerts: riskEvents.length,
      openInvestigations: riskEvents.filter(e => e.status === "investigating").length,
      monthlyReports: complianceReports.length,
      complianceScore: 94,
      amlScore: 96,
      kycCompletionRate: 98,
      sanctionsScreeningRate: 100,
      avgResolutionTime: 2.4,
      falsePositiveRate: 8,
      escalationRate: 12
    };
  };

  const metrics = getRiskMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Risk & Compliance Management</h1>
          <p className="text-muted-foreground">Comprehensive risk monitoring and compliance oversight platform</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Alert
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Alerts</p>
                <p className="text-2xl font-bold">{metrics.openInvestigations}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">-15%</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{metrics.complianceScore}%</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+2%</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold">{metrics.avgResolutionTime}d</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">-0.3d</span>
              <span className="text-muted-foreground ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">False Positive Rate</p>
                <p className="text-2xl font-bold">{metrics.falsePositiveRate}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">-2%</span>
              <span className="text-muted-foreground ml-1">vs target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Critical (80-100)", "High (60-79)", "Medium (40-59)", "Low (0-39)"].map((range, index) => {
                    const scores = [85, 72, 55, 25];
                    const counts = [1, 1, 2, 1];
                    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500"];
                    return (
                      <div key={range} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{range}</span>
                          <span>{counts[index]} events</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${colors[index]} h-2 rounded-full`}
                            style={{ width: `${(counts[index] / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent High-Priority Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredEvents
                    .filter(e => e.severity === "critical" || e.severity === "high")
                    .slice(0, 4)
                    .map((event) => {
                      const Icon = getTypeIcon(event.type);
                      return (
                        <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon className="w-5 h-5 text-red-500" />
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.clientName}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{event.createdAt}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>KYC Completion Rate</span>
                      <span>{metrics.kycCompletionRate}%</span>
                    </div>
                    <Progress value={metrics.kycCompletionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>AML Score</span>
                      <span>{metrics.amlScore}%</span>
                    </div>
                    <Progress value={metrics.amlScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Sanctions Screening</span>
                      <span>{metrics.sanctionsScreeningRate}%</span>
                    </div>
                    <Progress value={metrics.sanctionsScreeningRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Overall Compliance</span>
                      <span>{metrics.complianceScore}%</span>
                    </div>
                    <Progress value={metrics.complianceScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Review SAR submission", due: "Today", priority: "urgent" },
                    { action: "Complete KYC renewal for 3 clients", due: "Tomorrow", priority: "high" },
                    { action: "Monthly compliance report", due: "Jan 31", priority: "normal" },
                    { action: "AML training completion", due: "Feb 5", priority: "normal" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">Due: {item.due}</p>
                      </div>
                      <Badge variant={item.priority === "urgent" ? "destructive" : item.priority === "high" ? "default" : "secondary"}>
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search alerts..."
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
                    <SelectItem value="aml_alert">AML Alert</SelectItem>
                    <SelectItem value="kyc_issue">KYC Issue</SelectItem>
                    <SelectItem value="sanctions_hit">Sanctions</SelectItem>
                    <SelectItem value="unusual_activity">Unusual Activity</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="grid gap-4">
            {filteredEvents.map((event) => {
              const Icon = getTypeIcon(event.type);
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Icon className="w-6 h-6 text-red-500" />
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-muted-foreground">{event.clientName}</p>
                          </div>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Risk Score</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={event.riskScore} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{event.riskScore}/100</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Assigned To</p>
                            <p className="font-medium">{event.assignedTo}</p>
                            <p className="text-sm text-muted-foreground">Due: {event.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Impact Level</p>
                            <p className="font-medium">{event.impact}/10</p>
                            <p className="text-sm text-muted-foreground">Created: {event.createdAt}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedEvent(event)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {complianceReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <div>
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <p className="text-muted-foreground">{report.period}</p>
                        </div>
                        <Badge variant={
                          report.status === "approved" ? "default" :
                          report.status === "pending_review" ? "secondary" :
                          report.status === "submitted" ? "outline" :
                          "destructive"
                        }>
                          {report.status.replace("_", " ")}
                        </Badge>
                        <Badge variant={
                          report.priority === "urgent" ? "destructive" :
                          report.priority === "high" ? "default" :
                          "secondary"
                        }>
                          {report.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted By</p>
                          <p className="font-medium">{report.submittedBy}</p>
                          <p className="text-sm text-muted-foreground">{report.submittedAt}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Findings</p>
                          <p className="text-lg font-semibold text-orange-500">{report.findings}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recommendations</p>
                          <p className="text-lg font-semibold text-blue-500">{report.recommendations}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reviewed By</p>
                          <p className="font-medium">{report.reviewedBy || "Pending"}</p>
                          <p className="text-sm text-muted-foreground">{report.reviewedAt || "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Real-Time Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span>AML Monitoring</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span>Sanctions Screening</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                      <span>Transaction Monitoring</span>
                    </div>
                    <Badge variant="secondary">Maintenance</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span>KYC Verification</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Processing Performance</span>
                      <span>98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Alert Response Time</span>
                      <span>1.2s avg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Database Performance</span>
                      <span>99.1%</span>
                    </div>
                    <Progress value={99.1} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>API Uptime</span>
                      <span>99.9%</span>
                    </div>
                    <Progress value={99.9} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["AML Alerts", "KYC Issues", "Sanctions Hits", "Unusual Activity"].map((type, index) => {
                    const values = [12, 8, 3, 15];
                    const changes = ["+5%", "-12%", "+25%", "+8%"];
                    const isPositive = [true, false, true, true];
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{type}</p>
                          <p className="text-sm text-muted-foreground">This month</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{values[index]}</p>
                          <div className="flex items-center text-sm">
                            {isPositive[index] ? (
                              <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                            )}
                            <span className={isPositive[index] ? "text-red-500" : "text-green-500"}>
                              {changes[index]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Critical Alerts (24h)</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>High Priority (48h)</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Medium Priority (7d)</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Low Priority (30d)</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedEvent(null)} />
          <div className="relative bg-background border border-border rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Risk Event Details</h2>
              <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Event Information</h3>
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {selectedEvent.title}</p>
                    <p><strong>Type:</strong> {selectedEvent.type}</p>
                    <p><strong>Severity:</strong> <Badge className={getSeverityColor(selectedEvent.severity)}>{selectedEvent.severity}</Badge></p>
                    <p><strong>Status:</strong> <Badge className={getStatusColor(selectedEvent.status)}>{selectedEvent.status}</Badge></p>
                    <p><strong>Client:</strong> {selectedEvent.clientName}</p>
                    <p><strong>Created:</strong> {selectedEvent.createdAt}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Assignment & Timeline</h3>
                  <div className="space-y-2">
                    <p><strong>Assigned To:</strong> {selectedEvent.assignedTo}</p>
                    <p><strong>Due Date:</strong> {selectedEvent.dueDate}</p>
                    <p><strong>Risk Score:</strong> {selectedEvent.riskScore}/100</p>
                    <p><strong>Impact Level:</strong> {selectedEvent.impact}/10</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Evidence</h3>
                <div className="space-y-2">
                  {selectedEvent.evidence.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
                <div className="space-y-2">
                  {selectedEvent.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}