import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowRightLeft, 
  Zap, 
  Shield, 
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  History
} from "lucide-react";

interface SupportedChain {
  id: string;
  name: string;
  logo: string;
  nativeToken: string;
  bridgeFee: number;
  estimatedTime: string;
  status: "active" | "maintenance" | "congested";
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  token: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: string;
  txHash: string;
  estimatedCompletion: string;
}

export default function CrossChainBridge() {
  const [fromChain, setFromChain] = useState("");
  const [toChain, setToChain] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const supportedChains: SupportedChain[] = [
    {
      id: "ethereum",
      name: "Ethereum",
      logo: "⟠",
      nativeToken: "ETH",
      bridgeFee: 0.005,
      estimatedTime: "10-15 min",
      status: "active"
    },
    {
      id: "binance",
      name: "BNB Chain",
      logo: "⚡",
      nativeToken: "BNB",
      bridgeFee: 0.001,
      estimatedTime: "3-5 min",
      status: "active"
    },
    {
      id: "polygon",
      name: "Polygon",
      logo: "🔷",
      nativeToken: "MATIC",
      bridgeFee: 0.1,
      estimatedTime: "5-8 min",
      status: "active"
    },
    {
      id: "arbitrum",
      name: "Arbitrum",
      logo: "🔵",
      nativeToken: "ETH",
      bridgeFee: 0.002,
      estimatedTime: "8-12 min",
      status: "active"
    },
    {
      id: "optimism",
      name: "Optimism",
      logo: "🔴",
      nativeToken: "ETH",
      bridgeFee: 0.003,
      estimatedTime: "7-10 min",
      status: "active"
    },
    {
      id: "avalanche",
      name: "Avalanche",
      logo: "🔺",
      nativeToken: "AVAX",
      bridgeFee: 0.25,
      estimatedTime: "2-4 min",
      status: "congested"
    }
  ];

  const supportedTokens = [
    { symbol: "NEBX", name: "NebulaX Token", logo: "⭐" },
    { symbol: "USDT", name: "Tether USD", logo: "💵" },
    { symbol: "USDC", name: "USD Coin", logo: "🔷" },
    { symbol: "ETH", name: "Ethereum", logo: "⟠" },
    { symbol: "BNB", name: "BNB", logo: "⚡" },
    { symbol: "MATIC", name: "Polygon", logo: "🔷" }
  ];

  const recentTransactions: BridgeTransaction[] = [
    {
      id: "tx-001",
      fromChain: "Ethereum",
      toChain: "Polygon",
      token: "NEBX",
      amount: 1000,
      status: "completed",
      timestamp: "2024-12-10T10:30:00Z",
      txHash: "0x1a2b3c4d5e6f...",
      estimatedCompletion: "2024-12-10T10:45:00Z"
    },
    {
      id: "tx-002",
      fromChain: "BNB Chain",
      toChain: "Arbitrum",
      token: "USDT",
      amount: 500,
      status: "processing",
      timestamp: "2024-12-10T11:15:00Z",
      txHash: "0x2b3c4d5e6f7a...",
      estimatedCompletion: "2024-12-10T11:27:00Z"
    },
    {
      id: "tx-003",
      fromChain: "Polygon",
      toChain: "Ethereum",
      token: "USDC",
      amount: 2500,
      status: "pending",
      timestamp: "2024-12-10T11:45:00Z",
      txHash: "0x3c4d5e6f7a8b...",
      estimatedCompletion: "2024-12-10T12:00:00Z"
    }
  ];

  const getChainStatus = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "maintenance":
        return <Badge className="bg-red-600 text-white">Maintenance</Badge>;
      case "congested":
        return <Badge className="bg-yellow-600 text-white">Congested</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTransactionStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-600 text-white"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600 text-white"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calculateBridgeFee = () => {
    if (!fromChain || !amount) return 0;
    const chain = supportedChains.find(c => c.id === fromChain);
    const bridgeAmount = parseFloat(amount) || 0;
    return chain ? (chain.bridgeFee + bridgeAmount * 0.001) : 0;
  };

  const getEstimatedTime = () => {
    if (!fromChain) return "Select chain";
    const chain = supportedChains.find(c => c.id === fromChain);
    return chain?.estimatedTime || "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Cross-Chain Bridge
          </span>
        </h2>
        <p className="text-lg text-muted-foreground">
          Seamlessly transfer tokens across multiple blockchain networks
        </p>
      </div>

      {/* Bridge Form */}
      <Card className="glass border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
            <span>Bridge Tokens</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chain Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">From Chain</label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source chain" />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{chain.logo}</span>
                        <span>{chain.name}</span>
                        {getChainStatus(chain.status)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">To Chain</label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination chain" />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains.filter(c => c.id !== fromChain).map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{chain.logo}</span>
                        <span>{chain.name}</span>
                        {getChainStatus(chain.status)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Token Selection */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Token</label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select token to bridge" />
              </SelectTrigger>
              <SelectContent>
                {supportedTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{token.logo}</span>
                      <span>{token.symbol}</span>
                      <span className="text-muted-foreground">({token.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Amount</label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to bridge"
                className="text-right font-mono pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                {selectedToken}
              </div>
            </div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Recipient Address (Optional)</label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Leave empty to use same address"
              className="font-mono"
            />
          </div>

          {/* Bridge Summary */}
          {fromChain && toChain && selectedToken && amount && (
            <div className="p-4 bg-muted/20 rounded-lg space-y-3">
              <h4 className="font-semibold">Bridge Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You will send:</span>
                  <span className="font-semibold">{amount} {selectedToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bridge fee:</span>
                  <span className="font-semibold">{calculateBridgeFee().toFixed(6)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You will receive:</span>
                  <span className="font-semibold">{(parseFloat(amount) * 0.999).toFixed(6)} {selectedToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated time:</span>
                  <span className="font-semibold">{getEstimatedTime()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bridge Button */}
          <Button 
            className="w-full" 
            size="lg"
            disabled={!fromChain || !toChain || !selectedToken || !amount}
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Bridge Tokens
          </Button>

          {/* Security Notice */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold">Security Notice</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All bridge transactions are secured by multi-signature protocols and audited smart contracts. 
              Always verify recipient addresses before confirming transfers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5 text-purple-400" />
            <span>Recent Bridge Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{tx.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{tx.token}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{tx.fromChain}</span>
                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{tx.toChain}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Est: {new Date(tx.estimatedCompletion).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getTransactionStatus(tx.status)}
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported Chains Grid */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Supported Networks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {supportedChains.map((chain) => (
              <div key={chain.id} className="p-4 border border-border rounded-lg text-center">
                <div className="text-3xl mb-2">{chain.logo}</div>
                <h3 className="font-semibold mb-1">{chain.name}</h3>
                <div className="text-sm text-muted-foreground mb-2">{chain.nativeToken}</div>
                <div className="space-y-1">
                  {getChainStatus(chain.status)}
                  <div className="text-xs text-muted-foreground">
                    Fee: {chain.bridgeFee} {chain.nativeToken}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Time: {chain.estimatedTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bridge Features */}
      <Card className="glass border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle>Why Use NebulaX Bridge?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Fast & Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Optimized routing ensures fastest possible cross-chain transfers
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Audited</h3>
              <p className="text-sm text-muted-foreground">
                Multi-signature security with smart contracts audited by top firms
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Low Fees</h3>
              <p className="text-sm text-muted-foreground">
                Competitive bridge fees with transparent pricing structure
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}