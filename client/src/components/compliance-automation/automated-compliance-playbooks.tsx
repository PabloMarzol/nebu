import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Users,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Bell,
  Target,
  Activity,
  Database,
  Calendar,
  BookOpen,
  GitBranch
} from "lucide-react";

export default function AutomatedCompliancePlaybooks() {
  const [activeTab, setActiveTab] = useState("playbooks");
  const [selectedPlaybook, setSelectedPlaybook] = useState("");

  const compliancePlaybooks = [
    {
      id: "PB-AML-001",
      name: "AML Investigation Workflow",
      description: "Automated suspicious activity investigation process",
      triggerConditions: ["Transaction > $10K", "Multiple small transactions", "High-risk jurisdiction"],
      automatedSteps: [
        "Flag transaction for review",
        "Gather user transaction history",
        "Check sanctions and PEP lists",
        "Generate preliminary risk assessment",
        "Route to compliance officer",
        "Set follow-up reminders"
      ],
      executionTime: "3-5 minutes",
      successRate: "97.3%",
      status: "Active",
      lastExecuted: "2 hours ago",
      totalExecutions: 456
    },
    {
      id: "PB-KYC-002", 
      name: "Enhanced Due Diligence",
      description: "Automated EDD process for high-risk customers",
      triggerConditions: ["PEP status", "High net worth", "Complex ownership structure"],
      automatedSteps: [
        "Request additional documentation",
        "Verify source of funds",
        "Check beneficial ownership",
        "Perform enhanced background screening",
        "Generate EDD report",
        "Schedule management review"
      ],
      executionTime: "1-2 days",
      successRate: "94.8%",
      status: "Active",
      lastExecuted: "6 hours ago",
      totalExecutions: 123
    },
    {
      id: "PB-SAR-003",
      name: "SAR Filing Automation",
      description: "Automated Suspicious Activity Report generation and filing",
      triggerConditions: ["AI suspicious pattern detection", "Manual escalation", "Threshold breach"],
      automatedSteps: [
        "Compile transaction evidence",
        "Generate narrative description",
        "Populate SAR form fields",
        "Attach supporting documents",
        "Submit to FinCEN",
        "Update case management system"
      ],
      executionTime: "30-45 minutes",
      successRate: "99.1%",
      status: "Active", 
      lastExecuted: "1 day ago",
      totalExecutions: 67
    },
    {
      id: "PB-SANC-004",
      name: "Sanctions Screening Process",
      description: "Continuous sanctions list monitoring and enforcement",
      triggerConditions: ["New customer onboarding", "Daily batch screening", "List updates"],
      automatedSteps: [
        "Screen against OFAC/EU/UN lists",
        "Fuzzy name matching analysis",
        "Generate match confidence scores",
        "Handle false positive filtering",
        "Escalate true positive matches",
        "Document screening results"
      ],
      executionTime: "Real-time to 5 minutes",
      successRate: "98.7%",
      status: "Active",
      lastExecuted: "30 minutes ago",
      totalExecutions: 2847
    }
  ];

  const workflowExecutions = [
    {
      executionId: "EXE-001",
      playbookId: "PB-AML-001", 
      playbookName: "AML Investigation Workflow",
      triggeredBy: "AI Pattern Detection",
      userId: "user_778899",
      startTime: "2024-01-25 14:30:00",
      status: "Completed",
      duration: "4m 23s",
      stepsCompleted: 6,
      totalSteps: 6,
      outcome: "Escalated to Compliance Officer"
    },
    {
      executionId: "EXE-002",
      playbookId: "PB-KYC-002",
      playbookName: "Enhanced Due Diligence", 
      triggeredBy: "PEP Status Detected",
      userId: "user_445566",
      startTime: "2024-01-25 09:15:00",
      status: "In Progress",
      duration: "2h 15m",
      stepsCompleted: 4,
      totalSteps: 6,
      outcome: "Pending Document Upload"
    },
    {
      executionId: "EXE-003",
      playbookId: "PB-SAR-003",
      playbookName: "SAR Filing Automation",
      triggeredBy: "Manual Escalation",
      userId: "user_123789",
      startTime: "2024-01-24 16:45:00", 
      status: "Completed",
      duration: "38m 12s",
      stepsCompleted: 6,
      totalSteps: 6,
      outcome: "SAR Filed Successfully"
    }
  ];

  const automationMetrics = {
    totalPlaybooks: compliancePlaybooks.length,
    activePlaybooks: compliancePlaybooks.filter(p => p.status === 'Active').length,
    avgExecutionTime: "2.3 hours",
    successRate: "97.2%",
    timesSaved: "847 hours",
    casesProcessed: 3493
  };

  const complianceRules = [
    {
      ruleId: "RULE-001",
      name: "Large Transaction Monitoring",
      description: "Monitor transactions above $10,000",
      condition: "transaction_amount > 10000",
      action: "Trigger AML Investigation Playbook",
      priority: "High",
      status: "Active",
      lastTriggered: "2 hours ago"
    },
    {
      ruleId: "RULE-002",
      name: "Structuring Detection",
      description: "Detect multiple transactions under reporting threshold",
      condition: "count(transactions) > 3 AND sum(amount) > 9000 AND timeframe < 24h",
      action: "Flag for Manual Review",
      priority: "Critical",
      status: "Active", 
      lastTriggered: "4 hours ago"
    },
    {
      ruleId: "RULE-003",
      name: "Sanctions List Updates",
      description: "Process sanctions list updates automatically",
      condition: "sanctions_list_updated = true",
      action: "Trigger Sanctions Screening Process",
      priority: "Medium",
      status: "Active",
      lastTriggered: "1 day ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': case 'active': return 'bg-green-500';
      case 'in progress': case 'running': return 'bg-blue-500';
      case 'failed': case 'error': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Playbooks</p>
                <p className="text-2xl font-bold text-white">{automationMetrics.activePlaybooks}</p>
                <p className="text-xs text-green-400">All systems operational</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">{automationMetrics.successRate}</p>
                <p className="text-xs text-green-400">Above target</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold text-white">{automationMetrics.timesSaved}</p>
                <p className="text-xs text-blue-400">This month</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Cases Processed</p>
                <p className="text-2xl font-bold text-white">{automationMetrics.casesProcessed}</p>
                <p className="text-xs text-purple-400">Automated</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="playbooks">Compliance Playbooks</TabsTrigger>
          <TabsTrigger value="executions">Workflow Executions</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        {/* Compliance Playbooks */}
        <TabsContent value="playbooks">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Automated Compliance Playbooks</h3>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <FileText className="h-4 w-4 mr-2" />
                Create New Playbook
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {compliancePlaybooks.map((playbook) => (
                <Card key={playbook.id} className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {playbook.name}
                      </div>
                      <Badge className={getStatusColor(playbook.status)}>
                        {playbook.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{playbook.description}</p>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Trigger Conditions:</p>
                      <div className="flex flex-wrap gap-2">
                        {playbook.triggerConditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Automated Steps:</p>
                      <div className="space-y-1">
                        {playbook.automatedSteps.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span className="text-gray-300">{step}</span>
                          </div>
                        ))}
                        {playbook.automatedSteps.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{playbook.automatedSteps.length - 3} more steps
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Execution Time</p>
                        <p className="text-white">{playbook.executionTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Success Rate</p>
                        <p className="text-green-400">{playbook.successRate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Executed</p>
                        <p className="text-white">{playbook.lastExecuted}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total Executions</p>
                        <p className="text-blue-400">{playbook.totalExecutions}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Workflow Executions */}
        <TabsContent value="executions">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Workflow Executions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowExecutions.map((execution) => (
                  <div key={execution.executionId} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{execution.executionId}</Badge>
                        <span className="text-white font-medium">{execution.playbookName}</span>
                      </div>
                      <Badge className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Triggered By</p>
                        <p className="text-white">{execution.triggeredBy}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-blue-400">{execution.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Outcome</p>
                        <p className="text-green-400">{execution.outcome}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{execution.stepsCompleted}/{execution.totalSteps} steps</span>
                      </div>
                      <Progress value={(execution.stepsCompleted / execution.totalSteps) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Rules */}
        <TabsContent value="rules">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Compliance Automation Rules</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Add New Rule
              </Button>
            </div>

            <Card className="bg-black/20 border-purple-500/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {complianceRules.map((rule) => (
                    <div key={rule.ruleId} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{rule.name}</span>
                          <Badge variant="outline">{rule.ruleId}</Badge>
                          <Badge className={getPriorityColor(rule.priority)}>
                            {rule.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{rule.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Condition</p>
                          <code className="text-blue-400 text-xs bg-black/30 p-1 rounded">
                            {rule.condition}
                          </code>
                        </div>
                        <div>
                          <p className="text-gray-400">Action</p>
                          <p className="text-white">{rule.action}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm">
                        <p className="text-gray-400">Last Triggered: <span className="text-white">{rule.lastTriggered}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real-time Monitoring */}
        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Compliance Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-400 font-medium">Active Rules</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-blue-400 font-medium">Triggers Today</p>
                    <p className="text-2xl font-bold text-white">67</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <p className="text-yellow-400 font-medium">Pending Actions</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                    <p className="text-purple-400 font-medium">Avg Response</p>
                    <p className="text-2xl font-bold text-white">3.2s</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">System Health</span>
                    <span className="text-green-400">Operational</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Recent Alerts</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-white">Large transaction detected - $45K</span>
                      <Badge variant="outline" className="text-xs">2m ago</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-white">SAR filing completed successfully</span>
                      <Badge variant="outline" className="text-xs">15m ago</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bell className="h-4 w-4 text-blue-400" />
                      <span className="text-white">KYC document uploaded for review</span>
                      <Badge variant="outline" className="text-xs">28m ago</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automation Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">AML Monitoring</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">SAR Auto-Filing</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">KYC Auto-Approval</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Sanctions Screening</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Emergency Controls</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause All
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">System Reports</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Audit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}