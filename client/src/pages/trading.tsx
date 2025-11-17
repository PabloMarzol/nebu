import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import ProtectedTradingWrapper from "@/components/auth/protected-trading-wrapper";
import PortfolioBalanceDisplay from "@/components/trading/portfolio-balance-display";

// Layout Components
import PageHeader from "@/components/trading/layout/PageHeader";
import RiskBanner from "@/components/trading/layout/RiskBanner";
import TradingTypeSelector from "@/components/trading/layout/TradingTypeSelector";
import SpotTradingLayout from "@/components/trading/layout/SpotTradingLayout";
import FuturesTradingLayout from "@/components/trading/layout/FuturesTradingLayout";
import SwapLayout from "@/components/trading/layout/SwapLayout";
import DashboardLayout from "@/components/trading/layout/DashboardLayout";
import OptionsPlaceholder from "@/components/trading/layout/OptionsPlaceholder";

/**
 * Main Trading Page
 * Clean, modular architecture for professional trading experience
 *
 * Features:
 * - Spot Trading (Hyperliquid integration)
 * - Futures Trading (Perpetual contracts with leverage)
 * - Token Swaps (0x Protocol)
 * - AI Portfolio Management
 * - Trading Dashboard
 *
 * Architecture:
 * - Modular layout components for maintainability
 * - Clean separation of concerns
 * - Protected routes for security
 * - Responsive design with CSS Grid
 */
export default function Trading() {
  const [selectedTradingType, setSelectedTradingType] = useState("spot");

  return (
    <div className="min-h-screen page-content">
      <div className="w-full min-w-0">
        {/* Risk Disclosure Banner */}
        <RiskBanner />

        {/* Page Header */}
        <PageHeader />

        {/* Main Trading Tabs */}
        <Tabs defaultValue="trading" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass text-sm">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="portfolio">AI Portfolio</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Trading Tab - Spot, Futures, Options */}
          <TabsContent value="trading" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              {/* Trading Type Selector */}
              <TradingTypeSelector
                selectedType={selectedTradingType}
                onTypeChange={setSelectedTradingType}
              />

              {/* Spot Trading Layout */}
              {selectedTradingType === "spot" && <SpotTradingLayout />}

              {/* Futures Trading Layout */}
              {selectedTradingType === "futures" && <FuturesTradingLayout />}

              {/* Options Trading Placeholder */}
              {selectedTradingType === "options" && <OptionsPlaceholder />}
            </ProtectedTradingWrapper>
          </TabsContent>

          {/* Swap Tab - 0x Protocol Token Swaps */}
          <TabsContent value="swap" className="space-y-6 swap-tab-content">
            <ProtectedTradingWrapper feature="trading">
              <SwapLayout />
            </ProtectedTradingWrapper>
          </TabsContent>

          {/* AI Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <PortfolioBalanceDisplay />
            </ProtectedTradingWrapper>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <ProtectedTradingWrapper feature="trading">
              <DashboardLayout />
            </ProtectedTradingWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
