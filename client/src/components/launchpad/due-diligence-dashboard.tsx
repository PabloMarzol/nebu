import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileCheck, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  Download,
  ExternalLink,
  Star,
  BarChart3,
  DollarSign,
  Lock,
  Globe,
  GitBranch,
  Award,
  Target,
  Zap
} from "lucide-react";

interface DueDiligenceScore {
  category: string;
  score: number;
  maxScore: number;
  status: "passed" | "warning" | "failed";
  details: string[];
}

interface TeamMember {
  name: string;
  role: string;
  experience: string;
  linkedIn?: string;
  previousProjects: string[];
  verificationStatus: "verified" | "pending" | "unverified";
}

interface AuditReport {
  auditor: string;
  date: string;
  score: number;
  status: "completed" | "in_progress" | "pending";
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  reportUrl?: string;
}

interface ComplianceCheck {
  jurisdiction: string;
  status: "compliant" | "pending" | "non_compliant";
  requirements: string[];
  lastUpdated: string;
}

interface ProjectDueDiligence {
  projectId: string;
  projectName: string;
  symbol: string;
  overallScore: number;
  overallStatus: "approved" | "under_review" | "rejected";
  lastUpdated: string;
  scores: DueDiligenceScore[];
  team: TeamMember[];
  audits: AuditReport[];
  compliance: ComplianceCheck[];
  documents: {
    whitepaper: { available: boolean; url?: string; lastUpdated?: string };
    tokenomics: { available: boolean; url?: string; lastUpdated?: string };
    roadmap: { available: boolean; url?: string; lastUpdated?: string };
    legal: { available: boolean; url?: string; lastUpdated?: string };
  };
  riskFactors: {
    level: "low" | "medium" | "high" | "critical";
    category: string;
    description: string;
  }[];
}

interface DueDiligenceDashboardProps {
  projectId: string;
}

export default function DueDiligenceDashboard({ projectId }: DueDiligenceDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  const dueDiligenceData: ProjectDueDiligence = {
    projectId: "defichain-1",
    projectName: "DeFiChain Protocol",
    symbol: "DCP",
    overallScore: 87,
    overallStatus: "approved",
    lastUpdated: "2024-12-10T14:30:00Z",
    scores: [
      {
        category: "Technical Architecture",
        score: 92,
        maxScore: 100,
        status: "passed",
        details: [
          "Smart contract architecture reviewed and approved",
          "Security best practices implemented",
          "Gas optimization strategies in place",
          "Upgrade mechanisms properly secured"
        ]
      },
      {
        category: "Team & Advisors",
        score: 85,
        maxScore: 100,
        status: "passed",
        details: [
          "Core team fully doxxed and verified",
          "Strong technical background in DeFi",
          "Advisory board includes industry veterans",
          "Previous successful project experience"
        ]
      },
      {
        category: "Tokenomics",
        score: 90,
        maxScore: 100,
        status: "passed",
        details: [
          "Well-designed token distribution model",
          "Clear utility and value accrual mechanisms",
          "Sustainable emission schedule",
          "Anti-dumping measures implemented"
        ]
      },
      {
        category: "Legal Compliance",
        score: 78,
        maxScore: 100,
        status: "warning",
        details: [
          "US compliance documentation pending",
          "EU regulations fully compliant",
          "Terms of service reviewed and approved",
          "Privacy policy meets GDPR standards"
        ]
      },
      {
        category: "Market Analysis",
        score: 88,
        maxScore: 100,
        status: "passed",
        details: [
          "Total addressable market clearly defined",
          "Competitive analysis comprehensive",
          "Go-to-market strategy well-planned",
          "Partnership agreements in place"
        ]
      }
    ],
    team: [
      {
        name: "Sarah Chen",
        role: "CEO & Co-Founder",
        experience: "8 years blockchain, ex-Coinbase",
        linkedIn: "https://linkedin.com/in/sarahchen",
        previousProjects: ["DeFiSwap", "YieldFarm Pro"],
        verificationStatus: "verified"
      },
      {
        name: "Marcus Rodriguez",
        role: "CTO & Co-Founder",
        experience: "12 years fintech, ex-Goldman Sachs",
        linkedIn: "https://linkedin.com/in/marcusrodriguez",
        previousProjects: ["TradeFi Solutions", "BlockchainBank"],
        verificationStatus: "verified"
      },
      {
        name: "Dr. Elena Petrov",
        role: "Head of Research",
        experience: "PhD Economics, 6 years DeFi research",
        linkedIn: "https://linkedin.com/in/elenapetrov",
        previousProjects: ["DeFi Research Lab", "TokenMetrics"],
        verificationStatus: "verified"
      },
      {
        name: "James Park",
        role: "Lead Developer",
        experience: "5 years smart contracts, ex-Uniswap",
        previousProjects: ["UniswapV3", "AAVE Protocol"],
        verificationStatus: "pending"
      }
    ],
    audits: [
      {
        auditor: "CertiK",
        date: "2024-11-28",
        score: 94,
        status: "completed",
        criticalIssues: 0,
        highIssues: 1,
        mediumIssues: 3,
        lowIssues: 7,
        reportUrl: "https://certik.com/report/defichain"
      },
      {
        auditor: "ConsenSys Diligence",
        date: "2024-12-02",
        score: 91,
        status: "completed",
        criticalIssues: 0,
        highIssues: 2,
        mediumIssues: 2,
        lowIssues: 5,
        reportUrl: "https://consensys.net/report/defichain"
      },
      {
        auditor: "Trail of Bits",
        date: "2024-12-15",
        score: 0,
        status: "in_progress",
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0
      }
    ],
    compliance: [
      {
        jurisdiction: "United States",
        status: "pending",
        requirements: ["SEC registration", "FinCEN compliance", "State regulations"],
        lastUpdated: "2024-12-08"
      },
      {
        jurisdiction: "European Union",
        status: "compliant",
        requirements: ["MiCA compliance", "GDPR compliance", "AML/KYC procedures"],
        lastUpdated: "2024-12-05"
      },
      {
        jurisdiction: "Singapore",
        status: "compliant",
        requirements: ["MAS registration", "Payment Services Act", "Securities regulations"],
        lastUpdated: "2024-12-03"
      }
    ],
    documents: {
      whitepaper: { available: true, url: "https://defichain.com/whitepaper.pdf", lastUpdated: "2024-11-15" },
      tokenomics: { available: true, url: "https://defichain.com/tokenomics.pdf", lastUpdated: "2024-11-20" },
      roadmap: { available: true, url: "https://defichain.com/roadmap.pdf", lastUpdated: "2024-12-01" },
      legal: { available: true, url: "https://defichain.com/legal.pdf", lastUpdated: "2024-11-25" }
    },
    riskFactors: [
      {
        level: "medium",
        category: "Regulatory",
        description: "US regulatory clarity pending - may impact launch timeline"
      },
      {
        level: "low",
        category: "Technical",
        description: "Smart contract complexity may introduce edge case risks"
      },
      {
        level: "low",
        category: "Market",
        description: "DeFi market volatility may affect adoption"
      },
      {
        level: "medium",
        category: "Competition",
        description: "Established competitors with significant market share"
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
      case "approved":
      case "completed":
      case "compliant":
      case "verified":
        return "bg-green-600 text-white";
      case "warning":
      case "pending":
      case "under_review":
      case "in_progress":
        return "bg-yellow-600 text-white";
      case "failed":
      case "rejected":
      case "non_compliant":
      case "unverified":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
      case "approved":
      case "completed":
      case "compliant":
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
      case "pending":
      case "under_review":
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "failed":
      case "rejected":
      case "non_compliant":
      case "unverified":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 border-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "high": return "text-orange-400 border-orange-400 bg-orange-400/10";
      case "critical": return "text-red-400 border-red-400 bg-red-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Due Diligence Report
          </span>
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h3 className="text-xl font-semibold">{dueDiligenceData.projectName}</h3>
          <Badge variant="outline">{dueDiligenceData.symbol}</Badge>
          <Badge className={getStatusColor(dueDiligenceData.overallStatus)}>
            {getStatusIcon(dueDiligenceData.overallStatus)}
            <span className="ml-1">{dueDiligenceData.overallStatus.replace('_', ' ').toUpperCase()}</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Last updated: {new Date(dueDiligenceData.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {/* Overall Score */}
      <Card className="glass border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Overall Due Diligence Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl font-bold text-blue-400">{dueDiligenceData.overallScore}</div>
            <div className="text-2xl text-muted-foreground ml-2">/100</div>
          </div>
          <Progress value={dueDiligenceData.overallScore} className="h-4 mb-4" />
          <div className="text-center text-lg font-semibold">
            {dueDiligenceData.overallScore >= 90 ? "Excellent" :
             dueDiligenceData.overallScore >= 80 ? "Good" :
             dueDiligenceData.overallScore >= 70 ? "Acceptable" : "Needs Improvement"}
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueDiligenceData.scores.map((score, index) => (
              <Card key={index} className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{score.category}</span>
                    <Badge className={getStatusColor(score.status)}>
                      {getStatusIcon(score.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                      {score.score}
                    </span>
                    <span className="text-sm text-muted-foreground">/{score.maxScore}</span>
                  </div>
                  <Progress value={(score.score / score.maxScore) * 100} className="h-2 mb-3" />
                  <div className="space-y-1">
                    {score.details.slice(0, 2).map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                    {score.details.length > 2 && (
                      <div className="text-xs text-blue-400 cursor-pointer">
                        +{score.details.length - 2} more details
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dueDiligenceData.team.length}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <FileCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dueDiligenceData.audits.filter(a => a.status === "completed").length}</div>
                <div className="text-sm text-muted-foreground">Audits Complete</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dueDiligenceData.compliance.filter(c => c.status === "compliant").length}</div>
                <div className="text-sm text-muted-foreground">Jurisdictions</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dueDiligenceData.riskFactors.length}</div>
                <div className="text-sm text-muted-foreground">Risk Factors</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dueDiligenceData.team.map((member, index) => (
              <Card key={index} className="glass">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{member.name}</span>
                        <Badge className={getStatusColor(member.verificationStatus)}>
                          {getStatusIcon(member.verificationStatus)}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    {member.linkedIn && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Experience</h4>
                      <p className="text-sm text-muted-foreground">{member.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Previous Projects</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.previousProjects.map((project, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <div className="space-y-4">
            {dueDiligenceData.audits.map((audit, index) => (
              <Card key={index} className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span>{audit.auditor}</span>
                      <Badge className={getStatusColor(audit.status)}>
                        {getStatusIcon(audit.status)}
                        <span className="ml-1">{audit.status.replace('_', ' ')}</span>
                      </Badge>
                    </CardTitle>
                    {audit.reportUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-semibold">{new Date(audit.date).toLocaleDateString()}</div>
                    </div>
                    {audit.status === "completed" && (
                      <>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Score</div>
                          <div className={`font-bold text-lg ${getScoreColor(audit.score)}`}>{audit.score}/100</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Critical</div>
                          <div className="font-semibold text-red-400">{audit.criticalIssues}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">High</div>
                          <div className="font-semibold text-orange-400">{audit.highIssues}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Medium</div>
                          <div className="font-semibold text-yellow-400">{audit.mediumIssues}</div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="space-y-4">
            {dueDiligenceData.compliance.map((compliance, index) => (
              <Card key={index} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span>{compliance.jurisdiction}</span>
                    </div>
                    <Badge className={getStatusColor(compliance.status)}>
                      {getStatusIcon(compliance.status)}
                      <span className="ml-1">{compliance.status.replace('_', ' ')}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                      <div className="space-y-1">
                        {compliance.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date(compliance.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(dueDiligenceData.documents).map(([docType, doc]) => (
              <Card key={docType} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileCheck className="w-5 h-5 text-blue-400" />
                      <span className="capitalize">{docType}</span>
                    </div>
                    <Badge className={doc.available ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                      {doc.available ? "Available" : "Missing"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {doc.available ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Last updated: {doc.lastUpdated && new Date(doc.lastUpdated).toLocaleDateString()}
                      </div>
                      <Button size="sm" className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Document
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Document not available
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="space-y-4">
            {dueDiligenceData.riskFactors.map((risk, index) => (
              <Card key={index} className={`glass border ${getRiskColor(risk.level)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className={`w-5 h-5 ${risk.level === 'critical' ? 'text-red-400' : 
                                                                risk.level === 'high' ? 'text-orange-400' :
                                                                risk.level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                        <span className="font-semibold">{risk.category} Risk</span>
                        <Badge className={getRiskColor(risk.level)}>
                          {risk.level.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
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