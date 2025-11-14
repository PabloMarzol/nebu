import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import OrderBook from "@/components/trading/order-book";
import TradingChart from "@/components/trading/trading-chart";
import PortfolioOverview from "@/components/trading/portfolio-overview";
import RecentTrades from "@/components/trading/recent-trades";
import PortfolioQuickActions from "@/components/trading/portfolio-quick-actions";
import SimpleAIChat from "@/components/trading/simple-ai-chat";
import NFTMarketplace from "@/components/trading/nft-marketplace";
import PersonalizedLearning from "@/components/trading/personalized-learning";
import AIPortfolioBalancer from "@/components/trading/ai-portfolio-balancer";
import SocialTradingCommunity from "@/components/trading/social-trading-community";
import VoiceTradingCommands from "@/components/trading/voice-trading-commands";
import RecoveryDashboard from "@/components/RecoveryDashboard";
import CryptoMemeGenerator from "@/components/trading/crypto-meme-generator";
import AccessibilityMode from "@/components/trading/accessibility-mode";
import MarketMoodTranslator from "@/components/trading/market-mood-translator";
import CryptoEducationQuiz from "@/components/trading/crypto-education-quiz";
import SocialSharingWidget from "@/components/trading/social-sharing-widget";
import PersonalizedLearningPath from "@/components/trading/personalized-learning-path";
import AnimatedDataVisualizations from "@/components/trading/animated-data-visualizations";
import P2PTrading from "@/components/trading/p2p-trading";
import MarketDataStatus from "@/components/trading/market-data-status";
import BlockchainWalletTracker from "@/components/trading/blockchain-wallet-tracker";
import { LivePriceWithChange } from "@/components/trading/live-market-ticker";
import APIServicesDashboard from "@/components/trading/api-services-dashboard";

import HyperliquidTradingPanel from "@/components/trading/hyperliquid-trading-panel";
import TradingDashboard from "@/components/trading/trading-dashboard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle, X, ChevronDown, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SwapInterface from "@/components/trading/SwapInterface";
import ProtectedTradingWrapper from "@/components/auth/protected-trading-wrapper";
import EnhancedTradingInterface from "@/components/trading/enhanced-trading-interface";
import PortfolioBalanceDisplay from "@/components/trading/portfolio-balance-display";

// Enhanced Trading Layout Components
function EnhancedTradingHeader({ tradingMode, selectedPair, onPairChange }: { 
  tradingMode: 'spot' | 'futures';
  selectedPair: string;
  onPairChange: (pair: string) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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

  return (
    <div className="bg-[#0b0e11] border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        {/* Pair Selector */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 px-4 py-2 bg-[#1a1d24] rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <span className={`text-2xl ${currentPair.color}`}>{currentPair.icon}</span>
            <div>
              <div className="font-semibold text-white">{currentPair.name}</div>
              <div className="text-sm text-[#a1a1a1]">{currentPair.symbol}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#e5e5e5]" />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu absolute top-full left-0 mt-2 w-64 bg-[#0b0e11] border border-slate-800 rounded-lg shadow-xl z-[9999]">
              {availablePairs.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => {
                    onPairChange(pair.symbol);
                    setIsDropdownOpen(false);
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
            <div className="font-bold text-[#e5e5e5]">$43,250.50</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[#a1a1a1] font-medium">24h Change</div>
            <div className="font-bold text-[#16c784] flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />+2.45%
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
        </div>
      </div>
    </div>
  );
}

function ChartToolsSidebar() {
  const [activeTool, setActiveTool] = useState('candlestick');
  
  const tools = [
    { id: 'candlestick', icon: '📊', name: 'Candlestick' },
    { id: 'line', icon: '📈', name: 'Line' },
    { id: 'area', icon: '🏔️', name: 'Area' },
    { id: 'drawing', icon: '✏️', name: 'Drawing' },
    { id: 'indicators', icon: '📉', name: 'Indicators' },
    { id: 'fullscreen', icon: '⛶', name: 'Fullscreen' },
  ];

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

  return (
    <Card className="glass h-full">
      <CardContent className="p-2 h-full">
        <div className="flex flex-col items-center space-y-2 h-full">
          {/* Chart Type Tools */}
          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
                  activeTool === tool.id 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
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
                className="w-10 h-8 rounded text-xs font-medium bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedBottomTabs({ activeTab, onTabChange }: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    { id: 'positions', name: 'Positions', icon: '📍' },
    { id: 'orders', name: 'Open Orders', icon: '📋' },
    { id: 'history', name: 'Trade History', icon: '📈' },
    { id: 'balances', name: 'Balances', icon: '💰' },
    { id: 'funding', name: 'Funding History', icon: '⚡' },
  ];

  return (
    <Card className="glass">
      <CardContent className="p-4">
        {/* Tab Headers */}
        <div className="flex space-x-1 mb-4 border-b border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 border border-b-0 border-blue-500/30 text-blue-400'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'positions' && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">📍</div>
              <p>No open positions</p>
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">📋</div>
              <p>No open orders</p>
            </div>
          )}
          {activeTab === 'history' && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">📈</div>
              <p>No trade history</p>
            </div>
          )}
          {activeTab === 'balances' && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">💰</div>
              <p>Loading balances...</p>
            </div>
          )}
          {activeTab === 'funding' && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">⚡</div>
              <p>No funding history</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Trading() {
  const [showRiskBanner, setShowRiskBanner] = useState(true);
  const [selectedTradingType, setSelectedTradingType] = useState("spot");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen page-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Risk Disclosure Banner */}
        {showRiskBanner && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 relative">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-300 text-sm">
                  <strong>Risk Warning:</strong> Cryptocurrency trading involves substantial risk of loss. Only invest what you can afford to lose completely.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link href="/risk-disclosure">
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 h-6 px-2">
                      Read Full Risk Disclosure
                    </Button>
                  </Link>
                  <Link href="/terms-of-service">
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 h-6 px-2">
                      Terms of Service
                    </Button>
                  </Link>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowRiskBanner(false)}
                className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              NebulaX Trading Platform
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Advanced tools for both beginners and professional traders</p>
        </div>

        {/* Comprehensive Trading Platform - Remove max-width constraint for trading sections */}
        <Tabs defaultValue="trading" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass text-sm">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="portfolio">AI Portfolio</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              {/* Trading Type Selector */}
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Label className="font-semibold">Trading Type:</Label>
                    <div className="relative dropdown-container" ref={dropdownRef}>
                      {/* Custom Trading Type Dropdown */}
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            selectedTradingType === 'spot' ? 'bg-green-500' :
                            selectedTradingType === 'futures' ? 'bg-blue-500' :
                            selectedTradingType === 'options' ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`}></span>
                          <span>
                            {selectedTradingType === 'spot' ? 'Spot Trading' :
                             selectedTradingType === 'futures' ? 'Futures Trading' :
                             selectedTradingType === 'options' ? 'Options Trading' :
                             'P2P Trading'}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>

                      {/* Custom Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="dropdown-menu absolute top-full left-0 mt-1 w-[180px] z-[9999] bg-slate-900 border border-slate-700 rounded-md shadow-xl overflow-hidden">
                          <div
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                            onClick={() => {
                              setSelectedTradingType('spot');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Spot Trading</span>
                          </div>
                          <div
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                            onClick={() => {
                              setSelectedTradingType('futures');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Futures Trading</span>
                          </div>
                          <div
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                            onClick={() => {
                              setSelectedTradingType('options');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Options Trading</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 🆕 NEW: Added Hyperliquid badge for Spot and Futures */}
                    {(selectedTradingType === 'spot' || selectedTradingType === 'futures') && (
                      <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                        Powered by Hyperliquid
                      </Badge>
                    )}
                    <Badge variant="outline" className="ml-auto">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Live Market
                    </Badge>
                  </div>
                </CardContent>
              </Card>

            {/* 🆕 NEW: Spot Trading Layout - Professional 3:1 Ratio with QuickTrade Below OrderBook */}
            {selectedTradingType === "spot" && (
              <>
                {/* Live Market Data Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <MarketDataStatus />
                  <BlockchainWalletTracker />
                </div>

                {/* Live Price Ticker */}
                <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center justify-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 min-h-[60px]">
                      <LivePriceWithChange symbol="BTC/USDT" className="text-center w-full" />
                    </div>
                    <div className="flex items-center justify-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 min-h-[60px]">
                      <LivePriceWithChange symbol="ETH/USDT" className="text-center w-full" />
                    </div>
                    <div className="flex items-center justify-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 min-h-[60px]">
                      <LivePriceWithChange symbol="SOL/USDT" className="text-center w-full" />
                    </div>
                    <div className="flex items-center justify-center p-3 bg-slate-800/50 rounded-lg border border-slate-600 min-h-[60px]">
                      <LivePriceWithChange symbol="ADA/USDT" className="text-center w-full" />
                    </div>
                  </div>
                </div>

                {/* Main Trading Area - Professional Layout - NO GRID CONSTRAINTS */}
                <div className="space-y-4">
                  {/* Top Section: Chart + Side Panel (Flexbox Layout) */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Chart Section - Takes remaining space */}
                    <div className="flex-1">
                      <div className="glass rounded-lg border border-slate-700 overflow-hidden">
                        <TradingChart symbol="BTC/USDT" />
                      </div>
                    </div>
                    
                    {/* Right Panel - Fixed width on desktop, full width on mobile */}
                    <div className="w-full lg:w-80 space-y-4">
                      {/* OrderBook Component */}
                      <div className="glass rounded-lg border border-slate-700 overflow-hidden">
                        <OrderBook symbol="BTC/USDT" />
                      </div>
                      
                      {/* QuickTrade Panel - Hyperliquid Trading Interface */}
                      <div className="glass rounded-lg border border-slate-700 overflow-hidden">
                        <HyperliquidTradingPanel tradingMode="spot" />
                      </div>
                    </div>
                  </div>

                  {/* Trading Dashboard - Account Balance, Active Orders, Hyperliquid Status */}
                  <TradingDashboard tradingMode="spot" selectedPair="BTC/USDT" />

                  {/* Analytics Sections - Flexbox Layout */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Recent Trades */}
                    <div className="flex-1 glass rounded-lg border border-slate-700 overflow-hidden">
                      <RecentTrades symbol="BTC/USDT" />
                    </div>
                    
                    {/* Portfolio Overview */}
                    <div className="flex-1 glass rounded-lg border border-slate-700 overflow-hidden">
                      <PortfolioOverview />
                    </div>
                    
                    {/* AI Trading Assistant */}
                    <div className="flex-1 glass rounded-lg border border-slate-700 overflow-hidden">
                      <SimpleAIChat />
                    </div>
                  </div>
                </div>

              </>
            )}

            {/* 🆕 NEW: Futures Trading Layout - Professional 3:1 Ratio with QuickTrade Below OrderBook */}
            {selectedTradingType === "futures" && (
              <>
                {/* Hyperliquid Futures Header */}
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Hyperliquid Perpetual Futures</h3>
                      <p className="text-gray-300 mb-4">Professional perpetual futures trading with up to 50x leverage</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-blue-400 mb-2">Perpetual Contracts</h4>
                          <p className="text-gray-400 text-sm">Trade without expiry dates with funding rates</p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-purple-400 mb-2">High Leverage</h4>
                          <p className="text-gray-400 text-sm">Up to 50x leverage on major pairs</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-green-400 mb-2">Low Fees</h4>
                          <p className="text-gray-400 text-sm">Competitive maker/taker fees</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Trading Area - Professional Layout - NO GRID CONSTRAINTS */}
                <div className="space-y-4">
                  {/* Top Section: Chart + Side Panel (Flexbox Layout) */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Chart Section - Takes remaining space */}
                    <div className="flex-1">
                      <TradingChart symbol="BTC-PERP" />
                    </div>
                    
                    {/* Right Panel - Fixed width on desktop, full width on mobile */}
                    <div className="w-full lg:w-80 space-y-4">
                      {/* OrderBook Component */}
                      <div className="glass rounded-lg border border-slate-700 overflow-hidden">
                        <OrderBook symbol="BTC-PERP" />
                      </div>
                      
                      {/* QuickTrade Panel - Hyperliquid Trading Interface */}
                      <div className="glass rounded-lg border border-slate-700 overflow-hidden">
                        <HyperliquidTradingPanel tradingMode="futures" />
                      </div>
                    </div>
                  </div>

                  {/* Trading Dashboard - Account Balance, Active Orders, Hyperliquid Status */}
                  <TradingDashboard tradingMode="futures" selectedPair="BTC-PERP" />

                  {/* Analytics Sections - Flexbox Layout */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Recent Trades */}
                    <div className="flex-1 glass rounded-lg border border-slate-700 overflow-hidden">
                      <RecentTrades symbol="BTC-PERP" />
                    </div>
                    
                    {/* Portfolio Overview */}
                    <div className="flex-1 glass rounded-lg border border-slate-700 overflow-hidden">
                      <PortfolioOverview />
                    </div>
                    
                    {/* Portfolio Quick Actions */}
                    <div className="flex-1 glass rounded-lg border border-slate-700 overflow-hidden">
                      <PortfolioQuickActions />
                    </div>
                  </div>
                </div>

              </>
            )}

            {selectedTradingType === "options" && (
              <div className="space-y-6">
                <Card className="glass">
                  <CardContent className="p-12 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-white">🚀</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">Options Trading</h3>
                      <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-4">
                        <span className="text-yellow-400 font-semibold">Coming Soon</span>
                      </div>
                      <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                        Advanced options strategies with customizable strikes and expiries are currently under development. 
                        We're building a comprehensive options trading platform with professional-grade tools.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-purple-400 mb-2">Call & Put Options</h4>
                          <p className="text-gray-400 text-sm">European & American style options</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-green-400 mb-2">Options Strategies</h4>
                          <p className="text-gray-400 text-sm">Spreads, straddles, and complex strategies</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-4">Stay tuned for updates!</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-green-600" disabled>
                        Launch Options Platform
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            </ProtectedTradingWrapper>
          </TabsContent>

          {/* 🆕 UNCHANGED: Swap tab still uses 0x Protocol */}
          <TabsContent value="swap" className="space-y-6 swap-tab-content">
            <ProtectedTradingWrapper feature="trading">
              <div className="mb-6">
                <Card className="glass">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Token Swap</h2>
                    <p className="text-gray-400">Instantly swap tokens at the best available rates powered by 0x Protocol</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Centered Swap Interface - Fixed container */}
              <div className="flex justify-center mb-6 swap-interface-container">
                <div className="w-full max-w-md swap-interface-wrapper">
                  <SwapInterface />
                </div>
              </div>

              {/* Portfolio & Info Below - Full Width */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PortfolioOverview />
                <Card className="glass">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">About 0x Swaps</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>✓ Best prices from 100+ liquidity sources</li>
                      <li>✓ No registration required</li>
                      <li>✓ Non-custodial & secure</li>
                      <li>✓ Minimal slippage</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ProtectedTradingWrapper>
          </TabsContent>

          <TabsContent value="enhanced" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <EnhancedTradingInterface />
            </ProtectedTradingWrapper>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <PortfolioBalanceDisplay />
            </ProtectedTradingWrapper>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialTradingCommunity />
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <PersonalizedLearningPath />
              </div>
              <div>
                <CryptoEducationQuiz />
              </div>
            </div>
            <PersonalizedLearning />
          </TabsContent>

          <TabsContent value="nft" className="space-y-6">
            <NFTMarketplace />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceTradingCommands />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              {/* 🆕 NEW: Integrated Recovery Dashboard with Wallet & Recent Swaps */}
              <div className="space-y-6">
                {/* Dashboard Header */}
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Trading Dashboard</h2>
                        <p className="text-gray-400">Wallet balance, recent swaps, and recovery status</p>
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
            </ProtectedTradingWrapper>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <APIServicesDashboard />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <CryptoMemeGenerator />
              </div>
              <div>
                <AccessibilityMode />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mood" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <MarketMoodTranslator />
              </div>
              <div>
                <AnimatedDataVisualizations />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SocialSharingWidget />
          </TabsContent>

          {/* 🆕 UNCHANGED: P2P tab still uses 0x Protocol */}
          <TabsContent value="p2p" className="space-y-6">
            <ProtectedTradingWrapper feature="p2p">
              <P2PTrading />
            </ProtectedTradingWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
