import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shuffle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ArbitrageDetectorProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface ArbitrageOpportunity {
  id: string;
  asset: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitPercent: number;
  volume: number;
  confidence: number;
  timeWindow: number;
  gasEstimate: number;
  status: 'active' | 'executing' | 'completed' | 'expired';
  detectedAt: Date;
}

interface ExecutedArbitrage {
  id: string;
  opportunity: ArbitrageOpportunity;
  executedAt: Date;
  actualProfit: number;
  txHash: string;
  status: 'success' | 'failed';
}

export default function ArbitrageDetector({ userTier = 'basic' }: ArbitrageDetectorProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [executedTrades, setExecutedTrades] = useState<ExecutedArbitrage[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [autoExecute, setAutoExecute] = useState(false);
  const [minProfitThreshold, setMinProfitThreshold] = useState(0.5);
  const [totalProfit, setTotalProfit] = useState(0);

  const { toast } = useToast();

  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Uniswap', 'SushiSwap', 'PancakeSwap', '1inch'];
  const assets = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'MATIC', 'LINK', 'UNI'];

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        generateOpportunities();
      }, 3000 + Math.random() * 2000); // 3-5 seconds

      return () => clearInterval(interval);
    }
  }, [isScanning, minProfitThreshold]);

  useEffect(() => {
    // Auto-execute opportunities if enabled
    if (autoExecute && userTier !== 'basic') {
      opportunities
        .filter(opp => opp.status === 'active' && opp.profitPercent >= minProfitThreshold)
        .forEach(opp => {
          if (Math.random() > 0.7) { // 30% chance to execute each opportunity
            executeArbitrage(opp.id);
          }
        });
    }
  }, [opportunities, autoExecute, userTier, minProfitThreshold]);

  useEffect(() => {
    // Calculate total profit
    const total = executedTrades
      .filter(trade => trade.status === 'success')
      .reduce((sum, trade) => sum + trade.actualProfit, 0);
    setTotalProfit(total);
  }, [executedTrades]);

  const generateOpportunities = () => {
    // Remove expired opportunities
    setOpportunities(prev => prev.filter(opp => 
      Date.now() - opp.detectedAt.getTime() < opp.timeWindow * 1000
    ));

    // Generate new opportunities
    const newOpportunities: ArbitrageOpportunity[] = [];
    const numNewOpps = Math.floor(Math.random() * 3) + 1; // 1-3 new opportunities

    for (let i = 0; i < numNewOpps; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const buyExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
      let sellExchange;
      do {
        sellExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
      } while (sellExchange === buyExchange);

      const basePrice = getAssetPrice(asset);
      const priceVariation = 0.005 + Math.random() * 0.02; // 0.5% to 2.5% difference
      
      const buyPrice = basePrice * (1 - priceVariation / 2);
      const sellPrice = basePrice * (1 + priceVariation / 2);
      const profit = sellPrice - buyPrice;
      const profitPercent = (profit / buyPrice) * 100;

      if (profitPercent >= 0.1) { // Only show opportunities with at least 0.1% profit
        const opportunity: ArbitrageOpportunity = {
          id: Date.now().toString() + i,
          asset,
          buyExchange,
          sellExchange,
          buyPrice,
          sellPrice,
          profit,
          profitPercent,
          volume: 10000 + Math.random() * 50000,
          confidence: 70 + Math.random() * 25,
          timeWindow: 30 + Math.random() * 120, // 30-150 seconds
          gasEstimate: 0.003 + Math.random() * 0.007,
          status: 'active',
          detectedAt: new Date()
        };

        newOpportunities.push(opportunity);
      }
    }

    if (newOpportunities.length > 0) {
      setOpportunities(prev => [...prev, ...newOpportunities].slice(0, 10)); // Keep max 10
    }
  };

  const getAssetPrice = (asset: string): number => {
    const prices: { [key: string]: number } = {
      BTC: 43250,
      ETH: 2680,
      USDT: 1.00,
      USDC: 1.00,
      BNB: 315,
      ADA: 0.52,
      SOL: 98,
      MATIC: 0.85,
      LINK: 15.2,
      UNI: 8.5
    };
    return prices[asset] || 100;
  };

  const executeArbitrage = async (opportunityId: string) => {
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;

    // Update status to executing
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId ? { ...opp, status: 'executing' } : opp
    ));

    toast({
      title: "Executing Arbitrage",
      description: `${opportunity.asset}: ${opportunity.buyExchange} → ${opportunity.sellExchange}`,
      variant: "default"
    });

    // Simulate execution
    setTimeout(() => {
      const success = Math.random() > 0.15; // 85% success rate
      const slippage = 0.9 + Math.random() * 0.15; // 90-105% of expected profit
      
      const executedTrade: ExecutedArbitrage = {
        id: Date.now().toString(),
        opportunity,
        executedAt: new Date(),
        actualProfit: success ? opportunity.profit * slippage - opportunity.gasEstimate * getAssetPrice('ETH') : -opportunity.gasEstimate * getAssetPrice('ETH'),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: success ? 'success' : 'failed'
      };

      setExecutedTrades(prev => [executedTrade, ...prev.slice(0, 19)]); // Keep last 20

      // Update opportunity status
      setOpportunities(prev => prev.map(opp => 
        opp.id === opportunityId ? { ...opp, status: 'completed' } : opp
      ));

      if (success) {
        toast({
          title: "Arbitrage Successful",
          description: `Profit: $${executedTrade.actualProfit.toFixed(2)}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Arbitrage Failed",
          description: "Transaction failed or became unprofitable",
          variant: "destructive"
        });
      }
    }, 2000 + Math.random() * 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500/30 bg-green-500/20';
      case 'executing': return 'border-blue-500/30 bg-blue-500/20';
      case 'completed': return 'border-gray-500/30 bg-gray-500/20';
      case 'expired': return 'border-red-500/30 bg-red-500/20';
      default: return 'border-white/10 bg-white/5';
    }
  };

  const getProfitColor = (profitPercent: number) => {
    if (profitPercent >= 1.0) return 'text-green-400';
    if (profitPercent >= 0.5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Arbitrage Detection Engine
          </h1>
          <p className="text-gray-300">
            Real-time cross-exchange arbitrage opportunities
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-green-400">${totalProfit.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Total Profit</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold">{opportunities.filter(o => o.status === 'active').length}</div>
              <div className="text-sm text-gray-400">Active Opportunities</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{executedTrades.filter(t => t.status === 'success').length}</div>
              <div className="text-sm text-gray-400">Successful Trades</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">
                {executedTrades.length > 0 ? 
                  (executedTrades.filter(t => t.status === 'success').length / executedTrades.length * 100).toFixed(1) : 0
                }%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scanner Controls</span>
              <div className="flex items-center space-x-2">
                <Badge variant={isScanning ? "default" : "secondary"}>
                  {isScanning ? 'Scanning' : 'Paused'}
                </Badge>
                {isScanning && <RefreshCw className="w-4 h-4 animate-spin" />}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <span>Auto-Scanning</span>
                <Button
                  variant={isScanning ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsScanning(!isScanning)}
                >
                  {isScanning ? 'Pause' : 'Start'}
                </Button>
              </div>
              
              {userTier !== 'basic' && (
                <div className="flex items-center justify-between">
                  <span>Auto-Execute</span>
                  <Button
                    variant={autoExecute ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoExecute(!autoExecute)}
                  >
                    {autoExecute ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Min Profit:</span>
                <input
                  type="number"
                  step="0.1"
                  value={minProfitThreshold}
                  onChange={(e) => setMinProfitThreshold(parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm"
                />
                <span className="text-sm">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Opportunities */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Live Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {opportunities.filter(opp => opp.status === 'active').length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No opportunities detected</p>
                    <p className="text-sm">Scanner is {isScanning ? 'looking for' : 'paused -'} arbitrage opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {opportunities
                      .filter(opp => opp.status === 'active')
                      .sort((a, b) => b.profitPercent - a.profitPercent)
                      .map((opp) => (
                        <motion.div
                          key={opp.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-4 rounded-lg border ${getStatusColor(opp.status)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-lg">{opp.asset}</span>
                              <Badge variant="outline" className="text-xs">
                                {opp.confidence.toFixed(0)}% confidence
                              </Badge>
                            </div>
                            <div className={`text-xl font-bold ${getProfitColor(opp.profitPercent)}`}>
                              +{opp.profitPercent.toFixed(2)}%
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <span className="text-gray-400">Buy: </span>
                              <span className="font-medium">{opp.buyExchange}</span>
                              <div className="text-green-400">${opp.buyPrice.toFixed(4)}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Sell: </span>
                              <span className="font-medium">{opp.sellExchange}</span>
                              <div className="text-red-400">${opp.sellPrice.toFixed(4)}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-3">
                            <div>Profit: ${opp.profit.toFixed(2)}</div>
                            <div>Volume: ${(opp.volume / 1000).toFixed(0)}K</div>
                            <div>Gas: ${(opp.gasEstimate * getAssetPrice('ETH')).toFixed(2)}</div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                              Expires in {Math.max(0, Math.floor((opp.timeWindow * 1000 - (Date.now() - opp.detectedAt.getTime())) / 1000))}s
                            </span>
                            <Progress 
                              value={Math.max(0, (1 - (Date.now() - opp.detectedAt.getTime()) / (opp.timeWindow * 1000)) * 100)} 
                              className="w-20 h-1" 
                            />
                          </div>
                          
                          <Button
                            onClick={() => executeArbitrage(opp.id)}
                            disabled={opp.status === 'executing' || userTier === 'basic'}
                            size="sm"
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          >
                            {opp.status === 'executing' ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Shuffle className="w-4 h-4 mr-2" />
                            )}
                            {opp.status === 'executing' ? 'Executing...' : 
                             userTier === 'basic' ? 'Upgrade Required' : 'Execute'}
                          </Button>
                        </motion.div>
                      ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Execution History */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Execution History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {executedTrades.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No executed trades yet</p>
                  <p className="text-sm">Arbitrage execution history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {executedTrades.slice(0, 10).map((trade) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {trade.status === 'success' ? 
                            <CheckCircle className="w-4 h-4 text-green-400" /> :
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          }
                          <span className="font-medium">{trade.opportunity.asset}</span>
                        </div>
                        <div className={`font-bold ${trade.actualProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.actualProfit >= 0 ? '+' : ''}${trade.actualProfit.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-1">
                        {trade.opportunity.buyExchange} → {trade.opportunity.sellExchange}
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{trade.executedAt.toLocaleTimeString()}</span>
                        <span className="font-mono">
                          {trade.txHash.slice(0, 8)}...{trade.txHash.slice(-6)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}