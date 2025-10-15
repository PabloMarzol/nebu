import type { Express } from "express";
import { bmsStorage } from "./bms-storage";
import { verifyWalletAuth } from "./middleware/walletAuth";
import {
  insertExecutiveDashboardSchema,
  insertBoardReportSchema,
  insertKycWorkflowSchema,
  insertUserSegmentSchema,
  insertWalletOperationSchema,
  insertTreasuryReportSchema,
  insertTradingPairControlSchema,
  insertRiskMonitoringSchema,
  insertComplianceReportSchema,
  insertAuditLogSchema,
  insertLegalDocumentSchema,
  insertSupportTicketSchema,
  insertTicketMessageSchema,
  insertCustomerProfileSchema,
  insertAffiliateProgramSchema,
  insertAffiliateTrackingSchema,
  insertRevenueReportSchema,
  insertInvoiceSchema,
  insertSecurityIncidentSchema,
  insertSecurityAlertSchema,
  insertCustomDashboardSchema,
  insertSystemAlertSchema,
  insertStaffDirectorySchema,
  insertPerformanceMetricSchema,
} from "@shared/bms-schema";

export function registerBMSRoutes(app: Express) {
  // ========================
  // A. EXECUTIVE MANAGEMENT & DASHBOARD
  // ========================
  
  // Executive Dashboards
  app.post("/api/bms/executive/dashboards", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertExecutiveDashboardSchema.parse(req.body);
      const dashboard = await bmsStorage.createExecutiveDashboard(data);
      res.json(dashboard);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/executive/dashboards", verifyWalletAuth, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const dashboards = await bmsStorage.getExecutiveDashboardsByUser(userId);
      res.json(dashboards);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bms/executive/dashboards/:id", verifyWalletAuth, async (req, res) => {
    try {
      const dashboard = await bmsStorage.getExecutiveDashboard(req.params.id);
      if (!dashboard) {
        return res.status(404).json({ message: "Dashboard not found" });
      }
      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/executive/dashboards/:id", verifyWalletAuth, async (req, res) => {
    try {
      const dashboard = await bmsStorage.updateExecutiveDashboard(req.params.id, req.body);
      res.json(dashboard);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Board Reports
  app.post("/api/bms/executive/board-reports", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertBoardReportSchema.parse(req.body);
      const report = await bmsStorage.createBoardReport(data);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/executive/board-reports", verifyWalletAuth, async (req, res) => {
    try {
      const { period, reportType } = req.query;
      const reports = await bmsStorage.getBoardReports({
        period: period as string,
        reportType: reportType as string,
      });
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Executive KPIs & System Health
  app.get("/api/bms/executive/kpis", verifyWalletAuth, async (req, res) => {
    try {
      const kpis = await bmsStorage.getDashboardKPIs();
      const systemHealth = await bmsStorage.getSystemHealthMetrics();
      const riskSummary = await bmsStorage.getRiskSummary();
      const complianceSummary = await bmsStorage.getComplianceSummary();
      
      res.json({
        kpis,
        systemHealth,
        riskSummary,
        complianceSummary,
        timestamp: new Date(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // B. KYC & USER MANAGEMENT
  // ========================
  
  // KYC Workflows
  app.post("/api/bms/kyc/workflows", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertKycWorkflowSchema.parse(req.body);
      const workflow = await bmsStorage.createKycWorkflow(data);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/kyc/workflows", verifyWalletAuth, async (req, res) => {
    try {
      const { status, reviewer } = req.query;
      let workflows;
      
      if (status) {
        workflows = await bmsStorage.getKycWorkflowsByStatus(status as string);
      } else if (reviewer) {
        workflows = await bmsStorage.getKycWorkflowsByReviewer(reviewer as string);
      } else {
        workflows = await bmsStorage.getKycWorkflowsByStatus("pending");
      }
      
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bms/kyc/workflows/user/:userId", verifyWalletAuth, async (req, res) => {
    try {
      const workflow = await bmsStorage.getKycWorkflowByUser(req.params.userId);
      res.json(workflow);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/kyc/workflows/:id", verifyWalletAuth, async (req, res) => {
    try {
      const workflow = await bmsStorage.updateKycWorkflow(req.params.id, req.body);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User Segmentation
  app.post("/api/bms/users/segments", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertUserSegmentSchema.parse(req.body);
      const segment = await bmsStorage.createUserSegment(data);
      res.json(segment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/users/segments/:userId", verifyWalletAuth, async (req, res) => {
    try {
      const segment = await bmsStorage.getUserSegment(req.params.userId);
      res.json(segment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bms/users/segments", verifyWalletAuth, async (req, res) => {
    try {
      const { type } = req.query;
      const segments = await bmsStorage.getUserSegmentsByType(type as string);
      res.json(segments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // C. WALLET & TREASURY MANAGEMENT
  // ========================
  
  // Wallet Operations
  app.post("/api/bms/wallet/operations", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertWalletOperationSchema.parse(req.body);
      const operation = await bmsStorage.createWalletOperation(data);
      res.json(operation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/wallet/operations", verifyWalletAuth, async (req, res) => {
    try {
      const { walletType, asset, status, dateFrom, dateTo } = req.query;
      const operations = await bmsStorage.getWalletOperations({
        walletType: walletType as string,
        asset: asset as string,
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(operations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/wallet/operations/:id", verifyWalletAuth, async (req, res) => {
    try {
      const operation = await bmsStorage.updateWalletOperation(req.params.id, req.body);
      res.json(operation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Treasury Reports
  app.post("/api/bms/treasury/reports", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertTreasuryReportSchema.parse(req.body);
      const report = await bmsStorage.createTreasuryReport(data);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/treasury/reports", verifyWalletAuth, async (req, res) => {
    try {
      const { dateFrom, dateTo } = req.query;
      const reports = await bmsStorage.getTreasuryReports(
        dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo ? new Date(dateTo as string) : undefined
      );
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bms/treasury/reports/latest", verifyWalletAuth, async (req, res) => {
    try {
      const report = await bmsStorage.getLatestTreasuryReport();
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // D. TRADING OPERATIONS & RISK
  // ========================
  
  // Trading Pair Controls
  app.post("/api/bms/trading/pairs", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertTradingPairControlSchema.parse(req.body);
      const control = await bmsStorage.createTradingPairControl(data);
      res.json(control);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/trading/pairs", verifyWalletAuth, async (req, res) => {
    try {
      const controls = await bmsStorage.getTradingPairControls();
      res.json(controls);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bms/trading/pairs/:symbol", verifyWalletAuth, async (req, res) => {
    try {
      const control = await bmsStorage.getTradingPairControl(req.params.symbol);
      if (!control) {
        return res.status(404).json({ message: "Trading pair not found" });
      }
      res.json(control);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/trading/pairs/:symbol", verifyWalletAuth, async (req, res) => {
    try {
      const control = await bmsStorage.updateTradingPairControl(req.params.symbol, req.body);
      res.json(control);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Risk Monitoring
  app.post("/api/bms/risk/monitoring", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertRiskMonitoringSchema.parse(req.body);
      const risk = await bmsStorage.createRiskMonitoring(data);
      res.json(risk);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/risk/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const { riskLevel } = req.query;
      const alerts = await bmsStorage.getRiskMonitoringAlerts(riskLevel as string);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/risk/monitoring/:id", verifyWalletAuth, async (req, res) => {
    try {
      const risk = await bmsStorage.updateRiskMonitoring(req.params.id, req.body);
      res.json(risk);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ========================
  // E. COMPLIANCE & LEGAL
  // ========================
  
  // Compliance Reports
  app.post("/api/bms/compliance/reports", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertComplianceReportSchema.parse(req.body);
      const report = await bmsStorage.createComplianceReport(data);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/compliance/reports", verifyWalletAuth, async (req, res) => {
    try {
      const { reportType, jurisdiction, status, dateFrom, dateTo } = req.query;
      const reports = await bmsStorage.getComplianceReports({
        reportType: reportType as string,
        jurisdiction: jurisdiction as string,
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/compliance/reports/:id", verifyWalletAuth, async (req, res) => {
    try {
      const report = await bmsStorage.updateComplianceReport(req.params.id, req.body);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Audit Logs
  app.post("/api/bms/audit/logs", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertAuditLogSchema.parse(req.body);
      const log = await bmsStorage.createAuditLog(data);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/audit/logs", verifyWalletAuth, async (req, res) => {
    try {
      const { userId, action, resourceType, department, dateFrom, dateTo } = req.query;
      const logs = await bmsStorage.getAuditLogs({
        userId: userId as string,
        action: action as string,
        resourceType: resourceType as string,
        department: department as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Legal Documents
  app.post("/api/bms/legal/documents", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertLegalDocumentSchema.parse(req.body);
      const document = await bmsStorage.createLegalDocument(data);
      res.json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/legal/documents", verifyWalletAuth, async (req, res) => {
    try {
      const { documentType } = req.query;
      const documents = await bmsStorage.getLegalDocuments(documentType as string);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // F. CRM & SUPPORT MANAGEMENT
  // ========================
  
  // Support Tickets
  app.post("/api/bms/support/tickets", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertSupportTicketSchema.parse(req.body);
      const ticket = await bmsStorage.createSupportTicket(data);
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/support/tickets", verifyWalletAuth, async (req, res) => {
    try {
      const { userId, status, assignedTo, priority, category } = req.query;
      const tickets = await bmsStorage.getSupportTickets({
        userId: userId as string,
        status: status as string,
        assignedTo: assignedTo as string,
        priority: priority as string,
        category: category as string,
      });
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/support/tickets/:id", verifyWalletAuth, async (req, res) => {
    try {
      const ticket = await bmsStorage.updateSupportTicket(req.params.id, req.body);
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Ticket Messages
  app.post("/api/bms/support/tickets/:ticketId/messages", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertTicketMessageSchema.parse({
        ...req.body,
        ticketId: req.params.ticketId,
      });
      const message = await bmsStorage.createTicketMessage(data);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/support/tickets/:ticketId/messages", verifyWalletAuth, async (req, res) => {
    try {
      const messages = await bmsStorage.getTicketMessages(req.params.ticketId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Customer Profiles
  app.post("/api/bms/customers/profiles", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertCustomerProfileSchema.parse(req.body);
      const profile = await bmsStorage.createCustomerProfile(data);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/customers/profiles/:userId", verifyWalletAuth, async (req, res) => {
    try {
      const profile = await bmsStorage.getCustomerProfile(req.params.userId);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bms/customers/by-tier/:tier", verifyWalletAuth, async (req, res) => {
    try {
      const customers = await bmsStorage.getCustomersByTier(req.params.tier);
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // G. AFFILIATE & PARTNERSHIP
  // ========================
  
  // Affiliate Programs
  app.post("/api/bms/affiliate/programs", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertAffiliateProgramSchema.parse(req.body);
      const program = await bmsStorage.createAffiliateProgram(data);
      res.json(program);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/affiliate/programs", verifyWalletAuth, async (req, res) => {
    try {
      const programs = await bmsStorage.getAffiliatePrograms();
      res.json(programs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Affiliate Tracking
  app.post("/api/bms/affiliate/tracking", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertAffiliateTrackingSchema.parse(req.body);
      const tracking = await bmsStorage.createAffiliateTracking(data);
      res.json(tracking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/affiliate/tracking", verifyWalletAuth, async (req, res) => {
    try {
      const { affiliateId, programId, paymentStatus } = req.query;
      const tracking = await bmsStorage.getAffiliateTracking({
        affiliateId: affiliateId as string,
        programId: programId as string,
        paymentStatus: paymentStatus as string,
      });
      res.json(tracking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // H. FINANCIAL MANAGEMENT
  // ========================
  
  // Revenue Reports
  app.post("/api/bms/finance/revenue-reports", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertRevenueReportSchema.parse(req.body);
      const report = await bmsStorage.createRevenueReport(data);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/finance/revenue-reports", verifyWalletAuth, async (req, res) => {
    try {
      const { period } = req.query;
      const reports = await bmsStorage.getRevenueReports(period as string);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Invoices
  app.post("/api/bms/finance/invoices", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertInvoiceSchema.parse(req.body);
      const invoice = await bmsStorage.createInvoice(data);
      res.json(invoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/finance/invoices", verifyWalletAuth, async (req, res) => {
    try {
      const { clientId, status, dateFrom, dateTo } = req.query;
      const invoices = await bmsStorage.getInvoices({
        clientId: clientId as string,
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // I. SECURITY & INCIDENT MANAGEMENT
  // ========================
  
  // Security Incidents
  app.post("/api/bms/security/incidents", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertSecurityIncidentSchema.parse(req.body);
      const incident = await bmsStorage.createSecurityIncident(data);
      res.json(incident);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/security/incidents", verifyWalletAuth, async (req, res) => {
    try {
      const { incidentType, severity, status } = req.query;
      const incidents = await bmsStorage.getSecurityIncidents({
        incidentType: incidentType as string,
        severity: severity as string,
        status: status as string,
      });
      res.json(incidents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/bms/security/incidents/:id", verifyWalletAuth, async (req, res) => {
    try {
      const incident = await bmsStorage.updateSecurityIncident(req.params.id, req.body);
      res.json(incident);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Security Alerts
  app.post("/api/bms/security/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertSecurityAlertSchema.parse(req.body);
      const alert = await bmsStorage.createSecurityAlert(data);
      res.json(alert);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/security/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const { alertType, severity, status } = req.query;
      const alerts = await bmsStorage.getSecurityAlerts({
        alertType: alertType as string,
        severity: severity as string,
        status: status as string,
      });
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // J. ANALYTICS & REPORTING
  // ========================
  
  // Custom Dashboards
  app.post("/api/bms/analytics/dashboards", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertCustomDashboardSchema.parse(req.body);
      const dashboard = await bmsStorage.createCustomDashboard(data);
      res.json(dashboard);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/analytics/dashboards", verifyWalletAuth, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const dashboards = await bmsStorage.getCustomDashboards(userId);
      res.json(dashboards);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // System Alerts
  app.post("/api/bms/system/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertSystemAlertSchema.parse(req.body);
      const alert = await bmsStorage.createSystemAlert(data);
      res.json(alert);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/system/alerts", verifyWalletAuth, async (req, res) => {
    try {
      const { department } = req.query;
      const alerts = await bmsStorage.getSystemAlerts(department as string);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // K. HR & INTERNAL OPERATIONS
  // ========================
  
  // Staff Directory
  app.post("/api/bms/hr/staff", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertStaffDirectorySchema.parse(req.body);
      const staff = await bmsStorage.createStaffMember(data);
      res.json(staff);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/hr/staff/department/:department", verifyWalletAuth, async (req, res) => {
    try {
      const staff = await bmsStorage.getStaffByDepartment(req.params.department);
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Performance Metrics
  app.post("/api/bms/hr/performance", verifyWalletAuth, async (req, res) => {
    try {
      const data = insertPerformanceMetricSchema.parse(req.body);
      const metric = await bmsStorage.createPerformanceMetric(data);
      res.json(metric);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bms/hr/performance/:employeeId", verifyWalletAuth, async (req, res) => {
    try {
      const { period } = req.query;
      const metrics = await bmsStorage.getPerformanceMetrics(req.params.employeeId, period as string);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================
  // BULK OPERATIONS & UTILITIES
  // ========================
  
  // Bulk Data Export
  app.post("/api/bms/export/bulk", verifyWalletAuth, async (req, res) => {
    try {
      const { modules, dateFrom, dateTo, format = "json" } = req.body;
      const exportData: any = {};

      // Export data from requested modules
      if (modules.includes("kyc")) {
        exportData.kyc = await bmsStorage.getKycWorkflowsByStatus("completed");
      }
      if (modules.includes("compliance")) {
        exportData.compliance = await bmsStorage.getComplianceReports({
          dateFrom: dateFrom ? new Date(dateFrom) : undefined,
          dateTo: dateTo ? new Date(dateTo) : undefined,
        });
      }
      if (modules.includes("support")) {
        exportData.support = await bmsStorage.getSupportTickets({});
      }
      if (modules.includes("audit")) {
        exportData.audit = await bmsStorage.getAuditLogs({
          dateFrom: dateFrom ? new Date(dateFrom) : undefined,
          dateTo: dateTo ? new Date(dateTo) : undefined,
        });
      }

      // Return data based on format
      if (format === "csv") {
        // In a real implementation, you'd convert to CSV
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=bms-export.csv");
        res.send("CSV export not implemented yet");
      } else {
        res.json({
          exportTimestamp: new Date(),
          modules,
          dateRange: { from: dateFrom, to: dateTo },
          data: exportData,
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // System Health Check
  app.get("/api/bms/health", async (req, res) => {
    try {
      const health = {
        status: "healthy",
        timestamp: new Date(),
        modules: {
          executive: "operational",
          kyc: "operational",
          treasury: "operational",
          trading: "operational",
          compliance: "operational",
          crm: "operational",
          affiliate: "operational",
          finance: "operational",
          security: "operational",
          analytics: "operational",
          hr: "operational",
        },
        metrics: await bmsStorage.getDashboardKPIs(),
      };
      res.json(health);
    } catch (error: any) {
      res.status(500).json({ 
        status: "unhealthy", 
        error: error.message,
        timestamp: new Date(),
      });
    }
  });
}