import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Brain,
  BarChart3,
  PieChart,
  Eye,
  Search,
  Calculator,
  Clock,
  Users,
  DollarSign,
  Award,
  Gamepad2,
  Star
} from "lucide-react";

interface RiskMetric {
  name: string;
  value: number;
  weight: number;
  description: string;
  impact: "positive" | "negative" | "neutral";
}

interface TokenRiskProfile {
  symbol: string;
  name: string;
  overallRisk: number;
  riskGrade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";
  metrics: RiskMetric[];
  marketData: {
    price: number;
    change24h: number;
    volume: string;
    marketCap: string;
    circulatingSupply: string;
  };
  technicalAnalysis: {
    volatility: number;
    liquidity: number;
    correlation: number;
    momentum: number;
  };
  fundamentals: {
    teamScore: number;
    technologyScore: number;
    adoptionScore: number;
    complianceScore: number;
  };
}

interface GameScenario {
  id: string;
  title: string;
  description: string;
  impact: number;
  probability: number;
  category: "market" | "regulatory" | "technical" | "adoption";
}

export default function InteractiveRiskEvaluator() {
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [customWeights, setCustomWeights] = useState({
    volatility: 25,
    liquidity: 20,
    fundamentals: 30,
    market: 25
  });
  const [gameMode, setGameMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [userScore, setUserScore] = useState(0);

  const tokenData: TokenRiskProfile = {
    symbol: "BTC",
    name: "Bitcoin",
    overallRisk: 68,
    riskGrade: "B+",
    metrics: [
      {
        name: "Volatility Risk",
        value: 72,
        weight: 25,
        description: "Price fluctuation over time periods",
        impact: "negative"
      },
      {
        name: "Liquidity Risk",
        value: 15,
        weight: 20,
        description: "Ease of buying/selling without price impact",
        impact: "negative"
      },
      {
        name: "Regulatory Risk",
        value: 45,
        weight: 15,
        description: "Potential regulatory changes impact",
        impact: "negative"
      },
      {
        name: "Technology Risk",
        value: 25,
        weight: 20,
        description: "Technical vulnerabilities and upgrades",
        impact: "negative"
      },
      {
        name: "Adoption Score",
        value: 88,
        weight: 20,
        description: "Market acceptance and usage growth",
        impact: "positive"
      }
    ],
    marketData: {
      price: 43250,
      change24h: 2.3,
      volume: "$18.5B",
      marketCap: "$845B",
      circulatingSupply: "19.5M BTC"
    },
    technicalAnalysis: {
      volatility: 72,
      liquidity: 85,
      correlation: 1.0,
      momentum: 68
    },
    fundamentals: {
      teamScore: 95,
      technologyScore: 92,
      adoptionScore: 88,
      complianceScore: 75
    }
  };

  const gameScenarios: GameScenario[] = [
    {
      id: "1",
      title: "Major Exchange Hack",
      description: "A top-3 exchange suffers security breach affecting market confidence",
      impact: -15,
      probability: 12,
      category: "technical"
    },
    {
      id: "2",
      title: "Regulatory Crackdown",
      description: "Major economy implements strict crypto regulations",
      impact: -25,
      probability: 35,
      category: "regulatory"
    },
    {
      id: "3",
      title: "Institutional Adoption",
      description: "Fortune 500 company adds crypto to treasury",
      impact: +20,
      probability: 45,
      category: "adoption"
    },
    {
      id: "4",
      title: "Market Crash",
      description: "Traditional markets crash 20%, affecting crypto correlation",
      impact: -30,
      probability: 25,
      category: "market"
    },
    {
      id: "5",
      title: "Technical Breakthrough",
      description: "Major scalability or efficiency improvement announced",
      impact: +18,
      probability: 30,
      category: "technical"
    }
  ];

  const calculateAdjustedRisk = () => {
    const baseRisk = tokenData.overallRisk;
    const scenarioImpact = selectedScenarios.reduce((total, scenarioId) => {
      const scenario = gameScenarios.find(s => s.id === scenarioId);
      return total + (scenario ? scenario.impact : 0);
    }, 0);
    
    return Math.max(0, Math.min(100, baseRisk + scenarioImpact));
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return "text-green-400 bg-green-400/10";
    if (risk <= 50) return "text-yellow-400 bg-yellow-400/10";
    if (risk <= 70) return "text-orange-400 bg-orange-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (grade.startsWith("B")) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (grade.startsWith("C")) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "market": return <TrendingUp className="w-4 h-4" />;
      case "regulatory": return <Shield className="w-4 h-4" />;
      case "technical": return <Zap className="w-4 h-4" />;
      case "adoption": return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Token Overview */}
      <Card className="glass border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {tokenData.symbol}
              </div>
              <div>
                <h2 className="text-xl font-bold">{tokenData.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getGradeColor(tokenData.riskGrade)} variant="outline">
                    Risk Grade: {tokenData.riskGrade}
                  </Badge>
                  <Badge variant="outline">${tokenData.marketData.price.toLocaleString()}</Badge>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">
                <span className={getRiskColor(calculateAdjustedRisk()).split(' ')[0]}>
                  {calculateAdjustedRisk()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
              <Progress value={calculateAdjustedRisk()} className="mt-2 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Testing</TabsTrigger>
          <TabsTrigger value="game">Risk Game</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenData.metrics.map((metric, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{metric.name}</h3>
                    <div className={`px-2 py-1 rounded text-sm ${getRiskColor(metric.value)}`}>
                      {metric.value}
                    </div>
                  </div>
                  
                  <Progress value={metric.value} className="mb-3" />
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {metric.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Weight: {metric.weight}%</span>
                    <div className={`flex items-center space-x-1 ${
                      metric.impact === "positive" ? "text-green-400" : 
                      metric.impact === "negative" ? "text-red-400" : "text-gray-400"
                    }`}>
                      {metric.impact === "positive" ? <TrendingUp className="w-3 h-3" /> : 
                       metric.impact === "negative" ? <TrendingDown className="w-3 h-3" /> :
                       <Activity className="w-3 h-3" />}
                      <span>{metric.impact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <span>Technical Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(tokenData.technicalAnalysis).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{key}:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{value}%</span>
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-400" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-green-400" />
                  <span>Fundamentals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(tokenData.fundamentals).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{key.replace('Score', '')}:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{value}%</span>
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-400" />
                <span>Scenario Impact Testing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {gameScenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedScenarios.includes(scenario.id)
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => toggleScenario(scenario.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(scenario.category)}
                        <h4 className="font-semibold">{scenario.title}</h4>
                      </div>
                      <div className={`text-sm font-bold ${
                        scenario.impact > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {scenario.impact > 0 ? '+' : ''}{scenario.impact}%
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {scenario.description}
                    </p>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Probability: {scenario.probability}%
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {selectedScenarios.length > 0 && (
                <Card className="border-orange-500/30 bg-orange-500/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Scenario Impact Summary</h4>
                    <div className="flex items-center justify-between">
                      <span>Adjusted Risk Score:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">{tokenData.overallRisk}</span>
                        <span>→</span>
                        <span className={`font-bold ${getRiskColor(calculateAdjustedRisk()).split(' ')[0]}`}>
                          {calculateAdjustedRisk()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="game" className="space-y-6">
          <Card className="glass border-pink-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="w-6 h-6 text-pink-400" />
                  <span>Risk Assessment Game</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">{userScore}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold mb-2">Risk Assessment Challenge</h3>
                <p className="text-muted-foreground mb-6">
                  Test your risk evaluation skills with real market scenarios
                </p>
                <Button 
                  onClick={() => setGameMode(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}