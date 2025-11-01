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
import CryptoEmotionTracker from "@/components/trading/crypto-emotion-tracker";
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
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SwapInterface from "@/components/trading/SwapInterface";
import ProtectedTradingWrapper from "@/components/auth/protected-trading-wrapper";
import EnhancedTradingInterface from "@/components/trading/enhanced-trading-interface";
import PortfolioBalanceDisplay from "@/components/trading/portfolio-balance-display";

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

        {/* Comprehensive Trading Platform */}
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
              <Card className="glass relative">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4 relative z-10">
                    <Label className="font-semibold">Trading Type:</Label>
                    <div className="relative" ref={dropdownRef}>
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
                        <div className="absolute top-full left-0 mt-1 w-[180px] z-50 bg-slate-900 border border-slate-700 rounded-md shadow-xl overflow-hidden">
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
                          <div
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 flex items-center space-x-2"
                            onClick={() => {
                              setSelectedTradingType('p2p');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span>P2P Trading</span>
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

            {/* 🆕 MODIFIED: Spot Trading now uses Hyperliquid */}
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

                {/* Main Spot Trading Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <OrderBook symbol="BTC/USDT" />
                  </div>
                  <div className="lg:col-span-3">
                    <TradingChart symbol="BTC/USDT" />
                  </div>
                </div>

                {/* 🆕 CHANGED: Using HyperliquidTradingPanel instead of LiveTradingPanel */}
                <div className="mb-6">
                  <HyperliquidTradingPanel tradingMode="spot" />
                </div>

                {/* Spot Trading Analytics & Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <RecentTrades symbol="BTC/USDT" />
                  <PortfolioOverview />
                  <PortfolioQuickActions />
                  <div className="min-h-[600px]">
                    <SimpleAIChat />
                  </div>
                </div>

                {/* Crypto Emotion Tracker */}
                <CryptoEmotionTracker />
              </>
            )}

            {/* 🆕 MODIFIED: Futures Trading now uses Hyperliquid */}
            {selectedTradingType === "futures" && (
              <div className="space-y-6">
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

                {/* Futures Chart and Trading */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <OrderBook symbol="BTC-PERP" />
                  </div>
                  <div className="lg:col-span-3">
                    <TradingChart symbol="BTC/USDT" />
                  </div>
                </div>

                {/* 🆕 NEW: Hyperliquid Futures Trading Panel */}
                <div className="mb-6">
                  <HyperliquidTradingPanel tradingMode="futures" />
                </div>

                {/* Futures Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <RecentTrades symbol="BTC-PERP" />
                  <PortfolioOverview />
                  <PortfolioQuickActions />
                </div>
              </div>
            )}

            {selectedTradingType === "options" && (
              <div className="space-y-6">
                <Card className="glass">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Options Trading</h3>
                    <p className="text-gray-300 mb-6">Advanced options strategies with customizable strikes and expiries</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Call & Put Options</h4>
                        <p className="text-gray-400 text-sm">Buy and sell European & American style options</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-green-400 mb-2">Options Strategies</h4>
                        <p className="text-gray-400 text-sm">Spreads, straddles, and complex strategies</p>
                      </div>
                    </div>
                    <Button className="mt-6 bg-gradient-to-r from-purple-600 to-green-600">
                      Launch Options Platform
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTradingType === "p2p" && (
              <div className="space-y-6">
                <P2PTrading />
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
