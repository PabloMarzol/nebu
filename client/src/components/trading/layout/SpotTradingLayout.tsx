import { Card, CardContent } from '@/components/ui/card';
import OrderBook from '@/components/trading/order-book';
import TradingChart from '@/components/trading/trading-chart';
import HyperliquidTradingPanel from '@/components/trading/hyperliquid-trading-panel';
import RecentTrades from '@/components/trading/recent-trades';

interface SpotTradingLayoutProps {
  selectedPair: string;
}

export default function SpotTradingLayout({ selectedPair }: SpotTradingLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-h-[600px]">
      {/* LEFT SIDEBAR: Order Book */}
      <div className="lg:col-span-1">
        <Card className="h-full bg-slate-900 border border-slate-700">
          <CardContent className="p-4 h-full overflow-y-auto">
            <OrderBook symbol={selectedPair} />
          </CardContent>
        </Card>
      </div>

      {/* MAIN CHART AREA */}
      <div className="lg:col-span-2 space-y-6">
        {/* Trading Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">Spot Trading</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Market
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Powered by Hyperliquid
            </span>
          </div>
        </div>

        {/* Trading Chart */}
        <Card className="bg-slate-900 border border-slate-700 h-80 lg:h-[400px]">
          <CardContent className="p-4 h-full">
            <TradingChart symbol={selectedPair} />
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDEBAR: Trading Panel */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-slate-900 border border-slate-700">
          <CardContent className="p-4">
            <HyperliquidTradingPanel tradingMode="spot" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border border-slate-700 h-48 overflow-y-auto">
          <CardContent className="p-4">
            <RecentTrades symbol={selectedPair} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
