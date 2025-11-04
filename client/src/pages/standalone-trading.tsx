import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import TradingChart from "@/components/trading/trading-chart";
import OrderBook from "@/components/trading/order-book";
import HyperliquidTradingPanel from "@/components/trading/hyperliquid-trading-panel";
import { useQuery } from "@tanstack/react-query";

interface StandaloneTradingProps {
  tradingMode?: 'spot' | 'futures';
}

interface MarketMetrics {
  markPrice: number;
  oraclePrice: number;
  change24h: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  fundingCountdown: string;
}

export default function StandaloneTrading({ tradingMode = 'spot' }: StandaloneTradingProps) {
  const [selectedPair, setSelectedPair] = useState(tradingMode === 'futures' ? "BTC-PERP" : "BTC/USDC");
  const [isPairDropdownOpen, setIsPairDropdownOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState("positions");
  const [chartType, setChartType] = useState("candlestick");
  const [timeframe, setTimeframe] = useState("15m");
  const [showIndicators, setShowIndicators] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tradingPairs = [
    { symbol: "BTC/USDC", name: "Bitcoin", icon: "₿", color: "text-[#f7931a]" },
    { symbol: "ETH/USDC", name: "Ethereum", icon: "Ξ", color: "text-[#627eea]" },
    { symbol: "SOL/USDC", name: "Solana", icon: "◎", color: "text-[#9945ff]" },
    { symbol: "ARB/USDC", name: "Arbitrum", icon: "⟠", color: "text-[#28a0f0]" },
    { symbol: "AVAX/USDC", name: "Avalanche", icon: "🔺", color: "text-[#e84142]" },
  ];

  const futuresPairs = [
    { symbol: "BTC-PERP", name: "Bitcoin Perpetual", icon: "₿", color: "text-[#f7931a]" },
    { symbol: "ETH-PERP", name: "Ethereum Perpetual", icon: "Ξ", color: "text-[#627eea]" },
    { symbol: "SOL-PERP", name: "Solana Perpetual", icon: "◎", color: "text-[#9945ff]" },
    { symbol: "ARB-PERP", name: "Arbitrum Perpetual", icon: "⟠", color: "text-[#28a0f0]" },
    { symbol: "AVAX-PERP", name: "Avalanche Perpetual", icon: "🔺", color: "text-[#e84142]" },
  ];

  const availablePairs = tradingMode === 'futures' ? futuresPairs : tradingPairs;
  const currentPair = availablePairs.find(p => p.symbol === selectedPair) || availablePairs[0];

  // Chart tools sidebar items
  const chartTools = [
    { id: 'candlestick', icon: '📊', name: 'Candlestick' },
    { id: 'line', icon: '📈', name: 'Line' },
    { id: 'area', icon: '🏔️', name: 'Area' },
    { id: 'drawing', icon: '✏️', name: 'Drawing' },
    { id: 'indicators', icon: '📉', name: 'Indicators' },
    { id: 'fullscreen', icon: '⛶', name: 'Fullscreen' },
  ];

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

  // Fetch market metrics
  const { data: marketMetrics, isLoading: isLoadingMetrics } = useQuery<MarketMetrics>({
    queryKey: ['/api/hyperliquid/market-metrics', selectedPair],
    queryFn: async () => {
      const baseSymbol = selectedPair.split('/')[0].replace('-PERP', '');
      const response = await fetch(`/api/hyperliquid/market/${baseSymbol}`);
      if (!response.ok) throw new Error('Failed to fetch market data');
      const data = await response.json();
      
      return {
        markPrice: data.price || 0,
        oraclePrice: data.oraclePrice || data.price || 0,
        change24h: data.change24h || 0,
        volume24h: data.volume24h || 0,
        openInterest: data.openInterest || 0,
        fundingRate: data.fundingRate || 0,
        fundingCountdown: data.fundingCountdown || "00:00:00",
      };
    },
    refetchInterval: 2000,
    enabled: !!selectedPair,
  });

  const bottomTabs = [
    { id: 'positions', name: 'Positions', icon: '📍' },
    { id: 'orders', name: 'Open Orders', icon: '📋' },
    { id: 'history', name: 'Trade History', icon: '📈' },
    { id: 'balances', name: 'Balances', icon: '💰' },
    { id: 'funding', name: 'Funding History', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#e5e5e5]">
      {/* Professional Trading Interface */}
      <div className="h-screen flex flex-col">
        {/* Header Section with Pair Selector and Market Metrics */}
        <div className="bg-[#0b0e11] border-b border-slate-800 p-4">
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
            {/* Pair Selector */}
            <div className="relative">
              <button
                onClick={() => setIsPairDropdownOpen(!isPairDropdownOpen)}
                className="flex items-center space-x-3 px-4 py-2 bg-[#1a1d24] rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <span className={`text-2xl ${currentPair.color}`}>{currentPair.icon}</span>
                <div>
                  <div className="font-semibold text-white">{currentPair.name}</div>
                  <div className="text-sm text-[#a1a1a1]">{currentPair.symbol}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#e5e5e5]" />
              </button>
              
              {isPairDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#0b0e11] border border-slate-800 rounded-lg shadow-xl z-50">
                  {availablePairs.map((pair) => (
                    <button
                      key={pair.symbol}
                      onClick={() => {
                        setSelectedPair(pair.symbol);
                        setIsPairDropdownOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-[#1a1d24] transition-colors first:rounded-t-lg last:rounded-b-lg text-left"
                    >
                      <span className={`text-xl ${pair.color}`}>{pair.icon}</span>
                      <div>
                        <div className="font-medium text-white">{pair.name}</div>
                        <div className="text-sm text-[#a1a1a1]">{pair.symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Market Metrics */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xs text-[#a1a1a1] font-medium">Mark Price</div>
                <div className="font-bold text-[#e5e5e5]">
                  {isLoadingMetrics ? '...' : `$${marketMetrics?.markPrice.toLocaleString()}`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#a1a1a1] font-medium">24h Change</div>
                <div className={`font-bold flex items-center ${
                  (marketMetrics?.change24h || 0) >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'
                }`}>
                  {(marketMetrics?.change24h || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {marketMetrics?.change24h.toFixed(2)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#a1a1a1] font-medium">24h Volume</div>
                <div className="font-bold text-[#e5e5e5]">
                  ${marketMetrics ? (marketMetrics.volume24h / 1e9).toFixed(2) + 'B' : '...'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#a1a1a1] font-medium">Open Interest</div>
                <div className="font-bold text-[#e5e5e5]">
                  ${marketMetrics ? (marketMetrics.openInterest / 1e9).toFixed(2) + 'B' : '...'}
                </div>
              </div>
              {tradingMode === 'futures' && (
                <div className="text-center">
                  <div className="text-xs text-[#a1a1a1] font-medium">Funding Rate</div>
                  <div className="font-bold text-[#00c2b2]">
                    {marketMetrics ? (marketMetrics.fundingRate * 100).toFixed(4) + '%' : '...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Trading Area - Flexible Layout */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Chart Tools (60px width) */}
          <div className="w-[60px] bg-[#0b0e11] border-r border-slate-800 flex flex-col py-2">
            {/* Chart Type Tools */}
            <div className="space-y-2">
              {chartTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    if (tool.id === 'fullscreen') {
                      setIsFullscreen(!isFullscreen);
                    } else {
                      setChartType(tool.id);
                    }
                  }}
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-lg transition-colors ${
                    chartType === tool.id && tool.id !== 'fullscreen'
                      ? 'bg-[#00c2b2]/20 border border-[#00c2b2]/30' 
                      : 'bg-[#1a1d24] border border-slate-700 hover:bg-slate-800'
                  }`}
                  title={tool.name}
                >
                  {tool.icon}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Timeframe Buttons */}
            <div className="space-y-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`w-10 h-8 mx-auto rounded text-xs font-medium border transition-colors ${
                    timeframe === tf
                      ? 'bg-[#00c2b2]/20 border-[#00c2b2]/30 text-[#00c2b2]'
                      : 'bg-[#1a1d24] border-slate-700 hover:bg-slate-800 text-[#a1a1a1]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Center Panel - Trading Chart */}
          <div className="flex-1 bg-[#0b0e11] p-4">
            <div className="h-full bg-[#1a1d24] rounded-lg border border-slate-800 overflow-hidden">
              <TradingChart symbol={selectedPair} />
            </div>
          </div>

          {/* Right Panel - Order Book and Order Entry (400px width) */}
          <div className="w-[400px] bg-[#0b0e11] border-l border-slate-800 p-4 space-y-4 flex flex-col">
            {/* Order Book - Takes 55% of available height */}
            <div className="flex-[0.55] bg-[#1a1d24] rounded-lg border border-slate-800 overflow-hidden">
              <OrderBook symbol={selectedPair} />
            </div>
            
            {/* Trading Panel - Takes 45% of available height */}
            <div className="flex-[0.45] bg-[#1a1d24] rounded-lg border border-slate-800 overflow-hidden">
              <HyperliquidTradingPanel tradingMode={tradingMode} />
            </div>
          </div>
        </div>

        {/* Bottom Tabs Section - Fixed height (250px) */}
        <div className="bg-[#0b0e11] border-t border-slate-800 p-4" style={{ height: '250px' }}>
          <div className="h-full max-w-screen-2xl mx-auto">
            {/* Tab Headers */}
            <div className="flex space-x-1 mb-3 border-b border-slate-800">
              {bottomTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBottomTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeBottomTab === tab.id
                      ? 'bg-[#00c2b2]/20 border border-b-0 border-[#00c2b2]/30 text-[#00c2b2]'
                      : 'text-[#a1a1a1] hover:text-white'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content - Scrollable area */}
            <div className="h-[calc(100%-48px)] overflow-y-auto">
              {activeBottomTab === 'positions' && (
                <div className="text-center py-8 text-[#a1a1a1]">
                  <div className="text-4xl mb-4">📍</div>
                  <p>No open positions</p>
                </div>
              )}
              {activeBottomTab === 'orders' && (
                <div className="text-center py-8 text-[#a1a1a1]">
                  <div className="text-4xl mb-4">📋</div>
                  <p>No open orders</p>
                </div>
              )}
              {activeBottomTab === 'history' && (
                <div className="text-center py-8 text-[#a1a1a1]">
                  <div className="text-4xl mb-4">📈</div>
                  <p>No trade history</p>
                </div>
              )}
              {activeBottomTab === 'balances' && (
                <div className="text-center py-8 text-[#a1a1a1]">
                  <div className="text-4xl mb-4">💰</div>
                  <p>Loading balances...</p>
                </div>
              )}
              {activeBottomTab === 'funding' && (
                <div className="text-center py-8 text-[#a1a1a1]">
                  <div className="text-4xl mb-4">⚡</div>
                  <p>No funding history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
