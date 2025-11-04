import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronDown, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Clock,
  Activity,
  Settings
} from "lucide-react";

// Import your existing components
import OrderBook from "@/components/trading/order-book";
import TradingChart from "@/components/trading/trading-chart";
import FuturesTrading from "@/components/trading/futures-trading";
import TradingDashboard from "@/components/trading/trading-dashboard";

interface ProfessionalTradingPageProps {
  tradingMode?: 'spot' | 'futures';
}

export default function ProfessionalTradingPage({ 
  tradingMode = 'futures' 
}: ProfessionalTradingPageProps) {
  const [selectedPair, setSelectedPair] = useState("BTC/USDC");
  const [isLeverageMode, setIsLeverageMode] = useState(tradingMode === 'futures');
  const [selectedTimeframe, setSelectedTimeframe] = useState("15m");
  const [showPairDropdown, setShowPairDropdown] = useState(false);

  // Trading pairs data
  const tradingPairs = [
    { symbol: "BTC/USDC", name: "Bitcoin", icon: "₿", color: "text-[#f7931a]", price: 67845.32, change: 2.45 },
    { symbol: "ETH/USDC", name: "Ethereum", icon: "Ξ", color: "text-[#627eea]", price: 2845.67, change: -1.23 },
    { symbol: "SOL/USDC", name: "Solana", icon: "◎", color: "text-[#9945ff]", price: 145.89, change: 3.78 },
    { symbol: "ARB/USDC", name: "Arbitrum", icon: "⟠", color: "text-[#28a0f0]", price: 1.23, change: 0.45 },
  ];

  const currentPair = tradingPairs.find(p => p.symbol === selectedPair) || tradingPairs[0];
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D'];

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      {/* Header Section - Full Width */}
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          {/* Left: Pair Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPairDropdown(!showPairDropdown)}
              className="flex items-center space-x-3 px-4 py-2 bg-[#1a1d24] rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <span className={`text-2xl ${currentPair.color}`}>{currentPair.icon}</span>
              <div className="text-left">
                <div className="font-semibold text-white">{currentPair.symbol}</div>
                <div className="text-sm text-[#a1a1a1]">{currentPair.name}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#e5e5e5]" />
            </button>
            
            {showPairDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#0b0e11] border border-slate-800 rounded-lg shadow-xl z-50">
                {tradingPairs.map((pair) => (
                  <button
                    key={pair.symbol}
                    onClick={() => {
                      setSelectedPair(pair.symbol);
                      setShowPairDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-[#1a1d24] transition-colors first:rounded-t-lg last:rounded-b-lg text-left"
                  >
                    <span className={`text-xl ${pair.color}`}>{pair.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{pair.symbol}</div>
                      <div className="text-sm text-[#a1a1a1]">{pair.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">${pair.price.toLocaleString()}</div>
                      <div className={`text-sm ${pair.change >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                        {pair.change >= 0 ? '+' : ''}{pair.change}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Market Metrics */}
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-xs text-[#a1a1a1] font-medium">Mark Price</div>
              <div className="font-bold text-[#e5e5e5]">${currentPair.price.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[#a1a1a1] font-medium">Oracle</div>
              <div className="font-bold text-[#e5e5e5]">${(currentPair.price - 0.5).toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[#a1a1a1] font-medium">24h Change</div>
              <div className={`font-bold flex items-center ${currentPair.change >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                {currentPair.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {currentPair.change >= 0 ? '+' : ''}{currentPair.change}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[#a1a1a1] font-medium">24h Volume</div>
              <div className="font-bold text-[#e5e5e5]">$1.2B</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[#a1a1a1] font-medium">Open Interest</div>
              <div className="font-bold text-[#e5e5e5]">$850M</div>
            </div>
            {isLeverageMode && (
              <div className="text-center">
                <div className="text-xs text-[#a1a1a1] font-medium">Funding / Countdown</div>
                <div className="font-bold text-[#00c2b2]">+0.0012% / 7h 45m</div>
              </div>
            )}
          </div>

          {/* Right: Trading Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={isLeverageMode ? "bg-[#00c2b2]/10 border-[#00c2b2]/30" : "bg-blue-500/10 border-blue-500/30"}>
              {isLeverageMode ? 'Futures' : 'Spot'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLeverageMode(!isLeverageMode)}
              className="text-xs"
            >
              Switch to {isLeverageMode ? 'Spot' : 'Futures'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Trading Interface - Three Column Layout */}
      <div className="flex h-[calc(100vh-120px)]">
        
        {/* Left Sidebar - Chart Tools (Thin Column) */}
        <div className="w-16 border-r border-slate-800 p-2">
          <div className="flex flex-col items-center space-y-2 h-full">
            {/* Chart Type Tools */}
            <div className="space-y-2">
              {[
                { icon: '📊', name: 'Candlestick' },
                { icon: '📈', name: 'Line' },
                { icon: '✏️', name: 'Drawing' },
                { icon: '📉', name: 'Indicators' },
                { icon: '⛶', name: 'Fullscreen' },
              ].map((tool, idx) => (
                <button
                  key={idx}
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
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
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`w-12 h-8 rounded text-xs font-medium transition-colors ${
                    selectedTimeframe === tf 
                      ? 'bg-[#00c2b2] text-black' 
                      : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Chart Area */}
        <div className="flex-1 flex flex-col">
          {/* Chart Header */}
          <div className="border-b border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold">{selectedPair.replace('/', '')} - {selectedTimeframe} · Hyperliquid</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Indicators
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </div>

          {/* Trading Chart */}
          <div className="flex-1 p-4">
            <TradingChart symbol={selectedPair} />
          </div>
        </div>

        {/* Right Panel - Order Book & Trading */}
        <div className="w-96 border-l border-slate-800 flex flex-col">
          {/* Trading Controls Header */}
          <div className="border-b border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <Button
                  variant={!isLeverageMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsLeverageMode(false)}
                  className="text-xs"
                >
                  Cross
                </Button>
                <Button
                  variant={isLeverageMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsLeverageMode(true)}
                  className="text-xs"
                >
                  Isolated
                </Button>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#a1a1a1]">Leverage</div>
                <div className="font-semibold text-[#00c2b2]">20x</div>
              </div>
            </div>
          </div>

          {/* Order Entry & Order Book */}
          <div className="flex-1 flex flex-col">
            {/* Order Entry Section */}
            <div className="p-4 border-b border-slate-800">
              {isLeverageMode ? (
                <FuturesTrading symbol={selectedPair} />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Spot Trading</h4>
                    <p className="text-sm text-[#a1a1a1]">Available for {selectedPair}</p>
                  </div>
                  {/* Spot trading controls would go here */}
                </div>
              )}
            </div>

            {/* Order Book */}
            <div className="flex-1">
              <OrderBook symbol={selectedPair} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs - Full Width */}
      <div className="border-t border-slate-800 bg-[#0b0e11]">
        <Tabs defaultValue="positions" className="w-full">
          <div className="border-b border-slate-800">
            <TabsList className="grid w-full grid-cols-7 bg-transparent">
              <TabsTrigger value="balances" className="text-xs">Balances</TabsTrigger>
              <TabsTrigger value="positions" className="text-xs">Positions</TabsTrigger>
              <TabsTrigger value="orders" className="text-xs">Open Orders</TabsTrigger>
              <TabsTrigger value="twap" className="text-xs">TWAP</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">Trade History</TabsTrigger>
              <TabsTrigger value="funding" className="text-xs">Funding History</TabsTrigger>
              <TabsTrigger value="order-history" className="text-xs">Order History</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="h-64 overflow-auto">
            <TabsContent value="balances">
              <div className="p-4">
                <TradingDashboard tradingMode={isLeverageMode ? 'futures' : 'spot'} selectedPair={selectedPair} />
              </div>
            </TabsContent>
            
            <TabsContent value="positions">
              <div className="p-4">
                {isLeverageMode ? (
                  <div className="text-center py-8 text-[#a1a1a1]">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <p>No open positions</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#a1a1a1]">
                    <p>Positions are only available in futures mode</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="p-4">
                <div className="text-center py-8 text-[#a1a1a1]">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <p>No open orders</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="twap">
              <div className="p-4">
                <div className="text-center py-8 text-[#a1a1a1]">
                  <p>TWAP orders will appear here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="p-4">
                <div className="text-center py-8 text-[#a1a1a1]">
                  <p>Trade history will appear here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="funding">
              <div className="p-4">
                <div className="text-center py-8 text-[#a1a1a1]">
                  <p>Funding history will appear here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="order-history">
              <div className="p-4">
                <div className="text-center py-8 text-[#a1a1a1]">
                  <p>Order history will appear here</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-xs text-[#a1a1a1]">
            <button className="hover:text-white transition-colors">Docs</button>
            <button className="hover:text-white transition-colors">Support</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Privacy Policy</button>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-[#16c784] rounded-full"></div>
            <span className="text-[#16c784]">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}