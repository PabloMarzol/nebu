import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Star,
  Eye,
  Heart,
  Clock,
  DollarSign,
  Shield,
  Zap,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Activity,
  Filter,
  RefreshCw,
  Bookmark,
  Save
} from "lucide-react";

interface UserProfile {
  id: string;
  riskTolerance: number; // 1-100
  preferredCategories: string[];
  tradingFrequency: "low" | "medium" | "high";
  averageInvestment: number;
  successRate: number;
  learningStyle: "research" | "social" | "technical";
  timeHorizon: "short" | "medium" | "long";
  experienceLevel: number; // 1-100
  behaviorPatterns: {
    prefersNewProjects: boolean;
    followsTrends: boolean;
    valueFocused: boolean;
    riskAverse: boolean;
  };
}

interface PersonalizedRecommendation {
  id: string;
  tokenName: string;
  symbol: string;
  category: string;
  price: number;
  change24h: number;
  marketCap: string;
  aiScore: number;
  personalizedScore: number;
  matchReasons: string[];
  riskLevel: "Low" | "Medium" | "High";
  recommendationType: "trending" | "ai-pick" | "similar-users" | "portfolio-balance" | "learning-opportunity";
  confidenceLevel: number;
  expectedTimeframe: string;
  keyMetrics: {
    growth: number;
    stability: number;
    innovation: number;
    community: number;
  };
  userContext: {
    similarityScore: number;
    portfolioFit: number;
    riskAlignment: number;
    categoryMatch: number;
  };
}

interface BehaviorInsight {
  type: "preference" | "pattern" | "risk" | "timing";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestion?: string;
}

export default function PersonalizedRecommendationEngine() {
  const [selectedTab, setSelectedTab] = useState("recommendations");
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile] = useState<UserProfile>({
    id: "user-1",
    riskTolerance: 65,
    preferredCategories: ["DeFi", "AI/ML", "Gaming"],
    tradingFrequency: "medium",
    averageInvestment: 2500,
    successRate: 73,
    learningStyle: "research",
    timeHorizon: "medium",
    experienceLevel: 75,
    behaviorPatterns: {
      prefersNewProjects: true,
      followsTrends: false,
      valueFocused: true,
      riskAverse: false
    }
  });

  const recommendations: PersonalizedRecommendation[] = [
    {
      id: "1",
      tokenName: "Neural Finance Protocol",
      symbol: "NFP",
      category: "AI/ML",
      price: 1.24,
      change24h: 8.7,
      marketCap: "$45M",
      aiScore: 92,
      personalizedScore: 94,
      matchReasons: [
        "Matches your AI/ML preference",
        "Aligned with your risk tolerance",
        "Similar users had 89% success rate",
        "Strong technical fundamentals"
      ],
      riskLevel: "Medium",
      recommendationType: "ai-pick",
      confidenceLevel: 94,
      expectedTimeframe: "3-6 months",
      keyMetrics: {
        growth: 88,
        stability: 72,
        innovation: 95,
        community: 84
      },
      userContext: {
        similarityScore: 91,
        portfolioFit: 87,
        riskAlignment: 89,
        categoryMatch: 100
      }
    },
    {
      id: "2",
      tokenName: "GameVerse Token",
      symbol: "GVT",
      category: "Gaming",
      price: 0.89,
      change24h: 12.3,
      marketCap: "$128M",
      aiScore: 87,
      personalizedScore: 89,
      matchReasons: [
        "Gaming sector momentum",
        "Early-stage opportunity",
        "Strong community growth",
        "Matches your investment size"
      ],
      riskLevel: "Medium",
      recommendationType: "trending",
      confidenceLevel: 89,
      expectedTimeframe: "6-12 months",
      keyMetrics: {
        growth: 92,
        stability: 68,
        innovation: 86,
        community: 94
      },
      userContext: {
        similarityScore: 85,
        portfolioFit: 83,
        riskAlignment: 78,
        categoryMatch: 95
      }
    },
    {
      id: "3",
      tokenName: "Quantum Yield",
      symbol: "QY",
      category: "DeFi",
      price: 3.45,
      change24h: -2.1,
      marketCap: "$89M",
      aiScore: 85,
      personalizedScore: 87,
      matchReasons: [
        "DeFi category preference",
        "Value opportunity (temporary dip)",
        "High yield potential",
        "Strong fundamentals"
      ],
      riskLevel: "Medium",
      recommendationType: "portfolio-balance",
      confidenceLevel: 87,
      expectedTimeframe: "2-4 months",
      keyMetrics: {
        growth: 79,
        stability: 88,
        innovation: 82,
        community: 78
      },
      userContext: {
        similarityScore: 82,
        portfolioFit: 92,
        riskAlignment: 85,
        categoryMatch: 100
      }
    },
    {
      id: "4",
      tokenName: "EcoChain",
      symbol: "ECO",
      category: "Green Energy",
      price: 0.67,
      change24h: 5.4,
      marketCap: "$34M",
      aiScore: 78,
      personalizedScore: 82,
      matchReasons: [
        "Emerging category opportunity",
        "ESG investment trend",
        "Early adoption advantage",
        "Growing institutional interest"
      ],
      riskLevel: "High",
      recommendationType: "learning-opportunity",
      confidenceLevel: 82,
      expectedTimeframe: "12+ months",
      keyMetrics: {
        growth: 85,
        stability: 58,
        innovation: 91,
        community: 71
      },
      userContext: {
        similarityScore: 74,
        portfolioFit: 68,
        riskAlignment: 72,
        categoryMatch: 60
      }
    }
  ];

  const behaviorInsights: BehaviorInsight[] = [
    {
      type: "preference",
      title: "AI/ML Focus Detected",
      description: "You consistently show interest in AI and machine learning projects, with 67% of your views in this category.",
      confidence: 89,
      actionable: true,
      suggestion: "Consider diversifying with 20% allocation to AI tokens for optimal growth potential."
    },
    {
      type: "pattern",
      title: "Research-Driven Approach",
      description: "Your behavior indicates thorough research before investment decisions, spending average 24 minutes per project.",
      confidence: 94,
      actionable: false
    },
    {
      type: "risk",
      title: "Moderate Risk Appetite",
      description: "Your portfolio choices suggest comfort with medium-risk investments but avoidance of high-risk speculative plays.",
      confidence: 87,
      actionable: true,
      suggestion: "Consider adding one high-risk, high-reward position (5-10% allocation) for portfolio optimization."
    },
    {
      type: "timing",
      title: "Patient Investment Style",
      description: "You typically hold positions for 3-6 months, indicating a medium-term investment strategy.",
      confidence: 91,
      actionable: false
    }
  ];

  const refreshRecommendations = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case "ai-pick": return <Brain className="w-4 h-4 text-purple-400" />;
      case "trending": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "similar-users": return <Users className="w-4 h-4 text-blue-400" />;
      case "portfolio-balance": return <Target className="w-4 h-4 text-orange-400" />;
      case "learning-opportunity": return <Sparkles className="w-4 h-4 text-pink-400" />;
      default: return <Star className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getRecommendationTypeLabel = (type: string) => {
    switch (type) {
      case "ai-pick": return "AI Pick";
      case "trending": return "Trending";
      case "similar-users": return "Community Choice";
      case "portfolio-balance": return "Portfolio Balance";
      case "learning-opportunity": return "Learning Opportunity";
      default: return "Recommended";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-400 border-green-400 bg-green-400/10";
      case "Medium": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "High": return "text-red-400 border-red-400 bg-red-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "preference": return "text-blue-400 border-blue-400 bg-blue-400/10";
      case "pattern": return "text-green-400 border-green-400 bg-green-400/10";
      case "risk": return "text-orange-400 border-orange-400 bg-orange-400/10";
      case "timing": return "text-purple-400 border-purple-400 bg-purple-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Personalized Recommendations
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered token suggestions tailored to your preferences and behavior
        </p>
      </div>

      {/* User Profile Summary */}
      <Card className="glass border-purple-500/30 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span>Your Investment Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{userProfile.experienceLevel}</div>
              <div className="text-sm text-muted-foreground">Experience Level</div>
              <Progress value={userProfile.experienceLevel} className="mt-2 h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{userProfile.riskTolerance}</div>
              <div className="text-sm text-muted-foreground">Risk Tolerance</div>
              <Progress value={userProfile.riskTolerance} className="mt-2 h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{userProfile.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <Progress value={userProfile.successRate} className="mt-2 h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">{userProfile.preferredCategories.length}</div>
              <div className="text-sm text-muted-foreground">Preferred Categories</div>
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {userProfile.preferredCategories.slice(0, 2).map((cat, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{cat}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Smart Picks</TabsTrigger>
          <TabsTrigger value="insights">Behavior Insights</TabsTrigger>
          <TabsTrigger value="settings">Personalization</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Sort
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshRecommendations}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        {getRecommendationTypeIcon(rec.recommendationType)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.tokenName}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{rec.symbol}</Badge>
                          <Badge className={getRiskColor(rec.riskLevel)} variant="outline">
                            {rec.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">${rec.price}</div>
                      <div className={`text-sm font-semibold ${rec.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {rec.change24h >= 0 ? '+' : ''}{rec.change24h}%
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Recommendation Type */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRecommendationTypeIcon(rec.recommendationType)}
                      <span className="text-sm font-semibold">
                        {getRecommendationTypeLabel(rec.recommendationType)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-purple-400">
                      {rec.confidenceLevel}% match
                    </Badge>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Market Cap</div>
                      <div className="font-semibold">{rec.marketCap}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">AI Score</div>
                      <div className="font-semibold text-purple-400">{rec.aiScore}/100</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div className="font-semibold">{rec.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Timeframe</div>
                      <div className="font-semibold">{rec.expectedTimeframe}</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Performance Indicators</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Growth:</span>
                        <span className="font-semibold">{rec.keyMetrics.growth}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Stability:</span>
                        <span className="font-semibold">{rec.keyMetrics.stability}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Innovation:</span>
                        <span className="font-semibold">{rec.keyMetrics.innovation}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Community:</span>
                        <span className="font-semibold">{rec.keyMetrics.community}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Why this matches you:</div>
                    <div className="space-y-1">
                      {rec.matchReasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs">
                          <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1">
                      <Target className="w-4 h-4 mr-1" />
                      Add to Watchlist
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {behaviorInsights.map((insight, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getInsightColor(insight.type)} variant="outline">
                          {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                        </Badge>
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {insight.description}
                      </p>
                      
                      {insight.suggestion && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="text-sm font-semibold mb-1">Actionable Insight:</div>
                          <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {insight.confidence}%
                      </div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <Progress value={insight.confidence} className="mt-2 h-2 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Learning Progress */}
          <Card className="glass border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-green-400" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Investment Knowledge</span>
                    <span className="text-sm font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Risk Assessment Skills</span>
                    <span className="text-sm font-semibold">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Market Analysis</span>
                    <span className="text-sm font-semibold">64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-400" />
                <span>Personalization Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Tolerance */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Risk Tolerance</label>
                <Slider
                  value={[userProfile.riskTolerance]}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Typical Investment Amount</label>
                <Select defaultValue="2500">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">$500 - $1,000</SelectItem>
                    <SelectItem value="2500">$1,000 - $5,000</SelectItem>
                    <SelectItem value="7500">$5,000 - $10,000</SelectItem>
                    <SelectItem value="15000">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Horizon */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Investment Time Horizon</label>
                <Select defaultValue={userProfile.timeHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short-term (1-6 months)</SelectItem>
                    <SelectItem value="medium">Medium-term (6-18 months)</SelectItem>
                    <SelectItem value="long">Long-term (18+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notification Preferences */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Recommendation Frequency</label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}