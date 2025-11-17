import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import SwapInterface from '@/components/trading/SwapInterface';
import ProtectedTradingWrapper from '@/components/auth/protected-trading-wrapper';
import SpotTradingLayout from '@/components/trading/layout/SpotTradingLayout';
import FuturesTradingLayout from '@/components/trading/layout/FuturesTradingLayout';

// Trading pair selector component
function TradingPairSelector({ 
  tradingMode, 
  selectedPair, 
  onPairChange 
}: { 
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
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        {/* Pair Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
          >
            <span className={`text-2xl ${currentPair.color}`}>{currentPair.icon}</span>
            <div>
              <div className="font-semibold text-white">{currentPair.name}</div>
              <div className="text-sm text-slate-400">{currentPair.symbol}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
              {availablePairs.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => {
                    onPairChange(pair.symbol);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-slate-800 transition-colors first:rounded-t-lg last:rounded-b-lg text-left"
                >
                  <span className={`text-xl ${pair.color}`}>{pair.icon}</span>
                  <div>
                    <div className="font-medium text-white">{pair.name}</div>
                    <div className="text-sm text-slate-400">{pair.symbol}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Market Metrics */}
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-xs text-slate-400 font-medium">Mark Price</div>
            <div className="font-bold text-white">$43,250.50</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-medium">24h Change</div>
            <div className="font-bold text-green-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />+2.45%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-medium">24h Volume</div>
            <div className="font-bold text-white">$1.2B</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 font-medium">Open Interest</div>
            <div className="font-bold text-white">$850M</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Trading() {
  const [activeTradingPair, setActiveTradingPair] = useState("BTC/USDC");
  const [activeFuturesPair, setActiveFuturesPair] = useState("BTC-PERP");

  return (
    <div className="min-h-screen bg-slate-950 page-content">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              NebulaX Trading Platform
            </span>
          </h1>
          <p className="text-xl text-slate-400">Advanced tools for both beginners and professional traders</p>
        </div>

        <Tabs defaultValue="spot" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-700 p-1 mb-6">
            <TabsTrigger 
              value="spot" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all"
            >
              Spot Trading
            </TabsTrigger>
            <TabsTrigger 
              value="futures" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all"
            >
              Futures Trading
            </TabsTrigger>
            <TabsTrigger 
              value="swap" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-60 data-[state=active]:text-white transition-all"
            >
              Token Swap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spot" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <TradingPairSelector 
                tradingMode="spot" 
                selectedPair={activeTradingPair} 
                onPairChange={setActiveTradingPair}
              />
              <SpotTradingLayout selectedPair={activeTradingPair} />
            </ProtectedTradingWrapper>
          </TabsContent>

          <TabsContent value="futures" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <TradingPairSelector 
                tradingMode="futures" 
                selectedPair={activeFuturesPair} 
                onPairChange={setActiveFuturesPair}
              />
              <FuturesTradingLayout selectedPair={activeFuturesPair} />
            </ProtectedTradingWrapper>
          </TabsContent>

          <TabsContent value="swap" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <Card className="bg-slate-900 border border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Token Swap</h2>
                  <p className="text-slate-400 mb-6">Instantly swap tokens at the best available rates powered by 0x Protocol</p>
                  <SwapInterface />
                </CardContent>
              </Card>
            </ProtectedTradingWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
