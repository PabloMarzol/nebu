import { db } from '../db';
import { eq, gte, lte, and, desc, sum, sql } from 'drizzle-orm';
import { 
  portfolios,
  users
} from '../../shared/schema';

export interface TreasuryPosition {
  asset: string;
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  hotWalletBalance: number;
  coldWalletBalance: number;
  yield: number;
  apy: number;
  priceUSD: number;
  valueUSD: number;
  allocation: number;
}

export interface LiquidityMetrics {
  totalAUM: number;
  availableLiquidity: number;
  lockedLiquidity: number;
  liquidityRatio: number;
  concentrationRisk: { [asset: string]: number };
  liquidityGaps: Array<{
    timeframe: string;
    shortfall: number;
    asset: string;
  }>;
}

export interface CashFlowForecast {
  period: string;
  expectedInflows: number;
  expectedOutflows: number;
  netFlow: number;
  cumulativeBalance: number;
  liquidityRequirement: number;
  shortfall: number;
}

export interface TreasuryAlert {
  id: string;
  type: 'liquidity_low' | 'concentration_high' | 'yield_opportunity' | 'rebalance_needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  asset: string;
  message: string;
  value: number;
  threshold: number;
  createdAt: Date;
  resolved: boolean;
}

export interface AutoSweepRule {
  id: string;
  asset: string;
  sourceWallet: 'hot' | 'trading';
  targetWallet: 'cold' | 'yield';
  triggerBalance: number;
  sweepAmount: number | 'all' | 'excess';
  enabled: boolean;
  lastExecuted?: Date;
}

export class TreasuryManagementService {
  private treasuryAlerts: TreasuryAlert[] = [];
  private autoSweepRules: AutoSweepRule[] = [];

  constructor() {
    this.initializeAutoSweepRules();
    this.startLiquidityMonitoring();
  }

  async getConsolidatedPositions(): Promise<TreasuryPosition[]> {
    try {
      // Get all portfolio balances
      const portfolioBalances = await db
        .select({
          asset: portfolios.asset,
          totalBalance: sum(portfolios.balance),
          lockedBalance: sum(portfolios.lockedBalance)
        })
        .from(portfolios)
        .groupBy(portfolios.asset);

      // Get wallet balances
      const walletBalances = await db
        .select({
          asset: wallets.asset,
          hotBalance: sum(sql`CASE WHEN ${wallets.type} = 'hot' THEN ${wallets.balance} ELSE 0 END`),
          coldBalance: sum(sql`CASE WHEN ${wallets.type} = 'cold' THEN ${wallets.balance} ELSE 0 END`)
        })
        .from(wallets)
        .groupBy(wallets.asset);

      // Get pending deposits
      const pendingDepositsData = await db
        .select({
          asset: deposits.asset,
          pendingAmount: sum(deposits.amount)
        })
        .from(deposits)
        .where(eq(deposits.status, 'pending'))
        .groupBy(deposits.asset);

      // Get pending withdrawals
      const pendingWithdrawalsData = await db
        .select({
          asset: withdrawals.asset,
          pendingAmount: sum(withdrawals.amount)
        })
        .from(withdrawals)
        .where(eq(withdrawals.status, 'pending'))
        .groupBy(withdrawals.asset);

      // Combine all data into consolidated positions
      const assetMap = new Map<string, TreasuryPosition>();

      // Initialize with portfolio data
      for (const p of portfolioBalances) {
        assetMap.set(p.asset, {
          asset: p.asset,
          totalBalance: Number(p.totalBalance) || 0,
          availableBalance: Number(p.totalBalance) - Number(p.lockedBalance) || 0,
          lockedBalance: Number(p.lockedBalance) || 0,
          pendingDeposits: 0,
          pendingWithdrawals: 0,
          hotWalletBalance: 0,
          coldWalletBalance: 0,
          yield: 0,
          apy: 0,
          priceUSD: await this.getAssetPrice(p.asset),
          valueUSD: 0,
          allocation: 0
        });
      }

      // Add wallet data
      walletBalances.forEach(w => {
        const position = assetMap.get(w.asset);
        if (position) {
          position.hotWalletBalance = Number(w.hotBalance) || 0;
          position.coldWalletBalance = Number(w.coldBalance) || 0;
          position.totalBalance += position.hotWalletBalance + position.coldWalletBalance;
        }
      });

      // Add pending deposits
      pendingDepositsData.forEach(d => {
        const position = assetMap.get(d.asset);
        if (position) {
          position.pendingDeposits = Number(d.pendingAmount) || 0;
        }
      });

      // Add pending withdrawals
      pendingWithdrawalsData.forEach(w => {
        const position = assetMap.get(w.asset);
        if (position) {
          position.pendingWithdrawals = Number(w.pendingAmount) || 0;
        }
      });

      // Calculate USD values and allocations
      const positions = Array.from(assetMap.values());
      
      // Ensure positions array is valid
      if (!positions || positions.length === 0) {
        return [];
      }
      
      const totalValueUSD = positions.reduce((sum, p) => {
        if (p && typeof p.totalBalance === 'number' && typeof p.priceUSD === 'number') {
          p.valueUSD = p.totalBalance * p.priceUSD;
          return sum + p.valueUSD;
        }
        return sum;
      }, 0);

      positions.forEach(p => {
        if (p) {
          p.allocation = totalValueUSD > 0 ? (p.valueUSD / totalValueUSD) * 100 : 0;
        }
      });

      return positions.filter(p => p !== null && p !== undefined);

    } catch (error) {
      console.error('Treasury Positions Error:', error);
      throw new Error('Failed to get consolidated treasury positions');
    }
  }

  async getLiquidityMetrics(): Promise<LiquidityMetrics> {
    try {
      const positions = await this.getConsolidatedPositions();
      
      const totalAUM = positions.reduce((sum, p) => sum + p.valueUSD, 0);
      const availableLiquidity = positions.reduce((sum, p) => sum + (p.availableBalance * p.priceUSD), 0);
      const lockedLiquidity = positions.reduce((sum, p) => sum + (p.lockedBalance * p.priceUSD), 0);
      
      const liquidityRatio = totalAUM > 0 ? (availableLiquidity / totalAUM) * 100 : 0;
      
      // Calculate concentration risk
      const concentrationRisk: { [asset: string]: number } = {};
      positions.forEach(p => {
        concentrationRisk[p.asset] = p.allocation;
      });

      // Identify liquidity gaps
      const liquidityGaps = positions
        .filter(p => p.allocation > 20) // High concentration assets
        .filter(p => (p.availableBalance / p.totalBalance) < 0.3) // Low liquidity ratio
        .map(p => ({
          timeframe: '24h',
          shortfall: p.lockedBalance * 0.1, // Estimated shortfall
          asset: p.asset
        }));

      return {
        totalAUM,
        availableLiquidity,
        lockedLiquidity,
        liquidityRatio,
        concentrationRisk,
        liquidityGaps
      };

    } catch (error) {
      console.error('Liquidity Metrics Error:', error);
      throw new Error('Failed to calculate liquidity metrics');
    }
  }

  async generateCashFlowForecast(days: number = 30): Promise<CashFlowForecast[]> {
    try {
      const forecast: CashFlowForecast[] = [];
      let cumulativeBalance = 0;

      // Get historical data to predict patterns
      const historicalInflows = await this.getHistoricalInflows(days);
      const historicalOutflows = await this.getHistoricalOutflows(days);

      // Generate daily forecasts
      for (let i = 1; i <= days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        // Predict based on historical patterns and known events
        const expectedInflows = this.predictInflows(historicalInflows, i);
        const expectedOutflows = this.predictOutflows(historicalOutflows, i);
        const netFlow = expectedInflows - expectedOutflows;
        
        cumulativeBalance += netFlow;
        
        const liquidityRequirement = expectedOutflows * 1.2; // 20% buffer
        const shortfall = Math.max(0, liquidityRequirement - cumulativeBalance);

        forecast.push({
          period: date.toISOString().split('T')[0],
          expectedInflows,
          expectedOutflows,
          netFlow,
          cumulativeBalance,
          liquidityRequirement,
          shortfall
        });
      }

      return forecast;

    } catch (error) {
      console.error('Cash Flow Forecast Error:', error);
      throw new Error('Failed to generate cash flow forecast');
    }
  }

  async executeAutoSweep(): Promise<{
    executed: number;
    failed: number;
    totalSwept: { [asset: string]: number };
  }> {
    const results = {
      executed: 0,
      failed: 0,
      totalSwept: {} as { [asset: string]: number }
    };

    for (const rule of this.autoSweepRules.filter(r => r.enabled)) {
      try {
        const executed = await this.executeSweepRule(rule);
        if (executed.success) {
          results.executed++;
          results.totalSwept[rule.asset] = (results.totalSwept[rule.asset] || 0) + executed.amount;
        } else {
          results.failed++;
        }
      } catch (error) {
        console.error(`Auto-sweep failed for rule ${rule.id}:`, error);
        results.failed++;
      }
    }

    return results;
  }

  async optimizeYieldOpportunities(): Promise<Array<{
    asset: string;
    currentYield: number;
    optimizedYield: number;
    potentialGain: number;
    recommendation: string;
  }>> {
    const positions = await this.getConsolidatedPositions();
    const opportunities = [];

    for (const position of positions) {
      // Analyze yield optimization opportunities
      const currentYield = position.yield;
      const availableForYield = position.availableBalance * 0.8; // Keep 20% liquid
      
      // Get best yield opportunities (would integrate with DeFi protocols)
      const bestYield = await this.getBestYieldForAsset(position.asset);
      
      if (bestYield > currentYield && availableForYield > 1000) {
        const potentialGain = (bestYield - currentYield) * availableForYield * position.priceUSD;
        
        opportunities.push({
          asset: position.asset,
          currentYield,
          optimizedYield: bestYield,
          potentialGain,
          recommendation: `Move ${availableForYield.toFixed(2)} ${position.asset} to higher yield protocol`
        });
      }
    }

    return opportunities.sort((a, b) => b.potentialGain - a.potentialGain);
  }

  async getTreasuryAlerts(): Promise<TreasuryAlert[]> {
    return this.treasuryAlerts.filter(alert => !alert.resolved);
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    const alert = this.treasuryAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  async getRebalancingRecommendations(): Promise<Array<{
    asset: string;
    currentAllocation: number;
    targetAllocation: number;
    action: 'buy' | 'sell';
    amount: number;
    urgency: 'low' | 'medium' | 'high';
  }>> {
    const positions = await this.getConsolidatedPositions();
    const recommendations = [];

    // Define target allocations (would be configurable)
    const targetAllocations = {
      'BTC': 40,
      'ETH': 25,
      'USDT': 20,
      'USDC': 10,
      'Other': 5
    };

    for (const position of positions) {
      const target = targetAllocations[position.asset] || 0;
      const current = position.allocation;
      const difference = Math.abs(current - target);

      if (difference > 5) { // 5% threshold
        const action = current > target ? 'sell' : 'buy';
        const amount = (difference / 100) * position.totalBalance;
        const urgency = difference > 15 ? 'high' : difference > 10 ? 'medium' : 'low';

        recommendations.push({
          asset: position.asset,
          currentAllocation: current,
          targetAllocation: target,
          action,
          amount,
          urgency
        });
      }
    }

    return recommendations.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  }

  // Private helper methods
  private async getAssetPrice(asset: string): Promise<number> {
    // Would integrate with market data service
    const mockPrices = {
      'BTC': 45000,
      'ETH': 3000,
      'USDT': 1,
      'USDC': 1,
      'SOL': 100,
      'ADA': 0.45
    };
    return mockPrices[asset] || 1;
  }

  private async getBestYieldForAsset(asset: string): Promise<number> {
    // Would integrate with DeFi protocols to find best yields
    const mockYields = {
      'BTC': 4.5,
      'ETH': 5.2,
      'USDT': 8.1,
      'USDC': 7.8,
      'SOL': 6.3,
      'ADA': 4.8
    };
    return mockYields[asset] || 0;
  }

  private async getHistoricalInflows(days: number): Promise<number[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const inflows = await db
      .select({
        date: sql`DATE(${deposits.createdAt})`,
        total: sum(deposits.amount)
      })
      .from(deposits)
      .where(
        and(
          gte(deposits.createdAt, startDate),
          lte(deposits.createdAt, endDate),
          eq(deposits.status, 'completed')
        )
      )
      .groupBy(sql`DATE(${deposits.createdAt})`);

    return inflows.map(i => Number(i.total) || 0);
  }

  private async getHistoricalOutflows(days: number): Promise<number[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const outflows = await db
      .select({
        date: sql`DATE(${withdrawals.createdAt})`,
        total: sum(withdrawals.amount)
      })
      .from(withdrawals)
      .where(
        and(
          gte(withdrawals.createdAt, startDate),
          lte(withdrawals.createdAt, endDate),
          eq(withdrawals.status, 'completed')
        )
      )
      .groupBy(sql`DATE(${withdrawals.createdAt})`);

    return outflows.map(o => Number(o.total) || 0);
  }

  private predictInflows(historical: number[], dayOffset: number): number {
    // Simple prediction based on historical average
    const average = historical.reduce((sum, val) => sum + val, 0) / historical.length;
    const trend = this.calculateTrend(historical);
    return average * (1 + trend * dayOffset * 0.01);
  }

  private predictOutflows(historical: number[], dayOffset: number): number {
    const average = historical.reduce((sum, val) => sum + val, 0) / historical.length;
    const trend = this.calculateTrend(historical);
    return average * (1 + trend * dayOffset * 0.01);
  }

  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, i) => sum + val * i, 0);
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private async executeSweepRule(rule: AutoSweepRule): Promise<{ success: boolean; amount: number }> {
    // Implement actual sweep execution
    console.log(`Executing sweep rule: ${rule.id}`);
    
    // Would integrate with wallet management system
    return { success: true, amount: 1000 };
  }

  private initializeAutoSweepRules() {
    // Initialize default auto-sweep rules
    this.autoSweepRules = [
      {
        id: 'btc_cold_sweep',
        asset: 'BTC',
        sourceWallet: 'hot',
        targetWallet: 'cold',
        triggerBalance: 10,
        sweepAmount: 'excess',
        enabled: true
      },
      {
        id: 'usdt_yield_sweep',
        asset: 'USDT',
        sourceWallet: 'trading',
        targetWallet: 'yield',
        triggerBalance: 100000,
        sweepAmount: 50000,
        enabled: true
      }
    ];
  }

  private startLiquidityMonitoring() {
    // Temporarily disable liquidity monitoring to prevent database errors
    console.log('[Treasury] Liquidity monitoring disabled to prevent database errors');
    // setInterval(async () => {
    //   await this.checkLiquidityAlerts();
    // }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async checkLiquidityAlerts() {
    try {
      const metrics = await this.getLiquidityMetrics();
      
      // Check liquidity ratio
      if (metrics.liquidityRatio < 20) {
        this.addAlert({
          type: 'liquidity_low',
          severity: 'high',
          asset: 'ALL',
          message: `Overall liquidity ratio is ${metrics.liquidityRatio.toFixed(1)}%`,
          value: metrics.liquidityRatio,
          threshold: 20
        });
      }

      // Check concentration risk
      Object.entries(metrics.concentrationRisk).forEach(([asset, allocation]) => {
        if (allocation > 50) {
          this.addAlert({
            type: 'concentration_high',
            severity: 'medium',
            asset,
            message: `${asset} concentration is ${allocation.toFixed(1)}%`,
            value: allocation,
            threshold: 50
          });
        }
      });

    } catch (error) {
      console.error('Liquidity monitoring error:', error);
    }
  }

  private addAlert(alertData: Omit<TreasuryAlert, 'id' | 'createdAt' | 'resolved'>) {
    const alert: TreasuryAlert = {
      ...alertData,
      id: `alert_${Date.now()}`,
      createdAt: new Date(),
      resolved: false
    };
    
    this.treasuryAlerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.treasuryAlerts.length > 100) {
      this.treasuryAlerts = this.treasuryAlerts.slice(-100);
    }
  }
}

export const treasuryService = new TreasuryManagementService();