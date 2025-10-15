import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Share2, Twitter, Copy, Download, Camera, TrendingUp, BarChart3, Target, 
  Instagram, Facebook, Linkedin, MessageCircle, Hash, Sparkles, Zap,
  RefreshCw, Plus, Filter, ArrowUp
} from "lucide-react";

interface TradingInsight {
  id: string;
  type: "prediction" | "analysis" | "achievement" | "portfolio" | "trade" | "strategy";
  title: string;
  data: any;
  timestamp: string;
  performance?: {
    roi: number;
    accuracy: number;
    winRate: number;
  };
  social?: {
    shares: number;
    likes: number;
    comments: number;
  };
}

interface ShareTemplate {
  id: string;
  name: string;
  platform: string;
  format: "image" | "video" | "text" | "story";
  dimensions: { width: number; height: number };
  description: string;
}

interface ShareAnalytics {
  totalShares: number;
  platformBreakdown: Record<string, number>;
  engagementRates: Record<string, number>;
  topPerformingInsights: any[];
  recentShares: any[];
  engagementRate: number;
  totalLikes: number;
  totalComments: number;
  averageSharesPerInsight: number;
}

export default function EnhancedSocialSharing() {
  const [selectedInsight, setSelectedInsight] = useState<TradingInsight | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate | null>(null);
  const [customText, setCustomText] = useState("");
  const [hashtags, setHashtags] = useState("#crypto #trading #nebulax");
  const [filterType, setFilterType] = useState<string>("all");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch insights from API
  const { data: insights = [], isLoading: insightsLoading, refetch: refetchInsights } = useQuery({
    queryKey: ['social-insights'],
    queryFn: async () => {
      const response = await fetch('/api/social-share/insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      return response.json();
    }
  });

  // Fetch templates from API
  const { data: templates = [] } = useQuery({
    queryKey: ['share-templates'],
    queryFn: async () => {
      const response = await fetch('/api/social-share/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    }
  });

  // Fetch analytics from API
  const { data: analytics } = useQuery<ShareAnalytics>({
    queryKey: ['share-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/social-share/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Generate share content mutation
  const generateShareMutation = useMutation({
    mutationFn: async ({ insightId, platform, customText, hashtags, templateId }: {
      insightId: string;
      platform: string;
      customText?: string;
      hashtags?: string;
      templateId?: string;
    }) => {
      const response = await fetch('/api/social-share/generate-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insightId,
          platform,
          customText,
          hashtags,
          templateId
        }),
      });
      if (!response.ok) throw new Error('Failed to generate share content');
      return response.json();
    }
  });

  // Track share mutation
  const trackShareMutation = useMutation({
    mutationFn: async ({ insightId, platform, action }: {
      insightId: string;
      platform: string;
      action: string;
    }) => {
      const response = await fetch('/api/social-share/track-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insightId,
          platform,
          action
        }),
      });
      if (!response.ok) throw new Error('Failed to track share');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-insights'] });
      queryClient.invalidateQueries({ queryKey: ['share-analytics'] });
    }
  });

  // Create new insight mutation
  const createInsightMutation = useMutation({
    mutationFn: async (insight: Partial<TradingInsight>) => {
      const response = await fetch('/api/social-share/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insight),
      });
      if (!response.ok) throw new Error('Failed to create insight');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-insights'] });
      toast({
        title: "Insight created",
        description: "New trading insight has been created successfully!",
      });
    }
  });

  const shareToSocial = async (platform: string, insight: TradingInsight) => {
    try {
      const shareData = await generateShareMutation.mutateAsync({
        insightId: insight.id,
        platform,
        customText,
        hashtags,
        templateId: selectedTemplate?.id
      });

      let url = "";
      const text = shareData.content;
      
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
          break;
        case 'telegram':
          url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
          break;
        default:
          await copyToClipboard(text);
          return;
      }
      
      window.open(url, '_blank');
      
      // Track the share
      await trackShareMutation.mutateAsync({
        insightId: insight.id,
        platform,
        action: 'share'
      });
      
      toast({
        title: `Shared to ${platform}`,
        description: "Your trading insight has been shared successfully!",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share insight. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Share text has been copied to your clipboard!",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadImage = async (insight: TradingInsight) => {
    if (!selectedTemplate) return;
    
    try {
      const response = await fetch(`/api/social-share/generate-image/${insight.id}?template=${selectedTemplate.id}&platform=${selectedTemplate.platform}`);
      const data = await response.json();
      
      // Create download link
      const link = document.createElement('a');
      link.download = `nebulax-${insight.type}-${selectedTemplate.platform}-${Date.now()}.png`;
      link.href = data.imageUrl;
      link.click();
      
      toast({
        title: "Image downloaded",
        description: "Your trading insight image has been saved!",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createQuickInsight = () => {
    const quickInsight = {
      type: "achievement" as const,
      title: "Portfolio Update",
      data: {
        totalValue: 85000 + Math.random() * 20000,
        growth: Math.random() * 5 + 2,
        timeframe: "24h"
      }
    };
    
    createInsightMutation.mutate(quickInsight);
  };

  const filteredInsights = insights.filter((insight: TradingInsight) => 
    filterType === "all" || insight.type === filterType
  );

  const sortedInsights = [...filteredInsights].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header with Analytics Summary */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              <span>Social Share Dashboard</span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {insights.length} Insights Ready
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={createQuickInsight}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={createInsightMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Insight
              </Button>
              <Button
                onClick={() => refetchInsights()}
                size="sm"
                variant="outline"
                className="glass"
                disabled={insightsLoading}
              >
                <RefreshCw className={`w-4 h-4 ${insightsLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{analytics.totalShares}</div>
                <div className="text-sm text-muted-foreground">Total Shares</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{analytics.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{analytics.engagementRate}%</div>
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{analytics.averageSharesPerInsight}</div>
                <div className="text-sm text-muted-foreground">Avg. Shares</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights List */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Trading Insights</span>
                <div className="flex items-center space-x-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[120px] glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="trade">Trades</SelectItem>
                      <SelectItem value="prediction">Predictions</SelectItem>
                      <SelectItem value="achievement">Achievements</SelectItem>
                      <SelectItem value="strategy">Strategies</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sortedInsights.map((insight: TradingInsight) => (
                  <Card 
                    key={insight.id} 
                    className={`glass-strong cursor-pointer transition-all hover:border-purple-400/50 ${
                      selectedInsight?.id === insight.id ? 'border-purple-400 bg-purple-500/10' : ''
                    }`}
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="text-lg">
                              {insight.type === 'trade' ? '💰' : 
                               insight.type === 'prediction' ? '🎯' : 
                               insight.type === 'achievement' ? '🏆' : 
                               insight.type === 'portfolio' ? '💼' : 
                               insight.type === 'strategy' ? '🧠' : '📊'}
                            </div>
                            <h4 className="font-semibold">{insight.title}</h4>
                            <Badge className={
                              insight.type === 'trade' ? 'bg-green-500' :
                              insight.type === 'prediction' ? 'bg-blue-500' :
                              insight.type === 'achievement' ? 'bg-yellow-500' :
                              insight.type === 'portfolio' ? 'bg-cyan-500' :
                              insight.type === 'strategy' ? 'bg-purple-500' : 'bg-gray-500'
                            }>
                              {insight.type}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            {new Date(insight.timestamp).toLocaleString()}
                          </div>
                          
                          {insight.social && (
                            <div className="flex items-center space-x-4 text-xs text-gray-400">
                              <span className="flex items-center">
                                <Share2 className="w-3 h-3 mr-1" />
                                {insight.social.shares}
                              </span>
                              <span className="flex items-center">
                                <span className="mr-1">❤️</span>
                                {insight.social.likes}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {insight.social.comments}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {insight.performance && (
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-400">
                              +{insight.performance.roi}% ROI
                            </div>
                            {insight.performance.accuracy > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {insight.performance.accuracy}% accuracy
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sharing Controls */}
        <div className="space-y-4">
          {selectedInsight && (
            <>
              {/* Sharing Options */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span>Quick Share</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => shareToSocial('twitter', selectedInsight)}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={generateShareMutation.isPending}
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    
                    <Button 
                      onClick={() => shareToSocial('linkedin', selectedInsight)}
                      className="bg-blue-700 hover:bg-blue-800"
                      disabled={generateShareMutation.isPending}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    
                    <Button 
                      onClick={() => shareToSocial('facebook', selectedInsight)}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={generateShareMutation.isPending}
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    
                    <Button 
                      onClick={() => shareToSocial('telegram', selectedInsight)}
                      className="bg-sky-500 hover:bg-sky-600"
                      disabled={generateShareMutation.isPending}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Telegram
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Customization */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <span>Customize</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Message</label>
                    <Textarea 
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Add your personal touch..."
                      className="glass"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hashtags</label>
                    <Input 
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#crypto #trading #nebulax"
                      className="glass"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Template</label>
                    <Select onValueChange={(value) => setSelectedTemplate(templates.find((t: ShareTemplate) => t.id === value) || null)}>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Choose template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template: ShareTemplate) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} - {template.platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={() => downloadImage(selectedInsight)}
                    className="w-full glass"
                    disabled={!selectedTemplate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>This Insight</span>
                      <span className="font-bold text-blue-400">
                        {selectedInsight.social?.shares || 0} shares
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement</span>
                      <span className="font-bold text-green-400">
                        {((selectedInsight.social?.likes || 0) + (selectedInsight.social?.comments || 0))} interactions
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span className="font-bold text-purple-400">
                        {new Date(selectedInsight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
        width={1200} 
        height={675}
      />
    </div>
  );
}