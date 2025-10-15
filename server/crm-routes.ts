import type { Express } from "express";
import { crmStorage } from "./crm-storage";
import { verifyWalletAuth } from "./middleware/walletAuth";
import {
  insertCRMCustomerSchema,
  insertCRMCommunicationSchema,
  insertCRMTransactionSchema,
  insertCRMPaymentMethodSchema,
  insertCRMSupportTicketSchema,
  insertCRMCampaignSchema,
  insertCRMComplianceRecordSchema,
  insertCRMReferralSchema,
} from "@shared/crm-schema";

export function registerCRMRoutes(app: Express) {
  // CRM Accounts/Pipeline Management Routes
  app.get("/api/crm/accounts", async (req, res) => {
    try {
      // Sample CRM pipeline data for business development
      const accounts = [
        {
          id: 1,
          accountName: "Quantum Capital Partners",
          accountType: "institutional",
          dealValue: "2500000",
          stage: "demo",
          priority: "high",
          contactInfo: {
            primaryContact: "Sarah Chen",
            email: "s.chen@quantumcap.com",
            phone: "+1-212-555-0123",
            company: "Quantum Capital Partners"
          },
          createdAt: "2024-12-15T10:30:00Z",
          lastContact: "2024-12-28T14:15:00Z"
        },
        {
          id: 2,
          accountName: "Nexus Trading Group",
          accountType: "market_maker",
          dealValue: "5000000",
          stage: "kyc",
          priority: "high",
          contactInfo: {
            primaryContact: "Michael Rodriguez",
            email: "m.rodriguez@nexustrading.com",
            phone: "+1-312-555-0456",
            company: "Nexus Trading Group"
          },
          createdAt: "2024-12-10T09:15:00Z",
          lastContact: "2024-12-29T11:45:00Z"
        },
        {
          id: 3,
          accountName: "Alpine Investment Fund",
          accountType: "vip",
          dealValue: "1200000",
          stage: "funded",
          priority: "medium",
          contactInfo: {
            primaryContact: "David Kim",
            email: "d.kim@alpinefund.com",
            phone: "+1-424-555-0789",
            company: "Alpine Investment Fund"
          },
          createdAt: "2024-12-01T16:20:00Z",
          lastContact: "2024-12-27T13:30:00Z"
        },
        {
          id: 4,
          accountName: "TechFlow Ventures",
          accountType: "otc",
          dealValue: "800000",
          stage: "active",
          priority: "medium",
          contactInfo: {
            primaryContact: "Lisa Wang",
            email: "l.wang@techflow.vc",
            phone: "+1-650-555-0234",
            company: "TechFlow Ventures"
          },
          createdAt: "2024-11-20T12:45:00Z",
          lastContact: "2024-12-30T10:15:00Z"
        },
        {
          id: 5,
          accountName: "Harbor Digital Assets",
          accountType: "partner",
          dealValue: "3200000",
          stage: "new_lead",
          priority: "high",
          contactInfo: {
            primaryContact: "James Thompson",
            email: "j.thompson@harbordigital.com",
            phone: "+1-617-555-0567",
            company: "Harbor Digital Assets"
          },
          createdAt: "2024-12-28T08:00:00Z",
          lastContact: "2024-12-30T15:20:00Z"
        },
        {
          id: 6,
          accountName: "Meridian Crypto Fund",
          accountType: "investor",
          dealValue: "1800000",
          stage: "demo",
          priority: "medium",
          contactInfo: {
            primaryContact: "Emma Davis",
            email: "e.davis@meridiancrypto.com",
            phone: "+1-305-555-0890",
            company: "Meridian Crypto Fund"
          },
          createdAt: "2024-12-20T14:30:00Z",
          lastContact: "2024-12-29T16:45:00Z"
        }
      ];
      
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching CRM accounts:", error);
      res.status(500).json({ message: "Failed to fetch CRM accounts" });
    }
  });

  // Communications log endpoint
  app.get("/api/crm/communications", async (req, res) => {
    try {
      const communications = [
        {
          id: 1,
          accountId: 1,
          type: "email",
          subject: "Demo Scheduling Follow-up",
          date: "2024-12-28T14:15:00Z",
          from: "sales@nebulax.com",
          to: "s.chen@quantumcap.com",
          status: "sent",
          priority: "high"
        },
        {
          id: 2,
          accountId: 2,
          type: "call",
          subject: "KYC Documentation Review",
          date: "2024-12-29T11:45:00Z",
          from: "compliance@nebulax.com", 
          to: "m.rodriguez@nexustrading.com",
          status: "completed",
          priority: "high"
        }
      ];
      res.json(communications);
    } catch (error) {
      console.error("Error fetching communications:", error);
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });

  // Regulatory communications endpoint
  app.get("/api/crm/regulatory", async (req, res) => {
    try {
      const regulatory = [
        {
          id: 1,
          type: "compliance_filing",
          jurisdiction: "US",
          deadline: "2025-01-15T00:00:00Z",
          status: "pending",
          description: "Q4 2024 AML Report Submission"
        },
        {
          id: 2,
          type: "license_renewal",
          jurisdiction: "EU",
          deadline: "2025-02-28T00:00:00Z", 
          status: "in_progress",
          description: "MiFID II License Renewal"
        }
      ];
      res.json(regulatory);
    } catch (error) {
      console.error("Error fetching regulatory communications:", error);
      res.status(500).json({ message: "Failed to fetch regulatory communications" });
    }
  });

  // Contracts tracking endpoint
  app.get("/api/crm/contracts", async (req, res) => {
    try {
      const contracts = [
        {
          id: 1,
          accountId: 3,
          type: "SAFT",
          value: "1200000",
          status: "active",
          signedDate: "2024-12-01T00:00:00Z",
          expiryDate: "2025-12-01T00:00:00Z"
        },
        {
          id: 2,
          accountId: 4,
          type: "OTC_Agreement",
          value: "800000",
          status: "pending_signature",
          signedDate: null,
          expiryDate: "2025-01-30T00:00:00Z"
        }
      ];
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  // Customer Management Routes
  app.get("/api/crm/customers", verifyWalletAuth, async (req, res) => {
    try {
      const { tier, status, customerType, riskMin, riskMax, ltvMin, ltvMax, limit = 50, offset = 0 } = req.query;
      
      const filters: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };
      
      if (tier && tier !== "all") filters.tier = tier as string;
      if (status && status !== "all") filters.status = status as string;
      if (customerType && customerType !== "all") filters.customerType = customerType as string;
      if (riskMin || riskMax) {
        filters.riskScore = {};
        if (riskMin) filters.riskScore.min = parseInt(riskMin as string);
        if (riskMax) filters.riskScore.max = parseInt(riskMax as string);
      }
      if (ltvMin || ltvMax) {
        filters.ltv = {};
        if (ltvMin) filters.ltv.min = parseFloat(ltvMin as string);
        if (ltvMax) filters.ltv.max = parseFloat(ltvMax as string);
      }

      const result = await crmStorage.getCustomers(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/crm/customers/:id", verifyWalletAuth, async (req, res) => {
    try {
      const customer = await crmStorage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/crm/customers", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMCustomerSchema.parse(req.body);
      const customer = await crmStorage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(400).json({ message: "Failed to create customer", error: error.message });
    }
  });

  app.patch("/api/crm/customers/:id", verifyWalletAuth, async (req, res) => {
    try {
      const customer = await crmStorage.updateCustomer(req.params.id, req.body);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  // Communications Routes
  app.get("/api/crm/customers/:customerId/communications", verifyWalletAuth, async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const communications = await crmStorage.getCommunications(
        req.params.customerId,
        parseInt(limit as string)
      );
      res.json(communications);
    } catch (error) {
      console.error("Error fetching communications:", error);
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });

  app.post("/api/crm/communications", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMCommunicationSchema.parse(req.body);
      const communication = await crmStorage.createCommunication(validatedData);
      res.status(201).json(communication);
    } catch (error) {
      console.error("Error creating communication:", error);
      res.status(400).json({ message: "Failed to create communication", error: error.message });
    }
  });

  app.patch("/api/crm/communications/:id/status", verifyWalletAuth, async (req, res) => {
    try {
      const { status, metadata } = req.body;
      const communication = await crmStorage.updateCommunicationStatus(req.params.id, status, metadata);
      res.json(communication);
    } catch (error) {
      console.error("Error updating communication status:", error);
      res.status(500).json({ message: "Failed to update communication status" });
    }
  });

  // Transactions Routes
  app.get("/api/crm/customers/:customerId/transactions", verifyWalletAuth, async (req, res) => {
    try {
      const { type, status, dateFrom, dateTo, limit = 100 } = req.query;
      const filters: any = { limit: parseInt(limit as string) };
      
      if (type) filters.type = type as string;
      if (status) filters.status = status as string;
      if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
      if (dateTo) filters.dateTo = new Date(dateTo as string);

      const transactions = await crmStorage.getTransactions(req.params.customerId, filters);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/crm/transactions", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMTransactionSchema.parse(req.body);
      const transaction = await crmStorage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: "Failed to create transaction", error: error.message });
    }
  });

  app.patch("/api/crm/transactions/:id/status", verifyWalletAuth, async (req, res) => {
    try {
      const { status, metadata } = req.body;
      const transaction = await crmStorage.updateTransactionStatus(req.params.id, status, metadata);
      res.json(transaction);
    } catch (error) {
      console.error("Error updating transaction status:", error);
      res.status(500).json({ message: "Failed to update transaction status" });
    }
  });

  app.get("/api/crm/customers/:customerId/analytics/transactions", verifyWalletAuth, async (req, res) => {
    try {
      const { period = 'month' } = req.query;
      const analytics = await crmStorage.getTransactionAnalytics(
        req.params.customerId,
        period as 'day' | 'week' | 'month'
      );
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching transaction analytics:", error);
      res.status(500).json({ message: "Failed to fetch transaction analytics" });
    }
  });

  // Payment Methods Routes
  app.get("/api/crm/customers/:customerId/payment-methods", verifyWalletAuth, async (req, res) => {
    try {
      const paymentMethods = await crmStorage.getPaymentMethods(req.params.customerId);
      res.json(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  app.post("/api/crm/payment-methods", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMPaymentMethodSchema.parse(req.body);
      const paymentMethod = await crmStorage.addPaymentMethod(validatedData);
      res.status(201).json(paymentMethod);
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(400).json({ message: "Failed to add payment method", error: error.message });
    }
  });

  app.patch("/api/crm/payment-methods/:id/default", verifyWalletAuth, async (req, res) => {
    try {
      const { customerId } = req.body;
      await crmStorage.setDefaultPaymentMethod(customerId, req.params.id);
      res.json({ message: "Default payment method updated" });
    } catch (error) {
      console.error("Error setting default payment method:", error);
      res.status(500).json({ message: "Failed to set default payment method" });
    }
  });

  // Support Tickets Routes
  app.get("/api/crm/support-tickets", verifyWalletAuth, async (req, res) => {
    try {
      const { customerId, status, priority, assignedTo, category, limit = 50 } = req.query;
      const filters: any = { limit: parseInt(limit as string) };
      
      if (customerId) filters.customerId = customerId as string;
      if (status) filters.status = status as string;
      if (priority) filters.priority = priority as string;
      if (assignedTo) filters.assignedTo = assignedTo as string;
      if (category) filters.category = category as string;

      const tickets = await crmStorage.getSupportTickets(filters);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  app.post("/api/crm/support-tickets", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMSupportTicketSchema.parse(req.body);
      const ticket = await crmStorage.createSupportTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(400).json({ message: "Failed to create support ticket", error: error.message });
    }
  });

  app.patch("/api/crm/support-tickets/:id", verifyWalletAuth, async (req, res) => {
    try {
      const ticket = await crmStorage.updateSupportTicket(req.params.id, req.body);
      res.json(ticket);
    } catch (error) {
      console.error("Error updating support ticket:", error);
      res.status(500).json({ message: "Failed to update support ticket" });
    }
  });

  app.patch("/api/crm/support-tickets/:id/assign", verifyWalletAuth, async (req, res) => {
    try {
      const { agentId } = req.body;
      const ticket = await crmStorage.assignTicket(req.params.id, agentId);
      res.json(ticket);
    } catch (error) {
      console.error("Error assigning ticket:", error);
      res.status(500).json({ message: "Failed to assign ticket" });
    }
  });

  app.patch("/api/crm/support-tickets/:id/close", verifyWalletAuth, async (req, res) => {
    try {
      const { resolution, rating } = req.body;
      const ticket = await crmStorage.closeTicket(req.params.id, resolution, rating);
      res.json(ticket);
    } catch (error) {
      console.error("Error closing ticket:", error);
      res.status(500).json({ message: "Failed to close ticket" });
    }
  });

  // Campaigns Routes
  app.get("/api/crm/campaigns", verifyWalletAuth, async (req, res) => {
    try {
      const { type, status } = req.query;
      const filters: any = {};
      if (type) filters.type = type as string;
      if (status) filters.status = status as string;

      const campaigns = await crmStorage.getCampaigns(filters);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/crm/campaigns", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMCampaignSchema.parse(req.body);
      const campaign = await crmStorage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(400).json({ message: "Failed to create campaign", error: error.message });
    }
  });

  app.get("/api/crm/campaigns/:id/metrics", verifyWalletAuth, async (req, res) => {
    try {
      const metrics = await crmStorage.getCampaignMetrics(req.params.id);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching campaign metrics:", error);
      res.status(500).json({ message: "Failed to fetch campaign metrics" });
    }
  });

  // Analytics Routes
  app.get("/api/crm/analytics/dashboard", verifyWalletAuth, async (req, res) => {
    try {
      const metrics = await crmStorage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/crm/analytics/revenue", verifyWalletAuth, async (req, res) => {
    try {
      const { period = 'month' } = req.query;
      const analytics = await crmStorage.getRevenueAnalytics(period as 'day' | 'week' | 'month' | 'year');
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      res.status(500).json({ message: "Failed to fetch revenue analytics" });
    }
  });

  app.get("/api/crm/customers/:customerId/analytics", verifyWalletAuth, async (req, res) => {
    try {
      const { dateFrom, dateTo } = req.query;
      const from = dateFrom ? new Date(dateFrom as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const to = dateTo ? new Date(dateTo as string) : new Date();

      const analytics = await crmStorage.getCustomerAnalytics(req.params.customerId, from, to);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      res.status(500).json({ message: "Failed to fetch customer analytics" });
    }
  });

  // Compliance Routes
  app.get("/api/crm/customers/:customerId/compliance", verifyWalletAuth, async (req, res) => {
    try {
      const records = await crmStorage.getComplianceRecords(req.params.customerId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching compliance records:", error);
      res.status(500).json({ message: "Failed to fetch compliance records" });
    }
  });

  app.post("/api/crm/compliance", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMComplianceRecordSchema.parse(req.body);
      const record = await crmStorage.createComplianceRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating compliance record:", error);
      res.status(400).json({ message: "Failed to create compliance record", error: error.message });
    }
  });

  app.get("/api/crm/compliance/pending", verifyWalletAuth, async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const records = await crmStorage.getPendingCompliance(parseInt(limit as string));
      res.json(records);
    } catch (error) {
      console.error("Error fetching pending compliance:", error);
      res.status(500).json({ message: "Failed to fetch pending compliance" });
    }
  });

  app.patch("/api/crm/compliance/:id/status", verifyWalletAuth, async (req, res) => {
    try {
      const { status, reviewNotes } = req.body;
      const record = await crmStorage.updateComplianceStatus(req.params.id, status, reviewNotes);
      res.json(record);
    } catch (error) {
      console.error("Error updating compliance status:", error);
      res.status(500).json({ message: "Failed to update compliance status" });
    }
  });

  // Referrals Routes
  app.get("/api/crm/customers/:referrerId/referrals", verifyWalletAuth, async (req, res) => {
    try {
      const referrals = await crmStorage.getReferrals(req.params.referrerId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  app.post("/api/crm/referrals", verifyWalletAuth, async (req, res) => {
    try {
      const validatedData = insertCRMReferralSchema.parse(req.body);
      const referral = await crmStorage.createReferral(validatedData);
      res.status(201).json(referral);
    } catch (error) {
      console.error("Error creating referral:", error);
      res.status(400).json({ message: "Failed to create referral", error: error.message });
    }
  });

  app.patch("/api/crm/referrals/:code/complete", verifyWalletAuth, async (req, res) => {
    try {
      const { refereeId } = req.body;
      const referral = await crmStorage.completeReferral(req.params.code, refereeId);
      res.json(referral);
    } catch (error) {
      console.error("Error completing referral:", error);
      res.status(500).json({ message: "Failed to complete referral" });
    }
  });

  app.get("/api/crm/customers/:referrerId/referral-stats", verifyWalletAuth, async (req, res) => {
    try {
      const stats = await crmStorage.getReferralStats(req.params.referrerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  // Bulk Operations
  app.post("/api/crm/bulk/communications", verifyWalletAuth, async (req, res) => {
    try {
      const { customerIds, type, content, subject } = req.body;
      const results = [];

      for (const customerId of customerIds) {
        try {
          const communication = await crmStorage.createCommunication({
            customerId,
            type,
            content,
            subject,
            direction: 'outbound',
            status: 'sent'
          });
          results.push({ customerId, success: true, communicationId: communication.id });
        } catch (error) {
          results.push({ customerId, success: false, error: error.message });
        }
      }

      res.json({ results, total: customerIds.length });
    } catch (error) {
      console.error("Error sending bulk communications:", error);
      res.status(500).json({ message: "Failed to send bulk communications" });
    }
  });

  // Customer Lifecycle Events
  app.post("/api/crm/customers/:customerId/lifecycle-event", verifyWalletAuth, async (req, res) => {
    try {
      const { eventType, data } = req.body;
      const customerId = req.params.customerId;

      // Record the lifecycle event as a communication
      await crmStorage.createCommunication({
        customerId,
        type: 'lifecycle_event',
        content: `Customer lifecycle event: ${eventType}`,
        direction: 'inbound',
        status: 'processed',
        metadata: { eventType, data, timestamp: new Date() }
      });

      // Update customer analytics based on event
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Record activity metrics
      await crmStorage.recordCustomerActivity({
        customerId,
        date: today,
        loginCount: eventType === 'login' ? 1 : 0,
        ordersPlaced: eventType === 'order_placed' ? 1 : 0,
        pagesViewed: eventType === 'page_view' ? 1 : 0,
        engagementScore: Math.floor(Math.random() * 100) // In real implementation, calculate based on actual engagement
      });

      res.json({ message: "Lifecycle event recorded successfully" });
    } catch (error) {
      console.error("Error recording lifecycle event:", error);
      res.status(500).json({ message: "Failed to record lifecycle event" });
    }
  });
}