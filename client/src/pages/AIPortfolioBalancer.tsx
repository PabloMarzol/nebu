import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Activity,
  DollarSign,
  Clock,
  Shield,
  BarChart3
} from "lucide-react";

export default function AIPortfolioBalancer() {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [rebalanceMode, setRebalanceMode] = useState('conservative');

  const portfolioStatus = {
    totalValue: 87654.32,
    lastRebalance: '3 days ago',
    nextRebalance: 'In 4 days',
    efficiency: 8.7,
    aiConfidence: 94
  };

  const currentPositions = [
    { asset: 'BTC', current: 51.3, target: 35, action: 'reduce', amount: '-$14,250' },
    { asset: 'ETH', current: 28.5, target: 30, action: 'increase', amount: '+$1,310' },
    { asset: 'ADA', current: 9.1, target: 15, action: 'increase', amount: '+$5,180' },
    { asset: 'SOL', current: 6.8, target: 10, action: 'increase', amount: '+$2,800' },
    { asset: 'DOT', current: 4.2, target: 5, action: 'increase', amount: '+$700' },
    { asset: 'LINK', current: 0, target: 5, action: 'add', amount: '+$4,380' }
  ];

  const aiStrategies = [
    {
      name: 'Conservative Rebalancing',
      description: 'Gradual adjustments with minimal market impact',
      riskLevel: 'Low',
      expectedReturn: '8-12%',
      timeframe: '7-14 days',
      active: rebalanceMode === 'conservative'
    },
    {
      name: 'Aggressive Rebalancing',
      description: 'Quick adjustments to capture opportunities',
      riskLevel: 'Medium',
      expectedReturn: '12-18%',
      timeframe: '1-3 days',
      active: rebalanceMode === 'aggressive'
    },
    {
      name: 'Momentum Following',
      description: 'AI-driven trend analysis and positioning',
      riskLevel: 'High',
      expectedReturn: '15-25%',
      timeframe: 'Real-time',
      active: rebalanceMode === 'momentum'
    }
  ];

  const rebalanceHistory = [
    { date: '2024-06-22', action: 'Reduced BTC exposure', result: '+2.34%', confidence: 89 },
    { date: '2024-06-15', action: 'Added LINK position', result: '+5.67%', confidence: 92 },
    { date: '2024-06-08', action: 'Increased ETH allocation', result: '+1.23%', confidence: 87 },
    { date: '2024-06-01', action: 'DeFi sector rebalancing', result: '+8.91%', confidence: 95 }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'reduce': return 'text-red-400';
      case 'increase': return 'text-blue-400';
      case 'add': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'High': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🤖 AI Portfolio Balancer</h1>
          <p className="text-gray-300">Intelligent portfolio rebalancing and optimization powered by machine learning</p>
        </div>

        {/* AI Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span>AI Enabled</span>
                <Switch checked={isAIEnabled} onCheckedChange={setIsAIEnabled} />
              </div>
              <div className="text-sm text-gray-400">
                {isAIEnabled ? 'Active monitoring' : 'Manual mode'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Portfolio Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{portfolioStatus.efficiency}/10</div>
              <Progress value={portfolioStatus.efficiency * 10} className="mb-2" />
              <div className="text-sm text-gray-400">Optimization score</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 text-green-400">{portfolioStatus.aiConfidence}%</div>
              <Progress value={portfolioStatus.aiConfidence} className="mb-2" />
              <div className="text-sm text-gray-400">Recommendation accuracy</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Next Rebalance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-2">{portfolioStatus.nextRebalance}</div>
              <div className="text-sm text-gray-400">
                Last: {portfolioStatus.lastRebalance}
              </div>
              <Button size="sm" className="mt-2 w-full bg-blue-500 hover:bg-blue-600">
                Rebalance Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="current">Current State</TabsTrigger>
            <TabsTrigger value="strategies">AI Strategies</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Rebalancing Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentPositions.map((position, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{position.asset}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{position.asset}</div>
                            <div className="text-sm text-gray-400">
                              {position.current}% → {position.target}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getActionColor(position.action)}`}>
                            {position.action.toUpperCase()}
                          </div>
                          <div className="text-sm">{position.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Real-time Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-1">✅ Market Opportunity</h4>
                      <p className="text-sm">DeFi sector showing 15% outperformance. Recommend increasing LINK allocation.</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-1">⚠️ Risk Alert</h4>
                      <p className="text-sm">BTC concentration above optimal threshold. Consider reducing exposure.</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-1">📊 Correlation Update</h4>
                      <p className="text-sm">ETH-SOL correlation decreased to 0.65. Good diversification opportunity.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Execution Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-400">Phase 1: Risk Reduction</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Reduce BTC from 51.3% to 45%</div>
                      <div>• Timeline: 2-3 days</div>
                      <div>• Method: DCA selling</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-400">Phase 2: Diversification</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Add LINK position (5%)</div>
                      <div>• Increase ADA to 15%</div>
                      <div>• Timeline: 3-5 days</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-purple-400">Phase 3: Optimization</h4>
                    <div className="space-y-2 text-sm">
                      <div>• Fine-tune ETH/SOL ratio</div>
                      <div>• Monitor and adjust</div>
                      <div>• Timeline: Ongoing</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Play className="w-4 h-4 mr-2" />
                    Execute Plan
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                  <Button variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Simulate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategies" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {aiStrategies.map((strategy, index) => (
                <Card 
                  key={index} 
                  className={`bg-black/20 backdrop-blur-lg border-white/10 cursor-pointer transition-all ${
                    strategy.active ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setRebalanceMode(strategy.name.toLowerCase().split(' ')[0])}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{strategy.name}</span>
                      {strategy.active && <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-4">{strategy.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Risk Level:</span>
                        <Badge className={getRiskColor(strategy.riskLevel)}>
                          {strategy.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Return:</span>
                        <span className="text-sm font-semibold text-green-400">{strategy.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Timeframe:</span>
                        <span className="text-sm">{strategy.timeframe}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Strategy Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Strategy</th>
                        <th className="text-left p-3">Accuracy</th>
                        <th className="text-left p-3">Avg Return</th>
                        <th className="text-left p-3">Max Drawdown</th>
                        <th className="text-left p-3">Trades/Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="p-3">Conservative</td>
                        <td className="p-3 text-green-400">94%</td>
                        <td className="p-3">+10.2%</td>
                        <td className="p-3">-3.4%</td>
                        <td className="p-3">2-3</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3">Aggressive</td>
                        <td className="p-3 text-yellow-400">87%</td>
                        <td className="p-3">+15.7%</td>
                        <td className="p-3">-8.1%</td>
                        <td className="p-3">8-12</td>
                      </tr>
                      <tr>
                        <td className="p-3">Momentum</td>
                        <td className="p-3 text-red-400">78%</td>
                        <td className="p-3">+22.3%</td>
                        <td className="p-3">-15.2%</td>
                        <td className="p-3">20-30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Auto-Rebalancing</h4>
                        <p className="text-sm text-gray-400">Automatically execute rebalancing recommendations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Risk Monitoring</h4>
                        <p className="text-sm text-gray-400">Monitor and alert on portfolio risk changes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Market Opportunity Alerts</h4>
                        <p className="text-sm text-gray-400">Notify when significant opportunities arise</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Gas Optimization</h4>
                        <p className="text-sm text-gray-400">Optimize transaction timing for lower fees</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Trigger Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Allocation Drift Threshold</label>
                      <div className="flex items-center space-x-4">
                        <Progress value={50} className="flex-1" />
                        <span className="text-sm">±5%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Rebalancing Frequency</label>
                      <div className="flex items-center space-x-4">
                        <Progress value={33} className="flex-1" />
                        <span className="text-sm">Weekly</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Risk Tolerance</label>
                      <div className="flex items-center space-x-4">
                        <Progress value={60} className="flex-1" />
                        <span className="text-sm">Moderate</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Market Volatility Trigger</label>
                      <div className="flex items-center space-x-4">
                        <Progress value={70} className="flex-1" />
                        <span className="text-sm">VIX &gt; 30</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Safety Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">💰 Position Limits</h4>
                    <p className="text-sm mb-2">Maximum single asset allocation: 40%</p>
                    <p className="text-sm">Daily rebalancing limit: 10% of portfolio</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">⏰ Time Controls</h4>
                    <p className="text-sm mb-2">Minimum time between rebalances: 24 hours</p>
                    <p className="text-sm">Trading hours: 24/7 with volatility monitoring</p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2">🛡️ Emergency Stop</h4>
                    <p className="text-sm mb-2">Auto-pause on extreme market conditions</p>
                    <p className="text-sm">Manual override always available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Rebalancing History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rebalanceHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div>
                          <div className="font-semibold">{entry.action}</div>
                          <div className="text-sm text-gray-400">{entry.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">{entry.result}</div>
                        <div className="text-sm text-gray-400">Confidence: {entry.confidence}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Rebalances</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-semibold text-green-400">91.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Improvement</span>
                      <span className="font-semibold text-blue-400">+4.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Alpha Generated</span>
                      <span className="font-semibold text-purple-400">+18.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>AI Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Pattern Recognition</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Risk Assessment Accuracy</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Optimization Efficiency</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Prediction Confidence</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}