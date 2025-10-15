import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Layers,
  Shuffle,
  Coins,
  TrendingUp,
  Zap,
  Target,
  Shield,
  BarChart3,
  ArrowLeftRight,
  Network,
  Lock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  Globe,
  Link as LinkIcon,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import cross-chain and DeFi components
import CrossChainBridge from "@/components/defi/cross-chain-bridge";
import DEXAggregator from "@/components/defi/dex-aggregator";
import YieldFarming from "@/components/defi/yield-farming";
import ArbitrageDetector from "@/components/defi/arbitrage-detector";
import MultiChainPortfolio from "@/components/defi/multi-chain-portfolio";

export default function AdvancedIntegrationsPhase4() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState({
    crossChain: 85,
    dex: 92,
    defi: 78,
    arbitrage: 88,
    multiChain: 95
  });

  const components = [
    {
      id: 'cross-chain-bridge',
      title: 'Cross-Chain Bridge',
      description: 'Multi-blockchain asset transfers and bridging',
      icon: <ArrowLeftRight className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Ethereum ↔ BSC', 'Polygon ↔ Avalanche', 'Solana ↔ Terra', 'Atomic swaps'],
      component: CrossChainBridge,
      status: integrationStatus.crossChain
    },
    {
      id: 'dex-aggregator',
      title: 'DEX Aggregator',
      description: 'Best price routing across decentralized exchanges',
      icon: <Shuffle className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      features: ['1inch integration', 'Uniswap V3', 'PancakeSwap', 'Best price routing'],
      component: DEXAggregator,
      status: integrationStatus.dex
    },
    {
      id: 'yield-farming',
      title: 'DeFi Yield Farming',
      description: 'Automated yield optimization and farming',
      icon: <Coins className="w-6 h-6" />,
      color: 'from-green-500 to-teal-500',
      features: ['Auto-compound', 'Pool analysis', 'Risk assessment', 'APY optimization'],
      component: YieldFarming,
      status: integrationStatus.defi
    },
    {
      id: 'arbitrage-detector',
      title: 'Arbitrage Detection',
      description: 'Cross-exchange and cross-chain arbitrage opportunities',
      icon: <Target className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      features: ['Real-time scanning', 'Profit calculation', 'Gas optimization', 'Auto-execution'],
      component: ArbitrageDetector,
      status: integrationStatus.arbitrage
    },
    {
      id: 'multi-chain-portfolio',
      title: 'Multi-Chain Portfolio',
      description: 'Unified portfolio tracking across all chains',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500',
      features: ['10+ blockchains', 'Real-time sync', 'Cross-chain analytics', 'Unified dashboard'],
      component: MultiChainPortfolio,
      status: integrationStatus.multiChain
    }
  ];

  const supportedChains = [
    { name: 'Ethereum', symbol: 'ETH', color: '#627EEA', tvl: '$45.2B' },
    { name: 'Binance Smart Chain', symbol: 'BSC', color: '#F3BA2F', tvl: '$12.8B' },
    { name: 'Polygon', symbol: 'MATIC', color: '#8247E5', tvl: '$8.9B' },
    { name: 'Avalanche', symbol: 'AVAX', color: '#E84142', tvl: '$6.7B' },
    { name: 'Solana', symbol: 'SOL', color: '#9945FF', tvl: '$5.4B' },
    { name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', tvl: '$4.1B' },
    { name: 'Optimism', symbol: 'OP', color: '#FF0420', tvl: '$3.2B' },
    { name: 'Fantom', symbol: 'FTM', color: '#1969FF', tvl: '$2.1B' }
  ];

  const protocolIntegrations = [
    { name: 'Uniswap V3', type: 'DEX', apy: '12.5%', tvl: '$4.2B' },
    { name: 'PancakeSwap', type: 'DEX', apy: '18.7%', tvl: '$2.8B' },
    { name: 'Aave', type: 'Lending', apy: '8.9%', tvl: '$11.5B' },
    { name: 'Compound', type: 'Lending', apy: '6.2%', tvl: '$8.7B' },
    { name: 'Curve', type: 'Stablecoins', apy: '15.3%', tvl: '$6.9B' },
    { name: 'Yearn Finance', type: 'Vaults', apy: '22.1%', tvl: '$1.2B' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrationStatus(prev => ({
        crossChain: Math.min(100, prev.crossChain + Math.random() * 2),
        dex: Math.min(100, prev.dex + Math.random() * 1),
        defi: Math.min(100, prev.defi + Math.random() * 3),
        arbitrage: Math.min(100, prev.arbitrage + Math.random() * 2),
        multiChain: Math.min(100, prev.multiChain + Math.random() * 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (selectedComponent) {
    const component = components.find(c => c.id === selectedComponent);
    if (component) {
      const ComponentToRender = component.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="p-4 bg-black/20 backdrop-blur-lg">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setSelectedComponent(null)}
                className="text-white"
              >
                ← Back to Overview
              </Button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">{component.title}</h1>
                <p className="text-sm text-gray-300">{component.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {component.status.toFixed(0)}% Ready
                </Badge>
              </div>
            </div>
          </div>
          <ComponentToRender />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Phase 4: Advanced Integrations & DeFi
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Cross-chain bridges, DeFi protocols, and advanced blockchain integrations
          </p>
          
          {/* Integration Status */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">Cross-Chain Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-blue-400" />
              <span className="text-sm">8 Blockchains</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Real-time Bridge</span>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chains">Blockchains</TabsTrigger>
            <TabsTrigger value="protocols">DeFi Protocols</TabsTrigger>
            <TabsTrigger value="integrations">Live Integrations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {components.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group h-full"
                        onClick={() => setSelectedComponent(component.id)}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${component.color}`}>
                            {component.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{component.title}</h3>
                            <p className="text-sm text-gray-400">{component.description}</p>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Integration Status</span>
                          <span className="text-sm font-medium">{component.status.toFixed(0)}%</span>
                        </div>
                        <Progress value={component.status} className="h-2" />
                        
                        <div className="grid grid-cols-1 gap-2">
                          {component.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-3 border-t border-white/10">
                          <Button variant="outline" className="w-full group-hover:bg-white/10 transition-colors">
                            Launch Integration
                            <LinkIcon className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Blockchains Tab */}
          <TabsContent value="chains" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportedChains.map((chain, index) => (
                <motion.div
                  key={chain.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                    <CardHeader className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: chain.color }}
                      >
                        {chain.symbol}
                      </div>
                      <CardTitle className="text-lg">{chain.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        <div>
                          <div className="text-2xl font-bold text-green-400">{chain.tvl}</div>
                          <div className="text-sm text-gray-400">Total Value Locked</div>
                        </div>
                        <Badge variant="outline" className="w-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Integrated
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* DeFi Protocols Tab */}
          <TabsContent value="protocols" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {protocolIntegrations.map((protocol, index) => (
                <motion.div
                  key={protocol.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold">{protocol.name}</h3>
                          <p className="text-sm text-gray-400">{protocol.type}</p>
                        </div>
                        <Badge variant="secondary">{protocol.apy}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">TVL</span>
                          <span className="font-medium">{protocol.tvl}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">APY</span>
                          <span className="font-medium text-green-400">{protocol.apy}</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Coins className="w-4 h-4 mr-2" />
                          Connect Protocol
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Live Integrations Tab */}
          <TabsContent value="integrations" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Integration Health */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Integration Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(integrationStatus).map(([key, value]) => {
                      const component = components.find(c => c.id.replace('-', '_').includes(key.toLowerCase()));
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{component?.title || key}</span>
                            <span className="text-sm font-medium">{value.toFixed(0)}%</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Live Statistics */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Live Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-green-400">$2.4M</div>
                      <div className="text-xs text-gray-400">Cross-Chain Volume</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">847</div>
                      <div className="text-xs text-gray-400">Bridge Transactions</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-purple-400">23.4%</div>
                      <div className="text-xs text-gray-400">Avg DeFi APY</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-orange-400">12</div>
                      <div className="text-xs text-gray-400">Active Arbitrages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Implementation Status */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Phase 4 Implementation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    {components.map((component) => (
                      <div key={component.id} className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-sm">{component.title}</h4>
                        <p className="text-xs text-gray-400">{component.status.toFixed(0)}% Complete</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold mb-2">Next: Phase 5 - Enterprise & Institutional</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong>Institutional APIs</strong>
                        <p className="text-gray-400">FIX protocol, advanced order types, prime brokerage</p>
                      </div>
                      <div>
                        <strong>Compliance Tools</strong>
                        <p className="text-gray-400">Transaction monitoring, regulatory reporting, audit trails</p>
                      </div>
                      <div>
                        <strong>Enterprise Features</strong>
                        <p className="text-gray-400">White-label solutions, custody integration, advanced analytics</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}