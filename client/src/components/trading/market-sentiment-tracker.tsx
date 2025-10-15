import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Brain,
  Eye,
  MessageSquare,
  Twitter,
  Globe,
  BarChart3,
  PieChart,
  Zap,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Star,
  RefreshCw
} from "lucide-react";

interface SentimentData {
  symbol: string;
  name: string;
  overallSentiment: number;
  sentimentGrade: "Very Bullish" | "Bullish" | "Neutral" | "Bearish" | "Very Bearish";
  change24h: number;
  sources: {
    social: number;
    news: number;
    technical: number;
    onchain: number;
  };
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  volume: number;
  mentions: number;
  lastUpdated: string;
}

interface SentimentEvent {
  id: string;
  type: "news" | "social" | "whale" | "technical";
  title: string;
  description: string;
  impact: number;
  timestamp: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
}

interface TrendingTopic {
  id: string;
  topic: string;
  mentions: number;
  sentiment: number;
  change: number;
  category: string;
}

export default function MarketSentimentTracker() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const sentimentData: SentimentData[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      overallSentiment: 78,
      sentimentGrade: "Bullish",
      change24h: 5.2,
      sources: {
        social: 82,
        news: 75,
        technical: 80,
        onchain: 74
      },
      breakdown: {
        positive: 68,
        neutral: 22,
        negative: 10
      },
      volume: 15420,
      mentions: 89500,
      lastUpdated: "2 minutes ago"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      overallSentiment: 72,
      sentimentGrade: "Bullish",
      change24h: -2.1,
      sources: {
        social: 69,
        news: 78,
        technical: 71,
        onchain: 70
      },
      breakdown: {
        positive: 58,
        neutral: 32,
        negative: 10
      },
      volume: 12890,
      mentions: 67200,
      lastUpdated: "1 minute ago"
    },
    {
      symbol: "SOL",
      name: "Solana",
      overallSentiment: 85,
      sentimentGrade: "Very Bullish",
      change24h: 12.8,
      sources: {
        social: 88,
        news: 82,
        technical: 86,
        onchain: 84
      },
      breakdown: {
        positive: 74,
        neutral: 19,
        negative: 7
      },
      volume: 8750,
      mentions: 34500,
      lastUpdated: "3 minutes ago"
    }
  ];

  const recentEvents: SentimentEvent[] = [
    {
      id: "1",
      type: "news",
      title: "Major Bank Announces Bitcoin Integration",
      description: "Large financial institution reveals plans to offer crypto custody services",
      impact: 15,
      timestamp: "5 minutes ago",
      source: "Reuters",
      sentiment: "positive"
    },
    {
      id: "2",
      type: "whale",
      title: "Large Ethereum Transfer Detected",
      description: "50,000 ETH moved from unknown wallet to exchange",
      impact: -8,
      timestamp: "12 minutes ago",
      source: "Whale Alert",
      sentiment: "negative"
    },
    {
      id: "3",
      type: "social",
      title: "Viral Thread on Solana Ecosystem",
      description: "Developer thread about upcoming Solana features gains massive traction",
      impact: 22,
      timestamp: "18 minutes ago",
      source: "Twitter",
      sentiment: "positive"
    },
    {
      id: "4",
      type: "technical",
      title: "Bitcoin Golden Cross Formation",
      description: "50-day MA crosses above 200-day MA indicating bullish momentum",
      impact: 18,
      timestamp: "1 hour ago",
      source: "Technical Analysis",
      sentiment: "positive"
    }
  ];

  const trendingTopics: TrendingTopic[] = [
    {
      id: "1",
      topic: "Bitcoin ETF",
      mentions: 12500,
      sentiment: 82,
      change: 15.2,
      category: "Regulatory"
    },
    {
      id: "2",
      topic: "DeFi Summer 2.0",
      mentions: 8900,
      sentiment: 76,
      change: 28.5,
      category: "DeFi"
    },
    {
      id: "3",
      topic: "AI Tokens",
      mentions: 6700,
      sentiment: 88,
      change: 45.1,
      category: "AI/ML"
    },
    {
      id: "4",
      topic: "Layer 2 Scaling",
      mentions: 5400,
      sentiment: 71,
      change: -5.2,
      category: "Infrastructure"
    }
  ];

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 80) return "text-green-400 bg-green-400/10";
    if (sentiment >= 60) return "text-blue-400 bg-blue-400/10";
    if (sentiment >= 40) return "text-yellow-400 bg-yellow-400/10";
    if (sentiment >= 20) return "text-orange-400 bg-orange-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getSentimentGradeColor = (grade: string) => {
    switch (grade) {
      case "Very Bullish": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Bullish": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Neutral": return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      case "Bearish": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "Very Bearish": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "news": return <Globe className="w-4 h-4" />;
      case "social": return <MessageSquare className="w-4 h-4" />;
      case "whale": return <Activity className="w-4 h-4" />;
      case "technical": return <BarChart3 className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getEventColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "negative": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground">Real-time analysis across social, news, and on-chain data</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Badge variant={autoRefresh ? "default" : "outline"}>
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="analysis">Deep Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Sentiment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sentimentData.map((data, index) => (
              <Card key={index} className="glass hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {data.symbol}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{data.name}</CardTitle>
                        <Badge className={getSentimentGradeColor(data.sentimentGrade)} variant="outline">
                          {data.sentimentGrade}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">
                        <span className={getSentimentColor(data.overallSentiment).split(' ')[0]}>
                          {data.overallSentiment}
                        </span>
                      </div>
                      <div className={`text-sm font-semibold ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.change24h >= 0 ? '+' : ''}{data.change24h}%
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Sentiment Breakdown */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Sentiment Breakdown</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400">Positive:</span>
                        <span>{data.breakdown.positive}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Neutral:</span>
                        <span>{data.breakdown.neutral}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-400">Negative:</span>
                        <span>{data.breakdown.negative}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-green-400" 
                        style={{ width: `${data.breakdown.positive}%` }}
                      />
                      <div 
                        className="h-full bg-gray-400" 
                        style={{ width: `${data.breakdown.neutral}%` }}
                      />
                      <div 
                        className="h-full bg-red-400" 
                        style={{ width: `${data.breakdown.negative}%` }}
                      />
                    </div>
                  </div>

                  {/* Source Analysis */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Source Analysis</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs">
                        <div className="flex justify-between">
                          <span>Social:</span>
                          <span>{data.sources.social}%</span>
                        </div>
                        <Progress value={data.sources.social} className="h-1 mt-1" />
                      </div>
                      <div className="text-xs">
                        <div className="flex justify-between">
                          <span>News:</span>
                          <span>{data.sources.news}%</span>
                        </div>
                        <Progress value={data.sources.news} className="h-1 mt-1" />
                      </div>
                      <div className="text-xs">
                        <div className="flex justify-between">
                          <span>Technical:</span>
                          <span>{data.sources.technical}%</span>
                        </div>
                        <Progress value={data.sources.technical} className="h-1 mt-1" />
                      </div>
                      <div className="text-xs">
                        <div className="flex justify-between">
                          <span>On-chain:</span>
                          <span>{data.sources.onchain}%</span>
                        </div>
                        <Progress value={data.sources.onchain} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{data.mentions.toLocaleString()} mentions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{data.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <Card key={event.id} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getEventColor(event.sentiment)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className={`text-lg font-bold ${
                            event.impact > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {event.impact > 0 ? '+' : ''}{event.impact}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Impact
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>{event.source}</span>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                        <span>{event.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingTopics.map((topic) => (
              <Card key={topic.id} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{topic.topic}</h4>
                      <Badge variant="outline" className="mt-1">
                        {topic.category}
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        <span className={getSentimentColor(topic.sentiment).split(' ')[0]}>
                          {topic.sentiment}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Sentiment</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mentions:</span>
                      <span className="font-semibold">{topic.mentions.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">24h Change:</span>
                      <span className={`font-semibold ${
                        topic.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {topic.change >= 0 ? '+' : ''}{topic.change}%
                      </span>
                    </div>
                    
                    <Progress value={topic.sentiment} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-6 h-6 text-blue-400" />
                  <span>Market Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-1">74</div>
                    <div className="text-sm text-muted-foreground">Overall Market Sentiment</div>
                    <Badge className="mt-2" variant="outline">Bullish</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fear & Greed Index:</span>
                      <span className="font-semibold text-green-400">68 (Greed)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Social Volume:</span>
                      <span className="font-semibold">+15.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>News Sentiment:</span>
                      <span className="font-semibold text-blue-400">Positive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-green-400" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <div className="text-sm">
                        <strong>Bullish Pattern Detected:</strong> Multiple tokens showing coordinated positive sentiment increase
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div className="text-sm">
                        <strong>Watch:</strong> High whale activity detected across major assets
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Brain className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div className="text-sm">
                        <strong>Prediction:</strong> 72% chance of continued positive sentiment in next 24h
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}