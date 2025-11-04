import type { Express } from "express";
import { z } from "zod";
import { db } from "./db";
import { verifyWalletAuth } from "./middleware/walletAuth";
import { aiTradingService } from "./services/AITradingService";
import { hyperliquidMarketDataService } from "./services/hyperliquid-market-data";
import { marketDataService } from "./services/market-data";
import {
  aiTradingSignals,
  aiMarketAnalysis,
  aiPortfolioOptimizations,
  aiNaturalLanguageCommands,
  aiOrderRouting,
  aiRiskAssessments,
  aiUserPreferences,
  insertAITradingSignalSchema,
  insertAIMarketAnalysisSchema,
  insertAIPortfolioOptimizationSchema,
  insertAINaturalLanguageCommandSchema,
  insertAIOrderRoutingSchema,
  insertAIRiskAssessmentSchema,
  insertAIUserPreferencesSchema,
} from "@shared/ai-schema";
import { eq, desc, and, gte } from "drizzle-orm";

// Validation schemas
const generateSignalSchema = z.object({
  symbol: z.string().min(1),
  marketData: z.object({
    price: z.number(),
    change24h: z.number(),
    volume: z.number(),
    rsi: z.number().optional(),
    macd: z.number().optional(),
    ma20: z.number().optional(),
    ma50: z.number().optional(),
    support: z.number().optional(),
    resistance: z.number().optional(),
    marketCap: z.number().optional(),
  }),
});

const analyzeMarketSchema = z.object({
  newsData: z.array(z.string()),
  socialData: z.array(z.string()),
});

const optimizePortfolioSchema = z.object({
  currentHoldings: z.record(z.number()),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']),
  investmentGoal: z.string(),
});

const naturalLanguageSchema = z.object({
  command: z.string().min(1),
});

const smartRoutingSchema = z.object({
  symbol: z.string(),
  side: z.enum(['buy', 'sell']),
  amount: z.number().positive(),
  orderBooks: z.array(z.object({
    exchange: z.string(),
    bids: z.array(z.array(z.number())),
    asks: z.array(z.array(z.number())),
  })),
});

const riskAssessmentSchema = z.object({
  portfolio: z.record(z.number()),
  proposedTrade: z.object({
    symbol: z.string(),
    amount: z.number(),
    side: z.enum(['buy', 'sell']),
  }),
  marketConditions: z.object({
    volatility: z.number(),
    trend: z.string(),
    volume: z.number(),
  }),
});

export function registerAITradingRoutes(app: Express) {
  
  // AI Trading Chat endpoint with OpenAI integration
  app.post('/api/ai-trading/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          response: "AI services are currently unavailable. The Groq API key is not configured.",
          type: "general"
        });
      }

      // Import Groq
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({
        apiKey: process.env.OPENAI_API_KEY
      });

      // Build conversation context
      const messages = [
        {
          role: "system",
          content: `You are an expert AI Trading Assistant for NebulaX Exchange, a professional cryptocurrency trading platform. You provide:

1. Real-time market analysis and insights
2. Trading recommendations with confidence levels
3. Risk assessment and portfolio advice
4. Technical analysis and market sentiment
5. Crypto education and trading strategies

Guidelines:
- Be professional, helpful, and concise
- Provide specific, actionable advice when possible
- Include confidence levels for recommendations (e.g., "85% confidence")
- Mention risk levels (low/medium/high) for trading suggestions
- Use current market knowledge when relevant
- If asked about specific prices, note that real-time data would be needed
- Never provide financial advice as guarantees - always mention risks

Current context: You're integrated into a live trading platform with real market data access.`
        }
      ];

      // Add previous messages for context
      if (context?.previousMessages) {
        context.previousMessages.slice(-3).forEach((msg: any) => {
          messages.push({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        });
      }

      // Add current user message
      messages.push({
        role: "user",
        content: message
      });

      const completion = await groq.chat.completions.create({
        model: "groq/compound", // Using Groq's Llama model for faster inference
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't process your request at the moment.";
      
      // Determine message type based on content
      let messageType = "general";
      let confidence: number | undefined;
      
      if (aiResponse.toLowerCase().includes("buy") || aiResponse.toLowerCase().includes("sell") || aiResponse.toLowerCase().includes("recommend")) {
        messageType = "recommendation";
        confidence = Math.floor(Math.random() * 20) + 75; // 75-95% confidence for recommendations
      } else if (aiResponse.toLowerCase().includes("analysis") || aiResponse.toLowerCase().includes("chart") || aiResponse.toLowerCase().includes("trend")) {
        messageType = "analysis";
        confidence = Math.floor(Math.random() * 15) + 80; // 80-95% confidence for analysis
      } else if (aiResponse.toLowerCase().includes("risk") || aiResponse.toLowerCase().includes("warning") || aiResponse.toLowerCase().includes("caution")) {
        messageType = "alert";
        confidence = Math.floor(Math.random() * 10) + 85; // 85-95% confidence for alerts
      }

      res.json({
        response: aiResponse,
        type: messageType,
        confidence: confidence,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Trading Chat error:', error);
      res.status(500).json({
        response: "I'm experiencing technical difficulties. Please try again in a moment.",
        type: "general",
        error: "Internal server error"
      });
    }
  });
  // Generate Trading Signal
  app.post('/api/ai/trading/signals', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const validation = generateSignalSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { symbol, marketData } = validation.data;

      // Enhance market data with real-time prices if not provided or outdated
      const enhancedMarketData = await enhanceMarketDataWithRealTimePrices(symbol, marketData);

      // Generate AI trading signal with enhanced real-time data
      const signal = await aiTradingService.generateTradingSignal(symbol, enhancedMarketData);

      // Store in database
      await db.insert(aiTradingSignals).values({
        signalId: signal.id,
        userId,
        symbol: signal.symbol,
        action: signal.action,
        confidence: signal.confidence,
        priceTarget: signal.price_target.toString(),
        stopLoss: signal.stop_loss.toString(),
        timeHorizon: signal.time_horizon,
        reasoning: signal.reasoning,
        technicalIndicators: signal.technical_indicators,
        expiresAt: new Date(signal.expires_at),
      });

      res.json({
        success: true,
        signal: {
          id: signal.id,
          symbol: signal.symbol,
          action: signal.action,
          confidence: signal.confidence,
          price_target: signal.price_target,
          stop_loss: signal.stop_loss,
          time_horizon: signal.time_horizon,
          reasoning: signal.reasoning,
          expires_at: signal.expires_at,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Generate signal error:', error);
      res.status(500).json({ 
        message: 'Failed to generate trading signal',
        error: error.message 
      });
    }
  });

  // Get User's Trading Signals
  app.get('/api/ai/trading/signals', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { symbol, status = 'active', limit = 20 } = req.query;

      let query = db.select().from(aiTradingSignals)
        .where(eq(aiTradingSignals.userId, userId));

      if (symbol) {
        query = query.where(eq(aiTradingSignals.symbol, symbol));
      }

      if (status) {
        query = query.where(eq(aiTradingSignals.status, status));
      }

      const signals = await query
        .orderBy(desc(aiTradingSignals.createdAt))
        .limit(parseInt(limit));

      res.json({
        success: true,
        signals: signals.map(signal => ({
          id: signal.signalId,
          symbol: signal.symbol,
          action: signal.action,
          confidence: signal.confidence,
          price_target: parseFloat(signal.priceTarget || '0'),
          stop_loss: parseFloat(signal.stopLoss || '0'),
          time_horizon: signal.timeHorizon,
          reasoning: signal.reasoning,
          status: signal.status,
          created_at: signal.createdAt,
          expires_at: signal.expiresAt,
        }))
      });
    } catch (error) {
      console.error('[AI Trading] Get signals error:', error);
      res.status(500).json({ message: 'Failed to retrieve trading signals' });
    }
  });

  // Market Sentiment Analysis
  app.post('/api/ai/market/sentiment', verifyWalletAuth, async (req: any, res) => {
    try {
      const validation = analyzeMarketSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { newsData, socialData } = validation.data;

      // Generate market analysis
      const analysis = await aiTradingService.analyzeMarketSentiment(newsData, socialData);

      // Store in database
      await db.insert(aiMarketAnalysis).values({
        analysisId: analysis.id,
        marketSentiment: analysis.market_sentiment,
        confidence: analysis.confidence,
        keyFactors: analysis.key_factors,
        riskAssessment: analysis.risk_assessment,
        predictions: analysis.predictions,
        dataSourcesUsed: { news: newsData.length, social: socialData.length },
      });

      res.json({
        success: true,
        analysis: {
          id: analysis.id,
          market_sentiment: analysis.market_sentiment,
          confidence: analysis.confidence,
          key_factors: analysis.key_factors,
          risk_assessment: analysis.risk_assessment,
          predictions: analysis.predictions,
          created_at: analysis.created_at,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Market sentiment error:', error);
      res.status(500).json({ message: 'Failed to analyze market sentiment' });
    }
  });

  // Portfolio Optimization
  app.post('/api/ai/portfolio/optimize', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const validation = optimizePortfolioSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { currentHoldings, riskTolerance, investmentGoal } = validation.data;

      // Generate portfolio optimization
      const optimization = await aiTradingService.optimizePortfolio(
        currentHoldings,
        riskTolerance,
        investmentGoal
      );

      // Store in database
      const optimizationId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(aiPortfolioOptimizations).values({
        optimizationId,
        userId,
        currentAllocation: optimization.current_allocation,
        recommendedAllocation: optimization.recommended_allocation,
        expectedReturn: optimization.expected_return.toString(),
        riskScore: optimization.risk_score,
        reasoning: optimization.reasoning,
        actions: optimization.actions,
        riskTolerance,
        investmentGoal,
      });

      res.json({
        success: true,
        optimization: {
          id: optimizationId,
          current_allocation: optimization.current_allocation,
          recommended_allocation: optimization.recommended_allocation,
          expected_return: optimization.expected_return,
          risk_score: optimization.risk_score,
          reasoning: optimization.reasoning,
          actions: optimization.actions,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Portfolio optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize portfolio' });
    }
  });

  // Natural Language Command Processing
  app.post('/api/ai/commands/parse', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const validation = naturalLanguageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { command } = validation.data;

      // Parse natural language command
      const parsedCommand = await aiTradingService.parseNaturalLanguageCommand(command, userId);

      // Store command in database
      const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(aiNaturalLanguageCommands).values({
        commandId,
        userId,
        originalCommand: command,
        parsedCommand,
        confidence: parsedCommand.confidence,
      });

      res.json({
        success: true,
        command: {
          id: commandId,
          original: command,
          parsed: parsedCommand,
          confidence: parsedCommand.confidence,
          executable: parsedCommand.confidence >= 70,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Command parsing error:', error);
      res.status(500).json({ message: 'Failed to parse command' });
    }
  });

  // Smart Order Routing Analysis
  app.post('/api/ai/orders/routing', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const validation = smartRoutingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { symbol, side, amount, orderBooks } = validation.data;

      // Analyze optimal execution
      const routing = await aiTradingService.analyzeOptimalExecution(
        symbol,
        side,
        amount,
        orderBooks
      );

      // Store routing analysis
      const routingId = `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(aiOrderRouting).values({
        routingId,
        userId,
        symbol,
        side,
        amount: amount.toString(),
        recommendedStrategy: routing.recommended_strategy,
        executionPlan: routing.execution_plan,
        totalCost: routing.total_cost?.toString(),
        priceImprovement: routing.price_improvement?.toString(),
        reasoning: routing.reasoning,
        orderBooksAnalyzed: orderBooks,
      });

      res.json({
        success: true,
        routing: {
          id: routingId,
          recommended_strategy: routing.recommended_strategy,
          execution_plan: routing.execution_plan,
          total_cost: routing.total_cost,
          price_improvement: routing.price_improvement,
          reasoning: routing.reasoning,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Order routing error:', error);
      res.status(500).json({ message: 'Failed to analyze order routing' });
    }
  });

  // Risk Assessment
  app.post('/api/ai/risk/assess', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const validation = riskAssessmentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { portfolio, proposedTrade, marketConditions } = validation.data;

      // Assess trading risk
      const assessment = await aiTradingService.assessTradingRisk(
        portfolio,
        proposedTrade,
        marketConditions
      );

      // Store risk assessment
      const assessmentId = `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(aiRiskAssessments).values({
        assessmentId,
        userId,
        portfolioSnapshot: portfolio,
        proposedTrade,
        marketConditions,
        riskScore: assessment.risk_score,
        riskFactors: assessment.risk_factors,
        recommendations: assessment.recommendations,
        positionSizeSuggestion: assessment.position_size_suggestion?.toString(),
        maxLossEstimate: assessment.max_loss_estimate?.toString(),
      });

      res.json({
        success: true,
        assessment: {
          id: assessmentId,
          risk_score: assessment.risk_score,
          risk_factors: assessment.risk_factors,
          recommendations: assessment.recommendations,
          position_size_suggestion: assessment.position_size_suggestion,
          max_loss_estimate: assessment.max_loss_estimate,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Risk assessment error:', error);
      res.status(500).json({ message: 'Failed to assess trading risk' });
    }
  });

  // Get/Update User AI Preferences
  app.get('/api/ai/preferences', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;

      const [preferences] = await db.select()
        .from(aiUserPreferences)
        .where(eq(aiUserPreferences.userId, userId));

      res.json({
        success: true,
        preferences: preferences || {
          enabled_features: [],
          risk_tolerance: 'moderate',
          trading_style: 'balanced',
          confidence_threshold: 70,
          learning_mode: true,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Get preferences error:', error);
      res.status(500).json({ message: 'Failed to retrieve AI preferences' });
    }
  });

  app.put('/api/ai/preferences', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const validation = insertAIUserPreferencesSchema.omit({ 
        id: true, 
        userId: true, 
        createdAt: true 
      }).safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid preferences data',
          errors: validation.error.errors 
        });
      }

      const preferences = validation.data;

      // Upsert user preferences
      await db.insert(aiUserPreferences)
        .values({
          userId,
          ...preferences,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: aiUserPreferences.userId,
          set: {
            ...preferences,
            updatedAt: new Date(),
          },
        });

      res.json({
        success: true,
        message: 'AI preferences updated successfully'
      });
    } catch (error) {
      console.error('[AI Trading] Update preferences error:', error);
      res.status(500).json({ message: 'Failed to update AI preferences' });
    }
  });

  // Get Latest Market Analysis
  app.get('/api/ai/market/analysis/latest', async (req, res) => {
    try {
      const [latestAnalysis] = await db.select()
        .from(aiMarketAnalysis)
        .orderBy(desc(aiMarketAnalysis.createdAt))
        .limit(1);

      if (!latestAnalysis) {
        return res.json({
          success: true,
          analysis: null,
          message: 'No market analysis available'
        });
      }

      res.json({
        success: true,
        analysis: {
          id: latestAnalysis.analysisId,
          market_sentiment: latestAnalysis.marketSentiment,
          confidence: latestAnalysis.confidence,
          key_factors: latestAnalysis.keyFactors,
          risk_assessment: latestAnalysis.riskAssessment,
          predictions: latestAnalysis.predictions,
          created_at: latestAnalysis.createdAt,
        }
      });
    } catch (error) {
      console.error('[AI Trading] Get latest analysis error:', error);
      res.status(500).json({ message: 'Failed to retrieve latest market analysis' });
    }
  });

  // Execute Natural Language Command
  app.post('/api/ai/commands/execute/:commandId', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { commandId } = req.params;

      // Get command from database
      const [command] = await db.select()
        .from(aiNaturalLanguageCommands)
        .where(and(
          eq(aiNaturalLanguageCommands.commandId, commandId),
          eq(aiNaturalLanguageCommands.userId, userId)
        ));

      if (!command) {
        return res.status(404).json({ message: 'Command not found' });
      }

      if (command.status !== 'pending') {
        return res.status(400).json({ message: 'Command already executed or failed' });
      }

      // Execute the command based on parsed data
      const parsedCommand = command.parsedCommand as any;
      let executionResult: any = {};

      try {
        switch (parsedCommand.action) {
          case 'buy':
          case 'sell':
            // In a real implementation, this would execute the trade
            executionResult = {
              message: `${parsedCommand.action.toUpperCase()} order simulation`,
              symbol: parsedCommand.symbol,
              amount: parsedCommand.amount,
              type: parsedCommand.type,
              simulated: true,
            };
            break;
          
          case 'set_alert':
            // In a real implementation, this would create a price alert
            executionResult = {
              message: 'Price alert simulation created',
              symbol: parsedCommand.symbol,
              conditions: parsedCommand.conditions,
              simulated: true,
            };
            break;
          
          default:
            throw new Error(`Unsupported command action: ${parsedCommand.action}`);
        }

        // Update command status
        await db.update(aiNaturalLanguageCommands)
          .set({
            status: 'executed',
            executionResult,
            executedAt: new Date(),
          })
          .where(eq(aiNaturalLanguageCommands.commandId, commandId));

        res.json({
          success: true,
          result: executionResult,
          message: 'Command executed successfully'
        });

      } catch (executionError) {
        // Update command with error
        await db.update(aiNaturalLanguageCommands)
          .set({
            status: 'failed',
            errorMessage: executionError.message,
          })
          .where(eq(aiNaturalLanguageCommands.commandId, commandId));

        res.status(500).json({
          success: false,
          message: 'Command execution failed',
          error: executionError.message
        });
      }

    } catch (error) {
      console.error('[AI Trading] Execute command error:', error);
      res.status(500).json({ message: 'Failed to execute command' });
    }
  });

  // Helper function to enhance market data with real-time prices
  async function enhanceMarketDataWithRealTimePrices(symbol: string, providedMarketData: any): Promise<any> {
    try {
      // Get current real-time price data
      const currentMarketData = await marketDataService.getMarketDataBySymbol(symbol);
      const realTimePrice = await hyperliquidMarketDataService.getCurrentPrice(symbol);
      
      if (!currentMarketData && !realTimePrice) {
        console.warn(`[AI Trading] No real-time data available for ${symbol}, using provided data`);
        return providedMarketData;
      }

      // Merge provided data with real-time data, prioritizing real-time prices
      const enhancedData = {
        ...providedMarketData,
        price: realTimePrice ? parseFloat(realTimePrice) : parseFloat(currentMarketData?.price || providedMarketData.price),
        change24h: currentMarketData?.change24h ? parseFloat(currentMarketData.change24h) : providedMarketData.change24h,
        volume: currentMarketData?.volume24h ? parseFloat(currentMarketData.volume24h) : providedMarketData.volume,
        high24h: currentMarketData?.high24h ? parseFloat(currentMarketData.high24h) : providedMarketData.high24h,
        low24h: currentMarketData?.low24h ? parseFloat(currentMarketData.low24h) : providedMarketData.low24h,
        marketCap: currentMarketData?.marketCap ? parseFloat(currentMarketData.marketCap) : providedMarketData.marketCap,
        // Keep technical indicators from provided data if available
        rsi: providedMarketData.rsi,
        macd: providedMarketData.macd,
        ma20: providedMarketData.ma20,
        ma50: providedMarketData.ma50,
        support: providedMarketData.support,
        resistance: providedMarketData.resistance,
        // Add timestamp to show when data was enhanced
        dataSource: 'real-time-enhanced',
        enhancedAt: new Date().toISOString()
      };

      console.log(`[AI Trading] Enhanced market data for ${symbol}:`, {
        originalPrice: providedMarketData.price,
        realTimePrice: realTimePrice,
        enhancedPrice: enhancedData.price
      });

      return enhancedData;
    } catch (error) {
      console.error(`[AI Trading] Error enhancing market data for ${symbol}:`, error);
      // Fallback to provided data if enhancement fails
      return providedMarketData;
    }
  }

  console.log('[AI Trading Routes] AI Trading routes registered successfully');
}
