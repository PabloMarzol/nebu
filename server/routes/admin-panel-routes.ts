import type { Express } from "express";
import { verifyWalletAuth } from "../middleware/walletAuth";

export function registerAdminPanelRoutes(app: Express) {
  
  // ======= ADMIN PANEL USERS =======
  
  // Get all users for admin panel
  app.get("/api/admin-panel/users", async (req, res) => {
    try {
      const users = [
        {
          id: "1",
          email: "sarah@quantumcap.com",
          firstName: "Sarah",
          lastName: "Chen",
          kycLevel: 3,
          status: "active",
          registrationDate: "2025-01-15T10:00:00Z",
          lastLogin: "2025-07-12T09:30:00Z",
          totalVolume: 2500000,
          riskScore: 15,
          country: "United States"
        },
        {
          id: "2",
          email: "mrodriguez@stellarpartners.com",
          firstName: "Michael",
          lastName: "Rodriguez",
          kycLevel: 2,
          status: "active",
          registrationDate: "2025-03-20T14:30:00Z",
          lastLogin: "2025-07-12T08:15:00Z",
          totalVolume: 850000,
          riskScore: 8,
          country: "Canada"
        },
        {
          id: "3",
          email: "emma@digitalassets.com",
          firstName: "Emma",
          lastName: "Thompson",
          kycLevel: 3,
          status: "active",
          registrationDate: "2024-11-10T11:15:00Z",
          lastLogin: "2025-07-12T07:45:00Z",
          totalVolume: 5200000,
          riskScore: 12,
          country: "United Kingdom"
        }
      ];
      res.json(users);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // ======= KYC QUEUE =======
  
  // Get KYC queue for admin compliance dashboard
  app.get("/api/admin-panel/kyc/queue", async (req, res) => {
    try {
      const kycQueue = [
        {
          id: 1,
          userId: "4",
          kycLevel: 2,
          status: "pending",
          priority: "high",
          riskFlags: ["high-volume", "new-jurisdiction"],
          adminNotes: "Requires manual review for institutional verification",
          createdAt: "2025-07-12T08:00:00Z",
          user: {
            email: "david@apexventures.com",
            firstName: "David",
            lastName: "Kim"
          }
        },
        {
          id: 2,
          userId: "5",
          kycLevel: 1,
          status: "under_review",
          priority: "normal",
          assignedTo: "compliance@nebulax.com",
          riskFlags: ["incomplete-documents"],
          adminNotes: "Missing proof of address documentation",
          createdAt: "2025-07-11T14:30:00Z",
          user: {
            email: "lisa@digitalsolutions.com",
            firstName: "Lisa",
            lastName: "Thompson"
          }
        },
        {
          id: 3,
          userId: "6",
          kycLevel: 3,
          status: "approved",
          priority: "high",
          assignedTo: "senior@nebulax.com",
          riskFlags: [],
          adminNotes: "Approved for institutional level access",
          createdAt: "2025-07-10T11:15:00Z",
          user: {
            email: "james@quantumhedge.com",
            firstName: "James",
            lastName: "Wilson"
          }
        }
      ];
      res.json(kycQueue);
    } catch (error) {
      console.error("Error fetching KYC queue:", error);
      res.status(500).json({ error: "Failed to fetch KYC queue" });
    }
  });

  // ======= AML ALERTS =======
  
  // Get AML alerts for admin compliance dashboard
  app.get("/api/admin-panel/aml/alerts", async (req, res) => {
    try {
      const amlAlerts = [
        {
          id: 1,
          userId: "7",
          alertType: "Large Transaction",
          severity: "high",
          amount: "150000",
          currency: "USDT",
          flagReason: "Transaction exceeds daily limit threshold",
          status: "open",
          assignedTo: "aml@nebulax.com",
          createdAt: "2025-07-12T09:15:00Z"
        },
        {
          id: 2,
          userId: "8",
          alertType: "Suspicious Pattern",
          severity: "medium",
          amount: "75000",
          currency: "BTC",
          flagReason: "Unusual trading pattern detected",
          status: "investigating",
          assignedTo: "risk@nebulax.com",
          createdAt: "2025-07-11T16:20:00Z"
        },
        {
          id: 3,
          userId: "9",
          alertType: "Sanctions Screening",
          severity: "critical",
          amount: "250000",
          currency: "ETH",
          flagReason: "Potential sanctions list match",
          status: "resolved",
          assignedTo: "compliance@nebulax.com",
          createdAt: "2025-07-10T13:45:00Z"
        }
      ];
      res.json(amlAlerts);
    } catch (error) {
      console.error("Error fetching AML alerts:", error);
      res.status(500).json({ error: "Failed to fetch AML alerts" });
    }
  });

  // ======= SAR REPORTS =======
  
  // Get SAR reports for admin compliance dashboard
  app.get("/api/admin-panel/sar/reports", async (req, res) => {
    try {
      const sarReports = [
        {
          id: 1,
          userId: "10",
          reportType: "SAR",
          reportNumber: "SAR-2025-001",
          status: "submitted",
          suspiciousActivity: "Structuring transactions to avoid reporting thresholds",
          filingDate: "2025-07-08T10:00:00Z",
          regulatoryBody: "FinCEN",
          submittedBy: "compliance@nebulax.com",
          createdAt: "2025-07-05T14:30:00Z"
        },
        {
          id: 2,
          userId: "11",
          reportType: "STR",
          reportNumber: "STR-2025-002",
          status: "draft",
          suspiciousActivity: "Rapid movement of large funds with unclear business purpose",
          regulatoryBody: "FCA",
          submittedBy: "compliance@nebulax.com",
          createdAt: "2025-07-10T11:15:00Z"
        }
      ];
      res.json(sarReports);
    } catch (error) {
      console.error("Error fetching SAR reports:", error);
      res.status(500).json({ error: "Failed to fetch SAR reports" });
    }
  });

  // ======= TREASURY PANEL =======
  
  // Get wallet balances for treasury panel
  app.get("/api/admin-panel/treasury/wallet-balances", async (req, res) => {
    try {
      const walletBalances = [
        {
          id: 1,
          walletType: "hot",
          asset: "BTC",
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          balance: "125.50000000",
          lockedBalance: "8.25000000",
          pendingDeposits: "2.10000000",
          pendingWithdrawals: "5.30000000",
          lastReconciled: "2025-07-12T09:00:00Z",
          updatedAt: "2025-07-12T09:30:00Z"
        },
        {
          id: 2,
          walletType: "cold",
          asset: "ETH",
          address: "0x742d35Cc6634C0532925a3b8D4Ea4Fe5e9A1f9e2",
          balance: "2,450.75000000",
          lockedBalance: "150.00000000",
          pendingDeposits: "25.50000000",
          pendingWithdrawals: "75.25000000",
          lastReconciled: "2025-07-12T08:30:00Z",
          updatedAt: "2025-07-12T09:15:00Z"
        },
        {
          id: 3,
          walletType: "exchange",
          asset: "USDT",
          address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
          balance: "1,250,000.00000000",
          lockedBalance: "85,000.00000000",
          pendingDeposits: "15,000.00000000",
          pendingWithdrawals: "45,000.00000000",
          lastReconciled: "2025-07-12T09:15:00Z",
          updatedAt: "2025-07-12T09:30:00Z"
        }
      ];
      res.json(walletBalances);
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
      res.status(500).json({ error: "Failed to fetch wallet balances" });
    }
  });

  // Get withdrawal requests for treasury panel
  app.get("/api/admin-panel/treasury/withdrawal-requests", async (req, res) => {
    try {
      const withdrawalRequests = [
        {
          id: 1,
          userId: "12",
          asset: "BTC",
          amount: "5.50000000",
          destinationAddress: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kw",
          status: "pending",
          priority: "high",
          riskScore: 75,
          requiresMultiSig: true,
          approvals: [],
          requiredApprovals: 2,
          createdAt: "2025-07-12T08:45:00Z",
          user: {
            email: "whale@institution.com",
            kycLevel: 3
          }
        },
        {
          id: 2,
          userId: "13",
          asset: "ETH",
          amount: "25.75000000",
          destinationAddress: "0x8ba1f109551bD432803012645Hac136c7a1b1E3D",
          status: "approved",
          priority: "normal",
          riskScore: 35,
          requiresMultiSig: false,
          approvals: [
            { approver: "treasury@nebulax.com", approvedAt: "2025-07-12T09:00:00Z" }
          ],
          requiredApprovals: 1,
          createdAt: "2025-07-11T15:30:00Z",
          user: {
            email: "trader@firm.com",
            kycLevel: 2
          }
        }
      ];
      res.json(withdrawalRequests);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      res.status(500).json({ error: "Failed to fetch withdrawal requests" });
    }
  });

  // Get revenue metrics for treasury panel
  app.get("/api/admin-panel/treasury/revenue-metrics", async (req, res) => {
    try {
      const revenueMetrics = [
        {
          id: 1,
          date: "2025-07-12",
          tradingFees: "125000.00",
          withdrawalFees: "8500.00",
          spreadIncome: "45000.00",
          otcRevenue: "75000.00",
          listingFees: "50000.00",
          affiliatePayouts: "12000.00",
          totalRevenue: "291500.00",
          activeUsers: 1250,
          tradingVolume: "15500000.00"
        },
        {
          id: 2,
          date: "2025-07-11",
          tradingFees: "118000.00",
          withdrawalFees: "7200.00",
          spreadIncome: "42000.00",
          otcRevenue: "68000.00",
          listingFees: "0.00",
          affiliatePayouts: "11500.00",
          totalRevenue: "223700.00",
          activeUsers: 1180,
          tradingVolume: "14200000.00"
        }
      ];
      res.json(revenueMetrics);
    } catch (error) {
      console.error("Error fetching revenue metrics:", error);
      res.status(500).json({ error: "Failed to fetch revenue metrics" });
    }
  });

  console.log("[Admin Panel Routes] All admin panel routes registered successfully");
}