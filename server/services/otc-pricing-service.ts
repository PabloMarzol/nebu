import { otcStorage } from "../otc-storage";
import { MarketData } from "../../shared/otc-schema";

interface PricingRequest {
  baseCurrency: string;
  quoteCurrency: string;
  amount: string;
  side: 'buy' | 'sell';
  clientTier: 'retail' | 'professional' | 'institutional';
  tradeSize: 'small' | 'medium' | 'large' | 'block';
}

interface PricingResponse {
  price: string;
  spread: string;
  validFor: number;
  liquidity: string;
  priceImpact: string;
  marketPrice: string;
  premiumDiscount: string;
  minimumAmount: string;
  maximumAmount: string;
}

export class OTCPricingService {
  private readonly BASE_SPREADS = {
    retail: { small: 0.005, medium: 0.004, large: 0.003, block: 0.002 },
    professional: { small: 0.003, medium: 0.0025, large: 0.002, block: 0.0015 },
    institutional: { small: 0.002, medium: 0.0015, large: 0.001, block: 0.0008 }
  };

  private readonly LIQUIDITY_TIERS = {
    BTC: { high: 10000000, medium: 1000000, low: 100000 },
    ETH: { high: 5000000, medium: 500000, low: 50000 },
    USDT: { high: 50000000, medium: 5000000, low: 500000 },
    USDC: { high: 50000000, medium: 5000000, low: 500000 },
    default: { high: 1000000, medium: 100000, low: 10000 }
  };

  async getOTCPrice(request: PricingRequest): Promise<PricingResponse> {
    const symbol = `${request.baseCurrency}/${request.quoteCurrency}`;
    const marketData = await otcStorage.getMarketDataBySymbol(symbol);
    
    if (!marketData) {
      throw new Error(`Market data not available for ${symbol}`);
    }

    const tradeValue = parseFloat(request.amount) * parseFloat(marketData.price);
    const tradeSize = this.determineTradeSize(request.baseCurrency, tradeValue);
    
    const baseSpread = this.BASE_SPREADS[request.clientTier][tradeSize];
    const liquidityAdjustment = this.calculateLiquidityAdjustment(request.baseCurrency, tradeValue);
    const volatilityAdjustment = this.calculateVolatilityAdjustment(marketData);
    
    const totalSpread = baseSpread + liquidityAdjustment + volatilityAdjustment;
    
    const marketPrice = parseFloat(marketData.price);
    let otcPrice: number;
    
    if (request.side === 'buy') {
      otcPrice = marketPrice * (1 + totalSpread);
    } else {
      otcPrice = marketPrice * (1 - totalSpread);
    }

    const priceImpact = this.calculatePriceImpact(request.baseCurrency, tradeValue);
    const premiumDiscount = ((otcPrice - marketPrice) / marketPrice) * 100;

    return {
      price: otcPrice.toFixed(8),
      spread: (totalSpread * 100).toFixed(4),
      validFor: this.getValidityPeriod(tradeSize),
      liquidity: this.getLiquidityRating(request.baseCurrency, tradeValue),
      priceImpact: priceImpact.toFixed(4),
      marketPrice: marketPrice.toFixed(8),
      premiumDiscount: premiumDiscount.toFixed(4),
      minimumAmount: this.getMinimumAmount(request.baseCurrency, request.clientTier),
      maximumAmount: this.getMaximumAmount(request.baseCurrency, request.clientTier)
    };
  }

  private determineTradeSize(currency: string, tradeValue: number): 'small' | 'medium' | 'large' | 'block' {
    const tiers = this.LIQUIDITY_TIERS[currency as keyof typeof this.LIQUIDITY_TIERS] || this.LIQUIDITY_TIERS.default;
    
    if (tradeValue >= tiers.high) return 'block';
    if (tradeValue >= tiers.medium) return 'large';
    if (tradeValue >= tiers.low) return 'medium';
    return 'small';
  }

  private calculateLiquidityAdjustment(currency: string, tradeValue: number): number {
    const tiers = this.LIQUIDITY_TIERS[currency as keyof typeof this.LIQUIDITY_TIERS] || this.LIQUIDITY_TIERS.default;
    
    if (tradeValue >= tiers.high) return 0.002; // High liquidity demand
    if (tradeValue >= tiers.medium) return 0.001;
    return 0;
  }

  private calculateVolatilityAdjustment(marketData: MarketData): number {
    const volatility = parseFloat(marketData.volatility || '0');
    
    if (volatility > 0.1) return 0.003; // High volatility
    if (volatility > 0.05) return 0.002; // Medium volatility
    if (volatility > 0.02) return 0.001; // Low volatility
    return 0;
  }

  private calculatePriceImpact(currency: string, tradeValue: number): number {
    const tiers = this.LIQUIDITY_TIERS[currency as keyof typeof this.LIQUIDITY_TIERS] || this.LIQUIDITY_TIERS.default;
    
    if (tradeValue >= tiers.high) return 0.15; // High impact
    if (tradeValue >= tiers.medium) return 0.08; // Medium impact
    if (tradeValue >= tiers.low) return 0.03; // Low impact
    return 0.01; // Minimal impact
  }

  private getLiquidityRating(currency: string, tradeValue: number): string {
    const tiers = this.LIQUIDITY_TIERS[currency as keyof typeof this.LIQUIDITY_TIERS] || this.LIQUIDITY_TIERS.default;
    
    if (tradeValue >= tiers.high) return 'Deep';
    if (tradeValue >= tiers.medium) return 'Good';
    if (tradeValue >= tiers.low) return 'Moderate';
    return 'Limited';
  }

  private getValidityPeriod(tradeSize: 'small' | 'medium' | 'large' | 'block'): number {
    const periods = {
      small: 600,    // 10 minutes
      medium: 450,   // 7.5 minutes
      large: 300,    // 5 minutes
      block: 180     // 3 minutes
    };
    return periods[tradeSize];
  }

  private getMinimumAmount(currency: string, clientTier: 'retail' | 'professional' | 'institutional'): string {
    const minimums = {
      retail: { BTC: '0.01', ETH: '0.1', USDT: '1000', USDC: '1000', default: '100' },
      professional: { BTC: '0.1', ETH: '1', USDT: '10000', USDC: '10000', default: '1000' },
      institutional: { BTC: '1', ETH: '10', USDT: '100000', USDC: '100000', default: '10000' }
    };
    
    return minimums[clientTier][currency as keyof typeof minimums[clientTier]] || minimums[clientTier].default;
  }

  private getMaximumAmount(currency: string, clientTier: 'retail' | 'professional' | 'institutional'): string {
    const maximums = {
      retail: { BTC: '10', ETH: '100', USDT: '500000', USDC: '500000', default: '50000' },
      professional: { BTC: '100', ETH: '1000', USDT: '5000000', USDC: '5000000', default: '500000' },
      institutional: { BTC: '1000', ETH: '10000', USDT: '50000000', USDC: '50000000', default: '5000000' }
    };
    
    return maximums[clientTier][currency as keyof typeof maximums[clientTier]] || maximums[clientTier].default;
  }

  async calculateOptimalExecution(
    baseCurrency: string,
    quoteCurrency: string,
    amount: string,
    side: 'buy' | 'sell',
    executionType: 'immediate' | 'twap' | 'vwap' | 'iceberg'
  ): Promise<{
    strategy: string;
    estimatedSlippage: string;
    executionPeriod: number;
    chunkSize: string;
    numberOfChunks: number;
    estimatedCompletion: Date;
  }> {
    const tradeValue = parseFloat(amount) * parseFloat((await otcStorage.getMarketDataBySymbol(`${baseCurrency}/${quoteCurrency}`))?.price || '0');
    
    switch (executionType) {
      case 'twap':
        return this.calculateTWAP(baseCurrency, amount, tradeValue);
      case 'vwap':
        return this.calculateVWAP(baseCurrency, amount, tradeValue);
      case 'iceberg':
        return this.calculateIceberg(baseCurrency, amount, tradeValue);
      default:
        return this.calculateImmediate(baseCurrency, amount, tradeValue);
    }
  }

  private calculateTWAP(currency: string, amount: string, tradeValue: number) {
    const executionPeriod = Math.min(Math.max(tradeValue / 100000, 30), 480); // 30 min to 8 hours
    const numberOfChunks = Math.ceil(executionPeriod / 15); // Every 15 minutes
    const chunkSize = (parseFloat(amount) / numberOfChunks).toFixed(8);
    
    return {
      strategy: 'Time Weighted Average Price',
      estimatedSlippage: (tradeValue > 1000000 ? '0.12' : '0.05'),
      executionPeriod,
      chunkSize,
      numberOfChunks,
      estimatedCompletion: new Date(Date.now() + executionPeriod * 60 * 1000)
    };
  }

  private calculateVWAP(currency: string, amount: string, tradeValue: number) {
    const executionPeriod = Math.min(Math.max(tradeValue / 150000, 20), 360); // 20 min to 6 hours
    const numberOfChunks = Math.ceil(executionPeriod / 10); // Every 10 minutes
    const chunkSize = (parseFloat(amount) / numberOfChunks).toFixed(8);
    
    return {
      strategy: 'Volume Weighted Average Price',
      estimatedSlippage: (tradeValue > 1000000 ? '0.08' : '0.03'),
      executionPeriod,
      chunkSize,
      numberOfChunks,
      estimatedCompletion: new Date(Date.now() + executionPeriod * 60 * 1000)
    };
  }

  private calculateIceberg(currency: string, amount: string, tradeValue: number) {
    const executionPeriod = Math.min(Math.max(tradeValue / 200000, 15), 240); // 15 min to 4 hours
    const numberOfChunks = Math.ceil(parseFloat(amount) / (tradeValue / 20)); // Hide 95% of order
    const chunkSize = (parseFloat(amount) / numberOfChunks).toFixed(8);
    
    return {
      strategy: 'Iceberg Order Execution',
      estimatedSlippage: (tradeValue > 1000000 ? '0.06' : '0.02'),
      executionPeriod,
      chunkSize,
      numberOfChunks,
      estimatedCompletion: new Date(Date.now() + executionPeriod * 60 * 1000)
    };
  }

  private calculateImmediate(currency: string, amount: string, tradeValue: number) {
    return {
      strategy: 'Immediate Execution',
      estimatedSlippage: (tradeValue > 1000000 ? '0.25' : '0.10'),
      executionPeriod: 1,
      chunkSize: amount,
      numberOfChunks: 1,
      estimatedCompletion: new Date(Date.now() + 60 * 1000) // 1 minute
    };
  }
}

export const otcPricingService = new OTCPricingService();