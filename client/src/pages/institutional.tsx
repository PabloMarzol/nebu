import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarginTrading from "@/components/trading/margin-trading";
import FuturesTrading from "@/components/trading/futures-trading";
import OptionsTrading from "@/components/trading/options-trading";
import StakingRewards from "@/components/trading/staking-rewards";
import APITrading from "@/components/trading/api-trading";
import AdvancedOrders from "@/components/trading/advanced-orders";
import InstitutionalDashboard from "@/components/trading/institutional-dashboard";
import ProtectedTradingWrapper from "@/components/auth/protected-trading-wrapper";

export default function Institutional() {
  return (
    <div className="min-h-screen page-content pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 page-header">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Institutional Trading
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced trading tools and institutional-grade features for professional traders and institutions.
          </p>
        </div>

        <ProtectedTradingWrapper feature="institutional">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="margin">Margin</TabsTrigger>
              <TabsTrigger value="futures">Futures</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <InstitutionalDashboard />
          </TabsContent>

          <TabsContent value="margin" className="mt-6">
            <MarginTrading symbol="BTC/USDT" />
          </TabsContent>

          <TabsContent value="futures" className="mt-6">
            <FuturesTrading symbol="BTC/USDT" />
          </TabsContent>

          <TabsContent value="options" className="mt-6">
            <OptionsTrading symbol="BTC/USDT" />
          </TabsContent>

          <TabsContent value="staking" className="mt-6">
            <StakingRewards />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <AdvancedOrders symbol="BTC/USDT" />
          </TabsContent>

            <TabsContent value="api" className="mt-6">
              <APITrading />
            </TabsContent>
          </Tabs>
        </ProtectedTradingWrapper>
      </div>
    </div>
  );
}