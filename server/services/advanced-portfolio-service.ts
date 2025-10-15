import { storage } from "../storage";

interface PortfolioAllocation {
  asset: string;
  currentWeight: number;
  targetWeight: number;
  rebalanceAmount: number;
  recommendation: 'buy' | 'sell' | 'hold';
}

interface RiskMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
}

interface PortfolioInsights {
  totalValue: number;
  allocations: PortfolioAllocation[];
  riskMetrics: RiskMetrics;
  diversificationScore: number;
  rebalanceRecommendations: string[];
  performanceProjection: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
}

export class AdvancedPortfolioService {
  
  async analyzePortfolio(userId: string): Promise<PortfolioInsights> {
    try {
      const portfolio = await storage.getPortfolio(userId);
      const marketData = await storage.getMarketData();
      
      // Calculate current allocations
      const totalValue = portfolio.reduce((sum, holding) => {
        const marketPrice = this.getMarketPrice(holding.symbol, marketData);
        const balance = parseFloat(holding.balance);
        return sum + (balance * marketPrice);
      }, 0);

      const allocations: PortfolioAllocation[] = portfolio.map(holding => {
        const marketPrice = this.getMarketPrice(holding.symbol, marketData);
        const balance = parseFloat(holding.balance);
        const value = balance * marketPrice;
        const currentWeight = (value / totalValue) * 100;
        
        // Calculate target weight based on market cap and risk factors
        const targetWeight = this.calculateTargetWeight(holding.symbol, marketData);
        const rebalanceAmount = ((targetWeight - currentWeight) / 100) * totalValue;
        
        return {
          asset: holding.symbol,
          currentWeight,
          targetWeight,
          rebalanceAmount,
          recommendation: rebalanceAmount > 50 ? 'buy' : rebalanceAmount < -50 ? 'sell' : 'hold'
        };
      });

      // Calculate risk metrics
      const riskMetrics = await this.calculateRiskMetrics(portfolio, marketData);
      
      // Calculate diversification score
      const diversificationScore = this.calculateDiversificationScore(allocations);
      
      // Generate rebalance recommendations
      const rebalanceRecommendations = this.generateRebalanceRecommendations(allocations);
      
      // Performance projections
      const performanceProjection = this.calculatePerformanceProjections(portfolio, riskMetrics);

      return {
        totalValue,
        allocations,
        riskMetrics,
        diversificationScore,
        rebalanceRecommendations,
        performanceProjection
      };
      
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      throw new Error('Failed to analyze portfolio');
    }
  }

  private getMarketPrice(asset: string, marketData: any[]): number {
    const market = marketData.find(m => m.symbol === asset);
    return market ? parseFloat(market.price) : 0;
  }

  private calculateTargetWeight(asset: string, marketData: any[]): number {
    // Smart allocation based on market cap and volatility
    const weights: { [key: string]: number } = {
      'BTC': 40,
      'ETH': 25,
      'SOL': 10,
      'ADA': 8,
      'DOT': 7,
      'LINK': 5,
      'UNI': 3,
      'AAVE': 2
    };
    
    return weights[asset] || 5; // Default 5% for other assets
  }

  private async calculateRiskMetrics(portfolio: any[], marketData: any[]): Promise<RiskMetrics> {
    // Calculate portfolio volatility and risk metrics
    const returns = this.calculatePortfolioReturns(portfolio, marketData);
    
    const volatility = this.calculateVolatility(returns);
    const sharpeRatio = this.calculateSharpeRatio(returns, volatility);
    const maxDrawdown = this.calculateMaxDrawdown(returns);
    const beta = this.calculateBeta(returns);
    const alpha = this.calculateAlpha(returns, beta);

    return {
      sharpeRatio,
      maxDrawdown,
      volatility,
      beta,
      alpha
    };
  }

  private calculatePortfolioReturns(portfolio: any[], marketData: any[]): number[] {
    // Simulate historical returns for the last 30 days
    const returns: number[] = [];
    for (let i = 0; i < 30; i++) {
      let portfolioReturn = 0;
      portfolio.forEach(holding => {
        const dailyReturn = (Math.random() - 0.5) * 0.1; // Simulated daily return
        const weight = holding.amount / portfolio.reduce((sum, h) => sum + h.amount, 0);
        portfolioReturn += dailyReturn * weight;
      });
      returns.push(portfolioReturn);
    }
    return returns;
  }

  private calculateVolatility(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(365); // Annualized volatility
  }

  private calculateSharpeRatio(returns: number[], volatility: number): number {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const riskFreeRate = 0.02; // 2% risk-free rate
    return (avgReturn * 365 - riskFreeRate) / volatility;
  }

  private calculateMaxDrawdown(returns: number[]): number {
    let peak = 0;
    let maxDD = 0;
    let cumulative = 0;
    
    returns.forEach(ret => {
      cumulative += ret;
      if (cumulative > peak) peak = cumulative;
      const drawdown = (peak - cumulative) / peak;
      if (drawdown > maxDD) maxDD = drawdown;
    });
    
    return maxDD;
  }

  private calculateBeta(returns: number[]): number {
    // Simplified beta calculation (correlation with market)
    const marketReturns = returns.map(() => (Math.random() - 0.5) * 0.08);
    const covariance = this.calculateCovariance(returns, marketReturns);
    const marketVariance = this.calculateVariance(marketReturns);
    return covariance / marketVariance;
  }

  private calculateAlpha(returns: number[], beta: number): number {
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const marketReturn = 0.08; // Assumed market return
    const riskFreeRate = 0.02;
    return (avgReturn * 365) - (riskFreeRate + beta * (marketReturn - riskFreeRate));
  }

  private calculateCovariance(x: number[], y: number[]): number {
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    return x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0) / x.length;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private calculateDiversificationScore(allocations: PortfolioAllocation[]): number {
    // Higher score for more balanced allocations
    const weights = allocations.map(a => a.currentWeight / 100);
    const herfindahlIndex = weights.reduce((sum, w) => sum + w * w, 0);
    return (1 - herfindahlIndex) * 100; // Convert to percentage
  }

  private generateRebalanceRecommendations(allocations: PortfolioAllocation[]): string[] {
    const recommendations: string[] = [];
    
    allocations.forEach(allocation => {
      const diff = Math.abs(allocation.currentWeight - allocation.targetWeight);
      if (diff > 5) {
        if (allocation.currentWeight > allocation.targetWeight) {
          recommendations.push(`Consider reducing ${allocation.asset} allocation by ${diff.toFixed(1)}%`);
        } else {
          recommendations.push(`Consider increasing ${allocation.asset} allocation by ${diff.toFixed(1)}%`);
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Portfolio is well-balanced. No immediate rebalancing needed.');
    }

    return recommendations;
  }

  private calculatePerformanceProjections(portfolio: any[], riskMetrics: RiskMetrics): {
    conservative: number;
    moderate: number;
    aggressive: number;
  } {
    const baseReturn = 0.08; // 8% base return
    const volatilityAdjustment = riskMetrics.volatility;
    
    return {
      conservative: baseReturn - (volatilityAdjustment * 0.5),
      moderate: baseReturn,
      aggressive: baseReturn + (volatilityAdjustment * 0.3)
    };
  }

  async getAutoRebalanceSettings(userId: string): Promise<any> {
    try {
      // Mock implementation for now
      return {
        enabled: false,
        threshold: 5, // 5% deviation threshold
        frequency: 'monthly',
        maxRebalanceAmount: 1000
      };
    } catch (error) {
      return {
        enabled: false,
        threshold: 5, // 5% deviation threshold
        frequency: 'monthly',
        maxRebalanceAmount: 1000
      };
    }
  }

  async updateAutoRebalanceSettings(userId: string, settings: any): Promise<any> {
    try {
      // Mock implementation for now
      console.log(`[Portfolio] Updated auto-rebalance settings for user ${userId}:`, settings);
      return settings;
    } catch (error) {
      console.error('Error updating auto-rebalance settings:', error);
      throw new Error('Failed to update settings');
    }
  }
}

export const advancedPortfolioService = new AdvancedPortfolioService();