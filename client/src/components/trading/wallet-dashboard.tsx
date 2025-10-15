import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet,
  Shield,
  Send,
  Download,
  Copy,
  QrCode,
  HardDrive,
  Zap,
  Lock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink
} from "lucide-react";

interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  address: string;
  network: string;
  locked?: number;
  staked?: number;
}

interface Transaction {
  id: string;
  type: "send" | "receive" | "stake" | "unstake" | "swap";
  asset: string;
  amount: number;
  usdValue: number;
  address: string;
  txHash: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: string;
  fee: number;
  confirmations: number;
  requiredConfirmations: number;
}

export default function WalletDashboard() {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const walletAssets: WalletAsset[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 2.45673891,
      usdValue: 106234.50,
      change24h: 2.3,
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      network: "Bitcoin",
      locked: 0.5,
      staked: 0
    },
    {
      symbol: "ETH", 
      name: "Ethereum",
      balance: 15.78934521,
      usdValue: 38456.23,
      change24h: -1.2,
      address: "0x742d35Cc6672C0532925a3b8D9C5242b9B8d4a5B",
      network: "Ethereum",
      locked: 2.0,
      staked: 8.5
    },
    {
      symbol: "SOL",
      name: "Solana", 
      balance: 125.67,
      usdValue: 13823.70,
      change24h: 5.7,
      address: "DRiP2Pn2K2ZmzjJjSFBHsGJfPd7eWJEeW1QnXgpTjKqJ",
      network: "Solana",
      locked: 0,
      staked: 50.0
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: 25000.00,
      usdValue: 25000.00,
      change24h: 0.01,
      address: "0x742d35Cc6672C0532925a3b8D9C5242b9B8d4a5B",
      network: "Ethereum",
      locked: 0,
      staked: 0
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: "1",
      type: "receive",
      asset: "BTC",
      amount: 0.15,
      usdValue: 6487.50,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      txHash: "a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d",
      status: "confirmed",
      timestamp: "2024-01-15 14:30:22",
      fee: 0.00015,
      confirmations: 6,
      requiredConfirmations: 6
    },
    {
      id: "2", 
      type: "send",
      asset: "ETH",
      amount: 2.5,
      usdValue: 6095.75,
      address: "0x8ba1f109551bD432803012645Hac136c17051C6d",
      txHash: "0x372ae2b3d9a8d1c6f48b9a1ea78b1e72c4d3f5a6b7c8d9e0f1a2b3c4d5e6f789",
      status: "pending",
      timestamp: "2024-01-15 13:45:10",
      fee: 0.0025,
      confirmations: 2,
      requiredConfirmations: 12
    },
    {
      id: "3",
      type: "stake",
      asset: "SOL",
      amount: 25.0,
      usdValue: 2750.00,
      address: "Stake Pool",
      txHash: "5KJgVxoHcKeRNmWPLYXGhV4kAYYHGjdFCXpAf9zMxzRqJ7hGfD3c8vB2nM1kL9",
      status: "confirmed",
      timestamp: "2024-01-15 11:20:15",
      fee: 0.00025,
      confirmations: 150,
      requiredConfirmations: 32
    }
  ];

  const totalBalance = walletAssets.reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalChange24h = walletAssets.reduce((sum, asset) => sum + (asset.usdValue * asset.change24h / 100), 0);

  const refreshBalances = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-400 bg-green-400/10";
      case "pending": return "text-yellow-400 bg-yellow-400/10";
      case "failed": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send": return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "receive": return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case "stake": return <Zap className="w-4 h-4 text-blue-400" />;
      case "unstake": return <Lock className="w-4 h-4 text-orange-400" />;
      case "swap": return <RefreshCw className="w-4 h-4 text-purple-400" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-blue-500/30 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Total Portfolio</h3>
                  <p className="text-sm text-muted-foreground">Multi-signature wallet</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshBalances}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-semibold ${
                totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {totalChange24h >= 0 ? '+' : ''}${Math.abs(totalChange24h).toLocaleString(undefined, { minimumFractionDigits: 2 })} (24h)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-500/30">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">Secure</div>
            <div className="text-sm text-muted-foreground">Multi-sig + Hardware</div>
            <Badge className="mt-2 bg-green-500/20 text-green-400" variant="outline">
              <CheckCircle className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/30">
          <CardContent className="p-6 text-center">
            <HardDrive className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-400 mb-1">Ledger Nano X</div>
            <div className="text-sm text-muted-foreground">Hardware Wallet</div>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400" variant="outline">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <div className="space-y-4">
            {walletAssets.map((asset, index) => (
              <Card key={index} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {asset.symbol}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{asset.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{asset.network}</Badge>
                          {asset.staked && asset.staked > 0 && (
                            <Badge className="bg-blue-500/20 text-blue-400" variant="outline">
                              <Zap className="w-3 h-3 mr-1" />
                              Staking
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {asset.balance.toLocaleString(undefined, { 
                          minimumFractionDigits: asset.symbol === "USDC" ? 2 : 8,
                          maximumFractionDigits: asset.symbol === "USDC" ? 2 : 8
                        })} {asset.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${asset.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-sm font-semibold ${
                        asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </div>
                    </div>
                  </div>

                  {((asset.locked && asset.locked > 0) || (asset.staked && asset.staked > 0)) && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Available:</span>
                          <span className="ml-2 font-semibold">
                            {(asset.balance - (asset.locked || 0) - (asset.staked || 0)).toFixed(8)} {asset.symbol}
                          </span>
                        </div>
                        {asset.locked && asset.locked > 0 && (
                          <div>
                            <span className="text-muted-foreground">Locked:</span>
                            <span className="ml-2 font-semibold text-orange-400">
                              {asset.locked.toFixed(8)} {asset.symbol}
                            </span>
                          </div>
                        )}
                        {asset.staked && asset.staked > 0 && (
                          <div>
                            <span className="text-muted-foreground">Staked:</span>
                            <span className="ml-2 font-semibold text-blue-400">
                              {asset.staked.toFixed(8)} {asset.symbol}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="truncate">{asset.address}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(asset.address)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4 mr-1" />
                        Receive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="send" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-6 h-6 text-blue-400" />
                <span>Send Cryptocurrency</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Select Asset</label>
                    <select 
                      className="w-full p-3 bg-background border border-border rounded-lg"
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                    >
                      {walletAssets.map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>
                          {asset.symbol} - {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Recipient Address</label>
                    <Input
                      placeholder="Enter wallet address..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Amount</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline">Max</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Transaction Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>{sendAmount || '0.00'} {selectedAsset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Fee:</span>
                        <span>~0.00025 {selectedAsset}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{(parseFloat(sendAmount || '0') + 0.00025).toFixed(8)} {selectedAsset}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div className="text-sm">
                        <strong>Multi-signature Required:</strong> This transaction requires 2 of 3 signatures to execute.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full" disabled={!sendAmount || !recipientAddress}>
                <Shield className="w-4 h-4 mr-2" />
                Create Multi-Sig Transaction
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-6 h-6 text-green-400" />
                <span>Receive Cryptocurrency</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {walletAssets.slice(0, 4).map((asset, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {asset.symbol}
                      </div>
                      <div>
                        <h4 className="font-semibold">{asset.name}</h4>
                        <p className="text-xs text-muted-foreground">{asset.network}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-white p-2 rounded-lg mx-auto mb-3">
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-gray-600" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">QR Code for {asset.symbol}</p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground">Address:</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="flex-1 p-2 bg-background border border-border rounded text-xs font-mono truncate">
                            {asset.address}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(asset.address)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div className="text-sm">
                    <strong>Important:</strong> Only send the correct cryptocurrency to each address. 
                    Sending other tokens may result in permanent loss.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold capitalize">{tx.type} {tx.asset}</h4>
                          <Badge className={getStatusColor(tx.status)} variant="outline">
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-xs text-muted-foreground">{tx.txHash.substring(0, 20)}...</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(tx.txHash)}
                            className="h-4 w-4 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        tx.type === "receive" ? "text-green-400" : "text-red-400"
                      }`}>
                        {tx.type === "receive" ? "+" : "-"}{tx.amount} {tx.asset}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${tx.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      {tx.status === "pending" && (
                        <div className="text-xs text-yellow-400 mt-1">
                          {tx.confirmations}/{tx.requiredConfirmations} confirmations
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  <span>Multi-Signature Wallet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge className="bg-green-500/20 text-green-400" variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Threshold:</span>
                  <span className="font-semibold">2 of 3</span>
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Signers
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-6 h-6 text-purple-400" />
                  <span>Hardware Wallet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Device:</span>
                  <span className="font-semibold">Ledger Nano X</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge className="bg-purple-500/20 text-purple-400" variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Connect Device
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}