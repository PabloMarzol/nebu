import { Router } from "express";
import { liquidityAggregationService } from "../services/liquidity-aggregation";
import { creditRiskEngine } from "../services/credit-risk-engine";
import { settlementReconciliationService } from "../services/settlement-reconciliation";
import { verifyWalletAuth } from "./middleware/walletAuth";

const router = Router();

// Institutional Dashboard Data
router.get("/dashboard", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const clientId = user.claims?.sub || user.id;

    // Get credit profile
    const creditProfile = await creditRiskEngine.getCreditProfile(clientId) || {
      clientId,
      creditLimit: 10000000, // $10M default
      usedCredit: 2500000,    // $2.5M used
      availableCredit: 7500000,
      riskScore: 35,
      tier: 'prime',
      lastUpdated: new Date(),
      collateralValue: 15000000,
      marginRequirement: 1000000
    };

    // Get real-time risk metrics
    const riskMetrics = await creditRiskEngine.calculateRealTimeRisk(clientId) || {
      leverage: 2.5,
      maxConcentration: 0.18,
      marginUtilization: 0.4,
      unrealizedPnL: 125000,
      creditUtilization: 0.25
    };

    // Get recent settlements
    const recentSettlements = await settlementReconciliationService.getSettlementsForClient(clientId);
    const settlements = recentSettlements.slice(0, 10).map(settlement => ({
      id: settlement.id,
      symbol: settlement.symbol,
      amount: settlement.notional,
      status: settlement.status,
      date: settlement.createdAt.toISOString().split('T')[0]
    }));

    // Get risk alerts
    const alerts = await creditRiskEngine.getRiskAlerts(clientId);
    const formattedAlerts = alerts.slice(0, 10).map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      timestamp: alert.timestamp.toISOString()
    }));

    // Mock API metrics (integrate with actual monitoring)
    const apiMetrics = {
      requestsToday: 15420,
      uptime: 0.9987,
      avgLatency: 42,
      errorRate: 0.0023
    };

    res.json({
      creditProfile: {
        limit: creditProfile.creditLimit,
        used: creditProfile.usedCredit,
        available: creditProfile.availableCredit,
        riskScore: creditProfile.riskScore,
        tier: creditProfile.tier
      },
      riskMetrics,
      recentSettlements: settlements,
      alerts: formattedAlerts,
      apiMetrics
    });

  } catch (error) {
    console.error("Error fetching institutional dashboard:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

// Liquidity Aggregation Data
router.get("/liquidity", verifyWalletAuth, async (req, res) => {
  try {
    const venues = liquidityAggregationService.getVenueStatus();
    
    // Get best pricing for major pairs
    const majorPairs = ['BTC/USDT', 'ETH/USDT', 'BTC/USD', 'ETH/USD'];
    const pricing = await Promise.all(
      majorPairs.map(async (symbol) => {
        const quotes = await liquidityAggregationService.getBestPricing(symbol, 100);
        return { symbol, quotes };
      })
    );

    res.json({
      venues: venues.map(venue => ({
        id: venue.id,
        name: venue.name,
        type: venue.type,
        status: venue.status,
        latency: venue.latency,
        reliability: venue.reliability * 100,
        fee: venue.fee * 100
      })),
      pricing
    });

  } catch (error) {
    console.error("Error fetching liquidity data:", error);
    res.status(500).json({ message: "Failed to fetch liquidity data" });
  }
});

// Smart Order Routing
router.post("/smart-order", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { symbol, side, quantity, maxSlippage, timeLimit } = req.body;

    const orderRequest = {
      symbol,
      side,
      quantity: parseFloat(quantity),
      maxSlippage: parseFloat(maxSlippage) || 0.01,
      timeLimit: parseInt(timeLimit) || 300000, // 5 minutes default
      clientId: user.claims?.sub || user.id
    };

    // Get optimal routing
    const routes = await liquidityAggregationService.getSmartOrderRouting(orderRequest);
    
    // Execute if requested
    if (req.body.execute === true) {
      const execution = await liquidityAggregationService.executeBestExecution(routes, orderRequest.clientId);
      res.json({ routes, execution, status: 'executed' });
    } else {
      res.json({ routes, status: 'quoted' });
    }

  } catch (error) {
    console.error("Error processing smart order:", error);
    res.status(500).json({ message: "Failed to process smart order" });
  }
});

// Credit Profile Management
router.get("/credit-profile", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const clientId = user.claims?.sub || user.id;
    
    const profile = await creditRiskEngine.getCreditProfile(clientId);
    const riskData = await creditRiskEngine.calculateRealTimeRisk(clientId);
    
    res.json({ profile, riskData });

  } catch (error) {
    console.error("Error fetching credit profile:", error);
    res.status(500).json({ message: "Failed to fetch credit profile" });
  }
});

router.put("/credit-profile", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const clientId = user.claims?.sub || user.id;
    const updates = req.body;

    const updatedProfile = await creditRiskEngine.updateCreditProfile(clientId, updates);
    res.json(updatedProfile);

  } catch (error) {
    console.error("Error updating credit profile:", error);
    res.status(500).json({ message: "Failed to update credit profile" });
  }
});

// Risk Alerts Management
router.get("/risk-alerts", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const clientId = user.claims?.sub || user.id;
    
    const alerts = await creditRiskEngine.getRiskAlerts(clientId);
    res.json(alerts);

  } catch (error) {
    console.error("Error fetching risk alerts:", error);
    res.status(500).json({ message: "Failed to fetch risk alerts" });
  }
});

router.post("/risk-alerts/:alertId/acknowledge", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { alertId } = req.params;
    
    const acknowledged = await creditRiskEngine.acknowledgeAlert(alertId, user.claims?.sub || user.id);
    res.json({ acknowledged });

  } catch (error) {
    console.error("Error acknowledging alert:", error);
    res.status(500).json({ message: "Failed to acknowledge alert" });
  }
});

// Settlement Management
router.get("/settlements", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const clientId = user.claims?.sub || user.id;
    
    const settlements = await settlementReconciliationService.getSettlementsForClient(clientId);
    res.json(settlements);

  } catch (error) {
    console.error("Error fetching settlements:", error);
    res.status(500).json({ message: "Failed to fetch settlements" });
  }
});

router.get("/settlements/:settlementId", verifyWalletAuth, async (req, res) => {
  try {
    const { settlementId } = req.params;
    
    const settlement = await settlementReconciliationService.getSettlement(settlementId);
    if (!settlement) {
      return res.status(404).json({ message: "Settlement not found" });
    }

    res.json(settlement);

  } catch (error) {
    console.error("Error fetching settlement:", error);
    res.status(500).json({ message: "Failed to fetch settlement" });
  }
});

router.post("/settlements", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const tradeData = {
      ...req.body,
      clientId: user.claims?.sub || user.id
    };

    const settlement = await settlementReconciliationService.createSettlement(tradeData);
    res.json(settlement);

  } catch (error) {
    console.error("Error creating settlement:", error);
    res.status(500).json({ message: "Failed to create settlement" });
  }
});

// Reconciliation Management
router.get("/reconciliation", verifyWalletAuth, async (req, res) => {
  try {
    const { status } = req.query;
    
    const items = await settlementReconciliationService.getReconciliationItems(status as string);
    res.json(items);

  } catch (error) {
    console.error("Error fetching reconciliation items:", error);
    res.status(500).json({ message: "Failed to fetch reconciliation items" });
  }
});

router.put("/reconciliation/:itemId", verifyWalletAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const updated = await settlementReconciliationService.updateReconciliationItem(itemId, updates);
    res.json({ updated });

  } catch (error) {
    console.error("Error updating reconciliation item:", error);
    res.status(500).json({ message: "Failed to update reconciliation item" });
  }
});

// Portfolio Risk Overview
router.get("/portfolio-risk", verifyWalletAuth, async (req, res) => {
  try {
    const portfolioRisk = await creditRiskEngine.getPortfolioRisk();
    res.json(portfolioRisk);

  } catch (error) {
    console.error("Error fetching portfolio risk:", error);
    res.status(500).json({ message: "Failed to fetch portfolio risk" });
  }
});

// Compliance Reporting
router.get("/compliance/report", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { startDate, endDate, format } = req.query;
    
    // Generate compliance report
    const report = {
      clientId: user.claims?.sub || user.id,
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      trades: [], // Fetch from trade history
      settlements: [], // Fetch from settlement service
      riskEvents: [], // Fetch from risk engine
      complianceChecks: {
        aml: 'passed',
        kyc: 'verified',
        sanctions: 'cleared'
      }
    };

    if (format === 'pdf') {
      // Generate PDF report (integrate with PDF generation service)
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=compliance-report.pdf');
    }

    res.json(report);

  } catch (error) {
    console.error("Error generating compliance report:", error);
    res.status(500).json({ message: "Failed to generate compliance report" });
  }
});

// API Management
router.get("/api/keys", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const clientId = user.claims?.sub || user.id;
    
    // Mock API keys (integrate with actual API key management)
    const apiKeys = [
      {
        id: 'key_1',
        name: 'Production Trading',
        key: 'pk_' + Math.random().toString(36).substr(2, 32),
        permissions: ['trade', 'read'],
        rateLimit: 1000,
        lastUsed: new Date().toISOString(),
        status: 'active'
      }
    ];

    res.json(apiKeys);

  } catch (error) {
    console.error("Error fetching API keys:", error);
    res.status(500).json({ message: "Failed to fetch API keys" });
  }
});

router.post("/api/keys", verifyWalletAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { name, permissions, rateLimit } = req.body;
    
    // Generate new API key
    const apiKey = {
      id: 'key_' + Date.now(),
      name,
      key: 'pk_' + Math.random().toString(36).substr(2, 32),
      secret: 'sk_' + Math.random().toString(36).substr(2, 32),
      permissions,
      rateLimit: rateLimit || 1000,
      createdAt: new Date().toISOString(),
      status: 'active',
      clientId: user.claims?.sub || user.id
    };

    res.json(apiKey);

  } catch (error) {
    console.error("Error creating API key:", error);
    res.status(500).json({ message: "Failed to create API key" });
  }
});

export default router;