import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortfolioOverview from "@/components/trading/portfolio-overview";
import RecentTrades from "@/components/trading/recent-trades";
import PortfolioQuickActions from "@/components/trading/portfolio-quick-actions";
import SimpleAIChat from "@/components/trading/simple-ai-chat";
import MarketDataStatus from "@/components/trading/market-data-status";
import BlockchainWalletTracker from "@/components/trading/blockchain-wallet-tracker";
import RecoveryDashboard from "@/components/RecoveryDashboard";
import PortfolioBalanceDisplay from "@/components/trading/portfolio-balance-display";

/**
 * Dashboard Layout Component
 * Comprehensive overview of trading activity, portfolio, and wallet status
 *
 * Features:
 * - Portfolio balance and asset distribution
 * - Recent trading activity and swap history
 * - Payment recovery status
 * - Wallet tracking across multiple chains
 * - Market data status monitoring
 * - Quick actions for portfolio management
 * - AI chat assistant for trading support
 */
export default function DashboardLayout() {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Trading Dashboard</h2>
              <p className="text-gray-400">
                Wallet balance, recent swaps, and recovery status
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Live Data
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Status - Shows if any payments need recovery */}
      <RecoveryDashboard />

      {/* Portfolio Overview - Existing component */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioOverview />
        <PortfolioBalanceDisplay />
      </div>

      {/* Recent Trading Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTrades symbol="BTC/USDT" />
        <div className="space-y-4">
          <PortfolioQuickActions />
          <SimpleAIChat />
        </div>
      </div>

      {/* Market Data & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketDataStatus />
        <BlockchainWalletTracker />
      </div>
    </div>
  );
}
