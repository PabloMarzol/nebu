import type { Express } from "express";

export function registerExchangeOpsRoutes(app: Express) {
  console.log('[ExchangeOps] Registering Exchange Operations routes...');

  // Exchange Operations Dashboard endpoint
  app.get('/api/exchange-ops/dashboard', async (req, res) => {
    console.log('[DEBUG] Exchange Operations Dashboard endpoint called');
    try {
      const dashboardData = {
        liquidity: {
          totalProviders: 12,
          activeProviders: 10,
          totalLiquidity: "145000000.00",
          averageSpread: 0.0007,
          uptimeAverage: 99.85,
          alerts: { lowLiquidity: 2, highSpread: 1, providerOffline: 0 }
        },
        compliance: {
          pendingReviews: 15,
          completedReviews: 142,
          flaggedTransactions: 8,
          averageReviewTime: 4.2
        },
        institutional: {
          totalClients: 45,
          activeClients: 38,
          totalVolume30d: "890000000.00",
          averageTradeSize: "1250000.00"
        },
        treasury: {
          totalBalance: { BTC: "2576.25", ETH: "15420.75", USDT: "12500000.00" },
          hotWalletRatio: 0.15,
          coldStorageRatio: 0.85,
          alerts: { lowBalance: 1, highOutflow: 0, reconciliationFailed: 0 }
        },
        risk: {
          overallRiskScore: 2.3,
          activeEvents: { critical: 0, high: 2, medium: 5, low: 12 }
        },
        operations: {
          systemUptime: 99.98,
          activeIncidents: 1,
          resolvedIncidents: 23,
          averageResolutionTime: 2.8
        }
      };
      console.log('[DEBUG] Dashboard data prepared successfully');
      res.json(dashboardData);
    } catch (error) {
      console.error('Error in exchange-ops dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Exchange Operations Alerts endpoint
  app.get('/api/exchange-ops/alerts', async (req, res) => {
    console.log('[DEBUG] Exchange Operations Alerts endpoint called');
    try {
      const alertsData = {
        critical: [
          { id: 1, module: 'operations', message: 'API latency spike detected', timestamp: new Date().toISOString() }
        ],
        high: [
          { id: 2, module: 'liquidity', message: 'Low liquidity on BTC/USDT', timestamp: new Date().toISOString() },
          { id: 3, module: 'compliance', message: 'Pending KYC reviews exceeding SLA', timestamp: new Date().toISOString() }
        ],
        medium: [
          { id: 4, module: 'treasury', message: 'Hot wallet threshold reached', timestamp: new Date().toISOString() },
          { id: 5, module: 'risk', message: 'Unusual trading pattern detected', timestamp: new Date().toISOString() }
        ],
        low: [],
        summary: {
          critical: 1,
          high: 2,
          medium: 2,
          low: 0,
          total: 5
        }
      };
      console.log('[DEBUG] Alerts data prepared successfully');
      res.json(alertsData);
    } catch (error) {
      console.error('Error in exchange-ops alerts:', error);
      res.status(500).json({ error: 'Failed to fetch alerts data' });
    }
  });

  // Test endpoint
  app.get('/api/test-exchange-ops', (req, res) => {
    res.json({ message: 'Exchange Operations test endpoint working', timestamp: new Date().toISOString() });
  });

  console.log('[ExchangeOps] Exchange Operations routes registered successfully');
}