import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeftRight,
  ArrowDown,
  Network,
  Clock,
  DollarSign,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface CrossChainBridgeProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface Chain {
  id: string;
  name: string;
  symbol: string;
  color: string;
  gasToken: string;
  avgGas: string;
  bridgeTime: string;
}

interface BridgeTransaction {
  id: string;
  from: Chain;
  to: Chain;
  asset: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: Date;
  fee: number;
  estimatedTime: string;
}

export default function CrossChainBridge({ userTier = 'basic' }: CrossChainBridgeProps) {
  const [fromChain, setFromChain] = useState<string>('ethereum');
  const [toChain, setToChain] = useState<string>('bsc');
  const [asset, setAsset] = useState<string>('USDT');
  const [amount, setAmount] = useState<string>('');
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bridgeFee, setBridgeFee] = useState<number>(0);

  const { toast } = useToast();

  const chains: Chain[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      color: '#627EEA',
      gasToken: 'ETH',
      avgGas: '$25',
      bridgeTime: '15-30 min'
    },
    {
      id: 'bsc',
      name: 'Binance Smart Chain',
      symbol: 'BSC',
      color: '#F3BA2F',
      gasToken: 'BNB',
      avgGas: '$0.50',
      bridgeTime: '3-5 min'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      color: '#8247E5',
      gasToken: 'MATIC',
      avgGas: '$0.10',
      bridgeTime: '10-20 min'
    },
    {
      id: 'avalanche',
      name: 'Avalanche',
      symbol: 'AVAX',
      color: '#E84142',
      gasToken: 'AVAX',
      avgGas: '$2',
      bridgeTime: '5-10 min'
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      symbol: 'ARB',
      color: '#28A0F0',
      gasToken: 'ETH',
      avgGas: '$3',
      bridgeTime: '7-12 min'
    }
  ];

  const supportedAssets = ['USDT', 'USDC', 'ETH', 'BNB', 'MATIC', 'AVAX', 'LINK', 'UNI'];

  useEffect(() => {
    // Calculate bridge fee based on amount and chains
    if (amount && parseFloat(amount) > 0) {
      const baseAmount = parseFloat(amount);
      const fromChainData = chains.find(c => c.id === fromChain);
      const toChainData = chains.find(c => c.id === toChain);
      
      let fee = baseAmount * 0.003; // 0.3% base fee
      
      // Add gas estimates
      if (fromChainData?.avgGas) {
        const gasValue = parseFloat(fromChainData.avgGas.replace('$', ''));
        fee += gasValue;
      }
      
      setBridgeFee(fee);
    } else {
      setBridgeFee(0);
    }
  }, [amount, fromChain, toChain]);

  const initiateBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to bridge",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    const fromChainData = chains.find(c => c.id === fromChain);
    const toChainData = chains.find(c => c.id === toChain);

    if (!fromChainData || !toChainData) return;

    const newTransaction: BridgeTransaction = {
      id: Date.now().toString(),
      from: fromChainData,
      to: toChainData,
      asset,
      amount: parseFloat(amount),
      status: 'pending',
      timestamp: new Date(),
      fee: bridgeFee,
      estimatedTime: toChainData.bridgeTime
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Simulate bridge process
    setTimeout(() => {
      setTransactions(prev => prev.map(tx => 
        tx.id === newTransaction.id ? { ...tx, status: 'confirmed' } : tx
      ));
    }, 2000);

    setTimeout(() => {
      setTransactions(prev => prev.map(tx => 
        tx.id === newTransaction.id ? { ...tx, status: 'completed' } : tx
      ));
      
      toast({
        title: "Bridge Completed",
        description: `Successfully bridged ${amount} ${asset} to ${toChainData.name}`,
        variant: "default"
      });
    }, 5000);

    setIsProcessing(false);
    setAmount('');
  };

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'confirmed':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-yellow-500/30 bg-yellow-500/20';
      case 'confirmed': return 'border-blue-500/30 bg-blue-500/20';
      case 'completed': return 'border-green-500/30 bg-green-500/20';
      case 'failed': return 'border-red-500/30 bg-red-500/20';
      default: return 'border-gray-500/30 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Cross-Chain Bridge
          </h1>
          <p className="text-gray-300">
            Transfer assets seamlessly across multiple blockchains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bridge Interface */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                <span>Bridge Assets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Chain */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
                <Select value={fromChain} onValueChange={setFromChain}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.filter(c => c.id !== toChain).map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: chain.color }}
                          />
                          <span>{chain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapChains}
                  className="rounded-full p-2 bg-white/10 hover:bg-white/20"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Chain */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">To</label>
                <Select value={toChain} onValueChange={setToChain}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.filter(c => c.id !== fromChain).map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: chain.color }}
                          />
                          <span>{chain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Selection */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Asset</label>
                <Select value={asset} onValueChange={setAsset}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedAssets.map((assetSymbol) => (
                      <SelectItem key={assetSymbol} value={assetSymbol}>
                        {assetSymbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Bridge Info */}
              {amount && parseFloat(amount) > 0 && (
                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bridge Fee</span>
                    <span>${bridgeFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>You'll Receive</span>
                    <span>{(parseFloat(amount) - bridgeFee).toFixed(4)} {asset}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Time</span>
                    <span>{chains.find(c => c.id === toChain)?.bridgeTime}</span>
                  </div>
                </div>
              )}

              {/* Bridge Button */}
              <Button
                onClick={initiateBridge}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? 'Processing...' : 'Bridge Assets'}
              </Button>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-purple-400" />
                <span>Bridge Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No bridge transactions yet</p>
                  <p className="text-sm">Start bridging assets to see your transaction history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${getStatusColor(tx.status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(tx.status)}
                          <span className="font-medium">
                            {tx.amount} {tx.asset}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tx.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tx.from.color }}
                        />
                        <span>{tx.from.name}</span>
                        <ArrowLeftRight className="w-3 h-3" />
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tx.to.color }}
                        />
                        <span>{tx.to.name}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{tx.timestamp.toLocaleTimeString()}</span>
                        <span>Fee: ${tx.fee.toFixed(2)}</span>
                      </div>
                      
                      {tx.status === 'pending' || tx.status === 'confirmed' ? (
                        <div className="mt-2 text-xs text-gray-400">
                          ETA: {tx.estimatedTime}
                        </div>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Supported Chains Overview */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Supported Blockchains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {chains.map((chain) => (
                  <div key={chain.id} className="text-center p-4 bg-white/5 rounded-lg">
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: chain.color }}
                    >
                      {chain.symbol}
                    </div>
                    <h4 className="font-semibold text-sm">{chain.name}</h4>
                    <p className="text-xs text-gray-400">Gas: {chain.avgGas}</p>
                    <p className="text-xs text-gray-400">Time: {chain.bridgeTime}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}