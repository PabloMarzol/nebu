import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Star, 
  Brain,
  User,
  BarChart3,
  Shield,
  Zap,
  Heart,
  Filter,
  RefreshCw,
  Eye,
  DollarSign,
  Clock,
  Users,
  Award
} from "lucide-react";

interface UserProfile {
  riskTolerance: "conservative" | "moderate" | "aggressive";
  investmentHorizon: "short" | "medium" | "long";
  preferredCategories: string[];
  investmentAmount: number;
  tradingFrequency: "low" | "medium" | "high";
  experienceLevel: "beginner" | "intermediate" | "expert";
  portfolioValue: number;
  previousInvestments: string[];
}

interface TokenRecommendation {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  category: string;
  currentPrice: number;
  marketCap: string;
  matchScore: number;
  confidenceLevel: number;
  riskLevel: "low" | "medium" | "high";
  expectedReturn: string;
  timeToTarget: string;
  reasonsToInvest: string[];
  potentialConcerns: string[];
  allocationSuggestion: number;
  launchStatus: "live" | "upcoming" | "completed";
  launchDate?: string;
  personalizedInsights: string;
  similarityToPortfolio: number;
}

interface RecommendationEngineProps {
  userId?: string;
  maxRecommendations?: number;
}

export default function RecommendationEngine({ 
  userId = "user123", 
  maxRecommendations = 6 
}: RecommendationEngineProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<TokenRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Simulated user profile - would come from user preferences/behavior analysis
  const mockUserProfile: UserProfile = {
    riskTolerance: "moderate",
    investmentHorizon: "medium",
    preferredCategories: ["DeFi", "AI/ML", "Healthcare"],
    investmentAmount: 5000,
    tradingFrequency: "medium",
    experienceLevel: "intermediate",
    portfolioValue: 25000,
    previousInvestments: ["DeFiChain Protocol", "HealthChain", "AI Computing Chain"]
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockRecommendations: TokenRecommendation[] = [
      {
        id: "rec-1",
        name: "SolarCoin",
        symbol: "SLR",
        logo: "☀️",
        category: "Green Energy",
        currentPrice: 0.25,
        marketCap: "$67M",
        matchScore: 94,
        confidenceLevel: 92,
        riskLevel: "low",
        expectedReturn: "120-180%",
        timeToTarget: "6-12 months",
        reasonsToInvest: [
          "Strong alignment with ESG trends",
          "Growing renewable energy sector",
          "Solid technical fundamentals",
          "Active development team"
        ],
        potentialConcerns: [
          "Regulatory dependency on green policies",
          "Technology adoption timeline"
        ],
        allocationSuggestion: 15,
        launchStatus: "upcoming",
        launchDate: "2024-12-20",
        personalizedInsights: "Matches your preference for sustainable investments and moderate risk tolerance. Similar growth pattern to your successful HealthChain investment.",
        similarityToPortfolio: 78
      },
      {
        id: "rec-2",
        name: "GameVerse Token",
        symbol: "GVT",
        logo: "🎮",
        category: "Gaming",
        currentPrice: 0.42,
        marketCap: "$89M",
        matchScore: 87,
        confidenceLevel: 85,
        riskLevel: "medium",
        expectedReturn: "80-150%",
        timeToTarget: "4-8 months",
        reasonsToInvest: [
          "Explosive gaming market growth",
          "Strong community engagement",
          "Innovative gameplay mechanics",
          "Partnership with major studios"
        ],
        potentialConcerns: [
          "High market competition",
          "User retention challenges"
        ],
        allocationSuggestion: 12,
        launchStatus: "live",
        personalizedInsights: "Gaming sector complements your DeFi holdings. Your trading frequency suggests comfort with this volatility level.",
        similarityToPortfolio: 62
      },
      {
        id: "rec-3",
        name: "DeepMind Finance",
        symbol: "DMF",
        logo: "🧠",
        category: "AI/ML",
        currentPrice: 1.85,
        marketCap: "$234M",
        matchScore: 91,
        confidenceLevel: 89,
        riskLevel: "medium",
        expectedReturn: "100-200%",
        timeToTarget: "8-15 months",
        reasonsToInvest: [
          "AI revolution in financial services",
          "Experienced team from Google AI",
          "Multiple revenue streams",
          "Strong patent portfolio"
        ],
        potentialConcerns: [
          "Technical complexity risks",
          "Regulatory uncertainty in AI"
        ],
        allocationSuggestion: 18,
        launchStatus: "upcoming",
        launchDate: "2024-12-25",
        personalizedInsights: "Perfect match for your AI/ML category preference. Similar to your successful AI Computing Chain investment but with lower risk profile.",
        similarityToPortfolio: 85
      },
      {
        id: "rec-4",
        name: "BioChain Protocol",
        symbol: "BCP",
        logo: "🧬",
        category: "Healthcare",
        currentPrice: 0.67,
        marketCap: "$156M",
        matchScore: 89,
        confidenceLevel: 91,
        riskLevel: "low",
        expectedReturn: "90-140%",
        timeToTarget: "12-18 months",
        reasonsToInvest: [
          "Healthcare data revolution",
          "FDA collaboration potential",
          "Strong IP protection",
          "Recurring revenue model"
        ],
        potentialConcerns: [
          "Lengthy regulatory approval process",
          "Healthcare industry adoption timeline"
        ],
        allocationSuggestion: 20,
        launchStatus: "live",
        personalizedInsights: "Builds on your successful HealthChain investment. Conservative risk profile matches your moderate tolerance with healthcare sector expertise.",
        similarityToPortfolio: 92
      },
      {
        id: "rec-5",
        name: "Quantum DeFi",
        symbol: "QDF",
        logo: "⚛️",
        category: "DeFi",
        currentPrice: 2.34,
        marketCap: "$445M",
        matchScore: 83,
        confidenceLevel: 87,
        riskLevel: "high",
        expectedReturn: "150-300%",
        timeToTarget: "6-10 months",
        reasonsToInvest: [
          "Next-gen DeFi protocols",
          "Quantum-resistant security",
          "High yield opportunities",
          "First-mover advantage"
        ],
        potentialConcerns: [
          "Experimental technology",
          "High volatility expected",
          "Smart contract complexity"
        ],
        allocationSuggestion: 8,
        launchStatus: "completed",
        personalizedInsights: "Leverages your DeFi experience but higher risk than your typical profile. Small allocation recommended given your moderate risk tolerance.",
        similarityToPortfolio: 45
      },
      {
        id: "rec-6",
        name: "MetaEducation",
        symbol: "EDU",
        logo: "🎓",
        category: "Education",
        currentPrice: 0.89,
        marketCap: "$178M",
        matchScore: 76,
        confidenceLevel: 82,
        riskLevel: "medium",
        expectedReturn: "70-120%",
        timeToTarget: "10-16 months",
        reasonsToInvest: [
          "Growing EdTech market",
          "Blockchain credentials",
          "Global education partnerships",
          "Sustainable business model"
        ],
        potentialConcerns: [
          "Educational institution adoption",
          "Market education required"
        ],
        allocationSuggestion: 10,
        launchStatus: "upcoming",
        launchDate: "2025-01-15",
        personalizedInsights: "Diversification opportunity outside your current portfolio. Education sector offers stability with growth potential matching your investment horizon.",
        similarityToPortfolio: 34
      }
    ];

    setRecommendations(mockRecommendations);
    setUserProfile(mockUserProfile);
    setIsLoading(false);
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "high_match") return rec.matchScore >= 90;
    if (selectedFilter === "low_risk") return rec.riskLevel === "low";
    if (selectedFilter === "upcoming") return rec.launchStatus === "upcoming";
    return true;
  });

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    return "text-orange-400";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 border-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "high": return "text-red-400 border-red-400 bg-red-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  if (isLoading) {
    return (
      <Card className="glass border-blue-500/30">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4">
            <Brain className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Profile</h3>
          <p className="text-muted-foreground mb-4">
            Generating personalized token recommendations...
          </p>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Analyzing investment history...</div>
            <div className="text-sm text-muted-foreground">Evaluating risk preferences...</div>
            <div className="text-sm text-muted-foreground">Matching optimal tokens...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-blue-400" />
              <span>Personalized Recommendations</span>
            </div>
            <Button size="sm" variant="outline" onClick={generateRecommendations}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userProfile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Risk Tolerance</div>
                <Badge className="capitalize">{userProfile.riskTolerance}</Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Investment Horizon</div>
                <Badge variant="outline" className="capitalize">{userProfile.investmentHorizon}-term</Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Portfolio Value</div>
                <div className="font-semibold">${userProfile.portfolioValue.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Experience</div>
                <Badge variant="secondary" className="capitalize">{userProfile.experienceLevel}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
        >
          All Recommendations
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === "high_match" ? "default" : "outline"}
          onClick={() => setSelectedFilter("high_match")}
        >
          <Star className="w-4 h-4 mr-1" />
          High Match (90%+)
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === "low_risk" ? "default" : "outline"}
          onClick={() => setSelectedFilter("low_risk")}
        >
          <Shield className="w-4 h-4 mr-1" />
          Low Risk
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === "upcoming" ? "default" : "outline"}
          onClick={() => setSelectedFilter("upcoming")}
        >
          <Clock className="w-4 h-4 mr-1" />
          Upcoming Launches
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((rec) => (
          <Card key={rec.id} className="glass hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{rec.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{rec.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{rec.symbol}</Badge>
                      <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getMatchColor(rec.matchScore)}`}>
                    {rec.matchScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                  <div className="font-semibold">${rec.currentPrice}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Market Cap</div>
                  <div className="font-semibold">{rec.marketCap}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Expected Return</div>
                  <div className="font-semibold text-green-400">{rec.expectedReturn}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Time to Target</div>
                  <div className="font-semibold">{rec.timeToTarget}</div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <Badge className={`${getRiskColor(rec.riskLevel)} text-xs capitalize`}>
                  {rec.riskLevel}
                </Badge>
              </div>

              {/* Allocation Suggestion */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Suggested Allocation:</span>
                  <span className="font-semibold">{rec.allocationSuggestion}%</span>
                </div>
                <Progress value={rec.allocationSuggestion} className="h-2" />
              </div>

              {/* Personalized Insights */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold">Why This Matches You</span>
                </div>
                <p className="text-xs text-muted-foreground">{rec.personalizedInsights}</p>
              </div>

              {/* Reasons to Invest */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>Key Strengths</span>
                </h4>
                <div className="space-y-1">
                  {rec.reasonsToInvest.slice(0, 3).map((reason, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Status */}
              {rec.launchStatus === "upcoming" && (
                <div className="flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold">Upcoming Launch</span>
                  </div>
                  <span className="text-xs">{rec.launchDate}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1" size="sm">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {rec.launchStatus === "upcoming" ? "Pre-order" : "Invest"}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>

              {/* Confidence and Similarity */}
              <div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
                <span>Confidence: {rec.confidenceLevel}%</span>
                <span>Portfolio Match: {rec.similarityToPortfolio}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No recommendations match your current filters.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendation Engine Info */}
      <Card className="glass border-purple-500/20 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>How We Generate Your Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Profile Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes your investment history, risk tolerance, and preferences
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Market Matching</h3>
              <p className="text-sm text-muted-foreground">
                Sophisticated algorithms match tokens to your specific criteria
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Personalized Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Each recommendation includes confidence levels and allocation suggestions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}