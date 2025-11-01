import { fxSwapService } from './fx_swap_service';
import { enhancedStripeService } from './stripe-service';
import { alt5PayService } from './alt5pay-service';
import { alt5ProService } from './alt5pro-service';
import { changeNowService } from './changenow-service';
import { nowPaymentsService } from './nowpayments-service';
import { stripe } from './stripe-service';

export type PaymentProvider = 'stripe' | 'alt5pay' | 'changenow' | 'nowpayments';

interface ProviderComparison {
  provider: PaymentProvider;
  rate: number;
  fees: number;
  totalCost: number;
  estimatedOutput: number;
  pros: string[];
  cons: string[];
}

interface PaymentProviderSelection {
  recommendedProvider: PaymentProvider;
  comparison: ProviderComparison[];
  reasoning: string;
  savings: number;
}

interface CreatePaymentParams {
  gbpAmount: number;
  destinationWallet: string;
  targetToken: string;
  userId: string;
  clientOrderId: string;
  preferredProvider?: PaymentProvider;
  fiatCurrency?: string;
}

interface ProviderConfig {
  stripe: {
    enabled: boolean;
    priority: number;
    maxAmount: number;
    supportedCurrencies: string[];
    supportedTokens: string[];
  };
  changenow: {
    enabled: boolean;
    priority: number;
    maxAmount: number;
    supportedCurrencies: string[];
    supportedTokens: string[];
    minConfirmations: number;
  };
  nowpayments: {
    enabled: boolean;
    priority: number;
    maxAmount: number;
    supportedCurrencies: string[];
    supportedTokens: string[];
    minConfirmations: number;
  };
  alt5pay: {
    enabled: boolean;
    priority: number;
    maxAmount: number;
    supportedCurrencies: string[];
    supportedTokens: string[];
    minConfirmations: number;
  };
}

/**
 * Payment Provider Service
 * Automatically selects the best payment provider (Stripe vs ALT5 Pay)
 * based on rates, fees, and user preferences
 */
export class PaymentProviderService {
  private config: ProviderConfig;

  constructor() {
    this.config = {
      stripe: {
        enabled: true,
        priority: 1,
        maxAmount: 10000, // £10,000
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL']
      },
      changenow: {
        enabled: !!process.env.CHANGENOW_API_KEY,
        priority: 2,
        maxAmount: 100000, // £100,000 (higher limits for crypto exchanges)
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL', 'BNB', 'ADA', 'DOT', 'LINK'],
        minConfirmations: 3
      },
      nowpayments: {
        enabled: !!process.env.NOWPAYMENTS_API_KEY,
        priority: 3,
        maxAmount: 75000, // £75,000 (good middle ground)
        supportedCurrencies: ['USD', 'CAD', 'EUR', 'GBP'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL', 'BNB', 'ADA', 'DOT', 'LINK', 'MATIC', 'AVAX'],
        minConfirmations: 3
      },
      alt5pay: {
        enabled: process.env.ALT5_PAY_ENABLED === 'true',
        priority: 4,
        maxAmount: 50000, // £50,000 (higher limits for crypto)
        supportedCurrencies: ['USD', 'CAD', 'EUR'],
        supportedTokens: ['USDT', 'USDC', 'BTC', 'ETH', 'BCH', 'LTC', 'XRP', 'SOL'],
        minConfirmations: 3
      }
    };
  }

  /**
   * Compare payment providers and select the best one
   */
  async compareProviders(params: {
    gbpAmount: number;
    targetToken: string;
    fiatCurrency: string;
  }): Promise<PaymentProviderSelection> {
    const { gbpAmount, targetToken, fiatCurrency } = params;

    const comparisons: ProviderComparison[] = [];

    // Stripe comparison
    if (this.config.stripe.enabled && this.isProviderSupported('stripe', gbpAmount, fiatCurrency, targetToken)) {
      try {
        const stripeComparison = await this.getStripeComparison(gbpAmount, targetToken, fiatCurrency);
        comparisons.push(stripeComparison);
      } catch (error) {
        console.error('[PaymentProvider] Stripe comparison failed:', error);
      }
    }

    // ChangeNow comparison
    if (this.config.changenow.enabled && this.isProviderSupported('changenow', gbpAmount, fiatCurrency, targetToken)) {
      try {
        const changeNowComparison = await this.getChangeNowComparison(gbpAmount, targetToken, fiatCurrency);
        comparisons.push(changeNowComparison);
      } catch (error) {
        console.error('[PaymentProvider] ChangeNow comparison failed:', error);
      }
    }

    // NOWPayments comparison
    if (this.config.nowpayments.enabled && this.isProviderSupported('nowpayments', gbpAmount, fiatCurrency, targetToken)) {
      try {
        const nowPaymentsComparison = await this.getNowPaymentsComparison(gbpAmount, targetToken, fiatCurrency);
        comparisons.push(nowPaymentsComparison);
      } catch (error) {
        console.error('[PaymentProvider] NOWPayments comparison failed:', error);
      }
    }

    // ALT5 Pay comparison
    if (this.config.alt5pay.enabled && this.isProviderSupported('alt5pay', gbpAmount, fiatCurrency, targetToken)) {
      try {
        const alt5Comparison = await this.getAlt5PayComparison(gbpAmount, targetToken, fiatCurrency);
        comparisons.push(alt5Comparison);
      } catch (error) {
        console.error('[PaymentProvider] ALT5 Pay comparison failed:', error);
      }
    }

    if (comparisons.length === 0) {
      throw new Error('No payment providers available for this transaction');
    }

    // Sort by total cost (ascending - best deal first)
    comparisons.sort((a, b) => a.totalCost - b.totalCost);

    const recommended = comparisons[0];
    const savings = comparisons.length > 1 ? comparisons[1].totalCost - recommended.totalCost : 0;

    return {
      recommendedProvider: recommended.provider,
      comparison: comparisons,
      reasoning: this.generateReasoning(recommended, comparisons),
      savings: savings
    };
  }

  /**
   * Create payment with the selected provider
   */
  async createPayment(params: CreatePaymentParams): Promise<{
    provider: PaymentProvider;
    paymentData: any;
    comparison: ProviderComparison | null;
  }> {
    const { gbpAmount, destinationWallet, targetToken, userId, clientOrderId, preferredProvider, fiatCurrency = 'USD' } = params;

    let selection: PaymentProviderSelection;

    // If user has a preferred provider, use it if available
    if (preferredProvider) {
      if (!this.config[preferredProvider].enabled) {
        throw new Error(`Preferred provider ${preferredProvider} is not enabled`);
      }
      
      if (!this.isProviderSupported(preferredProvider, gbpAmount, fiatCurrency, targetToken)) {
        throw new Error(`Preferred provider ${preferredProvider} does not support this transaction`);
      }

      // Get comparison for the preferred provider only
      let comparison: ProviderComparison;
      switch (preferredProvider) {
        case 'stripe':
          comparison = await this.getStripeComparison(gbpAmount, targetToken, fiatCurrency);
          break;
        case 'changenow':
          comparison = await this.getChangeNowComparison(gbpAmount, targetToken, fiatCurrency);
          break;
        case 'nowpayments':
          comparison = await this.getNowPaymentsComparison(gbpAmount, targetToken, fiatCurrency);
          break;
        case 'alt5pay':
          comparison = await this.getAlt5PayComparison(gbpAmount, targetToken, fiatCurrency);
          break;
        default:
          throw new Error(`Unsupported provider: ${preferredProvider}`);
      }

      selection = {
        recommendedProvider: preferredProvider,
        comparison: [comparison],
        reasoning: `User preferred ${preferredProvider}`,
        savings: 0
      };
    } else {
      // Auto-select best provider - PREFER STRIPE for better user experience
      // Since we have live Stripe keys, let's prioritize Stripe over crypto providers
      if (this.config.stripe.enabled && this.isProviderSupported('stripe', gbpAmount, fiatCurrency, targetToken)) {
        try {
          const stripeComparison = await this.getStripeComparison(gbpAmount, targetToken, fiatCurrency);
          selection = {
            recommendedProvider: 'stripe',
            comparison: [stripeComparison],
            reasoning: 'Stripe selected for instant card payments with fraud protection',
            savings: 0
          };
        } catch (error) {
          console.error('[PaymentProvider] Stripe comparison failed, falling back to auto-selection:', error);
          selection = await this.compareProviders({ gbpAmount, targetToken, fiatCurrency });
        }
      } else {
        selection = await this.compareProviders({ gbpAmount, targetToken, fiatCurrency });
      }
    }

    // Create payment with selected provider
    let paymentData;
    switch (selection.recommendedProvider) {
      case 'stripe':
        paymentData = await enhancedStripeService.createFxSwapPaymentIntent({
          userId,
          gbpAmount,
          destinationWallet,
          targetToken,
        });
        break;
      case 'changenow':
        paymentData = await changeNowService.createFxSwapPayment({
          gbpAmount,
          destinationWallet,
          targetToken,
          userId,
          clientOrderId,
          fiatCurrency
        });
        break;
      case 'nowpayments':
        paymentData = await nowPaymentsService.createFxSwapPayment({
          gbpAmount,
          destinationWallet,
          targetToken,
          userId,
          clientOrderId,
          fiatCurrency
        });
        break;
      case 'alt5pay':
        paymentData = await alt5PayService.createFxSwapPayment({
          gbpAmount,
          destinationWallet,
          targetToken,
          userId,
          clientOrderId,
          fiatCurrency
        });
        break;
      default:
        throw new Error(`Unsupported provider: ${selection.recommendedProvider}`);
    }

    return {
      provider: selection.recommendedProvider,
      paymentData,
      comparison: selection.comparison[0] || null
    };
  }

  /**
   * Get Stripe comparison data
   */
  private async getStripeComparison(gbpAmount: number, targetToken: string, fiatCurrency: string): Promise<ProviderComparison> {
    // Calculate Stripe fees (typically 2.9% + £0.30)
    const stripeFeePercent = 2.9;
    const stripeFeeFixed = 0.30;
    const stripeFees = (gbpAmount * (stripeFeePercent / 100)) + stripeFeeFixed;

    // Get current FX rate from existing service
    const fxData = await fxSwapService.calculateSwapOutput(gbpAmount, targetToken);
    
    // Calculate total cost and estimated output
    const totalCost = gbpAmount + stripeFees;
    const estimatedOutput = fxData.estimatedOutput;

    return {
      provider: 'stripe',
      rate: fxData.fxRate,
      fees: stripeFees,
      totalCost,
      estimatedOutput,
      pros: [
        'Instant payment processing',
        'Familiar card payment method',
        'Strong fraud protection',
        'Global availability',
        'Lower volatility risk'
      ],
      cons: [
        'Higher processing fees',
        'Potential payment failures',
        'Geographic restrictions',
        'Chargeback risk'
      ]
    };
  }

  /**
   * Get ALT5 Pay comparison data
   */
  private async getAlt5PayComparison(gbpAmount: number, targetToken: string, fiatCurrency: string): Promise<ProviderComparison> {
    try {
      console.log('[PaymentProvider] Getting ALT5 Pay price for:', { targetToken, fiatCurrency });
      
      // Get current crypto price from ALT5 Pay
      const alt5Coin = this.mapTokenToAlt5Coin(targetToken);
      const priceResponse = await alt5PayService.getCurrentPrice({
        coin: alt5Coin,
        currency: fiatCurrency as 'USD' | 'CAD' | 'EUR'
      });

      console.log('[PaymentProvider] ALT5 Pay price response:', JSON.stringify(priceResponse, null, 2));

      if (!priceResponse.data || !priceResponse.data.price) {
        throw new Error(`Invalid price response from ALT5 Pay: ${JSON.stringify(priceResponse)}`);
      }

      const cryptoPrice = parseFloat(priceResponse.data.price);
      
      // ALT5 Pay fees (typically 2% based on documentation)
      const alt5FeePercent = 2.0;
      const alt5Fees = gbpAmount * (alt5FeePercent / 100);

      // Calculate crypto amount user needs to send
      const cryptoAmount = gbpAmount / cryptoPrice;

      // Calculate total cost and estimated output
      const totalCost = gbpAmount + alt5Fees;
      const estimatedOutput = gbpAmount - alt5Fees; // After fees

      return {
        provider: 'alt5pay',
        rate: cryptoPrice,
        fees: alt5Fees,
        totalCost,
        estimatedOutput,
        pros: [
          'Lower processing fees',
          'No chargeback risk',
          'Global availability',
          'Multiple crypto options',
          'Faster settlement'
        ],
        cons: [
          'Requires crypto knowledge',
          'Price volatility risk',
          'Blockchain confirmation time',
          'Less familiar to some users'
        ]
      };
    } catch (error: any) {
      console.error('[PaymentProvider] ALT5 Pay comparison failed:', error);
      throw new Error(`Failed to get ALT5 Pay comparison: ${error.message}`);
    }
  }

  /**
   * Check if provider supports the transaction
   */
  private isProviderSupported(provider: PaymentProvider, amount: number, currency: string, token: string): boolean {
    const config = this.config[provider];
    
    // Check amount limits
    if (amount > config.maxAmount) {
      return false;
    }

    // Check currency support
    if (!config.supportedCurrencies.includes(currency)) {
      return false;
    }

    // Check token support
    if (!config.supportedTokens.includes(token)) {
      return false;
    }

    return true;
  }

  /**
   * Generate reasoning for provider selection
   */
  private generateReasoning(recommended: ProviderComparison, allComparisons: ProviderComparison[]): string {
    const savings = allComparisons.length > 1 ? allComparisons[1].totalCost - recommended.totalCost : 0;
    const savingsPercent = savings > 0 ? ((savings / allComparisons[1].totalCost) * 100).toFixed(1) : '0';

    let reasoning = `Selected ${recommended.provider} based on:\n`;
    reasoning += `• Total cost: £${recommended.totalCost.toFixed(2)}\n`;
    reasoning += `• Estimated output: ${recommended.estimatedOutput.toFixed(4)} ${recommended.provider === 'alt5pay' ? 'crypto' : 'after card fees'}\n`;
    reasoning += `• Processing fees: £${recommended.fees.toFixed(2)}\n`;
    
    if (savings > 0) {
      reasoning += `• Savings: £${savings.toFixed(2)} (${savingsPercent}%) vs ${allComparisons[1].provider}\n`;
    }

    reasoning += `\nBenefits of ${recommended.provider}:\n`;
    recommended.pros.forEach(pro => {
      reasoning += `• ${pro}\n`;
    });

    return reasoning;
  }

  /**
   * Map internal token to ALT5 coin symbol
   */
  private mapTokenToAlt5Coin(token: string): 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'BCH' | 'LTC' | 'XRP' | 'SOL' {
    const mapping: Record<string, any> = {
      'USDT': 'USDT',
      'USDC': 'USDC',
      'BTC': 'BTC',
      'ETH': 'ETH',
      'BCH': 'BCH',
      'LTC': 'LTC',
      'XRP': 'XRP',
      'SOL': 'SOL'
    };

    const alt5Coin = mapping[token.toUpperCase()];
    if (!alt5Coin) {
      throw new Error(`Unsupported token for ALT5: ${token}`);
    }

    return alt5Coin;
  }

  /**
   * Verify payment status across providers
   */
  // async verifyPaymentStatus(provider: PaymentProvider, orderId: string): Promise<{
  //   status: 'paid' | 'pending' | 'failed';
  //   amountReceived: number;
  //   transactionId: string;
  //   confirmations?: number;
  // }> {
  //   if (provider === 'stripe') {
  //     // For Stripe, we would typically use webhooks or payment intent status
  //     // This is a simplified version
  //     const order = await fxSwapService.getOrder(orderId);
  //     if (!order) {
  //       return {
  //         status: 'failed',
  //         amountReceived: 0,
  //         transactionId: ''
  //       };
  //     }

  //     // Check if payment was confirmed
  //     if (order.status === 'STRIPE_CONFIRMED' || order.status === 'COMPLETED') {
  //       return {
  //         status: 'paid',
  //         amountReceived: parseFloat(order.fiatAmount),
  //         transactionId: order.stripePaymentIntentId || ''
  //       };
  //     } else if (order.status.includes('FAILED')) {
  //       return {
  //         status: 'failed',
  //         amountReceived: 0,
  //         transactionId: ''
  //       };
  //     } else {
  //       return {
  //         status: 'pending',
  //         amountReceived: 0,
  //         transactionId: ''
  //       };
  //     }
  //   } else {
  //     // ALT5 Pay verification
  //     return await alt5PayService.verifyPaymentStatus(orderId);
  //   }
  // }

  /**
   * Get ChangeNow comparison data
   */
  private async getChangeNowComparison(gbpAmount: number, targetToken: string, fiatCurrency: string): Promise<ProviderComparison> {
    try {
      console.log('[PaymentProvider] Getting ChangeNow comparison for:', { targetToken, fiatCurrency });
      
      // Convert GBP to USD for ChangeNow
      const usdAmount = gbpAmount * 1.25; // Approximate GBP to USD conversion
      const toCurrency = this.mapTokenToChangeNowToken(targetToken);

      // Get estimated crypto amount
      const estimatedAmount = await changeNowService.getEstimatedAmount('usd', toCurrency, usdAmount);
      
      // ChangeNow fees (typically 0.5-1% for exchanges)
      const changeNowFeePercent = 0.75;
      const changeNowFees = gbpAmount * (changeNowFeePercent / 100);

      // Calculate total cost and estimated output
      const totalCost = gbpAmount + changeNowFees;
      const estimatedOutput = gbpAmount - changeNowFees; // After fees

      return {
        provider: 'changenow',
        rate: usdAmount / estimatedAmount.estimatedAmount, // USD per crypto unit - fixed property name
        fees: changeNowFees,
        totalCost,
        estimatedOutput,
        pros: [
          'Very low exchange fees (0.5-1%)',
          'Wide range of cryptocurrencies',
          'Fast exchange processing',
          'No chargeback risk',
          'Fixed rate protection'
        ],
        cons: [
          'Requires waiting for exchange completion',
          'Exchange rate volatility during processing',
          'Minimum exchange amounts may apply',
          'Less familiar to some users'
        ]
      };
    } catch (error: any) {
      console.error('[PaymentProvider] ChangeNow comparison failed:', error);
      throw new Error(`Failed to get ChangeNow comparison: ${error.message}`);
    }
  }

  /**
   * Get NOWPayments comparison data
   */
  private async getNowPaymentsComparison(gbpAmount: number, targetToken: string, fiatCurrency: string): Promise<ProviderComparison> {
    try {
      console.log('[PaymentProvider] Getting NOWPayments comparison for:', { targetToken, fiatCurrency });
      
      // Convert GBP to USD for NOWPayments
      const usdAmount = gbpAmount * 1.25; // Approximate GBP to USD conversion
      const payCurrency = this.mapTokenToNowPaymentsToken(targetToken);

      // Get estimated crypto amount
      const estimatedAmount = await nowPaymentsService.getEstimatedAmount(usdAmount, 'usd', payCurrency);
      
      // NOWPayments fees (typically 0.5-1% for payments)
      const nowPaymentsFeePercent = 0.75;
      const nowPaymentsFees = gbpAmount * (nowPaymentsFeePercent / 100);

      // Calculate total cost and estimated output
      const totalCost = gbpAmount + nowPaymentsFees;
      const estimatedOutput = gbpAmount - nowPaymentsFees; // After fees

      return {
        provider: 'nowpayments',
        rate: usdAmount / estimatedAmount.estimatedAmount, // USD per crypto unit
        fees: nowPaymentsFees,
        totalCost,
        estimatedOutput,
        pros: [
          'Low processing fees (0.5-1%)',
          'Hosted payment pages available',
          'Wide cryptocurrency support',
          'No chargeback risk',
          'Good API documentation'
        ],
        cons: [
          'Requires crypto payment knowledge',
          'Blockchain confirmation time',
          'Price volatility during payment',
          'Payment window limitations'
        ]
      };
    } catch (error: any) {
      console.error('[PaymentProvider] NOWPayments comparison failed:', error);
      throw new Error(`Failed to get NOWPayments comparison: ${error.message}`);
    }
  }

  /**
   * Map internal token symbols to ChangeNow token symbols
   */
  private mapTokenToChangeNowToken(token: string): string {
    const mapping: Record<string, string> = {
      'USDT': 'usdt',
      'USDC': 'usdc',
      'BTC': 'btc',
      'ETH': 'eth',
      'BCH': 'bch',
      'LTC': 'ltc',
      'XRP': 'xrp',
      'SOL': 'sol',
      'BNB': 'bnb',
      'ADA': 'ada',
      'DOT': 'dot',
      'LINK': 'link'
    };

    const changeNowToken = mapping[token.toUpperCase()];
    if (!changeNowToken) {
      throw new Error(`Unsupported token for ChangeNow: ${token}`);
    }

    return changeNowToken;
  }

  /**
   * Map internal token symbols to NOWPayments token symbols
   */
  private mapTokenToNowPaymentsToken(token: string): string {
    const mapping: Record<string, string> = {
      'USDT': 'usdt',
      'USDC': 'usdc',
      'BTC': 'btc',
      'ETH': 'eth',
      'BCH': 'bch',
      'LTC': 'ltc',
      'XRP': 'xrp',
      'SOL': 'sol',
      'BNB': 'bnb',
      'ADA': 'ada',
      'DOT': 'dot',
      'LINK': 'link',
      'MATIC': 'matic',
      'AVAX': 'avax'
    };

    const nowPaymentsToken = mapping[token.toUpperCase()];
    if (!nowPaymentsToken) {
      throw new Error(`Unsupported token for NOWPayments: ${token}`);
    }

    return nowPaymentsToken;
  }

  /**
   * Verify payment status across providers
   */
  async verifyPaymentStatus(provider: PaymentProvider, orderId: string): Promise<{
    status: 'paid' | 'pending' | 'failed';
    amountReceived: number;
    transactionId: string;
    confirmations?: number;
  }> {
    switch (provider) {
      case 'stripe':
        return await this.verifyStripePayment(orderId);
      case 'changenow':
        return await changeNowService.verifyPaymentStatus(orderId);
      case 'nowpayments':
        return await nowPaymentsService.verifyPaymentStatus(orderId);
      case 'alt5pay':
        return await alt5PayService.verifyPaymentStatus(orderId);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Verify Stripe payment status
   */
  private async verifyStripePayment(orderId: string): Promise<{
    status: 'paid' | 'pending' | 'failed';
    amountReceived: number;
    transactionId: string;
    confirmations?: number;
  }> {
    // For Stripe, we would typically use webhooks or payment intent status
    // This is a simplified version
    const order = await fxSwapService.getOrder(orderId);
    if (!order) {
      return {
        status: 'failed',
        amountReceived: 0,
        transactionId: ''
      };
    }

    // Check if payment was confirmed
    if (order.status === 'STRIPE_CONFIRMED' || order.status === 'COMPLETED') {
      return {
        status: 'paid',
        amountReceived: parseFloat(order.fiatAmount),
        transactionId: order.stripePaymentIntentId || ''
      };
    } else if (order.status.includes('FAILED')) {
      return {
        status: 'failed',
        amountReceived: 0,
        transactionId: ''
      };
    } else {
      return {
        status: 'pending',
        amountReceived: 0,
        transactionId: ''
      };
    }
  }

  /**
   * Get provider health status
   */
  async getProviderHealth(): Promise<{
    stripe: { status: 'healthy' | 'degraded' | 'down'; message: string };
    changenow: { status: 'healthy' | 'degraded' | 'down'; message: string };
    nowpayments: { status: 'healthy' | 'degraded' | 'down'; message: string };
    alt5pay: { status: 'healthy' | 'degraded' | 'down'; message: string };
  }> {
    const health = {
      stripe: { status: 'healthy' as const, message: 'Operational' },
      changenow: { status: 'healthy' as const, message: 'Operational' },
      nowpayments: { status: 'healthy' as const, message: 'Operational' },
      alt5pay: { status: 'healthy' as const, message: 'Operational' }
    } as {
      stripe: { status: 'healthy' | 'degraded' | 'down'; message: string };
      changenow: { status: 'healthy' | 'degraded' | 'down'; message: string };
      nowpayments: { status: 'healthy' | 'degraded' | 'down'; message: string };
      alt5pay: { status: 'healthy' | 'degraded' | 'down'; message: string };
    };

    // Check Stripe health
    try {
      // Use the imported stripe instance
      await stripe.balance.retrieve();
      health.stripe.status = 'healthy';
      health.stripe.message = 'All systems operational';
    } catch (error: any) {
      health.stripe.status = 'down';
      health.stripe.message = `Stripe API error: ${error.message}`;
    }

    // Check ChangeNow health
    try {
      await changeNowService.getProviderHealth();
      health.changenow.status = 'healthy';
      health.changenow.message = 'All systems operational';
    } catch (error: any) {
      health.changenow.status = 'down';
      health.changenow.message = `ChangeNow API error: ${error.message}`;
    }

    // Check NOWPayments health
    try {
      await nowPaymentsService.getProviderHealth();
      health.nowpayments.status = 'healthy';
      health.nowpayments.message = 'All systems operational';
    } catch (error: any) {
      health.nowpayments.status = 'down';
      health.nowpayments.message = `NOWPayments API error: ${error.message}`;
    }

    // Check ALT5 Pay health
    try {
      await alt5PayService.getBalances();
      health.alt5pay.status = 'healthy';
      health.alt5pay.message = 'All systems operational';
    } catch (error: any) {
      health.alt5pay.status = 'down';
      health.alt5pay.message = `ALT5 Pay API error: ${error.message}`;
    }

    return health;
  }
}

// Export singleton instance
export const paymentProviderService = new PaymentProviderService();
