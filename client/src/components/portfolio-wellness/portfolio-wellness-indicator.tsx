import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  PieChart, 
  Activity,
  Lightbulb,
  Target,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';

interface PortfolioWellness {
  overallScore: number;
  diversificationScore: number;
  riskScore: number;
  performanceScore: number;
  volatilityScore: number;
  recommendations: string[];
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  healthStatus: 'excellent' | 'good' | 'needs_attention' | 'critical';
  improvements: string[];
  nextReview: Date;
}

interface WellnessMetric {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
  improvement?: string;
}

interface RiskAnalysis {
  category: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: number;
  mitigation: string;
}

const PortfolioWellnessIndicator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Mock portfolio wellness data
  const [wellnessData] = useState<PortfolioWellness>({
    overallScore: 78.5,
    diversificationScore: 82.3,
    riskScore: 75.8,
    performanceScore: 71.2,
    volatilityScore: 85.6,
    recommendations: [
      'Consider reducing Bitcoin allocation from 45% to 35% for better diversification',
      'Add DeFi tokens to capture yield opportunities',
      'Implement stop-loss orders for high-volatility positions',
      'Rebalance portfolio quarterly to maintain target allocations'
    ],
    riskLevel: 'moderate',
    healthStatus: 'good',
    improvements: [
      'Increase stablecoin allocation during market uncertainty',
      'Diversify across different blockchain ecosystems',
      'Consider dollar-cost averaging for major positions'
    ],
    nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
  });

  const [wellnessMetrics] = useState<WellnessMetric[]>([
    {
      name: 'Portfolio Diversification',
      score: 82.3,
      status: 'good',
      description: 'Your portfolio is well-diversified across major cryptocurrencies',
      improvement: 'Consider adding more mid-cap altcoins for enhanced diversification'
    },
    {
      name: 'Risk Management',
      score: 75.8,
      status: 'good',
      description: 'Risk exposure is within acceptable limits for your profile',
      improvement: 'Implement automated stop-loss orders for better downside protection'
    },
    {
      name: 'Performance Tracking',
      score: 71.2,
      status: 'warning',
      description: 'Portfolio performance is slightly below market average',
      improvement: 'Review underperforming assets and consider reallocation'
    },
    {
      name: 'Volatility Control',
      score: 85.6,
      status: 'excellent',
      description: 'Volatility is well-managed with appropriate position sizing'
    }
  ]);

  const [riskAnalysis] = useState<RiskAnalysis[]>([
    {
      category: 'Concentration Risk',
      level: 'medium',
      description: 'Bitcoin represents 45% of your portfolio',
      impact: 7.2,
      mitigation: 'Reduce Bitcoin allocation to 35% and diversify into other large-cap cryptocurrencies'
    },
    {
      category: 'Market Correlation',
      level: 'high',
      description: 'High correlation between major holdings during market downturns',
      impact: 8.1,
      mitigation: 'Add uncorrelated assets like gold-backed tokens or real estate tokens'
    },
    {
      category: 'Liquidity Risk',
      level: 'low',
      description: 'Most holdings are in highly liquid assets',
      impact: 2.8,
      mitigation: 'Maintain current allocation to liquid assets'
    },
    {
      category: 'Technology Risk',
      level: 'medium',
      description: 'Heavy exposure to Ethereum ecosystem smart contract risks',
      impact: 6.5,
      mitigation: 'Diversify across multiple blockchain networks (Solana, Avalanche, Polygon)'
    }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-yellow-500 to-amber-500';
    if (score >= 50) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-green-500 to-emerald-500';
      case 'good': return 'from-blue-500 to-cyan-500';
      case 'needs_attention': return 'from-yellow-500 to-orange-500';
      case 'critical': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Portfolio Wellness Indicator
            </h2>
            <p className="text-gray-400">Comprehensive health analysis and personalized recommendations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`bg-gradient-to-r ${getHealthStatusColor(wellnessData.healthStatus)} text-white capitalize`}>
            {wellnessData.healthStatus.replace('_', ' ')}
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            {wellnessData.riskLevel} Risk
          </Badge>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-black/20 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getScoreColor(wellnessData.overallScore)}`}>
                        {wellnessData.overallScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Overall Wellness Score</h3>
                  <p className="text-gray-400">Your portfolio health is rated as <span className="capitalize font-semibold">{wellnessData.healthStatus.replace('_', ' ')}</span></p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Next review: {wellnessData.nextReview.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button onClick={() => setShowRecommendations(!showRecommendations)} variant="outline" size="sm">
                {showRecommendations ? 'Hide' : 'Show'} Recommendations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Recommendations Alert */}
      {showRecommendations && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            <strong>Quick Action:</strong> {wellnessData.recommendations[0]}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-black/20 border-green-500/20">
              <CardContent className="p-4 text-center">
                <PieChart className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(wellnessData.diversificationScore)}`}>
                  {wellnessData.diversificationScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Diversification</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(wellnessData.riskScore)}`}>
                  {wellnessData.riskScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Risk Management</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(wellnessData.performanceScore)}`}>
                  {wellnessData.performanceScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Performance</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-orange-500/20">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getScoreColor(wellnessData.volatilityScore)}`}>
                  {wellnessData.volatilityScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Volatility Control</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Wellness Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Diversification', score: wellnessData.diversificationScore, icon: PieChart },
                { name: 'Risk Management', score: wellnessData.riskScore, icon: Shield },
                { name: 'Performance', score: wellnessData.performanceScore, icon: TrendingUp },
                { name: 'Volatility Control', score: wellnessData.volatilityScore, icon: BarChart3 }
              ].map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{metric.name}</span>
                    </div>
                    <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                      {metric.score.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metric.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wellnessMetrics.map((metric, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(metric.status)}
                      <span className={`font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score.toFixed(1)}%
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={metric.score} className="h-3" />
                  <p className="text-gray-300 text-sm">{metric.description}</p>
                  {metric.improvement && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-blue-300 font-semibold text-sm mb-1">Improvement Tip</div>
                          <div className="text-blue-200 text-sm">{metric.improvement}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="space-y-4">
            {riskAnalysis.map((risk, index) => (
              <Card key={index} className="bg-black/20 border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{risk.category}</h3>
                        <Badge className={getRiskLevelColor(risk.level)}>
                          {risk.level} Risk
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{risk.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-semibold">{risk.impact.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-400">Impact Score</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-green-400 mt-0.5" />
                      <div>
                        <div className="text-green-300 font-semibold text-sm mb-1">Mitigation Strategy</div>
                        <div className="text-green-200 text-sm">{risk.mitigation}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black/20 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Immediate Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {wellnessData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-green-200 text-sm">{rec}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <span>Long-term Improvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {wellnessData.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-200 text-sm">{improvement}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Scheduled Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Your next portfolio wellness review is scheduled for {wellnessData.nextReview.toLocaleDateString()}.
                We'll analyze any changes in your holdings and market conditions to provide updated recommendations.
              </p>
              <div className="flex space-x-3">
                <Button className="flex-1">Schedule Early Review</Button>
                <Button variant="outline" className="flex-1">Auto-Optimize Portfolio</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioWellnessIndicator;