import { Router } from 'express';

const router = Router();

// Market volatility endpoint for mood ring feature
router.get('/volatility', async (req, res) => {
  try {
    // Simulate market volatility data based on current market conditions
    // In production, this would connect to real market data feeds
    
    const volatility = Math.random() * 0.3; // 0-30% volatility
    const trend = (Math.random() - 0.5) * 0.2; // -10% to +10% trend
    const timestamp = new Date().toISOString();
    
    // Simulate different market conditions
    const marketConditions = [
      { volatility: 0.02, trend: 0.08, mood: 'bullish' },
      { volatility: 0.25, trend: -0.03, mood: 'volatile' },
      { volatility: 0.01, trend: 0.01, mood: 'calm' },
      { volatility: 0.08, trend: -0.12, mood: 'bearish' },
    ];
    
    const randomCondition = marketConditions[Math.floor(Math.random() * marketConditions.length)];
    
    res.json({
      volatility: randomCondition.volatility,
      trend: randomCondition.trend,
      mood: randomCondition.mood,
      timestamp,
      marketIndicators: {
        fearGreedIndex: Math.floor(Math.random() * 100),
        volumeChange24h: (Math.random() - 0.5) * 0.4,
        dominance: {
          btc: 45 + (Math.random() - 0.5) * 10,
          eth: 18 + (Math.random() - 0.5) * 5,
        }
      }
    });
  } catch (error) {
    console.error('Market volatility API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market volatility data',
      volatility: 0.05, // Fallback neutral values
      trend: 0.01,
      mood: 'neutral'
    });
  }
});

export default router;