import type { Express } from "express";
import { createServer, type Server } from "http";
import { enhancedCrmStorage } from "./enhanced-crm-storage";
import { verifyWalletAuth } from "./middleware/walletAuth";

export function registerEnhancedCRMRoutes(app: Express) {
  
  // ======= CUSTOMERS API =======
  
  // Get all customers for CRM dashboard
  app.get("/api/enhanced-crm/customers", async (req, res) => {
    try {
      const customers = [
        {
          id: "1",
          firstName: "Sarah",
          lastName: "Chen",
          email: "sarah@quantumcap.com",
          phone: "+1-555-0123",
          kycLevel: 3,
          totalVolume: 2500000,
          lastActive: "2025-07-12T09:30:00Z",
          status: "active",
          riskScore: 15,
          accountTier: "Premium",
          registrationDate: "2025-01-15T10:00:00Z",
          country: "United States",
          tradingPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
          notes: "High-volume institutional client"
        },
        {
          id: "2",
          firstName: "Michael",
          lastName: "Rodriguez",
          email: "mrodriguez@stellarpartners.com",
          phone: "+1-555-0456",
          kycLevel: 2,
          totalVolume: 850000,
          lastActive: "2025-07-12T08:15:00Z",
          status: "active",
          riskScore: 8,
          accountTier: "Gold",
          registrationDate: "2025-03-20T14:30:00Z",
          country: "Canada",
          tradingPairs: ["BTC/USDT", "ETH/USDT"],
          notes: "Consistent trader, good communication"
        },
        {
          id: "3",
          firstName: "Emma",
          lastName: "Thompson",
          email: "emma@digitalassets.com",
          phone: "+1-555-0789",
          kycLevel: 3,
          totalVolume: 5200000,
          lastActive: "2025-07-12T07:45:00Z",
          status: "active",
          riskScore: 12,
          accountTier: "Premium",
          registrationDate: "2024-11-10T11:15:00Z",
          country: "United Kingdom",
          tradingPairs: ["BTC/USDT", "ETH/USDT", "ADA/USDT", "DOT/USDT"],
          notes: "VIP client, requires priority support"
        }
      ];
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });
  
  // ======= USER 360° PROFILE MANAGEMENT =======
  
  // Get comprehensive user profile
  app.get("/api/enhanced-crm/profile/:customerId", verifyWalletAuth, async (req, res) => {
    try {
      const { customerId } = req.params;
      const profile = await enhancedCrmStorage.getUserProfile(customerId);
      
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Update user profile with 360° data
  app.put("/api/enhanced-crm/profile/:customerId", verifyWalletAuth, async (req, res) => {
    try {
      const { customerId } = req.params;
      const updates = req.body;
      
      const updatedProfile = await enhancedCrmStorage.updateUserProfile(customerId, updates);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Get user risk score and assessment
  app.get("/api/enhanced-crm/profile/:customerId/risk", verifyWalletAuth, async (req, res) => {
    try {
      const { customerId } = req.params;
      const riskAssessment = await enhancedCrmStorage.calculateRiskScore(customerId);
      res.json(riskAssessment);
    } catch (error) {
      console.error("Error calculating risk score:", error);
      res.status(500).json({ error: "Failed to calculate risk score" });
    }
  });

  // ======= KYC/AML COMPLIANCE CENTER =======
  
  // Get KYC cases dashboard
  app.get("/api/enhanced-crm/kyc/cases", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string,
        priority: req.query.priority as string,
        assignedAgent: req.query.assignedAgent as string,
        caseType: req.query.caseType as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const cases = await enhancedCrmStorage.getKycCases(filters);
      res.json(cases);
    } catch (error) {
      console.error("Error fetching KYC cases:", error);
      res.status(500).json({ error: "Failed to fetch KYC cases" });
    }
  });

  // Create new KYC case
  app.post("/api/enhanced-crm/kyc/cases", verifyWalletAuth, async (req, res) => {
    try {
      const caseData = req.body;
      const newCase = await enhancedCrmStorage.createKycCase(caseData);
      res.json(newCase);
    } catch (error) {
      console.error("Error creating KYC case:", error);
      res.status(500).json({ error: "Failed to create KYC case" });
    }
  });

  // Update KYC case status and review
  app.put("/api/enhanced-crm/kyc/cases/:caseId", verifyWalletAuth, async (req, res) => {
    try {
      const { caseId } = req.params;
      const updates = req.body;
      
      const updatedCase = await enhancedCrmStorage.updateKycCase(caseId, updates);
      res.json(updatedCase);
    } catch (error) {
      console.error("Error updating KYC case:", error);
      res.status(500).json({ error: "Failed to update KYC case" });
    }
  });

  // Approve/Reject KYC case
  app.post("/api/enhanced-crm/kyc/cases/:caseId/decision", verifyWalletAuth, async (req, res) => {
    try {
      const { caseId } = req.params;
      const { decision, reason, reviewNotes } = req.body;
      const adminUserId = req.user?.id;
      
      const result = await enhancedCrmStorage.processKycDecision(caseId, decision, reason, reviewNotes, adminUserId);
      res.json(result);
    } catch (error) {
      console.error("Error processing KYC decision:", error);
      res.status(500).json({ error: "Failed to process KYC decision" });
    }
  });

  // ======= AML ALERTS & TRANSACTION MONITORING =======
  
  // Get AML alerts dashboard
  app.get("/api/enhanced-crm/aml/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        alertType: req.query.alertType as string,
        severity: req.query.severity as string,
        status: req.query.status as string,
        assignedAnalyst: req.query.assignedAnalyst as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const alerts = await enhancedCrmStorage.getAmlAlerts(filters);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching AML alerts:", error);
      res.status(500).json({ error: "Failed to fetch AML alerts" });
    }
  });

  // Create AML alert
  app.post("/api/enhanced-crm/aml/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const alertData = req.body;
      const newAlert = await enhancedCrmStorage.createAmlAlert(alertData);
      res.json(newAlert);
    } catch (error) {
      console.error("Error creating AML alert:", error);
      res.status(500).json({ error: "Failed to create AML alert" });
    }
  });

  // Update AML alert investigation
  app.put("/api/enhanced-crm/aml/alerts/:alertId", verifyWalletAuth, async (req, res) => {
    try {
      const { alertId } = req.params;
      const updates = req.body;
      
      const updatedAlert = await enhancedCrmStorage.updateAmlAlert(alertId, updates);
      res.json(updatedAlert);
    } catch (error) {
      console.error("Error updating AML alert:", error);
      res.status(500).json({ error: "Failed to update AML alert" });
    }
  });

  // File SAR (Suspicious Activity Report)
  app.post("/api/enhanced-crm/aml/alerts/:alertId/sar", verifyWalletAuth, async (req, res) => {
    try {
      const { alertId } = req.params;
      const { sarData } = req.body;
      const filedBy = req.user?.id;
      
      const sarResult = await enhancedCrmStorage.fileSAR(alertId, sarData, filedBy);
      res.json(sarResult);
    } catch (error) {
      console.error("Error filing SAR:", error);
      res.status(500).json({ error: "Failed to file SAR" });
    }
  });

  // ======= SUPPORT TICKETING HUB =======
  
  // Get support tickets with advanced filtering
  app.get("/api/enhanced-crm/support/tickets", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        customerId: req.query.customerId as string,
        status: req.query.status as string,
        priority: req.query.priority as string,
        category: req.query.category as string,
        assignedAgent: req.query.assignedAgent as string,
        assignedTeam: req.query.assignedTeam as string,
        source: req.query.source as string,
        slaBreached: req.query.slaBreached === 'true',
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const tickets = await enhancedCrmStorage.getSupportTickets(filters);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  // Create support ticket with auto-routing
  app.post("/api/enhanced-crm/support/tickets", verifyWalletAuth, async (req, res) => {
    try {
      const ticketData = req.body;
      
      // Auto-route ticket based on category and content
      const routedTicket = await enhancedCrmStorage.createSupportTicketWithRouting(ticketData);
      res.json(routedTicket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  // Update ticket assignment and status
  app.put("/api/enhanced-crm/support/tickets/:ticketId", verifyWalletAuth, async (req, res) => {
    try {
      const { ticketId } = req.params;
      const updates = req.body;
      
      const updatedTicket = await enhancedCrmStorage.updateSupportTicket(ticketId, updates);
      res.json(updatedTicket);
    } catch (error) {
      console.error("Error updating support ticket:", error);
      res.status(500).json({ error: "Failed to update support ticket" });
    }
  });

  // Escalate ticket
  app.post("/api/enhanced-crm/support/tickets/:ticketId/escalate", verifyWalletAuth, async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { escalationReason, escalateTo } = req.body;
      const escalatedBy = req.user?.id;
      
      const escalatedTicket = await enhancedCrmStorage.escalateTicket(ticketId, escalationReason, escalateTo, escalatedBy);
      res.json(escalatedTicket);
    } catch (error) {
      console.error("Error escalating ticket:", error);
      res.status(500).json({ error: "Failed to escalate ticket" });
    }
  });

  // Get ticket SLA metrics
  app.get("/api/enhanced-crm/support/sla-metrics", verifyWalletAuth, async (req, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      const metrics = await enhancedCrmStorage.getSLAMetrics(timeframe as string);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching SLA metrics:", error);
      res.status(500).json({ error: "Failed to fetch SLA metrics" });
    }
  });

  // ======= AFFILIATE & REFERRAL MANAGEMENT =======
  
  // Get affiliate dashboard
  app.get("/api/enhanced-crm/affiliates", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        tier: req.query.tier as string,
        status: req.query.status as string,
        performanceThreshold: req.query.performanceThreshold as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const affiliates = await enhancedCrmStorage.getAffiliates(filters);
      res.json(affiliates);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      res.status(500).json({ error: "Failed to fetch affiliates" });
    }
  });

  // Create affiliate account
  app.post("/api/enhanced-crm/affiliates", verifyWalletAuth, async (req, res) => {
    try {
      const affiliateData = req.body;
      const newAffiliate = await enhancedCrmStorage.createAffiliate(affiliateData);
      res.json(newAffiliate);
    } catch (error) {
      console.error("Error creating affiliate:", error);
      res.status(500).json({ error: "Failed to create affiliate" });
    }
  });

  // Process affiliate payout
  app.post("/api/enhanced-crm/affiliates/:affiliateId/payout", verifyWalletAuth, async (req, res) => {
    try {
      const { affiliateId } = req.params;
      const payoutData = req.body;
      const processedBy = req.user?.id;
      
      const payout = await enhancedCrmStorage.processAffiliatePayout(affiliateId, payoutData, processedBy);
      res.json(payout);
    } catch (error) {
      console.error("Error processing affiliate payout:", error);
      res.status(500).json({ error: "Failed to process affiliate payout" });
    }
  });

  // Get affiliate fraud detection alerts
  app.get("/api/enhanced-crm/affiliates/fraud-alerts", verifyWalletAuth, async (req, res) => {
    try {
      const alerts = await enhancedCrmStorage.getAffiliateFraudAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching affiliate fraud alerts:", error);
      res.status(500).json({ error: "Failed to fetch affiliate fraud alerts" });
    }
  });

  // ======= INCIDENT RESPONSE & CASE MANAGEMENT =======
  
  // Get incident dashboard
  app.get("/api/enhanced-crm/incidents", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        incidentType: req.query.incidentType as string,
        severity: req.query.severity as string,
        status: req.query.status as string,
        assignedTeam: req.query.assignedTeam as string,
        assignedAgent: req.query.assignedAgent as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const incidents = await enhancedCrmStorage.getIncidents(filters);
      res.json(incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  // Create incident
  app.post("/api/enhanced-crm/incidents", verifyWalletAuth, async (req, res) => {
    try {
      const incidentData = req.body;
      const reportedBy = req.user?.id;
      
      const newIncident = await enhancedCrmStorage.createIncident({
        ...incidentData,
        reportedBy
      });
      res.json(newIncident);
    } catch (error) {
      console.error("Error creating incident:", error);
      res.status(500).json({ error: "Failed to create incident" });
    }
  });

  // Update incident investigation
  app.put("/api/enhanced-crm/incidents/:incidentId", verifyWalletAuth, async (req, res) => {
    try {
      const { incidentId } = req.params;
      const updates = req.body;
      
      const updatedIncident = await enhancedCrmStorage.updateIncident(incidentId, updates);
      res.json(updatedIncident);
    } catch (error) {
      console.error("Error updating incident:", error);
      res.status(500).json({ error: "Failed to update incident" });
    }
  });

  // ======= AUDIT LOGS & COMPLIANCE TRACKING =======
  
  // Get audit logs
  app.get("/api/enhanced-crm/audit-logs", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        action: req.query.action as string,
        resource: req.query.resource as string,
        adminUserId: req.query.adminUserId as string,
        riskLevel: req.query.riskLevel as string,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
        limit: parseInt(req.query.limit as string) || 100,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const auditLogs = await enhancedCrmStorage.getAuditLogs(filters);
      res.json(auditLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Log admin action
  app.post("/api/enhanced-crm/audit-logs", verifyWalletAuth, async (req, res) => {
    try {
      const logData = {
        ...req.body,
        adminUserId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        sessionId: req.sessionID
      };
      
      const auditLog = await enhancedCrmStorage.logAdminAction(logData);
      res.json(auditLog);
    } catch (error) {
      console.error("Error logging admin action:", error);
      res.status(500).json({ error: "Failed to log admin action" });
    }
  });

  // ======= GDPR/CCPA DATA REQUESTS =======
  
  // Get data requests
  app.get("/api/enhanced-crm/data-requests", verifyWalletAuth, async (req, res) => {
    try {
      const filters = {
        requestType: req.query.requestType as string,
        status: req.query.status as string,
        customerId: req.query.customerId as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0
      };
      
      const requests = await enhancedCrmStorage.getDataRequests(filters);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching data requests:", error);
      res.status(500).json({ error: "Failed to fetch data requests" });
    }
  });

  // Process data request
  app.post("/api/enhanced-crm/data-requests/:requestId/process", verifyWalletAuth, async (req, res) => {
    try {
      const { requestId } = req.params;
      const { action } = req.body; // export, delete, rectify
      const processedBy = req.user?.id;
      
      const result = await enhancedCrmStorage.processDataRequest(requestId, action, processedBy);
      res.json(result);
    } catch (error) {
      console.error("Error processing data request:", error);
      res.status(500).json({ error: "Failed to process data request" });
    }
  });

  // ======= REPORTING & ANALYTICS =======
  
  // Get CRM dashboard metrics
  app.get("/api/enhanced-crm/dashboard-metrics", verifyWalletAuth, async (req, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      const metrics = await enhancedCrmStorage.getDashboardMetrics(timeframe as string);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  // Generate custom report
  app.post("/api/enhanced-crm/reports/generate", verifyWalletAuth, async (req, res) => {
    try {
      const { reportType, parameters, format } = req.body;
      const generatedBy = req.user?.id;
      
      const report = await enhancedCrmStorage.generateCustomReport(reportType, parameters, format, generatedBy);
      res.json(report);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Get scheduled reports
  app.get("/api/enhanced-crm/reports/scheduled", verifyWalletAuth, async (req, res) => {
    try {
      const scheduledReports = await enhancedCrmStorage.getScheduledReports();
      res.json(scheduledReports);
    } catch (error) {
      console.error("Error fetching scheduled reports:", error);
      res.status(500).json({ error: "Failed to fetch scheduled reports" });
    }
  });

  // ======= AUTOMATION RULES =======
  
  // Get automation rules
  app.get("/api/enhanced-crm/automation/rules", verifyWalletAuth, async (req, res) => {
    try {
      const rules = await enhancedCrmStorage.getAutomationRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
      res.status(500).json({ error: "Failed to fetch automation rules" });
    }
  });

  // Create automation rule
  app.post("/api/enhanced-crm/automation/rules", verifyWalletAuth, async (req, res) => {
    try {
      const ruleData = req.body;
      const createdBy = req.user?.id;
      
      const newRule = await enhancedCrmStorage.createAutomationRule({
        ...ruleData,
        createdBy
      });
      res.json(newRule);
    } catch (error) {
      console.error("Error creating automation rule:", error);
      res.status(500).json({ error: "Failed to create automation rule" });
    }
  });

  // Test automation rule
  app.post("/api/enhanced-crm/automation/rules/:ruleId/test", verifyWalletAuth, async (req, res) => {
    try {
      const { ruleId } = req.params;
      const { testData } = req.body;
      
      const testResult = await enhancedCrmStorage.testAutomationRule(ruleId, testData);
      res.json(testResult);
    } catch (error) {
      console.error("Error testing automation rule:", error);
      res.status(500).json({ error: "Failed to test automation rule" });
    }
  });

  console.log("[Enhanced CRM] All advanced CRM routes registered successfully");
}