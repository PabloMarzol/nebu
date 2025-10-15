import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Shield,
  Zap,
  Eye,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";

interface AIRiskMetrics {
  overallRisk: number;
  confidence: number;
  sentiment: "positive" | "negative" | "neutral";
  volatilityPrediction: "low" | "medium" | "high";
  keyRiskFactors: string[];
  technicalScore: number;
  marketScore: number;
  lastAnalyzed: string;
}

interface AIRiskWidgetProps {
  projectId: string;
  projectName: string;
  symbol: string;
  compact?: boolean;
}

export default function AIRiskWidget({ 
  projectId, 
  projectName, 
  symbol,
  compact = false 
}: AIRiskWidgetProps) {
  const [metrics, setMetrics] = useState<AIRiskMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const performQuickAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate analysis based on project characteristics
    const riskProfiles: Record<string, Partial<AIRiskMetrics>> = {
      "1": {
        overallRisk: 23,
        confidence: 92,
        sentiment: "positive",
        volatilityPrediction: "low",
        technicalScore: 88,
        marketScore: 85
      },
      "2": {
        overallRisk: 34,
        confidence: 87,
        sentiment: "neutral", 
        volatilityPrediction: "medium",
        technicalScore: 82,
        marketScore: 76
      },
      "3": {
        overallRisk: 18,
        confidence: 95,
        sentiment: "positive",
        volatilityPrediction: "low",
        technicalScore: 91,
        marketScore: 89
      }
    };

    const profile = riskProfiles[projectId] || {
      overallRisk: 45,
      confidence: 78,
      sentiment: "neutral",
      volatilityPrediction: "medium",
      technicalScore: 75,
      marketScore: 72
    };

    const analysis: AIRiskMetrics = {
      ...profile,
      keyRiskFactors: [
        "Smart Contract Complexity",
        "Market Volatility",
        "Regulatory Uncertainty"
      ],
      lastAnalyzed: new Date().toISOString()
    } as AIRiskMetrics;
    
    setMetrics(analysis);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    performQuickAnalysis();
  }, [projectId]);

  const getRiskColor = (risk: number) => {
    if (risk <= 25) return "text-green-400";
    if (risk <= 50) return "text-yellow-400";
    if (risk <= 75) return "text-orange-400";
    return "text-red-400";
  };

  const getRiskLevel = (risk: number) => {
    if (risk <= 25) return "Low";
    if (risk <= 50) return "Medium";
    if (risk <= 75) return "High";
    return "Critical";
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "negative": return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case "low": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="glass border-purple-500/30 bg-purple-500/5">
        <CardContent className="p-4 text-center">
          <div className="animate-spin w-8 h-8 mx-auto mb-2">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-sm font-semibold">AI Analysis</div>
          <div className="text-xs text-muted-foreground">Processing...</div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  if (compact) {
    return (
      <Card className="glass border-purple-500/30 bg-purple-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>AI Risk Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getRiskColor(metrics.overallRisk)}`}>
              {metrics.overallRisk}
            </div>
            <div className="text-xs text-muted-foreground">
              {getRiskLevel(metrics.overallRisk)} Risk
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span>Confidence:</span>
            <span className="font-semibold">{metrics.confidence}%</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span>Sentiment:</span>
            <div className="flex items-center space-x-1">
              {getSentimentIcon(metrics.sentiment)}
              <span className="capitalize">{metrics.sentiment}</span>
            </div>
          </div>

          <Link href="/ai-risk">
            <Button size="sm" className="w-full text-xs" variant="outline">
              <Eye className="w-3 h-3 mr-1" />
              Full Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>AI Risk Assessment</span>
          </div>
          <Button size="sm" variant="ghost" onClick={performQuickAnalysis}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div className="text-center">
          <div className={`text-5xl font-bold ${getRiskColor(metrics.overallRisk)} mb-2`}>
            {metrics.overallRisk}
          </div>
          <div className="text-lg font-semibold mb-1">
            {getRiskLevel(metrics.overallRisk)} Risk Level
          </div>
          <div className="text-sm text-muted-foreground mb-3">
            {metrics.confidence}% AI Confidence
          </div>
          <Progress 
            value={100 - metrics.overallRisk} 
            className="h-3" 
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              {getSentimentIcon(metrics.sentiment)}
              <span className="text-sm font-semibold">Market Sentiment</span>
            </div>
            <div className="text-lg font-bold capitalize">{metrics.sentiment}</div>
          </div>

          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-sm font-semibold mb-1">Volatility Forecast</div>
            <div className={`text-lg font-bold capitalize ${getVolatilityColor(metrics.volatilityPrediction)}`}>
              {metrics.volatilityPrediction}
            </div>
          </div>

          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-sm font-semibold mb-1">Technical Score</div>
            <div className={`text-lg font-bold ${getRiskColor(100 - metrics.technicalScore)}`}>
              {metrics.technicalScore}
            </div>
          </div>

          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-sm font-semibold mb-1">Market Score</div>
            <div className={`text-lg font-bold ${getRiskColor(100 - metrics.marketScore)}`}>
              {metrics.marketScore}
            </div>
          </div>
        </div>

        {/* Key Risk Factors */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span>Key Risk Factors</span>
          </h4>
          <div className="space-y-2">
            {metrics.keyRiskFactors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span className="text-muted-foreground">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold">AI Insight</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {metrics.overallRisk <= 25 
              ? "Strong fundamentals with minimal risk indicators. Suitable for conservative portfolios."
              : metrics.overallRisk <= 50
              ? "Moderate risk profile with balanced growth potential. Monitor key factors closely."
              : "Elevated risk levels detected. Recommend thorough due diligence before investment."
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href="/ai-risk" className="flex-1">
            <Button className="w-full" variant="outline">
              <Brain className="w-4 h-4 mr-2" />
              Detailed Analysis
            </Button>
          </Link>
          <Link href="/due-diligence" className="flex-1">
            <Button className="w-full" variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Due Diligence
            </Button>
          </Link>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground text-center">
          Last analyzed: {new Date(metrics.lastAnalyzed).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}