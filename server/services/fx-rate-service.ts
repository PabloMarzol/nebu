import { fxSwapService } from './fx_swap_service';

/**
 * FX Rate Service with multiple fallback sources
 * Provides reliable GBP→USD conversion rates for FX swaps
 */
export class FxRateService {
  private readonly FALLBACK_RATE = 1.27; // Fallback GBP/USD rate
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Get current FX rate with multiple fallback sources
   */
  async getFxRate(fromCurrency: string, toCurrency: string): Promise<{
    rate: number;
    source: string;
    confidence: number;
    timestamp: Date;
  }> {
    console.log(`[FxRateService] Getting rate for ${fromCurrency}→${toCurrency}`);
    
    const sources = [
      { name: 'coinbase', fetchRate: this.fetchCoinbaseRate.bind(this) },
      { name: 'coingecko', fetchRate: this.fetchCoinGeckoRate.bind(this) },
      { name: 'mock', fetchRate: this.getMockRate.bind(this) }
    ];

    for (const source of sources) {
      try {
        console.log(`[FxRateService] Trying ${source.name}...`);
        const result = await this.retryWithDelay(() => source.fetchRate(fromCurrency, toCurrency));
        
        if (result && result.rate > 0) {
          console.log(`[FxRateService] Successfully got rate from ${source.name}: ${result.rate}`);
          return {
            ...result,
            source: source.name,
            confidence: source.name === 'mock' ? 0.8 : 0.95,
            timestamp: new Date()
          };
        }
      } catch (error) {
        console.warn(`[FxRateService] ${source.name} failed:`, error);
        continue;
      }
    }

    // All sources failed, use fallback
    console.warn(`[FxRateService] All sources failed, using fallback rate: ${this.FALLBACK_RATE}`);
    return {
      rate: this.FALLBACK_RATE,
      source: 'fallback',
      confidence: 0.7,
      timestamp: new Date()
    };
  }

  /**
   * Fetch rate from Coinbase API
   */
  private async fetchCoinbaseRate(fromCurrency: string, toCurrency: string): Promise<{ rate: number } | null> {
    try {
      const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${fromCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Coinbase API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data && data.data.rates && data.data.rates[toCurrency]) {
        const rate = parseFloat(data.data.rates[toCurrency]);
        console.log(`[FxRateService] Coinbase rate: ${rate}`);
        return { rate };
      }
      
      return null;
    } catch (error) {
      console.error('[FxRateService] Coinbase fetch failed:', error);
      return null;
    }
  }

  /**
   * Fetch rate from CoinGecko API
   */
  private async fetchCoinGeckoRate(fromCurrency: string, toCurrency: string): Promise<{ rate: number } | null> {
    try {
      // CoinGecko uses different endpoint structure
      const fromCode = fromCurrency.toLowerCase();
      const toCode = toCurrency.toLowerCase();
      
      const response = await fetch(
