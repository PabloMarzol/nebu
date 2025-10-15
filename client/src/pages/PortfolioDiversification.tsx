import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Shuffle,
  Brain,
  DollarSign,
  RefreshCw,
  Clock,
  Info,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PortfolioDiversification() {
  const [currentAllocation] = useState([
    { asset: 'Bitcoin (BTC)', percentage: 51.3, target: 35, status: 'overweight' },
    { asset: 'Ethereum (ETH)', percentage: 28.5, target: 25, status: 'optimal' },
    { asset: 'Cardano (ADA)', percentage: 9.1, target: 15, status: 'underweight' },
    { asset: 'Solana (SOL)', percentage: 6.8, target: 10, status: 'underweight' },
    { asset: 'Polkadot (DOT)', percentage: 4.2, target: 5, status: 'underweight' },
    { asset: 'Chainlink (LINK)', percentage: 0, target: 5, status: 'missing' },
    { asset: 'Polygon (MATIC)', percentage: 0, target: 5, status: 'missing' }
  ]);

  const diversificationScore = 6.8;
  const correlationRisk = 'Medium';

  // Dialog state management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    title: string;
    description: string;
    type: string;
    details: string[];
  } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Function to handle modal confirmation
  const confirmExecution = async () => {
    console.log("Execute Now button clicked in PortfolioDiversification!");
    console.log("Before execution - isDialogOpen:", isDialogOpen);
    setIsExecuting(true);
    try {
      console.log("Starting execution simulation...");
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Portfolio action executed successfully!");
      console.log("Closing modal after execution...");
      
      setIsDialogOpen(false);
      setCurrentAction(null);
      
      console.log("Execute - Modal should be closed now");
    } catch (error) {
      console.error("Error executing portfolio action:", error);
    } finally {
      setIsExecuting(false);
      console.log("Execute - isExecuting set to false");
      
      // Force modal close after execution
      setTimeout(() => {
        setIsDialogOpen(false);
        setCurrentAction(null);
        console.log("Execute - Force close completed");
      }, 100);
    }
  };

  // Function to handle modal cancellation
  const handleCancelExecution = () => {
    console.log("Cancel button clicked in PortfolioDiversification!");
    console.log("Before cancel - isDialogOpen:", isDialogOpen);
    setIsDialogOpen(false);
    setCurrentAction(null);
    setIsExecuting(false);
    console.log("Cancel - State reset completed");
    
    // Force re-render
    setTimeout(() => {
      console.log("Cancel - Force state check - isDialogOpen should be false:", isDialogOpen);
    }, 100);
  };

  // Execute functions for portfolio rebalancing
  const startRebalancing = () => {
    console.log("Starting portfolio rebalancing...");
    setCurrentAction({
      title: "Start Portfolio Rebalancing",
      description: "Execute portfolio rebalancing with dollar-cost averaging over 7 days",
      type: "rebalancing",
      details: [
        "• BTC: Reduce from 51.3% to 35% (-$4,300)",
        "• Add LINK position: 5% (+$1,200)",
        "• Add MATIC position: 5% (+$1,200)",
        "• Expected completion: 7 days",
        "• Strategy: Dollar-cost averaging"
      ]
    });
    setIsDialogOpen(true);
  };

  const autoRebalanceNow = () => {
    console.log("Executing immediate auto-rebalancing...");
    setCurrentAction({
      title: "Auto-Rebalance Now",
      description: "Execute immediate portfolio rebalancing with optimized execution",
      type: "auto-rebalance",
      details: [
        "• BTC: Reduce from 51.3% to 35% (-$4,300)",
        "• LINK: Add 5% position (+$1,200)",
        "• MATIC: Add 5% position (+$1,200)",
        "• Expected completion: 2-3 hours",
        "• Gas optimization: Enabled"
      ]
    });
    setIsDialogOpen(true);
  };

  const scheduleRebalancing = () => {
    console.log("Scheduling portfolio rebalancing...");
    setCurrentAction({
      title: "Schedule Rebalancing",
      description: "Set up automated portfolio rebalancing schedule",
      type: "schedule",
      details: [
        "• Next execution: End of this month",
        "• Frequency: Monthly",
        "• Trigger: ±5% allocation drift",
        "• DCA period: 7 days",
        "• Auto-approve: Under $5,000"
      ]
    });
    setIsDialogOpen(true);
  };

  const manualReview = () => {
    console.log("Opening manual review interface...");
    setCurrentAction({
      title: "Manual Review Mode",
      description: "Review each trade individually before execution",
      type: "manual",
      details: [
        "• BTC reduction: $4,300 (Review required)",
        "• USDC addition: $2,400 (Review required)",
        "• Emerging sector: $1,900 (Review required)",
        "• Each trade requires confirmation",
        "• Real-time market data included"
      ]
    });
    setIsDialogOpen(true);
  };

  const enableAutoRebalancing = () => {
    console.log("Enabling auto-rebalancing...");
    setCurrentAction({
      title: "Enable Auto-Rebalancing",
      description: "Activate automated portfolio management",
      type: "enable-auto",
      details: [
        "• Trigger: ±5% drift threshold",
        "• Frequency: Monthly",
        "• DCA period: 7 days",
        "• Gas optimization: On",
        "• Slippage tolerance: 1%"
      ]
    });
    setIsDialogOpen(true);
  };

  const customizeSettings = () => {
    console.log("Opening customization settings...");
    setCurrentAction({
      title: "Customize Auto-Rebalancing",
      description: "Configure advanced rebalancing parameters",
      type: "customize",
      details: [
        "• Drift threshold: 3% - 10%",
        "• Frequency: Weekly/Monthly/Quarterly",
        "• DCA period: 1-14 days",
        "• Slippage tolerance: 0.5% - 5%",
        "• Advanced risk controls"
      ]
    });
    setIsDialogOpen(true);
  };



  const rebalanceRecommendations = [
    {
      action: 'Reduce',
      asset: 'Bitcoin (BTC)',
      current: 51.3,
      target: 35,
      amount: '$14,250',
      reason: 'Reduce concentration risk'
    },
    {
      action: 'Increase',
      asset: 'Cardano (ADA)',
      current: 9.1,
      target: 15,
      amount: '+$5,180',
      reason: 'Improve sector diversification'
    },
    {
      action: 'Add',
      asset: 'Chainlink (LINK)',
      current: 0,
      target: 5,
      amount: '+$4,380',
      reason: 'Oracle infrastructure exposure'
    },
    {
      action: 'Add',
      asset: 'Polygon (MATIC)',
      current: 0,
      target: 5,
      amount: '+$4,380',
      reason: 'Layer 2 scaling solution'
    }
  ];

  const sectorAnalysis = [
    { sector: 'Store of Value', allocation: 51.3, target: 35, assets: ['BTC'] },
    { sector: 'Smart Contracts', allocation: 28.5, target: 30, assets: ['ETH', 'ADA', 'SOL', 'DOT'] },
    { sector: 'DeFi Infrastructure', allocation: 0, target: 15, assets: ['LINK', 'UNI', 'AAVE'] },
    { sector: 'Scaling Solutions', allocation: 0, target: 10, assets: ['MATIC', 'ARB', 'OP'] },
    { sector: 'Privacy Coins', allocation: 0, target: 5, assets: ['XMR', 'ZEC'] },
    { sector: 'Gaming/NFTs', allocation: 0, target: 5, assets: ['AXS', 'SAND', 'ENJ'] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400 bg-green-500/20';
      case 'overweight': return 'text-red-400 bg-red-500/20';
      case 'underweight': return 'text-yellow-400 bg-yellow-500/20';
      case 'missing': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Reduce': return 'text-red-400';
      case 'Increase': return 'text-blue-400';
      case 'Add': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 Portfolio Diversification Assistant</h1>
          <p className="text-gray-300">AI-powered portfolio optimization and diversification recommendations</p>
        </div>

        {/* Diversification Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Diversification Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{diversificationScore}/10</div>
              <Progress value={diversificationScore * 10} className="mb-2" />
              <Badge className="bg-yellow-500/20 text-yellow-400">Needs Improvement</Badge>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Correlation Risk</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{correlationRisk}</div>
              <p className="text-sm text-gray-400">
                High correlation between major holdings increases portfolio volatility
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shuffle className="w-5 h-5" />
                <span>Rebalance Needed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2 text-orange-400">Yes</div>
              <p className="text-sm text-gray-400">
                4 recommended adjustments to optimize your portfolio
              </p>
              <Button 
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600"
                onClick={startRebalancing}
              >
                Start Rebalancing
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="current">Current State</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Current vs Target Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentAllocation.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.asset}</span>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Current: {item.percentage}%</span>
                          <span>Target: {item.target}%</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${item.target}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Portfolio Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                    <PieChart className="w-16 h-16 text-purple-400 opacity-50" />
                    <div className="ml-4 text-center">
                      <p className="text-lg font-semibold">Interactive Portfolio Chart</p>
                      <p className="text-gray-400">Visual allocation breakdown</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle>Concentration Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">⚠️ High Concentration</h4>
                    <p className="text-sm">BTC represents 51.3% of portfolio (recommended max: 40%)</p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2">📊 Sector Gaps</h4>
                    <p className="text-sm">Missing exposure to DeFi infrastructure and scaling solutions</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">🔄 Correlation Risk</h4>
                    <p className="text-sm">High correlation between ETH, ADA, SOL, and DOT (0.75+ correlation)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI-Generated Rebalancing Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rebalanceRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getActionColor(rec.action)}`}>
                          {rec.action}
                        </div>
                        <div>
                          <div className="font-semibold">{rec.asset}</div>
                          <div className="text-sm text-gray-400">{rec.reason}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{rec.current}% → {rec.target}%</div>
                        <div className="text-sm text-gray-400">{rec.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">Expected Improvements</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Diversification score: 6.8 → 8.4 (+23%)</li>
                    <li>• Correlation risk: Medium → Low</li>
                    <li>• Risk-adjusted returns: +15% improvement</li>
                    <li>• Maximum drawdown: -8.2% → -6.1%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Execution Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={autoRebalanceNow}
                    >
                      Auto-Rebalance Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={scheduleRebalancing}
                    >
                      Schedule Rebalancing
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={manualReview}
                    >
                      Manual Review
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-sm text-blue-300">
                      💡 Pro tip: Dollar-cost averaging over 7 days reduces market impact
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Portfolio Risk</span>
                      <span className="text-yellow-400">Medium → Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Liquidity Risk</span>
                      <span className="text-green-400">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Correlation Risk</span>
                      <span className="text-yellow-400">Medium → Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Concentration Risk</span>
                      <span className="text-red-400">High → Medium</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sectors" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Sector Diversification Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sectorAnalysis.map((sector, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{sector.sector}</h4>
                        <div className="text-sm">
                          Current: {sector.allocation}% | Target: {sector.target}%
                        </div>
                      </div>
                      <Progress value={(sector.allocation / sector.target) * 100} />
                      <div className="flex flex-wrap gap-2">
                        {sector.assets.map((asset, assetIndex) => (
                          <Badge key={assetIndex} variant="outline" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle>Recommended Sector Additions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">🏗️ DeFi Infrastructure</h4>
                    <p className="text-sm mb-3">Add exposure to decentralized finance protocols</p>
                    <div className="space-y-1 text-xs">
                      <div>• Uniswap (UNI) - 3%</div>
                      <div>• Aave (AAVE) - 2%</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">⚡ Scaling Solutions</h4>
                    <p className="text-sm mb-3">Layer 2 and interoperability protocols</p>
                    <div className="space-y-1 text-xs">
                      <div>• Polygon (MATIC) - 3%</div>
                      <div>• Arbitrum (ARB) - 2%</div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">🎮 Web3 Gaming</h4>
                    <p className="text-sm mb-3">Gaming and metaverse exposure</p>
                    <div className="space-y-1 text-xs">
                      <div>• Axie Infinity (AXS) - 2%</div>
                      <div>• The Sandbox (SAND) - 1%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>AI Market Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">📈 Market Opportunity</h4>
                      <p className="text-sm mb-2">
                        Layer 2 scaling solutions showing 40% outperformance over the last 30 days. 
                        Adding MATIC and ARB exposure could capture this momentum.
                      </p>
                      <Badge className="bg-blue-500/20 text-blue-400">Confidence: 78%</Badge>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Risk Alert</h4>
                      <p className="text-sm mb-2">
                        High correlation (0.85) detected between ETH, ADA, and SOL. Consider adding 
                        uncorrelated assets like privacy coins or commodities-backed tokens.
                      </p>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Confidence: 92%</Badge>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">💡 Optimization Insight</h4>
                      <p className="text-sm mb-2">
                        Your portfolio shows strong fundamentals but lacks exposure to yield-generating 
                        assets. Consider staking positions or DeFi protocols for passive income.
                      </p>
                      <Badge className="bg-green-500/20 text-green-400">Confidence: 85%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Automated Rebalancing Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Trigger Conditions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Allocation drift threshold</span>
                          <Badge variant="outline">±5%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Rebalancing frequency</span>
                          <Badge variant="outline">Monthly</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Market volatility trigger</span>
                          <Badge variant="outline">VIX &gt; 30</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Execution Method</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">DCA period</span>
                          <Badge variant="outline">7 days</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gas optimization</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Slippage tolerance</span>
                          <Badge variant="outline">1%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <Button 
                      className="bg-purple-500 hover:bg-purple-600"
                      onClick={enableAutoRebalancing}
                    >
                      Enable Auto-Rebalancing
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={customizeSettings}
                    >
                      Customize Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Execution Dialog */}
        {isDialogOpen && currentAction && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
              console.log("Background clicked - should not close");
              e.stopPropagation();
            }}
          >
            <div 
              className="w-full max-w-md mx-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/30 rounded-lg text-white shadow-2xl"
              onClick={(e) => {
                console.log("Modal content clicked");
                e.stopPropagation();
              }}
            >
              <div className="p-6">
                {/* Header with close button */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center flex-1">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Execute Portfolio Action</h2>
                    <p className="text-slate-300 text-sm mt-2">Confirm your portfolio management action</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      console.log("Close X button clicked");
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelExecution();
                    }}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mt-6">
                {/* Action Details */}
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">
                    {currentAction?.title || "Portfolio Optimization"}
                  </h4>
                  <p className="text-sm text-slate-300 mb-3">
                    {currentAction?.description || "Execute portfolio rebalancing to improve diversification and risk profile."}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-2 text-green-400 flex-shrink-0" />
                      Reduce overweight Bitcoin allocation by 15%
                    </div>
                    <div className="text-xs text-slate-300 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-2 text-green-400 flex-shrink-0" />
                      Add exposure to underweight altcoins
                    </div>
                    <div className="text-xs text-slate-300 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-2 text-green-400 flex-shrink-0" />
                      Improve portfolio diversification score
                    </div>
                  </div>
                </div>

                {/* Action Type Badge */}
                <div className="flex justify-center">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-400" variant="outline">
                    {currentAction?.type?.toUpperCase() || "REBALANCING"}
                  </Badge>
                </div>

                {/* Execution Impact */}
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                  <h5 className="font-semibold text-green-400 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Expected Outcome
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-slate-400">Risk Score</div>
                      <div className="font-semibold text-green-400">Improved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400">Diversification</div>
                      <div className="font-semibold text-purple-400">Enhanced</div>
                    </div>
                  </div>
                </div>

                {/* Timing Info */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">2-4 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Optimized execution</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onMouseDown={(e) => {
                      console.log("Cancel button mousedown - PortfolioDiversification");
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      console.log("Cancel button clicked - PortfolioDiversification!");
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelExecution();
                    }}
                    disabled={isExecuting}
                    className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onMouseDown={(e) => {
                      console.log("Execute button mousedown - PortfolioDiversification");
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      console.log("Execute Now button clicked - PortfolioDiversification!");
                      e.preventDefault();
                      e.stopPropagation();
                      confirmExecution();
                    }}
                    disabled={isExecuting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Execute Now
                      </>
                    )}
                  </button>
                </div>

                {/* Professional Disclaimer */}
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-yellow-200">
                      Portfolio actions involve trading fees and market risk. All executions use professional-grade algorithms to minimize impact and optimize outcomes.
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}