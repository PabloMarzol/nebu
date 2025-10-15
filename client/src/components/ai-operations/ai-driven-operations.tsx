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
  Brain, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Search,
  Settings,
  BarChart3,
  Activity,
  Eye,
  Cpu,
  Database,
  Network,
  Bot,
  Lightbulb
} from "lucide-react";

export default function AIDrivenOperations() {
  const [activeTab, setActiveTab] = useState("predictive-kyc");
  const [aiEnabled, setAiEnabled] = useState(true);

  const predictiveKYCResults = [
    {
      userId: "user_887654",
      name: "Ahmed Al-Rashid",
      country: "UAE", 
      riskScore: 85,
      prediction: "High Risk - PEP Connection",
      confidence: 94,
      flaggedReasons: ["Political Exposure", "High-Value Transactions", "Sanctions List Match"],
      recommendation: "Manual Review Required",
      aiInsight: "Pattern matches previous sanctions violations",
      processingTime: "2.3s"
    },
    {
      userId: "user_334521",
      name: "Maria Santos", 
      country: "Brazil",
      riskScore: 25,
      prediction: "Low Risk - Auto-Approve",
      confidence: 98,
      flaggedReasons: [],
      recommendation: "Auto-Approve Level 2",
      aiInsight: "Standard retail user profile",
      processingTime: "0.8s"
    },
    {
      userId: "user_776432",
      name: "Chen Wei Ming",
      country: "Singapore",
      riskScore: 65,
      prediction: "Medium Risk - Additional Docs",
      confidence: 87,
      flaggedReasons: ["High Net Worth", "Multiple Jurisdictions"],
      recommendation: "Request Source of Funds", 
      aiInsight: "Institutional client pattern detected",
      processingTime: "1.5s"
    }
  ];

  const amlPatterns = [
    {
      patternId: "AML-AI-001",
      name: "Structuring Detection",
      description: "Multiple transactions below reporting threshold",
      triggeredUsers: 12,
      accuracy: "96.2%",
      falsePositives: "3.8%",
      avgDetectionTime: "Real-time",
      status: "Active"
    },
    {
      patternId: "AML-AI-002", 
      name: "Wash Trading Detection",
      description: "Artificial volume creation patterns",
      triggeredUsers: 7,
      accuracy: "94.7%",
      falsePositives: "5.3%",
      avgDetectionTime: "< 1 minute",
      status: "Active"
    },
    {
      patternId: "AML-AI-003",
      name: "Layering Scheme Detection",
      description: "Complex transaction layering to obscure source",
      triggeredUsers: 3,
      accuracy: "91.5%",
      falsePositives: "8.5%", 
      avgDetectionTime: "2-5 minutes",
      status: "Active"
    },
    {
      patternId: "AML-AI-004",
      name: "Mirror Trading Detection",
      description: "Synchronized trading across multiple accounts",
      triggeredUsers: 5,
      accuracy: "89.3%",
      falsePositives: "10.7%",
      avgDetectionTime: "1-3 minutes",  
      status: "Training"
    }
  ];

  const smartRouting = [
    {
      ticketId: "TKT-001",
      category: "KYC Issues",
      priority: "High",
      routedTo: "KYC Specialist Team (accounts@nebulaxexchange.io)",
      confidence: 97,
      aiReasoning: "Document verification failure detected",
      estimatedResolution: "2-4 hours",
      similarCases: 23
    },
    {
      ticketId: "TKT-002",
      category: "Trading Support",
      priority: "Medium", 
      routedTo: "Trading Desk (traders@nebulaxexchange.io)",
      confidence: 91,
      aiReasoning: "Margin call assistance required",
      estimatedResolution: "30 minutes",
      similarCases: 156
    },
    {
      ticketId: "TKT-003",
      category: "Compliance",
      priority: "Critical",
      routedTo: "Compliance Officer (enquiries@nebulaxexchange.io)",
      confidence: 99,
      aiReasoning: "AML alert requires immediate attention",
      estimatedResolution: "1 hour",
      similarCases: 8
    }
  ];

  const rpaAutomation = [
    {
      processName: "Daily Reconciliation",
      status: "Running",
      lastRun: "Today 06:00 UTC",
      nextRun: "Tomorrow 06:00 UTC",
      successRate: "99.2%",
      avgDuration: "12 minutes",
      recordsProcessed: "45,234",
      errorRate: "0.8%"
    },
    {
      processName: "KYC Document Processing",  
      status: "Running",
      lastRun: "30 minutes ago",
      nextRun: "Continuous",
      successRate: "94.7%",
      avgDuration: "2.3 minutes",
      recordsProcessed: "1,234",
      errorRate: "5.3%"
    },
    {
      processName: "Regulatory Reporting",
      status: "Scheduled",
      lastRun: "Yesterday 23:00 UTC", 
      nextRun: "Today 23:00 UTC",
      successRate: "100%",
      avgDuration: "45 minutes",
      recordsProcessed: "12,456",
      errorRate: "0%"
    },
    {
      processName: "Wallet Balance Monitoring",
      status: "Running",
      lastRun: "5 minutes ago",
      nextRun: "Continuous",
      successRate: "99.8%",
      avgDuration: "30 seconds", 
      recordsProcessed: "156,789",
      errorRate: "0.2%"
    }
  ];

  const aiInsights = [
    {
      type: "Market Anomaly",
      title: "Unusual Trading Volume Detected",
      description: "ETH/USDT pair showing 340% volume increase",
      severity: "Medium",
      confidence: 87,
      recommendation: "Monitor for potential market manipulation",
      affectedUsers: 1247
    },
    {
      type: "Risk Alert",
      title: "Concentrated Risk Exposure", 
      description: "15 users hold 45% of platform's SOL inventory",
      severity: "High",
      confidence: 96,
      recommendation: "Implement position limits and diversification incentives",
      affectedUsers: 15
    },
    {
      type: "Operational Insight",
      title: "Support Ticket Pattern",
      description: "78% increase in margin call inquiries",
      severity: "Low",
      confidence: 92,
      recommendation: "Create automated margin education emails",
      affectedUsers: 456
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">AI Predictions</p>
                <p className="text-2xl font-bold text-white">2,847</p>
                <p className="text-xs text-green-400">96.4% accuracy</p>
              </div>
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Automated Tasks</p>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-xs text-blue-400">Running 24/7</p>
              </div>
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold text-white">247h</p>
                <p className="text-xs text-green-400">This month</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">AI Insights</p>
                <p className="text-2xl font-bold text-white">{aiInsights.length}</p>
                <p className="text-xs text-yellow-400">Actionable</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI-Driven Operations</h2>
        <div className="flex items-center gap-3">
          <Label htmlFor="ai-enabled" className="text-white">AI Systems Enabled</Label>
          <Switch 
            id="ai-enabled"
            checked={aiEnabled}
            onCheckedChange={setAiEnabled}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="predictive-kyc">Predictive KYC</TabsTrigger>
          <TabsTrigger value="aml-patterns">AML Pattern Detection</TabsTrigger>
          <TabsTrigger value="smart-routing">Smart Routing</TabsTrigger>
          <TabsTrigger value="rpa-automation">RPA Automation</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Predictive KYC/AML */}
        <TabsContent value="predictive-kyc">
          <div className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered KYC Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveKYCResults.map((result) => (
                    <div key={result.userId} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{result.name}</span>
                          <Badge variant="outline">{result.country}</Badge>
                          <Badge className={
                            result.riskScore >= 80 ? 'bg-red-500' :
                            result.riskScore >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }>
                            Risk: {result.riskScore}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {result.confidence}% confidence
                          </Badge>
                          <Badge className={getSeverityColor(result.recommendation.includes('Manual') ? 'High' : 'Low')}>
                            {result.recommendation}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">AI Prediction</p>
                          <p className="text-white">{result.prediction}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Processing Time</p>
                          <p className="text-green-400">{result.processingTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">AI Insight</p>
                          <p className="text-blue-400">{result.aiInsight}</p>
                        </div>
                      </div>
                      {result.flaggedReasons.length > 0 && (
                        <div className="mt-3">
                          <p className="text-gray-400 text-sm mb-2">Flagged Reasons:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.flaggedReasons.map((reason, index) => (
                              <Badge key={index} variant="outline" className="text-red-400 border-red-400">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AML Pattern Detection */}
        <TabsContent value="aml-patterns">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Machine Learning AML Pattern Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {amlPatterns.map((pattern) => (
                  <div key={pattern.patternId} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{pattern.name}</span>
                        <Badge variant="outline">{pattern.patternId}</Badge>
                      </div>
                      <Badge className={pattern.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {pattern.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{pattern.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Triggered Users</p>
                        <p className="text-white font-semibold">{pattern.triggeredUsers}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Accuracy</p>
                        <p className="text-green-400 font-semibold">{pattern.accuracy}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">False Positives</p>
                        <p className="text-yellow-400 font-semibold">{pattern.falsePositives}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Detection Time</p>
                        <p className="text-blue-400 font-semibold">{pattern.avgDetectionTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Ticket Routing */}
        <TabsContent value="smart-routing">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI-Powered Support Ticket Routing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartRouting.map((ticket) => (
                  <div key={ticket.ticketId} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{ticket.ticketId}</span>
                        <Badge variant="outline">{ticket.category}</Badge>
                        <Badge className={
                          ticket.priority === 'Critical' ? 'bg-red-500' :
                          ticket.priority === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                        }>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <Badge className="bg-purple-500">
                        {ticket.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Routed To</p>
                        <p className="text-white">{ticket.routedTo}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">AI Reasoning</p>
                        <p className="text-blue-400">{ticket.aiReasoning}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Est. Resolution</p>
                        <p className="text-green-400">{ticket.estimatedResolution}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline">
                        {ticket.similarCases} similar cases processed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RPA Automation */}
        <TabsContent value="rpa-automation">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Robotic Process Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rpaAutomation.map((process) => (
                  <div key={process.processName} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">{process.processName}</span>
                      <Badge className={
                        process.status === 'Running' ? 'bg-green-500' :
                        process.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                      }>
                        {process.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Success Rate</p>
                        <p className="text-green-400 font-semibold">{process.successRate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Avg Duration</p>
                        <p className="text-white">{process.avgDuration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Records Processed</p>
                        <p className="text-blue-400">{process.recordsProcessed}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Error Rate</p>
                        <p className={
                          parseFloat(process.errorRate) === 0 ? 'text-green-400' :
                          parseFloat(process.errorRate) < 5 ? 'text-yellow-400' : 'text-red-400'
                        }>
                          {process.errorRate}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Last Run</p>
                        <p className="text-white">{process.lastRun}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Next Run</p>
                        <p className="text-white">{process.nextRun}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="ai-insights">
          <div className="space-y-6">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      {insight.title}
                    </div>
                    <Badge className={getSeverityColor(insight.severity)}>
                      {insight.severity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{insight.type}</Badge>
                      <Badge className="bg-purple-500">
                        {insight.confidence}% confidence
                      </Badge>
                      <span className="text-gray-400 text-sm">
                        Affects {insight.affectedUsers} users
                      </span>
                    </div>
                    <p className="text-gray-300">{insight.description}</p>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-blue-400 font-medium">AI Recommendation:</p>
                      <p className="text-white">{insight.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}