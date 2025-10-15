import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  PieChart, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Shield,
  DollarSign,
  RefreshCw,
  Play,
  Settings,
  Info,
  ArrowRight,
  Sparkles,
  Activity,
  Timer,
  Users,
  Brain,
  Clock,
  X
} from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  percentage: number;
  category: string;
  riskLevel: "Low" | "Medium" | "High";
  performance24h: number;
  marketCap: string;
}

interface DiversificationSuggestion {
  id: string;
  type: "rebalance" | "add" | "reduce" | "swap";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  fromToken?: string;
  toToken?: string;
  amount: number;
  expectedImpact: {
    riskReduction: number;
    diversificationScore: number;
    potentialReturn: number;
  };
  reasoning: string[];
  confidence: number;
  timeframe: string;
  category: string;
  strategyAllocation?: Record<string, number>;
}

interface DiversificationStrategy {
  name: string;
  description: string;
  riskLevel: "Conservative" | "Moderate" | "Aggressive";
  allocation: {
    [category: string]: number;
  };
  expectedReturn: number;
  riskScore: number;
  active: boolean;
}

interface PortfolioAnalysis {
  currentValue: number;
  diversificationScore: number;
  riskScore: number;
  concentrationRisk: number;
  categoryBreakdown: { [key: string]: number };
  topRisks: string[];
  opportunities: string[];
  overallHealth: "Excellent" | "Good" | "Fair" | "Poor";
}

export default function PortfolioDiversificationAssistant() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("balanced");
  const [riskTolerance, setRiskTolerance] = useState([60]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<DiversificationSuggestion | null>(null);

  // Function to handle modal confirmation
  const handleConfirmExecution = async () => {
    console.log("Execute Now button clicked in PortfolioDiversificationAssistant!");
    console.log("Before execution - isDialogOpen:", isDialogOpen);
    setIsExecuting(true);
    try {
      console.log("Starting execution simulation...");
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Portfolio action executed successfully!");
      console.log("Closing modal after execution...");
      
      setIsDialogOpen(false);
      setCurrentSuggestion(null);
      
      console.log("Execute - Modal should be closed now");
    } catch (error) {
      console.error("Error executing portfolio action:", error);
    } finally {
      setIsExecuting(false);
      console.log("Execute - isExecuting set to false");
      
      // Force modal close after execution
      setTimeout(() => {
        setIsDialogOpen(false);
        setCurrentSuggestion(null);
        console.log("Execute - Force close completed");
      }, 100);
    }
  };

  // Function to handle modal cancellation
  const handleCancelExecution = () => {
    console.log("Cancel button clicked in PortfolioDiversificationAssistant!");
    console.log("Before cancel - isDialogOpen:", isDialogOpen);
    setIsDialogOpen(false);
    setCurrentSuggestion(null);
    setIsExecuting(false);
    console.log("Cancel - State reset completed");
    
    // Force re-render
    setTimeout(() => {
      console.log("Cancel - Force state check - isDialogOpen should be false:", isDialogOpen);
    }, 100);
  };



  // Function to execute rebalancing (referenced by button)
  const executeRebalancing = () => {
    console.log("Opening rebalancing modal...");
    setCurrentSuggestion({
      id: "rebalance-1",
      type: "rebalance",
      priority: "medium",
      title: "Portfolio Rebalancing",
      description: "Optimize your portfolio allocation based on current market conditions",
      amount: 15000,
      expectedImpact: {
        riskReduction: 12,
        diversificationScore: 8,
        potentialReturn: 6
      },
      reasoning: ["Reduce overweight positions", "Add underweight assets"],
      confidence: 85,
      timeframe: "2-4 hours",
      category: "rebalancing"
    });
    setIsDialogOpen(true);
  };

  // Function to preview rebalancing changes
  const previewRebalancingChanges = () => {
    console.log("Opening preview changes modal...");
    setCurrentSuggestion({
      id: "preview-rebalancing",
      type: "rebalance",
      priority: "high",
      title: "Preview Rebalancing Changes",
      description: "Review the proposed portfolio changes before execution. This preview shows exactly what trades will be executed.",
      amount: portfolioAnalysis.currentValue,
      expectedImpact: {
        riskReduction: 12,
        diversificationScore: 15,
        potentialReturn: 8
      },
      reasoning: [
        "Reduce BTC allocation by $4,300 (currently overweight)",
        "Add USDC position of $2,400 (increase stability)",
        "Add emerging sector exposure $1,900 (improve diversification)",
        "Expected improvement: +12% diversification score",
        `Risk tolerance setting: ${riskTolerance[0]}%`,
        `Auto-rebalancing: ${autoRebalance ? 'Enabled' : 'Disabled'}`
      ],
      confidence: 92,
      timeframe: "Immediate execution",
      category: "preview-rebalancing"
    });
    setIsDialogOpen(true);
  };

  const currentHoldings: PortfolioHolding[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.5,
      value: 21500,
      percentage: 45,
      category: "Store of Value",
      riskLevel: "Medium",
      performance24h: 2.3,
      marketCap: "$845B"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 8.2,
      value: 13800,
      percentage: 29,
      category: "Smart Contracts",
      riskLevel: "Medium",
      performance24h: -1.2,
      marketCap: "$285B"
    },
    {
      symbol: "SOL",
      name: "Solana",
      amount: 45,
      value: 4950,
      percentage: 10.4,
      category: "Smart Contracts",
      riskLevel: "High",
      performance24h: 5.7,
      marketCap: "$45B"
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      amount: 285,
      value: 3420,
      percentage: 7.2,
      category: "Oracle",
      riskLevel: "High",
      performance24h: -2.8,
      marketCap: "$8.2B"
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      amount: 520,
      value: 3120,
      percentage: 6.5,
      category: "DeFi",
      riskLevel: "High",
      performance24h: 3.1,
      marketCap: "$4.8B"
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      amount: 1200,
      value: 960,
      percentage: 2,
      category: "Layer 2",
      riskLevel: "High",
      performance24h: -0.5,
      marketCap: "$7.1B"
    }
  ];

  const portfolioAnalysis: PortfolioAnalysis = {
    currentValue: 47750,
    diversificationScore: 72,
    riskScore: 68,
    concentrationRisk: 74,
    categoryBreakdown: {
      "Store of Value": 45,
      "Smart Contracts": 39.4,
      "Oracle": 7.2,
      "DeFi": 6.5,
      "Layer 2": 2
    },
    topRisks: [
      "Over-concentration in BTC (45%)",
      "High exposure to smart contract platforms",
      "Missing stablecoin allocation",
      "No exposure to emerging sectors"
    ],
    opportunities: [
      "Add stablecoin allocation for stability",
      "Diversify into AI/ML tokens",
      "Consider privacy coins",
      "Add real-world asset tokens"
    ],
    overallHealth: "Fair"
  };

  const suggestions: DiversificationSuggestion[] = [
    {
      id: "1",
      type: "reduce",
      priority: "high",
      title: "Reduce BTC Concentration",
      description: "Your BTC allocation (45%) exceeds recommended limits. Consider reducing to 30-35%.",
      fromToken: "BTC",
      amount: 4300,
      expectedImpact: {
        riskReduction: 15,
        diversificationScore: 12,
        potentialReturn: 8
      },
      reasoning: [
        "Reduces single-asset concentration risk",
        "Improves overall portfolio balance",
        "Aligns with institutional allocation models"
      ],
      confidence: 94,
      timeframe: "Immediate",
      category: "Risk Management"
    },
    {
      id: "2",
      type: "add",
      priority: "high",
      title: "Add Stablecoin Allocation",
      description: "Missing stablecoin exposure for portfolio stability and rebalancing opportunities.",
      toToken: "USDC",
      amount: 2400,
      expectedImpact: {
        riskReduction: 12,
        diversificationScore: 8,
        potentialReturn: 4
      },
      reasoning: [
        "Provides portfolio stability",
        "Enables quick rebalancing opportunities",
        "Reduces overall volatility"
      ],
      confidence: 89,
      timeframe: "Immediate",
      category: "Stability"
    },
    {
      id: "3",
      type: "add",
      priority: "medium",
      title: "Diversify into AI/ML Sector",
      description: "Add exposure to emerging AI and machine learning blockchain projects.",
      toToken: "FET",
      amount: 1900,
      expectedImpact: {
        riskReduction: -5,
        diversificationScore: 15,
        potentialReturn: 25
      },
      reasoning: [
        "Exposure to high-growth AI sector",
        "Diversifies beyond current categories",
        "Strong future potential"
      ],
      confidence: 76,
      timeframe: "1-2 weeks",
      category: "Growth"
    },
    {
      id: "4",
      type: "swap",
      priority: "medium",
      title: "Optimize Smart Contract Exposure",
      description: "Swap some ETH for alternative L1s to reduce smart contract platform concentration.",
      fromToken: "ETH",
      toToken: "ADA",
      amount: 2800,
      expectedImpact: {
        riskReduction: 8,
        diversificationScore: 10,
        potentialReturn: 12
      },
      reasoning: [
        "Reduces ETH concentration",
        "Adds alternative L1 exposure",
        "Improves sector diversification"
      ],
      confidence: 71,
      timeframe: "This week",
      category: "Diversification"
    }
  ];

  const strategies: DiversificationStrategy[] = [
    {
      name: "Conservative Balance",
      description: "Lower risk with stable returns and reduced volatility",
      riskLevel: "Conservative",
      allocation: {
        "Store of Value": 50,
        "Stablecoins": 25,
        "Large Cap": 15,
        "DeFi": 10
      },
      expectedReturn: 8,
      riskScore: 35,
      active: false
    },
    {
      name: "Balanced Growth",
      description: "Optimal risk-return balance with diversified exposure",
      riskLevel: "Moderate",
      allocation: {
        "Store of Value": 35,
        "Smart Contracts": 25,
        "DeFi": 15,
        "Stablecoins": 15,
        "Emerging": 10
      },
      expectedReturn: 15,
      riskScore: 55,
      active: true
    },
    {
      name: "Aggressive Growth",
      description: "Higher risk with maximum growth potential",
      riskLevel: "Aggressive",
      allocation: {
        "Store of Value": 25,
        "Smart Contracts": 30,
        "DeFi": 20,
        "Emerging": 15,
        "Stablecoins": 10
      },
      expectedReturn: 25,
      riskScore: 75,
      active: false
    }
  ];





  const executeSuggestion = async (suggestion: DiversificationSuggestion) => {
    console.log(`Executing suggestion: ${suggestion.title}`);
    setCurrentSuggestion(suggestion);
    setIsDialogOpen(true);
  };

  // Function to execute strategy application
  const executeStrategy = async (strategy: DiversificationStrategy) => {
    console.log(`Applying strategy: ${strategy.name}`);
    
    // Create strategy suggestion for modal
    const strategySuggestion: DiversificationSuggestion = {
      id: `strategy-${strategy.name.toLowerCase().replace(/\s+/g, '-')}`,
      type: "rebalance",
      priority: "high",
      title: `Apply ${strategy.name} Strategy`,
      description: `Rebalance your portfolio according to the ${strategy.name} allocation model. ${strategy.description}`,
      amount: portfolioAnalysis.currentValue,
      expectedImpact: {
        riskReduction: strategy.riskLevel === "Conservative" ? 25 : strategy.riskLevel === "Moderate" ? 5 : -10,
        diversificationScore: 20,
        potentialReturn: strategy.expectedReturn
      },
      reasoning: [
        `Target allocation: ${Object.entries(strategy.allocation).map(([cat, pct]) => `${cat} ${pct}%`).join(', ')}`,
        `Risk level: ${strategy.riskLevel}`,
        `Expected return: ${strategy.expectedReturn}%`,
        "Automated rebalancing with optimal execution"
      ],
      confidence: 90,
      timeframe: "5-15 minutes",
      category: "strategy-implementation",
      strategyAllocation: strategy.allocation
    };
    
    setCurrentSuggestion(strategySuggestion);
    setIsDialogOpen(true);
  };





  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "High": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/10 border-green-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "Excellent": return "text-green-400";
      case "Good": return "text-blue-400";
      case "Fair": return "text-yellow-400";
      case "Poor": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Portfolio Diversification Assistant
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered portfolio analysis and one-click rebalancing
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass border-blue-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ${portfolioAnalysis.currentValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/30">
          <CardContent className="p-6 text-center">
            <PieChart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {portfolioAnalysis.diversificationScore}
            </div>
            <div className="text-sm text-muted-foreground">Diversification Score</div>
            <Progress value={portfolioAnalysis.diversificationScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {portfolioAnalysis.riskScore}
            </div>
            <div className="text-sm text-muted-foreground">Risk Score</div>
            <Progress value={portfolioAnalysis.riskScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass border-green-500/30">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className={`text-2xl font-bold mb-1 ${getHealthColor(portfolioAnalysis.overallHealth)}`}>
              {portfolioAnalysis.overallHealth}
            </div>
            <div className="text-sm text-muted-foreground">Portfolio Health</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="execution">Execute</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Current Holdings */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  <span>Current Holdings</span>
                </div>
                <Badge variant="outline">{currentHoldings.length} Assets</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentHoldings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {holding.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{holding.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <span>{holding.amount} {holding.symbol}</span>
                          <Badge className={getRiskColor(holding.riskLevel)} variant="outline">
                            {holding.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">${holding.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{holding.percentage}%</div>
                      <div className={`text-sm font-semibold ${holding.performance24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.performance24h >= 0 ? '+' : ''}{holding.performance24h}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <span>Risk Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolioAnalysis.topRisks.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-sm font-semibold text-red-400 mb-1">
                    Concentration Risk: {portfolioAnalysis.concentrationRisk}%
                  </div>
                  <Progress value={portfolioAnalysis.concentrationRisk} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span>Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolioAnalysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-sm font-semibold text-green-400">
                    Potential improvement: +18% diversification score
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        {suggestion.type === "add" && <Target className="w-5 h-5 text-green-400" />}
                        {suggestion.type === "reduce" && <TrendingUp className="w-5 h-5 text-red-400" />}
                        {suggestion.type === "swap" && <RefreshCw className="w-5 h-5 text-blue-400" />}
                        {suggestion.type === "rebalance" && <PieChart className="w-5 h-5 text-purple-400" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getPriorityColor(suggestion.priority)} variant="outline">
                        {suggestion.priority} priority
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {suggestion.confidence}% confidence
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-sm text-muted-foreground">Risk Reduction</div>
                      <div className="font-semibold text-blue-400">
                        {suggestion.expectedImpact.riskReduction >= 0 ? '+' : ''}{suggestion.expectedImpact.riskReduction}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                      <div className="text-sm text-muted-foreground">Diversification</div>
                      <div className="font-semibold text-purple-400">
                        +{suggestion.expectedImpact.diversificationScore}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <div className="text-sm text-muted-foreground">Potential Return</div>
                      <div className="font-semibold text-green-400">
                        +{suggestion.expectedImpact.potentialReturn}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-semibold">Why this helps:</div>
                    <div className="space-y-1">
                      {suggestion.reasoning.map((reason, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs">
                          <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>{suggestion.timeframe}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${suggestion.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => executeSuggestion(suggestion)}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Execute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {strategies.map((strategy, index) => (
              <Card key={index} className={`glass hover:shadow-2xl transition-all duration-300 ${strategy.active ? 'border-purple-500/50' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{strategy.name}</span>
                    {strategy.active && <Badge className="bg-purple-500">Active</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Level:</span>
                      <Badge className={getRiskColor(strategy.riskLevel === "Conservative" ? "Low" : strategy.riskLevel === "Moderate" ? "Medium" : "High")} variant="outline">
                        {strategy.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Return:</span>
                      <span className="font-semibold text-green-400">{strategy.expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk Score:</span>
                      <span className="font-semibold">{strategy.riskScore}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Allocation:</div>
                    {Object.entries(strategy.allocation).map(([category, percentage]) => (
                      <div key={category} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{category}:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{percentage}%</span>
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-400" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={strategy.active ? "outline" : "default"}
                    onClick={() => {
                      console.log(`Apply Strategy clicked: ${strategy.name}`);
                      executeStrategy(strategy);
                    }}
                    disabled={strategy.active}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {strategy.active ? "Current Strategy" : "Apply Strategy"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="execution" className="space-y-6">
          <Card className="glass border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-green-400" />
                <span>One-Click Rebalancing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Auto-Rebalancing</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically rebalance when deviation exceeds threshold
                    </div>
                  </div>
                  <Switch checked={autoRebalance} onCheckedChange={setAutoRebalance} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Risk Tolerance</span>
                    <span className="text-sm">{riskTolerance[0]}%</span>
                  </div>
                  <Slider
                    value={riskTolerance}
                    onValueChange={setRiskTolerance}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Execution Summary */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-sm font-semibold mb-2">Rebalancing Summary:</div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Reduce BTC allocation by $4,300</div>
                  <div>• Add USDC position of $2,400</div>
                  <div>• Add emerging sector exposure $1,900</div>
                  <div>• Expected improvement: +12% diversification</div>
                </div>
              </div>

              {/* Execution Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={previewRebalancingChanges}
                  disabled={isAnalyzing}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Preview Changes
                </Button>
                
                <Button 
                  onClick={executeRebalancing}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Execute Rebalancing
                    </>
                  )}
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <strong>Important:</strong> Rebalancing involves buying and selling assets which may incur fees and tax implications. 
                    Review all changes before executing. Past performance does not guarantee future results.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Execution Dialog */}
      {isDialogOpen && currentSuggestion && (
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
                  <p className="text-slate-300 text-sm mt-2">Confirm your portfolio diversification action</p>
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
                  {currentSuggestion?.title || "Portfolio Rebalancing"}
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  {currentSuggestion?.description || "Optimize your portfolio allocation based on current market conditions and risk assessment."}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-slate-400">Amount</div>
                    <div className="font-semibold text-green-400">
                      ${currentSuggestion?.amount?.toLocaleString() || "15,000"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-400">Priority</div>
                    <Badge className="border-yellow-500/30 text-yellow-400" variant="outline">
                      {currentSuggestion?.priority || "Medium"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Expected Impact */}
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <h5 className="font-semibold text-blue-400 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Expected Impact
                </h5>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-slate-400">Risk Reduction</div>
                    <div className="font-semibold text-blue-400">
                      +{currentSuggestion?.expectedImpact?.riskReduction || "12"}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Diversification</div>
                    <div className="font-semibold text-purple-400">
                      +{currentSuggestion?.expectedImpact?.diversificationScore || "8"}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400">Return</div>
                    <div className="font-semibold text-green-400">
                      +{currentSuggestion?.expectedImpact?.potentialReturn || "6"}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence & Timeframe */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">Confidence: {currentSuggestion?.confidence || "85"}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">{currentSuggestion?.timeframe || "2-4 hours"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onMouseDown={(e) => {
                    console.log("Cancel button mousedown");
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    console.log("Cancel button clicked!");
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
                    console.log("Execute button mousedown");
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    console.log("Execute Now button clicked!");
                    e.preventDefault();
                    e.stopPropagation();
                    handleConfirmExecution();
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

              {/* Disclaimer */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-200">
                    This action will execute trades and may incur fees. Review all details before confirming.
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}