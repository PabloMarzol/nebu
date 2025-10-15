import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import html2canvas from 'html2canvas';
import {
  Camera,
  Download,
  Share2,
  Twitter,
  Instagram,
  Facebook,
  Copy,
  TrendingUp,
  Zap,
  Star,
  Crown,
  Sparkles
} from "lucide-react";

interface PortfolioData {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  topPerformer: string;
  topPerformerChange: number;
  holdings: Array<{
    symbol: string;
    name: string;
    amount: number;
    value: number;
    change: number;
    changePercent: number;
  }>;
}

export default function PortfolioScreenshot() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Sample portfolio data
  const portfolioData: PortfolioData = {
    totalValue: 45750.32,
    dayChange: 2847.50,
    dayChangePercent: 6.64,
    topPerformer: 'SOL',
    topPerformerChange: 18.5,
    holdings: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.75, value: 33750, change: 1250, changePercent: 3.85 },
      { symbol: 'ETH', name: 'Ethereum', amount: 12.5, value: 8750, change: 425, changePercent: 5.1 },
      { symbol: 'SOL', name: 'Solana', amount: 85, value: 2550, change: 398, changePercent: 18.5 },
      { symbol: 'ADA', name: 'Cardano', amount: 2500, value: 700.32, change: -25, changePercent: -3.45 }
    ]
  };

  const templates = [
    { id: 'classic', name: 'Classic', description: 'Clean and professional' },
    { id: 'neon', name: 'Neon Flex', description: 'Vibrant and eye-catching' },
    { id: 'diamond', name: 'Diamond Hands', description: 'For the HODLers' },
    { id: 'moon', name: 'To The Moon', description: 'Celebrate your gains' }
  ];

  const capturePortfolio = async () => {
    if (!portfolioRef.current) return;

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(portfolioRef.current, {
        backgroundColor: 'transparent',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `portfolio-flex-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  const shareToSocial = (platform: string) => {
    const text = `Just checked my crypto portfolio - up ${portfolioData.dayChangePercent}% today! 🚀 #CryptoGains #NebulaX`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      instagram: '#', // Instagram requires app integration
    };
    
    if (platform !== 'instagram') {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  const copyImageToClipboard = async () => {
    if (!capturedImage) return;
    
    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('Image copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy image:', error);
    }
  };

  const getTemplateClasses = (templateId: string) => {
    switch (templateId) {
      case 'neon':
        return 'bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 border-2 border-pink-500/50 shadow-2xl shadow-pink-500/25';
      case 'diamond':
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 border-2 border-blue-400/50 shadow-2xl shadow-blue-500/25';
      case 'moon':
        return 'bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/25';
      default:
        return 'bg-gradient-to-br from-gray-900 to-black border border-gray-600/30 shadow-2xl';
    }
  };

  const getTemplateAccent = (templateId: string) => {
    switch (templateId) {
      case 'neon': return 'text-pink-400';
      case 'diamond': return 'text-blue-400';
      case 'moon': return 'text-yellow-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            📸 Portfolio Flex Screenshot 📸
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Create stunning screenshots of your crypto gains to share with the world!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection and Portfolio Preview */}
          <div>
            {/* Template Selection */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Choose Your Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600/30 bg-gray-800/30 hover:border-gray-500/50'
                      }`}
                    >
                      <div className="font-semibold text-white mb-1">{template.name}</div>
                      <div className="text-xs text-gray-400">{template.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Card for Screenshot */}
            <div ref={portfolioRef} className="relative">
              <Card className={`${getTemplateClasses(selectedTemplate)} text-white overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">My Portfolio</h2>
                      <p className="text-gray-300">NebulaX Exchange</p>
                    </div>
                    <div className="text-right">
                      <Crown className={`w-8 h-8 ${getTemplateAccent(selectedTemplate)} mb-2`} />
                      <Badge className={`${getTemplateAccent(selectedTemplate)} bg-white/10`}>
                        HODLer
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  {/* Total Value */}
                  <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="text-sm text-gray-300 mb-2">Total Portfolio Value</div>
                    <div className="text-5xl font-bold mb-3">
                      ${portfolioData.totalValue.toLocaleString()}
                    </div>
                    <div className={`text-xl font-semibold flex items-center justify-center gap-2 ${
                      portfolioData.dayChange > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className="w-5 h-5" />
                      +${portfolioData.dayChange.toLocaleString()} 
                      ({portfolioData.dayChangePercent}%)
                    </div>
                    <div className="text-gray-300 text-sm mt-2">24h Change</div>
                  </div>

                  {/* Top Holdings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className={`w-5 h-5 ${getTemplateAccent(selectedTemplate)}`} />
                      Top Holdings
                    </h3>
                    <div className="space-y-3">
                      {portfolioData.holdings.slice(0, 4).map((holding) => (
                        <div key={holding.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${getTemplateClasses(selectedTemplate)} flex items-center justify-center font-bold`}>
                              {holding.symbol}
                            </div>
                            <div>
                              <div className="font-semibold">{holding.symbol}</div>
                              <div className="text-sm text-gray-400">{holding.amount} {holding.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${holding.value.toLocaleString()}</div>
                            <div className={`text-sm ${holding.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {holding.change > 0 ? '+' : ''}${holding.change} ({holding.changePercent}%)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                      <Zap className={`w-4 h-4 ${getTemplateAccent(selectedTemplate)}`} />
                      <span className="text-sm">Powered by NebulaX</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Controls and Preview */}
          <div>
            {/* Capture Controls */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-green-400" />
                  Capture & Share
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={capturePortfolio}
                  disabled={isCapturing}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {isCapturing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Capturing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Take Screenshot
                    </>
                  )}
                </Button>

                {capturedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={downloadImage} variant="outline" className="border-gray-600">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={copyImageToClipboard} variant="outline" className="border-gray-600">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        onClick={() => shareToSocial('twitter')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => shareToSocial('facebook')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => shareToSocial('instagram')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Instagram className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            {capturedImage && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={capturedImage} 
                    alt="Portfolio Screenshot" 
                    className="w-full rounded-lg border border-gray-600/30"
                  />
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <div>• Choose different templates to match your mood</div>
                <div>• Best time to flex is during green days 📈</div>
                <div>• Add #CryptoGains to get more engagement</div>
                <div>• Remember: DYOR and trade responsibly</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}