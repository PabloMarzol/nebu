import { db } from '../db';
import { eq, gte, lte, and, desc } from 'drizzle-orm';
import { 
  users, 
  portfolios,
  type User
} from '../../shared/schema';

export interface StructuredProduct {
  id: string;
  name: string;
  type: 'dcn' | 'yield_note' | 'barrier_option' | 'autocall' | 'dual_currency';
  underlying: string[];
  currency: string;
  issuePrice: number;
  currentValue: number;
  maturityDate: Date;
  issueDate: Date;
  minimumInvestment: number;
  maximumInvestment: number;
  couponRate?: number;
  couponFrequency?: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  barrierLevel?: number;
  knockInLevel?: number;
  protectionLevel?: number;
  participationRate?: number;
  terms: ProductTerms;
  risks: RiskFactors;
  suitability: SuitabilityRequirements;
  pricing: PricingComponents;
  status: 'active' | 'matured' | 'suspended' | 'called';
  subscriptionPeriod: { start: Date; end: Date };
  totalIssued: number;
  remainingCapacity: number;
}

export interface ProductTerms {
  description: string;
  payoffStructure: string;
  earlyRedemption: boolean;
  callFeatures?: {
    autocallDates: Date[];
    callPrice: number;
    callCondition: string;
  };
  capitalProtection: boolean;
  protectionLevel?: number;
  guaranteedMinimumReturn?: number;
}

export interface RiskFactors {
  marketRisk: 'low' | 'medium' | 'high';
  creditRisk: 'low' | 'medium' | 'high';
  liquidityRisk: 'low' | 'medium' | 'high';
  currencyRisk: 'low' | 'medium' | 'high';
  complexityLevel: number; // 1-10
  maxLoss: number; // percentage
  riskDisclosure: string[];
}

export interface SuitabilityRequirements {
  minimumKnowledge: 'basic' | 'intermediate' | 'advanced' | 'professional';
  minimumExperience: number; // years
  minimumNetWorth: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentObjective: string[];
  excludedJurisdictions: string[];
  accreditedInvestorOnly: boolean;
}

export interface PricingComponents {
  fairValue: number;
  bid: number;
  ask: number;
  lastPrice: number;
  impliedVolatility?: number;
  timeDecay?: number;
  delta?: number;
  gamma?: number;
  vega?: number;
  theta?: number;
  rho?: number;
}

export interface ClientInvestment {
  id: string;
  clientId: string;
  productId: string;
  notionalAmount: number;
  units: number;
  entryPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  investmentDate: Date;
  maturityDate: Date;
  status: 'active' | 'matured' | 'redeemed' | 'called';
  couponsReceived: number;
  nextCouponDate?: Date;
}

export interface ProductPerformance {
  productId: string;
  date: Date;
  underlyingPrices: { [asset: string]: number };
  productValue: number;
  couponPayment?: number;
  barrierBreach?: boolean;
  callTriggered?: boolean;
  returnToDate: number;
  volatility: number;
}

export class StructuredProductsEngine {
  private products: Map<string, StructuredProduct> = new Map();
  private clientInvestments: Map<string, ClientInvestment[]> = new Map();
  
  constructor() {
    this.initializeDefaultProducts();
  }

  async createProduct(productRequest: {
    name: string;
    type: StructuredProduct['type'];
    underlying: string[];
    terms: Partial<ProductTerms>;
    minimumInvestment: number;
    maximumInvestment: number;
    maturityMonths: number;
    targetCapacity: number;
  }): Promise<StructuredProduct> {
    
    const productId = `SP_${Date.now()}`;
    const issueDate = new Date();
    const maturityDate = new Date(issueDate.getTime() + productRequest.maturityMonths * 30 * 24 * 60 * 60 * 1000);
    
    // Generate product structure based on type
    const productStructure = this.generateProductStructure(productRequest.type, productRequest.underlying);
    
    const product: StructuredProduct = {
      id: productId,
      name: productRequest.name,
      type: productRequest.type,
      underlying: productRequest.underlying,
      currency: 'USD',
      issuePrice: 1000, // Standard $1000 denomination
      currentValue: 1000,
      maturityDate,
      issueDate,
      minimumInvestment: productRequest.minimumInvestment,
      maximumInvestment: productRequest.maximumInvestment,
      ...productStructure,
      terms: {
        description: this.generateProductDescription(productRequest.type, productRequest.underlying),
        payoffStructure: this.generatePayoffStructure(productRequest.type),
        earlyRedemption: false,
        capitalProtection: productRequest.type === 'dcn',
        ...productRequest.terms
      },
      risks: this.assessProductRisks(productRequest.type, productRequest.underlying),
      suitability: this.determineSuitabilityRequirements(productRequest.type),
      pricing: {
        fairValue: 1000,
        bid: 995,
        ask: 1005,
        lastPrice: 1000
      },
      status: 'active',
      subscriptionPeriod: {
        start: issueDate,
        end: new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      totalIssued: 0,
      remainingCapacity: productRequest.targetCapacity
    };

    this.products.set(productId, product);
    
    // Perform legal compliance checks
    await this.performComplianceChecks(product);
    
    return product;
  }

  async investInProduct(
    clientId: string,
    productId: string,
    amount: number
  ): Promise<{ success: boolean; investmentId?: string; reason?: string }> {
    
    try {
      // Validate product exists and is available
      const product = this.products.get(productId);
      if (!product) {
        return { success: false, reason: 'Product not found' };
      }

      if (product.status !== 'active') {
        return { success: false, reason: 'Product not available for investment' };
      }

      // Check investment limits
      if (amount < product.minimumInvestment) {
        return { success: false, reason: `Minimum investment is ${product.minimumInvestment}` };
      }

      if (amount > product.maximumInvestment) {
        return { success: false, reason: `Maximum investment is ${product.maximumInvestment}` };
      }

      // Check remaining capacity
      if (amount > product.remainingCapacity) {
        return { success: false, reason: 'Insufficient product capacity' };
      }

      // Perform suitability assessment
      const suitabilityCheck = await this.assessClientSuitability(clientId, product);
      if (!suitabilityCheck.suitable) {
        return { success: false, reason: suitabilityCheck.reason };
      }

      // Calculate units
      const units = amount / product.issuePrice;
      
      // Create investment record
      const investmentId = `INV_${productId}_${clientId}_${Date.now()}`;
      const investment: ClientInvestment = {
        id: investmentId,
        clientId,
        productId,
        notionalAmount: amount,
        units,
        entryPrice: product.issuePrice,
        currentValue: amount,
        unrealizedPnL: 0,
        investmentDate: new Date(),
        maturityDate: product.maturityDate,
        status: 'active',
        couponsReceived: 0,
        nextCouponDate: product.couponFrequency ? this.calculateNextCouponDate(new Date(), product.couponFrequency) : undefined
      };

      // Store investment
      if (!this.clientInvestments.has(clientId)) {
        this.clientInvestments.set(clientId, []);
      }
      this.clientInvestments.get(clientId)!.push(investment);

      // Update product capacity
      product.totalIssued += amount;
      product.remainingCapacity -= amount;

      // Process payment and update client portfolio
      await this.processInvestmentPayment(clientId, amount, investmentId);

      return { success: true, investmentId };

    } catch (error) {
      console.error('Investment Error:', error);
      return { success: false, reason: 'Internal processing error' };
    }
  }

  async getAvailableProducts(clientId?: string): Promise<StructuredProduct[]> {
    const availableProducts = Array.from(this.products.values())
      .filter(p => p.status === 'active' && p.remainingCapacity > 0);

    if (clientId) {
      // Filter based on client suitability
      const suitableProducts = [];
      for (const product of availableProducts) {
        const suitability = await this.assessClientSuitability(clientId, product);
        if (suitability.suitable) {
          suitableProducts.push(product);
        }
      }
      return suitableProducts;
    }

    return availableProducts;
  }

  async getClientInvestments(clientId: string): Promise<ClientInvestment[]> {
    return this.clientInvestments.get(clientId) || [];
  }

  async updateProductPricing(productId: string): Promise<void> {
    const product = this.products.get(productId);
    if (!product) return;

    // Get current underlying prices
    const underlyingPrices = await this.getUnderlyingPrices(product.underlying);
    
    // Calculate fair value based on product type
    const fairValue = await this.calculateFairValue(product, underlyingPrices);
    
    // Update pricing
    product.pricing = {
      fairValue,
      bid: fairValue * 0.995,
      ask: fairValue * 1.005,
      lastPrice: product.pricing.lastPrice,
      impliedVolatility: await this.calculateImpliedVolatility(product, underlyingPrices),
      ...this.calculateGreeks(product, underlyingPrices)
    };

    product.currentValue = fairValue;

    // Update client investment values
    await this.updateClientInvestmentValues(productId, fairValue);
  }

  async processMaturity(productId: string): Promise<void> {
    const product = this.products.get(productId);
    if (!product) return;

    // Calculate final payoff
    const underlyingPrices = await this.getUnderlyingPrices(product.underlying);
    const finalPayoff = await this.calculateMaturityPayoff(product, underlyingPrices);

    // Update product status
    product.status = 'matured';
    product.currentValue = finalPayoff;

    // Process client settlements
    const allInvestments = Array.from(this.clientInvestments.values()).flat()
      .filter(inv => inv.productId === productId && inv.status === 'active');

    for (const investment of allInvestments) {
      const settlementAmount = (investment.units * finalPayoff);
      await this.processMaturitySettlement(investment.clientId, investment.id, settlementAmount);
      investment.status = 'matured';
      investment.currentValue = settlementAmount;
    }
  }

  async processCouponPayments(productId: string): Promise<void> {
    const product = this.products.get(productId);
    if (!product || !product.couponRate || !product.couponFrequency) return;

    const today = new Date();
    const allInvestments = Array.from(this.clientInvestments.values()).flat()
      .filter(inv => inv.productId === productId && inv.status === 'active');

    for (const investment of allInvestments) {
      if (investment.nextCouponDate && investment.nextCouponDate <= today) {
        const couponAmount = this.calculateCouponPayment(investment, product);
        await this.processCouponPayment(investment.clientId, investment.id, couponAmount);
        
        investment.couponsReceived += couponAmount;
        investment.nextCouponDate = this.calculateNextCouponDate(today, product.couponFrequency);
      }
    }
  }

  async generateRiskReport(productId: string): Promise<{
    productId: string;
    riskMetrics: {
      var95: number;
      var99: number;
      expectedShortfall: number;
      maxDrawdown: number;
      volatility: number;
      sharpeRatio: number;
    };
    scenarioAnalysis: Array<{
      scenario: string;
      probabilityWeight: number;
      expectedReturn: number;
      worstCase: number;
      bestCase: number;
    }>;
    stressTests: Array<{
      stressType: string;
      description: string;
      impact: number;
    }>;
  }> {
    const product = this.products.get(productId);
    if (!product) throw new Error('Product not found');

    // Calculate risk metrics
    const riskMetrics = await this.calculateRiskMetrics(product);
    
    // Generate scenario analysis
    const scenarioAnalysis = await this.performScenarioAnalysis(product);
    
    // Perform stress tests
    const stressTests = await this.performStressTests(product);

    return {
      productId,
      riskMetrics,
      scenarioAnalysis,
      stressTests
    };
  }

  // Private helper methods
  private generateProductStructure(type: StructuredProduct['type'], underlying: string[]) {
    switch (type) {
      case 'dcn':
        return {
          couponRate: 8.5,
          couponFrequency: 'quarterly' as const,
          protectionLevel: 100,
          participationRate: 100
        };
      case 'yield_note':
        return {
          couponRate: 12.0,
          couponFrequency: 'monthly' as const,
          barrierLevel: 65,
          knockInLevel: 60
        };
      case 'barrier_option':
        return {
          barrierLevel: 70,
          participationRate: 120,
          protectionLevel: 95
        };
      case 'autocall':
        return {
          couponRate: 15.0,
          couponFrequency: 'quarterly' as const,
          barrierLevel: 65,
          participationRate: 100
        };
      case 'dual_currency':
        return {
          couponRate: 6.0,
          couponFrequency: 'semi-annual' as const
        };
      default:
        return {};
    }
  }

  private generateProductDescription(type: StructuredProduct['type'], underlying: string[]): string {
    const underlyingStr = underlying.join(', ');
    
    switch (type) {
      case 'dcn':
        return `Digital Credit Note linked to ${underlyingStr} with capital protection and quarterly coupons`;
      case 'yield_note':
        return `High-yield note with monthly coupons linked to ${underlyingStr} performance`;
      case 'barrier_option':
        return `Barrier option structure providing leveraged exposure to ${underlyingStr}`;
      case 'autocall':
        return `Autocallable note with quarterly observation and coupon linked to ${underlyingStr}`;
      case 'dual_currency':
        return `Dual currency note offering enhanced yield through currency exposure`;
      default:
        return `Structured product linked to ${underlyingStr}`;
    }
  }

  private generatePayoffStructure(type: StructuredProduct['type']): string {
    switch (type) {
      case 'dcn':
        return 'Principal protected with quarterly coupons. At maturity: 100% principal + participation in upside';
      case 'yield_note':
        return 'Monthly coupons while barrier not breached. At maturity: principal subject to worst performing asset';
      case 'barrier_option':
        return 'Leveraged participation in underlying performance with downside protection until barrier breach';
      case 'autocall':
        return 'Early redemption possible on observation dates if underlying above initial level. Quarterly coupons';
      case 'dual_currency':
        return 'Enhanced yield through currency exposure with semi-annual coupons';
      default:
        return 'Custom payoff structure defined in term sheet';
    }
  }

  private assessProductRisks(type: StructuredProduct['type'], underlying: string[]): RiskFactors {
    const baseRisk = {
      marketRisk: 'medium' as const,
      creditRisk: 'low' as const,
      liquidityRisk: 'medium' as const,
      currencyRisk: 'low' as const,
      complexityLevel: 5,
      maxLoss: 100,
      riskDisclosure: [
        'Market risk: Value subject to underlying asset performance',
        'Credit risk: Exposure to issuer creditworthiness',
        'Liquidity risk: Limited secondary market'
      ]
    };

    switch (type) {
      case 'dcn':
        return { ...baseRisk, complexityLevel: 3, maxLoss: 0 };
      case 'yield_note':
        return { ...baseRisk, complexityLevel: 6, maxLoss: 100 };
      case 'barrier_option':
        return { ...baseRisk, marketRisk: 'high', complexityLevel: 8 };
      case 'autocall':
        return { ...baseRisk, complexityLevel: 7 };
      case 'dual_currency':
        return { ...baseRisk, currencyRisk: 'high', complexityLevel: 4 };
      default:
        return baseRisk;
    }
  }

  private determineSuitabilityRequirements(type: StructuredProduct['type']): SuitabilityRequirements {
    const baseRequirements = {
      minimumKnowledge: 'intermediate' as const,
      minimumExperience: 2,
      minimumNetWorth: 250000,
      riskTolerance: 'moderate' as const,
      investmentObjective: ['income', 'growth'],
      excludedJurisdictions: ['US'],
      accreditedInvestorOnly: false
    };

    switch (type) {
      case 'dcn':
        return { ...baseRequirements, minimumKnowledge: 'basic', minimumNetWorth: 100000 };
      case 'barrier_option':
        return { ...baseRequirements, minimumKnowledge: 'advanced', riskTolerance: 'aggressive', accreditedInvestorOnly: true };
      case 'autocall':
        return { ...baseRequirements, minimumKnowledge: 'advanced', minimumExperience: 3 };
      default:
        return baseRequirements;
    }
  }

  private async assessClientSuitability(clientId: string, product: StructuredProduct): Promise<{
    suitable: boolean;
    reason?: string;
    score: number;
  }> {
    try {
      // Get client profile (would integrate with actual client data)
      const client = await db.select().from(users).where(eq(users.id, clientId));
      if (client.length === 0) {
        return { suitable: false, reason: 'Client not found', score: 0 };
      }

      // Mock suitability assessment
      const mockProfile = {
        netWorth: 500000,
        experience: 3,
        knowledge: 'intermediate',
        riskTolerance: 'moderate',
        isAccredited: true
      };

      let score = 100;
      const issues = [];

      // Check net worth
      if (mockProfile.netWorth < product.suitability.minimumNetWorth) {
        score -= 30;
        issues.push('Insufficient net worth');
      }

      // Check experience
      if (mockProfile.experience < product.suitability.minimumExperience) {
        score -= 20;
        issues.push('Insufficient investment experience');
      }

      // Check accredited investor requirement
      if (product.suitability.accreditedInvestorOnly && !mockProfile.isAccredited) {
        score -= 50;
        issues.push('Must be accredited investor');
      }

      const suitable = score >= 70;
      return {
        suitable,
        reason: suitable ? undefined : issues.join(', '),
        score
      };

    } catch (error) {
      console.error('Suitability Assessment Error:', error);
      return { suitable: false, reason: 'Assessment failed', score: 0 };
    }
  }

  private async performComplianceChecks(product: StructuredProduct): Promise<void> {
    // Implement compliance validation
    console.log(`Performing compliance checks for product: ${product.id}`);
    
    // Validate against regulations
    // Check prospectus requirements
    // Verify suitability criteria
    // Ensure proper risk disclosures
  }

  private async getUnderlyingPrices(assets: string[]): Promise<{ [asset: string]: number }> {
    // Mock prices - would integrate with market data service
    const mockPrices = {
      'BTC': 45000,
      'ETH': 3000,
      'SOL': 100,
      'ADA': 0.45
    };
    
    const prices: { [asset: string]: number } = {};
    assets.forEach(asset => {
      prices[asset] = mockPrices[asset] || 1000;
    });
    
    return prices;
  }

  private async calculateFairValue(product: StructuredProduct, underlyingPrices: { [asset: string]: number }): Promise<number> {
    // Simplified pricing model - would use proper financial models
    const baseValue = product.issuePrice;
    const timeToMaturity = (product.maturityDate.getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000);
    
    // Apply time decay and underlying performance
    let value = baseValue;
    
    if (product.type === 'dcn') {
      value = baseValue; // Capital protected
    } else {
      // Simple performance-based adjustment
      const avgPerformance = Object.values(underlyingPrices).reduce((sum, price) => sum + price, 0) / Object.values(underlyingPrices).length;
      value = baseValue * (1 + (avgPerformance - 1000) / 1000 * 0.8); // 80% participation
    }
    
    return Math.max(value, product.protectionLevel || 0);
  }

  private async calculateImpliedVolatility(product: StructuredProduct, underlyingPrices: { [asset: string]: number }): Promise<number> {
    // Mock volatility calculation
    return 0.25; // 25% implied volatility
  }

  private calculateGreeks(product: StructuredProduct, underlyingPrices: { [asset: string]: number }): Partial<PricingComponents> {
    // Mock Greeks calculation
    return {
      delta: 0.65,
      gamma: 0.15,
      vega: 0.08,
      theta: -0.02,
      rho: 0.03
    };
  }

  private async calculateMaturityPayoff(product: StructuredProduct, underlyingPrices: { [asset: string]: number }): Promise<number> {
    // Calculate final payoff based on product type and underlying performance
    switch (product.type) {
      case 'dcn':
        return product.issuePrice; // Capital protected
      case 'yield_note':
        // Check if barrier was breached
        const worstPerformance = Math.min(...Object.values(underlyingPrices)) / 1000;
        return worstPerformance < (product.barrierLevel || 100) / 100 ? 
          product.issuePrice * worstPerformance : product.issuePrice;
      default:
        return product.issuePrice;
    }
  }

  private calculateCouponPayment(investment: ClientInvestment, product: StructuredProduct): number {
    if (!product.couponRate) return 0;
    
    const annualCoupon = investment.notionalAmount * (product.couponRate / 100);
    const frequency = {
      'monthly': 12,
      'quarterly': 4,
      'semi-annual': 2,
      'annual': 1
    }[product.couponFrequency || 'quarterly'];
    
    return annualCoupon / frequency;
  }

  private calculateNextCouponDate(currentDate: Date, frequency: string): Date {
    const months = {
      'monthly': 1,
      'quarterly': 3,
      'semi-annual': 6,
      'annual': 12
    }[frequency] || 3;
    
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + months);
    return nextDate;
  }

  private async updateClientInvestmentValues(productId: string, newValue: number): Promise<void> {
    Array.from(this.clientInvestments.values()).flat()
      .filter(inv => inv.productId === productId && inv.status === 'active')
      .forEach(investment => {
        const oldValue = investment.currentValue;
        investment.currentValue = investment.units * newValue;
        investment.unrealizedPnL = investment.currentValue - investment.notionalAmount;
      });
  }

  private async processInvestmentPayment(clientId: string, amount: number, investmentId: string): Promise<void> {
    // Integration with portfolio and payment systems
    console.log(`Processing investment payment: ${clientId}, ${amount}, ${investmentId}`);
  }

  private async processMaturitySettlement(clientId: string, investmentId: string, amount: number): Promise<void> {
    // Process maturity settlement
    console.log(`Processing maturity settlement: ${clientId}, ${investmentId}, ${amount}`);
  }

  private async processCouponPayment(clientId: string, investmentId: string, amount: number): Promise<void> {
    // Process coupon payment
    console.log(`Processing coupon payment: ${clientId}, ${investmentId}, ${amount}`);
  }

  private async calculateRiskMetrics(product: StructuredProduct): Promise<any> {
    // Calculate VaR, Expected Shortfall, etc.
    return {
      var95: 0.05,
      var99: 0.10,
      expectedShortfall: 0.15,
      maxDrawdown: 0.20,
      volatility: 0.25,
      sharpeRatio: 1.2
    };
  }

  private async performScenarioAnalysis(product: StructuredProduct): Promise<any[]> {
    return [
      { scenario: 'Bull Market', probabilityWeight: 0.3, expectedReturn: 15, worstCase: 5, bestCase: 25 },
      { scenario: 'Base Case', probabilityWeight: 0.4, expectedReturn: 8, worstCase: -5, bestCase: 15 },
      { scenario: 'Bear Market', probabilityWeight: 0.3, expectedReturn: -5, worstCase: -20, bestCase: 5 }
    ];
  }

  private async performStressTests(product: StructuredProduct): Promise<any[]> {
    return [
      { stressType: 'Market Crash', description: '30% market decline', impact: -15 },
      { stressType: 'Volatility Spike', description: 'Volatility doubles', impact: -8 },
      { stressType: 'Interest Rate Shock', description: '200bp rate increase', impact: -5 }
    ];
  }

  private initializeDefaultProducts(): void {
    // Initialize with sample products for demonstration
    const sampleProduct: StructuredProduct = {
      id: 'SP_DEMO_BTC_ETH_DCN',
      name: 'BTC-ETH Digital Credit Note',
      type: 'dcn',
      underlying: ['BTC', 'ETH'],
      currency: 'USD',
      issuePrice: 1000,
      currentValue: 1000,
      maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      issueDate: new Date(),
      minimumInvestment: 10000,
      maximumInvestment: 1000000,
      couponRate: 8.5,
      couponFrequency: 'quarterly',
      protectionLevel: 100,
      participationRate: 100,
      terms: {
        description: 'Digital Credit Note linked to BTC, ETH with capital protection and quarterly coupons',
        payoffStructure: 'Principal protected with quarterly coupons. At maturity: 100% principal + participation in upside',
        earlyRedemption: false,
        capitalProtection: true,
        protectionLevel: 100
      },
      risks: {
        marketRisk: 'medium',
        creditRisk: 'low',
        liquidityRisk: 'medium',
        currencyRisk: 'low',
        complexityLevel: 3,
        maxLoss: 0,
        riskDisclosure: ['Capital protected product with market-linked returns']
      },
      suitability: {
        minimumKnowledge: 'basic',
        minimumExperience: 1,
        minimumNetWorth: 100000,
        riskTolerance: 'moderate',
        investmentObjective: ['income', 'growth'],
        excludedJurisdictions: [],
        accreditedInvestorOnly: false
      },
      pricing: {
        fairValue: 1000,
        bid: 995,
        ask: 1005,
        lastPrice: 1000
      },
      status: 'active',
      subscriptionPeriod: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      totalIssued: 0,
      remainingCapacity: 10000000
    };

    this.products.set(sampleProduct.id, sampleProduct);
  }
}

export const structuredProductsService = new StructuredProductsEngine();