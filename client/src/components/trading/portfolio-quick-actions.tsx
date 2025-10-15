import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  TrendingUp, 
  Zap,
  Target,
  ArrowRight,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  action: string;
  impact: string;
  urgency: "high" | "medium" | "low";
  estimatedTime: string;
}

export default function PortfolioQuickActions() {
  const [isExecuting, setIsExecuting] = useState(false);

  const portfolioStats = {
    totalValue: 47750,
    diversificationScore: 72,
    riskScore: 68,
    topRisk: "BTC concentration (45%)"
  };

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Reduce BTC Exposure",
      description: "Sell $4,300 BTC to improve balance",
      action: "Sell 0.1 BTC",
      impact: "+12% diversification",
      urgency: "high",
      estimatedTime: "2 min"
    },
    {
      id: "2",
      title: "Add Stablecoin Buffer",
      description: "Add USDC for stability",
      action: "Buy $2,400 USDC",
      impact: "-8% volatility",
      urgency: "medium",
      estimatedTime: "1 min"
    },
    {
      id: "3",
      title: "Diversify Sectors",
      description: "Add AI token exposure",
      action: "Buy $1,900 FET",
      impact: "+15% sector diversity",
      urgency: "low",
      estimatedTime: "3 min"
    }
  ];

  const executeQuickRebalance = async () => {
    setIsExecuting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExecuting(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/10 border-green-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <Card className="glass border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="w-6 h-6 text-purple-400" />
            <span>Portfolio Assistant</span>
          </div>
          <Link href="/portfolio">
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-1" />
              Full Analysis
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <DollarSign className="w-4 h-4 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-400 mb-1">
              ${portfolioStats.totalValue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Portfolio Value</div>
          </div>
          
          <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Activity className="w-4 h-4 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-400 mb-1">
              {portfolioStats.diversificationScore}
            </div>
            <div className="text-xs text-muted-foreground">Diversification</div>
          </div>
        </div>

        {/* Current Risk Alert */}
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-base font-semibold text-red-400 mb-2">
                Portfolio Risk Alert
              </div>
              <div className="text-sm text-red-300">
                {portfolioStats.topRisk}
              </div>
            </div>
          </div>
        </div>

        {/* One-Click Rebalance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Quick Rebalancing</h4>
            <Badge variant="outline" className="text-purple-400 border-purple-400/50">
              AI Optimized
            </Badge>
          </div>
          
          <Button 
            onClick={executeQuickRebalance}
            disabled={isExecuting}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base"
          >
            {isExecuting ? (
              <>
                <Activity className="w-5 h-5 mr-2 animate-pulse" />
                Executing Rebalance...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                One-Click Rebalance
              </>
            )}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground pt-2">
            Expected improvement: +12% diversification, -8% risk
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold">Suggested Actions</h4>
          <div className="space-y-4">
            {quickActions.slice(0, 2).map((action) => (
              <div key={action.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-base font-semibold">{action.title}</div>
                    <Badge className={getUrgencyColor(action.urgency)} variant="outline">
                      {action.urgency}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {action.estimatedTime}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-3">
                  {action.description}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-green-400 font-semibold">{action.impact}</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-9">
                    <ArrowRight className="w-4 h-4 mr-1" />
                    {action.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-base font-semibold text-green-400">
              AI Optimization Ready
            </div>
          </div>
          <div className="text-sm text-green-300">
            Portfolio analysis updated 2 minutes ago. All rebalancing suggestions are current.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}