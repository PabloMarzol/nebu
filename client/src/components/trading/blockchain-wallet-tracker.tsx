import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface WalletPortfolio {
  address: string;
  totalValue: string;
  assets: Array<{
    symbol: string;
    balance: string;
    valueUSD: string;
    change24h: string;
  }>;
  lastUpdated: string;
}

interface NetworkInfo {
  network: string;
  chainId: number;
  isConnected: boolean;
  error?: string;
  lastCheck: string;
}

export default function BlockchainWalletTracker() {
  const [walletAddress, setWalletAddress] = useState("");
  const [trackedAddress, setTrackedAddress] = useState("");

  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = useQuery<WalletPortfolio>({
    queryKey: ['/api/wallet', trackedAddress],
    enabled: !!trackedAddress,
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: networkInfo } = useQuery<NetworkInfo>({
    queryKey: ['/api/network/info'],
    refetchInterval: 60000, // Update every minute
  });

  const handleTrackWallet = () => {
    if (walletAddress.trim()) {
      setTrackedAddress(walletAddress.trim());
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const formatBalance = (balance: string, symbol: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.000001) return '<0.000001';
    return num.toFixed(6) + ' ' + symbol;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-purple-400" />
          <span>Blockchain Portfolio Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Network Status */}
        {networkInfo && (
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Ethereum Network</span>
            </div>
            <div className="flex items-center space-x-2">
              {networkInfo.isConnected ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <Badge className={networkInfo.isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                {networkInfo.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
        )}

        {/* Wallet Input */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Enter Ethereum Address</label>
          <div className="flex space-x-2">
            <Input
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            <Button 
              onClick={handleTrackWallet}
              disabled={!walletAddress.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Track
            </Button>
          </div>
        </div>

        {/* Portfolio Display */}
        {trackedAddress && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 font-mono break-all">
              Tracking: {trackedAddress}
            </div>

            {portfolioLoading && (
              <div className="flex items-center justify-center p-8">
                <Activity className="w-6 h-6 animate-spin text-purple-400" />
                <span className="ml-2 text-slate-400">Loading portfolio...</span>
              </div>
            )}

            {portfolioError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">Failed to load portfolio data</span>
                </div>
              </div>
            )}

            {portfolio && (
              <div className="space-y-4">
                {/* Total Value */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Portfolio Value</span>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-xl font-bold text-white">
                        {formatCurrency(portfolio.totalValue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Asset List */}
                <div className="space-y-2">
                  <div className="text-sm text-slate-400 uppercase tracking-wider">Holdings</div>
                  {portfolio.assets.length === 0 ? (
                    <div className="text-center p-4 text-slate-500">
                      No assets found in this wallet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {portfolio.assets.map((asset, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {asset.symbol.substring(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-white">{asset.symbol}</div>
                                <div className="text-xs text-slate-400">
                                  {formatBalance(asset.balance, asset.symbol)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-white">
                                {formatCurrency(asset.valueUSD)}
                              </div>
                              <div className={`text-xs flex items-center space-x-1 ${
                                parseFloat(asset.change24h) >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {parseFloat(asset.change24h) >= 0 ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                <span>{parseFloat(asset.change24h).toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                  Last updated: {new Date(portfolio.lastUpdated).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}