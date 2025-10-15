import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Shield, DollarSign, BarChart3, Zap } from 'lucide-react';

interface RiskMetrics {
  portfolioValue: number;
  volatilityScore: number;
  diversificationScore: number;
  liquidityRisk: number;
  marketExposure: number;
  overallRisk: 'low' | 'medium' | 'high' | 'extreme';
  riskPercentile: number;
}

interface RiskFactor {
  name: string;
  value: number;
  status: 'safe' | 'caution' | 'danger';
  description: string;
  icon: React.ReactNode;
}

export default function RiskAssessment() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const generateRiskAssessment = (): RiskMetrics => {
    // Simulate realistic risk assessment
    const portfolioValue = Math.random() * 50000 + 5000;
    const volatilityScore = Math.random() * 100;
    const diversificationScore = Math.random() * 100;
    const liquidityRisk = Math.random() * 100;
    const marketExposure = Math.random() * 100;
    
    const avgRisk = (volatilityScore + (100 - diversificationScore) + liquidityRisk + marketExposure) / 4;
    
    let overallRisk: 'low' | 'medium' | 'high' | 'extreme';
    if (avgRisk < 25) overallRisk = 'low';
    else if (avgRisk < 50) overallRisk = 'medium';
    else if (avgRisk < 75) overallRisk = 'high';
    else overallRisk = 'extreme';

    return {
      portfolioValue,
      volatilityScore,
      diversificationScore,
      liquidityRisk,
      marketExposure,
      overallRisk,
      riskPercentile: Math.floor(avgRisk)
    };
  };

  const handleOneClickAssessment = async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setAnimationProgress(0);

    // Animated progress simulation
    const progressInterval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate analysis time
    setTimeout(() => {
      const assessment = generateRiskAssessment();
      setRiskMetrics(assessment);
      setIsAnalyzing(false);
      setShowResults(true);
      clearInterval(progressInterval);
      setAnimationProgress(100);
    }, 3000);
  };

  const getRiskFactors = (metrics: RiskMetrics): RiskFactor[] => {
    return [
      {
        name: 'Volatility Risk',
        value: metrics.volatilityScore,
        status: metrics.volatilityScore > 70 ? 'danger' : metrics.volatilityScore > 40 ? 'caution' : 'safe',
        description: 'How much your portfolio value swings up and down',
        icon: <BarChart3 className="w-4 h-4" />
      },
      {
        name: 'Diversification',
        value: metrics.diversificationScore,
        status: metrics.diversificationScore < 30 ? 'danger' : metrics.diversificationScore < 60 ? 'caution' : 'safe',
        description: 'How spread out your investments are across different assets',
        icon: <Shield className="w-4 h-4" />
      },
      {
        name: 'Liquidity Risk',
        value: metrics.liquidityRisk,
        status: metrics.liquidityRisk > 70 ? 'danger' : metrics.liquidityRisk > 40 ? 'caution' : 'safe',
        description: 'How easily you can convert your assets to cash',
        icon: <DollarSign className="w-4 h-4" />
      },
      {
        name: 'Market Exposure',
        value: metrics.marketExposure,
        status: metrics.marketExposure > 80 ? 'danger' : metrics.marketExposure > 50 ? 'caution' : 'safe',
        description: 'How much overall market movements affect your portfolio',
        icon: <TrendingUp className="w-4 h-4" />
      }
    ];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'extreme': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400 border-green-500/30';
      case 'caution': return 'text-yellow-400 border-yellow-500/30';
      case 'danger': return 'text-red-400 border-red-500/30';
      default: return 'text-gray-400 border-gray-500/30';
    }
  };

  const recommendations = riskMetrics ? [
    {
      title: 'Immediate Actions',
      items: riskMetrics.overallRisk === 'extreme' ? [
        'Consider reducing position sizes',
        'Diversify across more asset classes',
        'Set stop-loss orders'
      ] : riskMetrics.overallRisk === 'high' ? [
        'Review your risk tolerance',
        'Consider taking some profits',
        'Monitor positions closely'
      ] : [
        'Your risk level looks manageable',
        'Continue monitoring regularly',
        'Consider gradual position increases'
      ]
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* One-Click Assessment Button */}
      <Card className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 border-blue-500/30">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-3">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">One-Click Risk Assessment</h3>
            <p className="text-gray-400">Get instant insights into your portfolio risk profile</p>
          </div>
          
          {!isAnalyzing && !showResults && (
            <Button 
              onClick={handleOneClickAssessment}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Analyze My Risk Now
            </Button>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="text-blue-400 font-semibold">Analyzing your portfolio...</div>
              <Progress value={animationProgress} className="w-full max-w-md mx-auto" />
              <div className="text-sm text-gray-400">
                {animationProgress < 30 ? 'Gathering portfolio data...' :
                 animationProgress < 60 ? 'Calculating risk metrics...' :
                 animationProgress < 90 ? 'Analyzing market conditions...' :
                 'Finalizing assessment...'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment Results */}
      {showResults && riskMetrics && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Overall Risk Score */}
          <Card className="bg-gradient-to-br from-gray-900/40 to-black/40 border-gray-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-white">Risk Assessment Results</span>
                <Badge className={`px-3 py-1 ${getRiskColor(riskMetrics.overallRisk)}`}>
                  {riskMetrics.overallRisk.toUpperCase()} RISK
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {riskMetrics.riskPercentile}%
                  </div>
                  <div className="text-gray-400 mb-4">Risk Percentile</div>
                  <div className="text-sm text-gray-300">
                    Your portfolio is riskier than {100 - riskMetrics.riskPercentile}% of similar investors
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    ${riskMetrics.portfolioValue.toLocaleString()}
                  </div>
                  <div className="text-gray-400 mb-4">Portfolio Value</div>
                  <div className="text-sm text-gray-300">
                    Based on current market valuations
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors Breakdown */}
          <Card className="bg-gradient-to-br from-gray-900/40 to-black/40 border-gray-500/20">
            <CardHeader>
              <CardTitle className="text-white">Risk Factors Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRiskFactors(riskMetrics).map((factor, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getStatusColor(factor.status)} bg-black/20`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {factor.icon}
                        <span className="font-semibold text-white">{factor.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${getStatusColor(factor.status)}`}>
                        {factor.value.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          factor.status === 'safe' ? 'bg-green-500' :
                          factor.status === 'caution' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">{factor.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.map((section, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold text-purple-400 mb-2">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center">
            <Button 
              onClick={() => {
                setShowResults(false);
                setRiskMetrics(null);
              }}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              Run New Assessment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}