import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { Share2, Twitter, Copy, Download, Camera, TrendingUp, BarChart3, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TradingInsight {
  id: string;
  type: "prediction" | "analysis" | "achievement" | "portfolio";
  title: string;
  data: any;
  timestamp: Date;
  performance?: {
    roi: number;
    accuracy: number;
    winRate: number;
  };
}

export default function SocialSharingWidget() {
  const [selectedInsight, setSelectedInsight] = useState<TradingInsight | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const insights: TradingInsight[] = [
    {
      id: "btc-prediction",
      type: "prediction",
      title: "Bitcoin Price Prediction",
      data: {
        symbol: "BTC",
        currentPrice: 67420,
        prediction: 72000,
        confidence: 85,
        timeframe: "7 days"
      },
      timestamp: new Date(),
      performance: { roi: 12.5, accuracy: 78, winRate: 64 }
    },
    {
      id: "portfolio-performance",
      type: "portfolio",
      title: "Portfolio Performance",
      data: {
        totalValue: 125000,
        totalGain: 15750,
        gainPercentage: 14.4,
        topPerformer: "ETH",
        topGain: 24.8
      },
      timestamp: new Date(),
      performance: { roi: 14.4, accuracy: 0, winRate: 0 }
    },
    {
      id: "market-analysis",
      type: "analysis",
      title: "Market Sentiment Analysis",
      data: {
        overall: "Bullish",
        confidence: 72,
        keyFactors: ["Institutional adoption", "Regulatory clarity", "Technical breakout"]
      },
      timestamp: new Date()
    }
  ];

  const generateShareableImage = (insight: TradingInsight) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add NebulaX branding
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('NebulaX', 50, 80);
    
    ctx.fillStyle = '#ec4899';
    ctx.font = '18px Arial';
    ctx.fillText('Advanced Crypto Trading Platform', 50, 110);

    // Add insight content based on type
    if (insight.type === 'prediction') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(insight.title, 50, 180);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`${insight.data.symbol}: $${insight.data.currentPrice.toLocaleString()}`, 50, 230);
      
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Target: $${insight.data.prediction.toLocaleString()}`, 50, 270);
      
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Confidence: ${insight.data.confidence}%`, 50, 310);
      
      // Draw prediction arrow
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(450, 250);
      ctx.lineTo(550, 200);
      ctx.lineTo(530, 220);
      ctx.moveTo(550, 200);
      ctx.lineTo(530, 180);
      ctx.stroke();
      
    } else if (insight.type === 'portfolio') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(insight.title, 50, 180);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`Total Value: $${insight.data.totalValue.toLocaleString()}`, 50, 230);
      
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Gain: +${insight.data.gainPercentage}%`, 50, 270);
      
      ctx.fillStyle = '#ec4899';
      ctx.fillText(`Top Performer: ${insight.data.topPerformer} (+${insight.data.topGain}%)`, 50, 310);
    }

    // Add performance metrics if available
    if (insight.performance) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Performance Metrics:', 50, 380);
      
      ctx.font = '18px Arial';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`ROI: ${insight.performance.roi}%`, 50, 420);
      
      if (insight.performance.accuracy > 0) {
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`Accuracy: ${insight.performance.accuracy}%`, 250, 420);
        
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Win Rate: ${insight.performance.winRate}%`, 450, 420);
      }
    }

    // Add timestamp
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.fillText(`Generated on ${insight.timestamp.toLocaleDateString()}`, 50, 550);
    
    // Add QR code placeholder
    ctx.fillStyle = '#374151';
    ctx.fillRect(650, 450, 100, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Scan to', 670, 575);
    ctx.fillText('Learn More', 665, 590);

    return canvas.toDataURL('image/png');
  };

  const shareToTwitter = async (insight: TradingInsight) => {
    const imageData = generateShareableImage(insight);
    
    let tweetText = "";
    
    if (insight.type === 'prediction') {
      tweetText = `🚀 ${insight.data.symbol} Prediction Alert!\n\nCurrent: $${insight.data.currentPrice.toLocaleString()}\nTarget: $${insight.data.prediction.toLocaleString()}\nConfidence: ${insight.data.confidence}%\n\n#Crypto #Trading #${insight.data.symbol} #NebulaX`;
    } else if (insight.type === 'portfolio') {
      tweetText = `💎 Portfolio Update!\n\nTotal Value: $${insight.data.totalValue.toLocaleString()}\nGain: +${insight.data.gainPercentage}%\nTop Performer: ${insight.data.topPerformer} (+${insight.data.topGain}%)\n\n#CryptoPortfolio #Trading #NebulaX`;
    } else if (insight.type === 'analysis') {
      tweetText = `📊 Market Analysis\n\nSentiment: ${insight.data.overall}\nConfidence: ${insight.data.confidence}%\n\nKey factors driving the market today\n\n#MarketAnalysis #Crypto #NebulaX`;
    }
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
    
    toast({
      title: "Shared to Twitter",
      description: "Your trading insight has been shared!",
    });
  };

  const copyToClipboard = async (insight: TradingInsight) => {
    let shareText = "";
    
    if (insight.type === 'prediction') {
      shareText = `🚀 ${insight.data.symbol} Price Prediction\n\nCurrent Price: $${insight.data.currentPrice.toLocaleString()}\nPredicted Target: $${insight.data.prediction.toLocaleString()}\nConfidence Level: ${insight.data.confidence}%\nTimeframe: ${insight.data.timeframe}\n\nGenerated by NebulaX Advanced Trading Platform`;
    } else if (insight.type === 'portfolio') {
      shareText = `💼 My Crypto Portfolio Performance\n\nTotal Portfolio Value: $${insight.data.totalValue.toLocaleString()}\nTotal Gain: $${insight.data.totalGain.toLocaleString()} (+${insight.data.gainPercentage}%)\nTop Performing Asset: ${insight.data.topPerformer} (+${insight.data.topGain}%)\n\nTracked with NebulaX`;
    }
    
    try {
      await navigator.clipboard.writeText(shareText);
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

  const downloadImage = (insight: TradingInsight) => {
    const imageData = generateShareableImage(insight);
    if (!imageData) return;
    
    const link = document.createElement('a');
    link.download = `nebulax-${insight.type}-${Date.now()}.png`;
    link.href = imageData;
    link.click();
    
    toast({
      title: "Image downloaded",
      description: "Your trading insight image has been saved!",
    });
  };

  const generateAllFormats = async (insight: TradingInsight) => {
    setIsGenerating(true);
    setSelectedInsight(insight);
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    
    toast({
      title: "Share formats ready!",
      description: "All sharing formats have been generated.",
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="w-5 h-5 text-blue-400" />
          <span>One-Click Social Sharing</span>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Instant Share
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Insights */}
        <div>
          <h3 className="font-semibold mb-3">Your Trading Insights</h3>
          <div className="space-y-3">
            {insights.map((insight) => (
              <Card 
                key={insight.id} 
                className={`glass-strong cursor-pointer transition-all hover:border-purple-400/50 ${
                  selectedInsight?.id === insight.id ? 'border-purple-400' : ''
                }`}
                onClick={() => setSelectedInsight(insight)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-lg">
                          {insight.type === 'prediction' ? '🎯' : 
                           insight.type === 'portfolio' ? '💼' : 
                           insight.type === 'analysis' ? '📊' : '🏆'}
                        </div>
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge className={
                          insight.type === 'prediction' ? 'bg-blue-500' :
                          insight.type === 'portfolio' ? 'bg-green-500' :
                          insight.type === 'analysis' ? 'bg-purple-500' : 'bg-yellow-500'
                        }>
                          {insight.type}
                        </Badge>
                      </div>
                      
                      {insight.type === 'prediction' && (
                        <div className="text-sm text-muted-foreground">
                          {insight.data.symbol}: ${insight.data.currentPrice.toLocaleString()} → ${insight.data.prediction.toLocaleString()} ({insight.data.confidence}% confidence)
                        </div>
                      )}
                      
                      {insight.type === 'portfolio' && (
                        <div className="text-sm text-muted-foreground">
                          ${insight.data.totalValue.toLocaleString()} total (+{insight.data.gainPercentage}%)
                        </div>
                      )}
                      
                      {insight.type === 'analysis' && (
                        <div className="text-sm text-muted-foreground">
                          {insight.data.overall} sentiment ({insight.data.confidence}% confidence)
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
        </div>

        {/* Sharing Options */}
        {selectedInsight && (
          <Card className="glass-strong">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Share "{selectedInsight.title}"
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button 
                  onClick={() => shareToTwitter(selectedInsight)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Tweet
                </Button>
                
                <Button 
                  onClick={() => copyToClipboard(selectedInsight)}
                  variant="outline" 
                  className="glass"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
                
                <Button 
                  onClick={() => downloadImage(selectedInsight)}
                  variant="outline" 
                  className="glass"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                
                <Button 
                  onClick={() => generateAllFormats(selectedInsight)}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      All Formats
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Canvas (hidden) */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
          width={800} 
          height={600}
        />

        {/* Quick Stats */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Sharing Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">247</div>
                <div className="text-sm text-muted-foreground">Insights Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">12.4K</div>
                <div className="text-sm text-muted-foreground">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">85%</div>
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Integration */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Connected Accounts</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Twitter</span>
                </div>
                <Badge className="bg-green-500">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-blue-600">📘</span>
                  <span className="text-sm">Facebook</span>
                </div>
                <Button variant="outline" size="sm" className="glass">
                  Connect
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-blue-700">💼</span>
                  <span className="text-sm">LinkedIn</span>
                </div>
                <Button variant="outline" size="sm" className="glass">
                  Connect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}