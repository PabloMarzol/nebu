import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { WalletConnect } from "@/components/WalletConnect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getChainById } from "@/lib/chains";

export default function PortfolioOverview({ className = "" }) {
  const { isAuthenticated, walletAddress, chainId } = useWalletAuth();
  const { balances, totalUsdValue, isLoading, error } = useWalletBalance();
  const currentChain = getChainById(chainId);

 if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Connect wallet to view your portfolio</p>
            <WalletConnect />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Portfolio Overview
          </div>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between mb-1">
              <span>Wallet</span>
              <span className="font-mono">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Network</span>
              <span>{currentChain?.name || 'Unknown'}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            {/* Total Balance */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Total Balance</span>
              <span className="text-2xl font-bold">
                ${totalUsdValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>

            {/* Individual Token Balances */}
            {error ? (
              <div className="text-sm text-red-500 text-center py-4">
                {error}
              </div>
            ) : balances.length === 0 && !isLoading ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No tokens found in wallet
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-xs text-muted-foreground font-semibold mb-2">Holdings</p>
                {balances.map((token) => (
                  <div key={token.symbol} className="flex justify-between items-center text-sm py-2 border-b border-slate-700/50 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-40">
                          {token.symbol.slice(0, 1)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {parseFloat(token.balanceFormatted).toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${token.usdValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 24h Change - Mock for now */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                --
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Track your portfolio performance over time (coming soon)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
