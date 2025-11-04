import Groq from 'groq-sdk';
import { db } from '../db';
import { eq, desc, and, gte } from 'drizzle-orm';
import { hyperliquidMarketDataService } from './hyperliquid-market-data';
import { marketDataService } from './market-data';
import dotenv from "dotenv"
dotenv.config()

// Use Groq instead of OpenAI - Groq provides faster inference with Llama models
const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY });

export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-100
  price_target: number;
  stop_loss: number;
  time_horizon: 'short' | 'medium' | 'long'; // minutes, hours, days
  reasoning: string;
  technical_indicators: Record<string, any>;
  created_at: string;
  expires_at: string;
}

export interface MarketAnalysis {
  id: string;
  market_sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  key_factors: string[];
  risk_assessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  predictions: {
    short_term: string;
    medium_term: string;
    long_term: string;
  };
  created_at: string;
}

export interface PortfolioOptimization {
  current_allocation: Record<string, number>;
  recommended_allocation: Record<string, number>;
  expected_return: number;
  risk_score: number;
  reasoning: string;
  actions: Array<{
    action: 'buy' | 'sell' | 'rebalance';
    symbol: string;
    amount: number;
    reasoning: string;
  }>;
}

class AITradingService {
  private static instance: AITradingService;

  static getInstance(): AITradingService {
    if (!AITradingService.instance) {
      AITradingService.instance = new AITradingService();
    }
    return AITradingService.instance;
  }

  // AI Trading Signals Generation
  async generateTradingSignal(symbol: string, marketData: any): Promise<TradingSignal> {
    try {
      // Enhance with real-time price data if available
      const enhancedMarketData = await this.enhanceMarketDataWithRealTimePrices(symbol, marketData);
      
      const prompt = `
        Analyze the following cryptocurrency market data for ${symbol} and provide a professional trading signal:
        
        REAL-TIME MARKET DATA (Current as of ${enhancedMarketData.enhancedAt || new Date().toISOString()}):
        - Current Price: $${enhancedMarketData.price}
        - 24h Change: ${enhancedMarketData.change24h}%
        - Volume: $${enhancedMarketData.volume}
        - 24h High: $${enhancedMarketData.high24h}
        - 24h Low: $${enhancedMarketData.low24h}
        - Market Cap: $${enhancedMarketData.marketCap}
        
        TECHNICAL INDICATORS:
        - RSI: ${enhancedMarketData.rsi || 'N/A'}
        - MACD: ${enhancedMarketData.macd || 'N/A'}
        - Moving Averages: MA20: ${enhancedMarketData.ma20 || 'N/A'}, MA50: ${enhancedMarketData.ma50 || 'N/A'}
        - Support/Resistance: Support: ${enhancedMarketData.support || 'N/A'}, Resistance: ${enhancedMarketData.resistance || 'N/A'}
        
        Provide a JSON response with:
        - action: 'buy', 'sell', or 'hold'
        - confidence: 0-100 (how confident you are in this signal)
        - price_target: expected price target
        - stop_loss: recommended stop loss level
        - time_horizon: 'short' (minutes), 'medium' (hours), 'long' (days)
        - reasoning: detailed explanation of the signal based on current market conditions
        - technical_indicators: analysis of each indicator
        - current_market_context: brief assessment of current market sentiment
        
        IMPORTANT: Base your analysis on the CURRENT real-time market data provided above. Do not use outdated or hypothetical prices.
      `;

      const response = await groq.chat.completions.create({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are a professional cryptocurrency trading analyst with expertise in technical analysis. Provide precise, actionable trading signals based on market data. Always respond in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      const signal: TradingSignal = {
        id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        action: analysis.action || 'hold',
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        price_target: analysis.price_target || marketData.price,
        stop_loss: analysis.stop_loss || marketData.price * 0.95,
        time_horizon: analysis.time_horizon || 'medium',
        reasoning: analysis.reasoning || 'Technical analysis inconclusive',
        technical_indicators: analysis.technical_indicators || {},
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      // Store signal in database
      await this.storeTradingSignal(signal);
      
      return signal;
    } catch (error) {
      console.error('[AITradingService] Failed to generate trading signal:', error);
      throw error;
    }
  }

  // Market Sentiment Analysis
  async analyzeMarketSentiment(newsData: string[], socialData: string[]): Promise<MarketAnalysis> {
    try {
      const prompt = `
        Analyze the current cryptocurrency market sentiment based on the following data:
        
        Recent News Headlines:
        ${newsData.slice(0, 10).map((news, i) => `${i + 1}. ${news}`).join('\n')}
        
        Social Media Sentiment:
        ${socialData.slice(0, 10).map((post, i) => `${i + 1}. ${post}`).join('\n')}
        
        Provide a comprehensive market analysis in JSON format including:
        - market_sentiment: 'bullish', 'bearish', or 'neutral'
        - confidence: 0-100 confidence level
        - key_factors: array of main factors influencing sentiment
        - risk_assessment: {level: 'low'|'medium'|'high', factors: string[]}
        - predictions: {short_term, medium_term, long_term} outlook
      `;

      const response = await groq.chat.completions.create({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency market analyst specializing in sentiment analysis. Analyze news and social media data to determine market sentiment and provide predictions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      const marketAnalysis: MarketAnalysis = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        market_sentiment: analysis.market_sentiment || 'neutral',
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        key_factors: analysis.key_factors || [],
        risk_assessment: analysis.risk_assessment || { level: 'medium', factors: [] },
        predictions: analysis.predictions || {
          short_term: 'Market conditions unclear',
          medium_term: 'Awaiting more data',
          long_term: 'Long-term outlook uncertain'
        },
        created_at: new Date().toISOString(),
      };

      await this.storeMarketAnalysis(marketAnalysis);
      
      return marketAnalysis;
    } catch (error) {
      console.error('[AITradingService] Failed to analyze market sentiment:', error);
      throw error;
    }
  }

  // Portfolio Optimization
  async optimizePortfolio(
    currentHoldings: Record<string, number>,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive',
    investmentGoal: string
  ): Promise<PortfolioOptimization> {
    try {
      const prompt = `
        Optimize the following cryptocurrency portfolio:
        
        Current Holdings:
        ${Object.entries(currentHoldings).map(([symbol, amount]) => `${symbol}: ${amount}`).join('\n')}
        
        Risk Tolerance: ${riskTolerance}
        Investment Goal: ${investmentGoal}
        
        Provide portfolio optimization in JSON format:
        - current_allocation: current percentage allocation by asset
        - recommended_allocation: optimized allocation percentages
        - expected_return: expected annual return percentage
        - risk_score: 1-10 risk score
        - reasoning: explanation of recommendations
        - actions: array of specific buy/sell/rebalance actions
      `;

      const response = await groq.chat.completions.create({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency portfolio manager with expertise in modern portfolio theory and risk management. Provide detailed portfolio optimization recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const optimization = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        current_allocation: optimization.current_allocation || {},
        recommended_allocation: optimization.recommended_allocation || {},
        expected_return: optimization.expected_return || 0,
        risk_score: optimization.risk_score || 5,
        reasoning: optimization.reasoning || 'Portfolio analysis completed',
        actions: optimization.actions || [],
      };
    } catch (error) {
      console.error('[AITradingService] Failed to optimize portfolio:', error);
      throw error;
    }
  }

  // Natural Language Trading Commands
  async parseNaturalLanguageCommand(command: string, userId: string): Promise<{
    action: string;
    symbol?: string;
    amount?: number;
    price?: number;
    type: string;
    conditions?: any;
    confidence: number;
  }> {
    try {
      const prompt = `
        Parse the following natural language trading command and convert it to structured trade parameters:
        
        Command: "${command}"
        
        Provide a JSON response with:
        - action: 'buy', 'sell', 'set_alert', 'cancel', 'modify'
        - symbol: cryptocurrency symbol (e.g., 'BTCUSDT')
        - amount: quantity or dollar amount
        - price: specific price if mentioned
        - type: 'market', 'limit', 'stop', 'stop_limit'
        - conditions: any conditional logic
        - confidence: 0-100 how confident you are in parsing this command
        
        Examples:
        "Buy $1000 of Bitcoin" -> {action: 'buy', symbol: 'BTCUSDT', amount: 1000, type: 'market'}
        "Sell 0.5 ETH at $3500" -> {action: 'sell', symbol: 'ETHUSDT', amount: 0.5, price: 3500, type: 'limit'}
        "Alert me when BTC drops below $45000" -> {action: 'set_alert', symbol: 'BTCUSDT', conditions: {price_below: 45000}}
      `;

      const response = await groq.chat.completions.create({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are a trading command parser that converts natural language into structured trading instructions. Always respond in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const parsedCommand = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        action: parsedCommand.action || 'unknown',
        symbol: parsedCommand.symbol,
        amount: parsedCommand.amount,
        price: parsedCommand.price,
        type: parsedCommand.type || 'market',
        conditions: parsedCommand.conditions,
        confidence: Math.min(100, Math.max(0, parsedCommand.confidence || 0)),
      };
    } catch (error) {
      console.error('[AITradingService] Failed to parse natural language command:', error);
      throw error;
    }
  }

  // Smart Order Routing Analysis
  async analyzeOptimalExecution(
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    orderBooks: Array<{ exchange: string; bids: any[]; asks: any[] }>
  ): Promise<{
    recommended_strategy: string;
    execution_plan: Array<{
      exchange: string;
      amount: number;
      estimated_price: number;
      market_impact: number;
    }>;
    total_cost: number;
    price_improvement: number;
    reasoning: string;
  }> {
    try {
      const prompt = `
        Analyze optimal order execution strategy for:
        Symbol: ${symbol}
        Side: ${side}
        Amount: ${amount}
        
        Available Order Books:
        ${orderBooks.map(book => `
        Exchange: ${book.exchange}
        Best Bid: ${book.bids[0]?.[0]} (${book.bids[0]?.[1]})
        Best Ask: ${book.asks[0]?.[0]} (${book.asks[0]?.[1]})
        Depth: ${side === 'buy' ? book.asks.length : book.bids.length} levels
        `).join('\n')}
        
        Provide execution analysis in JSON format:
        - recommended_strategy: 'single_exchange', 'multi_exchange', 'iceberg', 'twap'
        - execution_plan: array of exchange allocations
        - total_cost: estimated total execution cost
        - price_improvement: savings vs worst execution
        - reasoning: explanation of strategy choice
      `;

      const response = await groq.chat.completions.create({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are a smart order routing specialist analyzing optimal trade execution across multiple exchanges. Minimize market impact and execution costs."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('[AITradingService] Failed to analyze optimal execution:', error);
      throw error;
    }
  }

  // Risk Assessment
  async assessTradingRisk(
    portfolio: Record<string, number>,
    proposedTrade: { symbol: string; amount: number; side: 'buy' | 'sell' },
    marketConditions: any
  ): Promise<{
    risk_score: number; // 1-10
    risk_factors: string[];
    recommendations: string[];
    position_size_suggestion: number;
    max_loss_estimate: number;
  }> {
    try {
      const prompt = `
        Assess trading risk for the following scenario:
        
        Current Portfolio:
        ${Object.entries(portfolio).map(([symbol, amount]) => `${symbol}: ${amount}`).join('\n')}
        
        Proposed Trade:
        Symbol: ${proposedTrade.symbol}
        Amount: ${proposedTrade.amount}
        Side: ${proposedTrade.side}
        
        Market Conditions:
        Volatility: ${marketConditions.volatility}
        Trend: ${marketConditions.trend}
        Volume: ${marketConditions.volume}
        
        Provide risk assessment in JSON format:
        - risk_score: 1-10 (1=very low risk, 10=very high risk)
        - risk_factors: array of identified risk factors
        - recommendations: array of risk management suggestions
        - position_size_suggestion: recommended position size
        - max_loss_estimate: estimated maximum potential loss
      `;

      const response = await groq.chat.completions.create({
        model: "groq/compound",
        messages: [
          {
            role: "system",
            content: "You are a risk management specialist analyzing cryptocurrency trading risks. Provide comprehensive risk assessments with actionable recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('[AITradingService] Failed to assess trading risk:', error);
      throw error;
    }
  }

  // Data Storage Methods
  private async storeTradingSignal(signal: TradingSignal): Promise<void> {
    try {
      // In a real implementation, store in database
      console.log('[AITradingService] Trading signal generated:', signal.id);
    } catch (error) {
      console.error('[AITradingService] Failed to store trading signal:', error);
    }
  }

  private async storeMarketAnalysis(analysis: MarketAnalysis): Promise<void> {
    try {
      // In a real implementation, store in database
      console.log('[AITradingService] Market analysis completed:', analysis.id);
    } catch (error) {
      console.error('[AITradingService] Failed to store market analysis:', error);
    }
  }

  // Helper method to enhance market data with real-time prices
  private async enhanceMarketDataWithRealTimePrices(symbol: string, marketData: any): Promise<any> {
    try {
      // Get current real-time price data
      const currentMarketData = await marketDataService.getMarketDataBySymbol(symbol);
      const realTimePrice = await hyperliquidMarketDataService.getCurrentPrice(symbol);
      
      if (!currentMarketData && !realTimePrice) {
        console.warn(`[AITradingService] No real-time data available for ${symbol}, using provided data`);
        return {
          ...marketData,
          dataSource: 'provided-only',
          enhancedAt: new Date().toISOString()
        };
      }

      // Merge provided data with real-time data, prioritizing real-time prices
      const enhancedData = {
        ...marketData,
        price: realTimePrice ? parseFloat(realTimePrice) : parseFloat(currentMarketData?.price || marketData.price),
        change24h: currentMarketData?.change24h ? parseFloat(currentMarketData.change24h) : marketData.change24h,
        volume: currentMarketData?.volume24h ? parseFloat(currentMarketData.volume24h) : marketData.volume,
        high24h: currentMarketData?.high24h ? parseFloat(currentMarketData.high24h) : marketData.high24h,
        low24h: currentMarketData?.low24h ? parseFloat(currentMarketData.low24h) : marketData.low24h,
        marketCap: currentMarketData?.marketCap ? parseFloat(currentMarketData.marketCap) : marketData.marketCap,
        // Keep technical indicators from provided data if available
        rsi: marketData.rsi,
        macd: marketData.macd,
        ma20: marketData.ma20,
        ma50: marketData.ma50,
        support: marketData.support,
        resistance: marketData.resistance,
        // Add metadata
        dataSource: 'real-time-enhanced',
        enhancedAt: new Date().toISOString()
      };

      console.log(`[AITradingService] Enhanced market data for ${symbol}:`, {
        originalPrice: marketData.price,
        realTimePrice: realTimePrice,
        enhancedPrice: enhancedData.price,
        priceDifference: realTimePrice ? Math.abs(parseFloat(realTimePrice) - marketData.price) : 0
      });

      return enhancedData;
    } catch (error) {
      console.error(`[AITradingService] Error enhancing market data for ${symbol}:`, error);
      // Fallback to provided data if enhancement fails
      return {
        ...marketData,
        dataSource: 'provided-fallback',
        enhancedAt: new Date().toISOString()
      };
    }
  }

  // Utility Methods
  async getActiveSignals(userId: string, symbol?: string): Promise<TradingSignal[]> {
    try {
      // Return active signals from database
      return [];
    } catch (error) {
      console.error('[AITradingService] Failed to get active signals:', error);
      return [];
    }
  }

  async getLatestMarketAnalysis(): Promise<MarketAnalysis | null> {
    try {
      // Return latest market analysis from database
      return null;
    } catch (error) {
      console.error('[AITradingService] Failed to get latest market analysis:', error);
      return null;
    }
  }
}

export const aiTradingService = AITradingService.getInstance();
export default aiTradingService;
