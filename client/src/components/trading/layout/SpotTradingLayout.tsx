import { Badge } from "@/components/ui/badge";
import OrderBook from "@/components/trading/order-book";
import TradingChart from "@/components/trading/trading-chart";
import HyperliquidTradingPanel from "@/components/trading/hyperliquid-trading-panel";
import TradingDashboard from "@/components/trading/trading-dashboard";
import { LivePriceWithChange } from "@/components/trading/live-market-ticker";

/**
 * Spot Trading Layout Component
 * Professional CSS Grid layout for spot trading with Hyperliquid integration
 *
 * Features:
 * - Real-time price charts (TradingChart)
 * - Live order book with bid/ask spreads (OrderBook)
 * - Quick trade panel with frontend wallet signing (HyperliquidTradingPanel)
 * - Position/order management (TradingDashboard)
 * - Live price tickers for major pairs
 */
export default function SpotTradingLayout() {
  return (
    <div className="trading-layout-grid">
      {/* HEADER: Trading Type + Market Stats */}
      <div className="trading-header">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">Spot Trading</h2>
            <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Market
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Powered by Hyperliquid
            </Badge>
          </div>

          {/* Live Price Ticker - Compact */}
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <LivePriceWithChange symbol="BTC/USDT" />
            </div>
            <div className="text-sm">
              <LivePriceWithChange symbol="ETH/USDT" />
            </div>
            <div className="text-sm">
              <LivePriceWithChange symbol="SOL/USDT" />
            </div>
          </div>
        </div>
      </div>

      {/* CHART AREA: TradingChart Component */}
      <div className="chart-area">
        <div className="chart-container">
          <TradingChart symbol="BTC/USDT" />
        </div>
      </div>

      {/* SIDEBAR: OrderBook + QuickTrade Panel */}
      <div className="trading-sidebar">
        {/* OrderBook - Top Half */}
        <div className="sidebar-orderbook">
          <OrderBook symbol="BTC/USDT" />
        </div>

        {/* QuickTrade Panel - Bottom Half */}
        <div className="sidebar-trade-panel">
          <HyperliquidTradingPanel tradingMode="spot" />
        </div>
      </div>

      {/* BOTTOM: Positions/Orders Tabs */}
      <div className="trading-bottom">
        <TradingDashboard tradingMode="spot" selectedPair="BTC/USDT" />
      </div>
    </div>
  );
}
