import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Brain, Zap, TrendingUp, TrendingDown, RotateCcw, Camera, AlertTriangle, CheckCircle } from "lucide-react";

interface PortfolioAsset {
  symbol: string;
  currentAllocation: number;
  targetAllocation: number;
  value: number;
  change24h: number;
  riskScore: number;
  recommendation: "buy" | "sell" | "hold";
}

interface PortfolioHealth {
  overallScore: number;
  diversification: number;
  riskLevel: "low" | "medium" | "high";
  volatility: number;
  sharpeRatio: number;
  recommendations: string[];
}

export default function AIPortfolioBalancer() {
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [portfolioHealth, setPortfolioHealth] = useState<PortfolioHealth>({
    overallScore: 78,
    diversification: 85,
    riskLevel: "medium",
    volatility: 45,
    sharpeRatio: 1.34,
    recommendations: [
      "Consider reducing BTC allocation by 5%",
      "Increase exposure to DeFi tokens",
      "Your portfolio is well-diversified"
    ]
  });

  const [assets, setAssets] = useState<PortfolioAsset[]>([
    {
      symbol: "BTC",
      currentAllocation: 45,
      targetAllocation: 40,
      value: 22500,
      change24h: 2.4,
      riskScore: 35,
      recommendation: "sell"
    },
    {
      symbol: "ETH",
      currentAllocation: 30,
      targetAllocation: 35,
      value: 15000,
      change24h: 3.8,
      riskScore: 42,
      recommendation: "buy"
    },
    {
      symbol: "SOL",
      currentAllocation: 15,
      targetAllocation: 15,
      value: 7500,
      change24h: -1.2,
      riskScore: 58,
      recommendation: "hold"
    },
    {
      symbol: "ADA",
      currentAllocation: 10,
      targetAllocation: 10,
      value: 5000,
      change24h: 0.8,
      riskScore: 45,
      recommendation: "hold"
    }
  ]);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const executeRebalancing = async () => {
    setIsRebalancing(true);
    
    // Simulate AI rebalancing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAssets(prev => prev.map(asset => ({
      ...asset,
      currentAllocation: asset.targetAllocation,
      recommendation: "hold" as const
    })));
    
    setPortfolioHealth(prev => ({
      ...prev,
      overallScore: Math.min(95, prev.overallScore + 10),
      recommendations: ["Portfolio successfully rebalanced", "Optimal allocation achieved"]
    }));
    
    setLastUpdate(new Date());
    setIsRebalancing(false);
  };

  const takePortfolioSnapshot = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    
    // Create portfolio snapshot visualization
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 600);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Portfolio Health Snapshot', 50, 50);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Overall Score: ${portfolioHealth.overallScore}/100`, 50, 100);
    ctx.fillText(`Total Value: $${totalValue.toLocaleString()}`, 50, 130);
    ctx.fillText(`Risk Level: ${portfolioHealth.riskLevel}`, 50, 160);
    
    // Download the snapshot
    const link = document.createElement('a');
    link.download = `portfolio_snapshot_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy": return "text-green-400 border-green-400";
      case "sell": return "text-red-400 border-red-400";
      default: return "text-yellow-400 border-yellow-400";
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-400";
    if (score < 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        change24h: asset.change24h + (Math.random() - 0.5) * 0.5,
        value: asset.value * (1 + (Math.random() - 0.5) * 0.01)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Portfolio Health Overview */}
      <Card className="glass">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>AI Portfolio Health</span>
            </CardTitle>
            <Button 
              onClick={takePortfolioSnapshot}
              size="sm"
              variant="outline"
              className="glass"
            >
              <Camera className="w-4 h-4 mr-2" />
              Snapshot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getHealthColor(portfolioHealth.overallScore)}`}>
                {portfolioHealth.overallScore}
              </div>
              <div className="text-sm text-muted-foreground">Health Score</div>
              <Progress value={portfolioHealth.overallScore} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getHealthColor(portfolioHealth.diversification)}`}>
                {portfolioHealth.diversification}%
              </div>
              <div className="text-sm text-muted-foreground">Diversification</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{portfolioHealth.sharpeRatio}</div>
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
            <div>
              <div className="font-semibold">Risk Level: {portfolioHealth.riskLevel.toUpperCase()}</div>
              <div className="text-sm text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>
            </div>
            <Badge className={`${portfolioHealth.riskLevel === "low" ? "bg-green-500" : portfolioHealth.riskLevel === "medium" ? "bg-yellow-500" : "bg-red-500"}`}>
              {portfolioHealth.riskLevel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioHealth.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Allocation */}
      <Card className="glass">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>One-Click Portfolio Balancing</CardTitle>
            <Button 
              onClick={executeRebalancing}
              disabled={isRebalancing}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isRebalancing ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Rebalancing...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Auto-Rebalance
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <Card key={asset.symbol} className="glass-strong">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold">{asset.symbol}</div>
                      <Badge variant="outline" className={getRecommendationColor(asset.recommendation)}>
                        {asset.recommendation.toUpperCase()}
                      </Badge>
                      <div className={`flex items-center space-x-1 text-sm ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${asset.value.toLocaleString()}</div>
                      <div className={`text-sm ${getRiskColor(asset.riskScore)}`}>
                        Risk: {asset.riskScore}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current</span>
                        <span>{asset.currentAllocation}%</span>
                      </div>
                      <Progress value={asset.currentAllocation} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target</span>
                        <span>{asset.targetAllocation}%</span>
                      </div>
                      <Progress value={asset.targetAllocation} className="h-2" />
                    </div>
                  </div>

                  {Math.abs(asset.currentAllocation - asset.targetAllocation) > 2 && (
                    <div className="mt-2 flex items-center space-x-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400">
                        {asset.currentAllocation > asset.targetAllocation ? 'Over-allocated' : 'Under-allocated'} by {Math.abs(asset.currentAllocation - asset.targetAllocation)}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Analytics */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Portfolio Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-slate-800/30">
              <div className="text-xl font-bold text-purple-400">{portfolioHealth.volatility}%</div>
              <div className="text-sm text-muted-foreground">30-Day Volatility</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/30">
              <div className="text-xl font-bold text-green-400">+12.4%</div>
              <div className="text-sm text-muted-foreground">Monthly Return</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/30">
              <div className="text-xl font-bold text-cyan-400">4</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}