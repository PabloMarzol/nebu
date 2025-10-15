import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Eye
} from "lucide-react";

interface AnimatedTransaction {
  id: string;
  type: "send" | "receive" | "stake" | "swap";
  from: string;
  to: string;
  amount: number;
  asset: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  fee: number;
  x: number;
  y: number;
  progress: number;
  color: string;
}

interface WalletNode {
  id: string;
  name: string;
  balance: number;
  asset: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  connections: number;
}

export default function AnimatedWalletVisualizer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [transactions, setTransactions] = useState<AnimatedTransaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const walletNodes: WalletNode[] = [
    {
      id: "main",
      name: "Main Wallet",
      balance: 2.45673891,
      asset: "BTC",
      x: 250,
      y: 200,
      radius: 60,
      color: "#f7931a",
      connections: 8
    },
    {
      id: "eth",
      name: "Ethereum",
      balance: 15.78934521,
      asset: "ETH",
      x: 450,
      y: 150,
      radius: 50,
      color: "#627eea",
      connections: 12
    },
    {
      id: "sol",
      name: "Solana",
      balance: 125.67,
      asset: "SOL",
      x: 150,
      y: 350,
      radius: 40,
      color: "#00d18c",
      connections: 6
    },
    {
      id: "usdc",
      name: "USDC",
      balance: 25000,
      asset: "USDC",
      x: 350,
      y: 320,
      radius: 45,
      color: "#2775ca",
      connections: 15
    },
    {
      id: "external1",
      name: "Exchange",
      balance: 0,
      asset: "EXT",
      x: 500,
      y: 300,
      radius: 35,
      color: "#6366f1",
      connections: 3
    },
    {
      id: "external2",
      name: "DeFi Pool",
      balance: 0,
      asset: "DEFI",
      x: 100,
      y: 100,
      radius: 30,
      color: "#ec4899",
      connections: 2
    }
  ];

  const generateRandomTransaction = (): AnimatedTransaction => {
    const types = ["send", "receive", "stake", "swap"];
    const assets = ["BTC", "ETH", "SOL", "USDC"];
    const nodes = walletNodes;
    
    const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
    const toNode = nodes[Math.floor(Math.random() * nodes.length)];
    
    if (fromNode.id === toNode.id) {
      return generateRandomTransaction();
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      type: types[Math.floor(Math.random() * types.length)] as any,
      from: fromNode.id,
      to: toNode.id,
      amount: Math.random() * 10 + 0.1,
      asset: assets[Math.floor(Math.random() * assets.length)],
      status: Math.random() > 0.1 ? "confirmed" : "pending",
      timestamp: Date.now(),
      fee: Math.random() * 0.01,
      x: fromNode.x,
      y: fromNode.y,
      progress: 0,
      color: fromNode.color
    };
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Add new transaction
      if (Math.random() > 0.7) {
        const newTransaction = generateRandomTransaction();
        setTransactions(prev => [...prev, newTransaction]);
      }

      // Update existing transactions
      setTransactions(prev => prev.map(tx => {
        const fromNode = walletNodes.find(n => n.id === tx.from);
        const toNode = walletNodes.find(n => n.id === tx.to);
        
        if (!fromNode || !toNode) return tx;

        const newProgress = Math.min(tx.progress + (0.02 * animationSpeed), 1);
        
        // Calculate interpolated position
        const newX = fromNode.x + (toNode.x - fromNode.x) * newProgress;
        const newY = fromNode.y + (toNode.y - fromNode.y) * newProgress;

        return {
          ...tx,
          progress: newProgress,
          x: newX,
          y: newY
        };
      }).filter(tx => tx.progress < 1)); // Remove completed transactions
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send": return <ArrowUpRight className="w-3 h-3" />;
      case "receive": return <ArrowDownLeft className="w-3 h-3" />;
      case "stake": return <Zap className="w-3 h-3" />;
      case "swap": return <RefreshCw className="w-3 h-3" />;
      default: return <ArrowUpRight className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "#10b981";
      case "pending": return "#f59e0b";
      case "failed": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const filteredTransactions = selectedFilter === "all" 
    ? transactions 
    : transactions.filter(tx => tx.type === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">Transaction Flow Visualizer</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTransactions([])}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Speed:</span>
                <select 
                  className="px-2 py-1 bg-background border border-border rounded text-sm"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <select 
                  className="px-2 py-1 bg-background border border-border rounded text-sm"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="send">Send</option>
                  <option value="receive">Receive</option>
                  <option value="stake">Stake</option>
                  <option value="swap">Swap</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Canvas */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="relative bg-slate-900/50 rounded-lg overflow-hidden" style={{ height: "500px" }}>
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Connection lines between nodes */}
              {walletNodes.map(fromNode => 
                walletNodes
                  .filter(toNode => toNode.id !== fromNode.id)
                  .slice(0, 2)
                  .map(toNode => (
                    <line
                      key={`${fromNode.id}-${toNode.id}`}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#374151"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      strokeDasharray="5,5"
                    />
                  ))
              )}

              {/* Wallet nodes */}
              {walletNodes.map(node => (
                <g key={node.id}>
                  {/* Node glow effect */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 5}
                    fill={node.color}
                    fillOpacity="0.1"
                    className="animate-pulse"
                  />
                  
                  {/* Main node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={node.color}
                    fillOpacity="0.8"
                    stroke={node.color}
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-opacity-100 transition-all"
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y - node.radius - 10}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-white"
                  >
                    {node.name}
                  </text>
                  
                  {/* Balance */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-xs fill-white font-mono"
                  >
                    {node.balance.toFixed(node.asset === "USDC" ? 0 : 4)}
                  </text>
                  
                  {/* Asset symbol */}
                  <text
                    x={node.x}
                    y={node.y - 5}
                    textAnchor="middle"
                    className="text-xs fill-white font-bold"
                  >
                    {node.asset}
                  </text>
                </g>
              ))}

              {/* Animated transactions */}
              {filteredTransactions.map(tx => (
                <g key={tx.id}>
                  {/* Transaction trail */}
                  <circle
                    cx={tx.x}
                    cy={tx.y}
                    r="8"
                    fill={tx.color}
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                  
                  {/* Main transaction dot */}
                  <circle
                    cx={tx.x}
                    cy={tx.y}
                    r="6"
                    fill={getStatusColor(tx.status)}
                    stroke={tx.color}
                    strokeWidth="2"
                    className="cursor-pointer"
                  />
                  
                  {/* Transaction amount */}
                  <text
                    x={tx.x}
                    y={tx.y - 15}
                    textAnchor="middle"
                    className="text-xs fill-white font-semibold"
                  >
                    {tx.amount.toFixed(4)} {tx.asset}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold text-white mb-2">Transaction Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-white">Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-white">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-white">Failed</span>
              </div>
            </div>

            {/* Active transactions counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white">
                <div className="text-2xl font-bold">{filteredTransactions.length}</div>
                <div className="text-sm text-gray-300">Active Transactions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-green-500/30">
          <CardContent className="p-6 text-center">
            <ArrowDownLeft className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400 mb-1">
              {transactions.filter(tx => tx.type === "receive").length}
            </div>
            <div className="text-sm text-muted-foreground">Incoming</div>
          </CardContent>
        </Card>

        <Card className="glass border-red-500/30">
          <CardContent className="p-6 text-center">
            <ArrowUpRight className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400 mb-1">
              {transactions.filter(tx => tx.type === "send").length}
            </div>
            <div className="text-sm text-muted-foreground">Outgoing</div>
          </CardContent>
        </Card>

        <Card className="glass border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {transactions.filter(tx => tx.type === "stake").length}
            </div>
            <div className="text-sm text-muted-foreground">Staking</div>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/30">
          <CardContent className="p-6 text-center">
            <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {transactions.filter(tx => tx.type === "swap").length}
            </div>
            <div className="text-sm text-muted-foreground">Swaps</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}