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

// ============================================================================
// PROFESSIONAL TRADING LAYOUT COMPONENTS
// Clean, modular, and reusable - NO OVERLAPS
// ============================================================================

interface TradingHeaderProps {
  tradingMode: 'spot' | 'futures';
  selectedPair: string;
  onPairChange: (pair: string) => void;
}

function TradingHeader({ tradingMode, selectedPair, onPairChange }: TradingHeaderProps) {
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
    <div className="w-full bg-[#0b0e11] border-b border-slate-800 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left: Pair Selector */}
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

        {/* Right: Market Metrics */}
        <div className="flex items-center gap-6 flex-wrap">
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
          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Powered by Hyperliquid
          </Badge>
        </div>
      </div>
    </div>
  );
}

interface ProfessionalTradingLayoutProps {
  tradingMode: 'spot' | 'futures';
}

function ProfessionalTradingLayout({ tradingMode }: ProfessionalTradingLayoutProps) {
  const [selectedPair, setSelectedPair] = useState(
    tradingMode === 'futures' ? 'BTC-PERP' : 'BTC/USDC'
  );

  return (
    <div className="professional-trading-container">
      {/* Header - Fixed at top */}
      <div className="trading-header-section">
        <TradingHeader
          tradingMode={tradingMode}
          selectedPair={selectedPair}
          onPairChange={setSelectedPair}
        />
      </div>

      {/* Main Trading Area - Grid Layout */}
      <div className="trading-main-grid">
        {/* Left: Trading Chart */}
        <div className="trading-chart-section">
          <div className="h-full w-full bg-[#0b0e11] rounded-lg overflow-hidden">
            <TradingChart symbol={selectedPair} />
          </div>
        </div>

        {/* Right: OrderBook + Trading Panel */}
        <div className="trading-sidebar-section">
          {/* OrderBook - Top Half */}
          <div className="orderbook-container">
            <OrderBook symbol={selectedPair} />
          </div>

          {/* Trading Panel - Bottom Half */}
          <div className="trading-panel-container">
            <HyperliquidTradingPanel tradingMode={tradingMode} />
          </div>
        </div>
      </div>

      {/* Bottom: Active Orders, Positions, etc. */}
      <div className="trading-bottom-section">
        <TradingDashboard tradingMode={tradingMode} selectedPair={selectedPair} />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN TRADING PAGE
// ============================================================================

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
      <div className="w-full min-w-0">
        {/* Risk Disclosure Banner */}
        {showRiskBanner && (
          <div className="bg-red-50/10 border-red-50/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-300 text-sm">
                  <strong>Risk Warning:</strong> Cryptocurrency trading involves substantial risk of loss. Only invest what you can afford to lose completely.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link href="/risk-disclosure">
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-30 h-6 px-2">
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

        {/* Main Trading Platform Tabs */}
        <Tabs defaultValue="trading" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass text-sm">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="portfolio">AI Portfolio</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* TRADING TAB - Spot & Futures with Hyperliquid */}
          <TabsContent value="trading" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              {/* Trading Type Selector */}
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Label className="font-semibold">Trading Type:</Label>
                    <div className="relative dropdown-container" ref={dropdownRef}>
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
                  </div>
                </CardContent>
              </Card>

              {/* Spot Trading Layout */}
              {selectedTradingType === "spot" && (
                <ProfessionalTradingLayout tradingMode="spot" />
              )}

              {/* Futures Trading Layout */}
              {selectedTradingType === "futures" && (
                <ProfessionalTradingLayout tradingMode="futures" />
              )}

              {/* Options Trading - Coming Soon */}
              {selectedTradingType === "options" && (
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
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </ProtectedTradingWrapper>
          </TabsContent>

          {/* SWAP TAB - 0x Protocol */}
          <TabsContent value="swap" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <div className="mb-6">
                <Card className="glass">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Token Swap</h2>
                    <p className="text-gray-400">Instantly swap tokens at the best available rates powered by 0x Protocol</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-full max-w-md">
                  <SwapInterface />
                </div>
              </div>

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

          {/* PORTFOLIO TAB */}
          <TabsContent value="portfolio" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <PortfolioBalanceDisplay />
            </ProtectedTradingWrapper>
          </TabsContent>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <div className="space-y-6">
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

                <RecoveryDashboard />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PortfolioOverview />
                  <PortfolioBalanceDisplay />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentTrades symbol="BTC/USDT" />
                  <div className="space-y-4">
                    <PortfolioQuickActions />
                    <SimpleAIChat />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MarketDataStatus />
                  <BlockchainWalletTracker />
                </div>
              </div>
            </ProtectedTradingWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
