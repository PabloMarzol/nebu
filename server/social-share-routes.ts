import { Router } from "express";
import { z } from "zod";

const router = Router();

// Insight schemas
const InsightSchema = z.object({
  id: z.string(),
  type: z.enum(["prediction", "analysis", "achievement", "portfolio", "trade", "strategy"]),
  title: z.string(),
  data: z.any(),
  timestamp: z.string(),
  performance: z.object({
    roi: z.number(),
    accuracy: z.number(),
    winRate: z.number()
  }).optional(),
  social: z.object({
    shares: z.number(),
    likes: z.number(),
    comments: z.number()
  }).optional()
});

interface Insight {
  id: string;
  type: "prediction" | "analysis" | "achievement" | "portfolio" | "trade" | "strategy";
  title: string;
  data: any;
  timestamp: string;
  performance?: {
    roi: number;
    accuracy: number;
    winRate: number;
  };
  social: {
    shares: number;
    likes: number;
    comments: number;
  };
}

const ShareRequestSchema = z.object({
  insightId: z.string(),
  platform: z.string(),
  customText: z.string().optional(),
  hashtags: z.string().optional(),
  templateId: z.string().optional()
});

// In-memory storage for demo purposes
let insights: Insight[] = [
  {
    id: "btc-breakout",
    type: "trade",
    title: "Bitcoin Breakout Trade",
    data: {
      symbol: "BTC",
      entry: 42500,
      exit: 45200,
      profit: 2700,
      percentage: 6.35,
      timeframe: "4H",
      strategy: "Breakout"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    performance: { roi: 6.35, accuracy: 87, winRate: 73 },
    social: { shares: 24, likes: 89, comments: 12 }
  },
  {
    id: "eth-prediction",
    type: "prediction",
    title: "Ethereum Price Prediction",
    data: {
      symbol: "ETH",
      currentPrice: 2340,
      prediction: 2650,
      confidence: 82,
      timeframe: "7 days",
      catalysts: ["ETF approval", "Staking rewards", "DeFi growth"]
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    performance: { roi: 13.2, accuracy: 78, winRate: 68 },
    social: { shares: 45, likes: 156, comments: 23 }
  },
  {
    id: "portfolio-milestone",
    type: "achievement",
    title: "Portfolio Milestone Reached",
    data: {
      milestone: "100K",
      totalValue: 102500,
      growth: 18750,
      growthPercentage: 22.4,
      timeframe: "6 months",
      topPerformer: "SOL",
      topGain: 145.3
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    performance: { roi: 22.4, accuracy: 0, winRate: 0 },
    social: { shares: 67, likes: 234, comments: 45 }
  },
  {
    id: "defi-strategy",
    type: "strategy",
    title: "DeFi Yield Strategy",
    data: {
      protocol: "Aave",
      asset: "USDC",
      apy: 12.5,
      amount: 50000,
      expectedReturn: 6250,
      riskLevel: "Low",
      duration: "3 months"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    performance: { roi: 12.5, accuracy: 92, winRate: 85 },
    social: { shares: 31, likes: 98, comments: 18 }
  }
];

let shareAnalytics = {
  totalShares: 0,
  platformBreakdown: {
    twitter: 0,
    linkedin: 0,
    facebook: 0,
    telegram: 0,
    discord: 0,
    instagram: 0
  } as Record<string, number>,
  engagementRates: {
    twitter: 8.7,
    linkedin: 6.4,
    facebook: 4.2,
    telegram: 12.3,
    discord: 15.6,
    instagram: 9.8
  },
  topPerformingInsights: [] as any[],
  recentShares: [] as any[]
};

// Get all insights
router.get("/insights", (req, res) => {
  res.json(insights);
});

// Get specific insight
router.get("/insights/:id", (req, res) => {
  const insight = insights.find(i => i.id === req.params.id);
  if (!insight) {
    return res.status(404).json({ error: "Insight not found" });
  }
  res.json(insight);
});

// Create new insight
router.post("/insights", (req, res) => {
  try {
    const validatedData = InsightSchema.parse(req.body);
    const newInsight: Insight = {
      id: `insight-${Date.now()}`,
      type: validatedData.type,
      title: validatedData.title,
      data: validatedData.data || {},
      timestamp: new Date().toISOString(),
      performance: validatedData.performance,
      social: { shares: 0, likes: 0, comments: 0 }
    };
    insights.push(newInsight);
    res.status(201).json(newInsight);
  } catch (error) {
    res.status(400).json({ error: "Invalid insight data" });
  }
});

// Generate share content
router.post("/generate-share", (req, res) => {
  try {
    const { insightId, platform, customText, hashtags, templateId } = ShareRequestSchema.parse(req.body);
    
    const insight = insights.find(i => i.id === insightId);
    if (!insight) {
      return res.status(404).json({ error: "Insight not found" });
    }

    const baseHashtags = hashtags || "#crypto #trading #nebulax";
    const customMessage = customText || "";
    
    let content = "";
    let imageUrl = "";
    
    // Generate platform-specific content
    if (insight.type === 'trade' && insight.data) {
      content = `💰 Successful ${insight.data.symbol || 'Crypto'} Trade!\n\n` +
                `Entry: $${insight.data.entry?.toLocaleString() || 'N/A'}\n` +
                `Exit: $${insight.data.exit?.toLocaleString() || 'N/A'}\n` +
                `Profit: +${insight.data.percentage || 0}% ($${insight.data.profit?.toLocaleString() || 'N/A'})\n` +
                `Strategy: ${insight.data.strategy || 'Manual'}\n\n` +
                `${customMessage ? customMessage + '\n\n' : ''}` +
                `${baseHashtags}`;
    } else if (insight.type === 'prediction' && insight.data) {
      content = `🎯 ${insight.data.symbol || 'Crypto'} Price Prediction\n\n` +
                `Current: $${insight.data.currentPrice?.toLocaleString() || 'N/A'}\n` +
                `Target: $${insight.data.prediction?.toLocaleString() || 'N/A'}\n` +
                `Confidence: ${insight.data.confidence || 0}%\n` +
                `Timeframe: ${insight.data.timeframe || 'TBD'}\n\n` +
                `${customMessage ? customMessage + '\n\n' : ''}` +
                `${baseHashtags}`;
    } else if (insight.type === 'achievement' && insight.data) {
      content = `🏆 Portfolio Milestone Alert!\n\n` +
                `Just reached $${insight.data.milestone || '0'} in portfolio value!\n` +
                `Current Value: $${insight.data.totalValue?.toLocaleString() || 'N/A'}\n` +
                `Growth: +${insight.data.growthPercentage || 0}% in ${insight.data.timeframe || 'period'}\n` +
                `Top Performer: ${insight.data.topPerformer || 'N/A'} (+${insight.data.topGain || 0}%)\n\n` +
                `${customMessage ? customMessage + '\n\n' : ''}` +
                `${baseHashtags}`;
    } else if (insight.type === 'strategy' && insight.data) {
      content = `🧠 DeFi Strategy Update\n\n` +
                `Protocol: ${insight.data.protocol || 'N/A'}\n` +
                `Asset: ${insight.data.asset || 'N/A'}\n` +
                `APY: ${insight.data.apy || 0}%\n` +
                `Amount: $${insight.data.amount?.toLocaleString() || 'N/A'}\n` +
                `Expected Return: $${insight.data.expectedReturn?.toLocaleString() || 'N/A'}\n` +
                `Risk Level: ${insight.data.riskLevel || 'Unknown'}\n\n` +
                `${customMessage ? customMessage + '\n\n' : ''}` +
                `${baseHashtags}`;
    } else {
      content = `📊 ${insight.title}\n\n${customMessage ? customMessage + '\n\n' : ''}${baseHashtags}`;
    }

    // Generate image URL (placeholder for now)
    imageUrl = `/api/social-share/generate-image/${insightId}?template=${templateId}&platform=${platform}`;

    res.json({
      content,
      imageUrl,
      platform,
      insight: {
        id: insight.id,
        title: insight.title,
        type: insight.type
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid share request" });
  }
});

// Track share action
router.post("/track-share", (req, res) => {
  try {
    const { insightId, platform, action } = req.body;
    
    const insight = insights.find(i => i.id === insightId);
    if (!insight) {
      return res.status(404).json({ error: "Insight not found" });
    }

    // Update insight social stats
    if (action === 'share') {
      insight.social.shares += 1;
      shareAnalytics.totalShares += 1;
      shareAnalytics.platformBreakdown[platform] += 1;
      
      // Add to recent shares
      shareAnalytics.recentShares.unshift({
        insightId,
        platform,
        timestamp: new Date().toISOString(),
        title: insight.title,
        type: insight.type
      });
      
      // Keep only last 50 shares
      if (shareAnalytics.recentShares.length > 50) {
        shareAnalytics.recentShares = shareAnalytics.recentShares.slice(0, 50);
      }
    } else if (action === 'like') {
      insight.social.likes += 1;
    } else if (action === 'comment') {
      insight.social.comments += 1;
    }

    res.json({ success: true, updatedStats: insight.social });
  } catch (error) {
    res.status(400).json({ error: "Invalid tracking request" });
  }
});

// Get share analytics
router.get("/analytics", (req, res) => {
  // Calculate top performing insights
  const topInsights = insights
    .sort((a, b) => (b.social.shares + b.social.likes * 0.5) - (a.social.shares + a.social.likes * 0.5))
    .slice(0, 10)
    .map(insight => ({
      id: insight.id,
      title: insight.title,
      type: insight.type,
      shares: insight.social.shares,
      likes: insight.social.likes,
      comments: insight.social.comments,
      score: insight.social.shares + insight.social.likes * 0.5
    }));

  shareAnalytics.topPerformingInsights = topInsights;

  // Calculate overall engagement rate
  const totalShares = shareAnalytics.totalShares;
  const totalLikes = insights.reduce((sum, i) => sum + i.social.likes, 0);
  const totalComments = insights.reduce((sum, i) => sum + i.social.comments, 0);
  const engagementRate = totalShares > 0 ? ((totalLikes + totalComments) / totalShares) * 100 : 0;

  res.json({
    ...shareAnalytics,
    engagementRate: Math.round(engagementRate * 10) / 10,
    totalLikes,
    totalComments,
    averageSharesPerInsight: Math.round((totalShares / insights.length) * 10) / 10
  });
});

// Get share templates
router.get("/templates", (req, res) => {
  const templates = [
    {
      id: "twitter-post",
      name: "Twitter Post",
      platform: "Twitter",
      format: "image",
      dimensions: { width: 1200, height: 675 },
      description: "Perfect for sharing quick insights and trade updates"
    },
    {
      id: "instagram-story",
      name: "Instagram Story",
      platform: "Instagram",
      format: "image",
      dimensions: { width: 1080, height: 1920 },
      description: "Vertical format for Instagram stories"
    },
    {
      id: "linkedin-post",
      name: "LinkedIn Post",
      platform: "LinkedIn",
      format: "image",
      dimensions: { width: 1200, height: 627 },
      description: "Professional format for LinkedIn sharing"
    },
    {
      id: "facebook-post",
      name: "Facebook Post",
      platform: "Facebook",
      format: "image",
      dimensions: { width: 1200, height: 630 },
      description: "Optimized for Facebook timeline"
    },
    {
      id: "discord-embed",
      name: "Discord Embed",
      platform: "Discord",
      format: "text",
      dimensions: { width: 400, height: 300 },
      description: "Rich embed format for Discord channels"
    },
    {
      id: "telegram-message",
      name: "Telegram Message",
      platform: "Telegram",
      format: "text",
      dimensions: { width: 600, height: 400 },
      description: "Formatted message for Telegram groups"
    }
  ];
  
  res.json(templates);
});

// Generate image endpoint (placeholder)
router.get("/generate-image/:insightId", (req, res) => {
  const { insightId } = req.params;
  const { template, platform } = req.query;
  
  const insight = insights.find(i => i.id === insightId);
  if (!insight) {
    return res.status(404).json({ error: "Insight not found" });
  }

  // This would generate an actual image in production
  // For now, return a placeholder URL
  res.json({
    imageUrl: `https://via.placeholder.com/1200x675/1a1a2e/ffffff?text=${encodeURIComponent(insight.title)}`,
    template,
    platform,
    insight: {
      id: insight.id,
      title: insight.title,
      type: insight.type
    }
  });
});

// Bulk operations
router.post("/bulk-share", (req, res) => {
  try {
    const { insightIds, platforms, customText, hashtags } = req.body;
    
    const results = [];
    
    for (const insightId of insightIds) {
      const insight = insights.find(i => i.id === insightId);
      if (!insight) continue;
      
      for (const platform of platforms) {
        // Generate content for each platform
        const shareContent = {
          insightId,
          platform,
          content: `Bulk share for ${insight.title} on ${platform}`,
          timestamp: new Date().toISOString()
        };
        
        results.push(shareContent);
        
        // Track the share
        insight.social.shares += 1;
        shareAnalytics.totalShares += 1;
        shareAnalytics.platformBreakdown[platform] += 1;
      }
    }
    
    res.json({
      success: true,
      sharedCount: results.length,
      results
    });
  } catch (error) {
    res.status(400).json({ error: "Bulk share operation failed" });
  }
});

export default router;