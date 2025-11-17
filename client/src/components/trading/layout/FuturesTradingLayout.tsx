import { Badge } from "@/components/ui/badge";
import OrderBook from "@/components/trading/order-book";
import TradingChart from "@/components/trading/trading-chart";
import HyperliquidTradingPanel from "@/components/trading/hyperliquid-trading-panel";
import TradingDashboard from "@/components/trading/trading-dashboard";
import { LivePriceWithChange } from "@/components/trading/live-market-ticker";

/**
 * Futures Trading Layout Component
 * Professional CSS Grid layout for perpetual futures trading with Hyperliquid
 *
 * Features:
 * - Real-time perpetual futures charts (TradingChart)
 * - Live order book with bid/ask spreads (OrderBook)
 * - Advanced trading panel with leverage controls (HyperliquidTradingPanel)
 * - Position/order management with PnL tracking (TradingDashboard)
 * - Live price tickers for perpetual contracts
 * - Up to 50x leverage support
 */
export default function FuturesTradingLayout() {
  return (
    <div className="trading-layout-grid">
      {/* HEADER: Futures Info + Market Stats */}
      <div className="trading-header">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">Perpetual Futures</h2>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Up to 50x Leverage
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Hyperliquid
            </Badge>
          </div>

          {/* Live Price Ticker - Compact */}
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <LivePriceWithChange symbol="BTC-PERP" />
            </div>
            <div className="text-sm">
              <LivePriceWithChange symbol="ETH-PERP" />
            </div>
            <div className="text-sm">
              <LivePriceWithChange symbol="SOL-PERP" />
            </div>
          </div>
        </div>
      </div>

      {/* CHART AREA: TradingChart Component */}
      <div className="chart-area">
        <div className="chart-container">
          <TradingChart symbol="BTC-PERP" />
        </div>
      </div>

      {/* SIDEBAR: OrderBook + QuickTrade Panel */}
      <div className="trading-sidebar">
        {/* OrderBook - Top Half */}
        <div className="sidebar-orderbook">
          <OrderBook symbol="BTC-PERP" />
        </div>

        {/* QuickTrade Panel - Bottom Half */}
        <div className="sidebar-trade-panel">
          <HyperliquidTradingPanel tradingMode="futures" />
        </div>
      </div>

      {/* BOTTOM: Positions/Orders Tabs */}
      <div className="trading-bottom">
        <TradingDashboard tradingMode="futures" selectedPair="BTC-PERP" />
      </div>
    </div>
  );
}
