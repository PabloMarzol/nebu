import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Share2, 
  Download, 
  Twitter, 
  Facebook, 
  Linkedin,
  Copy,
  TrendingUp,
  TrendingDown,
  DollarSign
} from "lucide-react";
import html2canvas from "html2canvas";

interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  topAssets: Array<{
    symbol: string;
    name: string;
    value: number;
    change: number;
    allocation: number;
  }>;
  performanceMetrics: {
    sharpeRatio: number;
    volatility: number;
    maxDrawdown: number;
  };
}

interface PortfolioScreenshotProps {
  portfolioData: PortfolioData;
  className?: string;
}

export default function PortfolioScreenshotShare({ portfolioData, className = "" }: PortfolioScreenshotProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const captureScreenshot = async () => {
    if (!screenshotRef.current) return null;

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(screenshotRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      toast({
        title: "Screenshot Failed",
        description: "Unable to capture portfolio screenshot",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadScreenshot = async () => {
    const dataUrl = await captureScreenshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `nebulax-portfolio-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    toast({
      title: "Download Complete",
      description: "Portfolio screenshot saved successfully"
    });
  };

  const shareToSocial = async (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const dataUrl = await captureScreenshot();
    if (!dataUrl) return;

    const text = `Check out my crypto portfolio performance on NebulaX! 📈 Total Value: ${formatCurrency(portfolioData.totalValue)} | Daily Change: ${formatPercent(portfolioData.dailyChangePercent)}`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://nebulax.exchange`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=https://nebulax.exchange&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://nebulax.exchange&summary=${encodeURIComponent(text)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
    
    toast({
      title: "Sharing Portfolio",
      description: `Opening ${platform} to share your performance`
    });
  };

  const copyToClipboard = async () => {
    const dataUrl = await captureScreenshot();
    if (!dataUrl) return;

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      toast({
        title: "Copied to Clipboard",
        description: "Portfolio screenshot ready to paste"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy screenshot to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Screenshot Preview */}
      <div
        ref={screenshotRef}
        className="bg-gradient-to-br from-background via-background to-primary/5 border rounded-lg p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold">NebulaX Portfolio</h3>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Live Performance
          </Badge>
        </div>

        {/* Portfolio Value */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            {formatCurrency(portfolioData.totalValue)}
          </h2>
          <div className="flex items-center justify-center gap-2">
            {portfolioData.dailyChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-lg font-semibold ${
              portfolioData.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatCurrency(Math.abs(portfolioData.dailyChange))} 
              ({formatPercent(portfolioData.dailyChangePercent)})
            </span>
          </div>
        </div>

        {/* Top Assets */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Holdings</h4>
          <div className="grid grid-cols-2 gap-3">
            {portfolioData.topAssets.slice(0, 4).map((asset, index) => (
              <div key={index} className="bg-card/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{asset.symbol}</p>
                    <p className="text-xs text-muted-foreground">{asset.allocation}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(asset.value)}</p>
                    <p className={`text-xs ${
                      asset.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatPercent(asset.change)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-lg font-bold text-primary">
              {portfolioData.performanceMetrics.sharpeRatio.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Volatility</p>
            <p className="text-lg font-bold">
              {portfolioData.performanceMetrics.volatility.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-lg font-bold text-red-500">
              {portfolioData.performanceMetrics.maxDrawdown.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Powered by NebulaX */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
          Powered by NebulaX Exchange • Advanced Portfolio Analytics
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button 
          onClick={downloadScreenshot}
          disabled={isCapturing}
          className="flex-1 min-w-[120px]"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <Button 
          variant="outline"
          onClick={copyToClipboard}
          disabled={isCapturing}
          className="flex-1 min-w-[120px]"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>

        <Button 
          variant="outline"
          onClick={() => shareToSocial('twitter')}
          disabled={isCapturing}
          className="flex-1 min-w-[120px]"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>

        <Button 
          variant="outline"
          onClick={() => shareToSocial('linkedin')}
          disabled={isCapturing}
          className="flex-1 min-w-[120px]"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
      </motion.div>

      {isCapturing && (
        <div className="text-center text-sm text-muted-foreground">
          <Camera className="w-4 h-4 inline mr-2" />
          Capturing screenshot...
        </div>
      )}
    </div>
  );
}