import type { Express } from "express";

export function registerAIChatRoutes(app: Express) {
  // AI Trading Chat endpoint with fallback responses
  app.post('/api/ai-trading/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({
          response: "Please provide a message.",
          type: "general"
        });
      }

      // Smart responses based on message content
      let response = "";
      let messageType = "general";
      let confidence = 85;

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc")) {
        response = `Regarding Bitcoin: Based on current market analysis, BTC shows strong fundamentals. The recent price action suggests consolidation above key support levels. Consider dollar-cost averaging for long-term positions. Risk level: Medium. Always manage your position sizes carefully.`;
        messageType = "analysis";
        confidence = 87;
      } else if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth")) {
        response = `Ethereum analysis: ETH demonstrates solid network growth with increasing DeFi adoption. The transition to Proof-of-Stake has improved energy efficiency. Current technical indicators suggest potential for continued growth. Consider the upcoming network upgrades in your strategy.`;
        messageType = "analysis";
        confidence = 82;
      } else if (lowerMessage.includes("portfolio") || lowerMessage.includes("diversification")) {
        response = `Portfolio recommendation: Diversification is key to risk management. Consider allocating 40-50% to major assets (BTC/ETH), 30-40% to established altcoins, and 10-20% to emerging opportunities. Rebalance quarterly and never invest more than you can afford to lose.`;
        messageType = "recommendation";
        confidence = 90;
      } else if (lowerMessage.includes("risk") || lowerMessage.includes("safe")) {
        response = `Risk assessment: Cryptocurrency markets are highly volatile. Key risk management strategies: 1) Set stop-losses, 2) Diversify across assets, 3) Use position sizing (never more than 5% per trade), 4) Keep emergency funds in stable assets. Risk level varies by market conditions.`;
        messageType = "alert";
        confidence = 95;
      } else if (lowerMessage.includes("buy") || lowerMessage.includes("sell") || lowerMessage.includes("trade")) {
        response = `Trading guidance: Before any trade, analyze: 1) Market sentiment, 2) Technical indicators (RSI, MACD), 3) Support/resistance levels, 4) Volume patterns. Start with small positions and scale up with experience. Consider market timing and your risk tolerance.`;
        messageType = "recommendation";
        confidence = 78;
      } else if (lowerMessage.includes("market") || lowerMessage.includes("trend")) {
        response = `Market insight: Current crypto markets show mixed signals. Monitor key indicators: trading volume, institutional adoption, regulatory news, and macro-economic factors. Bull markets can turn quickly, so maintain disciplined risk management.`;
        messageType = "analysis";
        confidence = 83;
      } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("help")) {
        response = `Hello! I'm your AI Trading Assistant. I can help you with market analysis, trading strategies, portfolio management, and risk assessment. What specific aspect of crypto trading would you like to discuss?`;
        messageType = "general";
        confidence = 100;
      } else {
        response = `Thank you for your question about "${message}". Based on current market conditions, I recommend staying informed about market trends, practicing proper risk management, and considering your investment timeline. Would you like specific analysis on any particular cryptocurrency or trading strategy?`;
        messageType = "general";
        confidence = 75;
      }

      res.json({
        response: response,
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
}