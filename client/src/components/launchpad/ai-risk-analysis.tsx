import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Shield, 
  Zap,
  BarChart3,
  Target,
  Clock,
  DollarSign,
  Users,
  Globe,
  Code,
  FileText,
  Activity,
  Eye,
  RefreshCw
} from "lucide-react";

interface RiskFactor {
  category: string;
  factor: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number;
  impact: number;
  likelihood: number;
  aiReasoning: string;
  historicalData: string;
  mitigation: string;
}

interface AIAnalysis {
  overallRiskScore: number;
  confidence: number;
  analysisTimestamp: string;
  modelVersion: string;
  dataPoints: number;
  riskFactors: RiskFactor[];
  marketSentiment: {
    score: number;
    trend: "bullish" | "bearish" | "neutral";
    sources: number;
  };
  technicalIndicators: {
    codeQuality: number;
    securityScore: number;
    architectureRating: number;
  };
  socialMetrics: {
    communityEngagement: number;
    developerActivity: number;
    mediaPresence: number;
  };
  predictions: {
    shortTerm: { timeframe: string; prediction: string; confidence: number };
    mediumTerm: { timeframe: string; prediction: string; confidence: number };
    longTerm: { timeframe: string; prediction: string; confidence: number };
  };
}

interface AIRiskAnalysisProps {
  projectId: string;
  projectName: string;
  symbol: string;
}

export default function AIRiskAnalysis({ projectId, projectName, symbol }: AIRiskAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Simulate AI analysis - in production this would call an AI service
  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const analysis: AIAnalysis = {
      overallRiskScore: 23, // Lower is better (0-100)
      confidence: 92,
      analysisTimestamp: new Date().toISOString(),
      modelVersion: "NebulaX-Risk-v2.1",
      dataPoints: 1247,
      riskFactors: [
        {
          category: "Smart Contract",
          factor: "Centralized Admin Controls",
          riskLevel: "medium",
          confidence: 87,
          impact: 6,
          likelihood: 4,
          aiReasoning: "Contract contains admin functions that could be misused. However, multi-sig governance mitigates this risk.",
          historicalData: "Similar admin controls led to issues in 12% of analyzed projects",
          mitigation: "Implement time-locked upgrades and expand multi-sig requirements"
        },
        {
          category: "Market",
          factor: "Low Initial Liquidity",
          riskLevel: "high",
          confidence: 94,
          impact: 8,
          likelihood: 7,
          aiReasoning: "Projected initial liquidity is below safe thresholds for project size. High volatility expected.",
          historicalData: "Projects with <$500K initial liquidity had 67% higher volatility",
          mitigation: "Secure additional market makers and increase initial liquidity pool"
        },
        {
          category: "Team",
          factor: "Anonymous Core Developer",
          riskLevel: "medium",
          confidence: 76,
          impact: 5,
          likelihood: 3,
          aiReasoning: "One key developer remains anonymous. While not uncommon in DeFi, it increases operational risk.",
          historicalData: "Anonymous team projects had 23% higher abandonment rate",
          mitigation: "Implement code escrow and increase team transparency"
        },
        {
          category: "Regulatory",
          factor: "Unclear Token Classification",
          riskLevel: "high",
          confidence: 89,
          impact: 9,
          likelihood: 6,
          aiReasoning: "Token utility features may trigger securities regulations in key jurisdictions.",
          historicalData: "Similar utility tokens faced regulatory action in 31% of cases",
          mitigation: "Obtain legal opinions from multiple jurisdictions"
        },
        {
          category: "Technical",
          factor: "Complex Oracle Dependencies",
          riskLevel: "medium",
          confidence: 91,
          impact: 7,
          likelihood: 4,
          aiReasoning: "Heavy reliance on external oracles creates potential manipulation vectors.",
          historicalData: "Oracle-dependent protocols experienced issues in 18% of cases",
          mitigation: "Implement multiple oracle providers and circuit breakers"
        }
      ],
      marketSentiment: {
        score: 72,
        trend: "bullish",
        sources: 1834
      },
      technicalIndicators: {
        codeQuality: 88,
        securityScore: 85,
        architectureRating: 91
      },
      socialMetrics: {
        communityEngagement: 76,
        developerActivity: 82,
        mediaPresence: 68
      },
      predictions: {
        shortTerm: {
          timeframe: "30 days",
          prediction: "Moderate volatility expected due to initial liquidity constraints",
          confidence: 78
        },
        mediumTerm: {
          timeframe: "6 months", 
          prediction: "Strong growth potential if regulatory clarity achieved",
          confidence: 65
        },
        longTerm: {
          timeframe: "2 years",
          prediction: "High success probability with sustained development activity",
          confidence: 52
        }
      }
    };
    
    setAnalysisData(analysis);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    performAIAnalysis();
  }, [projectId]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 border-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "high": return "text-orange-400 border-orange-400 bg-orange-400/10";
      case "critical": return "text-red-400 border-red-400 bg-red-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 25) return "text-green-400";
    if (score <= 50) return "text-yellow-400";
    if (score <= 75) return "text-orange-400";
    return "text-red-400";
  };

  const getSentimentIcon = (trend: string) => {
    switch (trend) {
      case "bullish": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "bearish": return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="glass border-purple-500/30">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4">
            <Brain className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Risk Analysis in Progress</h3>
          <p className="text-muted-foreground mb-4">
            Analyzing {projectName} across 15+ risk dimensions...
          </p>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Processing smart contract code...</div>
            <div className="text-sm text-muted-foreground">Evaluating market conditions...</div>
            <div className="text-sm text-muted-foreground">Analyzing social sentiment...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <span>AI Risk Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">v{analysisData.modelVersion}</Badge>
              <Button size="sm" variant="outline" onClick={performAIAnalysis}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Score */}
            <div className="text-center">
              <div className={`text-5xl font-bold ${getRiskScoreColor(analysisData.overallRiskScore)} mb-2`}>
                {analysisData.overallRiskScore}
              </div>
              <div className="text-lg font-semibold mb-1">Risk Score</div>
              <div className="text-sm text-muted-foreground">
                {analysisData.overallRiskScore <= 25 ? "Low Risk" :
                 analysisData.overallRiskScore <= 50 ? "Medium Risk" :
                 analysisData.overallRiskScore <= 75 ? "High Risk" : "Critical Risk"}
              </div>
              <Progress 
                value={100 - analysisData.overallRiskScore} 
                className="h-2 mt-2" 
              />
            </div>

            {/* Confidence */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {analysisData.confidence}%
              </div>
              <div className="text-lg font-semibold mb-1">AI Confidence</div>
              <div className="text-sm text-muted-foreground">
                Based on {analysisData.dataPoints.toLocaleString()} data points
              </div>
              <Progress value={analysisData.confidence} className="h-2 mt-2" />
            </div>

            {/* Market Sentiment */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getSentimentIcon(analysisData.marketSentiment.trend)}
                <span className="text-3xl font-bold text-green-400">
                  {analysisData.marketSentiment.score}
                </span>
              </div>
              <div className="text-lg font-semibold mb-1">Market Sentiment</div>
              <div className="text-sm text-muted-foreground">
                {analysisData.marketSentiment.trend.charAt(0).toUpperCase() + 
                 analysisData.marketSentiment.trend.slice(1)} trend
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Risk Factors</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="social">Social & Market</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {analysisData.riskFactors.map((risk, index) => (
            <Card key={index} className={`glass border ${getRiskColor(risk.riskLevel)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        risk.riskLevel === 'critical' ? 'text-red-400' :
                        risk.riskLevel === 'high' ? 'text-orange-400' :
                        risk.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                      <span>{risk.factor}</span>
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {risk.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge className={getRiskColor(risk.riskLevel)}>
                      {risk.riskLevel.toUpperCase()}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {risk.confidence}% confidence
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Risk Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Impact</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={risk.impact * 10} className="h-2 flex-1" />
                        <span className="text-sm font-semibold">{risk.impact}/10</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Likelihood</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={risk.likelihood * 10} className="h-2 flex-1" />
                        <span className="text-sm font-semibold">{risk.likelihood}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span>AI Analysis</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">{risk.aiReasoning}</p>
                  </div>

                  {/* Historical Data */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span>Historical Context</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">{risk.historicalData}</p>
                  </div>

                  {/* Mitigation */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>Recommended Mitigation</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <span>Code Quality</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {analysisData.technicalIndicators.codeQuality}
                  </div>
                  <Progress value={analysisData.technicalIndicators.codeQuality} className="h-3" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Test Coverage:</span>
                    <span>94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentation:</span>
                    <span>87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Complexity:</span>
                    <span>Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Security Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {analysisData.technicalIndicators.securityScore}
                  </div>
                  <Progress value={analysisData.technicalIndicators.securityScore} className="h-3" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vulnerabilities:</span>
                    <span>2 Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Controls:</span>
                    <span>Secure</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upgradability:</span>
                    <span>Safe</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span>Architecture</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {analysisData.technicalIndicators.architectureRating}
                  </div>
                  <Progress value={analysisData.technicalIndicators.architectureRating} className="h-3" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Modularity:</span>
                    <span>Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scalability:</span>
                    <span>Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Efficiency:</span>
                    <span>Optimized</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {analysisData.socialMetrics.communityEngagement}
                  </div>
                  <Progress value={analysisData.socialMetrics.communityEngagement} className="h-3" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Discord Members:</span>
                    <span>12,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Twitter Followers:</span>
                    <span>23,100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement Rate:</span>
                    <span>4.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span>Development</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {analysisData.socialMetrics.developerActivity}
                  </div>
                  <Progress value={analysisData.socialMetrics.developerActivity} className="h-3" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>GitHub Commits:</span>
                    <span>247/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contributors:</span>
                    <span>12 active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Issues Resolved:</span>
                    <span>89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Media Presence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {analysisData.socialMetrics.mediaPresence}
                  </div>
                  <Progress value={analysisData.socialMetrics.mediaPresence} className="h-3" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>News Articles:</span>
                    <span>18 this month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Podcast Mentions:</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentiment:</span>
                    <span>Positive</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(analysisData.predictions).map(([term, prediction]) => (
              <Card key={term} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>{term.charAt(0).toUpperCase() + term.slice(0, -4)} Term</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Timeframe</div>
                      <div className="font-semibold">{prediction.timeframe}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">AI Prediction</div>
                      <p className="text-sm">{prediction.prediction}</p>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Confidence Level</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={prediction.confidence} className="h-2 flex-1" />
                        <span className="text-sm font-semibold">{prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Analysis Metadata */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            Analysis completed on {new Date(analysisData.analysisTimestamp).toLocaleString()} • 
            Model: {analysisData.modelVersion} • 
            Data points: {analysisData.dataPoints.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}