import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileCheck, 
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Lock,
  Code,
  DollarSign,
  Target,
  Zap
} from "lucide-react";

interface ProjectMetrics {
  technicalScore: number;
  teamScore: number;
  tokenomicsScore: number;
  marketScore: number;
  complianceScore: number;
}

interface SecurityAnalysis {
  smartContractAudit: "completed" | "in_progress" | "pending";
  codeReview: "passed" | "issues_found" | "not_started";
  penetrationTest: "completed" | "scheduled" | "not_required";
  bugBounty: "active" | "completed" | "none";
}

interface MarketAnalysis {
  totalAddressableMarket: string;
  competitivePosition: "strong" | "moderate" | "weak";
  partnerships: number;
  communitySize: number;
  socialSentiment: "positive" | "neutral" | "negative";
}

interface ProjectAnalysisWidgetProps {
  projectId: string;
  projectName: string;
  symbol: string;
  compact?: boolean;
}

export default function ProjectAnalysisWidget({ 
  projectId, 
  projectName, 
  symbol,
  compact = false 
}: ProjectAnalysisWidgetProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState("overview");

  // Real project analysis data would come from API
  const metrics: ProjectMetrics = {
    technicalScore: 92,
    teamScore: 88,
    tokenomicsScore: 85,
    marketScore: 79,
    complianceScore: 91
  };

  const securityAnalysis: SecurityAnalysis = {
    smartContractAudit: "completed",
    codeReview: "passed",
    penetrationTest: "completed",
    bugBounty: "active"
  };

  const marketAnalysis: MarketAnalysis = {
    totalAddressableMarket: "$2.4B",
    competitivePosition: "strong",
    partnerships: 12,
    communitySize: 45000,
    socialSentiment: "positive"
  };

  const overallScore = Math.round(
    (metrics.technicalScore + metrics.teamScore + metrics.tokenomicsScore + 
     metrics.marketScore + metrics.complianceScore) / 5
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "passed":
      case "active":
      case "strong":
      case "positive":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in_progress":
      case "scheduled":
      case "moderate":
      case "neutral":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "pending":
      case "not_started":
      case "weak":
      case "negative":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (compact) {
    return (
      <Card className="glass border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <BarChart3 className="w-4 h-4 text-green-400" />
            <span>Project Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </div>
            <div className="text-xs text-muted-foreground">Overall Rating</div>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Technical:</span>
              <span className={getScoreColor(metrics.technicalScore)}>{metrics.technicalScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Team:</span>
              <span className={getScoreColor(metrics.teamScore)}>{metrics.teamScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Tokenomics:</span>
              <span className={getScoreColor(metrics.tokenomicsScore)}>{metrics.tokenomicsScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Market:</span>
              <span className={getScoreColor(metrics.marketScore)}>{metrics.marketScore}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Project Analysis</span>
            </div>
            <Badge variant="outline">{symbol}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)} mb-2`}>
              {overallScore}
            </div>
            <div className="text-lg text-muted-foreground mb-4">Overall Project Score</div>
            <Progress value={overallScore} className="h-3" />
          </div>

          <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold">Technical</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(metrics.technicalScore)}`}>
                        {metrics.technicalScore}
                      </span>
                    </div>
                    <Progress value={metrics.technicalScore} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold">Team</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(metrics.teamScore)}`}>
                        {metrics.teamScore}
                      </span>
                    </div>
                    <Progress value={metrics.teamScore} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold">Tokenomics</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(metrics.tokenomicsScore)}`}>
                        {metrics.tokenomicsScore}
                      </span>
                    </div>
                    <Progress value={metrics.tokenomicsScore} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold">Market</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(metrics.marketScore)}`}>
                        {metrics.marketScore}
                      </span>
                    </div>
                    <Progress value={metrics.marketScore} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-semibold">Smart Contract Architecture</div>
                      <div className="text-sm text-muted-foreground">Modular, upgradeable design</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="font-semibold">Gas Optimization</div>
                      <div className="text-sm text-muted-foreground">Efficient contract design</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-semibold">Access Controls</div>
                      <div className="text-sm text-muted-foreground">Multi-sig governance</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold">Smart Contract Audit</div>
                      <div className="text-sm text-muted-foreground">CertiK & ConsenSys</div>
                    </div>
                  </div>
                  {getStatusIcon(securityAnalysis.smartContractAudit)}
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-semibold">Code Review</div>
                      <div className="text-sm text-muted-foreground">Internal security review</div>
                    </div>
                  </div>
                  {getStatusIcon(securityAnalysis.codeReview)}
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="font-semibold">Bug Bounty Program</div>
                      <div className="text-sm text-muted-foreground">$50K reward pool</div>
                    </div>
                  </div>
                  {getStatusIcon(securityAnalysis.bugBounty)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {marketAnalysis.totalAddressableMarket}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {marketAnalysis.partnerships}
                    </div>
                    <div className="text-sm text-muted-foreground">Strategic Partners</div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {marketAnalysis.communitySize.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Community Members</div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      {getStatusIcon(marketAnalysis.socialSentiment)}
                      <span className="text-lg font-bold">
                        {marketAnalysis.socialSentiment.charAt(0).toUpperCase() + marketAnalysis.socialSentiment.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">Social Sentiment</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}