import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Star, 
  Brain,
  Eye,
  DollarSign,
  Clock,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

interface QuickRecommendation {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  category: string;
  matchScore: number;
  expectedReturn: string;
  riskLevel: "low" | "medium" | "high";
  timeToTarget: string;
  launchStatus: "live" | "upcoming" | "completed";
  launchDate?: string;
  personalizedReason: string;
  currentPrice: number;
}

interface RecommendationWidgetProps {
  compact?: boolean;
  maxRecommendations?: number;
}

export default function RecommendationWidget({ 
  compact = false, 
  maxRecommendations = 3 
}: RecommendationWidgetProps) {
  const [recommendations, setRecommendations] = useState<QuickRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuickRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const quickRecs: QuickRecommendation[] = [
      {
        id: "quick-1",
        name: "SolarCoin",
        symbol: "SLR",
        logo: "☀️",
        category: "Green Energy",
        matchScore: 94,
        expectedReturn: "120-180%",
        riskLevel: "low",
        timeToTarget: "6-12 months",
        launchStatus: "upcoming",
        launchDate: "2024-12-20",
        personalizedReason: "Matches your ESG preferences and moderate risk profile",
        currentPrice: 0.25
      },
      {
        id: "quick-2",
        name: "DeepMind Finance",
        symbol: "DMF",
        logo: "🧠",
        category: "AI/ML",
        matchScore: 91,
        expectedReturn: "100-200%",
        riskLevel: "medium",
        timeToTarget: "8-15 months",
        launchStatus: "upcoming",
        launchDate: "2024-12-25",
        personalizedReason: "Perfect for your AI/ML category preference",
        currentPrice: 1.85
      },
      {
        id: "quick-3",
        name: "BioChain Protocol",
        symbol: "BCP",
        logo: "🧬",
        category: "Healthcare",
        matchScore: 89,
        expectedReturn: "90-140%",
        riskLevel: "low",
        timeToTarget: "12-18 months",
        launchStatus: "live",
        personalizedReason: "Builds on your successful healthcare investments",
        currentPrice: 0.67
      }
    ];

    setRecommendations(quickRecs.slice(0, maxRecommendations));
    setIsLoading(false);
  };

  useEffect(() => {
    generateQuickRecommendations();
  }, [maxRecommendations]);

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

  if (compact) {
    return (
      <Card className="glass border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span>AI Recommendations</span>
            </div>
            <Button size="sm" variant="ghost" onClick={generateQuickRecommendations}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 mx-auto mb-2">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-sm text-muted-foreground">Analyzing...</div>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{rec.logo}</div>
                    <div>
                      <div className="font-semibold text-sm">{rec.name}</div>
                      <div className="text-xs text-muted-foreground">{rec.expectedReturn}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getMatchColor(rec.matchScore)}`}>
                      {rec.matchScore}%
                    </div>
                    <Badge className={`${getRiskColor(rec.riskLevel)} text-xs`}>
                      {rec.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Link href="/recommendations">
                <Button className="w-full mt-3" size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View All Recommendations
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-400" />
            <span>Personalized Recommendations</span>
          </div>
          <Button size="sm" variant="outline" onClick={generateQuickRecommendations}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 mx-auto mb-4">
              <Brain className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Profile</h3>
            <p className="text-sm text-muted-foreground">
              Finding the best token matches for you...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={rec.id} className="border border-border rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{rec.logo}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{rec.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{rec.symbol}</Badge>
                        <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getMatchColor(rec.matchScore)}`}>
                      {rec.matchScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Match Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Expected Return</div>
                    <div className="font-semibold text-green-400">{rec.expectedReturn}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Time Frame</div>
                    <div className="font-semibold">{rec.timeToTarget}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Risk Level</div>
                    <Badge className={`${getRiskColor(rec.riskLevel)} text-xs capitalize`}>
                      {rec.riskLevel}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold">Why This Matches You</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.personalizedReason}</p>
                </div>

                {rec.launchStatus === "upcoming" && (
                  <div className="flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/20 rounded mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-semibold">Upcoming Launch</span>
                    </div>
                    <span className="text-xs">{rec.launchDate}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {rec.launchStatus === "upcoming" ? "Pre-order" : "Invest Now"}
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}

            <div className="text-center pt-4 border-t">
              <Link href="/recommendations">
                <Button variant="outline" className="px-6">
                  View All Personalized Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}