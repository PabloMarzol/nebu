import type { Express } from "express";
import { exchangeOperationsStorage } from "./exchange-operations-storage";
import { verifyWalletAuth } from "./middleware/walletAuth";

export function registerExchangeOperationsRoutes(app: Express) {
  console.log("[Exchange Operations] Registering Exchange Operations CRM routes");

  // ======= LIQUIDITY MANAGEMENT ROUTES =======

  // Get all liquidity providers
  app.get("/api/exchange-ops/liquidity/providers", async (req, res) => {
    try {
      const providers = await exchangeOperationsStorage.getLiquidityProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching liquidity providers:", error);
      res.status(500).json({ error: "Failed to fetch liquidity providers" });
    }
  });

  // Get all liquidity pools
  app.get("/api/exchange-ops/liquidity/pools", async (req, res) => {
    try {
      const pools = await exchangeOperationsStorage.getLiquidityPools();
      res.json(pools);
    } catch (error) {
      console.error("Error fetching liquidity pools:", error);
      res.status(500).json({ error: "Failed to fetch liquidity pools" });
    }
  });

  // Get liquidity metrics
  app.get("/api/exchange-ops/liquidity/metrics", async (req, res) => {
    try {
      const metrics = await exchangeOperationsStorage.getLiquidityMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching liquidity metrics:", error);
      res.status(500).json({ error: "Failed to fetch liquidity metrics" });
    }
  });

  // ======= REGULATORY COMPLIANCE ROUTES =======

  // Get compliance monitoring cases
  app.get("/api/exchange-ops/compliance/monitoring", async (req, res) => {
    try {
      const monitoring = await exchangeOperationsStorage.getComplianceMonitoring();
      res.json(monitoring);
    } catch (error) {
      console.error("Error fetching compliance monitoring:", error);
      res.status(500).json({ error: "Failed to fetch compliance monitoring" });
    }
  });

  // Get regulatory reports
  app.get("/api/exchange-ops/compliance/reports", async (req, res) => {
    try {
      const reports = await exchangeOperationsStorage.getRegulatoryReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching regulatory reports:", error);
      res.status(500).json({ error: "Failed to fetch regulatory reports" });
    }
  });

  // Get compliance metrics
  app.get("/api/exchange-ops/compliance/metrics", async (req, res) => {
    try {
      const metrics = await exchangeOperationsStorage.getComplianceMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching compliance metrics:", error);
      res.status(500).json({ error: "Failed to fetch compliance metrics" });
    }
  });

  // ======= INSTITUTIONAL OPERATIONS ROUTES =======

  // Get institutional clients
  app.get("/api/exchange-ops/institutional/clients", async (req, res) => {
    try {
      const clients = await exchangeOperationsStorage.getInstitutionalClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching institutional clients:", error);
      res.status(500).json({ error: "Failed to fetch institutional clients" });
    }
  });

  // Get OTC deals
  app.get("/api/exchange-ops/institutional/otc-deals", async (req, res) => {
    try {
      const deals = await exchangeOperationsStorage.getOtcDeals();
      res.json(deals);
    } catch (error) {
      console.error("Error fetching OTC deals:", error);
      res.status(500).json({ error: "Failed to fetch OTC deals" });
    }
  });

  // Get institutional metrics
  app.get("/api/exchange-ops/institutional/metrics", async (req, res) => {
    try {
      const metrics = await exchangeOperationsStorage.getInstitutionalMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching institutional metrics:", error);
      res.status(500).json({ error: "Failed to fetch institutional metrics" });
    }
  });

  // ======= TREASURY MANAGEMENT ROUTES =======

  // Get treasury accounts
  app.get("/api/exchange-ops/treasury/accounts", async (req, res) => {
    try {
      const accounts = await exchangeOperationsStorage.getTreasuryAccounts();
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching treasury accounts:", error);
      res.status(500).json({ error: "Failed to fetch treasury accounts" });
    }
  });

  // Get treasury transactions
  app.get("/api/exchange-ops/treasury/transactions", async (req, res) => {
    try {
      const transactions = await exchangeOperationsStorage.getTreasuryTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching treasury transactions:", error);
      res.status(500).json({ error: "Failed to fetch treasury transactions" });
    }
  });

  // Get treasury metrics
  app.get("/api/exchange-ops/treasury/metrics", async (req, res) => {
    try {
      const metrics = await exchangeOperationsStorage.getTreasuryMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching treasury metrics:", error);
      res.status(500).json({ error: "Failed to fetch treasury metrics" });
    }
  });

  // ======= RISK MANAGEMENT ROUTES =======

  // Get risk profiles
  app.get("/api/exchange-ops/risk/profiles", async (req, res) => {
    try {
      const profiles = await exchangeOperationsStorage.getRiskProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching risk profiles:", error);
      res.status(500).json({ error: "Failed to fetch risk profiles" });
    }
  });

  // Get risk events
  app.get("/api/exchange-ops/risk/events", async (req, res) => {
    try {
      const events = await exchangeOperationsStorage.getRiskEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching risk events:", error);
      res.status(500).json({ error: "Failed to fetch risk events" });
    }
  });

  // Get risk metrics
  app.get("/api/exchange-ops/risk/metrics", async (req, res) => {
    try {
      const metrics = await exchangeOperationsStorage.getRiskMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching risk metrics:", error);
      res.status(500).json({ error: "Failed to fetch risk metrics" });
    }
  });

  // ======= OPERATIONAL TRACKING ROUTES =======

  // Get operational incidents
  app.get("/api/exchange-ops/operations/incidents", async (req, res) => {
    try {
      const incidents = await exchangeOperationsStorage.getOperationalIncidents();
      res.json(incidents);
    } catch (error) {
      console.error("Error fetching operational incidents:", error);
      res.status(500).json({ error: "Failed to fetch operational incidents" });
    }
  });

  // Get system health
  app.get("/api/exchange-ops/operations/health", async (req, res) => {
    try {
      const health = await exchangeOperationsStorage.getSystemHealth();
      res.json(health);
    } catch (error) {
      console.error("Error fetching system health:", error);
      res.status(500).json({ error: "Failed to fetch system health" });
    }
  });

  // Get operational metrics
  app.get("/api/exchange-ops/operations/metrics", async (req, res) => {
    try {
      const metrics = await exchangeOperationsStorage.getOperationalMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching operational metrics:", error);
      res.status(500).json({ error: "Failed to fetch operational metrics" });
    }
  });

  // ======= CONSOLIDATED DASHBOARD ROUTES =======

  // Get consolidated exchange operations dashboard
  app.get("/api/exchange-ops/dashboard", async (req, res) => {
    try {
      const [
        liquidityMetrics,
        complianceMetrics,
        institutionalMetrics,
        treasuryMetrics,
        riskMetrics,
        operationalMetrics
      ] = await Promise.all([
        exchangeOperationsStorage.getLiquidityMetrics(),
        exchangeOperationsStorage.getComplianceMetrics(),
        exchangeOperationsStorage.getInstitutionalMetrics(),
        exchangeOperationsStorage.getTreasuryMetrics(),
        exchangeOperationsStorage.getRiskMetrics(),
        exchangeOperationsStorage.getOperationalMetrics()
      ]);

      const dashboardData = {
        liquidity: liquidityMetrics,
        compliance: complianceMetrics,
        institutional: institutionalMetrics,
        treasury: treasuryMetrics,
        risk: riskMetrics,
        operations: operationalMetrics,
        summary: {
          totalLiquidity: liquidityMetrics.totalLiquidity,
          activeProviders: liquidityMetrics.activeProviders,
          pendingCompliance: complianceMetrics.pendingReviews,
          activeClients: institutionalMetrics.activeClients,
          systemUptime: operationalMetrics.systemUptime,
          overallRisk: riskMetrics.overallRiskScore
        }
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching exchange operations dashboard:", error);
      res.status(500).json({ error: "Failed to fetch exchange operations dashboard" });
    }
  });

  // ======= ALERTS AND NOTIFICATIONS ROUTES =======

  // Get active alerts across all modules
  app.get("/api/exchange-ops/alerts", async (req, res) => {
    try {
      const alerts = {
        liquidity: {
          lowLiquidity: 2,
          highSpread: 1,
          providerOffline: 0
        },
        compliance: {
          pendingReviews: 15,
          overdueReports: 1,
          flaggedTransactions: 8
        },
        risk: {
          activeEvents: 12,
          limitBreaches: 3,
          concentrationRisk: 5
        },
        treasury: {
          lowBalance: 1,
          reconciliationFailed: 0,
          highOutflow: 0
        },
        operations: {
          activeIncidents: 3,
          degradedServices: 2,
          systemDown: 0
        }
      };

      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  console.log("[Exchange Operations] All Exchange Operations CRM routes registered successfully");
}